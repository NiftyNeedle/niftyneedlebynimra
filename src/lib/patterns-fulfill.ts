import { createAdminClient } from "@/lib/supabase/admin";
import { sendPatternEmail } from "@/lib/email";
import type { SupabaseClient } from "@supabase/supabase-js";

export const PATTERN_IMAGE_BUCKET = "pattern-images";
export const PATTERN_PDF_BUCKET = "pattern-files"; // PRIVATE

interface PatternFull {
  id: string;
  title: string;
  price: number;
  is_free: boolean;
  pdf_path: string | null;
}

/** Downloads the PDF from the private bucket and builds an email
 *  attachment plus a short-lived backup download link. */
async function buildPdfDelivery(
  admin: SupabaseClient,
  pdfPath: string | null,
): Promise<{
  attachment?: { filename: string; content: Buffer };
  downloadUrl: string | null;
}> {
  if (!pdfPath) return { downloadUrl: null };

  let attachment: { filename: string; content: Buffer } | undefined;
  const { data: blob } = await admin.storage
    .from(PATTERN_PDF_BUCKET)
    .download(pdfPath);
  if (blob) {
    const buf = Buffer.from(await blob.arrayBuffer());
    const filename = pdfPath.split("/").pop() || "pattern.pdf";
    attachment = { filename, content: buf };
  }

  // Backup link (valid 7 days) in case the attachment is stripped.
  const { data: signed } = await admin.storage
    .from(PATTERN_PDF_BUCKET)
    .createSignedUrl(pdfPath, 60 * 60 * 24 * 7);

  return { attachment, downloadUrl: signed?.signedUrl ?? null };
}

async function loadPattern(
  admin: SupabaseClient,
  id: string,
): Promise<PatternFull | null> {
  const { data } = await admin
    .from("patterns")
    .select("id,title,price,is_free,pdf_path")
    .eq("id", id)
    .maybeSingle();
  return (data as PatternFull) ?? null;
}

/** Emails a FREE pattern to whoever requested it — once per email.
 *  Returns `already: true` if that address already received this pattern. */
export async function deliverFreePattern(
  patternId: string,
  email: string,
): Promise<{ ok: boolean; already?: boolean; error?: string }> {
  const admin = createAdminClient();
  const pattern = await loadPattern(admin, patternId);
  if (!pattern) return { ok: false, error: "Pattern not found." };
  if (!pattern.is_free) return { ok: false, error: "This pattern isn't free." };

  // Claim this (pattern, email) pair first. A duplicate means we've
  // already sent it → don't send again.
  const { error: claimError } = await admin
    .from("pattern_downloads")
    .insert({ pattern_id: patternId, email });
  if (claimError) {
    if (claimError.code === "23505") return { ok: true, already: true };
    return { ok: false, error: claimError.message };
  }

  const { attachment, downloadUrl } = await buildPdfDelivery(
    admin,
    pattern.pdf_path,
  );
  await sendPatternEmail({
    to: email,
    title: pattern.title,
    paid: false,
    attachment,
    downloadUrl,
  });
  return { ok: true };
}

interface OrderPatternItem {
  pattern_id?: string;
  productId?: string;
}

/** Emails every paid pattern in an order and records each sale. Idempotent:
 *  the unique (order_ref, pattern_id) index means a pattern is only ever
 *  emailed once per order, even if the webhook and success page both run. */
export async function fulfillOrderPatterns({
  ref,
  email,
  items,
}: {
  ref: string;
  email: string | null;
  items: OrderPatternItem[];
}): Promise<void> {
  if (!email) return;
  const admin = createAdminClient();

  for (const it of items) {
    const patternId = it.pattern_id ?? it.productId;
    if (!patternId) continue;

    const pattern = await loadPattern(admin, patternId);
    if (!pattern) continue;

    // Claim (order, pattern) first — a duplicate means we've already sent it.
    const { error: claimError } = await admin.from("pattern_sales").insert({
      order_ref: ref,
      pattern_id: patternId,
      pattern_title: pattern.title,
      email,
      amount: pattern.price,
    });
    if (claimError) continue; // 23505 duplicate → already delivered

    const { attachment, downloadUrl } = await buildPdfDelivery(
      admin,
      pattern.pdf_path,
    );
    await sendPatternEmail({
      to: email,
      title: pattern.title,
      paid: true,
      amount: pattern.price,
      attachment,
      downloadUrl,
    });
  }
}

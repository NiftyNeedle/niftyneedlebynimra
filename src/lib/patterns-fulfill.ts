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

/** Emails a FREE pattern to whoever requested it. */
export async function deliverFreePattern(
  patternId: string,
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  const pattern = await loadPattern(admin, patternId);
  if (!pattern) return { ok: false, error: "Pattern not found." };
  if (!pattern.is_free) return { ok: false, error: "This pattern isn't free." };

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

interface CheckoutSessionLike {
  id: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  amount_total?: number | null;
  metadata?: { pattern_id?: string } | null;
}

/** Fulfils a paid pattern purchase: records the sale (once) and emails
 *  the PDF. Idempotent — the unique stripe_session_id prevents a second
 *  email if both the webhook and the success page call this. */
export async function fulfillPatternPurchase(
  session: CheckoutSessionLike,
): Promise<void> {
  const patternId = session.metadata?.pattern_id;
  const email =
    session.customer_details?.email ?? session.customer_email ?? null;
  if (!patternId || !email) return;

  const admin = createAdminClient();
  const pattern = await loadPattern(admin, patternId);
  const amount = (session.amount_total ?? 0) / 100;

  // Claim this session first — if it already exists, we've fulfilled it.
  const { error: claimError } = await admin.from("pattern_sales").insert({
    stripe_session_id: session.id,
    pattern_id: patternId,
    pattern_title: pattern?.title ?? null,
    email,
    amount,
  });
  if (claimError) return; // 23505 duplicate → already delivered

  if (!pattern) return;
  const { attachment, downloadUrl } = await buildPdfDelivery(
    admin,
    pattern.pdf_path,
  );
  await sendPatternEmail({
    to: email,
    title: pattern.title,
    paid: true,
    amount,
    attachment,
    downloadUrl,
  });
}

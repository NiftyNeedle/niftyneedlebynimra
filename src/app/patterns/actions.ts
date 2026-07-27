"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, siteUrl } from "@/lib/stripe";
import { deliverFreePattern } from "@/lib/patterns-fulfill";

export interface FreePatternState {
  ok?: boolean;
  already?: boolean;
  error?: string;
}

export async function requestFreePattern(
  _prev: FreePatternState,
  formData: FormData,
): Promise<FreePatternState> {
  const patternId = String(formData.get("pattern_id") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!patternId) return { error: "Something went wrong — please refresh." };
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const res = await deliverFreePattern(patternId, email);
    if (!res.ok) return { error: res.error ?? "Couldn't send the pattern." };
    return { ok: true, already: res.already };
  } catch {
    return { error: "Couldn't send the pattern. Please try again." };
  }
}

export interface BuyPatternState {
  error?: string;
}

export async function startPatternCheckout(
  _prev: BuyPatternState,
  formData: FormData,
): Promise<BuyPatternState> {
  const patternId = String(formData.get("pattern_id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!patternId) return { error: "Something went wrong — please refresh." };

  const stripe = getStripe();
  if (!stripe) {
    return { error: "Online payment isn't available right now." };
  }

  // Read the price/title on the server — never trust the client.
  const admin = createAdminClient();
  const { data: pattern } = await admin
    .from("patterns")
    .select("id,title,price,is_free,published")
    .eq("id", patternId)
    .maybeSingle();

  if (!pattern || !pattern.published) return { error: "Pattern not available." };
  if (pattern.is_free) return { error: "This pattern is free — request it by email." };

  const amount = Math.round(Number(pattern.price) * 100);
  if (!(amount > 0)) return { error: "Pattern price is invalid." };

  let url: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name: pattern.title,
              description: "Digital crochet pattern (PDF, emailed to you)",
            },
          },
        },
      ],
      // Digital good → no shipping, and we need the buyer's email.
      billing_address_collection: "auto",
      success_url: `${siteUrl()}/patterns/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/patterns/${slug}`,
      metadata: { kind: "pattern", pattern_id: pattern.id },
    });
    url = session.url;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not start payment." };
  }

  if (!url) return { error: "Could not start payment. Please try again." };
  redirect(url);
}

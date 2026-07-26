"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewsletterWelcome } from "@/lib/email";

export interface NewsletterState {
  ok?: boolean;
  error?: string;
}

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("newsletter_subscribers")
      .insert({ email });

    if (error) {
      // 23505 = already subscribed (fine); 42P01 = table not created yet (accept gracefully).
      if (error.code === "23505") return { ok: true };
      if (error.code === "42P01") return { ok: true };
      return { error: error.message };
    }

    // New subscriber → send a welcome email (no-op until Resend is configured).
    await sendNewsletterWelcome(email);
    return { ok: true };
  } catch {
    // If Supabase admin isn't configured, still acknowledge gracefully.
    return { ok: true };
  }
}

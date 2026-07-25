"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  message?: string;
}

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://niftyneedlebynimra.vercel.app"
  );
}

function safeFrom(from: string) {
  return from.startsWith("/account") ? from : "/account";
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = safeFrom(String(formData.get("from") ?? "/account"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(from);
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}`.trim() },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  // If email confirmation is enabled, there's no session yet.
  if (!data.session) {
    return {
      message:
        "Almost there! Check your email to confirm your account, then sign in.",
    };
  }
  redirect("/account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function sendReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: error.message };
  return { message: "If that email exists, a reset link is on its way." };
}

export async function updateName(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  if (!fullName) return { error: "Please enter your name." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });
  if (error) return { error: error.message };
  return { message: "Profile updated." };
}

export async function updateNotificationPrefs(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const prefs = {
    orders: formData.get("orders") === "on",
    shipping: formData.get("shipping") === "on",
    custom: formData.get("custom") === "on",
    marketing: formData.get("marketing") === "on",
  };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ data: { notif_prefs: prefs } });
  if (error) return { error: error.message };
  return { message: "Notification preferences saved." };
}

export async function updatePassword(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { message: "Password updated. You can use it next time you sign in." };
}

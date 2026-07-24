"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, expectedAdminToken, verifyPassword } from "@/lib/admin-auth";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const pw = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  if (!verifyPassword(pw)) {
    return { error: "Incorrect password. Please try again." };
  }

  const token = await expectedAdminToken();
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(from.startsWith("/admin") && from !== "/admin/login" ? from : "/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

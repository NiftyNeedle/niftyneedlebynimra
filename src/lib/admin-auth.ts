/**
 * Admin auth primitives. Kept free of `next/headers` so this module is
 * safe to import from Edge middleware. Cookie reading lives in admin-guard.ts.
 */

export const ADMIN_COOKIE = "nn_admin";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The value stored in the admin cookie — derived from server-only secrets,
 *  so it can't be forged by a client. */
export async function expectedAdminToken(): Promise<string> {
  const material =
    (process.env.ADMIN_PASSWORD ?? "no-password") +
    "::" +
    (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "no-key");
  return sha256Hex(material);
}

export function verifyPassword(pw: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && pw === expected;
}

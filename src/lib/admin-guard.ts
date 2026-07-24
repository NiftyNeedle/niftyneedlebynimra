import { cookies } from "next/headers";
import { ADMIN_COOKIE, expectedAdminToken } from "./admin-auth";

/** True if the current request carries a valid admin cookie. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return token === (await expectedAdminToken());
}

/** Throws if the caller isn't an authenticated admin. Use in server actions. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorized");
  }
}

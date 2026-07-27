"use server";

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

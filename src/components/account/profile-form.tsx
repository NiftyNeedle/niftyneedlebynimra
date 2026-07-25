"use client";

import { useActionState, useEffect } from "react";
import { updateName, updatePassword, type AuthState } from "@/app/auth/actions";
import { useToast } from "@/components/ui/toast";

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

export function ProfileForm({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const toast = useToast();
  const [nameState, nameAction, namePending] = useActionState<AuthState, FormData>(
    updateName,
    {},
  );
  const [pwState, pwAction, pwPending] = useActionState<AuthState, FormData>(
    updatePassword,
    {},
  );

  useEffect(() => {
    if (nameState.message) toast(nameState.message);
    else if (nameState.error) toast(nameState.error, "info");
  }, [nameState, toast]);
  useEffect(() => {
    if (pwState.message) toast(pwState.message);
    else if (pwState.error) toast(pwState.error, "info");
  }, [pwState, toast]);

  return (
    <div className="space-y-8">
      <form
        action={nameAction}
        className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
      >
        <h2 className="mb-5 font-serif text-2xl text-foreground">Profile details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Full name</label>
            <input name="full_name" defaultValue={fullName} className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Email</label>
            <input value={email} disabled className={`${field} opacity-70`} />
            <p className="mt-1 text-xs text-muted">
              Email can&apos;t be changed here.
            </p>
          </div>
        </div>
        <button
          disabled={namePending}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {namePending ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form
        action={pwAction}
        className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
      >
        <h2 className="mb-5 font-serif text-2xl text-foreground">Password</h2>
        <div className="grid max-w-md gap-4">
          <input
            type="password"
            name="password"
            required
            placeholder="New password (min 6 characters)"
            className={field}
          />
        </div>
        <button
          disabled={pwPending}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {pwPending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

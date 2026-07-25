import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AccountNav } from "@/components/account/account-nav";

function initialsFrom(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const fullName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "there";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      <div className="mb-8 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brown to-brown-deep font-serif text-xl font-semibold text-warm-white">
          {initialsFrom(fullName)}
        </span>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Hi, {firstName}
          </h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}

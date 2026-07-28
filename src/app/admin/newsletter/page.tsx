import { createAdminClient } from "@/lib/supabase/admin";
import { EmailLink } from "@/components/ui/email-link";

export const dynamic = "force-dynamic";

interface Subscriber {
  email: string;
  created_at: string;
}

export default async function AdminNewsletterPage() {
  let subs: Subscriber[] = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("newsletter_subscribers")
      .select("email, created_at")
      .order("created_at", { ascending: false });
    subs = (data as Subscriber[]) ?? [];
  } catch {
    subs = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Newsletter
          </h1>
          <p className="text-sm text-muted">
            {subs.length} subscriber{subs.length === 1 ? "" : "s"}
          </p>
        </div>
        {subs.length > 0 && (
          <EmailLink
            bcc={subs.map((s) => s.email).join(",")}
            subject="News from Nifty Needle 🧶"
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-muted"
          >
            Email all (BCC)
          </EmailLink>
        )}
      </div>

      {subs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="font-serif text-2xl text-foreground">No subscribers yet</p>
          <p className="mt-1 text-muted">
            Sign-ups from the homepage newsletter box will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr
                  key={s.email}
                  className="border-b border-border last:border-0 hover:bg-surface-muted/40"
                >
                  <td className="px-5 py-4 font-medium text-foreground">
                    {s.email}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

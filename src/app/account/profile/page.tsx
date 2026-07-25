import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <div className="space-y-8">
      <ProfileForm email={user?.email ?? ""} fullName={fullName} />

      <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6">
        <h2 className="font-serif text-2xl text-foreground">Delete account</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Want your account and data removed? Email{" "}
          <a
            href="mailto:niftyneedlebynimra@gmail.com"
            className="text-accent hover:underline"
          >
            niftyneedlebynimra@gmail.com
          </a>{" "}
          and I&apos;ll take care of it.
        </p>
      </div>
    </div>
  );
}

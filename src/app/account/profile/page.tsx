const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-5 font-serif text-2xl text-foreground">
          Profile details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>First name</label>
            <input defaultValue="Arham" className={field} />
          </div>
          <div>
            <label className={labelCls}>Last name</label>
            <input defaultValue="Ashraf" className={field} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Email</label>
            <input
              defaultValue="Arham.Ashraf@hull-technologies.com"
              className={field}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Phone</label>
            <input placeholder="Add a phone number" className={field} />
          </div>
        </div>
        <button className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Save changes
        </button>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-5 font-serif text-2xl text-foreground">Password</h2>
        <div className="grid max-w-md gap-4">
          <input type="password" placeholder="Current password" className={field} />
          <input type="password" placeholder="New password" className={field} />
          <input type="password" placeholder="Confirm new password" className={field} />
        </div>
        <button className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
          Update password
        </button>
      </div>

      <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6">
        <h2 className="font-serif text-2xl text-foreground">Delete account</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="mt-4 rounded-full border border-accent px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white">
          Delete my account
        </button>
      </div>
    </div>
  );
}

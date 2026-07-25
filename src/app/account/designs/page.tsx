import { Sparkles } from "lucide-react";
import { getMyCustomOrders } from "@/lib/account";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DesignsPage() {
  const requests = await getMyCustomOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">
          My custom requests
        </h2>
        <ButtonLink href="/custom" size="sm">
          <Sparkles className="h-4 w-4" />
          New custom order
        </ButtonLink>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-16 text-center">
          <span className="text-5xl">✨</span>
          <p className="mt-3 font-serif text-2xl text-foreground">
            No custom requests yet
          </p>
          <p className="mt-1 text-muted">
            Dreamed up something special? Start a custom order.
          </p>
          <ButtonLink href="/custom" className="mt-5">
            Create your own
          </ButtonLink>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg text-foreground">
                    {r.title || r.product_type || "Custom request"}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-primary">
                  {r.status}
                </span>
              </div>
              {r.description && (
                <p className="mt-3 line-clamp-3 text-sm text-muted">
                  {r.description}
                </p>
              )}
              {r.reference_images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.reference_images.slice(0, 4).map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

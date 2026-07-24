"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { submitCustomOrder, type CustomOrderState } from "@/app/custom/actions";
import { cn } from "@/lib/utils";

const steps = ["Your Idea", "Details", "About You", "Review"];

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

interface Preview {
  url: string;
  name: string;
}

export function CustomOrderForm() {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [state, formAction, pending] = useActionState<CustomOrderState, FormData>(
    submitCustomOrder,
    {},
  );
  const [done, setDone] = useState(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  useEffect(() => {
    if (state.ok) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (state.error) {
      toast(state.error, "info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Build previews whenever the chosen files change.
  const onFilesChange = () => {
    const files = Array.from(fileRef.current?.files ?? []).slice(0, 10);
    setPreviews((old) => {
      old.forEach((p) => URL.revokeObjectURL(p.url));
      return files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    });
  };

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) {
    return (
      <div className="section-px mx-auto flex max-w-2xl flex-col items-center gap-5 py-24 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-sage-deep text-white"
        >
          <Check className="h-12 w-12" />
        </motion.span>
        <h2 className="font-serif text-4xl font-semibold text-foreground">
          Request received!
        </h2>
        <p className="max-w-md text-muted">
          Thank you — I&apos;ve saved your request and will review your idea and
          reply with a quote within 1–2 business days.
        </p>
        <ButtonLink href="/shop" size="lg" className="mt-2">
          Explore the shop while you wait
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="section-px mx-auto max-w-3xl py-12">
      {/* Stepper */}
      <ol className="mb-10 flex items-center justify-between">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-colors ${
                  i < step
                    ? "bg-sage-deep text-white"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-muted text-muted"
                }`}
              >
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </span>
              <span
                className={`hidden text-xs sm:block ${
                  i === step ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded-full ${
                  i < step ? "bg-sage-deep" : "bg-border"
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      <form
        action={formAction}
        className="overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8"
      >
        {/* Step 1 — Your Idea */}
        <div className={cn("space-y-5", step === 0 ? "block" : "hidden")}>
          <div>
            <label className={labelCls}>What would you like made?</label>
            <input
              name="title"
              placeholder="e.g. A crochet portrait of my cat"
              className={field}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Product type</label>
              <select name="product_type" className={field} defaultValue="Bouquet / Flowers">
                <option>Bouquet / Flowers</option>
                <option>Plushie / Amigurumi</option>
                <option>Home décor</option>
                <option>Wearable / Accessory</option>
                <option>Keychain</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Occasion</label>
              <select name="occasion" className={field} defaultValue="Birthday">
                <option>Birthday</option>
                <option>Wedding / Anniversary</option>
                <option>New baby</option>
                <option>Holiday</option>
                <option>Just because</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Theme / description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe your vision in as much detail as you like…"
              className={field}
            />
          </div>
        </div>

        {/* Step 2 — Details */}
        <div className={cn("space-y-5", step === 1 ? "block" : "hidden")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Preferred colours</label>
              <input name="colors" placeholder="e.g. Sage, blush, cream" className={field} />
            </div>
            <div>
              <label className={labelCls}>Size</label>
              <input name="size" placeholder="e.g. ~20cm tall" className={field} />
            </div>
            <div>
              <label className={labelCls}>Budget</label>
              <select name="budget" className={field} defaultValue="$50 – $100">
                <option>Under $50</option>
                <option>$50 – $100</option>
                <option>$100 – $200</option>
                <option>$200+</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Deadline</label>
              <input name="deadline" type="date" className={field} />
            </div>
            <div>
              <label className={labelCls}>Quantity</label>
              <input name="quantity" type="number" min={1} defaultValue={1} className={field} />
            </div>
            <div>
              <label className={labelCls}>Gift wrapping?</label>
              <select name="gift_wrapping" className={field} defaultValue="Yes, please">
                <option>Yes, please</option>
                <option>No, thanks</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Reference images</label>
            <input
              ref={fileRef}
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={onFilesChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brown/40 bg-surface-muted/40 px-4 py-8 text-sm text-muted transition-colors hover:border-brown hover:text-foreground"
            >
              <Upload className="h-5 w-5" />
              {previews.length
                ? `${previews.length} image${previews.length > 1 ? "s" : ""} selected — add more`
                : "Click to upload images (up to 10)"}
            </button>
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {previews.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={p.url}
                    alt={p.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Pinterest link</label>
              <input name="pinterest" placeholder="https://pinterest.com/…" className={field} />
            </div>
            <div>
              <label className={labelCls}>Instagram link</label>
              <input name="instagram" placeholder="https://instagram.com/…" className={field} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Special instructions</label>
            <textarea
              name="special_instructions"
              rows={3}
              placeholder="Anything else I should know?"
              className={field}
            />
          </div>
        </div>

        {/* Step 3 — About You */}
        <div className={cn("space-y-5", step === 2 ? "block" : "hidden")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Full name</label>
              <input name="name" placeholder="Your name" className={field} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input name="email" type="email" placeholder="you@example.com" className={field} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input name="phone" placeholder="Phone number" className={field} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input name="country" placeholder="Country" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Shipping address</label>
              <input name="address" placeholder="Street, city, postal code" className={field} />
            </div>
            <div>
              <label className={labelCls}>Preferred contact method</label>
              <select name="preferred_contact" className={field} defaultValue="Email">
                <option>Email</option>
                <option>WhatsApp</option>
                <option>Instagram DM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 4 — Review */}
        <div className={cn("space-y-4 text-sm", step === 3 ? "block" : "hidden")}>
          <h3 className="font-serif text-2xl text-foreground">Almost done!</h3>
          <p className="text-muted">
            Submit your request and I&apos;ll email you a confirmation, then
            follow up with a quote within 1–2 business days. There&apos;s no
            obligation until you approve the quote.
          </p>
          <ul className="space-y-2 rounded-2xl bg-surface-muted/50 p-5 text-muted">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage-deep" /> Free design consultation
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage-deep" /> Progress photos during
              production
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-sage-deep" /> Shipping with tracking
            </li>
          </ul>
          <label className="flex items-start gap-2 text-muted">
            <input
              required={step === 3}
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
            />
            I agree to be contacted about my custom request.
          </label>
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors enabled:hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
            >
              {pending ? "Submitting…" : "Submit request"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

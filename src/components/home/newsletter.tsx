"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // TODO: wire to Resend / Supabase newsletter table
    setSubmitted(true);
  }

  return (
    <section className="section-px mx-auto max-w-[90rem] pb-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sage/25 via-cream to-pink/25 px-6 py-16 text-center md:px-16 md:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pink/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-sage/30 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance font-serif text-4xl font-semibold text-foreground md:text-5xl">
            Join the Nifty Needle circle
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-balance text-muted">
            Be first to see new collections, behind-the-scenes stitches, and
            subscriber-only discounts. No spam — just handmade joy.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-sage-deep px-6 py-4 text-warm-white"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                  <Check className="h-4 w-4" />
                </span>
                You&apos;re in! Check your inbox for a warm welcome.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  className="flex-1 rounded-full border border-border bg-surface/80 px-6 py-4 text-sm text-foreground outline-none backdrop-blur transition-shadow placeholder:text-muted focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                >
                  Subscribe
                  <Send className="h-4 w-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-4 text-xs text-muted">
            By subscribing you agree to our privacy policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

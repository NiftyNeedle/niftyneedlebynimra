"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function ContactForm() {
  const toast = useToast();
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
        toast("Message sent — we'll reply within 24 hours!");
      }}
      className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Your name" className={field} />
        <input required type="email" placeholder="Email" className={field} />
      </div>
      <input placeholder="Subject" className={field} />
      <textarea
        required
        rows={5}
        placeholder="How can we help?"
        className={field}
      />
      <button
        type="submit"
        disabled={sent}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
      >
        {sent ? "Message sent" : "Send message"}
        {!sent && <Send className="h-4 w-4" />}
      </button>
    </form>
  );
}

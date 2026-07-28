"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Phones/tablets have a real mail app → mailto is best.
 *  Desktops usually don't → fall back to Gmail's web compose. */
function isMobileDevice() {
  if (typeof navigator === "undefined") return true; // SSR default → mailto
  return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(
    navigator.userAgent,
  );
}

export function EmailLink({
  to,
  bcc,
  subject,
  className,
  children,
}: {
  to?: string;
  bcc?: string;
  subject?: string;
  className?: string;
  children: ReactNode;
}) {
  // mailto: (mobile)
  const mailParams: string[] = [];
  if (subject) mailParams.push(`subject=${encodeURIComponent(subject)}`);
  if (bcc) mailParams.push(`bcc=${encodeURIComponent(bcc)}`);
  const mailto = `mailto:${to ? encodeURIComponent(to) : ""}${
    mailParams.length ? "?" + mailParams.join("&") : ""
  }`;

  // Gmail web compose (desktop)
  const gmailParams = ["view=cm", "fs=1"];
  if (to) gmailParams.push(`to=${encodeURIComponent(to)}`);
  if (bcc) gmailParams.push(`bcc=${encodeURIComponent(bcc)}`);
  if (subject) gmailParams.push(`su=${encodeURIComponent(subject)}`);
  const gmail = `https://mail.google.com/mail/?${gmailParams.join("&")}`;

  // Render mailto first (safe for SSR / no-JS); upgrade to Gmail on desktop.
  const [href, setHref] = useState(mailto);
  const [external, setExternal] = useState(false);

  useEffect(() => {
    if (!isMobileDevice()) {
      setHref(gmail);
      setExternal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={className}
    >
      {children}
    </a>
  );
}

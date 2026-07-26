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
  subject,
  className,
  children,
}: {
  to: string;
  subject?: string;
  className?: string;
  children: ReactNode;
}) {
  const mailto = `mailto:${to}${
    subject ? `?subject=${encodeURIComponent(subject)}` : ""
  }`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    to,
  )}${subject ? `&su=${encodeURIComponent(subject)}` : ""}`;

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

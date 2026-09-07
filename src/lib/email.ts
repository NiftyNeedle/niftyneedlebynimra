import { Resend } from "resend";

/**
 * Email notifications via Resend. No-ops gracefully when RESEND_API_KEY
 * isn't set, so the app never breaks if email isn't configured yet.
 *
 * Env:
 *   RESEND_API_KEY  — from resend.com
 *   EMAIL_FROM      — e.g. "Nifty Needle <orders@yourdomain.com>"
 *                     (defaults to Resend's shared onboarding sender)
 *   NOTIFY_EMAIL    — where owner alerts go (defaults to Nimra's inbox)
 */

const key = process.env.RESEND_API_KEY;
const resend = key ? new Resend(key) : null;

const FROM = process.env.EMAIL_FROM || "Nifty Needle <onboarding@resend.dev>";
const OWNER = process.env.NOTIFY_EMAIL || "niftyneedlebynimra@gmail.com";
const money = (n: number) => `€${Number(n).toFixed(2)}`;

async function send(to: string, subject: string, html: string) {
  if (!resend || !to) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (e) {
    console.error("[email] send failed:", e);
  }
}

function shell(title: string, body: string) {
  return `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#14243d">
    <h1 style="font-family:Georgia,serif;color:#00356b">${title}</h1>
    ${body}
    <p style="margin-top:32px;color:#5f7085;font-size:13px">Nifty Needle — handmade crochet, made with love.</p>
  </div>`;
}

interface OrderEmail {
  orderNumber: string;
  name: string;
  email: string;
  total: number;
  items: { name: string; quantity: number }[];
}

export async function notifyNewOrder(o: OrderEmail) {
  const lines = o.items
    .map((i) => `<li>${i.name} × ${i.quantity}</li>`)
    .join("");

  // Customer confirmation
  await send(
    o.email,
    `Your Nifty Needle order ${o.orderNumber}`,
    shell("Thank you for your order! 🧶", `
      <p>Hi ${o.name || "there"}, I've received your order and will begin handcrafting it right away.</p>
      <p><strong>Order ${o.orderNumber}</strong> — total ${money(o.total)}</p>
      <ul>${lines}</ul>
      <p>You can track its progress anytime with your order number.</p>`),
  );

  // Owner alert
  await send(
    OWNER,
    `New order ${o.orderNumber} — ${money(o.total)}`,
    shell("New order received", `
      <p><strong>${o.orderNumber}</strong> from ${o.name || "a customer"} (${o.email})</p>
      <p>Total: ${money(o.total)}</p>
      <ul>${lines}</ul>`),
  );
}

export async function sendNewsletterWelcome(to: string) {
  await send(
    to,
    "Welcome to the Nifty Needle circle 🧶",
    shell("Welcome! 🧶", `
      <p>Thank you for subscribing to Nifty Needle.</p>
      <p>You'll be first to hear about new handmade collections, behind-the-scenes
      stitches, and subscriber-only treats. No spam — just handmade joy.</p>
      <p>With love,<br/>Nimra</p>`),
  );
}

interface CustomEmail {
  name: string;
  email: string;
  title?: string | null;
  productType?: string | null;
  description?: string | null;
}

interface PatternEmail {
  to: string;
  title: string;
  paid: boolean;
  amount?: number;
  attachment?: { filename: string; content: Buffer };
  downloadUrl?: string | null;
}

/** Sends the pattern PDF to a customer (attached + optional backup link). */
export async function sendPatternEmail(p: PatternEmail) {
  if (!resend || !p.to) return;

  const linkBlock = p.downloadUrl
    ? `<p>If the attachment doesn't open, you can also
        <a href="${p.downloadUrl}" style="color:#00356b">download your pattern here</a>
        (link valid for 7 days).</p>`
    : "";

  const html = shell("Your crochet pattern is here! 🧶", `
    <p>Thank you${p.paid ? " for your purchase" : ""}! Your pattern
    <strong>${p.title}</strong> is attached to this email as a PDF.</p>
    ${linkBlock}
    <p>Happy crocheting — I'd love to see what you make. Tag
    <strong>@_niftyneedle_</strong> on Instagram!</p>
    <p>With love,<br/>Nimra</p>`);

  try {
    await resend.emails.send({
      from: FROM,
      to: p.to,
      subject: `Your Nifty Needle pattern: ${p.title}`,
      html,
      ...(p.attachment
        ? { attachments: [{ filename: p.attachment.filename, content: p.attachment.content }] }
        : {}),
    });
  } catch (e) {
    console.error("[email] pattern send failed:", e);
  }

  // Owner alert (paid sales only — free downloads would be noisy).
  if (p.paid) {
    await send(
      OWNER,
      `Pattern sold: ${p.title} — ${money(p.amount ?? 0)}`,
      shell("Pattern sale 🎉", `
        <p><strong>${p.title}</strong> was purchased by ${p.to}.</p>
        <p>Amount: ${money(p.amount ?? 0)}</p>`),
    );
  }
}

export async function notifyNewCustomOrder(c: CustomEmail) {
  // Customer confirmation
  await send(
    c.email,
    "I've received your custom request 🧶",
    shell("Custom request received!", `
      <p>Hi ${c.name || "there"}, thank you for your custom crochet request. I'll review it and reply with a quote within 1–2 business days.</p>
      <p><em>${c.title || c.productType || "Your idea"}</em></p>`),
  );

  // Owner alert
  await send(
    OWNER,
    `New custom request from ${c.name || "a customer"}`,
    shell("New custom request", `
      <p><strong>${c.name || "Customer"}</strong> (${c.email})</p>
      <p>${c.title || c.productType || ""}</p>
      <p>${c.description || ""}</p>`),
  );
}

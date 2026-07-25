import { getStripe } from "@/lib/stripe";
import { finalizeOrderById } from "@/lib/orders-finalize";

// Stripe sends payment confirmations here (configure in the Stripe dashboard).
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new Response("Stripe webhook not configured", { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return new Response(
      `Webhook signature verification failed: ${
        err instanceof Error ? err.message : "unknown"
      }`,
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { order_id?: string } };
    await finalizeOrderById(session.metadata?.order_id);
  }

  return new Response("ok", { status: 200 });
}

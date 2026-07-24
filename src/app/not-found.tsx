import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="section-px mx-auto flex max-w-[90rem] flex-col items-center justify-center gap-6 py-32 text-center">
      <div className="relative">
        <span className="font-serif text-[8rem] font-semibold leading-none text-gradient">
          404
        </span>
        <span className="absolute -right-6 top-0 animate-[float_6s_ease-in-out_infinite] text-5xl">
          🧶
        </span>
      </div>
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        This stitch dropped
      </h1>
      <p className="max-w-md text-muted">
        The page you&apos;re looking for has unravelled. Let&apos;s get you back
        to something beautiful.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Browse the shop
        </ButtonLink>
      </div>
      <Link href="/contact" className="text-sm text-accent hover:underline">
        Need help? Contact us
      </Link>
    </div>
  );
}

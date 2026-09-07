import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getReviewsForProduct } from "@/lib/reviews";
import { ProductDetail } from "@/components/product/product-detail";

// Re-check the database at most once a minute; render new products on demand.
export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const reviews = await getReviewsForProduct(product.id);
  const related = await getRelatedProducts(product);

  return (
    <>
      <nav className="section-px mx-auto flex max-w-[90rem] items-center gap-1.5 py-6 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>
      {/* Keyed per product so selections/quantity reset when navigating
          straight from one product page to another (e.g. via "You may
          also love"), instead of carrying the previous product's answers. */}
      <ProductDetail
        key={product.id}
        product={product}
        reviews={reviews}
        related={related}
      />
    </>
  );
}

import type { MetadataRoute } from "next";
import { products } from "@/lib/data";
import { getPosts } from "@/lib/blog";
import { getPatterns } from "@/lib/patterns";

const baseUrl = "https://niftyneedlebynimra.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/patterns",
    "/custom",
    "/about",
    "/contact",
    "/blog",
    "/faqs",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/track",
    "/wishlist",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = (await getPosts()).map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const patternRoutes = (await getPatterns()).map((p) => ({
    url: `${baseUrl}/patterns/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...patternRoutes];
}

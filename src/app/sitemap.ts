import type { MetadataRoute } from "next";
import { products } from "@/lib/data";
import { blogPosts } from "@/lib/blog";

const baseUrl = "https://niftyneedle.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
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

  const blogRoutes = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}

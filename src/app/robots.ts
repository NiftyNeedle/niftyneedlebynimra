import type { MetadataRoute } from "next";

const baseUrl = "https://niftyneedle.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/checkout", "/cart"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/demo-insights"],
    },
    sitemap: "https://mybloomboard.app/sitemap.xml",
  };
}

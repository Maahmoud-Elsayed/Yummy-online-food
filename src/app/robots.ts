import { getBaseUrl } from "@/lib/utils";
import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/dashboard",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

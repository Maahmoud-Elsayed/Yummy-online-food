import { getBaseUrl } from "@/lib/utils";
import { db } from "@/server/db";
import { type MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({
    select: { id: true, updatedAt: true },
  });

  const baseUrl = getBaseUrl();

  const productsEntries: MetadataRoute.Sitemap = products.map(
    ({ id, updatedAt }) => ({
      url: `${baseUrl}/products/${id}`,
      lastModified: updatedAt,
      alternates: {
        languages: {
          en: `${baseUrl}/en/products/${id}`,
          ar: `${baseUrl}/ar/products/${id}`,
        },
      },
    }),
  );

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ar: `${baseUrl}/ar`,
        },
      },
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en/login`,
          ar: `${baseUrl}/ar/login`,
        },
      },
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en/register`,
          ar: `${baseUrl}/ar/register`,
        },
      },
    },
    {
      url: `${baseUrl}/reset-password`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en/reset-password`,
          ar: `${baseUrl}/ar/reset-password`,
        },
      },
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en/products`,
          ar: `${baseUrl}/ar/products`,
        },
      },
    },
    ...productsEntries,
    {
      url: `${baseUrl}/my-account`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en/my-account`,
          ar: `${baseUrl}/ar/my-account`,
        },
      },
    },
    {
      url: `${baseUrl}/my-account/orders`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${baseUrl}/en/my-account/orders`,
          ar: `${baseUrl}/ar/my-account/orders`,
        },
      },
    },
  ];
}

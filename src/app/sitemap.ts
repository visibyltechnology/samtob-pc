import { MetadataRoute } from "next";
import { database } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.samtobpc.com";
  const staticRoutes = ["", "/products", "/faq", "/delivery", "/stores", "/cart"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
  const products = await database.getProducts();
  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...productRoutes];
}

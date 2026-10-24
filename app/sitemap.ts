import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { tips } from "@/content/tips";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/free-fridge-sheet",
    "/shop",
    "/tips",
    "/about",
    "/contact",
    "/medical-disclaimer",
    "/privacy",
    "/terms",
    "/refund-policy",
    ...products.map((product) => `/shop/${product.slug}`),
    ...tips.map((tip) => `/tips/${tip.slug}`),
  ];
  return routes.map((path) => ({ url: absoluteUrl(path) }));
}

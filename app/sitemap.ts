import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return site.nav.map((item) => ({
    url: `${site.url}${item.href}`,
    lastModified: new Date(),
    changeFrequency: item.href === "/pecas" ? "daily" : "monthly",
    priority: item.href === "/" ? 1 : item.href === "/pecas" ? 0.9 : 0.6,
  }));
}

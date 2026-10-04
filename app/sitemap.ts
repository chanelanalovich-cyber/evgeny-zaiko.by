import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  // Фиксированная дата последнего изменения контента — осознанно, не new Date():
  // «всегда сегодня» в lastmod обесценивает сигнал для поисковых систем.
  // Обновлять при реальных изменениях страниц.
  const lastmod = new Date("2026-10-04");

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: lastmod,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/uslugi`,
      lastModified: lastmod,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...services.map((s) => ({
      url: `${SITE_URL}/uslugi/${s.slug}`,
      lastModified: lastmod,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}

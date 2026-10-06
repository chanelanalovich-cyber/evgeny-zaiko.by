import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { services } from "@/lib/services";
import { posts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  // Фиксированная дата последнего изменения контента — осознанно, не new Date():
  // «всегда сегодня» в lastmod обесценивает сигнал для поисковых систем.
  // Обновлять при реальных изменениях страниц.
  const lastmod = new Date("2026-10-05");

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
    // Страницы доверия/навигации (Фаза 3: C2/C4/C5/C6)
    {
      url: `${SITE_URL}/ceny`,
      lastModified: lastmod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cases`,
      lastModified: lastmod,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: lastmod,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacts`,
      lastModified: lastmod,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Блог: список + статьи (кластер E, НЧ-трафик)
    {
      url: `${SITE_URL}/blog`,
      lastModified: lastmod,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // /privacy — noindex, в sitemap не включается
  ];
}

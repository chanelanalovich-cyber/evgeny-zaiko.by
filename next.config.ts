import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Канонический домен — evgeny-zaiko.by (см. lib/site.ts).
  // Если eugene.zaiko.by снова привяжут к этому деплою, редирект ниже
  // отдаст роботам однозначный 308 на канонический хост.
  // Сейчас eugene.zaiko.by отдаёт 404 от Vercel (деплой отвязан),
  // поэтому редирект не срабатывает — вреда от него нет.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "eugene.zaiko.by" }],
        destination: "https://evgeny-zaiko.by/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.evgeny-zaiko.by" }],
        destination: "https://evgeny-zaiko.by/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

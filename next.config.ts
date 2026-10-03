import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Единый канонический хост: www.eugene.zaiko.by → eugene.zaiko.by (308).
  // Wildcard-сертификат *.zaiko.by не покрывает www.eugene (второй уровень
  // поддомена), поэтому HTTPS для www рвётся — гарантируем редирект на уровне
  // приложения, независимо от DNS-настройки хостинга.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.eugene.zaiko.by" }],
        destination: "https://eugene.zaiko.by/:path*",
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

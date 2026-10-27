import { ImageResponse } from "next/og";
import { getService } from "@/lib/services";
import { SITE_HOST } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

/** OG-картинка для каждой страницы услуги /uslugi/[slug] — брендированный шаблон + данные услуги */
export default async function Image({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  const title = service ? service.metaTitle : "Евгений Зайко — разработка и SEO";
  const subtitle = service ? service.priceLabel : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #16160f 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            width: 96,
            height: 6,
            background: "#c8ff00",
            marginBottom: 40,
            display: "flex",
          }}
        />
        <div
          style={{
            color: "#fff",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            display: "flex",
            maxWidth: 1020,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              color: "#c8ff00",
              fontSize: 30,
              fontWeight: 600,
              marginTop: 28,
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        ) : null}
        <div
          style={{
            color: "#9ca3af",
            fontSize: 24,
            marginTop: 24,
            display: "flex",
          }}
        >
          Евгений Зайко · разработка и SEO
        </div>
        <div
          style={{
            color: "#6b7280",
            fontSize: 22,
            marginTop: 16,
            display: "flex",
          }}
        >
          {SITE_HOST}
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";
import { SITE_HOST } from "@/lib/site";
import { posts, getPost } from "@/lib/blog";

export const alt = "Евгений Зайко — статья в блоге";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Динамическая OG-картинка для каждой статьи блога:
 * название статьи + рубрика, в фирменном тёмном стиле.
 * Сervices у нас уже так умеют (/uslugi/[slug]) — блог подтягиваем к тому же уровню.
 */
export default function Image({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug) ?? posts[0];

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
            marginBottom: 32,
            display: "flex",
          }}
        />
        <div
          style={{
            color: "#c8ff00",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 20,
            display: "flex",
          }}
        >
          {post.tag} · Блог
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 58,
            fontWeight: 700,
            lineHeight: 1.15,
            display: "flex",
            maxWidth: 1040,
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            color: "#6b7280",
            fontSize: 24,
            marginTop: 28,
            display: "flex",
          }}
        >
          Евгений Зайко · разработка и SEO · {SITE_HOST}
        </div>
      </div>
    ),
    { ...size }
  );
}

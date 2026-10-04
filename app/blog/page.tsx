import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Блог — практика разработки и продвижения сайтов",
  description:
    "Заметки из практики: как ускорить загрузку сайта, перенести сайт на другой домен или хостинг без потери позиций, куда внедрить ИИ в малом бизнесе, типовые ошибки сайта.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Блог — практика разработки и продвижения сайтов | Евгений Зайко",
    description:
      "Чек-листы и заметки из практики: ускорение сайта, перенос на домен/хостинг, внедрение ИИ, ошибки сайта.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Блог Евгения Зайко — практика разработки и продвижения сайтов",
  url: `${SITE_URL}/blog`,
  author: { "@id": `${SITE_URL}/#person` },
  blogPost: posts.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    url: `${SITE_URL}/blog/${p.slug}`,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@id": `${SITE_URL}/#person` },
  })),
};

export default function BlogIndexPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main id="main-content">
        <section style={{ padding: "140px 32px 64px", maxWidth: 1200, margin: "0 auto" }}>
          <nav
            aria-label="Хлебные крошки"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
              color: "var(--muted)",
              marginBottom: 32,
            }}
          >
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
              ГЛАВНАЯ
            </Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>БЛОГ</span>
          </nav>

          <div className="section-label" style={{ marginBottom: 16 }}>
            {"// Чек-листы и разборы из практики"}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.2rem,5vw,4.2rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: "var(--text)",
              margin: 0,
            }}
          >
            Блог: <span style={{ color: "var(--accent)" }}>практика без воды</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: 720,
              marginTop: 28,
            }}
          >
            То, с чем я сталкиваюсь в реальных проектах: как ускорить сайт, переехать на другой
            домен или хостинг без потери позиций, где ИИ реально экономит деньги и какие ошибки
            сайта съедают заявки. Каждый материал — с чек-листом, который можно применить сегодня.
          </p>
        </section>

        <section style={{ padding: "0 32px 120px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="project-card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr auto",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    padding: "32px 24px",
                    borderRight: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--accent)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {p.tag}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--muted)" }}>
                    {p.date} · {p.readTime}
                  </div>
                </div>
                <div style={{ padding: "32px 32px" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "clamp(1.2rem,2.2vw,1.7rem)",
                      textTransform: "uppercase",
                      color: "var(--text)",
                      margin: 0,
                      marginBottom: 10,
                    }}
                  >
                    {p.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.86rem",
                      lineHeight: 1.65,
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    {p.lead.split(". ").slice(0, 2).join(". ")}.
                  </p>
                </div>
                <div
                  style={{
                    padding: "32px 28px",
                    display: "flex",
                    alignItems: "center",
                    borderLeft: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--accent)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Читать →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

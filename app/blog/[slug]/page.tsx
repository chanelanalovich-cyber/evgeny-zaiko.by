import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { SITE_URL } from "@/lib/site";
import { posts, getPost, type Block } from "@/lib/blog";

/** Фразы в тексте блога, которые ведут на услуги и связанные статьи */
const BODY_LINKS: { phrase: string; href: string }[] = [
  { phrase: "переборка на статическом генераторе", href: "/uslugi/razrabotka-saitov" },
  { phrase: "подробнее в статье про перенос на другой хостинг", href: "/blog/perenos-sajta-na-drugoj-hosting" },
  { phrase: "входит в поддержку сайта", href: "/uslugi/podderzhka-sajta" },
  { phrase: "типовой блок корпоративного сайта", href: "/uslugi/korporativnyj-sajt" },
  { phrase: "разработки сайта под ключ", href: "/uslugi/razrabotka-saitov" },
  { phrase: "корпоративном сайте на CMS", href: "/uslugi/korporativnyj-sajt" },
  { phrase: "аудит сайта с планом правок занимает неделю", href: "/uslugi/seo-prodvizhenie" },
];

/** Рендер текста блога: фразы из BODY_LINKS превращает в ссылки */
function RichText({ text }: { text: string }) {
  const parts: { text: string; href?: string }[] = [];
  let rest = text;
  while (rest.length > 0) {
    let best: { index: number; phrase: string; href: string } | null = null;
    for (const link of BODY_LINKS) {
      const index = rest.indexOf(link.phrase);
      if (index !== -1 && (best === null || index < best.index)) {
        best = { index, phrase: link.phrase, href: link.href };
      }
    }
    if (best === null) {
      parts.push({ text: rest });
      break;
    }
    if (best.index > 0) parts.push({ text: rest.slice(0, best.index) });
    parts.push({ text: best.phrase, href: best.href });
    rest = rest.slice(best.index + best.phrase.length);
  }
  return (
    <>
      {parts.map((part, i) =>
        part.href ? (
          <Link key={i} href={part.href} style={{ color: "var(--accent)", textDecoration: "underline" }}>
            {part.text}
          </Link>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.5rem,3vw,2.2rem)",
            textTransform: "uppercase",
            color: "var(--text)",
            margin: "56px 0 20px",
          }}
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", lineHeight: 1.8, color: "var(--muted)", margin: "0 0 18px" }}>
          <RichText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 14 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)", paddingTop: 4, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)" }}>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <aside
          style={{
            borderLeft: "3px solid var(--accent)",
            background: "rgba(200,255,0,0.04)",
            padding: "18px 24px",
            margin: "0 0 24px",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.92rem", lineHeight: 1.7, color: "var(--text)", margin: 0 }}>
            <RichText text={block.text} />
          </p>
        </aside>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.metaDescription,
      url: pageUrl,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
      mainEntityOfPage: pageUrl,
      inLanguage: "ru-RU",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
      ],
    },
  ];

  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main id="main-content">
        <article style={{ padding: "140px 32px 64px", maxWidth: 860, margin: "0 auto" }}>
          {/* Хлебные крошки */}
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
            <Link href="/blog" style={{ color: "var(--muted)", textDecoration: "none" }}>
              БЛОГ
            </Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>{post.tag.toUpperCase()}</span>
          </nav>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 16 }}>
            {post.date} · {post.readTime} чтения
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem,4.5vw,3.6rem)",
              lineHeight: 1.08,
              textTransform: "uppercase",
              color: "var(--text)",
              margin: 0,
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.08rem",
              lineHeight: 1.75,
              color: "var(--text)",
              marginTop: 28,
              marginBottom: 0,
            }}
          >
            {post.lead}
          </p>

          <div style={{ marginTop: 48 }}>
            {post.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>

          {/* Перелинковка на услуги (конверсия трафика) */}
          <div style={{ borderTop: "1px solid var(--border)", marginTop: 56, paddingTop: 32 }}>
            <div className="section-label" style={{ marginBottom: 18 }}>
              {"// Что с этим делать"}
            </div>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {post.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="project-card"
                  style={{
                    flex: "1 1 280px",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    padding: "24px 26px",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", marginTop: 12 }}>
                    Смотреть →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Другие статьи */}
          <div style={{ marginTop: 64 }}>
            <div className="section-label" style={{ marginBottom: 18 }}>
              {"// Другие статьи"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/blog/${o.slug}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    border: "1px solid var(--border)",
                    padding: "20px 24px",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text)" }}>
                    {o.title}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", whiteSpace: "nowrap" }}>
                    {o.readTime} →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 64, marginBottom: 40 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              {"// Обсудить задачу"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.4rem,3vw,2rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 24,
              }}
            >
              Нужна помощь <span style={{ color: "var(--accent)" }}>со своим сайтом?</span>
            </h2>
            <ContactSection />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

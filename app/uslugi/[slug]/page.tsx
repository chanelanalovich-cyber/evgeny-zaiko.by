import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { SITE_URL } from "@/lib/site";
import { services, getService, relatedServices } from "@/lib/services";

/** Фразы в ответах FAQ, которые ведут на страницы других услуг (перелинковка кластеров) */
const FAQ_LINKS: { phrase: string; slug: string }[] = [
  { phrase: "«Корпоративный сайт под ключ»", slug: "korporativnyj-sajt" },
  { phrase: "кастомную разработку под ключ (от 900 BYN)", slug: "razrabotka-saitov" },
];

/** Рендер ответа FAQ: фразы из FAQ_LINKS превращает в ссылки на связанные услуги */
function FaqAnswer({ text }: { text: string }) {
  const parts: { text: string; slug?: string }[] = [];
  let rest = text;
  while (rest.length > 0) {
    let best: { index: number; phrase: string; slug: string } | null = null;
    for (const link of FAQ_LINKS) {
      const index = rest.indexOf(link.phrase);
      if (index !== -1 && (best === null || index < best.index)) {
        best = { index, phrase: link.phrase, slug: link.slug };
      }
    }
    if (best === null) {
      parts.push({ text: rest });
      break;
    }
    if (best.index > 0) parts.push({ text: rest.slice(0, best.index) });
    parts.push({ text: best.phrase, slug: best.slug });
    rest = rest.slice(best.index + best.phrase.length);
  }
  return (
    <>
      {parts.map((part, i) =>
        part.slug ? (
          <Link
            key={i}
            href={`/uslugi/${part.slug}`}
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
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
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/uslugi/${service.slug}`,
    },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `${SITE_URL}/uslugi/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = relatedServices(service.slug);
  const pageUrl = `${SITE_URL}/uslugi/${service.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      serviceType: service.name,
      url: pageUrl,
      description: service.metaDescription,
      provider: {
        "@type": "Person",
        name: "Евгений Зайко",
        url: SITE_URL,
      },
      areaServed: { "@type": "Country", name: "Беларусь" },
      offers: {
        "@type": "Offer",
        priceCurrency: service.priceCurrency ?? "BYN",
        price: service.priceFrom,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: service.priceFrom,
          priceCurrency: service.priceCurrency ?? "BYN",
          valueAddedTaxIncluded: true,
        },
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Услуги",
          item: `${SITE_URL}/uslugi`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: service.name,
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main-content">
        {/* HERO услуги */}
        <section style={{ padding: "140px 32px 64px", maxWidth: 1200, margin: "0 auto" }}>
          {/* Хлебные крошки (видимые) */}
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
            <Link href="/uslugi" style={{ color: "var(--muted)", textDecoration: "none" }}>
              УСЛУГИ
            </Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>{service.name.toUpperCase()}</span>
          </nav>

          <div className="section-label" style={{ marginBottom: 16 }}>
            {"// " + service.priceLabel + " · Беларусь · " + (service.heroNote ?? "под ключ")}
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
              maxWidth: 1000,
            }}
          >
            {service.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "var(--muted)",
              maxWidth: 760,
              marginTop: 28,
            }}
          >
            {service.lead}
          </p>
        </section>

        {/* Кому подходит */}
        <section style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem,3vw,2.6rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 40,
              }}
            >
              Кому <span style={{ color: "var(--accent)" }}>подходит</span>
            </h2>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {service.forWhom.map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    flex: "1 1 260px",
                    minWidth: 260,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    padding: "32px 28px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--accent)",
                      letterSpacing: "0.14em",
                      marginBottom: 14,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      color: "var(--text)",
                      margin: 0,
                      marginBottom: 10,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Об услуге — текстовый блок */}
        <section style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem,3vw,2.6rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 32,
              }}
            >
              Об <span style={{ color: "var(--accent)" }}>услуге</span>
            </h2>
            {service.about.map((text, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "var(--muted)",
                  margin: "0 0 20px",
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </section>

        {/* Почему я */}
        <section style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem,3vw,2.6rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 32,
              }}
            >
              Почему <span style={{ color: "var(--accent)" }}>заказывают у меня</span>
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16, maxWidth: 820 }}>
              {service.whyMe.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 14 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent)", paddingTop: 3, flexShrink: 0 }}>
                    ✓
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", lineHeight: 1.7, color: "var(--muted)", paddingTop: 2 }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Что входит */}
        <section style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem,3vw,2.6rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 40,
              }}
            >
              Что <span style={{ color: "var(--accent)" }}>входит</span>
            </h2>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {service.includes.map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    flex: "1 1 260px",
                    minWidth: 260,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    padding: "32px 28px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--accent)",
                      letterSpacing: "0.14em",
                      marginBottom: 14,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                      color: "var(--text)",
                      margin: 0,
                      marginBottom: 10,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      lineHeight: 1.65,
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Этапы + кейс-доказательство */}
        <section style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Этапы */}
            <div style={{ flex: "2 1 480px", minWidth: 320, border: "1px solid var(--border)", padding: "36px 32px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  textTransform: "uppercase",
                  color: "var(--text)",
                  margin: 0,
                  marginBottom: 28,
                }}
              >
                Как идёт <span style={{ color: "var(--accent)" }}>работа</span>
              </h2>
              <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
                {service.steps.map((step, i) => (
                  <li key={step.title} style={{ display: "flex", gap: 16 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--accent)",
                        paddingTop: 3,
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, color: "var(--text)", fontSize: "0.92rem" }}>
                        {step.title}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.84rem",
                          color: "var(--muted)",
                          lineHeight: 1.6,
                          marginTop: 4,
                        }}
                      >
                        {step.text}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Кейс-доказательство */}
            <aside
              style={{
                flex: "1 1 280px",
                minWidth: 280,
                border: "1px solid var(--border)",
                background: "rgba(200,255,0,0.03)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--muted)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {"// Доказательство"}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(2rem,4vw,3rem)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {service.proof.metric}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    color: "var(--muted)",
                    letterSpacing: "0.1em",
                    marginTop: 6,
                  }}
                >
                  {service.proof.metricLabel.toUpperCase()}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  color: "var(--text)",
                  fontSize: "0.9rem",
                }}
              >
                {service.proof.project}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  lineHeight: 1.65,
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                {service.proof.text}
              </p>
              <a
                href={`https://${service.proof.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                }}
              >
                {service.proof.domain} ↗
              </a>
            </aside>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem,3vw,2.4rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 36,
              }}
            >
              Частые <span style={{ color: "var(--accent)" }}>вопросы</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {service.faq.map((f) => (
                <details
                  key={f.question}
                  style={{
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    padding: "20px 24px",
                  }}
                >
                  <summary
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "var(--text)",
                      cursor: "pointer",
                    }}
                  >
                    {f.question}
                  </summary>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.86rem",
                      lineHeight: 1.7,
                      color: "var(--muted)",
                      marginTop: 14,
                      marginBottom: 0,
                    }}
                  >
                    <FaqAnswer text={f.answer} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / форма */}
        <section id="contact-anchor" style={{ padding: "0 32px 96px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              {"// Обсудить задачу"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem,3vw,2.4rem)",
                textTransform: "uppercase",
                color: "var(--text)",
                margin: 0,
                marginBottom: 32,
              }}
            >
              Готовы <span style={{ color: "var(--accent)" }}>начать?</span>
            </h2>
          </div>
          <ContactSection />
        </section>

        {/* Перелинковка «С этим заказывают» */}
        <section style={{ padding: "0 32px 120px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="section-label" style={{ marginBottom: 24 }}>
              {"// С этим заказывают"}
            </div>
            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/uslugi/${r.slug}`}
                  style={{
                    flex: "1 1 240px",
                    minWidth: 240,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    padding: "28px 24px",
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "uppercase",
                      color: "var(--text)",
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.66rem",
                      color: "var(--muted)",
                      marginTop: 10,
                      lineHeight: 1.6,
                    }}
                  >
                    {r.priceLabel} · {r.metaTitle.split("—")[0].trim()}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--accent)",
                      marginTop: 14,
                    }}
                  >
                    Подробнее →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

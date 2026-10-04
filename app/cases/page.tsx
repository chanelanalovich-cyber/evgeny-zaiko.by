import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Кейсы разработки сайтов — результаты в цифрах",
  description:
    "Портфолио разработки сайтов с SEO: +1415% трафика за месяц, топ-5 по коммерческим запросам, индексация за сутки. 5 живых сайтов — цифры из Search Console и Метрики.",
  alternates: { canonical: `${SITE_URL}/cases` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Кейсы разработки сайтов с SEO",
  itemListElement: projects.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: p.title,
      url: p.link,
      description: p.result,
      creator: { "@id": `${SITE_URL}/#person` },
    },
  })),
};

export default function CasesPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main id="main-content" style={{ padding: "140px 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Хлебные крошки */}
          <nav style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 40 }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>ГЛАВНАЯ</Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>КЕЙСЫ</span>
          </nav>

          <div style={{ marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>{"// Портфолио"}</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.2rem,5vw,4rem)",
                textTransform: "uppercase",
                lineHeight: 0.95,
                color: "var(--text)",
                margin: 0,
              }}
            >
              Кейсы: сайты, которые <span style={{ color: "var(--accent)" }}>приводят клиентов</span>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 720, marginTop: 24 }}>
              Пять работающих сайтов: интернет-магазины, визитки, лендинги и многостраничники.
              Цифры не приукрашены — они видны в Search Console и Яндекс.Метрике каждого проекта.
              По каждому кейсу — какая услуга делалась и что получилось.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {projects.map((p) => (
              <article
                key={p.domain}
                style={{
                  border: "1px solid var(--border)",
                  padding: "40px 36px",
                  display: "grid",
                  gridTemplateColumns: "1fr 260px",
                  gap: 40,
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.14em", marginBottom: 12 }}>
                    {p.num} · {p.sub}
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.8rem", textTransform: "uppercase", color: "var(--text)", margin: 0, marginBottom: 16 }}>
                    {p.title}
                  </h2>
                  <p style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginBottom: 8 }}>
                    {p.result}
                  </p>
                  <div style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginBottom: 18 }}>
                    {p.resultDetail}
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.75, margin: 0, marginBottom: 20 }}>
                    {p.desc}
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", border: "1px solid var(--border)", padding: "3px 10px", borderRadius: 2 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* Перелинковка кейс → услуга */}
                  <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                      {"// Услуга из кейса"}
                    </span>
                    {p.services.map((s) => (
                      <Link key={s.href + s.label} href={s.href} style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--accent)", textDecoration: "none" }}>
                        {s.label} →
                      </Link>
                    ))}
                  </div>
                </div>

                <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 36, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 24 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2.4rem", color: "var(--accent)" }}>
                      {p.metric}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
                      {p.metricLabel}
                    </div>
                  </div>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                    {p.domain} ↗
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div style={{ marginTop: 64, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/uslugi" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Выбрать услугу →
            </Link>
            <Link href="/contacts" style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--muted)", textDecoration: "none" }}>
              Обсудить свой проект →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

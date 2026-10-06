import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Услуги — сайты, SEO и автоматизация",
  description:
    "Услуги Евгения Зайко: разработка сайтов под ключ, создание продающих лендингов, сайт-визитки, SEO-продвижение в Google и Яндексе, автоматизация бизнеса и ИИ-агенты. Беларусь, цены от 400 BYN.",
  alternates: {
    canonical: `${SITE_URL}/uslugi`,
  },
  openGraph: {
    title: "Услуги — сайты, SEO и автоматизация | Евгений Зайко",
    description:
      "Разработка сайтов, лендингов, сайт-визиток, SEO-продвижение и автоматизация бизнеса. Беларусь, цены от 400 BYN.",
    url: `${SITE_URL}/uslugi`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.title,
    url: `${SITE_URL}/uslugi/${s.slug}`,
  })),
};

/** Форматы для блока «Визитка или лендинг — что выбрать?» (кластеры C и B ядра).
 *  Цены и названия — из services, единый источник коммерческих данных. */
const comparisonSlugs = ["sajt-vizitka", "landing-page"] as const;

const comparisonNotes: Record<string, { task: string; when: string }> = {
  "sajt-vizitka": {
    task: "Представляет бизнес целиком: услуги, цены, работы, отзывы, онлайн-запись. Клиент находит вас в поиске и сразу понимает, кто вы, сколько это стоит и как связаться.",
    when: "Выбирайте, если нужно представительство под весь бизнес: мастерам, салонам, небольшим компаниям.",
  },
  "landing-page": {
    task: "Заточен под одну услугу и активный сбор заявок: оффер → доказательства → заявка в один клик. Часто работает как страница под рекламный трафик.",
    when: "Выбирайте, если нужно продать конкретную услугу: запуск продукта, акция, проверка спроса, трафик с рекламы.",
  },
};

export default function ServicesIndexPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <span style={{ color: "var(--accent)" }}>УСЛУГИ</span>
          </nav>

          <div className="section-label" style={{ marginBottom: 16 }}>
            {"// 6 форматов работы · Беларусь"}
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
            Услуги: <span style={{ color: "var(--accent)" }}>сайт → топ → заявки</span>
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
            Шесть форматов работы — от быстрой визитки до чат-ботов для Instagram,
            комплексного сайта с продвижением и автоматизации. Каждый формат — под свою задачу
            и бюджет. Ниже цены, сроки и что входит.
          </p>
        </section>

        <section style={{ padding: "0 32px 120px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/uslugi/${s.slug}`}
                className="project-card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr auto",
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
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.4rem",
                      color: "var(--accent)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.priceLabel}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--muted)",
                      letterSpacing: "0.1em",
                      marginTop: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    под ключ
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
                    {s.title}
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
                    {s.lead.split(". ").slice(0, 2).join(". ")}.
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
                    Подробнее →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* «Визитка или лендинг» — частый вопрос клиентов до заявки: сравнение форматов
            закрывает возражение и перелинковывает кластеры B и C ядра. */}
        <section style={{ padding: "0 32px 120px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <div className="section-label" style={{ marginBottom: 14 }}>
                {"// Визитка или лендинг — что выбрать?"}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  color: "var(--muted)",
                  maxWidth: 720,
                  margin: 0,
                }}
              >
                Обе страницы обычно одностраничные, но задачи у них разные. Короткое правило:
                визитка отвечает на вопрос «кто вы», лендинг — «почему купить именно сейчас».
              </p>
            </div>

            <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              {comparisonSlugs.map((slug) => {
                const s = services.find((x) => x.slug === slug);
                const note = s ? comparisonNotes[s.slug] : undefined;
                if (!s || !note) return null;
                return (
                  <Link
                    key={s.slug}
                    href={`/uslugi/${s.slug}`}
                    className="project-card"
                    style={{
                      flex: 1,
                      minWidth: 320,
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      padding: "32px 28px",
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 700,
                          fontSize: "1.2rem",
                          textTransform: "uppercase",
                          color: "var(--text)",
                          margin: 0,
                        }}
                      >
                        {s.name}
                      </h3>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                          color: "var(--accent)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.priceLabel}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.86rem",
                        lineHeight: 1.65,
                        color: "var(--muted)",
                        margin: 0,
                      }}
                    >
                      {note.task}
                    </p>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.66rem",
                        lineHeight: 1.6,
                        color: "var(--text)",
                        marginTop: "auto",
                      }}
                    >
                      ↳ {note.when}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        color: "var(--accent)",
                      }}
                    >
                      Подробнее →
                    </span>
                  </Link>
                );
              })}
            </div>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.84rem",
                lineHeight: 1.7,
                color: "var(--muted)",
                maxWidth: 720,
                margin: "24px 0 0",
              }}
            >
              Сомневаетесь — опишите бизнес в двух словах: после короткого брифа скажу, какой
              формат приведёт заявки, а не просто будет «красиво».
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

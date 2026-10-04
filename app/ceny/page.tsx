import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Сколько стоит разработка сайта — цены 2026",
  description:
    "Цены на разработку сайтов: лендинг от 400 BYN, сайт-визитка от 530 BYN, сайт под ключ с SEO от 900 BYN, автоматизация от 500 BYN. Что входит в цену и от чего она зависит.",
  alternates: { canonical: `${SITE_URL}/ceny` },
};

const faq = [
  {
    question: "Сколько стоит создание лендинга?",
    answer:
      "Продающий лендинг — от 400 BYN под ключ: структура под запросы, уникальный дизайн, вёрстка, домен, хостинг, форма заявок в Telegram и базовая SEO-настройка. Итоговая цена зависит от количества секций и интеграций — после короткого брифа назову точную сумму и срок.",
  },
  {
    question: "Сколько стоит сайт-визитка?",
    answer:
      "От 530 BYN с онлайн-записью или каталогом — дороже: цена зависит от функционала. В визитку входит всё до рабочего сайта, включая домен, SSL и приём заявок.",
  },
  {
    question: "Почему цены ниже, чем в агентствах?",
    answer:
      "Вы платите напрямую исполнителю — без менеджеров, аккаунтов и наценки студии. Агентства закладывают в смету зарплату менеджера проекта и офис; я закладываю только работу. При этом стек тот же: Next.js, SEO-фундамент, аналитика.",
  },
  {
    question: "Что входит в стоимость каждого пакета?",
    answer:
      "Полный цикл до работающего сайта: анализ запросов, структура, тексты, дизайн, разработка, домен, хостинг, SSL, микроразметка, Search Console и Вебмастер, приём заявок в Telegram и обучение. Доплат за «базовый тариф без SEO» нет — SEO-фундамент входит всегда.",
  },
  {
    question: "Как проходит оплата?",
    answer:
      "По этапам: предоплата за дизайн и структуру, остаток — после запуска и приёмки. Для физических лиц — по договору или чеком, для юрлиц — с полным пакетом документов.",
  },
  {
    question: "Что не входит в цену пакета?",
    answer:
      "Рекламный бюджет (Google Ads, Яндекс.Директ), платные подписки сторонних сервисов (онлайн-запись, рассылки) и ежемесячное ведение сайта — это отдельные услуги, подключаются по желанию.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/ceny#faq`,
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
    {
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/ceny#offers`,
      name: "Пакеты разработки сайтов и SEO",
      url: `${SITE_URL}/ceny`,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        name: s.title,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: s.priceFrom,
          priceCurrency: "BYN",
          valueAddedTaxIncluded: true,
        },
        url: `${SITE_URL}/uslugi/${s.slug}`,
      })),
    },
  ],
};

export default function CenyPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main id="main-content" style={{ padding: "140px 32px 120px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <nav style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 40 }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>ГЛАВНАЯ</Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>ЦЕНЫ</span>
          </nav>

          <div style={{ marginBottom: 56 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>{"// Прозрачно"}</div>
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
              Сколько стоит <span style={{ color: "var(--accent)" }}>сайт под ключ</span>
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 720, marginTop: 24 }}>
              Фиксированные стартовые цены без «звёздочек»: в каждый пакет входит всё до
              работающего сайта — от анализа запросов до приёма заявок в Telegram. Точную
              сумму называю после короткого брифа, и она не меняется в процессе.
            </p>
          </div>

          {/* Таблица цен */}
          <div style={{ border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", padding: "16px 28px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.14em", color: "var(--muted)", textTransform: "uppercase" }}>
              <div style={{ flex: 2 }}>Пакет</div>
              <div style={{ flex: 1 }}>Цена</div>
              <div style={{ flex: 1 }}>Срок</div>
            </div>
            {services.map((s) => (
              <div key={s.slug} style={{ display: "flex", padding: "22px 28px", borderBottom: "1px solid var(--border)", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 2 }}>
                  <Link href={`/uslugi/${s.slug}`} style={{ color: "var(--text)", textDecoration: "none", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.05rem" }}>
                    {s.name} →
                  </Link>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--muted)", marginTop: 6, lineHeight: 1.6 }}>
                    {s.cluster === "F" ? "аудит, оптимизация, контент, отчёты" : s.includes[0].title.toLowerCase() + " и ещё " + (s.includes.length - 1) + " пункта"}
                  </div>
                </div>
                <div style={{ flex: 1, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--accent)" }}>
                  {s.priceLabel}
                </div>
                <div style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
                  {s.slug === "landing-page" || s.slug === "sajt-vizitka" ? "5–7 дней" : s.slug === "razrabotka-saitov" ? "2–5 недель" : s.slug === "seo-prodvizhenie" ? "постоянно" : "1–3 недели"}
                </div>
              </div>
            ))}
          </div>

          <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginTop: 16 }}>
            * Первым трём клиентам сайт под ключ с SEO — 760 BYN вместо 900. Цены указаны без НДС.
          </p>

          {/* От чего зависит цена */}
          <section style={{ marginTop: 80 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.4rem)", textTransform: "uppercase", color: "var(--text)", marginBottom: 24 }}>
              От чего зависит итоговая <span style={{ color: "var(--accent)" }}>цена</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
              {[
                {
                  t: "Количество страниц и секций",
                  d: "Одностраничник и 9-страничный корпоративный сайт — разный объём работы. Структуру собираю под запросы, а не «на глаз».",
                },
                {
                  t: "Функционал",
                  d: "Корзина, онлайн-оплата, личный кабинет, онлайн-запись, каталог — каждый модуль добавляет и цену, и срок.",
                },
                {
                  t: "Интеграции",
                  d: "Telegram-боты, CRM, платёжные системы, таблицы, доставка. Чем больше автоматизации, тем дороже — но тем меньше рутины у вас.",
                },
                {
                  t: "Конкуренция ниши",
                  d: "Влияет на объём SEO-работ: чем выше конкуренция по запросам, тем больше контента и оптимизации нужно для топа.",
                },
              ].map((b) => (
                <div key={b.t} style={{ border: "1px solid var(--border)", padding: "28px 26px" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)", marginBottom: 12 }}>{b.t}</div>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{b.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section style={{ marginTop: 80 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.6rem,3vw,2.4rem)", textTransform: "uppercase", color: "var(--text)", marginBottom: 32 }}>
              Частые вопросы <span style={{ color: "var(--accent)" }}>о ценах</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {faq.map((f) => (
                <details key={f.question} style={{ border: "1px solid var(--border)", padding: "20px 26px" }}>
                  <summary style={{ cursor: "pointer", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>
                    {f.question}
                  </summary>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.75, margin: "16px 0 0" }}>
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <div style={{ marginTop: 64, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/contacts" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Получить точную цену за 1 день →
            </Link>
            <Link href="/cases" style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--muted)", textDecoration: "none" }}>
              Сначала посмотреть кейсы →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

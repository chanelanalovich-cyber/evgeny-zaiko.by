import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Обо мне — Евгений Зайко, разработка сайтов и SEO",
  description:
    "Евгений Зайко: full-stack разработчик и SEO-специалист. 5+ лет коммерческого опыта, 5 живых кейсов с цифрами из Search Console. Сайты, которые приносят заявки, — без менеджеров и посредников.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Евгений Зайко",
  url: `${SITE_URL}/about`,
  jobTitle: "Веб-разработчик и SEO-специалист",
  description:
    "Full-stack разработчик: сайты под ключ, SEO-продвижение и автоматизация бизнеса для малого бизнеса Беларуси.",
  knowsAbout: [
    "Разработка сайтов",
    "SEO-продвижение",
    "Next.js",
    "Автоматизация бизнеса",
    "Telegram-боты",
    "ИИ-агенты",
  ],
  sameAs: ["https://t.me/rahunak", "https://www.linkedin.com/in/eugene-zaiko"],
  email: "zaiko.eugene@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BY",
    addressLocality: "Полоцк",
  },
  workExample: projects.map((p) => p.link),
};

const facts = [
  { n: "5+", l: "лет коммерческой разработки" },
  { n: "5", l: "живых сайтов в портфолио" },
  { n: "+1415%", l: "рост трафика клиента за месяц" },
  { n: "24ч", l: "средний срок ответа — часы, не дни" },
];

export default function AboutPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main id="main-content" style={{ padding: "140px 32px 120px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <nav style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 40 }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>ГЛАВНАЯ</Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>ОБО МНЕ</span>
          </nav>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.2rem,5vw,4rem)",
              textTransform: "uppercase",
              lineHeight: 0.95,
              color: "var(--text)",
              margin: 0,
              marginBottom: 40,
            }}
          >
            Евгений Зайко — <span style={{ color: "var(--accent)" }}>сайты с клиентами</span>, а не просто сайты
          </h1>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 56 }}>
            {facts.map((f) => (
              <div key={f.l} style={{ border: "1px solid var(--border)", padding: "22px 28px", flex: "1 1 180px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.9rem", color: "var(--accent)" }}>{f.n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>{f.l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 760 }}>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1rem", margin: 0 }}>
              Меня зовут Евгений, я full-stack разработчик из Полоцка с 5+ годами коммерческого опыта.
              Делаю сайты, которые приносят заявки: интернет-магазины, визитки, лендинги и корпоративные
              сайты для малого бизнеса Беларуси. Веду проект от анализа поисковых запросов до потока
              заявок в Telegram — один исполнитель за весь цикл.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1rem", margin: 0 }}>
              Чем отличаюсь от студий: вы общаетесь напрямую с тем, кто делает, — без менеджеров,
              оценщиков и очереди из проектов. Каждая цифра на этом сайте проверяема: рост трафика
              и позиции клиентов видны в Search Console и Яндекс.Метрике. Чем отличаюсь от конструкторов:
              сайт на Next.js принадлежит вам полностью — без абонплаты, с реальной скоростью и полным
              контролем над структурой и микроразметкой.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1rem", margin: 0 }}>
              Стек: Next.js / React, TypeScript, PostgreSQL, Telegram Bot API, интеграции с CRM и
              платёжными системами. В SEO — техаудит, семантическое ядро, контент под интент,
              микроразметка Schema.org, связка Search Console + Яндекс.Вебмастер + IndexNow.
              Недавно добавил в конвейер ИИ-агентов: они отвечают клиентам и квалифицируют заявки
              круглосуточно.
            </p>
          </div>

          {/* Как я работаю */}
          <section style={{ marginTop: 64 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2.2rem)", textTransform: "uppercase", color: "var(--text)", marginBottom: 28 }}>
              Как я <span style={{ color: "var(--accent)" }}>работаю</span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { t: "Сначала запросы, потом дизайн", d: "Структура сайта строится под реальные поисковые запросы ваших клиентов — поэтому страницы выходят в топ и приносят заявки." },
                { t: "Всё до работающего сайта", d: "Домен, хостинг, SSL, аналитика, поисковые системы, приём заявок — в цену пакета. Вы получаете сайт, который уже работает." },
                { t: "Прозрачные цифры", d: "После запуска показываю, как измерять результат: клики, позиции, заявки. Отчёты — из GSC и Метрики, не из воздуха." },
                { t: "Без привязки к исполнителю", d: "Документация и доступы — ваши с первого дня. Могу вести сайт дальше, но не делаю зависимость «без меня никак»." },
              ].map((s, i) => (
                <div key={s.t} style={{ border: "1px solid var(--border)", padding: "24px 28px", display: "flex", gap: 24 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)", flexShrink: 0 }}>0{i + 1}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.02rem", color: "var(--text)", marginBottom: 8 }}>{s.t}</div>
                    <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ marginTop: 64, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/cases" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Смотреть кейсы →
            </Link>
            <Link href="/contacts" style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", color: "var(--muted)", textDecoration: "none" }}>
              Написать мне →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

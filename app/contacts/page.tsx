import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { PHONE_DISPLAY, PHONE_TEL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты — заказать сайт в Беларуси",
  description:
    `Связаться с Евгением Зайко: телефон ${PHONE_DISPLAY}, Telegram @rahunak, email zaiko.eugene@gmail.com или форма на сайте. Отвечаю лично в течение 2–3 часов. Первичная консультация — бесплатно.`,
  alternates: { canonical: `${SITE_URL}/contacts` },
  openGraph: {
    url: `${SITE_URL}/contacts`,
    images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: "Евгений Зайко — сайты с заявками под ключ" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contacts`,
  name: "Контакты Евгения Зайко",
  url: `${SITE_URL}/contacts`,
  about: { "@id": `${SITE_URL}/#business` },
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Евгений Зайко",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        url: "https://t.me/rahunak",
        email: "zaiko.eugene@gmail.com",
        telephone: PHONE_TEL,
        availableLanguage: ["ru"],
      },
    ],
  },
};

export default function ContactsPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />
      <main id="main-content" style={{ padding: "140px 0 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <nav style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 40 }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>ГЛАВНАЯ</Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>КОНТАКТЫ</span>
          </nav>
        </div>

        <ContactSection asH1 />

        <div className="contacts-facts-wrap" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 120px" }}>
          <div className="contacts-facts">
            {[
              { t: "Время ответа", d: "2–3 часа в рабочее время (GMT+3). Срочное — Telegram, он на виду." },
              { t: "Первичная консультация", d: "Бесплатно: разберу задачу, скажу, что получится и во сколько обойдётся." },
              { t: "Работаю с", d: "Малым бизнесом Беларуси и СНГ. Дистанционно — весь процесс по переписке и созвонам." },
            ].map((b) => (
              <div key={b.t}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
                  {"// "}{b.t}
                </div>
                <p style={{ color: "var(--text)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_HOST } from "@/lib/site";

/**
 * Кастомная 404: стандартная Next.js без ссылок теряет посетителей,
 * пришедших по битым/устаревшим адресам. Направляем их на живые страницы.
 */
export default function NotFound() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main
        id="main-content"
        style={{
          padding: "180px 32px 120px",
          maxWidth: 760,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          className="section-label"
          style={{ marginBottom: 20 }}
        >
          {"// Ошибка 404"}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem,5vw,4rem)",
            textTransform: "uppercase",
            color: "var(--text)",
            margin: 0,
            marginBottom: 24,
          }}
        >
          Такой страницы <span style={{ color: "var(--accent)" }}>нет</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "var(--muted)",
            marginBottom: 40,
          }}
        >
          Адрес, по которому вы пришли, не существует или переехал. Посмотрите
          живые страницы {SITE_HOST} — нужное скорее всего там:
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { href: "/", label: "Главная" },
            { href: "/uslugi", label: "Услуги" },
            { href: "/ceny", label: "Цены" },
            { href: "/cases", label: "Кейсы" },
            { href: "/blog", label: "Блог" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                border: "1px solid var(--border)",
                padding: "14px 24px",
                textDecoration: "none",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

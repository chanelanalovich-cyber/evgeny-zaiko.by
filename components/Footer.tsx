import Link from "next/link";

/**
 * Футер — единственная sitewide-перелинковка сайта: ссылки на ключевые
 * посадочные видны с каждой страницы и распределяют донорский вес
 * на услуги и ценовую страницу без перегруза Nav.
 */
const footerLinks: { label: string; href: string }[] = [
  { label: "Цены", href: "/ceny" },
  { label: "Кейсы", href: "/cases" },
  { label: "Блог", href: "/blog" },
  { label: "Сайт-визитка", href: "/uslugi/sajt-vizitka" },
  { label: "Разработка под ключ", href: "/uslugi/razrabotka-saitov" },
  { label: "Поддержка сайта", href: "/uslugi/podderzhka-sajta" },
  { label: "Автоматизация", href: "/uslugi/avtomatizaciya-biznesa" },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--muted)",
            letterSpacing: "0.1em",
          }}
        >
          © {new Date().getFullYear()} ЕВГЕНИЙ ЗАЙКО · EVGENY-ZAIKO.BY
        </div>
        <a
          href="https://t.me/rahunak"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "var(--accent)",
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
        >
          TELEGRAM @RAHUNAK ↗
        </a>
      </div>

      <nav
        aria-label="Разделы сайта"
        style={{
          display: "flex",
          gap: 22,
          flexWrap: "wrap",
          paddingTop: 14,
          borderTop: "1px solid var(--border)",
        }}
      >
        {footerLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              letterSpacing: "0.08em",
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            {l.label.toUpperCase()}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

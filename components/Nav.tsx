"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToSection } from "@/lib/useInView";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const navLinks: [string, string, string?][] = [
  // [label, якорь на главной, href если внешняя страница]
  ["Кейсы", "cases"],
  ["Услуги", "services", "/uslugi"],
  // «Блог» — не основной раздел: ссылка живёт в футере
  ["Обо мне", "about"],
  ["Контакты", "contact"],
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Меню занимает весь экран: пока оно открыто, страница под ним не скроллится
  // (иначе на телефоне фон уезжает под оверлеем). Escape — закрыть.
  useEffect(() => {
    if (!menuOpen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    // Блокируем и html: на мобильных скроллится он, а не body
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const goTo = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
  };

  // Якорные ссылки — настоящие <a href="/#id"> (краулимые, с внутренним весом).
  // На главной перехватываем клик для плавного скролла, с других страниц — обычный переход.
  const anchorClick = (e: React.MouseEvent, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      goTo(id);
    } else {
      setMenuOpen(false);
    }
  };

  const linkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 32px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <Link
          href="/"
          onClick={(e) => {
            setMenuOpen(false);
            // На главной Next не перезагружает маршрут, поэтому ссылка на «/»
            // не сдвигала страницу — поднимаем скролл в начало вручную
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          style={{
            ...linkStyle,
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            letterSpacing: "0.15em",
            color: "var(--accent)",
          }}
        >
          EVGENY-ZAIKO.BY
        </Link>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden-mobile">
          {navLinks.map(([label, id, href]) =>
            href ? (
              <Link key={id} href={href} className="nav-link" style={linkStyle}>
                {label}
              </Link>
            ) : (
              <Link
                key={id}
                href={`/#${id}`}
                className="nav-link"
                style={linkStyle}
                onClick={(e) => anchorClick(e, id)}
              >
                {label}
              </Link>
            )
          )}
          {/* Телефон в шапке — прямой дозвон (на мобильной ширине шапка свёрнута
              в меню, там ссылка ниже + постоянная кнопка «Позвонить» внизу экрана) */}
          <a
            href={`tel:${PHONE_TEL}`}
            className="nav-link"
            data-tel-source="nav"
            style={{ ...linkStyle, color: "var(--accent)", whiteSpace: "nowrap" }}
          >
            {PHONE_DISPLAY}
          </a>
          <Link href="/#contact" className="btn-primary" style={{ padding: "8px 18px" }} onClick={(e) => anchorClick(e, "contact")}>
            Связаться →
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Закрыть меню" : "Меню"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            display: "none",
            flexDirection: "column",
          }}
          className="show-mobile"
        >
          <div
            style={{
              width: 22,
              height: 2,
              background: "var(--text)",
              marginBottom: 5,
              transition: "transform 0.2s",
              transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none",
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: "var(--text)",
              transition: "opacity 0.2s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <div
            style={{
              width: 22,
              height: 2,
              background: "var(--text)",
              marginTop: 5,
              transition: "transform 0.2s",
              transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {navLinks.map(([label, id, href]) => (
            <Link
              key={id}
              href={href ?? `/#${id}`}
              onClick={href ? () => setMenuOpen(false) : (e) => anchorClick(e, id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "2.5rem",
                textTransform: "uppercase",
                color: "var(--text)",
                letterSpacing: "0.02em",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href={`tel:${PHONE_TEL}`}
            data-tel-source="mobile-menu"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            {PHONE_DISPLAY}
          </a>
        </div>
      )}
    </>
  );
}

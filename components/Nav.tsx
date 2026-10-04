"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { scrollToSection } from "@/lib/useInView";

const navLinks: [string, string, string?][] = [
  // [label, якорь на главной, href если внешняя страница]
  ["Кейсы", "cases"],
  ["Услуги", "services", "/uslugi"],
  ["Обо мне", "about"],
  ["Контакты", "contact"],
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id: string) => {
    scrollToSection(id);
    setMenuOpen(false);
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
        <button
          onClick={() => goTo("hero")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            letterSpacing: "0.15em",
            color: "var(--accent)",
          }}
        >
          EVGENY-ZAIKO.BY
        </button>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="hidden-mobile">
          {navLinks.map(([label, id, href]) =>
            href ? (
              <Link key={id} href={href} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}>
                {label}
              </Link>
            ) : (
              <button
                key={id}
                className="nav-link"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => goTo(id)}
              >
                {label}
              </button>
            )
          )}
          <button className="btn-primary" style={{ padding: "8px 18px" }} onClick={() => goTo("contact")}>
            Связаться →
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
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
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(8,8,8,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {navLinks.map(([label, id]) => (
            <button
              key={id}
              onClick={() => goTo(id)}
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
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

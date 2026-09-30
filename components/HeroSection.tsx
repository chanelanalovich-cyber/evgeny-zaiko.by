"use client";

import { scrollToSection } from "@/lib/useInView";
import { Counter } from "./ui";

// Реальные цифры из GSC — главный аргумент для клиента
const stats = [
  { n: 15, s: "×", label: "рост трафика клиента за месяц" },
  { n: 5, s: "", label: "работающих сайтов в портфолио" },
  { n: 5, s: "+", label: "лет коммерческого опыта" },
] as const;

const tickerItems = [
  "Сайт под ключ",
  "SEO-продвижение",
  "Google Топ",
  "Яндекс Топ",
  "Автоматизация заявок",
  "Telegram-боты",
  "Next.js",
  "Интеграции CRM",
  "Техподдержка",
];

export default function HeroSection() {
  return (
    <>
      {/* HERO */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 32px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "-8%",
            width: 700,
            height: 700,
            zIndex: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,255,0,0.055) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-5%",
            width: 500,
            height: 500,
            zIndex: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,255,0,0.025) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200 }}>
          <div className="section-label fade-up" style={{ marginBottom: 24, animationDelay: "0.1s" }}>
            Евгений Зайко · разработка + SEO · Беларусь · {new Date().getFullYear()}
          </div>

          <h1
            className="fade-up"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.6rem,6.5vw,5.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              margin: 0,
              animationDelay: "0.2s",
              maxWidth: 1050,
            }}
          >
            Сайт, который{" "}
            <span style={{ color: "var(--accent)" }}>приводит клиентов</span> — под ключ
          </h1>

          <div
            className="line-draw"
            style={{ height: 1, background: "var(--border)", margin: "36px 0", maxWidth: 900 }}
          />

          <div
            className="fade-up"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 40,
              alignItems: "flex-end",
              animationDelay: "0.45s",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.1rem",
                lineHeight: 1.68,
                color: "var(--muted)",
                maxWidth: 560,
                margin: 0,
              }}
            >
              Делаю сайт для вашего бизнеса и вывожу его в топ Google и Яндекса. Не «красиво», а
              <strong style={{ color: "var(--text)" }}> с заявками и звонками</strong>: от разработки
              до потока клиентов — один исполнитель, полная ответственность.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => scrollToSection("contact")}>
                Обсудить проект →
              </button>
              <button className="btn-outline" onClick={() => scrollToSection("cases")}>
                Кейсы с цифрами
              </button>
            </div>
          </div>

          <div
            className="fade-up"
            style={{ display: "flex", gap: 56, marginTop: 72, flexWrap: "wrap" }}
          >
            {stats.map(({ n, s, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(2rem,5vw,3.5rem)",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  <Counter target={n} suffix={s} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--muted)",
                    letterSpacing: "0.1em",
                    marginTop: 4,
                    maxWidth: 160,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.2em",
              color: "var(--muted)",
              writingMode: "vertical-rl",
            }}
          >
            ПРОКРУТИТЬ
          </div>
          <div
            style={{
              width: 1,
              height: 60,
              background: "linear-gradient(to bottom, var(--muted), transparent)",
            }}
          />
        </div>
      </section>

      {/* TICKER */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 0",
          overflow: "hidden",
        }}
      >
        <div className="ticker-inner" style={{ display: "flex", width: "max-content" }}>
          {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted)",
                padding: "0 28px",
                whiteSpace: "nowrap",
              }}
            >
              {t} <span style={{ color: "var(--accent)", marginLeft: 28 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

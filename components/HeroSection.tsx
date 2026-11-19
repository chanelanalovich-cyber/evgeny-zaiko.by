"use client";

import { useEffect, useRef } from "react";
import { scrollToSection } from "@/lib/useInView";
import { Counter } from "./ui";
import type { PondHandle } from "@/lib/heroPond";

// Реальные цифры из GSC — главный аргумент для клиента
const stats = [
  { n: 15, s: "×", label: "рост трафика клиента за месяц" },
  { n: 5, s: "", label: "работающих сайтов в портфолио" },
  { n: 5, s: "+", label: "лет коммерческого опыта" },
] as const;

const tickerItems = [
  "Сайт под ключ",
  "Сайт-визитка",
  "Лендинг",
  "SEO-продвижение",
  "Автоматизация заявок",
  "Telegram-боты",
  "Next.js",
  "Интеграции CRM",
  "Техподдержка",
];

/**
 * Строка заголовка разбита на слова и буквы: каждая буква получает
 * собственный inline-block, чтобы курсор мог её качнуть (lib/heroTitle.ts).
 * Текст остаётся текстом в DOM — H1 по-прежнему один и читается как фраза.
 */
function LiquidLine({ text, lime = false }: { text: string; lime?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={lime ? "hero__line hero__line--lime" : "hero__line"}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`}>
          {wi > 0 ? " " : null}
          <span className="hero__word">
            {Array.from(word).map((ch, ci) => (
              <span className="hero__ch" key={ci}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const hostRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pondRef = useRef<PondHandle | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const title = titleRef.current;
    if (!host || !title) return;

    let cancelled = false;
    let handle: PondHandle | null = null;
    let detach: (() => void) | null = null;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const boot = async () => {
      if (cancelled) return;
      // движок и буквы грузим отдельными чанками: первый экран не ждёт WebGL
      const [{ createPond }, { attachLiquidTitle }] = await Promise.all([
        import("@/lib/heroPond"),
        import("@/lib/heroTitle"),
      ]);
      if (cancelled || !host.isConnected) return;
      handle = createPond(host);
      pondRef.current = handle;
      detach = attachLiquidTitle(title, () => pondRef.current);
    };

    // Safari без requestIdleCallback просто стартует чуть раньше
    const idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback : null;
    if (idle) {
      idleId = idle(boot, { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(boot, 400);
    }

    return () => {
      cancelled = true;
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      detach?.();
      handle?.destroy();
      pondRef.current = null;
    };
  }, []);

  return (
    <>
      <section id="hero" className="hero">
        <div ref={hostRef} className="hero__pond" aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />

        <div className="hero__stage">
          <p className="hero__kicker section-label">
            Евгений Зайко · сайты для малого бизнеса
            <span className="hero-label-extra">
              {" · "}Беларусь и русскоязычный бизнес за границей · {new Date().getFullYear()}
            </span>
          </p>

          <h1
            ref={titleRef}
            className="hero__title"
            aria-label="Сайт с заявками под ключ — за 5–7 дней"
          >
            <LiquidLine text="САЙТ С ЗАЯВКАМИ" />{" "}
            <LiquidLine text="ПОД КЛЮЧ" lime />
          </h1>

          <div className="hero__meta">
            <p className="hero__lead">
              За 5–7 дней: дизайн, код, скорость и заявки в Telegram. Один исполнитель отвечает за
              весь результат — без подписок, менеджеров и посредников.
            </p>
            <div className="hero__actions">
              <button className="btn-primary" onClick={() => scrollToSection("contact")}>
                Обсудить проект →
              </button>
              <button className="btn-outline" onClick={() => scrollToSection("cases")}>
                Кейсы с цифрами
              </button>
            </div>
          </div>
        </div>

        <div className="hero__foot">
          <div className="hero__stats">
            {stats.map(({ n, s, label }) => (
              <div className="hero__stat" key={label}>
                <div className="hero__stat-num">
                  <Counter target={n} suffix={s} />
                </div>
                <div className="hero__stat-label">{label}</div>
              </div>
            ))}
          </div>

          <div className="scroll-hint">
            <div className="scroll-hint-text">ПРОКРУТИТЬ</div>
            <div className="scroll-hint-line" />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems, ...tickerItems].map((t, i) => (
            <span className="ticker-item" key={i}>
              {t} <span className="ticker-star">✦</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

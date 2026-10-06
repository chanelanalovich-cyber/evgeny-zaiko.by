"use client";

import Link from "next/link";
import { useInView } from "@/lib/useInView";

const packages = [
  {
    num: "01",
    name: "Сайт-визитка",
    href: "/uslugi/sajt-vizitka",
    price: "530 BYN",
    promo: null,
    once: true,
    desc: "Аккуратный одностраничник для быстрого старта: дизайн, разработка, домен, базовая SEO-настройка, заявки в Telegram.",
    includes: [
      "Дизайн + разработка + адаптив",
      "Домен, хостинг, SSL — настраиваю сам",
      "Базовый SEO: title/description, Search Console, sitemap",
      "Форма заявок в Telegram",
    ],
    best: "Когда нужно быстро представлять бизнес в интернете",
    cta: "Заказать визитку",
  },
  {
    num: "02",
    name: "Сайт под ключ с SEO",
    href: "/uslugi/razrabotka-saitov",
    price: "от 900 BYN",
    promo: "760 BYN · цена первых 3 клиентов",
    once: true,
    desc: "Полный цикл: анализ запросов, контент под клиенты, вывод в топ и поток заявок. Именно так сделаны сайты из кейсов ниже.",
    includes: [
      "Анализ конкурентов и поисковых запросов",
      "SEO-контент под реальные запросы клиентов",
      "Полный конвейер: GSC + Вебмастер + IndexNow + микроразметка",
      "Аналитика + заявки в Telegram + обучение",
    ],
    best: "Когда сайт должен приносить клиентов, а не просто быть",
    cta: "Заказать под ключ",
    featured: true,
  },
  {
    num: "03",
    name: "Автоматизация заявок",
    href: "/uslugi/avtomatizaciya-biznesa",
    price: "от 500 BYN",
    promo: null,
    once: true,
    desc: "Заявки, заказы и клиенты обрабатываются роботами: боты, интеграции, уведомления. Экономит часы каждый день.",
    includes: [
      "Telegram-бот приёма заявок/заказов",
      "Интеграции: CRM, платежи, таблицы, доставка",
      "Уведомления и автоответы клиентам",
      "Передача документации и обучение",
    ],
    best: "Когда заявки уже есть, но их обработка съедает время",
    cta: "Описать задачу",
  },
];

type Pkg = (typeof packages)[0];

function PackageCard({ pkg, index }: { pkg: Pkg; index: number }) {
  const { ref, visible } = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        flex: 1,
        minWidth: 300,
        border: pkg.featured ? "1px solid var(--accent)" : "1px solid var(--border)",
        background: pkg.featured ? "rgba(200,255,0,0.03)" : "var(--bg)",
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ${index * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${index * 0.12}s cubic-bezier(0.16,1,0.3,1)`,
      }}
    >
      {pkg.promo && (
        <div
          style={{
            position: "absolute",
            top: -11,
            left: 32,
            background: "var(--accent)",
            color: "#0a0a0a",
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "4px 12px",
            fontWeight: 700,
          }}
        >
          {pkg.promo}
        </div>
      )}

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "var(--muted)",
          letterSpacing: "0.14em",
        }}
      >
        {pkg.num}
      </div>

      <div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.5rem",
            textTransform: "uppercase",
            color: "var(--text)",
            margin: 0,
            marginBottom: 8,
          }}
        >
          {pkg.name}
        </h3>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "var(--accent)",
          }}
        >
          {pkg.price}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.66rem",
            color: "var(--muted)",
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          ↳ {pkg.best}
        </div>
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
        {pkg.desc}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {pkg.includes.map((item) => (
          <li
            key={item}
            style={{
              display: "flex",
              gap: 10,
              fontSize: "0.82rem",
              color: "var(--text)",
              lineHeight: 1.5,
              alignItems: "flex-start",
            }}
          >
            <span style={{ color: "var(--accent)", flexShrink: 0 }}>✦</span>
            {item}
          </li>
        ))}
      </ul>

      {/* CTA: ссылка на посадочную услуги — перелинковка для распределения веса;
          «/uslugi/...#contact» якорит на форму на посадочной */}
      <Link
        href={pkg.href}
        className={pkg.featured ? "btn-primary" : "btn-outline"}
        style={{ marginTop: "auto", width: "100%", display: "block", textAlign: "center" }}
      >
        {pkg.cta} →
      </Link>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" style={{ padding: "120px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>
            {"// Форматы работы"}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem,4vw,3.5rem)",
              textTransform: "uppercase",
              lineHeight: 0.92,
              color: "var(--text)",
              margin: 0,
            }}
          >
            Пакеты <span style={{ color: "var(--accent)" }}>под задачу</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "stretch" }}>
          {packages.map((p, i) => (
            <PackageCard key={i} pkg={p} index={i} />
          ))}
        </div>

        {/* Перелинковка: главная → все 6 посадочных (в пакетах 3, тут — остальные 3) */}
        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 28,
            paddingTop: 24,
            borderTop: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.66rem",
              color: "var(--muted)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {"// Также делаю"}
          </span>
          <Link
            href="/uslugi/landing-page"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            Продающие лендинги →
          </Link>
          <Link
            href="/uslugi/seo-prodvizhenie"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            SEO-продвижение сайтов →
          </Link>
          <Link
            href="/uslugi/instagram-threads-avtomatizaciya"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              color: "var(--accent)",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            Чат-боты для Instagram →
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

// Реальные кейсы с данными Google Search Console — главный аргумент
const projects = [
  {
    num: "01",
    title: "Korneplod.by",
    sub: "Доставка картофеля · Минск",
    result: "19 → 288 кликов/мес из Google за месяц (+1415%)",
    resultDetail: "Позиция 8.8 → 6.9, топ-5 по «купить картофель с доставкой Минск»",
    desc: "Интернет-магазин с корзиной, оплатой и панелью заказов. Полный SEO-конвейер: Search Console, Яндекс.Вебмастер, IndexNow, микроразметка, контент-стратегия блога.",
    tags: ["Next.js", "PostgreSQL", "SEO", "E-commerce"],
    link: "https://korneplod.by",
    domain: "korneplod.by",
    color: "#1e3a1e",
    metric: "+1415%",
    metricLabel: "трафика за месяц",
  },
  {
    num: "02",
    title: "Zaiko.by",
    sub: "Бьюти-услуги · Крупки",
    result: "Позиция 2 по «ламинирование ресниц» в Google",
    resultDetail: "Показы 22 → 62/мес, запись клиентов через DIKIDI",
    desc: "Сайт-визитка мастера с онлайн-записью, галереей работ и отзывами. Полная микроразметка: BeautySalon, FAQPage, Review, AggregateRating.",
    tags: ["Next.js", "Schema.org", "Online-запись"],
    link: "https://zaiko.by",
    domain: "zaiko.by",
    color: "#2d1a2d",
    metric: "ТОП-2",
    metricLabel: "по главному запросу",
  },
  {
    num: "03",
    title: "Krunki-Master.by",
    sub: "Ручная заточка · доставка по РБ",
    result: "Переобход всех страниц Яндексе за 1 день",
    resultDetail: "FAQPage-разметка, доставка по всей Беларуси, заявки с наложенным платежом",
    desc: "Лендинг мастерской с прайсом, формой заявки и блогом. Настроен полный цикл индексации в обеих поисковых системах.",
    tags: ["React", "FAQ Schema", "Яндекс+Google"],
    link: "https://krupki-master.by",
    domain: "krupki-master.by",
    color: "#1a2430",
    metric: "1 день",
    metricLabel: "до переобхода страниц",
  },
  {
    num: "04",
    title: "Komfortremont.by",
    sub: "Ремонт и стройка · Полоцк",
    result: "10/10 страниц в индексе Яндекса",
    resultDetail: "Позиции 2–4 по «прокат инструмента» уже без активного продвижения",
    desc: "Многостраничный сайт строительной компании: 9 страниц услуг, каждая — под свой кластер запросов с ценами и JSON-LD.",
    tags: ["Next.js", "Многостраничник", "Service Schema"],
    link: "https://komfortremont.by",
    domain: "komfortremont.by",
    color: "#26171a",
    metric: "10/10",
    metricLabel: "страниц в индексе",
  },
  {
    num: "05",
    title: "Betonniy-ritm.by",
    sub: "Подъём домов · Новолукомль",
    result: "Индексация с нуля за первую неделю",
    resultDetail: "9 страниц услуг, IndexNow-пинг, OG-картинки генерируются автоматически",
    desc: "Сайт для нишевой строительной услуги: подъём домов и замена фундаментов. Запущен с полным SEO-фундаментом с первого дня.",
    tags: ["Next.js", "IndexNow", "Динамический OG"],
    link: "https://betonniy-ritm.by",
    domain: "betonniy-ritm.by",
    color: "#26261a",
    metric: "9 стр.",
    metricLabel: "в индексе за неделю",
  },
];

type Project = (typeof projects)[0];

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const { ref, visible } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="project-card"
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr auto",
        border: "1px solid var(--border)",
        background: hovered ? "rgba(255,255,255,0.02)" : "var(--bg)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ${index * 0.12}s cubic-bezier(0.16,1,0.3,1), transform 0.7s ${
          index * 0.12
        }s cubic-bezier(0.16,1,0.3,1), background 0.3s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.open(p.link, "_blank")}
    >
      {/* Метрика-результат */}
      <div
        style={{
          background: p.color,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "32px 20px",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.6rem,3vw,2.6rem)",
            color: "var(--accent)",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {p.metric}
        </div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginTop: 10,
            textAlign: "center",
            maxWidth: 140,
          }}
        >
          {p.metricLabel}
        </div>
      </div>

      {/* Контент */}
      <div
        style={{
          padding: "32px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              color: "var(--accent)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {p.sub}
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.3rem,2.2vw,1.9rem)",
              textTransform: "uppercase",
              color: "var(--text)",
              margin: 0,
              marginBottom: 12,
            }}
          >
            {p.title}
          </h3>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.92rem",
              color: "var(--text)",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            ↗ {p.result}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            {p.resultDetail}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
            {p.desc}
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {p.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Домен-ссылка */}
      <div
        style={{
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderLeft: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "2rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.08)",
          }}
        >
          {p.num}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: hovered ? "var(--accent)" : "var(--muted)",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {p.domain}
          <span
            style={{
              transform: hovered ? "translateX(5px)" : "none",
              transition: "transform 0.25s",
              display: "inline-block",
            }}
          >
            →
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { ref, visible } = useInView();

  return (
    <section id="cases" style={{ padding: "120px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition:
              "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ marginBottom: 64 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>
              // Результаты, а не обещания
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
              Кейсы <span style={{ color: "var(--accent)" }}>с цифрами</span>
            </h2>
            <p
              style={{
                color: "var(--muted)",
                marginTop: 20,
                maxWidth: 640,
                lineHeight: 1.7,
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
              }}
            >
              Все сайты живые, кликабельные. Цифры — из Google Search Console и Яндекс.Вебмастера,
              проверяемы на месте.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

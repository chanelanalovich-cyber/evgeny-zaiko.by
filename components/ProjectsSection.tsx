"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";

type CaseLayout = "shop" | "beauty" | "landing" | "services" | "builder";

interface Project {
  num: string;
  title: string;
  sub: string;
  result: string;
  resultDetail: string;
  desc: string;
  tags: string[];
  link: string;
  domain: string;
  color: string;
  metric: string;
  metricLabel: string;
  mock: { layout: CaseLayout; accent: string; word: string };
}

// Реальные кейсы — цифры из Google Search Console и Яндекс.Метрики, проверяемы на месте
const projects: Project[] = [
  {
    num: "01",
    title: "Korneplod.by",
    sub: "Интернет-магазин · Доставка по Минску",
    result: "+1415% трафика за месяц: 19 → 288 кликов из Google",
    resultDetail: "Топ-5 по «купить картофель с доставкой минск», позиция 8.8 → 6.9",
    desc: "Магазин, который продаёт, а не просто «висит в интернете»: корзина, онлайн-оплата и панель заказов, где владелец видит каждую заявку. Сверху — SEO-конвейер с первого дня: Search Console, Вебмастер, IndexNow, микроразметка, контент-план блога. Через месяц после запуска — топ-5 по главному коммерческому запросу.",
    tags: ["Next.js", "E-commerce", "SEO", "Telegram-боты"],
    link: "https://korneplod.by",
    domain: "korneplod.by",
    color: "#1e3a1e",
    metric: "+1415%",
    metricLabel: "трафика за первый месяц",
    mock: { layout: "shop", accent: "#c8ff00", word: "Картофель" },
  },
  {
    num: "02",
    title: "Zaiko.by",
    sub: "Брови и ресницы · Крупки",
    result: "«Брови крупки» — все 5 первых ссылок выдачи ведут к мастеру",
    resultDetail: "Вся первая страница Google работает на одного специалиста",
    desc: "Сайт-визитка, который забрал выдачу целого города: онлайн-запись через DIKIDI, галерея работ, живые отзывы клиентов. Разметка BeautySalon, FAQPage, Review и AggregateRating превращает сниппет в витрину — клиент записывается раньше, чем успевает сравнить конкурентов.",
    tags: ["Next.js", "Schema.org", "DIKIDI", "Локальное SEO"],
    link: "https://zaiko.by",
    domain: "zaiko.by",
    color: "#2d1a2d",
    metric: "5/5",
    metricLabel: "топ-ссылок выдачи — мастер",
    mock: { layout: "beauty", accent: "#ff7ad9", word: "Брови · Крупки" },
  },
  {
    num: "03",
    title: "Krupki-Master.by",
    sub: "Заточка ножей · Доставка по всей РБ",
    result: "Весь сайт в индексе Яндекса через сутки после запуска",
    resultDetail: "Заявки с наложенным платежом со всей Беларуси — без обзвонов",
    desc: "Лендинг мастерской заточки: понятный прайс, форма заявки и блог под живые запросы. Оплата при получении снимает страх первой покупки, а FAQPage-разметка выносит ответы прямо в поисковую выдачу. Результат — заявки на заточку идут из каждого уголка страны уже с первого месяца.",
    tags: ["React", "FAQ Schema", "Наложенный платёж"],
    link: "https://krupki-master.by",
    domain: "krupki-master.by",
    color: "#1a2430",
    metric: "100%",
    metricLabel: "страниц в индексе за сутки",
    mock: { layout: "landing", accent: "#7ad0ff", word: "Заточка" },
  },
  {
    num: "04",
    title: "Komfortremont.by",
    sub: "Прокат инструмента · Полоцк",
    result: "Позиции 2–4 по «прокат инструмента» — без бюджета на рекламу",
    resultDetail: "Каждая из 9 страниц услуг собирает свой кластер запросов",
    desc: "Многостраничник строительной компании: 9 страниц услуг с ценами и JSON-LD, каждая — под свой кластер запросов. Клиент попадает на нужную услугу прямо из выдачи, минуя главное меню. Топ-позиции по главному запросу получены чистым SEO — без единого рубля на контекст.",
    tags: ["Next.js", "9 страниц услуг", "Service Schema"],
    link: "https://komfortremont.by",
    domain: "komfortremont.by",
    color: "#26171a",
    metric: "ТОП-4",
    metricLabel: "«прокат инструмента» без рекламы",
    mock: { layout: "services", accent: "#ffb35c", word: "Прокат" },
  },
  {
    num: "05",
    title: "Betonniy-ritm.by",
    sub: "Подъём домов · Новолукомль",
    result: "От нуля до полной индексации — за первую неделю после запуска",
    resultDetail: "9 посадочных страниц, IndexNow-пинг, OG-картинки генерируются сами",
    desc: "Сайт для редкой ниши — подъём домов и замена фундаментов, где заказчик ищет исполнителя в поиске, а не по объявлению. 9 посадочных под кластеры запросов, IndexNow-пинг и автогенерация OG-картинок: поисковики забрали все страницы за неделю, и у бизнеса появилась витрина в интернете с первого дня.",
    tags: ["Next.js", "IndexNow", "Динамический OG"],
    link: "https://betonniy-ritm.by",
    domain: "betonniy-ritm.by",
    color: "#26261a",
    metric: "7 дней",
    metricLabel: "от нуля до индексации",
    mock: { layout: "builder", accent: "#ffd84d", word: "Подъём домов" },
  },
];

/* ---------- Мок-скриншот сайта: окно браузера + стилизованная вёрстка ---------- */

function Dash({
  x,
  y,
  w,
  h = 5,
  o = 0.25,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  o?: number;
}) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={2} fill={`rgba(255,255,255,${o})`} />
  );
}

function MockBody({ p }: { p: Project }) {
  const { layout, accent } = p.mock;

  if (layout === "shop") {
    return (
      <g>
        <rect x={24} y={124} width={92} height={22} rx={3} fill={accent} />
        <text
          x={70}
          y={139}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fontWeight={700}
          fill="#0a0a0a"
        >
          ЗАКАЗАТЬ
        </text>
        {[24, 122, 220].map((x) => (
          <g key={x}>
            <rect x={x} y={160} width={88} height={42} rx={3} fill="rgba(255,255,255,0.07)" />
            <rect x={x + 8} y={168} width={26} height={26} rx={2} fill="rgba(255,255,255,0.14)" />
            <Dash x={x + 42} y={172} w={34} h={5} o={0.3} />
            <rect x={x + 42} y={182} width={22} height={5} rx={2} fill={accent} opacity={0.85} />
          </g>
        ))}
      </g>
    );
  }

  if (layout === "beauty") {
    return (
      <g>
        <rect x={24} y={124} width={124} height={24} rx={12} fill={accent} />
        <text
          x={86}
          y={139.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fontWeight={700}
          fill="#0a0a0a"
        >
          ЗАПИСАТЬСЯ
        </text>
        {[70, 158, 246].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy={183}
            r={25}
            fill="rgba(255,255,255,0.08)"
            stroke={accent}
            strokeOpacity={0.55}
            strokeWidth={1.5}
          />
        ))}
      </g>
    );
  }

  if (layout === "landing") {
    return (
      <g>
        {[132, 148, 164].map((y) => (
          <g key={y}>
            <Dash x={24} y={y} w={118} />
            <rect x={152} y={y} width={36} height={5} rx={2} fill={accent} opacity={0.85} />
          </g>
        ))}
        <rect x={24} y={184} width={132} height={22} rx={3} fill={accent} />
        <text
          x={90}
          y={198.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={8.5}
          fontWeight={700}
          fill="#0a0a0a"
        >
          ОСТАВИТЬ ЗАЯВКУ
        </text>
      </g>
    );
  }

  if (layout === "services") {
    return (
      <g>
        {[
          [24, 128],
          [178, 128],
          [24, 170],
          [178, 170],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={138} height={34} rx={3} fill="rgba(255,255,255,0.07)" />
            <rect x={x + 10} y={y + 9} width={26} height={5} rx={2} fill={accent} />
            <Dash x={x + 10} y={y + 20} w={72} h={4} o={0.28} />
          </g>
        ))}
      </g>
    );
  }

  // builder: силуэт дома со стрелкой подъёма
  return (
    <g>
      <Dash x={24} y={130} w={150} />
      <Dash x={24} y={142} w={112} o={0.16} />
      <Dash x={24} y={154} w={132} o={0.16} />
      <rect x={24} y={184} width={120} height={22} rx={3} fill={accent} />
      <text
        x={84}
        y={198.5}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8.5}
        fontWeight={700}
        fill="#0a0a0a"
      >
        РАСЧЁТ ЦЕНЫ
      </text>
      <polygon
        points="240,152 278,122 316,152"
        fill="none"
        stroke={accent}
        strokeWidth={2}
      />
      <rect x={254} y={152} width={48} height={42} fill="none" stroke={accent} strokeWidth={2} />
      <rect x={272} y={174} width={13} height={20} fill={accent} />
      <path
        d="M278 114 V96 M270 104 L278 96 L286 104"
        fill="none"
        stroke={accent}
        strokeWidth={2}
      />
    </g>
  );
}

function MockPhoto({ p }: { p: Project }) {
  return (
    <svg
      viewBox="0 0 340 220"
      role="img"
      aria-label={`Макет сайта ${p.domain}`}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      {/* Хром браузера */}
      <rect width={340} height={28} fill="#0d0d0d" />
      <circle cx={14} cy={14} r={4.5} fill="#ff5f57" />
      <circle cx={31} cy={14} r={4.5} fill="#febc2e" />
      <circle cx={48} cy={14} r={4.5} fill="#28c840" />
      <rect x={64} y={7} width={212} height={14} rx={7} fill="rgba(255,255,255,0.07)" />
      <text
        x={170}
        y={16.5}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8.5}
        fill="rgba(255,255,255,0.5)"
      >
        {p.domain}
      </text>

      {/* Страница */}
      <rect y={28} width={340} height={192} fill={p.color} />
      {/* Навбар */}
      <rect x={24} y={44} width={10} height={10} fill={p.mock.accent} />
      <rect x={40} y={46} width={36} height={6} rx={3} fill="rgba(255,255,255,0.35)" />
      <Dash x={298} y={47} w={18} h={4} o={0.18} />
      <Dash x={276} y={47} w={18} h={4} o={0.18} />
      <Dash x={254} y={47} w={18} h={4} o={0.18} />
      {/* Заголовок героя */}
      <text
        x={24}
        y={92}
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize={21}
        letterSpacing={2}
        fill={p.mock.accent}
      >
        {p.mock.word.toUpperCase()}
      </text>
      <Dash x={24} y={102} w={180} h={5} o={0.22} />
      <Dash x={24} y={112} w={120} h={5} o={0.14} />
      <MockBody p={p} />
    </svg>
  );
}

/* ---------- Карточка кейса ---------- */

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const { ref, visible } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="project-card case-card"
      style={{
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
      {/* Мок-скриншот + метрика-результат */}
      <div
        className="case-media"
        style={{
          background: p.color,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MockPhoto p={p} />
        <div
          style={{
            padding: "18px 22px 22px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
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
              fontSize: "0.58rem",
              color: "var(--muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            {p.metricLabel}
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="case-content">
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

      {/* Номер + домен-ссылка */}
      <div
        className="case-side"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <span className="case-num">{p.num}</span>
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
              Все сайты живые и кликабельные. Цифры — из Google Search Console и
              Яндекс.Метрики, проверяемы на месте. Изображения в карточках — стилизованные
              макеты проектов.
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

/**
 * Данные кейсов (общий источник для секции на главной и страницы /cases).
 * Цифры — из Google Search Console и Яндекс.Метрики, проверяемы на месте.
 * services — перелинковка «какая услуга делалась в кейсе» (внутренний вес посадочных).
 */

export type CaseLayout = "shop" | "beauty" | "landing" | "services" | "builder";

export interface Project {
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
  /** Реальный скриншот сайта (desktop, public/cases). Если нет — рендерится SVG-мок */
  screenshot?: string;
  /** Услуги, которые делались в кейсе — для перелинковки с /uslugi/... */
  services: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    num: "01",
    title: "Korneplod.by",
    sub: "Интернет-магазин · Доставка по Минску",
    result: "+1415% трафика за месяц: 19 → 288 кликов из Google",
    resultDetail: "Топ-5 по «купить картофель с доставкой минск», позиция 8.8 → 6.9",
    desc: "+1415% поискового трафика за первый месяц (19 → 288 кликов из Google) и топ-5 по главному коммерческому запросу «купить картофель с доставкой минск». Рост дал готовый конвейер заявок: онлайн-оплата, панель заказов в одном окне, Telegram-бот и SEO-фундамент с первого дня (Search Console, IndexNow, микроразметка). Магазин собирает заявки, а не «висит в интернете». Хотите так же? Начнём с разбора ваших запросов.",
    tags: ["Next.js", "E-commerce", "SEO", "Telegram-боты"],
    link: "https://korneplod.by",
    domain: "korneplod.by",
    color: "#1e3a1e",
    metric: "+1415%",
    metricLabel: "трафика за первый месяц",
    mock: { layout: "shop", accent: "#c8ff00", word: "Картофель" },
    screenshot: "/cases/korneplod.by-desktop.webp",
    services: [
      { label: "Разработка сайтов под ключ", href: "/uslugi/razrabotka-saitov" },
      { label: "SEO-продвижение", href: "/uslugi/seo-prodvizhenie" },
      { label: "Автоматизация заявок", href: "/uslugi/avtomatizaciya-biznesa" },
    ],
  },
  {
    num: "02",
    title: "Zaiko.by",
    sub: "Брови и ресницы · Крупки",
    result: "«Брови крупки» — все 5 первых ссылок выдачи ведут к мастеру",
    resultDetail: "Вся первая страница Google работает на одного специалиста",
    desc: "Все 5 первых ссылок Google по запросу «брови крупки» ведут к одному мастеру. Работает связка: онлайн-запись через DIKIDI, галерея работ, живые отзывы, а BeautySalon, FAQPage, Review и AggregateRating превращают сниппет в витрину. Клиент записывается напрямую с сайта, без комиссии агрегаторов — и раньше, чем успевает сравнить конкурентов.",
    tags: ["Next.js", "Schema.org", "DIKIDI", "Локальное SEO"],
    link: "https://zaiko.by",
    domain: "zaiko.by",
    color: "#2d1a2d",
    metric: "5/5",
    metricLabel: "топ-ссылок выдачи — мастер",
    mock: { layout: "beauty", accent: "#ff7ad9", word: "Брови · Крупки" },
    screenshot: "/cases/zaiko.by-desktop.webp",
    services: [{ label: "Сайт-визитка под ключ", href: "/uslugi/sajt-vizitka" }],
  },
  {
    num: "03",
    title: "Krupki-Master.by",
    sub: "Заточка ножей · Доставка по всей РБ",
    result: "Весь сайт в индексе Яндекса через сутки после запуска",
    resultDetail: "Заявки с наложенным платежом со всей Беларуси — без обзвонов",
    desc: "Понятный прайс, заявка в один шаг и оплата при получении сняла страх первой покупки — заявки со всей Беларуси пошли в первый же месяц, а Яндекс проиндексировал весь сайт за сутки после запуска. FAQPage-разметка выносит ответы прямо в выдачу. Мастеру не нужно обзванивать область, заявки приходят сами.",
    tags: ["React", "FAQ Schema", "Наложенный платёж"],
    link: "https://krupki-master.by",
    domain: "krupki-master.by",
    color: "#1a2430",
    metric: "100%",
    metricLabel: "страниц в индексе за сутки",
    mock: { layout: "landing", accent: "#7ad0ff", word: "Заточка" },
    screenshot: "/cases/krupki-master.by-desktop.webp",
    services: [{ label: "Продающий лендинг", href: "/uslugi/landing-page" }],
  },
  {
    num: "04",
    title: "Komfortremont.by",
    sub: "Прокат инструмента · Полоцк",
    result: "Позиции 2–4 по «прокат инструмента» — без бюджета на рекламу",
    resultDetail: "Каждая из 9 страниц услуг собирает свой кластер запросов",
    desc: "Позиции 2–4 по «прокат инструмента» — без единого рубля на рекламу. Клиент попадает на нужную услугу прямо из выдачи: 9 страниц с ценами и Service-разметкой, каждая под свой кластер запросов, минуя главное меню. Для сезонного проката это поток звонков без рекламной ставки; позиции не привязаны к ежемесячному бюджету.",
    tags: ["Next.js", "9 страниц услуг", "Service Schema"],
    link: "https://komfortremont.by",
    domain: "komfortremont.by",
    color: "#26171a",
    metric: "ТОП-4",
    metricLabel: "«прокат инструмента» без рекламы",
    mock: { layout: "services", accent: "#ffb35c", word: "Прокат" },
    screenshot: "/cases/komfortremont.by-desktop.webp",
    services: [{ label: "Разработка сайтов под ключ", href: "/uslugi/razrabotka-saitov" }],
  },
  {
    num: "05",
    title: "Betonniy-ritm.by",
    sub: "Подъём домов · Новолукомль",
    result: "От нуля до полной индексации — за первую неделю после запуска",
    resultDetail: "9 посадочных страниц, IndexNow-пинг, OG-картинки генерируются сами",
    desc: "От нуля до полной индексации за 7 дней — и у редкой ниши появилась витрина с первого дня. Подъём домов и замена фундаментов относятся к нишам, где заказчик ищет исполнителя в поиске, а не по объявлению. Дали 9 посадочных под кластеры запросов, IndexNow-пинг и автогенерацию OG-картинок — переобход разогнался без ручной работы с роботами.",
    tags: ["Next.js", "IndexNow", "Динамический OG"],
    link: "https://betonniy-ritm.by",
    domain: "betonniy-ritm.by",
    color: "#26261a",
    metric: "7 дней",
    metricLabel: "от нуля до индексации",
    mock: { layout: "builder", accent: "#ffd84d", word: "Подъём домов" },
    screenshot: "/cases/betonniy-ritm.by-desktop.webp",
    services: [{ label: "Разработка сайтов под ключ", href: "/uslugi/razrabotka-saitov" }],
  },
];

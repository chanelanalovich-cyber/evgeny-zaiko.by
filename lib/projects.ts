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
    desc: "Магазин, который продаёт, а не просто «висит в интернете»: корзина, онлайн-оплата и панель заказов, где владелец видит каждую заявку. Сверху — SEO-конвейер с первого дня: Search Console, Вебмастер, IndexNow, микроразметка, контент-план блога. Через месяц после запуска — топ-5 по главному коммерческому запросу.",
    tags: ["Next.js", "E-commerce", "SEO", "Telegram-боты"],
    link: "https://korneplod.by",
    domain: "korneplod.by",
    color: "#1e3a1e",
    metric: "+1415%",
    metricLabel: "трафика за первый месяц",
    mock: { layout: "shop", accent: "#c8ff00", word: "Картофель" },
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
    desc: "Сайт-визитка, который забрал выдачу целого города: онлайн-запись через DIKIDI, галерея работ, живые отзывы клиентов. Разметка BeautySalon, FAQPage, Review и AggregateRating превращает сниппет в витрину — клиент записывается раньше, чем успевает сравнить конкурентов.",
    tags: ["Next.js", "Schema.org", "DIKIDI", "Локальное SEO"],
    link: "https://zaiko.by",
    domain: "zaiko.by",
    color: "#2d1a2d",
    metric: "5/5",
    metricLabel: "топ-ссылок выдачи — мастер",
    mock: { layout: "beauty", accent: "#ff7ad9", word: "Брови · Крупки" },
    services: [{ label: "Сайт-визитка под ключ", href: "/uslugi/sajt-vizitka" }],
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
    services: [{ label: "Продающий лендинг", href: "/uslugi/landing-page" }],
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
    services: [{ label: "Разработка сайтов под ключ", href: "/uslugi/razrabotka-saitov" }],
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
    services: [{ label: "Разработка сайтов под ключ", href: "/uslugi/razrabotka-saitov" }],
  },
];

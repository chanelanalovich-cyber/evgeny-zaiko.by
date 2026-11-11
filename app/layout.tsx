import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import YandexMetrika from "@/components/YandexMetrika";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PhoneClickTracker from "@/components/PhoneClickTracker";
import CallButton from "@/components/CallButton";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
const SITE_NAME = "Евгений Зайко — сайты с клиентами под ключ";

// Только реально используемые начертания: каждое лишнее — это отдельный файл
// woff2 в <link rel="preload"> и лишняя конкуренция с CSS за полосу на мобильном.
const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

// Inter предзагружается: если он придёт после первой отрисовки, подмена шрифта
// меняет высоту текста и сдвигает центрированный hero (CLS). Mono — только
// мелкие подписи, его можно не предзагружать: файлы не конкурируют с CSS.
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Сайты с заявками под ключ — для русского бизнеса | Зайко",
    template: "%s | Евгений Зайко",
  },
  description:
    "Сайты под ключ с SEO: лендинги и визитки от 600 BYN, 5–7 дней. Реальный кейс: рост поискового трафика с 19 до 288 кликов в месяц. Домен, хостинг, заявки — в цене. Расчёт за 1 день.",
  keywords: [
    "разработка сайта под ключ беларусь",
    "создание сайтов минск",
    "seo продвижение сайта минск",
    "заказать лендинг беларусь",
    "вывод сайта в топ",
    "сайт для малого бизнеса",
    "разработка сайтов полоцк",
    "автоматизация заявок",
    "евгений зайко разработчик",
  ],
  authors: [{ name: "Евгений Зайко", url: SITE_URL }],
  creator: "Евгений Зайко",
  publisher: "Евгений Зайко",
  // canonical намеренно НЕ задаётся здесь: значение из layout наследовалось
  // любой страницей без своего metadata (включая 404), и такие URL молча
  // канонизировались на главную. Теперь canonical объявляет сама страница
  // (app/page.tsx для главной, остальные — в своих metadata).
  verification: {
    google: "QLy0JClFzAhEnJUv2yUkP95bN0TUzdtDE784k9UN2pQ",
    yandex: "89763e265512c83d",
  },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Сайт с заявками под ключ — за 5–7 дней",
    description:
      "Сайты для малого бизнеса с заявками с первого дня: лендинг или визитка от 600 BYN, без абонплаты и менеджеров. 5 живых кейсов с цифрами.",
  },
  // twitter: title/description намеренно НЕ задаём на уровне layout: значения
  // наследовались всеми страницами, и twitter:title был одинаковым на всех URL.
  // Без них X/Twitter берёт og:title/og:description — они у каждой страницы свои.
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html
      lang="ru"
      className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}

        {/* Яндекс.Метрика — отложенная загрузка, не влияет на TBT.
            Номер счётчика вписать в components/YandexMetrika.tsx. */}
        {isProduction && <YandexMetrika enabled={isProduction} />}

        {/* GA4 — отложенная загрузка. ID вписать в components/GoogleAnalytics.tsx */}
        {isProduction && <GoogleAnalytics enabled={isProduction} />}

        {/* Глобальный трекер кликов по телефонным ссылкам → GA4 tel_click */}
        {isProduction && <PhoneClickTracker />}

        {/* Кнопка «Позвонить» — sitewide, видна только на мобильной ширине */}
        <CallButton />
      </body>
    </html>
  );
}

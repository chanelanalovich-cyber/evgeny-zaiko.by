import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import YandexMetrika from "@/components/YandexMetrika";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PhoneClickTracker from "@/components/PhoneClickTracker";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
const SITE_NAME = "Евгений Зайко — сайты с клиентами под ключ";

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Сайты с заявками под ключ — для русского бизнеса | Зайко",
    template: "%s | Евгений Зайко",
  },
  description:
    "Сайты под ключ с SEO: лендинги и визитки от 400 BYN, 5–7 дней. Реальный кейс: рост поискового трафика с 19 до 288 кликов в месяц. Домен, хостинг, заявки — в цене. Расчёт за 1 день.",
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
  alternates: {
    canonical: SITE_URL,
  },
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
      "Сайты для малого бизнеса с заявками с первого дня: лендинг от 400 BYN, визитка от 530 BYN, без абонплаты и менеджеров. 5 живых кейсов с цифрами.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Сайт с заявками под ключ — за 5–7 дней | Евгений Зайко",
    description:
      "Сайты для малого бизнеса под ключ с заявками. Кейс: рост трафика с 19 до 288 кликов/мес.",
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
      </body>
    </html>
  );
}

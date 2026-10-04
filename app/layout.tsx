import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import YandexMetrika from "@/components/YandexMetrika";
import GoogleAnalytics from "@/components/GoogleAnalytics";
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
    default: "Разработка сайтов под ключ с SEO — Беларусь | Евгений Зайко",
    template: "%s | Евгений Зайко",
  },
  description:
    "Разработка сайтов под ключ с SEO-продвижением: лендинги, сайт-визитки, корпоративные сайты, интернет-магазины. Реальные кейсы: +1415% трафика за месяц. Заявки в Telegram. Беларусь, работаю удалённо.",
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
    // Вставить коды после добавления ресурсов в GSC и Яндекс.Вебмастер
    google: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    yandex: "XXXXXXXXXXXXXXXXXXXX",
  },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Сайт + топ выдачи + заявки вам в Telegram — под ключ",
    description:
      "Разработка сайтов с SEO для малого бизнеса Беларуси. Живой кейс: рост поискового трафика с 19 до 288 кликов/мес за один месяц. Портфолио из 5 работающих сайтов.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Сайт + топ выдачи + заявки — под ключ | Евгений Зайко",
    description:
      "Разработка сайтов с SEO для бизнеса Беларуси. Кейс: +1400% трафика за месяц.",
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
      </body>
    </html>
  );
}

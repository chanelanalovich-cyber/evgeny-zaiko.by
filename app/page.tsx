import Nav from "@/components/Nav";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: "Евгений Зайко — разработка сайтов с SEO",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      description:
        "Разработка сайтов под ключ с SEO-продвижением для малого бизнеса Беларуси. Сайт + топ выдачи + заявки.",
      priceRange: "BYN 400 - BYN 3000",
      email: "zaiko.eugene@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BY",
        addressLocality: "Полоцк",
      },
      areaServed: [
        { "@type": "Country", name: "Беларусь" },
        { "@type": "City", name: "Минск" },
        { "@type": "City", name: "Полоцк" },
      ],
      knowsAbout: [
        "Разработка сайтов",
        "SEO-продвижение",
        "Автоматизация",
        "Telegram-боты",
        "Интеграции CRM",
      ],
      sameAs: ["https://t.me/rahunak", "https://www.linkedin.com/in/eugene-zaiko"],
      founder: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Евгений Зайко",
      url: SITE_URL,
      jobTitle: "Веб-разработчик и SEO-специалист",
      description:
        "Full-stack разработчик: сайты под ключ, SEO-продвижение и автоматизация бизнеса. Автор кейсов korneplod.by, krupki-master.by, zaiko.by.",
      knowsAbout: [
        "Разработка сайтов",
        "SEO-продвижение",
        "Next.js",
        "Автоматизация бизнеса",
        "Telegram-боты",
        "ИИ-агенты",
      ],
      sameAs: ["https://t.me/rahunak", "https://www.linkedin.com/in/eugene-zaiko"],
      worksFor: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Евгений Зайко — сайты с клиентами под ключ",
      inLanguage: "ru-BY",
      publisher: { "@id": `${SITE_URL}/#business` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Сколько стоит сайт под ключ?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Сайт-визитка — от 530 BYN, продающий лендинг — от 400 BYN, корпоративный сайт с SEO — от 900 BYN (первые клиенты — 760 BYN). В цену входит всё до рабочего сайта: дизайн, разработка, домен, хостинг и приём заявок в Telegram.",
          },
        },
        {
          "@type": "Question",
          name: "Сколько времени занимает разработка сайта?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Лендинг или сайт-визитку запускаю за 5–7 рабочих дней, корпоративный сайт — 2–3 недели, интернет-магазин — 3–5 недель. Срок фиксируется до старта работ.",
          },
        },
        {
          "@type": "Question",
          name: "Почему не конструктор Tilda или Wix?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Конструктор требует вечной подписки, медленно загружается и ограничивает SEO: структуру, микроразметку, скорость. Сайт на Next.js принадлежит вам навсегда, без абонплаты, и заметно быстрее — а скорость напрямую влияет на позиции в Google и Яндексе.",
          },
        },
        {
          "@type": "Question",
          name: "Сайт попадёт в топ Google и Яндекса?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Техническая база и структура под поисковые запросы дают вход в топ по низкочастотным запросам за первые недели. По конкурентным запросам позиции растут от регулярного контента и ссылок — это задача SEO-продвижения. Кейс: рост трафика клиента с 19 до 288 кликов в месяц.",
          },
        },
        {
          "@type": "Question",
          name: "Что нужно от меня для старта?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Короткий бриф: чем занимаетесь и кто ваши клиенты. Дальше сам: анализ запросов, структура, тексты, дизайн — согласование на каждом этапе. Заявки приходят в Telegram с первого дня запуска.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

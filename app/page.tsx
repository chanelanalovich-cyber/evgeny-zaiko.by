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
  "@type": "ProfessionalService",
  name: "Евгений Зайко - разработка сайтов с SEO",
  url: SITE_URL,
  description:
    "Разработка сайтов под ключ с SEO-продвижением для малого бизнеса Беларуси. Сайт + топ выдачи + заявки.",
  areaServed: { "@type": "Country", name: "Беларусь" },
  priceRange: "BYN 400 - BYN 3000",
  knowsAbout: [
    "Разработка сайтов",
    "SEO-продвижение",
    "Автоматизация",
    "Telegram-боты",
    "Интеграции CRM",
  ],
  sameAs: ["https://t.me/rahunak", "https://www.linkedin.com/in/eugene-zaiko"],
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

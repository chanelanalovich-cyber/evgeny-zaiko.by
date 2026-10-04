import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных на сайте evgeny-zaiko.by: какие данные собираются, зачем и как они защищаются.",
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: false },
};

const sections = [
  {
    h: "1. Общие положения",
    p: [
      "Настоящая политика описывает, какие персональные данные обрабатываются на сайте evgeny-zaiko.by (далее — Сайт), с какой целью и как они защищаются. Отправляя форму на Сайте, вы соглашаетесь с этой политикой.",
    ],
  },
  {
    h: "2. Кто обрабатывает данные",
    p: [
      "Оператор данных — Евгений Зайко (индивидуальный исполнитель). Контакт для вопросов о данных: zaiko.eugene@gmail.com.",
    ],
  },
  {
    h: "3. Какие данные собираются",
    p: [
      "Через форму заявки: имя, контакт (телеграм-ник, email или телефон) и текст сообщения — вы указываете их добровольно.",
      "Технические данные через системы аналитики: обезличенная статистика посещений от Google Analytics и Яндекс.Метрики (файлы cookie, источник перехода, устройство). Эти сервисы могут устанавливать собственные cookie-файлы — их политики: policies.google.com и yandex.ru/legal/confidential.",
    ],
  },
  {
    h: "4. Зачем нужны данные",
    p: [
      "Данные формы используются исключительно для связи с вами по вашей заявке: расчёт стоимости, уточнение деталей, подготовка предложения. Аналитика — для понимания, какие страницы полезны посетителям.",
      "Данные не продаются, не передаются третьим лицам и не используются для рассылок без вашего согласия.",
    ],
  },
  {
    h: "5. Хранение и защита",
    p: [
      "Заявки хранятся в рабочей переписке (Telegram/email оператора) сроком до 2 лет или до вашей просьбы удалить. Передача данных между вами и Сайтом защищена HTTPS (SSL-сертификат). Доступ к данным имеет только оператор.",
    ],
  },
  {
    h: "6. Ваши права",
    p: [
      "Вы можете запросить сведения о своих данных, их исправление или удаление в любой момент — напишите на zaiko.eugene@gmail.com, и данные будут удалены в течение 3 рабочих дней.",
      "Вы можете отключить cookie аналитики в настройках браузера — на работу Сайта это не повлияет.",
    ],
  },
  {
    h: "7. Изменения политики",
    p: [
      "Актуальная редакция всегда находится на этой странице. Существенные изменения публикуются с новой датой редакции: 4 октября 2026 г.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="noise" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <main id="main-content" style={{ padding: "140px 32px 120px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <nav style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", letterSpacing: "0.1em", marginBottom: 40 }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>ГЛАВНАЯ</Link>
            {" / "}
            <span style={{ color: "var(--accent)" }}>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</span>
          </nav>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.8rem,4vw,3rem)",
              textTransform: "uppercase",
              lineHeight: 1,
              color: "var(--text)",
              margin: 0,
              marginBottom: 48,
            }}
          >
            Политика <span style={{ color: "var(--accent)" }}>конфиденциальности</span>
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {sections.map((s) => (
              <section key={s.h}>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.15rem", color: "var(--text)", marginBottom: 14 }}>
                  {s.h}
                </h2>
                {s.p.map((t, i) => (
                  <p key={i} style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.8, margin: "0 0 10px" }}>
                    {t}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

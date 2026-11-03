/**
 * Отправка конверсионных событий в GA4 (gtag.js подключён в components/GoogleAnalytics.tsx).
 * gtag может быть ещё не инициализирован (ленивая загрузка после первого
 * взаимодействия) — тогда событие кладём в dataLayer: gtag.js разберёт очередь
 * после загрузки.
 *
 * Активные события (не менять имена без сверки с GSC-планом и GA4):
 *  generate_lead  — отправка формы (ContactSection) — ГЛАВНАЯ конверсия;
 *  contact_click  — клик Telegram/email/LinkedIn (ContactSection, param: channel);
 *  tel_click      — клик по a[href^="tel:"] (PhoneClickTracker; пока tel-ссылок
 *                   на сайте нет — событие в reserve, сработает при появлении номеров).
 */
interface GtagWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params);
  } else {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(["event", name, params ?? {}]);
  }
}

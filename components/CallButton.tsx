import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

/**
 * Мобильная кнопка «Позвонить»: фиксирована у нижнего края экрана на ширине
 * ≤860px (стили — .call-button в app/globals.css), на десктопе скрыта.
 * Ссылка tel: открывает нативный дозвон, клик ловит PhoneClickTracker → GA4 tel_click.
 */
export default function CallButton() {
  return (
    <a
      href={`tel:${PHONE_TEL}`}
      className="call-button"
      data-tel-source="mobile-sticky"
      aria-label={`Позвонить по номеру ${PHONE_DISPLAY}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      Позвонить
    </a>
  );
}

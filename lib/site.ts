/**
 * Единый источник правды о домене сайта — импортировать везде,
 * где нужен канонический URL (metadata, sitemap, robots, JSON-LD, письма).
 *
 * 2026-10-04: владелец выбрал каноническим домен evgeny-zaiko.by
 * (отдельная зона надёжнее субдомена). eugene.zaiko.by отдаёт 404
 * DEPLOYMENT_NOT_FOUND от Vercel (деплой отвязан) — если этот субдомен
 * нужен как зеркало, его 301-редирект настраивается на уровне DNS/хостинга
 * zaiko.by, не в этом приложении.
 *
 * История решений:
 *  2026-10-03 — eugene.zaiko.by (субдомен; wildcard-сертификат *.zaiko.by не
 *               покрывает www.eugene — редирект www тогда делался в next.config.ts)
 *  2026-10-04 — evgeny-zaiko.by (выбор владельца)
 */
export const SITE_URL = "https://evgeny-zaiko.by";

/** Отображаемая форма домена (для футеров, OG-картинки, текста писем). */
export const SITE_HOST = "evgeny-zaiko.by";

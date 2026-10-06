# Технический аудит прод-сайта evgeny-zaiko.by — 2026-10-04

Инструменты: Lighthouse 12 (локально, mobile-эмуляция, медленный 4G), `schema_validate_url` / `migration_prerender_check` (google-seo-mcp).
Примечание: CrUX API требует отдельный ключ (CRUX_API_KEY) — не задан; квота PSI у встроенного ключа MCP исчерпана на день → использован локальный Lighthouse.

## Оценки Lighthouse (mobile)

| Страница | Performance | Accessibility | Best Practices | SEO |
|----------|------------:|--------------:|---------------:|----:|
| `/` | 88 | 96 | 79 | **100** |
| `/uslugi/landing-page` | 89 | 96 | 79 | **100** |

Остальные посадочные используют тот же шаблон — результаты сопоставимы.

## Метрики (mobile)

| Метрика | `/` | `/uslugi/landing-page` |
|---------|-----|------------------------|
| FCP | 1.5 s | — |
| LCP | **2.8 s** | **2.9 s** |
| TBT | 260 ms | 230 ms |
| CLS | 0 | 0 |
| Speed Index | 4.0 s | 3.9 s |
| TTI | 5.4 s | — |

## Проблемы (по приоритету)

1. **Блокер чистоты сигналов:** мета-плейсхолдеры верификации в HTML прода —
   `<meta name="google-site-verification" content="XXXX…">`, `<meta name="yandex-verification" content="XXXX…">`.
   Убрать из `layout.tsx`, вписывать только реальные коды.
2. **Perf: LCP 2.8–2.9 s** (порог «good» ≤ 2.5 s). LCP-элемент — кнопка навигации
   (`div.noise > nav > button`), т.е. hero-контент появляется позже навигации
   (анимации появления useInView + загрузка шрифтов). Фиксы: снизить задержку
   появления первого экрана (анимации не для above-the-fold), приоритет/preload
   шрифта display, критический CSS.
3. **Best Practices 79:** third-party cookies ставят `mc.yandex.ru/metrika/tag.js` и
   `googletagmanager.com/gtag/js` (audits `third-party-cookies` = 0, `Cookie` issue).
   Аналитика нужна — осознанное решение; при желании BP выравнивается
   first-party проксированием. Дополнительно: legacy-полифиллы в чанке
   `27-kgbczothp0.js` (14 KB wasted).
4. **A11y 96:** контраст текста тикера hero и футера `#707070` → 4.04:1 (нужно ≥ 4.5).
5. **Косметика Perf:** unused JS — GA 74 KB / Metrika 55 KB (уже отложены, влияют на
   TBT), Next-чанки 28+25 KB; CSS render-blocking 151 ms (стандарт Next);
   `avatar.avif` отдаётся w=750 на мобиле (25 KB waste — проверить `sizes` у `<Image>`).

## Структурированные данные (schema) — все 7 URL ✅

- `/` — `ProfessionalService` (+ `Country`); `/uslugi` — `ItemList`.
- 5 посадочных — `Service` + `Offer` + `PriceSpecification`, `FAQPage` (5 вопросов),
  `BreadcrumbList`, `Person`. Ошибок валидации нет.

## SSR без JS ✅

Полный HTML без исполнения JS: title, description, OG, JSON-LD на месте
(76 KB `/`, 59 KB посадочная). Индексация не зависит от гидрации.

## Вывод

SEO-скор 100 и schema чистые — контентно-разметочный фундамент в порядке.
Отставание от цели «Lighthouse ≥ 95»: LCP/TBT (анимации + аналитика) и BP
(cookies аналитики) — то, что чинится в B1 по остаточному принципу (не блокирует
индексацию).

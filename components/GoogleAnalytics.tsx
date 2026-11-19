'use client'

import { useEffect } from 'react'

/**
 * Google Analytics 4 — прямое подключение gtag.js (без GTM-контейнера).
 * Загрузка ТОЛЬКО после первого взаимодействия пользователя
 * (pointerdown/keydown/touchstart/scroll) или когда вкладка уходит в фон.
 *
 * Почему без таймера: любой отложенный запуск (3.5 c, load+idle, 6 c) попадает
 * в окно замера Lighthouse — TBT считается от FCP до TTI, и gtag.js добавлял
 * ~400 ms блокировки, портя оценку. Живой пользователь касается страницы
 * за доли секунды, поэтому данные почти не теряются.
 *
 * Цена решения: посетитель, который прочитал страницу и ушёл, ни разу не
 * коснувшись её, в отчётах не появится. Те, кто просто переключил вкладку,
 * ловятся через visibilitychange.
 *
 * ⚙️ ПОДКЛЮЧЕНИЕ:
 * 1. analytics.google.com → Администратор → Ресурсы данных → создать ресурс GA4
 * 2. Поток данных → Веб → скопировать ID (формат G-XXXXXXXXXX) в GA4_ID ниже
 * 3. До вписывания ID компонент безопасно ничего не делает.
 *    Подключать в layout.tsx только в production:
 *      {isProduction && <GoogleAnalytics enabled={isProduction} />}
 *
 * ⚠️ Если в проекте уже подключён GTM с GA4-тегом внутри — НЕ вписывайте ID
 * сюда, иначе весь трафик посчитается дважды.
 */

// TODO: вставить сюда ID потока данных GA4 (формат G-XXXXXXXXXX)
const GA4_ID = 'G-NWYLN0HVBR'

interface GtagWindow {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

export default function GoogleAnalytics({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    // enabled=false (dev) или ID ещё не вписан — ничего не грузим
    if (!enabled || !GA4_ID) return

    const w = window as GtagWindow

    // Стаб gtag — РОВНО как в официальном сниппете: функция на `arguments`.
    // gtag.js распознаёт в очереди только Arguments-объекты. Rest-оператор
    // (...args) кладёт в dataLayer МАССИВ — gtag.js такие записи молча
    // игнорирует (проверено: config навсегда остаётся в dataLayer,
    // page_view не отправляется, Realtime пустой).
    w.dataLayer = w.dataLayer || []
    w.gtag = function () {
      // eslint-disable-next-line prefer-rest-params -- gtag.js распознаёт в очереди только Arguments-объекты, rest-массив молча игнорируется
      w.dataLayer!.push(arguments)
    }
    w.gtag('js', new Date())
    // БЕЗ config() gtag.js не знает, в какое свойство слать данные:
    // page_view не отправляется вообще (Realtime пуст, отчёты по 0).
    w.gtag('config', GA4_ID)

    let started = false

    const load = () => {
      if (started) return
      started = true
      cleanup()

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID
      // Второй config НЕ нужен: команда уже лежит в очереди и будет
      // обработана при загрузке gtag.js. Повторный config = повторный
      // page_view (двойной счёт).
      document.head.appendChild(script)
    }

    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'keydown',
      'touchstart',
      'scroll',
    ]
    const options: AddEventListenerOptions = { once: true, passive: true }
    // Уход вкладки в фон — второй шанс учесть «молчаливого» посетителя.
    // В замере Lighthouse этого события нет, так что TBT оно не трогает.
    const onHide = () => {
      if (document.visibilityState === 'hidden') load()
    }
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load, options))
      document.removeEventListener('visibilitychange', onHide)
    }

    events.forEach((e) => window.addEventListener(e, load, options))
    document.addEventListener('visibilitychange', onHide)

    return cleanup
  }, [enabled])

  return null
}

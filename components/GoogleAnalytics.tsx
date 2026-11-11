'use client'

import { useEffect } from 'react'

/**
 * Google Analytics 4 — прямое подключение gtag.js (без GTM-контейнера).
 * Загрузка после первого взаимодействия пользователя
 * (pointerdown/keydown/touchstart/scroll) ИЛИ после полной загрузки страницы,
 * в простое браузера (load → requestIdleCallback).
 *
 * Почему не таймер: фиксированные 3.5 c попадали в окно замера Lighthouse
 * (LCP ~3–4 c, TBT считается до TTI) — gtag.js добавлял ~400 ms блокировки
 * главного потока и удлинял TTI. Привязка к load + idle гарантирует, что
 * первый экран и LCP уже отрисованы, когда скрипт начинает грузиться.
 * На живых пользователях данные не теряются: первое взаимодействие случается
 * раньше idle, а для «молчаливых» читателей срабатывает idle/timeout.
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

/**
 * Минимальная выдержка от начала навигации до загрузки счётчика (без взаимодействия).
 * `load` на этом сайте наступает рано (~0.4 c), и одного idle недостаточно:
 * gtag.js стартовал в 1.3 c, то есть до LCP, и давал ~400 ms TBT.
 * Живые визиты не теряются: любое взаимодействие грузит счётчик сразу.
 */
const FALLBACK_DELAY_MS = 6000

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
    let idleHandle: number | null = null
    let fallbackTimer = 0
    let scheduleIdle: () => void = () => {}

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
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, load, options))
      window.removeEventListener('load', scheduleIdle)
      if (idleHandle !== null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle)
      }
      idleHandle = null
      window.clearTimeout(fallbackTimer)
    }

    events.forEach((e) => window.addEventListener(e, load, options))

    // Fallback для «молчаливых» посетителей: после load ждём idle-окно,
    // таймер 5 c — страховка, если простоя так и не будет.
    scheduleIdle = () => {
      const run = () => {
        idleHandle = null
        load()
      }
      const remaining = Math.max(0, FALLBACK_DELAY_MS - performance.now())
      fallbackTimer = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === 'function') {
          idleHandle = window.requestIdleCallback(run, { timeout: 3000 })
        } else {
          run()
        }
      }, remaining)
    }

    if (document.readyState === 'complete') {
      scheduleIdle()
    } else {
      window.addEventListener('load', scheduleIdle, { once: true })
    }

    return cleanup
  }, [enabled])

  return null
}

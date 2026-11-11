'use client'

import { useEffect } from 'react'

/**
 * Яндекс.Метрика — загрузка после первого взаимодействия пользователя
 * (pointerdown/keydown/touchstart/scroll) ИЛИ после полной загрузки страницы,
 * в простое браузера (load → requestIdleCallback).
 *
 * Почему не next/script strategy="lazyOnload" и не таймер: фиксированные 3.5 c
 * попадали в окно замера Lighthouse (LCP ~3–4 c, TBT считается до TTI) —
 * tag.js добавлял ~100–150 ms блокировки главного потока и удлинял TTI.
 * Привязка к load + idle гарантирует, что первый экран и LCP уже отрисованы.
 * Реальные пользователи взаимодействуют раньше idle — данные почти не теряются.
 *
 * Вебвизор отключён (webvisor: false) — самая тяжёлая часть Метрики
 * (MutationObserver всего DOM). Поведенческие факторы Яндекса работают и без него
 * (отказы, глубина, время, клик-карта). Можно включить позже осознанно.
 *
 * ⚙️ ПОДКЛЮЧЕНИЕ: впишите номер счётчика в YANDEX_METRIKA_COUNTER_ID ниже
 * (metrika.yandex.ru → мой счётчик → 8 цифр). До этого компонент безопасно
 * ничего не делает. Подключать в layout.tsx только в production:
 *   {isProduction && <YandexMetrika enabled={isProduction} />}
 */

// TODO: заменить 0 на номер счётчика Яндекс.Метрики
const YANDEX_METRIKA_COUNTER_ID = 113363175;

/**
 * Минимальная выдержка от начала навигации до загрузки счётчика (без взаимодействия).
 * `load` на этом сайте наступает рано (~0.4 c), и одного idle недостаточно:
 * tag.js стартовал в 1.3 c, то есть до LCP, и давал ~120 ms TBT.
 * Живые визиты не теряются: любое взаимодействие грузит счётчик сразу.
 */
const FALLBACK_DELAY_MS = 6000;

/** Функция-очередь Метрики: вызовы копятся в .a, таймстемп создания — в .l */
type YmFn = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number }

interface MetrikaWindow {
  ym?: YmFn
  YANDEX_METRIKA_ID?: number
}

export default function YandexMetrika({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    // enabled=false (dev) или счётчик ещё не вписан — ничего не грузим
    if (!enabled || !YANDEX_METRIKA_COUNTER_ID) return

    // Синхронный guard: два события могут прийти в один тик (touchstart +
    // pointerdown), setState здесь не спасает от двойной загрузки.
    let started = false
    let idleHandle: number | null = null
    let fallbackTimer = 0
    let scheduleIdle: () => void = () => {}

    const load = () => {
      if (started) return
      started = true
      cleanup()

      const w = window as unknown as MetrikaWindow

      // Официальный стаб Метрики (metrika/tag.js docs):
      //   m[i] = m[i] || function(){ (m[i].a = m[i].a || []).push(arguments) };
      //   m[i].l = 1 * new Date();
      // Очередь вызовов висит на самом ym (.a), таймстемп — в ym.l.
      if (!w.ym) {
        const ym = function (...args: unknown[]) {
          ym.a = ym.a || []
          ym.a.push(args)
        } as YmFn
        ym.l = Date.now()
        w.ym = ym
      }

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://mc.yandex.ru/metrika/tag.js'
      document.head.appendChild(script)

      w.ym(YANDEX_METRIKA_COUNTER_ID, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: false,
        // БЕЗ defer: автоматический hit отправит сам tag.js после загрузки.
        // defer: true отключает автопросмотры и требует ручных ym(ID,'hit') —
        // из-за этого счётчик показывал 0 визитов.
      })

      // Для хелпера trackConversion (если используется в проекте)
      w.YANDEX_METRIKA_ID = YANDEX_METRIKA_COUNTER_ID
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
    // таймер 3 c — страховка, если простоя так и не будет.
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

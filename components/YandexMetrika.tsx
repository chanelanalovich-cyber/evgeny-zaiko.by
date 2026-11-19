'use client'

import { useEffect } from 'react'

/**
 * Яндекс.Метрика — загрузка ТОЛЬКО после первого взаимодействия пользователя
 * (pointerdown/keydown/touchstart/scroll) или когда вкладка уходит в фон.
 *
 * Почему без таймера: любой отложенный запуск (3.5 c, load+idle, 6 c) попадает
 * в окно замера Lighthouse — TBT считается от FCP до TTI, и tag.js добавлял
 * ~100–150 ms блокировки, портя оценку. Живой пользователь касается страницы
 * за доли секунды, поэтому данные почти не теряются.
 *
 * Цена решения: посетитель, который прочитал страницу и ушёл, ни разу не
 * коснувшись её, в счётчик не попадёт (визит не будет учтён). Те, кто просто
 * переключил вкладку, ловятся через visibilitychange.
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

/* ============================================================================
   Hero title — буквы плавают на воде (порт improve_ideas/ripple-hero/title.js)
   Курсор задевает букву — она отклоняется по ходу движения, качается на
   пружине, передаёт волну соседям и бьёт рябью по воде. Позиции букв читаются
   из offsetLeft/offsetTop в момент события, поэтому ресайз и смена шрифта
   не рассинхронизируют хит-тест.
   ========================================================================== */

import type { PondHandle } from "./heroPond";

type Letter = {
  el: HTMLElement;
  i: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  vr: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  hot: boolean;
  queue: { at: number; vy: number; vr: number }[];
};

export type SplashSource = () => PondHandle | null;

export function attachLiquidTitle(title: HTMLElement, getPond: SplashSource): () => void {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodes = Array.from(title.querySelectorAll<HTMLElement>(".hero__ch"));
  if (reduceMotion || nodes.length === 0) return () => {};

  const letters: Letter[] = nodes.map((el, i) => ({
    el,
    i,
    x: 0,
    y: 0,
    r: 0,
    vx: 0,
    vy: 0,
    vr: 0,
    w: 0,
    h: 0,
    cx: 0,
    cy: 0,
    hot: false,
    queue: [],
  }));

  let sizeDirty = true;
  const measure = () => {
    sizeDirty = true;
  };

  // Размеры букв меняются только на ресайз/после загрузки шрифта; геометрию
  // (left/top) берём из актуального rect заголовка в момент наведения.
  function ensureSizes() {
    if (!sizeDirty) return;
    for (const L of letters) {
      L.w = L.el.offsetWidth;
      L.h = L.el.offsetHeight;
    }
    sizeDirty = false;
  }

  let pmx: number | null = null;
  let pmy: number | null = null;
  let mvx = 0;
  let mvy = 0;
  let lastMove = 0;
  let running = false;
  let last = 0;
  let inView = true;

  // Когда заголовок ушёл из вьюпорта, хит-тест и замеры не нужны: иначе
  // быстрый курсор заставлял бы браузер пересчитывать раскладку на каждом
  // движении в любой части страницы.
  let io: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((es) => {
      inView = es[0].isIntersecting;
    });
    io.observe(title);
  }

  function segBoxHit(L: Letter, x0: number, y0: number, x1: number, y1: number) {
    const hw = L.w * 0.42;
    const hh = L.h * 0.36;
    const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 6));
    for (let s = 0; s <= steps; s++) {
      const k = s / steps;
      const px = x0 + (x1 - x0) * k;
      const py = y0 + (y1 - y0) * k;
      if (Math.abs(px - L.cx) < hw && Math.abs(py - L.cy) < hh) return { px, py };
    }
    return null;
  }

  // центры букв в координатах страницы, посчитанные на текущий кадр
  function syncGeometry() {
    const rect = title.getBoundingClientRect();
    const ox = rect.left + window.scrollX;
    const oy = rect.top + window.scrollY;
    for (const L of letters) {
      L.cx = ox + L.el.offsetLeft + L.w / 2;
      L.cy = oy + L.el.offsetTop + L.h / 2;
    }
  }

  const onMove = (e: PointerEvent) => {
    if (!inView) return;
    const now = performance.now();
    const x = e.pageX;
    const y = e.pageY;
    if (pmx !== null && pmy !== null) {
      const dt = Math.max(8, now - lastMove) / 1000;
      mvx = (x - pmx) / dt;
      mvy = (y - pmy) / dt;
      hitTest(pmx, pmy, x, y);
    }
    pmx = x;
    pmy = y;
    lastMove = now;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  function hitTest(x0: number, y0: number, x1: number, y1: number) {
    const speed = Math.hypot(mvx, mvy);
    if (speed < 30) return;
    ensureSizes();
    syncGeometry();
    const now = performance.now();
    for (const L of letters) {
      if (!L.w || !L.h) continue;
      const hit = segBoxHit(L, x0, y0, x1, y1);
      if (!hit) {
        L.hot = false;
        continue;
      }
      const k = Math.min(1, speed / 1400);
      const ix = Math.max(-1, Math.min(1, mvx / 900));
      const iy = Math.max(-1, Math.min(1, mvy / 900));
      const fresh = !L.hot;
      const gain = fresh ? 1 : 0.25;
      L.vx += ix * 400 * gain;
      L.vy += (iy * 320 + 110 * k) * gain;
      const lever = (L.cy - hit.py) / (L.h * 0.5);
      L.vr += ix * lever * 150 * gain + ((hit.px - L.cx) / L.w) * iy * 60 * gain;
      L.hot = true;
      if (fresh) {
        // волна бежит по слову
        for (const n of letters) {
          const d = Math.abs(n.i - L.i);
          if (d === 0 || d > 3) continue;
          n.queue.push({ at: now + d * 70, vy: (100 + 120 * k) / d, vr: (Math.sign(n.i - L.i) * ix * 18) / d });
        }
        const pond = getPond();
        if (pond) {
          const r = pond.canvas.getBoundingClientRect();
          pond.splash(hit.px - window.scrollX - r.left, hit.py - window.scrollY - r.top, 30 + 20 * k, -(0.05 + 0.08 * k));
        }
      }
      start();
    }
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }

  function tick(now: number) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    let active = false;
    for (const L of letters) {
      if (L.queue.length) {
        L.queue = L.queue.filter((q) => {
          if (q.at > now) return true;
          L.vy += q.vy;
          L.vr += q.vr;
          return false;
        });
        active = true;
      }
      // недодемпфированные пружины — поплавок на воде
      L.vx += (-170 * L.x - 7 * L.vx) * dt;
      L.vy += (-150 * L.y - 6 * L.vy) * dt;
      L.vr += (-130 * L.r - 6.5 * L.vr) * dt;
      L.x += L.vx * dt;
      L.y += L.vy * dt;
      L.r += L.vr * dt;
      L.x = Math.max(-40, Math.min(40, L.x));
      L.y = Math.max(-40, Math.min(40, L.y));
      L.r = Math.max(-28, Math.min(28, L.r));
      const moving =
        Math.abs(L.x) + Math.abs(L.y) + Math.abs(L.r) * 0.5 + (Math.abs(L.vx) + Math.abs(L.vy) + Math.abs(L.vr)) * 0.02 >
        0.05;
      if (moving) {
        active = true;
        L.el.style.willChange = "transform";
        L.el.style.transform = `translate3d(${L.x.toFixed(2)}px, ${L.y.toFixed(2)}px, 0) rotate(${L.r.toFixed(2)}deg)`;
      } else if (L.el.style.transform) {
        L.x = L.y = L.r = L.vx = L.vy = L.vr = 0;
        L.el.style.transform = "";
        L.el.style.willChange = "";
      }
    }
    if (active) requestAnimationFrame(tick);
    else running = false;
  }

  window.addEventListener("resize", measure);
  if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
  const lateMeasure = window.setTimeout(measure, 1700); // после входной анимации заголовка

  return () => {
    io?.disconnect();
    window.clearTimeout(lateMeasure);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("resize", measure);
    for (const L of letters) {
      L.el.style.transform = "";
      L.el.style.willChange = "";
    }
  };
}

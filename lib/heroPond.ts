/* ============================================================================
   Hero pond — живые кои под водой (порт improve_ideas/ripple-hero/pond.js)
   - террасами вырезанный «бумажный» рельеф дна (запекается один раз)
   - кои с гибким позвоночником, плавниками и естественным рулением
   - вода на WebGL2 height-field: рябь от мыши, кои и букв преломляет дно
   - блики на поверхности
   Без WebGL2 — обычный 2D-canvas с кольцами от всплесков.

   Отличия от исходника:
   - палитра переведена в тёмную воду сайта (ink/teal) — гармония с --bg #080808
   - блик воды тонирован лаймом бренда (--accent)
   - кувшинки — тёмный нефрит с лаймовой кромкой, лотосы — костяной крем и
     приглушённая роза (палитра кои), а не яркая зелень/розовый исходника
   - пузыри убраны: над тёмной водой читались серыми точками
   - кувшинки не сажаются на текстовый блок — заголовок остаётся чистым
   - пауза вне вьюпорта, лимит DPR, статичный кадр при prefers-reduced-motion
   ========================================================================== */

const TAU = Math.PI * 2;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const angDiff = (a: number, b: number) => {
  let d = (b - a) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
};

type RGB = [number, number, number];
type Point = { x: number; y: number };
type Frame = { x: number; y: number; dx: number; dy: number; nx: number; ny: number; w: number };
type Tail = { T: (x: number, y: number) => [number, number]; L: number };

export type PondHandle = {
  /** Всплеск в CSS-пикселях канваса: x, y, радиус, сила (отрицательная — вверх). */
  splash(x: number, y: number, radius?: number, strength?: number): void;
  canvas: HTMLCanvasElement;
  destroy(): void;
};

/* ---------------------------------------------------------- gradient noise */
function makeNoise(seed: number) {
  let s = (seed >>> 0) || 1;
  const rndn = () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rndn() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const gx = new Float32Array(8);
  const gy = new Float32Array(8);
  for (let i = 0; i < 8; i++) {
    gx[i] = Math.cos((i / 8) * TAU);
    gy[i] = Math.sin((i / 8) * TAU);
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return function noise2(x: number, y: number) {
    const fx = Math.floor(x);
    const fy = Math.floor(y);
    const xi = fx & 255;
    const yi = fy & 255;
    const xf = x - fx;
    const yf = y - fy;
    const u = fade(xf);
    const v = fade(yf);
    const a = perm[perm[xi] + yi] & 7;
    const b = perm[perm[xi + 1] + yi] & 7;
    const c = perm[perm[xi] + yi + 1] & 7;
    const d = perm[perm[xi + 1] + yi + 1] & 7;
    const n00 = gx[a] * xf + gy[a] * yf;
    const n10 = gx[b] * (xf - 1) + gy[b] * yf;
    const n01 = gx[c] * xf + gy[c] * (yf - 1);
    const n11 = gx[d] * (xf - 1) + gy[d] * (yf - 1);
    return lerp(lerp(n00, n10, u), lerp(n01, n11, u), v) * 1.4;
  };
}

function fbm(noise: (x: number, y: number) => number, x: number, y: number, oct: number) {
  let sum = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i++) {
    sum += noise(x * f, y * f) * amp;
    f *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

/* ============================================================================
   TERRAIN — тёмное илистое дно. Пластины квантованы по высоте, каждая ловит
   мягкую тень и подсвеченный край, а центр («глубина» под заголовком) уходит
   в тень, чтобы кремовый текст читался без плотной плашки.
   ========================================================================== */
const FLOOR: RGB[] = [
  "#050a0b",
  "#070f10",
  "#091614",
  "#0b1c19",
  "#0e231d",
  "#112a22",
  "#163428",
  "#1d4030",
  "#264f3a",
  "#316043",
].map(hex);

function buildTerrain(w: number, h: number, seed: number): HTMLCanvasElement {
  const s = clamp(Math.sqrt(340000 / (w * h)), 0.25, 0.6);
  const cw = Math.ceil(w * s);
  const ch = Math.ceil(h * s);
  const n1 = makeNoise(seed);
  const n2 = makeNoise(seed * 3 + 11);
  const n3 = makeNoise(seed * 7 + 5);
  const lv = new Uint8Array(cw * ch);
  const NL = FLOOR.length;

  const ca = Math.cos(-0.55);
  const sa = Math.sin(-0.55);
  const f = 1 / 680;
  for (let y = 0; y < ch; y++) {
    const py = y / s;
    for (let x = 0; x < cw; x++) {
      const px = x / s;
      // rotate + stretch: пластины читаются как длинные диагональные отмели
      const u = (px * ca - py * sa) * f * 0.75;
      const v = (px * sa + py * ca) * f * 1.6;
      const wu = u + 0.85 * fbm(n2, u * 1.4 + 3.1, v * 1.4, 3);
      const wv = v + 0.85 * fbm(n2, u * 1.4 - 7.7, v * 1.4 + 2.3, 3);
      let val = fbm(n1, wu, wv, 4);
      // рваные края
      val += n3(px / 16, py / 16) * 0.018 + n3(px / 40 + 40, py / 40) * 0.04;
      // центр — глубина: там стоит заголовок, дно уходит в тень
      const dx = (px - w * 0.5) / (w * 0.62);
      const dy = (py - h * 0.5) / (h * 0.72);
      const r = Math.sqrt(dx * dx + dy * dy);
      val -= 0.62 - r * 0.46;
      if (py / h < 0.12) val -= (0.12 - py / h) * 1.6;
      lv[y * cw + x] = clamp(Math.floor((val + 0.62) / 0.15), 0, NL - 1);
    }
  }

  const img = new ImageData(cw, ch);
  const D = img.data;
  const K = Math.max(3, Math.round(16 * s));
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      const L = lv[i];
      let sh = 0;
      for (let k = 1; k <= K; k++) {
        const xx = x - k;
        const yy = y - k;
        if (xx < 0 || yy < 0) break;
        const d = lv[yy * cw + xx] - L;
        if (d > 0) sh = Math.max(sh, Math.min(d, 2) * (1 - (k - 1) / K));
      }
      let rim = 0;
      if (x > 1 && y > 1) {
        const up = lv[(y - 1) * cw + x - 1];
        const up2 = lv[(y - 2) * cw + x - 2];
        if (up < L) rim = 1;
        else if (up2 < L) rim = 0.5;
      }
      const c = FLOOR[L];
      const k1 = 1 - sh * 0.2;
      const lift = rim * 0.12;
      D[i * 4] = clamp(c[0] * k1 + (140 - c[0]) * lift, 0, 255);
      D[i * 4 + 1] = clamp(c[1] * k1 + (200 - c[1]) * lift, 0, 255);
      D[i * 4 + 2] = clamp(c[2] * k1 + (170 - c[2]) * lift, 0, 255);
      D[i * 4 + 3] = 255;
    }
  }

  const small = document.createElement("canvas");
  small.width = cw;
  small.height = ch;
  const sctx = small.getContext("2d");
  if (!sctx) return small;
  sctx.putImageData(img, 0, 0);

  const q = clamp(window.devicePixelRatio || 1, 1, 1.5);
  const out = document.createElement("canvas");
  out.width = Math.round(w * q);
  out.height = Math.round(h * q);
  const g = out.getContext("2d");
  if (!g) return out;
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = "high";
  g.drawImage(small, 0, 0, out.width, out.height);
  g.setTransform(q, 0, 0, q, 0, 0);

  // дымка глубины: сверху и по краям вода темнее
  const vg = g.createLinearGradient(0, 0, 0, h);
  vg.addColorStop(0.0, "rgba(2,14,14,0.6)");
  vg.addColorStop(0.2, "rgba(2,14,14,0.16)");
  vg.addColorStop(0.55, "rgba(2,14,14,0)");
  vg.addColorStop(1.0, "rgba(2,14,14,0.2)");
  g.fillStyle = vg;
  g.fillRect(0, 0, w, h);

  const side = g.createRadialGradient(w * 0.5, h * 0.5, w * 0.25, w * 0.5, h * 0.5, w * 0.8);
  side.addColorStop(0, "rgba(2,10,10,0)");
  side.addColorStop(1, "rgba(2,10,10,0.42)");
  g.fillStyle = side;
  g.fillRect(0, 0, w, h);

  // холодный свет сквозь воду над заголовком
  g.globalCompositeOperation = "screen";
  const core = g.createRadialGradient(w * 0.5, h * 0.44, 0, w * 0.5, h * 0.44, w * 0.46);
  core.addColorStop(0, "rgba(214,244,196,0.10)");
  core.addColorStop(0.5, "rgba(214,244,196,0.035)");
  core.addColorStop(1, "rgba(214,244,196,0)");
  g.fillStyle = core;
  g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "source-over";
  return out;
}

/* ================================================================ KOI ====
   Кои — цепочка точек позвоночника. Голова рулит, каждая следующая точка
   тянется за ней на фиксированном расстоянии, поэтому тело само рисует
   S-кривую, а хвост качается. Ширина, плавники и пятна привязаны к позвоночнику.
   ========================================================================== */
const SPINE = 12;
const PROFILE = [0.62, 0.86, 0.98, 1.0, 0.96, 0.88, 0.77, 0.64, 0.5, 0.36, 0.24, 0.15];

type KoiType = {
  base: string;
  shade: string;
  fin: [number, number, number];
  marks: [string, number, number, number][];
  cap?: string;
  capBig?: boolean;
  sheen?: string;
};

const KOI_TYPES: Record<string, KoiType> = {
  kohaku: { base: "#fbf7ef", shade: "#c9d0c8", fin: [250, 246, 238], marks: [["#e1452b", 3, 0.55, 0.95]] },
  tancho: { base: "#fcf9f2", shade: "#ccd3ca", fin: [250, 247, 240], marks: [], cap: "#e3402a" },
  sanke: {
    base: "#fbf7ef",
    shade: "#c6ccc4",
    fin: [248, 244, 236],
    marks: [
      ["#de4a2c", 2, 0.5, 0.85],
      ["#25221f", 3, 0.18, 0.32],
    ],
  },
  ogon: { base: "#f58a33", shade: "#cf5f1d", fin: [252, 170, 110], marks: [], sheen: "rgba(255,214,150,0.55)" },
  yamabuki: { base: "#f4c75a", shade: "#cf9a2c", fin: [250, 220, 140], marks: [], sheen: "rgba(255,244,196,0.6)" },
  hajiro: { base: "#f8f5ee", shade: "#c3cac2", fin: [244, 242, 236], marks: [], cap: "#f07a3a", capBig: true },
};

type World = {
  W: number;
  H: number;
  kois: Koi[];
  pads: LilyPad[];
  flowers: Lotus[];
  glints: Glint[];
  mouse: {
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    speed: number;
    inside: boolean;
    moved: boolean;
  };
  water: { drop(x: number, y: number, r: number, s: number): void } | null;
};

type Mark = { t: number; o: number; r: number; sx: number; color: string };

class Koi {
  len: number;
  type: KoiType;
  depth: number;
  maxW: number;
  seg: number;
  heading: number;
  speed: number;
  base: number;
  burst = 0;
  turn = 0;
  phase: number;
  seed: number;
  t: number;
  pts: Point[] = [];
  marks: Mark[] = [];

  constructor(x: number, y: number, len: number, type: KoiType, depth: number) {
    this.len = len;
    this.type = type;
    this.depth = depth;
    this.maxW = len * 0.145;
    this.seg = (len * 0.68) / (SPINE - 1);
    this.heading = rnd(0, TAU);
    this.speed = this.base = rnd(26, 40) * (len / 70);
    this.phase = rnd(0, TAU);
    this.seed = rnd(0, 1000);
    this.t = rnd(0, 100);
    for (let i = 0; i < SPINE; i++) {
      this.pts.push({ x: x - Math.cos(this.heading) * this.seg * i, y: y - Math.sin(this.heading) * this.seg * i });
    }
    for (const [color, n, rMin, rMax] of this.type.marks) {
      for (let i = 0; i < n; i++) {
        this.marks.push({ t: rnd(0.08, 0.8), o: rnd(-0.7, 0.7), r: rnd(rMin, rMax), sx: rnd(0.9, 1.6), color });
      }
    }
    if (this.type.cap) {
      this.marks.push({
        t: this.type.capBig ? 0.06 : 0.12,
        o: 0,
        r: this.type.capBig ? 0.95 : 0.5,
        sx: this.type.capBig ? 1.4 : 1,
        color: this.type.cap,
      });
    }
  }

  update(dt: number, world: World, noise: (x: number, y: number) => number) {
    const head = this.pts[0];
    this.t += dt;

    let steer = noise(this.seed, this.t * 0.25) * 1.6;

    // мягкие поля: не выходим за пруд
    const m = 90;
    const cx = world.W * 0.5;
    const cy = world.H * 0.55;
    const outX = head.x < m ? (m - head.x) / m : head.x > world.W - m ? (head.x - world.W + m) / m : 0;
    const outY =
      head.y < m + 40 ? (m + 40 - head.y) / m : head.y > world.H - m * 0.6 ? (head.y - world.H + m * 0.6) / m : 0;
    const out = Math.max(outX, outY);
    if (out > 0) {
      const toC = Math.atan2(cy - head.y, cx - head.x);
      steer += angDiff(this.heading, toC) * Math.min(out, 1.5) * 3.2;
    }

    for (const o of world.kois) {
      if (o === this) continue;
      const dx = o.pts[0].x - head.x;
      const dy = o.pts[0].y - head.y;
      const d2 = dx * dx + dy * dy;
      const r = (this.len + o.len) * 0.55;
      if (d2 < r * r && d2 > 1) {
        const a = Math.atan2(dy, dx);
        const side = angDiff(this.heading, a);
        if (Math.abs(side) < 1.6) steer -= Math.sign(side) * (1 - Math.sqrt(d2) / r) * 2.4;
      }
    }

    // резкое движение руки над водой пугает рыб
    const ms = world.mouse;
    if (ms.inside) {
      const dx = head.x - ms.x;
      const dy = head.y - ms.y;
      const d = Math.hypot(dx, dy);
      if (d < 170 && ms.speed > 220) {
        const away = Math.atan2(dy, dx);
        steer += angDiff(this.heading, away) * 6 * (1 - d / 170);
        this.burst = Math.min(1, this.burst + dt * 6 * (ms.speed / 800));
      }
    }

    this.turn = lerp(this.turn, clamp(steer, -2.8, 2.8), Math.min(1, dt * 3));
    this.heading += this.turn * dt;

    this.burst = Math.max(0, this.burst - dt * 0.55);
    const cruise = this.base * (0.72 + 0.5 * (noise(this.seed + 50, this.t * 0.18) + 0.5));
    const target = cruise * (1 + this.burst * 2.6);
    this.speed = lerp(this.speed, target, Math.min(1, dt * (this.burst > 0.1 ? 4 : 1.2)));

    const beat = 2.4 + this.speed * 0.09;
    this.phase += dt * beat;
    const sway = Math.sin(this.phase) * (0.16 + this.burst * 0.18);
    const dir = this.heading + sway;

    head.x += Math.cos(dir) * this.speed * dt;
    head.y += Math.sin(dir) * this.speed * dt;

    const maxBend = 0.42;
    let prevA = dir;
    for (let i = 1; i < SPINE; i++) {
      const a = this.pts[i - 1];
      const b = this.pts[i];
      let ang = Math.atan2(a.y - b.y, a.x - b.x);
      const d = angDiff(prevA, ang);
      if (d > maxBend) ang = prevA + maxBend;
      else if (d < -maxBend) ang = prevA - maxBend;
      b.x = a.x - Math.cos(ang) * this.seg;
      b.y = a.y - Math.sin(ang) * this.seg;
      prevA = ang;
    }

    if (world.water) {
      const s = (0.0016 + this.burst * 0.004) * (1 - this.depth * 0.6) * (this.speed / 40);
      world.water.drop(head.x, head.y, this.maxW * 1.7, s);
    }
  }

  frame(): Frame[] {
    const P = this.pts;
    const F: Frame[] = [];
    for (let i = 0; i < SPINE; i++) {
      const a = P[Math.max(0, i - 1)];
      const b = P[Math.min(SPINE - 1, i + 1)];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      const l = Math.hypot(dx, dy) || 1;
      dx /= l;
      dy /= l;
      F.push({ x: P[i].x, y: P[i].y, dx, dy, nx: -dy, ny: dx, w: this.maxW * PROFILE[i] });
    }
    return F;
  }

  bodyPath(g: CanvasRenderingContext2D, F: Frame[]) {
    const h = F[0];
    const pts: [number, number][] = [];
    pts.push([h.x + h.dx * h.w * 1.05 + h.nx * h.w * 0.45, h.y + h.dy * h.w * 1.05 + h.ny * h.w * 0.45]);
    for (let i = 0; i < SPINE; i++) pts.push([F[i].x + F[i].nx * F[i].w, F[i].y + F[i].ny * F[i].w]);
    for (let i = SPINE - 1; i >= 0; i--) pts.push([F[i].x - F[i].nx * F[i].w, F[i].y - F[i].ny * F[i].w]);
    pts.push([h.x + h.dx * h.w * 1.05 - h.nx * h.w * 0.45, h.y + h.dy * h.w * 1.05 - h.ny * h.w * 0.45]);
    smoothClosed(g, pts);
  }

  tailPath(g: CanvasRenderingContext2D, F: Frame[]): Tail {
    const e = F[SPINE - 1];
    const e2 = F[SPINE - 4];
    const base = Math.atan2(-e.dy, -e.dx);
    const prev = Math.atan2(-e2.dy, -e2.dx);
    const bend = clamp(angDiff(prev, base) * 1.8 + Math.sin(this.phase - 1.4) * 0.22, -1.1, 1.1);
    const L = this.len * 0.32;
    const c = Math.cos(base);
    const s = Math.sin(base);
    const T = (x: number, y: number): [number, number] => {
      const k = x / L;
      const yy = y + bend * k * k * L * 0.75;
      const xx = x - Math.abs(bend) * k * k * L * 0.15;
      return [e.x + xx * c - yy * s, e.y + xx * s + yy * c];
    };
    const p = [
      T(-2, -e.w * 0.9),
      T(L * 0.35, -L * 0.28),
      T(L * 0.85, -L * 0.52),
      T(L * 1.0, -L * 0.46),
      T(L * 0.72, -L * 0.12),
      T(L * 0.6, 0),
      T(L * 0.72, L * 0.12),
      T(L * 1.0, L * 0.46),
      T(L * 0.85, L * 0.52),
      T(L * 0.35, L * 0.28),
      T(-2, e.w * 0.9),
    ];
    smoothClosed(g, p);
    return { T, L };
  }

  finPath(g: CanvasRenderingContext2D, f: Frame, side: number, len: number, wid: number, angle: number) {
    const a = Math.atan2(f.dy, f.dx) + Math.PI + side * angle;
    const bx = f.x + f.nx * f.w * 0.75 * side;
    const by = f.y + f.ny * f.w * 0.75 * side;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const T = (x: number, y: number): [number, number] => [bx + x * c - y * s * side, by + x * s + y * c * side];
    const p = [
      T(0, 0),
      T(len * 0.35, -wid * 0.55),
      T(len * 0.95, -wid * 0.45),
      T(len, wid * 0.1),
      T(len * 0.55, wid * 0.5),
      T(len * 0.1, wid * 0.25),
    ];
    smoothClosed(g, p);
  }

  drawShadow(g: CanvasRenderingContext2D) {
    const F = this.frame();
    g.beginPath();
    this.bodyPath(g, F);
    g.fill();
    g.beginPath();
    this.tailPath(g, F);
    g.fill();
  }

  draw(g: CanvasRenderingContext2D) {
    const F = this.frame();
    const T = this.type;
    const fin = T.fin;
    const flap = Math.sin(this.phase * 0.55);

    g.save();
    g.globalAlpha = 1 - this.depth * 0.3;

    // грудные и брюшные плавники — под телом
    g.fillStyle = `rgba(${fin[0]},${fin[1]},${fin[2]},0.78)`;
    for (const side of [1, -1]) {
      g.beginPath();
      this.finPath(g, F[2], side, this.len * 0.17, this.len * 0.11, 0.95 + flap * side * 0.25);
      g.fill();
      g.beginPath();
      this.finPath(g, F[6], side, this.len * 0.09, this.len * 0.06, 0.8 + flap * side * 0.12);
      g.fill();
    }

    // хвост с лучами
    g.beginPath();
    const tail = this.tailPath(g, F);
    const tg = g.createLinearGradient(F[SPINE - 1].x, F[SPINE - 1].y, ...tail.T(tail.L, 0));
    tg.addColorStop(0, `rgba(${fin[0]},${fin[1]},${fin[2]},0.85)`);
    tg.addColorStop(1, `rgba(${fin[0]},${fin[1]},${fin[2]},0.35)`);
    g.fillStyle = tg;
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.28)";
    g.lineWidth = 0.7;
    for (let i = -2; i <= 2; i++) {
      const [x0, y0] = tail.T(0, 0);
      const [x1, y1] = tail.T(tail.L * (0.82 - Math.abs(i) * 0.02), tail.L * 0.2 * i);
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
    }

    // тело
    g.beginPath();
    this.bodyPath(g, F);
    g.fillStyle = T.base;
    g.fill();

    g.save();
    g.clip();
    for (const mk of this.marks) {
      const fi = mk.t * (SPINE - 1);
      const i0 = Math.floor(fi);
      const i1 = Math.min(SPINE - 1, i0 + 1);
      const k = fi - i0;
      const a = F[i0];
      const b = F[i1];
      const w = lerp(a.w, b.w, k);
      const x = lerp(a.x, b.x, k) + lerp(a.nx, b.nx, k) * mk.o * w;
      const y = lerp(a.y, b.y, k) + lerp(a.ny, b.ny, k) * mk.o * w;
      g.fillStyle = mk.color;
      g.beginPath();
      g.ellipse(x, y, this.maxW * mk.r * mk.sx, this.maxW * mk.r, Math.atan2(a.dy, a.dx), 0, TAU);
      g.fill();
    }
    // округлый объём: тёмные бока и светлая спина
    g.lineJoin = "round";
    g.lineCap = "round";
    g.beginPath();
    this.bodyPath(g, F);
    g.strokeStyle = T.shade;
    g.globalAlpha *= 0.55;
    g.lineWidth = this.maxW * 0.55;
    g.stroke();
    g.globalAlpha = 1 - this.depth * 0.3;
    g.beginPath();
    g.moveTo(F[1].x, F[1].y);
    for (let i = 2; i < SPINE - 2; i++) g.lineTo(F[i].x, F[i].y);
    g.strokeStyle = T.sheen || "rgba(255,255,255,0.35)";
    g.lineWidth = this.maxW * 0.55;
    g.stroke();
    g.restore();

    // спинной гребень
    g.beginPath();
    g.moveTo(F[3].x, F[3].y);
    for (let i = 4; i < SPINE - 3; i++) g.lineTo(F[i].x, F[i].y);
    g.strokeStyle = "rgba(20,24,20,0.14)";
    g.lineWidth = this.maxW * 0.18;
    g.lineCap = "round";
    g.stroke();

    // глаза
    const h = F[0];
    g.fillStyle = "#1b2320";
    for (const side of [1, -1]) {
      g.beginPath();
      g.arc(
        h.x + h.dx * h.w * 0.45 + h.nx * h.w * 0.66 * side,
        h.y + h.dy * h.w * 0.45 + h.ny * h.w * 0.66 * side,
        Math.max(0.9, this.maxW * 0.13),
        0,
        TAU,
      );
      g.fill();
    }
    g.restore();
  }
}

function smoothClosed(g: CanvasRenderingContext2D, pts: [number, number][]) {
  const n = pts.length;
  const mx = (i: number) => (pts[i % n][0] + pts[(i + 1) % n][0]) / 2;
  const my = (i: number) => (pts[i % n][1] + pts[(i + 1) % n][1]) / 2;
  g.moveTo(mx(0), my(0));
  for (let i = 1; i <= n; i++) g.quadraticCurveTo(pts[i % n][0], pts[i % n][1], mx(i), my(i));
  g.closePath();
}

/* ====================================================== surface things ==== */

/** Кувшинка: привязана «стеблем» к точке, но её отталкивает мышь. */
class LilyPad {
  hx: number;
  hy: number;
  x: number;
  y: number;
  r: number;
  rot: number;
  vr = 0;
  vx = 0;
  vy = 0;
  notch: number;
  hue: number;
  phase: number;

  constructor(x: number, y: number, r: number) {
    this.hx = this.x = x;
    this.hy = this.y = y;
    this.r = r;
    this.rot = rnd(0, TAU);
    this.notch = rnd(0.28, 0.38);
    this.hue = rnd(148, 172);
    this.phase = rnd(0, TAU);
  }

  update(dt: number, world: World) {
    this.phase += dt;
    const ms = world.mouse;
    if (ms.inside && ms.speed > 40) {
      const dx = this.x - ms.x;
      const dy = this.y - ms.y;
      const d = Math.hypot(dx, dy);
      const R = this.r + 60;
      if (d < R) {
        const f = (1 - d / R) * dt;
        this.vx += (ms.vx * 0.85 + (dx / (d || 1)) * 110) * f;
        this.vy += (ms.vy * 0.85 + (dy / (d || 1)) * 110) * f;
        this.vr += ((dx * ms.vy - dy * ms.vx) / (R * R)) * f * 2;
      }
    }
    // стебель тянет лист назад
    this.vx += (this.hx - this.x) * 0.4 * dt;
    this.vy += (this.hy - this.y) * 0.4 * dt;
    const damp = Math.pow(0.34, dt);
    this.vx *= damp;
    this.vy *= damp;
    this.vr *= damp;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rot += this.vr * dt + Math.sin(this.phase * 0.4) * 0.02 * dt;
  }

  /** Центр листа с учётом покачивания — к нему крепится цветок. */
  get bobY() {
    return this.y + Math.sin(this.phase * 0.9) * 0.9;
  }

  drawShadow(g: CanvasRenderingContext2D) {
    g.beginPath();
    g.arc(this.x, this.y, this.r, 0, TAU);
    g.fill();
  }

  draw(g: CanvasRenderingContext2D) {
    const r = this.r;
    g.save();
    g.translate(this.x, this.bobY);
    g.rotate(this.rot);
    // сверху-сбоку лист виден чуть сплюснутым — так он не читается диском
    g.scale(1, 0.9);

    g.beginPath();
    g.moveTo(r * 0.06, 0);
    g.arc(0, 0, r, this.notch, TAU - this.notch);
    g.closePath();
    const gr = g.createRadialGradient(-r * 0.28, -r * 0.34, r * 0.06, 0, 0, r * 1.05);
    gr.addColorStop(0, `hsl(${this.hue}, 26%, 36%)`);
    gr.addColorStop(0.58, `hsl(${this.hue}, 30%, 25%)`);
    gr.addColorStop(1, `hsl(${this.hue + 6}, 34%, 15%)`);
    g.fillStyle = gr;
    g.fill();
    // мокрый тёмный кант по всему краю
    g.strokeStyle = "rgba(2, 10, 11, 0.26)";
    g.lineWidth = Math.max(1, r * 0.05);
    g.stroke();
    // лаймовый обод — только со стороны света, чтобы лист не читался значком
    g.beginPath();
    g.arc(0, 0, r * 0.975, Math.PI * 1.02, Math.PI * 1.86);
    g.strokeStyle = "rgba(206, 255, 120, 0.20)";
    g.lineWidth = Math.max(0.9, r * 0.045);
    g.stroke();

    // прожилки
    g.strokeStyle = "rgba(214, 255, 196, 0.10)";
    g.lineWidth = Math.max(0.6, r * 0.025);
    const span = TAU - this.notch * 2 - 0.7;
    for (let i = 0; i < 7; i++) {
      const a = this.notch + 0.35 + (i / 6) * span;
      g.beginPath();
      g.moveTo(Math.cos(this.notch + 0.2) * r * 0.1, Math.sin(this.notch + 0.2) * r * 0.1);
      g.lineTo(Math.cos(a) * r * 0.88, Math.sin(a) * r * 0.88);
      g.stroke();
    }

    // мокрый блик сверху слева — там же, откуда свет на воде
    g.globalCompositeOperation = "lighter";
    g.fillStyle = "rgba(186, 255, 170, 0.07)";
    g.beginPath();
    g.ellipse(-r * 0.34, -r * 0.38, r * 0.44, r * 0.22, -0.6, 0, TAU);
    g.fill();
    g.restore();
  }
}

/** Лотос: лежит на кувшинке и едет вместе с ней, медленно поворачиваясь. */
class Lotus {
  host: LilyPad;
  r: number;
  rot: number;
  rose: boolean;
  phase: number;
  ox: number;
  oy: number;

  constructor(host: LilyPad, r: number) {
    this.host = host;
    this.r = r;
    this.rot = rnd(0, TAU);
    this.rose = Math.random() < 0.45;
    this.phase = rnd(0, TAU);
    const a = rnd(0, TAU);
    const off = host.r * rnd(0.08, 0.3);
    this.ox = Math.cos(a) * off;
    this.oy = Math.sin(a) * off;
  }

  update(dt: number) {
    this.rot += dt * 0.035;
    this.phase += dt;
  }

  drawShadow(g: CanvasRenderingContext2D) {
    g.beginPath();
    g.arc(this.host.x + this.ox, this.host.bobY + this.oy, this.r * 0.8, 0, TAU);
    g.fill();
  }

  draw(g: CanvasRenderingContext2D) {
    const r = this.r;
    g.save();
    g.translate(this.host.x + this.ox, this.host.bobY + this.oy);

    // ореол: цветок не тонет в тёмной воде
    const halo = g.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 1.7);
    halo.addColorStop(0, "rgba(2, 10, 11, 0.42)");
    halo.addColorStop(1, "rgba(2, 10, 11, 0)");
    g.fillStyle = halo;
    g.beginPath();
    g.arc(0, 0, r * 1.7, 0, TAU);
    g.fill();

    g.rotate(this.rot);
    const tip = this.rose ? "#c9746a" : "#e0d0bc";
    const root = this.rose ? "#8f4a41" : "#b9ab97";
    for (let layer = 0; layer < 2; layer++) {
      const n = layer ? 6 : 8;
      const pr = r * (layer ? 0.62 : 1);
      const off = layer * 0.4;
      for (let i = 0; i < n; i++) {
        g.save();
        g.rotate((i / n) * TAU + off);
        const gr = g.createLinearGradient(0, 0, 0, -pr);
        gr.addColorStop(0, this.rose ? "#f6d9d0" : "#fbf3e6");
        gr.addColorStop(1, tip);
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(0, 0);
        g.quadraticCurveTo(pr * 0.42, -pr * 0.55, 0, -pr);
        g.quadraticCurveTo(-pr * 0.42, -pr * 0.55, 0, 0);
        g.fill();
        g.strokeStyle = "rgba(60, 40, 34, 0.18)";
        g.lineWidth = Math.max(0.5, r * 0.03);
        g.stroke();
        g.restore();
      }
      // тень у основания лепестков
      if (!layer) {
        g.fillStyle = root;
        g.globalAlpha = 0.35;
        g.beginPath();
        g.arc(0, 0, r * 0.34, 0, TAU);
        g.fill();
        g.globalAlpha = 1;
      }
    }
    g.fillStyle = "#f0c766";
    g.beginPath();
    g.arc(0, 0, r * 0.19, 0, TAU);
    g.fill();
    g.fillStyle = "rgba(120, 78, 22, 0.55)";
    g.beginPath();
    g.arc(0, 0, r * 0.08, 0, TAU);
    g.fill();
    g.restore();
  }
}

class Glint {
  x: number;
  y: number;
  life: number;
  dur: number;
  s: number;

  constructor(W: number, H: number) {
    this.x = rnd(0, W);
    this.y = rnd(H * 0.1, H);
    this.life = rnd(0, 1);
    this.dur = rnd(1.5, 3.5);
    this.s = rnd(1.5, 3);
  }

  reset(W: number, H: number) {
    this.x = rnd(0, W);
    this.y = rnd(H * 0.1, H);
    this.life = 0;
    this.dur = rnd(1.5, 3.5);
    this.s = rnd(1.5, 3);
  }

  update(dt: number, world: World) {
    this.life += dt / this.dur;
    if (this.life > 1) this.reset(world.W, world.H);
  }

  draw(g: CanvasRenderingContext2D) {
    const a = Math.sin(this.life * Math.PI);
    g.globalAlpha = a * 0.65;
    g.fillStyle = "#fbffe6";
    g.beginPath();
    g.arc(this.x, this.y, this.s * a, 0, TAU);
    g.fill();
    g.globalAlpha = a * 0.2;
    g.beginPath();
    g.arc(this.x, this.y, this.s * 3 * a, 0, TAU);
    g.fill();
    g.globalAlpha = 1;
  }
}

/* ========================================================= WebGL water ==== */
const MAX_DROPS = 48;

const VS = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

const SIM_FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform vec2 uView;
uniform int uCount;
uniform vec4 uA[${MAX_DROPS}];
uniform vec4 uB[${MAX_DROPS}];
void main(){
  vec4 s = texture(uPrev, vUv);
  float avg = (texture(uPrev, vUv + vec2(uTexel.x, 0.0)).r +
               texture(uPrev, vUv - vec2(uTexel.x, 0.0)).r +
               texture(uPrev, vUv + vec2(0.0, uTexel.y)).r +
               texture(uPrev, vUv - vec2(0.0, uTexel.y)).r) * 0.25;
  s.g += (avg - s.r) * 2.0;
  s.g *= 0.965;
  s.r += s.g;
  s.r *= 0.995;
  vec2 p = vUv * uView;
  for (int i = 0; i < ${MAX_DROPS}; i++) {
    if (i >= uCount) break;
    vec2 a = uA[i].xy, b = uB[i].xy;
    vec2 pa = p - a, ba = b - a;
    float hh = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
    float d = length(pa - ba * hh);
    float r = uA[i].z;
    if (d < r) {
      float f = 0.5 - 0.5 * cos((1.0 - d / r) * 3.14159265);
      s.r += f * uA[i].w;
    }
  }
  o = s;
}`;

const RENDER_FS = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uSim, uFloor, uKoi, uSurf;
uniform vec2 uTexel;
uniform vec2 uAspect;
uniform float uTime;
uniform vec3 uHi;
void main(){
  vec2 t = uTexel;
  float h  = texture(uSim, vUv).r;
  float hl = texture(uSim, vUv - vec2(t.x, 0.0)).r;
  float hr = texture(uSim, vUv + vec2(t.x, 0.0)).r;
  float hd = texture(uSim, vUv - vec2(0.0, t.y)).r;
  float hu = texture(uSim, vUv + vec2(0.0, t.y)).r;
  vec2 g = vec2(hr - hl, hu - hd);
  float lap = hl + hr + hd + hu - 4.0 * h;

  // лёгкая зыбь, чтобы дно не выглядело замороженным
  vec2 q = vUv * uAspect * 5.0;
  float tt = uTime;
  vec2 amb = vec2(
    sin(q.y * 1.9 + tt * 0.8) + sin(q.x * 1.3 + q.y * 0.7 - tt * 0.6),
    cos(q.x * 1.6 - tt * 0.7) + cos(q.y * 1.2 + q.x * 0.9 + tt * 0.5)) * 0.0007;

  vec2 off = -g * 0.9 + amb;
  vec3 col = texture(uFloor, vUv + off).rgb;
  vec4 k = texture(uKoi, vUv + off * 0.85);
  col = col * (1.0 - k.a) + k.rgb;

  vec2 L = normalize(vec2(-0.55, 0.85));
  float lit = dot(-g, L) * 38.0;
  vec3 hi = uHi;
  col += hi * clamp(lit, 0.0, 0.34);
  col *= 1.0 - clamp(-lit * 0.45, 0.0, 0.16);
  col += hi * clamp(-lap * 70.0, 0.0, 0.24);
  col += hi * clamp(h * 9.0, 0.0, 0.14);

  vec4 s = texture(uSurf, vUv + off * 0.3);
  col = col * (1.0 - s.a) + s.rgb;
  o = vec4(col, 1.0);
}`;

type GLProgram = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader alloc failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || "shader error");
  return sh;
}

function program(gl: WebGL2RenderingContext, fs: string): GLProgram {
  const p = gl.createProgram();
  if (!p) throw new Error("program alloc failed");
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, "aPos");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link error");
  const u: Record<string, WebGLUniformLocation | null> = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, "");
    u[name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

type Water = {
  resize(w: number, h: number, dpr: number): boolean;
  drop(x: number, y: number, r: number, s: number, x2?: number, y2?: number): void;
  step(): void;
  draw(time: number): void;
  setFloor(c: HTMLCanvasElement): void;
  setKoi(c: HTMLCanvasElement): void;
  setSurface(c: HTMLCanvasElement): void;
  lost(): boolean;
};

function createWater(canvas: HTMLCanvasElement): Water | null {
  const ctx = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
  });
  if (!ctx) return null;
  // отдельная константа без null: иначе сужение теряется внутри замыканий
  const gl: WebGL2RenderingContext = ctx;
  if (!gl.getExtension("EXT_color_buffer_float") && !gl.getExtension("EXT_color_buffer_half_float")) return null;

  let sim: GLProgram;
  let render: GLProgram;
  try {
    sim = program(gl, SIM_FS);
    render = program(gl, RENDER_FS);
  } catch (e) {
    console.warn("[heroPond] shader error, falling back to 2D", e);
    return null;
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tex = (filter: number) => {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  const floorTex = tex(gl.LINEAR);
  const koiTex = tex(gl.LINEAR);
  const surfTex = tex(gl.LINEAR);
  let simTex: WebGLTexture[] = [];
  let fbo: WebGLFramebuffer[] = [];
  let sw = 0;
  let sh = 0;
  let cur = 0;
  let vw = 1;
  let vh = 1;
  const drops: number[][] = [];
  const A = new Float32Array(MAX_DROPS * 4);
  const B = new Float32Array(MAX_DROPS * 4);
  const dims = new WeakMap<WebGLTexture, [number, number]>();

  function resize(w: number, h: number, dpr: number): boolean {
    vw = w;
    vh = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const scale = 0.25;
    sw = Math.max(16, Math.round(w * scale));
    sh = Math.max(16, Math.round(h * scale));
    for (const t of simTex) gl.deleteTexture(t);
    for (const f of fbo) gl.deleteFramebuffer(f);
    simTex = [];
    fbo = [];
    for (let i = 0; i < 2; i++) {
      const t = tex(gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, sw, sh, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const f = gl.createFramebuffer();
      if (!f) return false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      simTex.push(t);
      fbo.push(f);
    }
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return ok;
  }

  function upload(t: WebGLTexture, source: HTMLCanvasElement, premul: boolean) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premul);
    const d = dims.get(t);
    if (d && d[0] === source.width && d[1] === source.height) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      dims.set(t, [source.width, source.height]);
    }
  }

  function drop(x: number, y: number, r: number, s: number, x2?: number, y2?: number) {
    if (drops.length >= MAX_DROPS) drops.shift();
    drops.push([x, vh - y, r, s, x2 === undefined ? x : x2, vh - (y2 === undefined ? y : y2)]);
  }

  function step() {
    gl.useProgram(sim.p);
    gl.viewport(0, 0, sw, sh);
    const n = Math.min(drops.length, MAX_DROPS);
    for (let i = 0; i < n; i++) {
      const d = drops[i];
      A[i * 4] = d[0];
      A[i * 4 + 1] = d[1];
      A[i * 4 + 2] = d[2];
      A[i * 4 + 3] = d[3];
      B[i * 4] = d[4];
      B[i * 4 + 1] = d[5];
    }
    drops.length = 0;
    gl.uniform1i(sim.u.uCount, n);
    if (n) {
      gl.uniform4fv(sim.u.uA, A);
      gl.uniform4fv(sim.u.uB, B);
    }
    gl.uniform2f(sim.u.uTexel, 1 / sw, 1 / sh);
    gl.uniform2f(sim.u.uView, vw, vh);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, simTex[cur]);
    gl.uniform1i(sim.u.uPrev, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[1 - cur]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    cur = 1 - cur;
  }

  function draw(time: number) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(render.p);
    const bind = (unit: number, t: WebGLTexture, name: string) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.uniform1i(render.u[name], unit);
    };
    bind(0, simTex[cur], "uSim");
    bind(1, floorTex, "uFloor");
    bind(2, koiTex, "uKoi");
    bind(3, surfTex, "uSurf");
    gl.uniform2f(render.u.uTexel, 1 / sw, 1 / sh);
    gl.uniform2f(render.u.uAspect, vw / vh, 1);
    gl.uniform1f(render.u.uTime, time);
    // блик воды тонирован лаймом бренда, но почти белый
    gl.uniform3f(render.u.uHi, 0.84, 0.99, 0.78);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  return {
    resize,
    drop,
    step,
    draw,
    setFloor: (c) => upload(floorTex, c, false),
    setKoi: (c) => upload(koiTex, c, true),
    setSurface: (c) => upload(surfTex, c, true),
    lost: () => gl.isContextLost(),
  };
}

/* ---------------------------------------- 2D fallback ripple rings ------- */
function createRings() {
  let rings: { x: number; y: number; r: number; life: number; s: number }[] = [];
  let acc = 0;
  return {
    drop(x: number, y: number, r: number, s: number) {
      if (s < 0.004) return;
      acc += s;
      if (acc < 0.02 && rings.length) return;
      acc = 0;
      if (rings.length > 60) rings.shift();
      rings.push({ x, y, r: r * 0.5, life: 1, s: Math.min(1, s * 25) });
    },
    draw(g: CanvasRenderingContext2D, dt: number) {
      g.save();
      g.strokeStyle = "#e6ffdc";
      for (const ring of rings) {
        ring.life -= dt * 0.9;
        ring.r += dt * 70;
        if (ring.life <= 0) continue;
        g.globalAlpha = ring.life * 0.35 * ring.s;
        g.lineWidth = 1.5;
        g.beginPath();
        g.arc(ring.x, ring.y, ring.r, 0, TAU);
        g.stroke();
      }
      rings = rings.filter((ring) => ring.life > 0);
      g.restore();
    },
  };
}

/* ================================================================ main ==== */
export function createPond(container: HTMLElement): PondHandle | null {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const noise = makeNoise(9173);
  const cleanups: (() => void)[] = [];

  const makeCanvas = () => {
    const c = document.createElement("canvas");
    c.className = "hero__pond-canvas";
    c.setAttribute("aria-hidden", "true");
    container.appendChild(c);
    return c;
  };

  let canvas = makeCanvas();
  let water = createWater(canvas);
  if (!water) {
    // после неудачного WebGL на этом холсте 2D уже не получить — берём новый
    const fresh = makeCanvas();
    canvas.replaceWith(fresh);
    canvas = fresh;
  }
  const ctx2d = water ? null : canvas.getContext("2d");
  if (!ctx2d && !water) {
    canvas.remove();
    return null;
  }
  const rings = water ? null : createRings();

  const koiLayer = document.createElement("canvas");
  const surfLayer = document.createElement("canvas");
  const shadowLayer = document.createElement("canvas");
  const kgCtx = koiLayer.getContext("2d");
  const sgCtx = surfLayer.getContext("2d");
  const hgCtx = shadowLayer.getContext("2d");
  if (!kgCtx || !sgCtx || !hgCtx) return null;
  const kg: CanvasRenderingContext2D = kgCtx;
  const sg: CanvasRenderingContext2D = sgCtx;
  const hg: CanvasRenderingContext2D = hgCtx;

  const world: World = {
    W: 0,
    H: 0,
    kois: [],
    pads: [],
    flowers: [],
    glints: [],
    mouse: { x: -999, y: -999, px: -999, py: -999, vx: 0, vy: 0, speed: 0, inside: false, moved: false },
    water: null,
  };
  let floor: HTMLCanvasElement | null = null;
  let Q = 1;
  let t = 0;
  let last = 0;
  let raf = 0;
  let visible = true;
  let acc = 0;
  let ambientTimer = 0;

  const sink = {
    drop(x: number, y: number, r: number, s: number, x2?: number, y2?: number) {
      if (water) water.drop(x, y, r, s, x2, y2);
      else if (rings) rings.drop(x2 === undefined ? x : x2, y2 === undefined ? y : y2, r, s);
    },
  };
  world.water = sink;

  function populate() {
    const { W, H } = world;
    const area = clamp((W * H) / (1280 * 754), 0.45, 2.2);
    const sc = clamp(Math.min(W, H * 1.7) / 1280, 0.6, 1.25);
    world.kois = [];
    world.pads = [];
    world.flowers = [];
    world.glints = [];

    const types: KoiType[] = [
      KOI_TYPES.kohaku,
      KOI_TYPES.hajiro,
      KOI_TYPES.ogon,
      KOI_TYPES.kohaku,
      KOI_TYPES.yamabuki,
      KOI_TYPES.tancho,
      KOI_TYPES.sanke,
      KOI_TYPES.hajiro,
      KOI_TYPES.kohaku,
      KOI_TYPES.ogon,
      KOI_TYPES.yamabuki,
      KOI_TYPES.sanke,
    ];
    const base = W < 900 ? 7 : 12;
    const nk = Math.round(base * Math.sqrt(area));
    for (let i = 0; i < nk; i++) {
      const k = new Koi(
        rnd(W * 0.08, W * 0.92),
        rnd(H * 0.22, H * 0.94),
        rnd(66, 96) * sc,
        types[i % types.length],
        rnd(0, 0.7),
      );
      world.kois.push(k);
    }
    // прогреваем, чтобы рыбы стартовали уже в движении и с изогнутым телом
    const tmpWater = world.water;
    world.water = null;
    for (let i = 0; i < 90; i++) for (const k of world.kois) k.update(1 / 30, world, noise);
    world.water = tmpWater;

    // Кувшинки — только вне текстового блока: справа и у нижнего края.
    // На телефоне текст занимает почти всю ширину, поэтому там листья
    // живут узкой полосой у правого края.
    const narrow = W < 900;
    // слева — затемнённая вода под заголовком и цифрами; листья живут справа
    const inType = (x: number, y: number) =>
      narrow ? x < W * 0.62 && y < H * 0.9 : x < W * 0.56;
    // на телефоне sc ~0.6 — лист получался с ноготь и читался мусором
    const padSc = narrow ? 1 : clamp(sc, 0.8, 1.15);
    const padR = () => rnd(narrow ? 19 : 24, narrow ? 27 : 38) * padSc;
    const np = narrow ? 4 : 9;
    for (let i = 0, tries = 0; i < np && tries < np * 60; tries++) {
      const r = padR();
      // лист целиком внутри пруда — половина кувшинки на срезе экрана выглядит браком
      const x = rnd(r + 8, Math.max(r + 9, W - r - 8));
      const y = rnd(r + 8, Math.max(r + 9, H - r - 8));
      if (inType(x, y)) continue;
      const near = world.pads.some((p) => Math.hypot(p.x - x, p.y - y) < (p.r + r) * (narrow ? 1.7 : 2.6));
      if (near) continue;
      world.pads.push(new LilyPad(x, y, r));
      i++;
    }
    // цветок растёт из кувшинки, а не висит в воде сам по себе
    const nf = Math.min(world.pads.length, narrow ? 2 : 3);
    for (let i = 0; i < nf; i++) {
      const pad = world.pads[i];
      world.flowers.push(new Lotus(pad, pad.r * rnd(0.44, 0.54)));
    }
    for (let i = 0; i < 18; i++) world.glints.push(new Glint(W, H));
  }

  function resize() {
    const W = container.clientWidth;
    const H = container.clientHeight;
    if (!W || !H) return;
    const sizeChanged = Math.abs(W - world.W) > 2 || Math.abs(H - world.H) > 2;
    world.W = W;
    world.H = H;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    Q = clamp(window.devicePixelRatio || 1, 1, 1.25);
    for (const c of [koiLayer, surfLayer, shadowLayer]) {
      c.width = Math.round(W * Q);
      c.height = Math.round(H * Q);
    }
    if (water) {
      // Если FBO не собрался, оставляем WebGL как есть: 2D на этом холсте
      // уже не получить, а старый кадр останется на экране.
      try {
        water.resize(W, H, dpr);
      } catch {
        /* контекст потерян — кадр просто не обновится */
      }
    } else {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }
    floor = buildTerrain(W, H, 20241113);
    if (water) water.setFloor(floor);
    if (sizeChanged || !world.kois.length) populate();
  }

  function onPointer(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    const m = world.mouse;
    m.x = e.clientX - r.left;
    m.y = e.clientY - r.top;
    m.inside = m.x >= 0 && m.y >= 0 && m.x <= r.width && m.y <= r.height;
    m.moved = true;
  }
  const onDown = (e: PointerEvent) => {
    onPointer(e);
    if (world.mouse.inside) sink.drop(world.mouse.x, world.mouse.y, 34, -0.12);
  };
  const onLeave = () => {
    world.mouse.inside = false;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerleave", onLeave);
  });

  function updateMouse(dt: number) {
    const m = world.mouse;
    if (m.px < -900) {
      m.px = m.x;
      m.py = m.y;
    }
    const dx = m.x - m.px;
    const dy = m.y - m.py;
    m.vx = lerp(m.vx, dx / dt, 0.5);
    m.vy = lerp(m.vy, dy / dt, 0.5);
    m.speed = Math.hypot(m.vx, m.vy);
    if (m.inside && m.moved && (dx || dy)) {
      const sp = Math.hypot(dx, dy) / dt;
      const s = clamp(sp * 0.00003, 0.004, 0.035);
      sink.drop(m.px, m.py, 22, s, m.x, m.y);
    }
    m.px = m.x;
    m.py = m.y;
    m.moved = false;
  }

  function drawLayers() {
    // тени на низком разрешении — мягкие и не спорят с листьями
    hg.setTransform(1, 0, 0, 1, 0, 0);
    hg.clearRect(0, 0, shadowLayer.width, shadowLayer.height);
    hg.setTransform(1 / 3, 0, 0, 1 / 3, 0, 0);
    hg.fillStyle = "#0b2f27";
    for (const k of world.kois) {
      const o = 6 + (1 - k.depth) * 10;
      hg.save();
      hg.translate(o, o * 1.3);
      k.drawShadow(hg);
      hg.restore();
    }
    hg.save();
    hg.translate(14, 20);
    for (const p of world.pads) p.drawShadow(hg);
    for (const f of world.flowers) f.drawShadow(hg);
    hg.restore();

    kg.setTransform(1, 0, 0, 1, 0, 0);
    kg.clearRect(0, 0, koiLayer.width, koiLayer.height);
    kg.globalAlpha = 0.26;
    kg.imageSmoothingEnabled = true;
    kg.drawImage(shadowLayer, 0, 0, koiLayer.width, koiLayer.height);
    kg.globalAlpha = 1;
    kg.setTransform(Q, 0, 0, Q, 0, 0);
    const ks = world.kois.slice().sort((a, b) => b.depth - a.depth);
    for (const k of ks) k.draw(kg);

    sg.setTransform(1, 0, 0, 1, 0, 0);
    sg.clearRect(0, 0, surfLayer.width, surfLayer.height);
    sg.setTransform(Q, 0, 0, Q, 0, 0);
    for (const p of world.pads) p.draw(sg);
    for (const f of world.flowers) f.draw(sg);
    for (const gl of world.glints) gl.draw(sg);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) {
      last = now;
      return;
    }
    if (!last) last = now;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (dt <= 0) return;
    t += dt;
    if (water && water.lost()) return;

    updateMouse(dt);
    for (const k of world.kois) k.update(dt, world, noise);
    for (const p of world.pads) p.update(dt, world);
    for (const f of world.flowers) f.update(dt);
    for (const gl of world.glints) gl.update(dt, world);

    // редкая капля держит поверхность живой, даже если мышь неподвижна
    ambientTimer -= dt;
    if (ambientTimer <= 0) {
      ambientTimer = rnd(1.4, 3.4);
      sink.drop(rnd(0, world.W), rnd(world.H * 0.2, world.H), rnd(6, 12), -rnd(0.03, 0.06));
    }

    drawLayers();

    if (water) {
      water.setKoi(koiLayer);
      water.setSurface(surfLayer);
      acc += dt;
      let n = 0;
      while (acc >= 1 / 60 && n < 3) {
        water.step();
        acc -= 1 / 60;
        n++;
      }
      if (n === 3) acc = 0;
      water.draw(t);
    } else if (ctx2d && floor) {
      const g = ctx2d;
      const dpr = canvas.width / world.W;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(floor, 0, 0, canvas.width, canvas.height);
      g.drawImage(koiLayer, 0, 0, canvas.width, canvas.height);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      rings?.draw(g, dt);
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(surfLayer, 0, 0, canvas.width, canvas.height);
    }
  }

  resize();
  let rt = 0;
  const onResize = () => {
    clearTimeout(rt);
    rt = window.setTimeout(resize, 150);
  };
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    cleanups.push(() => ro.disconnect());
  } else {
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
  }
  cleanups.push(() => clearTimeout(rt));

  let io: IntersectionObserver | null = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
    });
    io.observe(canvas);
    cleanups.push(() => io?.disconnect());
  }
  const onVis = () => {
    if (document.hidden) last = 0;
  };
  document.addEventListener("visibilitychange", onVis);
  cleanups.push(() => document.removeEventListener("visibilitychange", onVis));

  if (reduceMotion) {
    // один статичный кадр, без симуляции
    last = performance.now() - 16;
    frame(performance.now());
    cancelAnimationFrame(raf);
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    canvas,
    splash(x, y, radius = 26, strength = -0.08) {
      sink.drop(x, y, radius, strength);
    },
    destroy() {
      cancelAnimationFrame(raf);
      for (const fn of cleanups) fn();
      if (water) {
        const gl = canvas.getContext("webgl2");
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
        water = null;
      }
      canvas.remove();
    },
  };
}

"use client";

import { useInView } from "@/lib/useInView";
import { SkillBar } from "./ui";

const skills = [
  { label: "React / Next.js", pct: 95 },
  { label: "TypeScript", pct: 90 },
  { label: "Node.js / Express", pct: 88 },
  { label: "PostgreSQL / MongoDB", pct: 82 },
  { label: "Docker / DevOps", pct: 72 },
  { label: "UI / UX Design", pct: 78 },
];

const principles = [
  {
    n: "01",
    title: "Понять задачу",
    text: "Сначала погружаюсь в бизнес-контекст, а потом пишу код. Хорошее решение начинается с правильного вопроса.",
  },
  {
    n: "02",
    title: "Качество кода",
    text: "Пишу чистый, читаемый и поддерживаемый код. Через год вы сможете легко его доработать.",
  },
  {
    n: "03",
    title: "Скорость",
    text: "Оптимизирую производительность на каждом уровне — от базы данных до первого рендера в браузере.",
  },
  {
    n: "04",
    title: "Коммуникация",
    text: "Отвечаю быстро, держу в курсе статуса. Никаких сюрпризов и провалов по срокам.",
  },
];

export default function SkillsSection() {
  const { ref, visible } = useInView();

  return (
    <section
      id="skills"
      style={{
        padding: "80px 32px 120px",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(32px)",
            transition:
              "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.14,1,0.3,1)",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: 20 }}>
              // Стек
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem,4vw,3.5rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                marginBottom: 48,
                color: "var(--text)",
              }}
            >
              Технологии
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {skills.map((s, i) => (
                <SkillBar key={s.label} label={s.label} pct={s.pct} delay={i * 80} />
              ))}
            </div>
          </div>

          <div>
            <div className="section-label" style={{ marginBottom: 20 }}>
              // Подход
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem,4vw,3.5rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                marginBottom: 48,
                color: "var(--text)",
              }}
            >
              Принципы
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {principles.map((item) => (
                <div
                  key={item.n}
                  style={{
                    display: "flex",
                    gap: 20,
                    padding: "20px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--accent)",
                      paddingTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {item.n}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "1rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--text)",
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

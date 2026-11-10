"use client";

import Image from "next/image";
import { useInView } from "@/lib/useInView";
import { SITE_HOST } from "@/lib/site";

export default function AboutSection() {
  const { ref, visible } = useInView();

  return (
    <section id="about" className="section-pad">
      <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="two-col"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            alignItems: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(32px)",
          transition:
            "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: 20 }}>
            {"// Кто делает"}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem,5vw,4rem)",
              textTransform: "uppercase",
              lineHeight: 0.92,
              marginBottom: 32,
              color: "var(--text)",
            }}
          >
            Один исполнитель —
            <br />
            <span style={{ color: "var(--accent)" }}>весь результат</span>
          </h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "1rem", marginBottom: 20 }}>
            Меня зовут Евгений, я full-stack разработчик с 5+ годами коммерческого опыта. Делаю
            <strong style={{ color: "var(--text)" }}> сайты для малого бизнеса</strong>, которые
            приносят заявки: в Беларуси, России и для русскоязычных компаний в США и Канаде.
          </p>
          <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "1rem", marginBottom: 36 }}>
            Работаю без менеджеров и посредников: вы общаетесь напрямую с тем, кто делает. Каждый
            проект — с измеримым результатом: заявки, скорость, позиции в Google и Яндексе.
            Портфолио — 5 живых сайтов, цифры по каждому открыты в разделе кейсов. Пишу по-русски,
            работаю дистанционно — Минск, Полоцк, США без разницы.
          </p>
          <a href="https://t.me/rahunak" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: "none" }}>
            Написать в Telegram →
          </a>
        </div>

        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "3/4",
              maxHeight: 520,
              background: "#141414",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              src="/avatar.avif"
              alt="Евгений Зайко — разработчик и SEO-специалист"
              fill
              sizes="(max-width: 860px) 100vw, 600px"
              style={{ objectFit: "cover", opacity: 0.65 }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(8,8,8,0.75) 0%, transparent 60%)",
              }}
            />
            <div style={{ position: "absolute", inset: 0, border: "1px solid var(--border)" }} />
            <div
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                width: 72,
                height: 72,
                borderTop: "2px solid var(--accent)",
                borderRight: "2px solid var(--accent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -8,
                left: -8,
                width: 72,
                height: 72,
                borderBottom: "2px solid var(--accent)",
                borderLeft: "2px solid var(--accent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                background: "rgba(8,8,8,0.88)",
                border: "1px solid var(--border)",
                padding: "12px 16px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                }}
              >
                МОГУ ВЗЯТЬ 1–2 ПРОЕКТА
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                {SITE_HOST}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

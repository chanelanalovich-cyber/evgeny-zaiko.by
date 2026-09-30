"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/lib/useInView";

/* ── Counter ── */
export function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useInView(0.5);

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        setVal(target);
        clearInterval(id);
      } else {
        setVal(current);
      }
    }, 30);
    return () => clearInterval(id);
  }, [visible, target]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} style={{ display: "inline-block" }}>
      {val}
      {suffix}
    </span>
  );
}

/* ── SkillBar ── */
export function SkillBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
  const { ref, visible } = useInView(0.3);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
            letterSpacing: "0.08em",
          }}
        >
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--accent)" }}>
          {pct}%
        </span>
      </div>
      <div className="skill-bar">
        <div
          className={`skill-bar-fill ${visible ? "active" : ""}`}
          style={{ width: `${pct}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

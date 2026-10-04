"use client";

import { useState } from "react";
import { useInView } from "@/lib/useInView";
import { SITE_HOST } from "@/lib/site";

const CONTACTS = [
  { label: "Telegram", value: "@rahunak", href: "https://t.me/rahunak", primary: true },
  { label: "Email", value: "zaiko.eugene@gmail.com", href: "mailto:zaiko.eugene@gmail.com" },
  { label: "LinkedIn", value: "eugene-zaiko", href: "https://www.linkedin.com/in/eugene-zaiko" },
];

export default function ContactSection() {
  const { ref, visible } = useInView();

  return (
    <section id="contact" style={{ padding: "120px 32px" }}>
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
              "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: 20 }}>
              {"// Начнём с разговора"}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem,6vw,5rem)",
                textTransform: "uppercase",
                lineHeight: 0.92,
                marginBottom: 24,
                color: "var(--text)",
              }}
            >
              Есть задача?
              <br />
              <span style={{ color: "var(--accent)" }}>Напишите.</span>
            </h2>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.75,
                fontSize: "1rem",
                marginBottom: 48,
              }}
            >
              Опишите в двух словах, что нужно: сайт, клиенты из поиска или автоматизация. Отвечу в
              течение пары часов, честно скажу, что получится и сколько стоит. Первичная
              консультация — бесплатно.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {CONTACTS.map(({ label, value, href, primary }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 0",
                    borderBottom: "1px solid var(--border)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      color: "var(--muted)",
                      letterSpacing: "0.1em",
                      width: 80,
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: primary ? "1rem" : "0.82rem",
                      color: "var(--accent)",
                      fontWeight: primary ? 700 : 400,
                    }}
                  >
                    {value} ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

/* ── ContactForm: рабочая отправка ── */
function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");
  const [mailtoHref, setMailtoHref] = useState("");

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    borderRadius: 0,
    boxSizing: "border-box",
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--accent)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  };

  const composeText = () =>
    `Заявка с ${SITE_HOST}\nИмя: ${name}\nКонтакт: ${contact}\n\n${message}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const text = composeText();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch {
      // Фолбэк: открываем почтовый клиент с готовым текстом — заявка не теряется
      setMailtoHref(
        `mailto:zaiko.eugene@gmail.com?subject=${encodeURIComponent(
          "Заявка с сайта " + SITE_HOST
        )}&body=${encodeURIComponent(text)}`
      );
      setStatus("fallback");
    }
  };

  if (status === "sent") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 16,
          paddingTop: 40,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "3rem",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Отправлено ✓
        </div>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Спасибо! Заявка у меня — отвечу в течение пары часов. Если срочно: Telegram{" "}
          <a href="https://t.me/rahunak" style={{ color: "var(--accent)" }}>@rahunak</a>.
        </p>
      </div>
    );
  }

  if (status === "fallback") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingTop: 40,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.8rem",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          Почтовый клиент открыт
        </div>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Ваше письмо уже составлено — просто нажмите «Отправить» в почте. Либо напишите сразу в
          Telegram:{" "}
          <a href="https://t.me/rahunak" style={{ color: "var(--accent)" }}>@rahunak</a>.
        </p>
        <a href={mailtoHref} className="btn-primary" style={{ textDecoration: "none", textAlign: "center" }}>
          Открыть письмо ещё раз →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="section-label" style={{ marginBottom: 8 }}>
        {"// Бриф за 1 минуту"}
      </div>
      <input
        required
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputBase}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <input
        required
        placeholder="Telegram или email для связи"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        style={inputBase}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <textarea
        required
        placeholder="Что нужно: сайт / клиенты из поиска / автоматизация? Какой у вас бизнес?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        style={{ ...inputBase, resize: "vertical" }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button
        type="submit"
        className="btn-primary"
        style={{ alignSelf: "flex-start" }}
        disabled={status === "sending"}
      >
        {status === "sending" ? "Отправляю..." : "Получить ответ и цену →"}
      </button>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>
        Отвечаю лично в течение 2–3 часов в рабочее время.
      </p>
    </form>
  );
}

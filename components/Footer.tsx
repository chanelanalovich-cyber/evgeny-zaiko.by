export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "28px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--muted)",
          letterSpacing: "0.1em",
        }}
      >
        © {new Date().getFullYear()} ЕВГЕНИЙ ЗАЙКО · EVGENY-ZAIKO.BY
      </div>
      <a
        href="https://t.me/rahunak"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--accent)",
          letterSpacing: "0.1em",
          textDecoration: "none",
        }}
      >
        TELEGRAM @RAHUNAK ↗
      </a>
    </footer>
  );
}

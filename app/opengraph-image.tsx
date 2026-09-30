import { ImageResponse } from "next/og";

export const alt = "Евгений Зайко — сайты с клиентами под ключ | разработка + SEO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #16160f 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            width: 96,
            height: 6,
            background: "#c8ff00",
            marginBottom: 40,
            display: "flex",
          }}
        />
        <div
          style={{
            color: "#fff",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.15,
            display: "flex",
            maxWidth: 1000,
          }}
        >
          Сайт + топ выдачи + заявки вам в Telegram
        </div>
        <div
          style={{
            color: "#c8ff00",
            fontSize: 30,
            fontWeight: 600,
            marginTop: 28,
            display: "flex",
          }}
        >
          Кейс: +1415% поискового трафика за месяц
        </div>
        <div
          style={{
            color: "#9ca3af",
            fontSize: 24,
            marginTop: 24,
            display: "flex",
          }}
        >
          Евгений Зайко · разработка и SEO · Беларусь
        </div>
        <div
          style={{
            color: "#6b7280",
            fontSize: 22,
            marginTop: 16,
            display: "flex",
          }}
        >
          eugene.zaiko.by
        </div>
      </div>
    ),
    { ...size }
  );
}

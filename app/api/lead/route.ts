import { NextRequest, NextResponse } from "next/server";
import { SITE_HOST } from "@/lib/site";

// Приём заявок с формы и пересылка в Telegram Bot API.
// Оба env задаются на проде (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — токен бота (создать через @BotFather)
//   TELEGRAM_CHAT_ID   — ваш chat_id (узнать через @userinfobot или getUpdates)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact, message } = body ?? {};

    if (!name || !contact || !message) {
      return NextResponse.json(
        { error: "name, contact and message are required" },
        { status: 400 }
      );
    }

    if (
      typeof name !== "string" ||
      typeof contact !== "string" ||
      typeof message !== "string" ||
      name.length > 100 ||
      contact.length > 200 ||
      message.length > 3000
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      // На проде env обязателен; отсутствие = конфигурационная ошибка → клиент
      // получит fallback на mailto (фронт это обрабатывает).
      console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured");
      return NextResponse.json({ error: "Service not configured" }, { status: 500 });
    }

    const text =
      `🎯 *Новая заявка с ${SITE_HOST}*\n\n` +
      `*Имя:* ${escapeMd(name)}\n` +
      `*Контакт:* ${escapeMd(contact)}\n\n` +
      `${escapeMd(message)}`;

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!tgRes.ok) {
      console.error("Telegram API error:", await tgRes.text());
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeMd(s: string): string {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

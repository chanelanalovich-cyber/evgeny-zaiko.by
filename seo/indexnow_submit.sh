#!/usr/bin/env bash
# Отправка всех URL из sitemap в IndexNow (единый эндпоинт: Яндекс + Bing + Seznam + Naver).
#
# Запускать ПОСЛЕ деплоя на Vercel: скрипт сам проверит, что ключ доступен на проде.
#   bash seo/indexnow_submit.sh
#
# Успех: HTTP 200 или 202. Ошибка 403 обычно = ключ ещё не задеплоен (ключ-файл 404).
set -euo pipefail

KEY="0ddf588811aff163edcfed8a4f5dc35c"
SITE="https://evgeny-zaiko.by"
KEY_LOC="$SITE/$KEY.txt"
ENDPOINT="https://api.indexnow.org/indexnow"

# 0. Ключ должен быть доступен на проде — иначе IndexNow не примет отправку.
KEY_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$KEY_LOC")
if [ "$KEY_CODE" != "200" ]; then
  echo "ОШИБКА: ключ-файл $KEY_LOC отвечает $KEY_CODE (нужен 200)."
  echo "Сначала задеплойте сайт (git push → Vercel), затем повторите."
  exit 1
fi
echo "Ключ на проде: OK ($KEY_LOC)"

# 1. Собираем URL из живого sitemap прода.
URLS=$(curl -s "$SITE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's/<loc>//' -e 's|</loc>||')
COUNT=$(echo "$URLS" | grep -c .)
echo "URL в sitemap: $COUNT"
if [ "$COUNT" -eq 0 ]; then
  echo "ОШИБКА: sitemap пустой или недоступен."
  exit 1
fi

# 2. Формируем JSON-тело и отправляем.
BODY=$(python3 - "$KEY" "$KEY_LOC" $URLS <<'PY'
import json, sys
key, key_loc, urls = sys.argv[1], sys.argv[2], sys.argv[3:]
print(json.dumps({
    "host": "evgeny-zaiko.by",
    "key": key,
    "keyLocation": key_loc,
    "urlList": urls,
}, ensure_ascii=False))
PY
)

CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$BODY")

case "$CODE" in
  200|202) echo "ОК: IndexNow принял $COUNT URL (HTTP $CODE). Яндекс и Bing заберут их из очереди." ;;
  403)     echo "ОШИБКА 403: ключ не принят. Проверьте, что $KEY_LOC отдаёт 200 и содержимое файла совпадает с ключом." ; exit 1 ;;
  422)     echo "ОШИБКА 422: URL не из хоста evgeny-zaiko.by или формат тела неверный." ; exit 1 ;;
  429)     echo "ОШИБКА 429: слишком много запросов — повторите позже." ; exit 1 ;;
  *)       echo "НЕОЖИДАННЫЙ ОТВЕТ: HTTP $CODE." ; exit 1 ;;
esac

# 3. Показываем, что именно отправлено.
echo "--- Отправленные URL:"
echo "$URLS"

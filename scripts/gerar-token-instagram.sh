#!/bin/bash
# Gera Long-Lived Token do Instagram (validade 60 dias)
# Uso: ./scripts/gerar-token-instagram.sh

APP_ID="1284297553808241"
APP_SECRET="COLE_APP_SECRET_AQUI"
SHORT_TOKEN="COLE_TOKEN_CURTO_AQUI"

echo "Trocando por Long-Lived Token..."

RESPONSE=$(curl -s "https://graph.facebook.com/v25.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${SHORT_TOKEN}")

echo ""
echo "=== Resposta ==="
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

TOKEN=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token','ERRO'))" 2>/dev/null)
EXPIRES=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('expires_in','?'))" 2>/dev/null)

if [ "$TOKEN" != "ERRO" ] && [ -n "$TOKEN" ]; then
  echo ""
  echo "=== Long-Lived Token gerado com sucesso ==="
  echo "Validade: ${EXPIRES} segundos (~60 dias)"
  echo ""
  echo "Atualize no Vercel com os comandos:"
  echo "  vercel env rm INSTAGRAM_ACCESS_TOKEN production"
  echo "  vercel env add INSTAGRAM_ACCESS_TOKEN production"
  echo ""
  echo "Token: $TOKEN"
else
  echo ""
  echo "=== ERRO ao gerar token ==="
  echo "Verifique APP_SECRET e SHORT_TOKEN no script."
fi

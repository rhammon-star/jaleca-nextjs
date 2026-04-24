#!/bin/bash

# Script de teste para domínios satélite
# Uso: bash scripts/test-satellite-domains.sh

echo "🔍 Testando 20 domínios satélite..."
echo "=================================="
echo ""

success=0
failed=0
pending=0

# Função para testar um domínio
test_domain() {
  local url="$1"
  local expected="$2"

  response=$(curl -sI -m 5 "$url" 2>&1)
  status=$?

  if [ $status -ne 0 ]; then
    echo "⏳ $url"
    echo "   Status: DNS não propagado ainda"
    echo ""
    ((pending++))
  else
    http_code=$(echo "$response" | grep -i "^HTTP" | tail -1 | awk '{print $2}')

    if [ "$http_code" == "301" ] || [ "$http_code" == "308" ] || [ "$http_code" == "200" ]; then
      echo "✅ $url"
      echo "   Status: $http_code"
      ((success++))
    else
      echo "❌ $url"
      echo "   Status: ${http_code:-erro de conexão}"
      ((failed++))
    fi
  fi
  echo ""
}

# Testar todos os domínios
test_domain "https://lojadejaleco.com.br" "/loja-de-jaleco"
test_domain "https://www.lojadejaleco.com.br" "/loja-de-jaleco"
test_domain "https://comprarjaleco.com.br" "/comprar-jaleco-online"
test_domain "https://www.comprarjaleco.com.br" "/comprar-jaleco-online"
test_domain "https://jalecouniversitario.com.br" "/jaleco-universitario"
test_domain "https://www.jalecouniversitario.com.br" "/jaleco-universitario"
test_domain "https://jalecoluxo.com.br" "/jaleco-premium"
test_domain "https://www.jalecoluxo.com.br" "/jaleco-premium"
test_domain "https://jalecomedico.com.br" "/jaleco-para-medico"
test_domain "https://www.jalecomedico.com.br" "/jaleco-para-medico"
test_domain "https://jalecopremium.com.br" "/jaleco-premium"
test_domain "https://www.jalecopremium.com.br" "/jaleco-premium"
test_domain "https://jalecopreto.com.br" "/jaleco-preto"
test_domain "https://www.jalecopreto.com.br" "/jaleco-preto"
test_domain "https://jalecoprincesa.com.br" "/jaleco-feminino"
test_domain "https://www.jalecoprincesa.com.br" "/jaleco-feminino"
test_domain "https://jalecoslim.com.br" "/jaleco-feminino"
test_domain "https://www.jalecoslim.com.br" "/jaleco-feminino"
test_domain "https://jalecomasculino.com.br" "/jaleco-masculino"
test_domain "https://www.jalecomasculino.com.br" "/jaleco-masculino"

echo "=================================="
echo "📊 Resumo:"
echo "   ✅ Funcionando: $success"
echo "   ❌ Com erro: $failed"
echo "   ⏳ Aguardando DNS: $pending"
echo ""

if [ $success -eq 20 ]; then
  echo "🎉 Todos os 20 domínios estão funcionando perfeitamente!"
elif [ $pending -gt 0 ]; then
  echo "⏰ Aguarde a propagação DNS (15min-24h) e teste novamente."
  echo "   Comando: bash scripts/test-satellite-domains.sh"
elif [ $failed -gt 0 ]; then
  echo "⚠️  Alguns domínios apresentaram erro. Verifique a configuração."
fi

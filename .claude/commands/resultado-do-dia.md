# Resultado do Dia — Jaleca (Ads + Custos)

Busque e consolide TODOS os dados de mídia paga e custos operacionais. **Sempre trazer ONTEM (fechamento) + HOJE (parcial até o momento).** Execute todas as etapas em paralelo sempre que possível.

**Para dados de SEO orgânico (GSC, PageSpeed, GA4 orgânico):** use `/resultado-seo`.

---

## ETAPA 0 — Pedidos WooCommerce (OBRIGATÓRIO — executar primeiro)

Buscar pedidos de ONTEM e HOJE via WooCommerce REST API:

```bash
AUTH=$(echo -n "contato@jaleca.com.br:y6dH RnuE dKbD 46Wa zylK zB7Q" | base64)
HOJE=$(date +%Y-%m-%d)
ONTEM=$(date -v-1d +%Y-%m-%d)

echo "=== PEDIDOS ONTEM ==="
curl -s "https://wp.jaleca.com.br/wp-json/wc/v3/orders?after=${ONTEM}T00:00:00&before=${ONTEM}T23:59:59&per_page=50&orderby=date&order=desc" \
  -H "Authorization: Basic $AUTH"

echo "=== PEDIDOS HOJE ==="
curl -s "https://wp.jaleca.com.br/wp-json/wc/v3/orders?after=${HOJE}T00:00:00&before=${HOJE}T23:59:59&per_page=50&orderby=date&order=desc" \
  -H "Authorization: Basic $AUTH"
```

**Apresente para cada período:**
- Tabela: ID | Cliente | Produto(s) | Total | Status | Horário
- Total de pedidos e faturamento real do dia
- Ticket médio

---

## ETAPA 1 — Google Ads (DETALHADO)

Use credenciais de `conexoes_ads_rapidas.md`. Execute para ONTEM e HOJE:

### 1a. Campanhas de ontem + hoje
```bash
TOKEN=$(bash ~/.claude/scripts/google-ads-get-token.sh 2>/dev/null | tail -1)
CONFIG="$HOME/.claude/google-ads-config.json"
CLIENT_ID=$(jq -r '.credentials.client_customer_id_numeric' "$CONFIG")
MANAGER_ID=$(jq -r '.credentials.manager_customer_id' "$CONFIG" | tr -d '-')
DEV_TOKEN=$(jq -r '.credentials.developer_token' "$CONFIG")

# ONTEM
curl -s -X POST "https://googleads.googleapis.com/v23/customers/${CLIENT_ID}/googleAds:searchStream" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "developer-token: ${DEV_TOKEN}" \
  -H "login-customer-id: ${MANAGER_ID}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.ctr, metrics.conversions, metrics.cost_per_conversion, metrics.average_cpc FROM campaign WHERE segments.date DURING YESTERDAY AND campaign.status = ENABLED ORDER BY metrics.cost_micros DESC"}'

# HOJE
curl -s -X POST "https://googleads.googleapis.com/v23/customers/${CLIENT_ID}/googleAds:searchStream" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "developer-token: ${DEV_TOKEN}" \
  -H "login-customer-id: ${MANAGER_ID}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.ctr, metrics.conversions, metrics.cost_per_conversion, metrics.average_cpc FROM campaign WHERE segments.date DURING TODAY AND campaign.status = ENABLED ORDER BY metrics.cost_micros DESC"}'
```

### 1b. Termos de pesquisa reais — ONTEM + HOJE
```bash
# ONTEM
curl -s -X POST "https://googleads.googleapis.com/v23/customers/${CLIENT_ID}/googleAds:searchStream" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "developer-token: ${DEV_TOKEN}" \
  -H "login-customer-id: ${MANAGER_ID}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT search_term_view.search_term, campaign.name, metrics.clicks, metrics.impressions, metrics.cost_micros FROM search_term_view WHERE segments.date DURING YESTERDAY AND metrics.impressions > 0 ORDER BY metrics.clicks DESC LIMIT 30"}'

# HOJE
curl -s -X POST "https://googleads.googleapis.com/v23/customers/${CLIENT_ID}/googleAds:searchStream" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "developer-token: ${DEV_TOKEN}" \
  -H "login-customer-id: ${MANAGER_ID}" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT search_term_view.search_term, campaign.name, metrics.clicks, metrics.impressions, metrics.cost_micros FROM search_term_view WHERE segments.date DURING TODAY AND metrics.impressions > 0 ORDER BY metrics.clicks DESC LIMIT 30"}'
```

**Apresente para cada período:**
- Tabela campanhas: nome | cliques | impressões | CTR | custo | conversões | CPC | CPA
- Tabela termos reais de busca — destacar irrelevantes com 🚨
- Total gasto e alertas de orçamento

---

## ETAPA 2 — Meta Ads (DETALHADO)

Use token de `conexoes_ads_rapidas.md`. Execute:

### 2a. Insights por campanha — ONTEM + HOJE
```bash
META_TOKEN="[ler de conexoes_ads_rapidas.md]"
AD_ACCOUNT="act_2098470580937214"

# ONTEM
curl -s "https://graph.facebook.com/v20.0/${AD_ACCOUNT}/insights?fields=campaign_name,impressions,clicks,spend,cpm,cpc,ctr,reach,frequency,actions,cost_per_action_type&date_preset=yesterday&level=campaign&access_token=${META_TOKEN}"

# HOJE
curl -s "https://graph.facebook.com/v20.0/${AD_ACCOUNT}/insights?fields=campaign_name,impressions,clicks,spend,cpm,cpc,ctr,reach,frequency,actions,cost_per_action_type&date_preset=today&level=campaign&access_token=${META_TOKEN}"
```

### 2b. Breakdown por placement — ONTEM
```bash
curl -s "https://graph.facebook.com/v20.0/${AD_ACCOUNT}/insights?fields=campaign_name,impressions,clicks,spend,cpc,actions&date_preset=yesterday&level=campaign&breakdowns=publisher_platform,impression_device&access_token=${META_TOKEN}"
```

### 2c. Breakdown por idade e gênero — ONTEM
```bash
curl -s "https://graph.facebook.com/v20.0/${AD_ACCOUNT}/insights?fields=campaign_name,impressions,clicks,spend,cpc,actions&date_preset=yesterday&level=campaign&breakdowns=age,gender&access_token=${META_TOKEN}"
```

**Apresente:**
- Tabela campanhas: nome | impressões | alcance | frequência | cliques | CTR | gasto | CPM | CPC
- Eventos do pixel: ViewContent | AddToCart | InitiateCheckout | Purchase | valores
- ROAS se houver purchase com valor
- Breakdown placement: Facebook Feed vs Instagram vs Reels vs Stories
- Breakdown idade/gênero: qual perfil clica mais
- Alertas: frequência alta (>3), CTR baixo (<1%), pixel sem eventos

---

## ETAPA 3 — Microsoft Ads (se disponível)

Verificar credenciais Microsoft Ads em `conexoes_ads_rapidas.md`. Se configurado:
- Campanhas ativas hoje
- Gasto, cliques, impressões, conversões
- Comparar com Google Ads para mesmas keywords

Se não disponível: indicar claramente e pular.

---

## ETAPA 4 — 💰 Gastos SEO Detalhados (NOVO)

Consolide TODOS os custos relacionados a SEO/conteúdo/infra do dia:

### 4a. Custos de infraestrutura SEO
- **Vercel** (hospedagem das páginas SEO/cidades/profissões) — ler `mcp__plugin_vercel_vercel__*` se disponível
- **Upstash KV** — consumo do dia (já temos backlog revisão 2026-06-08)
- **Vercel Blob / Storage** — uploads de imagens SEO
- **WordPress (blog)** — hospedagem se aplicável

### 4b. Custos de IA / Geração de conteúdo
- **Gemini API** — tokens consumidos hoje (estimar via histórico de chamadas)
- **OpenAI / GPT** — tokens hoje
- **Anthropic / Claude** — tokens hoje
- **Fashn.ai** — gerações de imagem de produto
- **Outras APIs SEO** (DataForSEO, SerpAPI, etc.) — se houver

### 4c. Custos editoriais e ferramentas
- **Posts publicados no blog WP hoje** — quantidade × custo estimado
- **Páginas SEO criadas hoje** (cidades, profissões, LPs) — quantidade
- **Backlinks publicados na rede satélite** — quantidade × domínios usados
- **Ferramentas pagas** (Ahrefs, SEMrush, Surfer, etc. — se aplicável)

### 4d. Esforço operacional do dia
- **Sessões de trabalho Claude/Gemini/GPT hoje** — extrair do histórico
- **Commits relacionados a SEO** — `git log --since=midnight --grep="seo\|aeo\|sitemap\|schema\|seo:"`
- **Horas estimadas investidas em SEO**

**Apresente em tabela consolidada:**

```
| Item | Categoria | Quantidade | Custo R$ | Observação |
|------|-----------|------------|----------|------------|
| Vercel hosting | Infra | — | R$X | rateio diário |
| Upstash KV | Infra | X ops | R$X | |
| Gemini API | IA | X tokens | R$X | |
| Posts blog WP | Conteúdo | X posts | R$X | |
| Páginas SEO criadas | Conteúdo | X páginas | — | esforço |
| Backlinks publicados | Off-page | X | — | rede satélite |
| ... | | | | |
| **TOTAL SEO DIA** | | | **R$X** | |
```

Se algum dado não estiver disponível via API: marcar como "estimativa" ou "manual".

---

## ETAPA 5 — Consolidação e Relatório Final

**REGRA CRÍTICA DE FORMATO:** O relatório DEVE ter dois blocos completamente separados — primeiro **BLOCO 1: ONTEM (fechamento)** com TODOS os canais (pedidos, Google, Meta, Microsoft, resumo financeiro do dia, alertas do dia). Depois **BLOCO 2: HOJE (parcial)** com TODOS os canais. **NUNCA misturar ontem e hoje na mesma tabela ou seção.** Cada bloco é autossuficiente e fecha em si mesmo.

Apresente nesta ordem exata:

```
═══════════════════════════════════════════════════
📊 RESULTADO — JALECA
═══════════════════════════════════════════════════

╔══════════════════════════════════════════════════╗
║  BLOCO 1 — ONTEM (FECHAMENTO) — [DATA ONTEM]    ║
╚══════════════════════════════════════════════════╝

## 🛒 Pedidos WooCommerce — Ontem
| ID | Cliente | Produto | Total | Status | Horário |
|----|---------|---------|-------|--------|---------|

**Total ontem:** X pedidos | Faturamento R$X | Ticket médio R$X

## 🟢 Google Ads — Ontem
| Campanha | Cliques | Impr | CTR | Gasto | Conv | CPC | CPA |
|----------|---------|------|-----|-------|------|-----|-----|

**Total ontem:** Gasto R$X | Cliques X | Conv X | CPA R$X

### Termos reais de busca — Ontem
| Termo | Cliques | Gasto | Relevante? |
|-------|---------|-------|------------|

## 🔵 Meta Ads — Ontem
| Campanha | Impr | Alcance | Freq | Cliques | CTR | Gasto | CPM | CPC |
|----------|------|---------|------|---------|-----|-------|-----|-----|

**Total ontem:** Gasto R$X

### Eventos do Pixel — Ontem
| Evento | Disparos |
|--------|----------|
| ViewContent | X |
| AddToCart | X |
| InitiateCheckout | X |
| Purchase | X |

### Breakdown Placement — Ontem
| Plataforma | Impr | Cliques | CTR | Gasto |
|-----------|------|---------|-----|-------|

### Breakdown Idade × Gênero — Ontem
| Perfil | Impr | Cliques | CTR | Gasto |
|--------|------|---------|-----|-------|

## 🟡 Microsoft Ads — Ontem
[dados ou "não configurado / pendente"]

## 💸 Resumo Financeiro — Ontem
| Canal | Gasto | Conv | CPA | ROAS |
|-------|-------|------|-----|------|
| Google Ads | R$X | X | R$X | X |
| Meta Ads | R$X | X | R$X | X |
| Microsoft Ads | R$X | X | R$X | X |
| **TOTAL ADS** | **R$X** | | | |

**Faturamento WC ontem:** R$X | **ROAS consolidado:** X

## 🚨 Alertas — Ontem
- item 1

## ✅ O que foi bem — Ontem
- item 1

═══════════════════════════════════════════════════

╔══════════════════════════════════════════════════╗
║  BLOCO 2 — HOJE (PARCIAL) — [DATA HOJE]         ║
╚══════════════════════════════════════════════════╝

## 🛒 Pedidos WooCommerce — Hoje (parcial)
| ID | Cliente | Produto | Total | Status | Horário |
|----|---------|---------|-------|--------|---------|

**Total hoje (parcial):** X pedidos | Faturamento R$X

## 🟢 Google Ads — Hoje (parcial)
| Campanha | Cliques | Impr | CTR | Gasto | Conv |
|----------|---------|------|-----|-------|------|

**Total hoje (parcial):** Gasto R$X | Conv X

### Termos reais — Hoje (parcial)
| Termo | Cliques | Gasto | Relevante? |
|-------|---------|-------|------------|

## 🔵 Meta Ads — Hoje (parcial)
| Campanha | Impr | Cliques | CTR | Gasto | Freq |
|----------|------|---------|-----|-------|------|

**Total hoje (parcial):** Gasto R$X

## 🟡 Microsoft Ads — Hoje (parcial)
[dados ou "não configurado / pendente"]

## 💸 Resumo Financeiro — Hoje (parcial)
| Canal | Gasto | Conv |
|-------|-------|------|
| Google Ads | R$X | X |
| Meta Ads | R$X | X |
| Microsoft Ads | R$X | X |
| **TOTAL ADS HOJE** | **R$X** | |

## 🎯 Próximas ações sugeridas (com base em ontem + parcial de hoje)
1. ação 1 — motivo
2. ação 2 — motivo
3. ação 3 — motivo

═══════════════════════════════════════════════════

## 💰 GASTOS SEO DETALHADOS

### Infraestrutura
| Serviço | Consumo | Custo R$ |
|---------|---------|----------|
| Vercel | — | R$X |
| Upstash KV | X ops | R$X |
| Blob/Storage | X MB | R$X |
| WordPress | — | R$X |

### IA / Conteúdo
| Ferramenta | Consumo | Custo R$ |
|------------|---------|----------|
| Gemini API | X tokens | R$X |
| OpenAI | X tokens | R$X |
| Claude | X tokens | R$X |
| Fashn.ai | X gerações | R$X |

### Esforço operacional
| Item | Quantidade |
|------|-----------|
| Posts blog publicados | X |
| Páginas SEO criadas | X |
| Backlinks publicados | X |
| Commits SEO no dia | X |
| Sessões IA hoje | X |

**🔢 Custo SEO total do dia: R$X**

(Custo SEO é diário consolidado — não dividir entre ontem/hoje.)

═══════════════════════════════════════════════════
### Consumo estimado por IA nesta tarefa
| IA | % | Papel |
|----|---|-------|
| Claude Code | X% | Execução, chamadas API, consolidação |
| Gemini | X% | Contexto e estimativas |
| GPT | X% | — |
_Estimativa operacional._
═══════════════════════════════════════════════════
```

---

## Regras obrigatórias

- 🚨 **NUNCA misturar ontem e hoje na mesma tabela ou seção.** O relatório tem dois blocos totalmente independentes: BLOCO 1 (Ontem — fechamento, autossuficiente, com seus próprios totais/alertas/o-que-foi-bem) e BLOCO 2 (Hoje — parcial, com seus próprios totais e próximas ações). Apenas a seção SEO no fim é consolidada do dia operacional.
- Executar etapas 1, 2, 3 e 4 em paralelo (independentes entre si)
- Se alguma fonte falhar: indicar claramente o erro, continuar com as demais, nunca travar
- Sempre ler o token Meta de `conexoes_ads_rapidas.md` (não hardcodar)
- Prefixar cada seção com o agente responsável: 🟢 Google Ads, 🔵 Meta, 🟡 Microsoft, 💰 Custos
- Ao final: tabela % participação por IA (estimativa operacional)
- Se gasto Google Ads > R$20 sem conversão: destacar 🚨
- Se frequência Meta > 3: destacar ⚠️
- Se custo SEO/dia subir > 30% vs média: destacar ⚠️
- Para dados SEO orgânicos (GSC, PageSpeed, GA4): use `/resultado-seo`

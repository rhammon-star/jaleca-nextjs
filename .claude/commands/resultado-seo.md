# Resultado SEO — Jaleca (Relatório Completo)

Busque e consolide TODOS os dados de SEO disponíveis via API e apresente um relatório unificado e detalhado. Execute todas as etapas em paralelo sempre que possível.

---

## ETAPA 1 — Google Search Console (OBRIGATÓRIO — MÁXIMO DETALHE)

Use o MCP `mcp__gsc__*`. Propriedade: `sc-domain:jaleca.com.br`. Execute todas as chamadas abaixo.

### 1a. Overview geral (últimos 3 dias)
```
mcp__gsc__get_performance_overview(site_url="sc-domain:jaleca.com.br", days=3)
```

### 1b. Top 20 palavras-chave (últimos 7 dias)
```
mcp__gsc__get_search_analytics(
  site_url="sc-domain:jaleca.com.br",
  days=7,
  dimensions=["query"],
  row_limit=20
)
```

### 1c. Top 20 páginas (últimos 7 dias)
```
mcp__gsc__get_search_analytics(
  site_url="sc-domain:jaleca.com.br",
  days=7,
  dimensions=["page"],
  row_limit=20
)
```

### 1d. Keywords por página (top 5 páginas × top keywords)
```
mcp__gsc__get_search_by_page_query(
  site_url="sc-domain:jaleca.com.br",
  days=7,
  row_limit=30
)
```

### 1e. Indexação e erros
```
mcp__gsc__check_indexing_issues(site_url="sc-domain:jaleca.com.br")
```

### 1f. Sitemaps
```
mcp__gsc__get_sitemaps(site_url="sc-domain:jaleca.com.br")
```

### 1g. Comparar períodos (últimos 7d vs 7d anteriores)
```
mcp__gsc__compare_search_periods(
  site_url="sc-domain:jaleca.com.br",
  current_days=7,
  previous_days=7
)
```

### 1h. Inspecionar URLs críticas
```
mcp__gsc__batch_url_inspection(
  site_url="sc-domain:jaleca.com.br",
  urls=[
    "https://jaleca.com.br/",
    "https://jaleca.com.br/jaleco-feminino",
    "https://jaleca.com.br/jaleco-medico",
    "https://jaleca.com.br/jaleco-dentista",
    "https://jaleca.com.br/categoria/jalecos-femininos"
  ]
)
```

**Apresente:**
- Tabela top 20 keywords: palavra | cliques | impressões | CTR | posição
- Tabela top 20 páginas: URL | cliques | impressões | CTR | posição
- Status de indexação: indexadas / com erro / excluídas
- Status sitemap: enviado / URLs indexadas / erros
- Comparativo 7d vs 7d anterior: delta cliques, impressões, posição
- Alertas de schema/rich results se disponíveis

---

## ETAPA 2 — PageSpeed Insights (mobile + desktop)

API pública — sem autenticação necessária. URLs prioritárias:

```bash
# Mobile — Homepage
curl -s "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://jaleca.com.br/&strategy=mobile&category=performance&category=seo" | jq '{
  score_mobile: .lighthouseResult.categories.performance.score,
  lcp: .lighthouseResult.audits["largest-contentful-paint"].displayValue,
  cls: .lighthouseResult.audits["cumulative-layout-shift"].displayValue,
  fid: .lighthouseResult.audits["total-blocking-time"].displayValue,
  seo_score: .lighthouseResult.categories.seo.score,
  fcp: .lighthouseResult.audits["first-contentful-paint"].displayValue,
  speed_index: .lighthouseResult.audits["speed-index"].displayValue
}'

# Desktop — Homepage
curl -s "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://jaleca.com.br/&strategy=desktop&category=performance" | jq '{
  score_desktop: .lighthouseResult.categories.performance.score,
  lcp: .lighthouseResult.audits["largest-contentful-paint"].displayValue,
  cls: .lighthouseResult.audits["cumulative-layout-shift"].displayValue
}'

# Mobile — Jaleco Feminino (página mais importante)
curl -s "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://jaleca.com.br/jaleco-feminino&strategy=mobile&category=performance" | jq '{
  score_mobile: .lighthouseResult.categories.performance.score,
  lcp: .lighthouseResult.audits["largest-contentful-paint"].displayValue,
  cls: .lighthouseResult.audits["cumulative-layout-shift"].displayValue
}'
```

**Apresente:**
- Tabela: URL | Score Mobile | Score Desktop | LCP | CLS | TBT | FCP
- Status CWV: ✅ Bom / ⚠️ Melhorar / 🚨 Ruim (LCP <2.5s, CLS <0.1, INP <200ms)
- Top 3 oportunidades de melhoria se score < 80

---

## ETAPA 3 — GA4 — Tráfego Orgânico (se credenciais disponíveis)

Verificar se `GA4_SERVICE_ACCOUNT_JSON` está disponível no ambiente Vercel.
Se não disponível, indicar claramente e pular.

Se disponível, buscar via Data API v1 — **foco em orgânico**:
- Sessões orgânicas (canal `Organic Search`)
- Usuários novos vs recorrentes via organic
- Taxa de conversão do canal orgânico
- Páginas de entrada orgânicas mais visitadas
- Tempo médio de sessão orgânica
- Bounce rate orgânico
- Eventos via organic: add_to_cart, begin_checkout, purchase + valor

---

## ETAPA 3b — Microsoft Clarity (UX comportamental)

Token + project ID estão em memória (`clarity_token.md`). Project ID: `wgdsoti2de`. Limite: 10 req/dia.

```bash
CLARITY_TOKEN="<ler de memory/clarity_token.md>"
curl -s "https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1" \
  -H "Authorization: Bearer $CLARITY_TOKEN" | jq
```

**Apresentar:**
- Tráfego: sessions, distinct users, bots, pages/session
- Engagement: tempo total vs ativo
- Scroll depth médio
- 🚨 Rage clicks, Dead clicks, Quickback (sair rápido), Script errors
- Top páginas (PageTitle)
- Breakdown Device / OS / Browser / Country / Referrer

**Alertas obrigatórios:**
- RageClickCount > 2% das sessões → 🚨 UX quebrado
- QuickbackClick > 30% → ⚠️ landing decepcionando (já estamos em 39% — investigar)
- ScrollDepth < 40% → ⚠️ hero não engaja
- DeadClickCount > 5% → 🚨 botão/link parece clicável mas não funciona

---

## ETAPA 3c — Google Ads (auditoria rápida — últimos 7 dias)

Conectar via `google-ads-api` usando credenciais de `.env.google-ads`. Executar o script abaixo via `node -e` inline:

```js
// Puxar: campanhas ativas, ad groups, keywords (QS), search terms top 30, ad strength
// Credenciais: GOOGLE_ADS_CLIENT_ID, CLIENT_SECRET, DEVELOPER_TOKEN, CUSTOMER_ID (4446591621), LOGIN_CUSTOMER_ID (6077867298), REFRESH_TOKEN

// 1. Campanhas — últimos 7 dias (WHERE segments.date DURING LAST_7_DAYS AND campaign.status != 'REMOVED')
//    Campos: campaign.name, status, type, budget, impressions, clicks, ctr, avg_cpc, cost_micros, conversions, cost_per_conversion, search_impression_share, search_budget_lost_impression_share, search_rank_lost_impression_share

// 2. Keywords — top 30 por custo (WHERE campaign.status = 'ENABLED', segments.date DURING LAST_7_DAYS)
//    Campos: keyword.text, match_type, quality_info.quality_score, quality_info.search_predicted_ctr, impressions, clicks, cost_micros, conversions

// 3. Search Terms — top 30 por custo (FROM search_term_view WHERE campaign.status = 'ENABLED')
//    Campos: search_term, status, campaign.name, ad_group.name, impressions, clicks, cost_micros, conversions

// 4. Ad Strength (FROM ad_group_ad WHERE campaign.status = 'ENABLED' AND status != 'REMOVED')
//    Campos: campaign.name, ad_group.name, ad.id, ad_strength, impressions, clicks, ctr, cost_micros, conversions
```

**Calcular e apresentar:**

### Visão macro (7 dias)
| Campanha | Status | Budget/dia | Gasto | Cliques | Conv. | CPA | IS | IS Perdido Budget | IS Perdido Rank |
|---|---|---|---|---|---|---|---|---|---|

### Alertas automáticos de Google Ads
- 🔴 IS perdido por budget > 20%
- 🔴 QS < 5 em keywords com gasto > R$50
- 🔴 Search terms de concorrente sendo pagos (detectar nomes de marcas: dra cherie, dra charm, aspen, boutique jaleco, etc.)
- 🔴 Keywords com gasto > 3x CPA meta (R$150) e 0 conversões
- 🟡 CTR < 3% em Search
- 🟡 Ad Strength < "Excelente"
- 🔴 Campanha com cliques > 100 e 0 conversões (suspeita de rastreamento quebrado)

### Top keywords problemáticas (QS < 7)
| Keyword | QS | CTR Previsto | Gasto | Conv. | Diagnóstico |

### Search terms para negativar (detectar automaticamente)
- Status 5 = added automatically (AI Max) — revisar se irrelevante
- Termos de concorrente → negativar
- Termos de produto não vendido → negativar

### Ad Strength por anúncio
| Ad Group | Ad ID | Força | Impressões | Conv. |

---

## ETAPA 4 — Consolidação e Relatório Final

Apresente nesta ordem:

```
═══════════════════════════════════════════════════
📊 RESULTADO SEO — [DATA] — JALECA
═══════════════════════════════════════════════════

## 📊 GSC — BUSCA ORGÂNICA

### Resumo 3 dias
Cliques: X | Impressões: X | CTR: X% | Posição média: X

### Top 20 Palavras-chave (7 dias)
| Palavra | Cliques | Impressões | CTR | Posição |
|---------|---------|------------|-----|---------|

### Top 20 Páginas (7 dias)
| Página | Cliques | Impressões | CTR | Posição |
|--------|---------|------------|-----|---------|

### Keywords por página (top 5 páginas)
| Página | Palavra | Cliques | Posição |
|--------|---------|---------|---------|

### Indexação
- Indexadas: X | Com erro: X | Excluídas: X
- Sitemap: X URLs enviadas / X indexadas
- Erros detalhados: [listar]

### URLs críticas — status de indexação
| URL | Status | Última varredura | Problemas |
|-----|--------|------------------|-----------|

### Comparativo 7d vs 7d anterior
- Cliques: X → X (Δ X%)
- Impressões: X → X (Δ X%)
- Posição média: X → X
- CTR: X → X

---

## ⚡ PAGESPEED — CORE WEB VITALS

| Página | Mobile | Desktop | LCP | CLS | TBT | FCP |
|--------|--------|---------|-----|-----|-----|-----|
| Homepage | X | X | Xs | X | Xms | Xs |
| /jaleco-feminino | X | X | Xs | X | Xms | Xs |

Status CWV: ✅ / ⚠️ / 🚨

### Top oportunidades de melhoria
1. ...
2. ...
3. ...

---

## 🔍 GA4 — TRÁFEGO ORGÂNICO (se disponível)
- Sessões orgânicas: X
- Usuários novos/recorrentes: X / X
- Taxa de conversão orgânica: X%
- Top páginas de entrada orgânica: [tabela]
- Eventos orgânicos: AddToCart X | InitiateCheckout X | Purchase X (R$X)

---

---

## 📢 GOOGLE ADS — ÚLTIMOS 7 DIAS

### Visão Macro
| Campanha | Gasto | Cliques | Conv. | CPA | IS | IS Budget Lost | IS Rank Lost |
|---|---|---|---|---|---|---|---|

### Keywords com problema (QS < 7)
| Keyword | QS | Gasto | Conv. | Ação |
|---|---|---|---|---|

### Search Terms para negativar
| Termo | Tipo | Custo | Ação |
|---|---|---|---|

### Ad Strength
| Ad Group | Força | Impressões | Conv. |
|---|---|---|---|

### Alertas Google Ads
- 🔴 / 🟡 / 🟢 [gerados automaticamente pela análise]

---

## 🚨 ALERTAS SEO DO DIA
- [ ] item 1
- [ ] item 2

## ✅ O QUE FOI BEM
- item 1

## 🎯 PRÓXIMAS AÇÕES SEO (priorizadas por impacto)
1. ação 1 — motivo
2. ação 2 — motivo
3. ação 3 — motivo

═══════════════════════════════════════════════════
### Consumo estimado por IA nesta tarefa
| IA | % | Papel |
|----|---|-------|
| Claude Code | X% | Execução, chamadas API, consolidação |
| GSC MCP | X% | Dados busca orgânica |
| Gemini | X% | Contexto |
| GPT | 0% | — |
_Estimativa operacional._
═══════════════════════════════════════════════════
```

---

## Regras obrigatórias

- Executar etapas 1, 2 e 3 em paralelo (independentes entre si)
- Se alguma fonte falhar: indicar claramente o erro, continuar com as demais, nunca travar
- Prefixar cada seção com o agente responsável: 📊 GSC, ⚡ PageSpeed, 🔍 GA4
- Ao final: tabela % participação por IA (estimativa operacional)
- Rich Results Test: mencionar como "verificação manual recomendada" com o link direto
- Se posição média piorou > 0.5: destacar em vermelho 🚨
- Se score mobile < 70: destacar 🚨
- Se LCP > 2.5s: destacar ⚠️

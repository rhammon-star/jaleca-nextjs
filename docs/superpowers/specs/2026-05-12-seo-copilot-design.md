# Design Spec — SEO Copilot
**Data:** 2026-05-12 | **Status:** Aprovado | **Projeto:** jaleca-nextjs

---

## Objetivo

Construir um painel SEO interno em `/seo-copilot` dentro do jaleca-nextjs que replique as principais funcionalidades do Semrush usando DataForSEO APIs + LLMs, focado exclusivamente em jaleca.com.br.

**Custo estimado:** $5–10/mês DataForSEO (com cache agressivo).  
**Não escala** para multi-projeto — escopo deliberadamente restrito a jaleca.com.br.

---

## Arquitetura — Opção C (rota isolada, código desacoplado)

O SEO Copilot vive em `/seo-copilot/*` dentro do jaleca-nextjs existente, mas com módulos isolados em `lib/dataforseo/` e API routes próprias em `app/api/seo/`. Não polui o core do jaleca. Extraível futuramente.

---

## Estrutura de Arquivos

```
app/seo-copilot/
  layout.tsx                    ← sidebar nav + auth por env var
  page.tsx                      ← dashboard overview (métricas consolidadas)
  rank-tracking/page.tsx        ← Position Tracking (27 keywords)
  competitors/page.tsx          ← Domain Overview + Organic Rankings
  keyword-gap/page.tsx          ← Keyword Gap vs concorrentes
  keywords/page.tsx             ← Keyword Magic Tool
  backlinks/page.tsx            ← Backlinks + Referring Domains
  site-audit/page.tsx           ← Site Audit (On-Page API)
  ai-insights/page.tsx          ← AI Analyst — Claude streaming

lib/dataforseo/
  client.ts                     ← ✅ JÁ EXISTE — HTTP client com Basic Auth
  rank-tracker.ts               ← ✅ JÁ EXISTE — 27 keywords, detectDrops, JSON history
  backlinks.ts                  ← ✅ JÁ EXISTE — summary, anchors, referring domains
  competitors.ts                ← NOVO — Domain Analytics API
  keywords.ts                   ← NOVO — Keywords Data API
  serp.ts                       ← NOVO — SERP Advanced API
  site-audit.ts                 ← NOVO — On-Page API

app/api/seo/
  rank-tracking/route.ts
  competitors/route.ts
  keyword-gap/route.ts
  keywords/route.ts
  backlinks/route.ts
  site-audit/route.ts
  ai-insights/route.ts          ← streaming response
```

---

## Módulos e Endpoints DataForSEO

| Página | Endpoint DataForSEO | Cache TTL | Custo/mês est. |
|---|---|---|---|
| **Dashboard** | dados cacheados dos módulos | — | — |
| **Rank Tracking** | `/serp/google/organic/live/advanced` | 24h | ~$2,50 |
| **Competitors** | `/dataforseo_labs/google/competitors_domain/live` | 24h | ~$0,20 |
| **Organic Rankings** | `/dataforseo_labs/google/ranked_keywords/live` | 24h | ~$0,30 |
| **Keyword Gap** | `/dataforseo_labs/google/keyword_gap/live` | 24h | ~$0,25 |
| **Keyword Magic** | `/keywords_data/google_ads/keywords_for_keywords/live` | 1h | ~$0,50 |
| **Backlinks** | `/backlinks/summary/live` etc. | 24h | ~$0,15 |
| **Site Audit** | `/on_page/task_post` + `/on_page/pages` | 7 dias | ~$0,20 |
| **AI Insights** | Claude API (claude-sonnet-4-6) | sem cache | ~$0,50 LLM |

**Total: ~$4,60–8/mês**

---

## Módulos Detalhados

### 1. Dashboard (`/seo-copilot`)
- Cards: Authority Score, Organic Keywords, Backlinks, Ref. Domains, posição média
- Alertas ativos (quedas de ranking detectadas pelo detectDrops)
- Top 5 keywords por posição atual
- Link rápido para cada módulo

### 2. Rank Tracking (`/seo-copilot/rank-tracking`)
- Tabela: keyword | posição atual | URL | variação vs ontem
- Gráfico de linha: posição × tempo (histórico JSON existente)
- Badge de alerta quando queda > 3 posições
- Botão "Atualizar agora" (chama API on-demand)

### 3. Competitors (`/seo-copilot/competitors`)
- Lista de domínios concorrentes orgânicos com: overlap %, keywords compartilhadas, traffic estimate
- Tabela "Top Pages" do concorrente selecionado
- Input para pesquisar qualquer domínio

### 4. Keyword Gap (`/seo-copilot/keyword-gap`)
- Input: 1–3 domínios concorrentes
- Tabela: keyword | volume | KD | CPC | quem ranqueia | jaleca ranqueia?
- Score de oportunidade = volume × (1/KD) × intent_weight
- Filtros: só transacional, só volume > X

### 5. Keyword Magic (`/seo-copilot/keywords`)
- Input: termo seed (ex: "jaleco feminino")
- Retorna: exact match, related, autocomplete, questions
- Colunas: volume | KD | CPC | intenção | trend
- Exporta para JSON

### 6. Backlinks (`/seo-copilot/backlinks`)
- Reutiliza `lib/dataforseo/backlinks.ts` existente
- Cards: total backlinks, ref. domains, spam score, broken
- Tabela referring domains com rank e país
- Timeseries: novos vs perdidos

### 7. Site Audit (`/seo-copilot/site-audit`)
- Dispara crawl via On-Page API (task assíncrona)
- Após completar: tabela de issues por severidade (critical/warning/info)
- Issues: broken links, duplicate meta, missing H1, redirect chains, canonicals
- Claude gera plano de remediação priorizado

### 8. AI Insights (`/seo-copilot/ai-insights`)
- Agrega dados dos outros módulos
- Streaming response via Claude API
- Modos: "Quick Wins", "Ameaças", "Oportunidades de Conteúdo"
- Output formatado em Markdown com bullets acionáveis

---

## Auth

Middleware simples em `app/seo-copilot/layout.tsx`:
```ts
// verifica header ou cookie com SEO_COPILOT_SECRET
// se não autenticado → redireciona para /seo-copilot/login
```

Variável `SEO_COPILOT_SECRET` no `.env.local`. Sem Clerk, sem OAuth — é painel interno.

---

## Persistência

**Banco:** MySQL Hostinger (conta existente, mesmo servidor do WooCommerce).
- Driver: `mysql2` com pool de conexões
- Banco dedicado: `jaleca_seo_copilot` (separado do WooCommerce)
- Conexão via `DATABASE_SEO_URL` no `.env.local`

**Schema principal:**

```sql
-- Histórico de posições (rank tracking)
CREATE TABLE rankings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  position SMALLINT,
  url VARCHAR(500),
  title VARCHAR(500),
  recorded_at DATETIME NOT NULL,
  INDEX idx_keyword_date (keyword, recorded_at)
);

-- Snapshots de competitors
CREATE TABLE competitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  overlap_pct FLOAT,
  shared_keywords INT,
  traffic_estimate INT,
  recorded_at DATETIME NOT NULL
);

-- Keywords do gap analysis
CREATE TABLE keyword_gap (
  id INT AUTO_INCREMENT PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  volume INT,
  kd SMALLINT,
  cpc FLOAT,
  intent VARCHAR(50),
  competitor_domains JSON,
  opportunity_score FLOAT,
  recorded_at DATETIME NOT NULL,
  INDEX idx_score (opportunity_score)
);

-- Resultados de site audit
CREATE TABLE audit_issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_url VARCHAR(500),
  issue_type VARCHAR(100),
  severity ENUM('critical','warning','info'),
  description TEXT,
  audit_date DATETIME NOT NULL,
  INDEX idx_severity (severity)
);

-- Cache de backlinks (snapshot diário)
CREATE TABLE backlink_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  backlinks INT,
  referring_domains INT,
  spam_score FLOAT,
  recorded_at DATETIME NOT NULL
);
```

JSON files em `data/seo-tracking/` mantidos apenas como fallback de emergência.

---

## Cache Strategy

Todos os API routes usam `next: { revalidate: N }`:
- Rankings: 86400s (24h) — roda 1x/dia
- Backlinks: 86400s (24h)
- Competitors: 86400s (24h)
- Keywords: 3600s (1h) — on-demand
- Site Audit: 604800s (7 dias) — pesado, roda semanalmente

---

## UI

- Sidebar esquerda fixa com 8 seções + ícones
- Fundo escuro: `#0F1923`, accent laranja: `#FF6B35` (similar Semrush)
- Tabelas: ordenação client-side, busca inline
- Gráficos: Recharts (instalar se não presente)
- Mobile: sidebar colapsável, tabelas com scroll horizontal
- Loading states: skeleton loaders por seção

---

## O que NÃO está no escopo

- AI Visibility (ChatGPT/AI Mode mentions) — DataForSEO não tem
- Semrush Rank (métrica proprietária)
- Algorithm Volatility Sensor
- Local SEO / GBP management
- Map Rank Tracker
- Multi-projeto / modo agência

---

## Fases de Build

**Fase 1 — Core (maior ROI):**
1. Layout + auth + sidebar
2. Rank Tracking (já tem lib, só UI)
3. Backlinks (já tem lib, só UI)
4. Competitors + Keyword Gap (novos libs + UI)

**Fase 2:**
5. Keyword Magic Tool
6. Site Audit
7. Dashboard overview

**Fase 3:**
8. AI Insights (Claude streaming)
9. Alertas

---

## Definition of Done (MVP)

Usuário acessa `/seo-copilot`, loga com secret, e consegue:
- Ver posição atual das 27 keywords + histórico
- Ver backlinks e referring domains
- Descobrir concorrentes orgânicos
- Encontrar keyword gaps vs 2–3 concorrentes
- Disparar site audit e receber lista de issues

Sem abrir Semrush.

---

## Consumo estimado por IA nesta tarefa

| IA | Participação | Papel |
|---|---|---|
| Claude Code | 80% | Design, análise, spec |
| Gemini | 15% | Análise de gaps e riscos do PRD |
| GPT | 0% | MCP falhou |
| GSC | 5% | Contexto do dashboard Semrush (jaleca) |

# PRD — Integração DataForSEO × Jaleca
**Versão:** 1.0 | **Data:** 20/04/2026 | **Status:** Proposta

---

## 1. Contexto e Problema

A Jaleca opera com SEO **manual e reativo** — sem monitoramento automatizado de posições, sem alertas de queda, sem comparação sistemática com concorrentes.

**Situação atual:**
- "jalecos" = posição 37.5 (crítico, sem visibilidade de evolução diária)
- 27 hubs criados, nenhum com ranking confirmado
- Concorrente amodabranca.com.br — sem dados de benchmark automatizado
- Todo diagnóstico SEO depende de acessar GSC manualmente

**DataForSEO** é uma API de dados SEO que permite automatizar coleta de SERP, keywords, backlinks e features especiais do Google — a custo muito baixo (~5–10 USD/mês para o volume do Jaleca).

---

## 2. Objetivo

Construir um **painel SEO automatizado** integrado ao projeto Next.js que:
- Mostre posições das keywords críticas em tempo real
- Compare com concorrentes automaticamente
- Alerte sobre quedas antes que impactem vendas
- Alimente os hubs com dados de long-tail e PAA (People Also Ask)

**Meta de impacto:** Reduzir tempo de diagnóstico SEO de 2h/semana para 10min/semana.

---

## 3. Funcionalidades Priorizadas (ROI)

### 🥇 P1 — Rank Tracking Diário
**Endpoint:** `SERP API / Rank Tracker`
**O que faz:** Monitora posições das keywords no Google BR diariamente.

Keywords mínimas para monitorar:
```
jalecos, jaleco feminino, jaleco masculino, jaleco branco,
jaleco para dentista, jaleco para enfermeira, jaleco para médico,
jaleco universitário, jaleco personalizado, jaleco barato
```

**Output:** Dashboard com gráfico de posição × tempo por keyword.
**Custo:** ~$2–3/mês (30 keywords × 30 dias × $0.003)
**Trigger de alerta:** queda > 3 posições em 24h → notificação

---

### 🥇 P1 — Competitor Intelligence
**Endpoint:** `Competitors API / SERP Competitors`
**O que faz:** Mapeia top 10 do Google para cada keyword e compara com amodabranca + jaleca.

**Output:** Tabela com: URL concorrente | posição | título | meta description
**Custo:** ~$1–2/mês (rodadas semanais)
**Uso:** Identificar quais páginas dos concorrentes estão ranqueando para keywords dos nossos hubs.

---

### 🥈 P2 — Long-tail & PAA por Hub
**Endpoint:** `Keywords Data / Related Keywords + Questions`
**O que faz:** Para cada profissão (dentista, enfermeiro, barbeiro…) retorna:
- 20-50 variações long-tail
- Perguntas que aparecem no PAA (People Also Ask)

**Output:** Arquivo JSON por hub com sugestões de FAQ e subtópicos.
**Custo:** ~$0.50/mês (rodada única por hub, 27 hubs = 27 créditos)
**Uso:** Alimentar automaticamente a seção FAQ dos HubProfissaoTemplates.

---

### 🥈 P2 — SERP Features Monitor
**Endpoint:** `SERP API / Advanced`
**O que faz:** Identifica se nossas URLs aparecem em Featured Snippet, PAA, Imagens, Sitelinks.

**Output:** Lista de oportunidades de snippet por keyword.
**Custo:** Incluso no rank tracking.
**Uso:** Priorizar quais páginas otimizar para rich results.

---

### 🥉 P3 — Backlinks Monitor
**Endpoint:** `Backlinks API`
**O que faz:** Monitora novos backlinks ganhos/perdidos por jaleca.com.br e amodabranca.
**Custo:** ~$1/mês
**Prioridade:** Baixa até atingir >500 cliques/mês.

---

## 4. Arquitetura Técnica

### Stack
- **API:** DataForSEO REST API (autenticação Basic Auth: login + senha)
- **Scheduler:** Cron no Next.js via `app/api/cron/seo-track/route.ts` (Vercel Cron)
- **Storage:** Supabase ou arquivo JSON em `/data/seo-tracking/`
- **Dashboard:** Página `/admin/seo` — tabela + gráficos com Recharts
- **Alertas:** Email via Resend quando keyword cai > 3 posições

### Estrutura de arquivos
```
src/
  lib/
    dataforseo/
      client.ts          # wrapper da API (autenticação + retry)
      rank-tracker.ts    # busca posições
      keywords.ts        # long-tail + PAA
      competitors.ts     # SERP competitor data
  app/
    api/
      cron/
        seo-track/route.ts    # roda diariamente via Vercel Cron
    admin/
      seo/
        page.tsx              # dashboard visual
data/
  seo-tracking/
    positions.json       # histórico de posições (30 dias)
    competitors.json     # snapshot semanal
    keywords/
      dentista.json      # long-tail por profissão
      barbeiro.json
      ...
```

### Cliente DataForSEO (exemplo)
```typescript
// src/lib/dataforseo/client.ts
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD
const BASE_URL = 'https://api.dataforseo.com/v3'

export async function dataForSeoRequest(endpoint: string, payload: object) {
  const credentials = Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64')
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  
  if (!response.ok) throw new Error(`DataForSEO error: ${response.status}`)
  return response.json()
}
```

### Cron de rank tracking (exemplo)
```typescript
// src/app/api/cron/seo-track/route.ts
import { dataForSeoRequest } from '@/lib/dataforseo/client'

const KEYWORDS_TO_TRACK = [
  'jalecos', 'jaleco feminino', 'jaleco para dentista',
  'jaleco para enfermeira', 'jaleco universitário',
  // ... 30 keywords
]

export async function GET() {
  const payload = KEYWORDS_TO_TRACK.map(keyword => ({
    keyword,
    location_code: 1001767, // Brasil
    language_code: 'pt',
    device: 'desktop',
  }))

  const result = await dataForSeoRequest('/serp/google/organic/live/advanced', payload)
  
  // Salvar resultado + comparar com dia anterior + alertar se queda > 3
  // ...
  
  return Response.json({ ok: true, tracked: KEYWORDS_TO_TRACK.length })
}
```

### Vercel Cron config (`vercel.json`)
```json
{
  "crons": [{
    "path": "/api/cron/seo-track",
    "schedule": "0 7 * * *"
  }]
}
```

---

## 5. Variáveis de Ambiente Necessárias

```env
DATAFORSEO_LOGIN=seu_email@dominio.com
DATAFORSEO_PASSWORD=sua_senha_api
```

---

## 6. Custo Estimado

| Funcionalidade | Frequência | Custo/mês |
|---|---|---|
| Rank Tracking (30 keywords) | Diário | ~$3.00 |
| Competitor SERP | Semanal | ~$1.50 |
| Long-tail por hub | Uma vez por hub | ~$1.00 |
| SERP Features | Semanal | ~$0.50 |
| **TOTAL** | | **~$6.00/mês** |

**Plano recomendado:** DataForSEO pay-as-you-go (sem mensalidade, paga por crédito).
**Créditos para começar:** $20 (suficiente para ~3 meses de operação).

---

## 7. Roadmap de Implementação

### Sprint 1 — Fundação (2 dias)
- [ ] Criar conta DataForSEO + configurar credenciais
- [ ] Implementar `client.ts` com auth + error handling
- [ ] Implementar `rank-tracker.ts` para as 10 keywords críticas
- [ ] Salvar resultado em JSON local

### Sprint 2 — Automação (2 dias)
- [ ] Configurar Vercel Cron (`0 7 * * *`)
- [ ] Implementar detecção de queda > 3 posições
- [ ] Enviar alerta por email via Resend

### Sprint 3 — Dashboard (3 dias)
- [ ] Página `/admin/seo` com tabela de posições
- [ ] Gráfico de evolução por keyword (Recharts)
- [ ] Comparativo jaleca × amodabranca

### Sprint 4 — Enriquecimento de Hubs (2 dias)
- [ ] Script one-time para puxar long-tail + PAA dos 27 hubs
- [ ] Salvar em `/data/seo-tracking/keywords/{profissao}.json`
- [ ] Integrar sugestões de FAQ no HubProfissaoTemplate

---

## 8. Critérios de Sucesso

- ✅ Posição de "jalecos" monitorada diariamente (baseline = 37.5)
- ✅ Alerta automático em < 1h quando keyword cai > 3 posições
- ✅ Dashboard mostrando top 30 keywords com histórico 30 dias
- ✅ 27 hubs enriquecidos com FAQ baseado em PAA real do Google
- ✅ Custo mensal < $10

---

## 9. Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Excesso de créditos | Rate limit no cron + cache de 24h |
| API down | Retry com exponential backoff no client.ts |
| Credenciais expostas | Apenas variáveis de ambiente, nunca hardcoded |
| Volume crescendo além de $10/mês | Alert por webhook quando gasto > $8 |

---

## 10. Próximos Passos

1. **Criar conta** em dataforseo.com (grátis para testar, ~$20 para iniciar)
2. **Confirmar stack de storage** — JSON local (simples) ou Supabase (escalável)
3. **Aprovar** este PRD → iniciar Sprint 1

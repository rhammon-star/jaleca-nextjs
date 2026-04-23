# DataForSEO Backlinks API — Jaleca

## Visão Geral

API integrada ao Next.js para consultar dados de backlinks do DataForSEO. Endpoint: `/api/seo/backlinks`

## Arquitetura

```
lib/dataforseo/
├── client.ts          # Wrapper HTTP (auth, retry, error handling)
├── backlinks.ts       # Funções de consulta de backlinks
└── rank-tracker.ts    # Rank tracking (existente)

app/api/seo/backlinks/
└── route.ts           # Endpoint da API
```

## Endpoints da API

### GET /api/seo/backlinks

| Parâmetro | Tipo | Default | Descrição |
|---|---|---|---|
| `action` | string | `summary` | Tipo de consulta |
| `limit` | number | `100` | Limite de resultados |
| `target2` | string | `amodabranca.com.br` | Segundo target para intersection |
| `dateFrom` | string | `2026-03-01` | Início do período (timeseries) |
| `dateTo` | string | hoje | Fim do período (timeseries) |

### Ações Disponíveis

| Action | Descrição | Retorno |
|---|---|---|
| `summary` | Perfil completo de backlinks | BacklinkSummary |
| `anchors` | Textos âncora dos links | AnchorData[] |
| `domains` | Domínios que referenciam | ReferringDomain[] |
| `broken` | Backlinks quebrados (status 526) | BrokenData + PBN domains + Cylex |
| `timeseries` | Evolução novos/perdidos | TimeseriesData[] |
| `intersection` | Domínios em comum com concorrente | IntersectionData |
| `report` | Relatório completo (todas as anteriores) | FullReport |

## Exemplos de Uso

```bash
# Resumo de backlinks
GET /api/seo/backlinks?action=summary

# Anchors text
GET /api/seo/backlinks?action=anchors

# Backlinks quebrados + lista PBN para disavow
GET /api/seo/backlinks?action=broken

# Timeseries de evolução (março/abril)
GET /api/seo/backlinks?action=timeseries&dateFrom=2026-03-01&dateTo=2026-04-21

# Domínios em comum com amodabranca
GET /api/seo/backlinks?action=intersection&target2=amodabranca.com.br

# Relatório completo
GET /api/seo/backlinks?action=report
```

## Funções do Módulo (lib/dataforseo/backlinks.ts)

### fetchBacklinksSummary()
Retorna métricas principais do dominio.

```typescript
const summary = await fetchBacklinksSummary()
// { rank: 137, backlinks: 81, referring_domains: 48, spam_score: 14, ... }
```

### fetchAnchors()
Retorna textos âncora dos backlinks.

### fetchReferringDomains(limit?)
Retorna domínios que apontam para o target.

### fetchBrokenBacklinks(limit?)
Retorna backlinks com `is_broken=true`. Útil para identificar links quebrados.

### extractPbnDomains(backlinks, minSpamScore?)
Extrai lista de domínios PBN (spam >= 50, excluindo Cylex).

```typescript
const broken = await fetchBrokenBacklinks()
const pbnDomains = extractPbnDomains(broken)
// ['seobacklinks.agency', 'rankgrow.agency', ...]
```

### extractCylexLinks(backlinks)
Extrai links legítimos do Cylex que precisam de redirect.

### fetchTimeseries(dateFrom, dateTo)
Retorna evolução de backlinks novos/perdidos entre datas.

### fetchDomainIntersection(target2)
Compara domínios em comum entre dois targets.

## Variáveis de Ambiente

```env
DATAFORSEO_LOGIN=seu_email@dataforseo.com
DATAFORSEO_PASSWORD=sua_senha_api
```

## Custos (DataForSEO)

| Endpoint | Custo aproximado |
|---|---|
| `/backlinks/summary/live` | $0.02 |
| `/backlinks/anchors/live` | $0.02 |
| `/backlinks/referring_domains/live` | $0.02 |
| `/backlinks/backlinks/live` | $0.03 |
| `/backlinks/timeseries_new_lost_summary/live` | $0.02 |
| `/backlinks/domain_intersection/live` | $0.02 |

Período de teste: ~$0.00 (14 dias grátis)

## Arquivos de Saída (data/seo-backlinks/)

Após executar o diagnóstico, os seguintes arquivos são gerados:

```
data/seo-backlinks/
├── README.md                    # Este arquivo
├── disavow-jaleca.txt           # Lista para Google Disavow Tool (36 domínios)
├── cloudflare-cylex-redirects.txt  # Redirects para Cloudflare (19 URLs)
├── pbn-removal-email-template.txt  # Template para emails de remoção
├── broken-backlinks-full.json   # Dados completos dos 60 links
└── report.json                  # Resumo do relatório
```

## Fluxo de Uso (Backlinks Cleanup)

```typescript
// 1. Buscar backlinks quebrados
const broken = await fetchBrokenBacklinks()

// 2. Extrair domínios PBN para disavow
const pbnDomains = extractPbnDomains(broken)
// → Upload em g.co/reports/disavow

// 3. Extrair links Cylex para redirect
const cylexLinks = extractCylexLinks(broken)
// → Configurar no Cloudflare Redirect Rules

// 4. Monitorar spam score
const summary = await fetchBacklinksSummary()
// spam_score deve cair de 14 para ~5-8 após disavow
```

## Status Codes dos Backlinks

| Code | Significado |
|---|---|
| 200 | OK |
| 301/302 | Redirect (não é broken) |
| 404 | Not Found |
| 526 | Cloudflare bloqueando (broken) |
| 403 | Forbidden |

Os 60 broken backlinks do Jaleca retornam status 526 (Cloudflare).
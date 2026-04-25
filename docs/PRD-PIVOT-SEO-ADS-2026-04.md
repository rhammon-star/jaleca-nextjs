# PRD — Pivot SEO + Google Ads (Abril 2026)

**Data:** 25/04/2026
**Owner:** Rhammon
**Origem:** R$2.800/mês de Google Ads → 0 conversões em 28 dias. Pivot completo baseado em dados DataForSEO reais.

---

## 1. Diagnóstico (dados reais, 25/04/2026)

### Performance atual
- **Search "Jalecos" R$70/dia** → 1.726 cliques, 0 conversões
- **Shopping aberto R$30/dia** → 2.671 cliques, 0 conversões
- **Total queimado:** ~R$2.800/mês sem retorno

### Onde as vendas REAIS vêm (GA4 28d, R$3.867 receita, 52 conv)
- Direct: 25 conv, R$1.986 (51%)
- Unassigned (WhatsApp/links): 14 conv, R$1.620 (42%)
- Organic Shopping: 8 conv, R$227
- Organic Search: 3 conv, R$14
- **Paid Search/Shopping/Social: 0 conversões**

### SEO atual
- 18 keywords monitoradas: **0 ranqueando**
- Apenas "jalecos" #47 (fora do tracking)
- Concorrente principal: **dracherie.com.br** domina head terms

### Descoberta crítica DataForSEO
URLs `/jaleco-para-X` perdem **5-12x volume** vs `/jaleco-X`:
- `jaleco médico`: 1.600/mês vs `jaleco para médico`: 170/mês
- `jaleco veterinário`: 880 vs 70 (12x)
- `jaleco psicóloga`: 2.900 vs 0

---

## 2. Estratégia

### Princípios

1. **Parar de competir em head terms** (`jaleco feminino`, `jalecos`) — dracherie domina, CPC alto, ROI negativo
2. **Usar landings dedicadas existentes** + criar as novas que dados mostram valer
3. **Renomear URLs** removendo "para" — ganho imediato 5-12x volume
4. **Mandar tráfego direto pra landing específica** — Quality Score alto → CPC baixo
5. **Validar com R$100/dia antes de escalar**

### Não fazer
- ❌ Bordado (Jaleca não bordada e não troca bordado)
- ❌ Hyperlocal Ipatinga (já vende bem ali)
- ❌ Ads para domínios redirect (jalecomedico.com.br etc — 4 dias, zero autoridade)
- ❌ Lançar Ads antes das landings novas estarem no ar

---

## 3. Plano de URLs

### 3a. Renomear (com 301 redirect das antigas)

| URL atual | URL nova | Vol/mês ganho |
|---|---|---|
| `/jaleco-medico` | `/jaleco-medico` | +1.430 |
| `/jaleco-veterinario` | `/jaleco-veterinario` | +810 |
| `/jaleco-farmaceutico` | `/jaleco-farmaceutico` | +390 |
| `/jaleco-psicologa` | `/jaleco-psicologa` | +2.900 |
| `/jaleco-enfermeiro` | `/jaleco-enfermeiro` | 0 (URL limpa) |
| `/jaleco-enfermagem` | `/jaleco-enfermagem` | 0 (URL limpa) |
| `/jaleco-dentista` | `/jaleco-dentista` | 0 (URL limpa) |
| `/jaleco-nutricionista` | `/jaleco-nutricionista` | 0 (URL limpa) |
| `/jaleco-esteticista` | `/jaleco-esteticista` | 0 (URL limpa) |

**Manter "para":** `/jaleco-fisioterapeuta` (DataForSEO mostrou anomalia — sem "para" zerou)

### 3b. Criar landings novas

| URL | Termo principal | Vol/mês | CPC | Prioridade |
|---|---|---|---|---|
| `/jaleco-psicologa` | jaleco psicóloga / psicologia | 2.900 | R$0,11 | 🔴 1 |
| `/jaleco-medicina` | jaleco medicina | 1.900 | R$0,30 | 🔴 2 |
| `/jaleco-fisioterapia` | jaleco fisioterapia | 1.900 | — | 🟠 3 |
| `/jaleco-odontologia` | jaleco odontologia | 1.600 | — | 🟠 4 |
| `/scrub-enfermagem` | scrub enfermagem (+ enfermeira/feminino enfermagem) | 2.500 | R$0,12 | 🟠 5 |
| `/jaleco-nutricao` | jaleco nutrição | 1.300 | — | 🟡 6 |
| `/jaleco-farmacia` | jaleco farmácia | 1.300 | — | 🟡 7 |

**Volume novo total: ~13.400/mês**

### 3c. Sobre conjuntos
| Termo | Vol/mês |
|---|---|
| conjunto hospitalar | 480 |
| conjunto scrub | 320 |
| conjunto cirúrgico | 170 |

URL recomendada: `/conjunto-scrub` (já existe `/conjunto-cirurgico`, criar nova com 301 e otimizar pra cobrir "conjunto hospitalar" no H2/body)

---

## 4. Plano Google Ads

### 4a. Pausar HOJE
- Search "Jaleca - Search - Jalecos" R$70/dia
- Shopping aberto R$30/dia

### 4b. Estrutura nova (R$125/dia = R$3.750/mês)

#### TIER 1 — alto volume + landing pronta/criada
| Ad Group | Keywords | Vol/mês | Landing | Budget/dia |
|---|---|---|---|---|
| Scrub feminino | scrub feminino, scrub | 33.100 | `/scrub-feminino` | R$25 |
| Pijama cirúrgico feminino | pijama cirúrgico feminino | 12.100 | `/pijama-cirurgico-feminino` | R$15 |
| Jaleco enfermagem | jaleco enfermagem, enfermeiro, enfermeira | 7.500 | `/jaleco-enfermagem` | R$15 |
| Jaleco psicóloga ⭐ | jaleco psicóloga, psicologia | 2.900 | `/jaleco-psicologa` (criar) | R$8 |
| Scrub enfermagem | scrub enfermagem (todas variações) | 2.500 | `/scrub-enfermagem` (criar) | R$10 |
| Jaleco medicina ⭐ | jaleco medicina | 1.900 | `/jaleco-medicina` (criar) | R$5 |
| Jaleco fisioterapia ⭐ | jaleco fisioterapia, fisioterapeuta | 1.900 | landing | R$5 |
| Jaleco médico | jaleco médico (URL renomeada) | 1.600 | `/jaleco-medico` | R$5 |
| Jaleco odontologia ⭐ | jaleco odontologia | 1.600 | `/jaleco-odontologia` (criar) | R$5 |
| Jaleco nutrição ⭐ | jaleco nutrição, nutricionista | 1.300 | `/jaleco-nutricao` (criar) | R$3 |
| Jaleco farmácia ⭐ | jaleco farmácia | 1.300 | `/jaleco-farmacia` (criar) | R$3 |

**Subtotal TIER 1: R$99/dia**

#### TIER 2 — defesa + suporte
| Ad Group | Budget/dia |
|---|---|
| Jaleco veterinário (renomeado) | R$3 |
| Jaleco farmacêutico (renomeado) | R$3 |
| Branded `[jaleca]` `[jaleca ipatinga]` | R$5 |
| Click-to-WhatsApp (cluster dúvida tamanho) | R$5 |
| Shopping remarketing | R$10 |

**Subtotal TIER 2: R$26/dia**

**Total: R$125/dia = R$3.750/mês**

### 4c. Match types
- **Phrase match** prioritário ("jaleco psicóloga", "scrub feminino")
- **Exact match** para branded ([jaleca])
- **Negativos globais:** dracherie, mercadolivre, casa, fantasia, halloween

---

## 5. Cronograma

### Semana 1 (25/04 - 02/05)
- [ ] **Dia 1 (25/04)**: Pausar campanhas atuais (Search Jalecos + Shopping aberto)
- [ ] **Dia 1 (25/04)**: Atualizar `DATAFORSEO_LOGIN` e `DATAFORSEO_PASSWORD` no Vercel
- [ ] **Dia 1-2**: Renomear 9 URLs (ver 3a) + 301 redirects
- [ ] **Dia 1-2**: Atualizar internal links e sitemap
- [ ] **Dia 3-5**: Criar `/jaleco-psicologa` + `/jaleco-medicina` + `/scrub-enfermagem`
- [ ] **Dia 6-7**: Criar `/jaleco-fisioterapia` + `/jaleco-odontologia`

### Semana 2 (03/05 - 09/05)
- [ ] Criar `/jaleco-nutricao` + `/jaleco-farmacia` + `/conjunto-scrub`
- [ ] Lançar campanhas TIER 1 (todas 11 ad groups)
- [ ] Lançar Branded Protection
- [ ] Submeter sitemap atualizado no GSC

### Semana 3 (10/05 - 16/05)
- [ ] Lançar TIER 2 (defesa + WhatsApp + Shopping remarketing)
- [ ] Primeiro relatório de performance por ad group

### Semana 4 (17/05 - 23/05)
- [ ] Análise ROAS por cluster
- [ ] Pausar clusters com ROAS < 2x
- [ ] Escalar clusters com ROAS > 4x (+30% budget)

---

## 6. Métricas de sucesso

### Mês 1 (25/04 - 25/05) — Validação
| Métrica | Meta mínima | Meta boa |
|---|---|---|
| Cliques Paid | 4.000 | 8.000 |
| Conversões Paid | 30 | 80 |
| Receita Paid | R$8.400 | R$22.400 |
| ROAS | 2x | 6x |
| Custo por venda | < R$100 | < R$50 |

### Mês 2-3 — Escala (se ROAS Mês 1 > 3x)
- Budget: R$200/dia (R$6.000/mês)
- Receita esperada: R$25.000-50.000/mês
- ROAS alvo: 4-8x

### KPIs de SEO orgânico (60-90 dias)
- 10+ keywords no top 30 GSC
- 3+ landings novas indexadas e ranqueando
- Tráfego orgânico Profissões: +50%

---

## 7. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Renomear URLs derruba ranking | 301 redirect + 0 keywords ranqueando hoje = risco zero |
| CPC real maior que DataForSEO | Budget fracionado por cluster, pausa rápida quando ROAS < 2x |
| Landing nova com baixa conversão | Iterar copy/CTA semanal nos primeiros 30d |
| Concorrência reage e sobe lances | Match phrase + negativos protegem; long-tail é defensável |

---

## 8. Decisões e premissas

- ✅ **NÃO** investir em "jaleco feminino"/"jaleco masculino" head terms
- ✅ **NÃO** fazer Ads para domínios redirect (jalecomedico.com.br etc)
- ✅ **MANTER** os 9 domínios redirect como defensivo (R$400/ano)
- ✅ **PIVOT** para enfermagem + scrub + psicologia (volumes reais comprovam)
- ✅ Budget inicial R$125/dia (vs R$100/dia atual, +R$750/mês investimento)

---

## 9. Próxima ação imediata

**O que fazer AGORA (próxima 1h):**
1. Pausar campanhas Google Ads "Search Jalecos" + "Shopping aberto"
2. Atualizar `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` no Vercel
3. Confirmar plano com Rhammon
4. Começar renomeação das 9 URLs

**Documentos de apoio:**
- `ANALISE-CONCORRENTES-DATAFORSEO.md` — análise concorrentes 23/04
- `PRD-ESTRATEGIA-KEYWORDS-JALECO-2026.md` — estratégia keywords anterior
- `PRD-GOOGLE-ADS-MASTER-JALECA-2026.md` — estratégia Ads anterior (descartar partes que conflitam com este PRD)

---

*Última atualização: 25/04/2026*

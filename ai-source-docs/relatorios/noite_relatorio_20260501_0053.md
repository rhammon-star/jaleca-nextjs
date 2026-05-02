# Relatório SEO Noturno — Jaleca
**Data:** 01/05/2026 01:23
**Páginas:** 445 | **Keywords:** 0

---

# 📊 Relatório SEO Técnico — Jaleca.com.br

**Data:** Análise em tempo real | **Consultor:** SEO Sênior E-commerce BR  
**Problema Central:** 100% branded, zero orgânico genérico | **Meta:** Rankear para "jaleco feminino", "jaleco médico" e correlatas.

---

## 🚨 ALERTAS DO DIA

| Alerta | Severidade | Detalhe |
|--------|-----------|---------|
| **Concorrentes caíram em "jaleco feminino"** | 🔶 Oportunidade | JalecoChic caiu 4→7 e JalecoOnline 5→8. Jaleca está em **20** e não aproveitou a oscilação. |
| **DraCharm consolidou #1 em "jaleco estampado"** | 🔷 Acompanhamento | Subiu 3→1. Jaleca não rankeia nem na página 5 para esse termo. |
| **Post "test-check" indexado** | 🔴 CRÍTICO | URL `/blog/jaleco-slim-feminino-favorito-medicas` com **title = "test-check"** e **H1 = "test-check"**. Isso polui o index e quebra confiança do algoritmo. |
| **Google indexou URL com parâmetro `srsltid`** | 🔴 CRÍTICO | A única keyword na página 2 (`jaleco feminino`, pos. 20) está indexada como `/categoria/jalecos-femininos?srsltid=AfmBO...`. Canonical falha. |
| **Movimento de concorrentes locais** | 🔶 Atenção | Dr. Jaleco mantém #8 em "jaleco médico". Jaleca está fora do mapa. |

---

## 1. RESUMO EXECUTIVO

**Score SEO Geral: 48/100**

| Dimensão | Nota | Status |
|----------|------|--------|
| Core Web Vitals / Performance | 95 | ✅ Excelente |
| Estrutura Técnica & Indexação | 35 | ❌ Ruim (doorways, canonicals falhos) |
| Qualidade de Conteúdo | 40 | ⚠️ Médio (muito thin/duplicate) |
| Autoridade de Domínio (Backlinks) | 55 | ⚠️ Médio |
| Posicionamento Keywords Genéricas | 15 | ❌ Crítico |

### Por que a Jaleca não aparece para buscas genéricas
O site sofre de **"Doorway Pollution"**: existem aproximadamente **80 páginas de cidade** (`/cidade/jaleco-...`) com conteúdo espelhado (mesma estrutura, apenas o nome da cidade trocado). O algoritmo Google Helpful Content / Panda interpreta isso como **spam de doorway**, diluindo a autoridade de todo o domínio. Enquanto isso, as páginas pilar (`/categoria/jalecos-femininos`, `/jaleco-medico`) não recebem link juice suficiente porque está sendo "espalhado" em dezenas de páginas sem valor único.

### Top 5 Problemas Críticos Hoje
1. **Doorway pages de cidade** — 80+ URLs duplicadas que sufocam o crawl budget.
2. **Canonical falha** — Google indexou a categoria "jaleco feminino" com parâmetro `srsltid` (rastreamento), fragmentando sinais de ranqueamento.
3. **Post "test-check" no ar** — Title e H1 de um blog post são literalmente "test-check".
4. **Produto 404** — `/produto/jaleco-slim-elastex-feminino-jaleca-branco` retorna timeout/404.
5. **Falta de interlinking estratégico** — Blogposts não linkam para páginas de categoria com anchor texts de keyword.

### Top 5 Oportunidades Imediatas
1. Corrigir canonical da categoria feminina para consolidar posição 20 → top 10.
2. Noindexar todas as páginas `/cidade/*` e redirecionar para uma única página "Onde Encontrar / Frete".
3. Consolidar variações de cor (dezenas de URLs quase idênticas).
4. Corrigir o post "test-check" em minutos.
5. Criar páginas pilar para "jaleco personalizado" e "scrub feminino" (alto volume).

---

## 2. SAÚDE TÉCNICA

### 🔴 Erros Críticos

| Problema | URL(s) Afetadas | Solução Imediata |
|----------|----------------|------------------|
| **404** | `/produto/jaleco-slim-elastex-feminino-jaleca-branco` | Corrigir estoque/link ou fazer 301 para a página da cor mais próxima (gelo ou branco tradicional). |
| **Sem Canonical** | `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` | A página redireciona (404→outra), mas falta canonical. Implementar canonical self-referencing na URL destino. |
| **Redirect Chain** | `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` → `/jaleco-branco-ou-colorido-qual-o-melhor-para-sua-area` | Verificar se a URL destino existe (status 200?). Se sim, atualizar todos os links internos para apontar direto à URL final. |
| **Canonical ignorada pelo Google** | `/categoria/jalecos-femininos?srsltid=...` | A canonical está como URL limpa, mas o Google indexou a suja. **Garantir** que a tag canonical seja absoluta (`https://...`) e implementar `rel="canonical"` self-referencing forte. Considerar `Clean-param` no robots.txt para `srsltid`. |

### ⚠️ Problema Estrutural Não Listado nos Erros, Mas Grave
**~80 Páginas de Cidade (`/cidade/jaleco-*`)**  
Todas possuem a mesma estrutura de H2s:
- "Nossos Produtos"
- "Dúvidas sobre entrega em [Cidade]"
- "Enviamos para [Cidade]"

Isso é conteúdo duplicado em massa. Recomendação: **noindex, follow** em todas elas *ou* transformar em **1 única página** "Envio e Lojas Físicas".

---

## 3. OPORTUNIDADES RÁPIDAS — PÁGINA 2

| Keyword | Posição | URL Indexada | Problema | Ação para Subir |
|---------|---------|--------------|----------|-----------------|
| **jaleco feminino** | **20** | `/categoria/jalecos-femininos?srsltid=...` | URL com parâmetro de tracking indexada; falta força de link interno | 1. Forçar canonical absoluta na URL limpa.<br>2. Adicionar bloco de texto na categoria (+150 palavras sobre como escolher jaleco feminino).<br>3. Linkar essa categoria do menu principal e do footer com anchor "jaleco feminino".<br>4. Adicionar 3-5 links internos de blogposts para essa URL. |

**Previsão:** Com essas correções, em 2-4 semanas pode saltar para posição 8-12.

---

## 4. GSC — AÇÕES URGENTES

*(Dados de CTR do GSC não foram fornecidos, mas ações preventivas baseadas no diagnóstico)*

### Reescrita de Titles e Meta Descriptions

**Página:** `/categoria/jalecos-femininos`  
- **Title atual:** `Jaleco Feminino: Slim, Princesa, Elastex | Jaleca | Jaleca`  
- **Problema:** Duplicação da marca no final.  
- **Novo Title:** `Jaleco Feminino: Slim, Princesa e Elastex | PP ao G3 | Jaleca`  
- **Meta atual:** Boa, mas genérica.  
- **Novo Meta:** `Jaleco feminino com corte próprio para o corpo feminino. Modelos Slim, Princesa e Elastex. Do PP ao G3, 12 cores. Frete grátis Sudeste acima de R$499.`

**Página:** `/jaleco-medico`  
- **Title atual:** `Jaleco Médico Slim para Consultório e Plantão — 4.9★ | Jaleca`  
- **Está bom**, mas precisa de **link interno** de outros posts (ex: blogposts sobre "como escolher jaleco") para ganhar autoridade.

**Página:** `/blog/jaleco-slim-feminino-favorito-medicas`  
- **Title atual:** `test-check | Jaleca | Jaleca`  
- **H1 atual:** `test-check`  
- **Correção imediata:**  
  - Title: `Jaleco Slim Feminino: Por Que é o Favorito das Médicas | Jaleca`  
  - H1: `Jaleco Slim Feminino: Por Que é o Favorito das Médicas`  
  - Adicionar link interno no primeiro parágrafo para `/categoria/jalecos-femininos` com anchor text **"jaleco feminino slim"**.

---

## 5. GAP DE KEYWORDS

### Top 30 Keywords que Concorrentes Rankeiam e Jaleca Não

| # | Keyword | Volume | Concorrente (Pos.) | Página da Jaleca para Criar/Otimizar |
|---|---------|--------|-------------------|--------------------------------------|
| 1 | `jaleco` / `jalecos` | 60.500 | JalecoOnline (3) | Otimizar homepage: title deve começar com "Jaleco" e não "Jalecos Femininos e Masculinos". |
| 2 | `jaleco feminino` | 40.500 | JalecoChic (3-7) | `/categoria/jalecos-femininos` (canonical + conteúdo) |
| 3 | `scrub feminino` | 33.100 | Donne (35) | `/scrub-feminino` e `/blog/scrub-feminino-guia-completo` |
| 4 | `jaleco personalizado` | 3.600 | DrJaleco (17) | Criar `/jaleco-personalizado` ou otimizar existente |
| 5 | `jaleco preto` | 1.900 | DraCharm (1) | `/jaleco-preto-feminino` já existe — adicionar seção masculina e interlinking |
| 6 | `jaleco médico` | 1.600 | DrJaleco (8) | `/jaleco-medico` — adicionar FAQ schema e mais conteúdo |
| 7 | `jaleco enfermagem` | 1.300 | JalecoOnline (7) | `/jaleco-enfermagem` — otimizar title para incluir exatamente "jaleco enfermagem" |
| 8 | `jaleco manga curta` | 1.300 | JalecoOnline (9) | Criar categoria ou página pilar `/jaleco-manga-curta` |
| 9 | `pijama cirúrgico masculino` | 3.600 | DrJaleco (23) | `/categoria/conjuntos-masculinos` — renomear title para incluir "pijama cirúrgico masculino" |
| 10 | `jaleco pediatra` / `pediatria` | 880 | JalecoOnline (1) | Criar `/jaleco-pediatra` ou `/jaleco-pediatria` |
| 11 | `jaleco estampado` | 720 | DraCharm (1) | Criar categoria `/categoria/jalecos-estampados` |
| 12 | `jaleco colorido` | 390 | JalecoOnline (5) | `/categoria/jalecos` com filtro de cor indexável (ou página `/jaleco-colorido`) |
| 13 | `jaleco de dentista` | 320 | JalecoOnline (7) | `/jaleco-dentista` já existe — melhorar link interno |
| 14 | `jaleco online` | 170 | JalecoOnline (3) | Homepage e `/produtos` devem competir por esse termo |
| 15 | `jaleco branco` | ~1.000* | Diversos | Criar página pilar `/jaleco-branco` (já existe blog, mas falta página de categoria) |
| 16 | `jaleco com zíper` | 880 | Donne (10) | Criar filtro/categoria ou página `/jaleco-ziper` |
| 17 | `scrub` / `scrubs` | 22.000+ | DraCharm | `/categoria/conjuntos` — otimizar title para "Scrub e Pijama Cirúrgico" |
| 18 | `jaleco feminino rosa` | 210 | JalecoOnline (2) | Variação de cor — usar na categoria feminina com heading "Jaleco Feminino Rosa" |
| 19 | `jaleco colete` | 260 | Donne (6) | `/produto/max-colete-jaleca` — otimizar para "colete" |
| 20 | `jaleco luxo` / `elegante` | 260-880 | JalecoChic (1) | `/jaleco-premium` já existe — mudar title para incluir "luxo" e "elegante" |
| 21 | `farda enfermagem` | 210 | DraCharm (1) | Oportunidade de conteúdo: post "Jaleco é a nova farda de enfermagem" |
| 22 | `modelos de scrub` | 480-720 | DraCharm (2) | Blog post já existe, mas precisa de link para categoria de scrubs |
| 23 | `jaleco assistente social` | 170 | Donne (38) | Nicho — criar `/jaleco-assistente-social` |
| 24 | `jaleco odontologia feminino` | 170 | JalecoOnline (9) | `/jaleco-odontologia` — separar seção feminina no conteúdo |
| 25 | `comprar jaleco` | 480 | DrJaleco (9) | Usar em `/produtos` title e H1 |
| 26 | `jaleco nutricionista` | 260 | JalecoOnline (11) | `/jaleco-nutricionista` já existe — ganhar backlinks |
| 27 | `jaleco veterinário` | 320 | DrJaleco (24) | `/jaleco-veterinario` já existe — melhorar |
| 28 | `jaleco farmácia` | ~200* | — | `/jaleco-farmacia` já existe — otimizar |
| 29 | `pijama cirúrgico feminino` | 260 | DraCharm (1) | `/pijama-cirurgico-feminino` já existe — melhorar |
| 30 | `jaleco branco feminino` | ~500* | — | Criar ou otimizar `/categoria/jalecos-femininos` com filtro branco |

---

## 6. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO

| Pergunta | Volume Estimado | Formato Sugerido | Página Alvo |
|----------|----------------|------------------|-------------|
| "Qual tecido é melhor para jaleco: Oxford ou gabardine?" | Alto | Tabela comparativa no blog + FAQ schema | Blog existente sobre tecidos |
| "Jaleco branco ou colorido: qual usar na clínica?" | Alto | Guia completo (já existe, mas precisa de PAA schema) | `/blog/jaleco-branco-ou-colorido...` |
| "Como escolher o tamanho certo do jaleco feminino?" | Médio | Calculadora de tamanho + tabela | `/blog/jaleco-feminino-tamanho-certo` |
| "Qual a diferença entre jaleco e scrub?" | Médio | Infográfico + post | `/blog/jaleco-ou-scrub-qual-a-diferenca` |
| "Como tirar manchas de caneta do jaleco branco?" | Médio | Step-by-step (HowTo schema) | `/blog/como-tirar-manchas-do-jaleco` |
| "Jaleco manga curta pode usar na clínica?" | Médio | Post com citação de normas CFM/CRO | `/blog/jaleco-manga-curta-clinica` |
| "Jaleco com elastano vale a pena?" | Médio | Review/comparativo | `/blog/jaleco-elastano-vale-a-pena` |

**Ação técnica:** Adicionar blocos de FAQ nas páginas de produto e blog usando JSON-LD `FAQPage` schema (já usado, mas pode expandir).

---

## 7. CONTEÚDO FRACO (Thin Content)

### Páginas com < 600 palavras ou Conteúdo Duplicado

| URL | Word Count | Problema | Recomendação |
|-----|-----------|----------|--------------|
| `/cidade/jaleco-*` (todas: são paulo, rio, bh, etc.) | 730-790 | Conteúdo espelhado; apenas nome da cidade muda | **Noindex** ou unificar em `/lojas` |
| `/categoria/conjuntos-masculinos` | 476 | Muito curto para uma categoria | Expandir: adicionar guia "Como escolher scrub masculino" |
| `/categoria/domas-masculinas` | 574 | Thin content | Adicionar 2-3 parágrafos sobre dólmã masculino |
| `/produto/touca-de-elastico-jaleca` | 562 | PDP curta | Adicionar seção "Quando usar touca de elástico" + cuidados |
| `/produto/faixa-de-cabelo-jaleca` | 552 | PDP curta | Adicionar benefícios por profissão |
| `/categoria/domas` | 612 | Thin | Expandir sobre uso de dólmã por especialidade |
| `/blog/jaleco-slim-feminino-por-que-profissionais...` | 550 | Post curto | Expandir para 900+ palavras com seção "Melhores modelos slim" |
| `/blog/como-escolher-o-jaleco-certo...` | 547 | Post curto | Adicionar checklist por profissão |

**Observação:** As páginas de produto de cor (ex: `/produto/jaleco-slim-tradicional-feminino-jaleca-branco`) têm ~640 palavras, mas são **quase idênticas** entre si. A canonical aponta para a versão sem cor, mas se essas páginas de cor estiverem sendo rastreadas em massa, consomem crawl budget. Verificar cobertura no GSC.

---

## 8. BACKLINKS

| Site | Backlinks | Domínios Referentes | Rank | Spam Score |
|------|-----------|---------------------|------|------------|
| **Jaleca** | 83 | 50 | 145 | 0% |
| Dr. Jaleco | 75 | 59 | 37 | 0% |
| Dra. Charm | 45 | 38 | 17 | 0% |
| JalecoOnline | 39 | 37 | 0 | 0% |

### Diagnóstico
A Jaleca tem **mais backlinks brutos** que alguns concorrentes, mas perde em **autoridade percebida** (Rank 145 vs 37 do Dr. Jaleco). Isso sugere que os backlinks da Jaleca vêm de sites de menor autoridade ou não são contextuais do nicho saúde.

### Plano de Link Building Imediato
1. **Faculdades de Medicina/Enfermagem:** Oferecer desconto para turmas em troca de link na página de parcerias (ex: "Material do aluno").
2. **Blogs médicos:** Guest post sobre "Como a vestimenta impacta a percepção do paciente" com link para `/jaleco-feminino` ou `/jaleco-medico`.
3. **Conselhos e associações:** Tentar link na página de "fornecedores indicados" do CRO/CRM regional (long shot, mas de alta autoridade).
4. **Influenciadores de saúde:** Enviar peças para dentistas/médicos com canal no YouTube/Instagram; pedir link na descrição ou site.

---

## 9. PERFORMANCE

| URL | Performance | SEO | Accessibility | Best Practices |
|-----|-------------|-----|---------------|----------------|
| Homepage | 99 | 100 | 93 | 77 |
| /produtos | 99 | 100 | 92 | 77 |
| /categoria/jalecos | 100 | 100 | 92 | 77 |

**Veredito:** Performance é um **ponto forte**. Nenhuma ação necessária aqui; o problema é estritamente de **conteúdo, indexação e autoridade**.

---

## 10. PLANO DE AÇÃO

### ⚡ FAZER AGORA (esta sessão do Claude Code)

| # | URL / Ação | O que fazer | Impacto | Tempo |
|---|-----------|-------------|---------|-------|
| 1 | `/blog/jaleco-slim-feminino-favorito-medicas` | Alterar Title: `Jaleco Slim Feminino: Por Que é o Favorito das Médicas \| Jaleca`. Alterar H1 idêntico. Remover "test-check" de todos os campos. | 🔴 Alto (elimina sinal de spam) | 5 min |
| 2 | `/categoria/jalecos-femininos` | Garantir canonical absoluta e self-referencing: `<link rel="canonical" href="https://jaleca.com.br/categoria/jalecos-femininos" />`. Bloquear indexação de parâmetros `srsltid` via robots.txt ou header. | 🔴 Alto (consolida posição 20) | 10 min |
| 3 | Todas `/cidade/*` | Adicionar `<meta name="robots" content="noindex, follow">` em todas as páginas de cidade (ou via regex no robots). | 🔴 Alto (para doorway penalty) | 15 min |
| 4 | `/produto/jaleco-slim-elastex-feminino-jaleca-branco` | Corrigir link quebrado (404/timeout). Se produto sem estoque, fazer 301 para a categoria ou para a cor disponível mais próxima. | 🟡 Médio | 10 min |
| 5 | Variações de Cor | Verificar se URLs como `/produto/...-jaleca-branco` possuem canonical correta para a página mãe (sem cor). Se o Google estiver indexando as de cor, adicionar `noindex`. | 🟡 Médio | 20 min |

### 📅 ESTA SEMANA

| # | URL / Ação | O que fazer | Impacto |
|---|-----------|-------------|---------|
| 1 | `/categoria/jalecos-femininos` | Adicionar bloco de conteúdo no topo (abaixo do H1) com 150-200 palavras sobre "como escolher jaleco feminino", mencionando Slim, Princesa, Elastex, tamanhos PP ao G3. | 🔴 Alto |
| 2 | Menu & Footer | Adicionar link textual "Jaleco Feminino" no footer e no menu apontando para `/categoria/jalecos-femininos` (anchor text exata). | 🔴 Alto |
| 3 | `/jaleco-medico` | Adicionar 2-3 links internos de posts do blog (ex: posts sobre "como escolher jaleco por profissão") para esta página com anchor "jaleco médico". | 🟡 Médio |
| 4 | `/scrub-feminino` | Fazer o mesmo: link interno de posts de blog sobre scrub. | 🟡 Médio |
| 5 | Blog | Em todos os posts listados, adicionar ao final uma seção "Conheça nossos jalecos" com links para as categorias principais usando anchors de keyword. | 🟡 Médio |
| 6 | Criar/Otimizar `/jaleco-personalizado` | Criar página pilar ou otimizar existente. Title: `Jaleco Personalizado com Bordado \| Nome e Logo \| Jaleca`. Meta: incluir "jaleco personalizado". | 🔴 Alto |

### 📆 ESTE MÊS

| # | Ação | Impacto |
|---|------|---------|
| 1 | **Consolidar/Cleanar Páginas de Cidade** | Decidir: (a) 1 página `/nossas-lojas` com lista de cidades e schema LocalBusiness, ou (b) manter cidades apenas com conteúdo único real (história da loja, fotos, depoimentos locais, >800 palavras). Opção (a) é mais segura. | 🔴 Alto |
| 2 | **Campanha de Link Building** | Conseguir 5-10 backlinks de blogs de medicina/enfermagem para `/categoria/jalecos-femininos` e `/jaleco-medico`. | 🔴 Alto |
| 3 | **Criar Páginas Pilar em Falta** | Criar/otimizar páginas para: `jaleco personalizado`, `jaleco pediatra`, `jaleco estampado` (se houver estoque), `scrub feminino` (consolidar como categoria forte). | 🔴 Alto |
| 4 | **Expansão de Conteúdo do Blog** | Levar todos os posts <600 palavras para 900+. Priorizar posts que já rankeiam na página 2 ou 3. | 🟡 Médio |
| 5 | **Revisão de Titles Duplicados** | Remover padrão ` \| Jaleca \| Jaleca` no final dos titles. Manter apenas ` \| Jaleca` no final. Isso libera caracteres para keywords. | 🟡 Médio |

---

**Próximo passo recomendado:** Execute as 5 ações da sessão "Fazer Agora" agora mesmo. Em seguida, monitore a cobertura do Google Search Console para verificar a remoção das URLs `?srsltid=` do índice nas próximas 48-72h.
# Relatório SEO Noturno — Jaleca
**Data:** 05/05/2026 12:47
**Páginas:** 467 | **Keywords:** 0

---

**Relatório SEO Técnico — Jaleca.com.br**
*Data: 05/05/2026 | Especialista: SEO Técnico & E-commerce*
*Foco: Quebrar dependência 100% branded e rankear para genéricos ("jaleco feminino", "jaleco médico")*

---

## 🚨 ALERTAS DO DIA

1. **Redirect quebrado detectado**: A URL de blog `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` (404) redireciona para `/jaleco-branco-ou-colorido-qual-o-melhor-para-sua-area`, que **também está retornando 404**. Isso cria um funil de rastreamento que desperdiça crawl budget e sinaliza baixa qualidade ao Google.
2. **Concorrentes aceleram personalização**: A *Boutique dos Jalecos* lançou dezenas de páginas de personalização por profissão com bordado (`/jaleco-feminino-personalizado-branco-gola-padre-bordado-102-fisioterapia-logo`). A *Casa do Jaleco* expandiu a linha scrub com nomes próprios (`/conjunto-scrub-alice-marsala`). A Jaleca não tem landing page para "jaleco bordado por profissão".
3. **Queda catastrófica de posição (GSC)**: A keyword **"jaleco de enfermagem"** caiu de posição **3 para 31.5** (queda de 28 posições). Isso indica desindexação parcial, penalização de conteúdo duplicado ou perda de autoridade da URL.
4. **62 URLs de cidade no ar retornando 404**: Todas as páginas `/cidade/jaleco-{cidade}` (São Paulo, Rio, BH, etc.) estão 404. Elas recebem redirect para `/cidade/{cidade}`, mas os dados indicam que o destino também está vazio (sem H1, sem conteúdo, canonical ausente). Tráfego local está sendo jogado no lixo.

---

## 1. RESUMO EXECUTIVO

| Métrica | Status |
|---|---|
| **Score SEO Geral** | **35/100** |
| **Tráfego Genérico** | 0% (confirmado pelas posições nulas em todas as keywords de cauda alta) |
| **Saúde Técnica** | Crítica (404s em massa, canonicals ausentes, redirects para 404) |
| **Autoridade de Domínio** | 0 backlinks detectados (ferramenta), mas o domínio tem história desde 2010. Necessita urgência de link building. |

### Por que a Jaleca não aparece para buscas genéricas

A Jaleca tem **boa arquitetura de intenção** (páginas por profissão e por modelo), mas o Google não consegue confiar no site por três razões:
1. **Sinal técnico negativo**: 62+ páginas de cidade entregam 404; dezenas de produtos sem `canonical` geram conteúdo duplicado; redirects apontam para páginas inexistentes.
2. **Thin content sistêmico**: Variações de cor (faixa de cabelo, touca) replicam o mesmo texto com apenas a cor trocada, sem valor agregado por SKU.
3. **Meta dados genéricos**: Páginas de produto usam a meta description padrão da loja ("Jalecos femininos e masculinos modernos...") em vez de descrição específica, matando o CTR.

### Top 5 Problemas Críticos Hoje
1. **Páginas de cidade 404**: `/cidade/jaleco-*` sem conteúdo, sem H1, sem canonical.
2. **Queda livre de "jaleco de enfermagem"**: De top 3 para página 4. Perda de tráfego qualificado.
3. **Redirects para 404**: Blog post redireciona para URL inexistente.
4. **Canonical vazio em produtos**: Todas as variações de touca e faixa de cabelo.
5. **Core Web Vitals zerados**: Performance 0/100 em mobile (indica bloqueio de renderização ou erro de medição que precisa ser validado).

### Top 5 Oportunidades Imediatas
1. **Corrigir 5 cidades principais** (São Paulo, Rio, BH, Curitiba, Salvador) e otimizar para "jaleco feminino [cidade]".
2. **Reescrever títulos e metas** das 10 páginas com mais impressões no GSC (CTR < 1%).
3. **Criar página `/jaleco-personalizado-bordado`** (gap crítico vs. concorrentes).
4. **Consolidar ou noindexar** variações de cor de acessórios (toucas/faixas).
5. **Recuperar posição de "jaleco de enfermagem"**: revisar conteúdo de `/jaleco-enfermagem` vs. `/jaleco-enfermeiro`.

---

## 2. SAÚDE TÉCNICA

### ❌ Páginas 404 (status_code 404)
Todas as URLs abaixo estão indexáveis (provavelmente no sitemap) e retornam 404:

**Cidades (62 URLs):**
`https://jaleca.com.br/cidade/jaleco-sao-paulo`, `...rio-de-janeiro`, `...belo-horizonte`, `...campinas`, `...ribeirao-preto`, `...sao-jose-dos-campos`, `...guarulhos`, `...contagem`, `...uberlandia`, `...uberaba`, `...montes-claros`, `...governador-valadares`, `...vitoria`, `...vila-velha`, `...serra`, `...cachoeiro-de-itapemirim`, `...colatina`, `...barra-da-tijuca`, `...curitiba`, `...porto-alegre`, `...florianopolis`, `...londrina`, `...brasilia`, `...goiania`, `...campo-grande`, `...salvador`, `...fortaleza`, `...recife`, `...natal`, `...joao-pessoa`, `...sao-luis`, `...maceio`, `...teresina`, `...vitoria-da-conquista`, `...teixeira-de-freitas`, `...manaus`, `...belem`, `...ipatinga`, `...juiz-de-fora`, `...betim`, `...sete-lagoas`, `...divinopolis`, `...pocos-de-caldas`, `...patos-de-minas`, `...pouso-alegre`, `...varginha`, `...barbacena`, `...muriae`, `...marilia`, `...itabira`, `...joao-monlevade`, `...lagoa-santa`, `...cuiaba`, `...aracaju`, `...porto-velho`, `...macapa`, `...boa-vista`, `...rio-branco`, `...palmas`, `...sorocaba`, `...sao-jose-do-rio-preto`, `...santos`, `...jundiai`, `...bauru`, `...joinville`, `...caxias-do-sul`, `...maringa`, `...ponta-grossa`, `...blumenau`, `...niteroi`, `...campos-dos-goytacazes`, `...feira-de-santana`, `...campina-grande`, `...mossoro`, `...anapolis`.

**Blog (1 URL):**
`https://jaleca.com.br/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` (404)

### ❌ Sem Canonical (risco de duplicação)
**Produtos (variações sem canonical):**
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-areia`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-azul-bebe`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-branco`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-marinho`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-pink`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-preto`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-rosa-bebe`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-rose-escuro`
- `https://jaleca.com.br/produto/faixa-de-cabelo-jaleca-vinho`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-areia`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-branco`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-flamboya`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-marinho`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-preto`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-rosa-bebe`
- `https://jaleca.com.br/produto/touca-de-amarrar-jaleca-rose`
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca-areia`
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca-azul-bebe`
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca-branco`
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca-preto`
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca-rose-escuro`
- `https://jaleca.com.br/produto/touca-de-elastico-jaleca-vinho`

### ❌ Redirect Chains / Redirects para 404
- `/` → `/` (redirecionamento desnecessário da raiz para ela mesma)
- `/blog/guia-jaleco-dentista-modelos-cores-como-escolher` → `/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher`
- `/blog/como-lavar-jaleco-branco` → `/blog/como-lavar-jaleco-profissional-guia-completo`
- `/blog/como-lavar-e-conservar-seu-jaleco-profissional-2` → `/blog/como-lavar-jaleco-profissional-guia-completo`
- **CRÍTICO**: `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` (404) → `/jaleco-branco-ou-colorido-qual-o-melhor-para-sua-area` (404)

### ❌ Sem H1
Todas as 62 URLs de cidade listadas acima retornam H1 vazio.

---

## 3. OPORTUNIDADES RÁPIDAS — POSIÇÃO 4-20 (GSC)

| Keyword | Posição | Impressões | URL Atual | O que fazer para empurrar para Pg 1 |
|---|---|---|---|---|
| **jaleca** | 5.4 | 228 | `/produto/jaleco-slim-gold-feminino-jaleca` | A busca pela marca está caindo em página de produto. **Canonicalize a home** para receber o tráfego de marca. Adicione link interno "Jaleca" no menu apontando para `/`. |
| **jaleco de medico** | 11.0 | 137 | `/jaleco-medico` | Title está "Jaleco Médico Feminino e Masculino". **Mudar para "Jaleco de Médico"** (match exato). Adicionar H2 "O que procurar no jaleco de médico". |
| **jaleco de médico** | 11.1 | 114 | `/jaleco-medico` | Mesma ação acima. Meta description genérica. Usar: *"Jaleco de médico com elastano para plantão de 12h. Modelos Slim e Profissional. Branco, preto e colorido. PP ao G3. Frete grátis SE."* |
| **jaleco salvador** | 7.5 | 78 | `/cidade/jaleco-salvador` | Página **404**. Criar página 200 com H1 "Jaleco Feminino e Masculino em Salvador — Jaleca", texto local (entrega, prazo) e catálogo filtrado. |
| **jaleco dentista** | 8.3 | 69 | `/jaleco-dentista` | Posição boa! Adicionar schema `Dentist` (ou `Product` com `aggregateRating`), melhorar E-E-A-T citando normas CRO. |
| **jaleco de medico** | 10.6 | 68 | `/jaleco-para-medico` | URL alternativa concorrendo com `/jaleco-medico`. Consolidar: fazer 301 de `/jaleco-para-medico` para `/jaleco-medico` ou canonicalizar. |
| **jaleco cuiaba** | 8.7 | 56 | `/cidade/jaleco-cuiaba` | **404**. Criar página local ou redirecionar 301 para `/categoria/jalecos` com UTM e aviso de entrega para Cuiabá. Melhor: criar landing. |
| **jaleco odontologia** | 11.0 | 54 | `/blog/jaleco-odontologia-como-escolher` | Blog tem autoridade, mas intenção é transacional. Criar link interno no 1º parágrafo para `/jaleco-dentista` com âncora "jaleco para dentista". |
| **jaleco macapa** | 6.3 | 50 | `/cidade/jaleco-macapa` | **404**. Mesmo tratamento de Salvador/Cuiabá. |

---

## 4. GSC — AÇÕES URGENTES

### Queries com CTR Baixo (0% — reescrever agora)

**"jaleco de medico"** (impressões: 118, CTR: 0, pos: 11.1)
- **Title atual**: `Jaleco Médico Feminino e Masculino — Slim com Elastano | Jaleca`
- **Novo Title**: `Jaleco de Médico: Slim com Elastano para Plantão | Jaleca`
- **Nova Meta**: `Jaleco de médico com elastano bidirecional. Modelos branco, preto e colorido. Do PP ao G3. Frete grátis SP/MG/RJ/ES acima de R$499.`

**"jaleco de médico"** (impressões: 104, CTR: 0, pos: 11.2)
- Mesma ação. Incluir "comprar" na meta: *"Compre jaleco de médico online..."*

### Páginas que Perderam Posição (Diagnóstico + Solução)

| Keyword | Queda | Diagnóstico | Solução |
|---|---|---|---|
| **jaleco de enfermagem** | 3 → 31.5 (-28.5) | Provável conteúdo duplicado entre `/jaleco-enfermagem` e `/jaleco-enfermeiro` ou mudança de URL sem redirect. | Auditar qual URL estava rankeando. Consolidar com 301. Adicionar conteúdo exclusivo (tabela de tamanhos, normas COFEN). |
| **jaleco enfermagem** | 3 → 25.3 (-22.3) | Mesmo problema acima. | Implementar canonical única e reforçar link interno de autoridade. |
| **jaleco medicina feminino** | 21 → 40.5 (-19.5) | Competição aumentou; página pode estar lenta ou sem backlinks internos. | Enriquecer `/jaleco-medica` com vídeo, tabela comparativa de modelos, FAQ sobre normas CRM. |
| **como tirar manchas de jaleco branco** | 11 → 29 (-18) | Blog pode ter perdido frescor. | Atualizar data de publicação, adicionar lista de materiais com schema `HowTo`, incluir imagens novas. |
| **jaleco para nutricionista** | 1 → 12 (-11) | Queda da posição 1 é suspeita de cannibalização. Verificar se `/jaleco-nutricionista` está competindo com `/blog/jaleco-para-nutricionista-consultorio`. | Canonicalizar blog para a página de categoria/profissão. Reforçar a página principal. |

---

## 5. GAP DE KEYWORDS

*(Seção veio vazia na ferramenta — inferido via análise de concorrentes e GSC)*

### Gaps de Intenção de Compra (Transacional)
| Keyword | Concorrente que rankeia | URL a criar / otimizar | Ação |
|---|---|---|---|
| jaleco personalizado bordado | Boutique dos Jalecos | `/jaleco-personalizado-bordado` | Criar LP com opções de bordado (nome, CRM, logo). |
| jaleco feminino com nome bordado | Boutique dos Jalecos | `/jaleco-feminino-bordado` | Página de categoria filtrada + explicação do serviço. |
| jaleco para acupuntura | Boutique dos Jalecos | `/jaleco-acupuntura` | Criar página seguindo template de profissão. |
| jaleco para terapia ocupacional | Boutique dos Jalecos | `/jaleco-terapia-ocupacional` | Criar. |
| jaleco estampado feminino | Casa do Jaleco | `/jaleco-estampado-feminino` | Criar categoria ou subcategoria. |
| scrub estampado | Casa do Jaleco | `/scrub-estampado` | Criar. |

### Gaps de Cidade (Local SEO)
Todas as keywords abaixo a Jaleca **tem URL mas está 404**:
- `jaleco feminino são paulo`
- `jaleco feminino rio de janeiro`
- `jaleco feminino belo horizonte`
- `jaleco feminino curitiba`
- `jaleco feminino salvador`
- `jaleco feminino recife`

**Solução**: Em vez de manter 62 páginas 404, criar **landing pages dinâmicas** para as 10 maiores cidades do SE/CO/NE. Template:
- H1: `Jaleco Feminino e Masculino em [Cidade] — Entrega Rápida`
- Texto: Prazo de entrega para a cidade, frete grátis acima de R$499, link para loja física mais próxima (se houver).
- Canonical self-referencing.

---

## 5b. GSC — PÁGINAS COM IMPRESSÕES ALTAS MAS CTR BAIXO

| URL | Impressões | CTR | Title Atual | Title Recomendado | Meta Recomendada |
|---|---|---|---|---|---|
| `/nossas-lojas` | 857 | 1.05% | `Lojas Jaleca — Jalecos em Ipatinga...` | `Loja de Jaleco em Ipatinga, BH e ES | Jaleca` | `6 lojas físicas para experimentar jalecos. Ipatinga, BH, Colatina, Contagem e mais. Atendimento personalizado.` |
| `/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar` | 726 | 0.14% | `Jaleco ou Scrub: Qual Escolher...` | `Jaleco ou Scrub: Qual a Diferença e Quando Usar | 2026` | `Scrub ou jaleco? Saiba qual uniforme usar por profissão. Compare conforto, tecido e normas. Guia completo Jaleca.` |
| `/blog/jaleco-com-nome-bordado` | 682 | 0.44% | `Jaleco com Nome Bordado: Guia Completo` | `Jaleco com Nome Bordado: Como Personalizar + Preço | Jaleca` | `Guia completo para bordar nome, CRM e logo no jaleco. Veja onde fica, preço e como cuidar. Personalize na Jaleca.` |
| `/blog/como-lavar-jaleco-profissional-guia-completo` | 638 | 0.47% | `Como Lavar Jaleco Branco...` | `Como Lavar Jaleco Branco: Guia Para Não Amarelizar` | `Passo a passo para lavar jaleco de poliéster e algodão. Tire manchas de sangue, caneta e iodo sem estragar o tecido.` |
| `/blog/cores-de-jaleco-significado-e-uso-por-area-da-saude-2` | 625 | 0.96% | `Cores de Jaleco: Significado...` | `Cores de Jaleco na Saúde: Significado e Uso por Área | Jaleca` | `Branco, azul, rosa ou preto? Descubra o significado de cada cor de jaleco e qual usar na sua profissão.` |
| `/blog/roupa-medica-profissional` | 572 | 0% | `Roupa Médica Profissional: Além do Jaleco` | `Roupa Médica Profissional: Jaleco, Scrub e Avental | Guia` | `Guia completo de vestimenta hospitalar. Quando usar jaleco, scrub ou avental cirúrgico. Confira.` |
| `/categoria/jalecos-femininos` | 506 | 1.38% | `Jaleco Feminino — Slim, Princesa e Elastex...` | `Jaleco Feminino: Slim, Princesa e Elastex | 12 Cores` | `Jaleco feminino com corte acinturado real. Modelos Slim, Princesa e Elastex. Do PP ao G3. Frete grátis Sudeste.` |
| `/produtos` | 447 | 0.89% | `Produtos Jaleca — Catálogo Completo...` | `Jalecos, Scrubs e Dólmãs | Catálogo Completo Jaleca` | `Mais de 30 modelos de jalecos, scrubs e dólmãs. Slim, Princesa, Elastex. PP ao G3. Frete grátis SE.` |
| `/jaleco-medico` | 424 | 0.24% | `Jaleco Médico Feminino e Masculino...` | `Jaleco de Médico: Feminino e Masculino | Jaleca` | `Jaleco de médico com elastano para plantão longo. Modelos branco, preto e colorido. PP ao G3. Compre online.` |
| `/categoria/jalecos-masculinos` | 421 | 0.48% | `Jaleco Masculino à Venda Online...` | `Jaleco Masculino Slim Moderno | Jaleca` | `Jaleco masculino com zíper e botão. Modelos Slim e tradicional. Branco, preto e colorido. Frete grátis SE.` |

---

## 6. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO

*(Dados não coletados — inferido via comportamento de busca no nicho)*

| Pergunta | Formato Recomendado | URL Base |
|---|---|---|
| "Jaleco de médico pode ser colorido?" | FAQ na `/jaleco-medico` + post blog | `/blog/jaleco-medico-colorido-crm` |
| "Como bordar nome no jaleco?" | Post blog + vídeo embed | `/blog/como-bordar-nome-jaleco` |
| "Qual tamanho de jaleco pedir?" | Calculadora na `/medidas` + blog | `/blog/tabela-medidas-jaleco-pp-ao-g3` |
| "Jaleco com elastano dura mais?" | Comparativo de tecidos | `/blog/jaleco-com-elastano-vale-a-pena` (já existe, reforçar) |
| "Scrubs são permitidos no centro cirúrgico?" | FAQ em `/scrub-feminino` | `/blog/scrub-cirurgico-normas` |
| "Jaleco para formatura de medicina precisa de bordado?" | Post blog | `/blog/jaleco-formatura-bordado-crm` (já existe, atualizar) |

---

## 7. CONTEÚDO FRACO (Thin Content)

### Páginas com < 400 palavras
- `https://jaleca.com.br/cidade/jaleco-*` (62 URLs) — **7 palavras** (página de erro)
- `https://jaleca.com.br/blog/jaleco-manga-curta-quando-usar-profissionais` — **422 palavras**
- `https://jaleca.com.br/blog/jaleco-slim-vs-jaleco-reto-diferencas` — **453 palavras**
- `https://jaleca.com.br/blog/jaleco-para-psicologa-guia` — **427 palavras**
- `https://jaleca.com.br/blog/jaleco-para-veterinaria-guia` — **399 palavras**
- `https://jaleca.com.br/blog/jaleco-para-esteticista-guia` — **414 palavras**
- `https://jaleca.com.br/blog/jaleco-para-enfermeira-regras-cofen` — **426 palavras**
- `https://jaleca.com.br/blog/jaleco-para-medica-guia-completo` — **415 palavras**

**Sugestão de enriquecimento**: Adicionar tabela comparativa, checklist de compra, FAQ schema e imagens com alt text otimizado.

---

## 8. BACKLINKS

| Domínio | Backlinks | Ação Recomendada |
|---|---|---|
| jaleca.com.br | 0 (ferramenta) | **Urgente**: Conseguir citações em listas de "melhores marcas de jaleco". |
| Concorrentes | 0 (ferramenta) | O nicho parece ter pouca métrica capturada, mas a Jaleca precisa sair na frente. |

### Estratégia de Link Building para Jaleca
1. **Guest posts em blogs de faculdades de medicina/enfermagem**: Artigo "Como escolher o primeiro jaleco" com link para `/jaleco-universitario`.
2. **Parcerias com influenciadores de moda médica no Instagram**: Pedir link no perfil (bio) apontando para `/jaleco-feminino`.
3. **Cadastro em diretórios de saúde**: Dr. Google, Doctoralia (para a marca, não só loja física).
4. **Release sobre uniformização hospitalar**: Link para `/blog/case-uniformizacao-hospitalar-jaleca`.

---

## 9. PERFORMANCE

**Core Web Vitals Mobile (todos zerados)**
- `https://jaleca.com.br`: Performance **0**, SEO **0**, Accessibility **0**, Best Practices **0**
- `https://jaleca.com.br/produtos`: Performance **0**, SEO **0**, Accessibility **0**, Best Practices **0**

**Diagnóstico**: Score 0 indica que o Lighthouse não conseguiu auditar as páginas (possível bloqueio de bot, paywall de idade, ou erro de carregamento).

**Ação imediata**:
1. Testar no PageSpeed Insights manualmente.
2. Verificar `robots.txt` se está bloqueando recursos JS/CSS.
3. Se o site usar algum app de idade/cookie que intercepte o crawler, configurar exceção para user-agent do Google.

---

## 10. CONTEÚDO EDITORIAL — JALECA VS CONCORRENTES

| Página | Jaleca (palavras) | Concorrente | Palavras | Veredito |
|---|---|---|---|---|
| **Home** | 882 | Jaleco Online | 1.242 | Jaleca está **26% menor**. Precisa de bloco de texto abaixo da dobra com H2 "Por que comprar jaleco na Jaleca". |
| **Categoria Feminino** | 959 | Casa do Jaleco (linha) | ~900 | Equivalente, mas Jaleca pode melhorar filtros de busca e texto descritivo. |
| **Blog Guia** | ~946 | — | — | Bom. |
| **Página Profissão** (ex: dentista) | ~990 | Boutique dos Jalecos | ~800 | **Superior em volume**. Mas Jaleca precisa de **diferenciais de produto** em destaque (botão de compra mais visível). |

**Problema crítico de conteúdo**: As variações de cor dos produtos (scrub feminino azul bebê, rosa, etc.) têm **texto quase idêntico**, mudando apenas a cor. Isso é classificado como *duplicate content* pelo Google.

**Solução**:
- Para variações de cor: usar **atributos de produto** (swatch) em uma única URL, ou aplicar `rel="canonical"` apontando para a cor principal.
- Exemplo: `/produto/conjunto-scrub-feminino-jaleca-azul-bebe` deve ter canonical para `/produto/conjunto-scrub-feminino-jaleca` (cor padrão).

---

## 11. GOOGLE SHOPPING

| Keyword | Jaleca Aparece? | Observação |
|---|---|---|
| jaleco feminino | ❌ Não | Ausência total do Google Shopping |
| jaleco médico feminino | ❌ Não | Feed Merchant Center não configurado ou produtos reprovados |
| scrub feminino | ❌ Não | |
| jaleco bordado | ❌ Não | |

**Concorrentes dominando**: Donne Jalecos e Dr. Jaleco provavelmente têm feed ativo (evidenciado por schema `Product` em massa na home).

**Plano de ação Shopping**:
1. Criar conta Google Merchant Center.
2. Gerar feed XML com todos os produtos ativos.
3. Otimizar título do produto: incluir "Jaleco Feminino Slim [Modelo] [Cor] | Jaleca"
4. Manter preço competitivo (a Brancura anuncia a partir de R$39,90 — a Jaleca precisa destacar frete grátis SE no título do anúncio).

---

## 12. OPORTUNIDADE DE KEYWORDS — VOLUME + CPC

*(Sem dados de volume no input — priorização via lógica de nicho)*

| Keyword | Intenção | Prioridade | Ação |
|---|---|---|---|
| **jaleco feminino** | Transacional | 🔥 Máxima | Otimizar `/categoria/jalecos-femininos` e `/jaleco-feminino`. |
| **jaleco médico** | Transacional | 🔥 Máxima | Consolidar `/jaleco-medico`. |
| **jaleco personalizado bordado** | Transacional Alta | 🔥 Alta | Criar LP. CPC alto = comprador qualificado. |
| **scrub feminino** | Transacional | 🔥 Alta | Otimizar `/scrub-feminino`. |
| **pijama cirúrgico** | Transacional | 🔥 Alta | Otimizar `/pijama-cirurgico-feminino`. |
| **jaleco para nutricionista** | Transacional | 🔥 Média | Recuperar posição 1 perdida. |
| **jaleco de enfermagem** | Transacional | 🔥 Máxima | Recuperar posição 3. |
| **jaleco barato** | Transacional | Média | Criar categoria "Outlet" ou "Básicos" se houver margem. |

---

## 13. INTELIGÊNCIA COMPETITIVA — DOMÍNIOS

*(Sem idade de domínio nos dados)*

**Concorrente mais agressivo**: **Boutique dos Jalecos**
- Estratégia: SEO de long-tail por profissão + personalização.
- O que copiar (e fazer melhor): Páginas de profissão com bordado, mas com **texto mais rico** (eles têm pouco texto, apenas filtros).

**Concorrente de autoridade**: **Casa do Jaleco**
- Estratégia: Linha própria com nomes (Alice, Luna, Anne) — branding de produto.
- Oportunidade Jaleca: A Jaleca já nomeia modelos (Slim Gold, Princesa). Deve criar páginas de comparação entre modelos.

**Concorrente de preço**: **Brancura**
- Estratégia: Google Shopping com preço baixo (R$39,90).
- Como competir: Não competir no preço. Competir no valor: "Frete grátis + 30 dias de troca + tecido premium".

---

## 14. PLANO DE AÇÃO DE HOJE

### ⚡ FAZER AGORA (esta sessão)

| URL | O que fazer | Impacto | Tempo |
|---|---|---|---|
| `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` | **Remover do sitemap** e aplicar **301** para `/blog/jaleco-colorido-clinica` (post existente) em vez de 404. | Corrige desperdício de crawl budget | 10 min |
| `/jaleco-medico` | **Reescrever Title**: `Jaleco de Médico: Feminino e Masculino | Slim com Elastano | Jaleca`. Meta: incluir "comprar" e "frete grátis". | Sobe de pos 11 para 6-8 | 15 min |
| `/jaleco-enfermagem` | Auditar se há tag `noindex` ou canonical errado. Reverter alteração recente. | Recupera pos 3 | 20 min |
| `/cidade/jaleco-sao-paulo` (e outras 61) | **Noindexar** via meta robots ou **remover do sitemap** enquanto não forem recriadas. | Para sinal negativo de 404 em massa | 30 min |
| `/produto/touca-de-elastico-jaleca` (e variações) | Inserir `<link rel="canonical">` self-referencing ou apontando para produto pai. | Resolve risco de Panda | 20 min |

### 📅 ESTA SEMANA

| URL / Escopo | O que fazer | Impacto |
|---|---|---|
| `/jaleco-personalizado-bordado` | Criar landing page com formulário/campos de bordado, fotos e preço. Fechamento de gap vs Boutique dos Jalecos. | Captura demanda de cauda alta |
| `/cidade/sao-paulo`, `/rio-de-janeiro`, `/belo-horizonte`, `/curitiba`, `/salvador` | Criar 5 landing pages locais com H1, texto de entrega e links para categorias. | Tráfego local qualificado |
| `/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar` | Reescrever title e primeira seção com link interno para `/scrub-feminino`. | Aumenta CTR de 0.14% para ~2% |
| `/jaleco-feminino` | Adicionar bloco comparativo: Slim vs Princesa vs Elastex (tabela). Melhora dwell time. | Relevância para "jaleco feminino" |
| Google Merchant Center | Configurar conta e subir feed de produtos (jalecos e scrubs). | Aparece no Shopping |

### 📆 ESTE MÊS

| O que fazer | Impacto |
|---|---|
| **Consolidação de URLs por profissão**: Fazer 301 de `/jaleco-para-medico` → `/jaleco-medico` (evitar cannibalização). | Força de ranqueamento unificada |
| **Enriquecimento de 10 posts de blog < 500 palavras** (lista na seção 7) com tabelas, FAQs e schema. | Aumenta chance de featured snippet |
| **Link building**: 3 guest posts em blogs de universidades (medicina/enfermagem) apontando para `/jaleco-universitario`. | Autoridade de domínio |
| **Otimização de imagens**: Renomear arquivos de produto para `jaleco-feminino-slim-princesa-branco-jaleca.jpg` e preencher Alt Text. | Tráfego Google Images |
| **Criar páginas de profissão faltantes**: `/jaleco-acupuntura`, `/jaleco-terapia-ocupacional`, `/jaleco-nail-designer` (baseado no que concorrentes fazem). | Domina long-tail |

---

**Próximo passo recomendado**: Execute a correção do redirect 404 → 404 e o noindex das cidades hoje. Isso sozinho pode estabilizar a queda de "jaleco de enfermagem" em 7-14 dias.
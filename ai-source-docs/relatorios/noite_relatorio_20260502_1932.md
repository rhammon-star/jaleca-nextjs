# Relatório SEO Noturno — Jaleca
**Data:** 02/05/2026 19:53
**Páginas:** 460 | **Keywords:** 0

---

Aqui está o diagnóstico completo e o plano de guerra para a Jaleca:

---

## 🚨 ALERTAS DO DIA

**1. Queda livre em keywords de cauda alta**
- `jaleco slim feminino`: caiu **14 posições** (2º → 16º)
- `como lavar um jaleco branco`: caiu **10 posições** (1º → 11º)
- `jaleco slim`: caiu **3.8 posições** (2.5 → 6.3)
- `jalecos femininos`: caiu **3.8 posições** (30.6 → 34.4)

**2. Páginas de produto quebradas indexáveis**
- 27 URLs de produtos (toucas, faixas, amarradores) retornam **status 200** com título **"Produto não encontrado"**, sem tag canonical e com H1 genérico. São páginas fantasmas que sugam crawl budget e transmitem sinal de baixa qualidade.

**3. Performance mobile zerada**
- Todas as URLs testadas (home, produtos, categorias) apresentam score **0 em Performance, SEO, Accessibility e Best Practices** no mobile. Isso indica bloqueio de renderização, erro no Lighthouse ou carregamento extremamente lento.

---

## 1. RESUMO EXECUTIVO

**Score SEO geral: 38/100**

**Por que a Jaleca não aparece para buscas genéricas:**
O site tem uma arquitetura excessivamente pulverizada em "landing pages de intenção genérica" (ex: `/jaleco-medico`, `/jaleco-dentista`) que competem entre si e com as páginas de categoria, além de não ter autoridade de domínio (0 backlinks detectados). Além disso, há um grave problema de **conteúdo duplicado/doorway** nas 65+ páginas de cidade (`/cidade/jaleco-sao-paulo` etc.), todas com a mesma estrutura de texto, trocando apenas o nome da cidade.

**Top 5 problemas críticos hoje:**
1. **Produtos fantasmas**: 27 páginas 200 com "Produto não encontrado" e sem canonical.
2. **Doorway pages cities**: Páginas de cidade são templates sem variação real de conteúdo (risco de penalização).
3. **Canonicals quebrados**: 25+ páginas sem canonical (praticamente todas de produtos de acessórios).
4. **Core Web Vitals zerados**: Indica experiência de página inaceitável em mobile.
5. **CTR zero em keywords de transação**: `jaleco de medico/de médico` têm 220+ impressões e 0 cliques por títulos genéricos.

**Top 5 oportunidades imediatas:**
1. Corrigir canonicals e devolver 404/410 nos produtos descontinuados.
2. Reescrever titles de páginas com posição 8–11 para furar para a primeira página.
3. Unificar ou enriquecer drasticamente as city pages com conteúdo local real.
4. Criar feed otimizado para Google Shopping (hoje a marca não aparece).
5. Explorar o gap de "scrub feminino" e "pijama cirúrgico feminino" com conteúdo comparativo e transacional.

---

## 2. SAÚDE TÉCNICA

| Problema | Quantidade | URLs de exemplo |
|---|---|---|
| **Páginas sem canonical** | 25 | `/produto/touca-de-elastico-jaleca`, `/produto/faixa-de-cabelo-jaleca-areia`, `/produto/touca-de-amarrar-jaleca` |
| **Redirect chains** | 5 | `/blog/como-lavar-jaleco-branco` → `/blog/como-lavar-jaleco-profissional-guia-completo`<br>`/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` → `/jaleco-branco-ou-colorido-qual-o-melhor-para-sua-area`<br>`/blog/guia-jaleco-dentista-modelos-cores-como-escolher` → `/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher` |
| **Produto inexistente com status 200** | 27 | `/produto/touca-de-elastico-jaleca`, `/produto/touca-de-amarrar-jaleca`, `/produto/faixa-de-cabelo-jaleca` e todas variações de cor |
| **Páginas 404 não gerenciadas** | 1 | `/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` (virou 404 após redirect) |
| **Sem title / H1 / Meta description** | 0 detectado | — |

**Ação imediata técnica:**
- Devolver **HTTP 410** em todas as páginas de produtos descontinuados (toucas/faixas) ou redirecionar 301 para a categoria `/categoria/acessorios`.
- Inserir `rel="canonical"` self-referencial em **100%** das páginas de produtos ativos.
- Corrigir o redirect da city page que aponta para o blog 404.

---

## 3. OPORTUNIDADES RÁPIDAS — POSIÇÃO 4-20

| Keyword | Posição | Impressões | URL Atual | Ação para empurrar para Pág. 1 |
|---|---|---|---|---|
| `jaleco de medico` | 11.0 | 131 | `/jaleco-medico` | **Título fraco.** Mudar de *"Jaleco Médico Slim..."* para *"Jaleco Médico Feminino e Masculino — Slim com Elastano \| Jaleca"*. Adicionar vídeo do produto na página. |
| `jaleco de médico` | 11.0 | 97 | `/jaleco-medico` | Mesma ação acima. Criar linkagem interna do blog *"jaleco para médica"* para esta URL com âncora exata. |
| `jaleco dentista` | 8.2 | 68 | `/jaleco-dentista` | Já está quase lá. Incluir bloco de avaliações schema `AggregateRating` (tem 61 avaliações, mas não está no schema da página). Aumentar conteúdo em 200 palavras sobre NR-32. |
| `jaleco salvador` | 7.5 | 68 | `/cidade/jaleco-salvador` | Adicionar H2 com depoimento de cliente real de Salvador e parágrafo sobre entrega/frete específico para a cidade. |
| `jaleco recife` | 9.2 | 69 | `/cidade/jaleco-recife` | Mesmo esquema: inserir dados locais reais (tempo de entrega, parceiro de logística). |
| `jaleco cuiaba` | 8.7 | 56 | `/cidade/jaleco-cuiaba` | Criar link interno da categoria geral para a city page com âncora *"jaleco Cuiabá"*. |
| `jaleca` | 5.5 | 206 | `/produto/jaleco-slim-gold-feminino-jaleca` | **Erro de intenção.** Quem busca *"jaleca"* quer a marca/home. Essa URL não deveria ranquear. Canonicalizar ou redirecionar peso para `/` via linkagem interna. |
| `jaleco macapa` | 6.3 | 50 | `/cidade/jaleco-macapa` | Incluir frase sobre atender Macapá com frete grátis Norte/Sudeste. |

**Nota estratégica:** As city pages geram cliques (ex: Florianópolis teve CTR de 8%), mas são extremamente genéricas. Precisam de **micro-conteúdo local** para consolidar posição.

---

## 4. GSC — AÇÕES URGENTES

### Queries com CTR 0% (impressões sem clique)

| Query | Impressões | Problema | Nova Title Sugerida | Nova Meta Description Sugerida |
|---|---|---|---|---|
| `jaleco de medico` | 153 | Título genérico, sem CTA | **Jaleco Médico: Slim, Elastex e Tradicional \| Frete Grátis SE** | *Escolha jaleco médico com elastano para plantão de 12h. Modelos Slim e Profissional, PP ao G3. Troca fácil. Compre online.* |
| `jaleco de médico` | 105 | Idem, com acento | **Jaleco de Médico: Conforto para Plantão e Consultório \| Jaleca** | *Jaleco de médico com avaliação 4.9★. Tecido Elastex, não amassa. Branco, preto e colorido. Frete grátis Sudeste acima de R$499.* |

### Páginas que perderam posição — Diagnóstico

| Página/Keyword | Queda | Diagnóstico | Solução |
|---|---|---|---|
| `jaleco slim feminino` | -14 (2→16) | **Sobrescrita por conteúdo duplicado interno.** A categoria `/categoria/jalecos-femininos` e o guia de blog competem pelo mesmo termo. | Consolidar: usar `/jaleco-feminino` como hub principal. Adicionar `rel="canonical"` na categoria apontando para `/jaleco-feminino` ou vice-versa. Remover keyword cannibalization. |
| `como lavar um jaleco branco` | -10 (1→11) | Conteúdo fragmentado em 3 URLs: `/blog/como-lavar-jaleco-branco`, `/blog/como-lavar-jaleco-profissional-guia-completo` e `/blog/como-cuidar-jaleco-branco-dicas`. | Consolidar tudo em `/blog/como-lavar-jaleco-profissional-guia-completo` (a mais completa). Redirecionar as outras duas para ela com 301. Atualizar data de modificação. |
| `jaleco slim` | -3.8 (2.5→6.3) | Mesmo problema: cannibalização entre `/jaleco-feminino`, `/jaleco-premium` e `/categoria/jalecos`. | Definir uma única URL pivô para "jaleco slim" (sugiro `/jaleco-feminino` ou criar `/jaleco-slim`) e desotimizar as demais. |
| `loja de jalecos` | -9 (29→38) | Intenção local/localizador. A Jaleca não tem página de "lojas físicas" otimizada para busca genérica, só `/nossas-lojas`. | Criar página `/loja-de-jalecos` listando todas as unidades + opção online. |
| `jalecos londrina` | -8.4 (8.6→17) | City page genérica. | Inserir conteúdo exclusivo: tempo de entrega para Londrina, CEPs atendidos, depoimento de cliente local. |

---

## 5. GAP DE KEYWORDS

Como a seção "GAP" veio vazia nos dados, extraí pelo cruzamento de **keywords do mercado** vs. **posições nulas** da Jaleca:

### Top Gaps Transacionais (Criar/Otimizar Agora)

| Keyword | Concorrente Provável | O que a Jaleca deve fazer |
|---|---|---|
| `jaleco personalizado` | Dr. Jaleco, Boutique dos Jalecos | Criar página `/jaleco-personalizado` com simulador de bordado e preço. O conteúdo atual está só no blog. |
| `jaleco bordado` | Donne Jalecos | Otimizar a existente `/blog/jaleco-com-nome-bordado` para transacional ou criar `/produtos?personalizacao=bordado`. |
| `jaleco estampado` | JalecoOnline | Criar categoria `/categoria/jalecos-estampados`. Hoje a Jaleca não tem. |
| `scrub médico` | Brancura, Primeira Cor | Criar landing `/scrub-medico` (masculino, centro cirúrgico). Hoje só existe `/scrub-feminino`. |
| `jaleco plus size feminino` | Brancura | A URL `/jaleco-plus-size` existe mas tem conteúdo muito curto (856 palavras) e genérico. Expandir com tabela de medidas G1-G3 e fotos reais. |
| `jaleco gestante` | Dracharm | Criar `/jaleco-feminino-gestante`. Hoje existe só post de blog curto (444 palavras). |
| `jaleco farmácia` / `jaleco odontologia` / `jaleco veterinária` | Vários | As URLs existem (`/jaleco-farmacia`, `/jaleco-odontologia`), mas precisam de conteúdo único (estão muito similares entre si). |

### Gap Cidade × Profissão (Doorway → Páginas Reais)

Atualmente a Jaleca tem `/cidade/jaleco-{cidade}` genéricas. O gap está em não ter **cidade + profissão**, como:
- `jaleco feminino são paulo` (volume alto)
- `jaleco médico belo horizonte`
- `jaleco enfermagem curitiba`

**Estratégia:** Não criar milhares de URLs. Escolher as 10 cidades com maior população do Sudeste e criar **1 página rica por cidade** que atenda todas as profissões, com H2s por profissão e filtro dinâmico.

---

## 5b. GSC — PÁGINAS COM IMPRESSÕES ALTAS MAS CTR BAIXO

| URL | Impressões | CTR | Problema | Nova Title + Meta |
|---|---|---|---|---|
| `/jaleco-medico` | 330 | 0% | Título genérico, sem diferencial | **Title:** *Jaleco Médico: Slim, Elastex e Plus Size \| 4.9★ \| Jaleca*<br>**Meta:** *Jaleco médico com elastano para plantão de 12h. Slim, Princesa e Profissional. Do PP ao G3. Frete grátis SE. Troca em 7 dias.* |
| `/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar` | 513 | 0.19% | Title longo e truncado, sem gancho | **Title:** *Jaleco ou Scrub: Qual Usar? \| Guia por Profissão \| Jaleca*<br>**Meta:** *Médico, dentista ou enfermeiro? Descubra se jaleco ou scrub é melhor para o seu dia a dia. Compare modelos, tecidos e preços.* |
| `/blog/roupa-medica-profissional` | 429 | 0% | Title vago | **Title:** *Roupa Médica Profissional: Além do Jaleco Branco \| Jaleca*<br>**Meta:** *Do jaleco clássico ao scrub cirúrgico: saiba qual roupa médica usar em cada ambiente hospitalar e clínico.* |
| `/categoria/jalecos-femininos` | 422 | 0.95% | Title repetido "Jaleca \| Jaleca" | **Title:** *Jaleco Feminino: Slim, Princesa e Elastex \| 12 Cores \| Jaleca*<br>**Meta:** *Jaleco feminino com corte real para o corpo. Modelos Slim, Princesa e Elastex. Do PP ao G3. Frete grátis Sudeste.* |
| `/blog/como-escolher-tamanho-jaleco-feminino` | 413 | 0.73% | Soft CTA | Adicionar botão "Ver tabela de medidas completa" acima da dobra e linkar para `/medidas`. |

---

## 6. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO

Com base nas H2s e nas páginas existentes, as perguntas que o Google costuma mostrar para este nicho incluem:

1. **"Jaleco slim ou tradicional: qual melhor?"** → Já existe conteúdo, mas pode virar FAQ na `/jaleco-feminino`.
2. **"Quanto custa um jaleco de qualidade?"** → Criar post *"Quanto Custa um Jaleco de Qualidade em 2026?"* (vincular a `/jaleco-premium`).
3. **"Qual tecido de jaleco não amassa?"** → Criar post comparando Elastex vs Gabardine vs Algodão (a Jaleca tem blog sobre tecidos de scrub, mas não de jaleco).
4. **"Jaleco branco pode usar na rua?"** → Levar ao post do CFM (`/blog/jaleco-fora-consultorio-cfm`).
5. **"Como tirar mancha de caneta de jaleco branco?"** → Já existe guia, mas falta vídeo e schema `HowTo`.
6. **"O que é scrub e qual a diferença do jaleco?"** → Tem post, mas precisa de bloco de comparação visual (tabela HTML).

**Prioridade:** Perguntas 2 e 3 (alto volume, baixa competição).

---

## 7. CONTEÚDO FRACO

Páginas com pouca substância editorial (menos de 600 palavras ou conteúdo de preenchimento):

| URL | Word Count | Problema | Solução |
|---|---|---|---|
| `/categoria/jalecos-masculinos` | 766 | Apenas 1 H2 genérico | Adicionar H2s por modelo (Slim, Tradicional, Recortes) e texto sobre tamanhos/cores. |
| `/categoria/domas` | 608 | Mesmo template vazio | Inserir texto sobre diferença dolma vs jaleco, uso em cirurgia, origem do termo. |
| `/categoria/conjuntos-masculinos` | 475 | Quase sem conteúdo | Adicionar guia "Como escolher scrub masculino" e vídeo. |
| `/categoria/acessorios` | 512 | Genérico | Criar grids reais ou redirecionar para produtos ativos (hoje muitos estão indisponíveis). |
| `/blog/jaleco-feminino-gestante-como-escolher` | 444 | Muito curto | Expandir para 900+ palavras com guia por trimestre e tabela de tamanhos gestante. |
| `/blog/jaleco-manga-curta-quando-usar-profissionais` | 421 | Curto | Adicionar citação da NR-32 e tabela por profissão. |
| Várias city pages | ~730 | **Templates idênticos** | Inserir 2-3 parágrafos únicos por cidade: tempo médio de entrega, logística local, depoimento de cliente da cidade. |

---

## 8. BACKLINKS

| Site | Backlinks (dados) | Situação real estimada |
|---|---|---|
| **jaleca.com.br** | 0 / RD 0 | Campo limpo, mas sem autoridade. |
| **jalecoonline.com.br** | 0 / RD 0 | Provavelmente subestimado; domínio antigo. |
| **drjaleco.com.br** | 0 / RD 0 | Idem. |

**Estratégia de aquisição imediata:**
1. **Listagem em diretórios de moda profissional:** Cadastrar na Cadevo, ABEST, associações de enfermagem/medicina.
2. **Guest posts em blogs de faculdades de medicina/enfermagem:** Tema: *"Como escolher o primeiro jaleco da faculdade"*.
3. **Fornecimento para influencers pequenos (micro 10k-50k):** Enviar peça em troca de post com link para `/jaleco-feminino`.
4. **Google Meu Negócio das 6 lojas físicas:** Garantir que todas tenham perfil otimizado com link para o site (sinal local forte).
5. **Link digital na NR-32/CFM/COFEN:** Não é possível linkar diretamente, mas mencionar em releases quando houver campanha de vestimenta.

---

## 9. PERFORMANCE

**Dados Mobile (Lighthouse):**
Todas as URLs críticas apresentam **score 0** em todos os pilares.

| URL | Performance | SEO | Acessibilidade | Best Practices |
|---|---|---|---|---|
| `/` | 0 | 0 | 0 | 0 |
| `/produtos` | 0 | 0 | 0 | 0 |
| `/categoria/jalecos` | 0 | 0 | 0 | 0 |

**Diagnóstico provável:**
- Bloqueio de renderização por JavaScript pesado (provavelmente Shopify/VTEX com apps mal otimizados).
- Imagens não otimizadas (WebP/AVIF ausente).
- CLS alto por carregamento tardio de fontes ou pop-ups.

**Ação técnica:**
- Auditar com PageSpeed Insights real; se confirmar LCP > 4s, migrar imagens para CDN com compressão.
- Adiar JS não crítico.
- Implementar `font-display: swap`.

---

## 10. CONTEÚDO EDITORIAL — JALECA VS CONCORRENTES

| Métrica | Jaleca (Home) | JalecoOnline | Dr. Jaleco | Dra. Charm |
|---|---|---|---|---|
| **Word Count** | 753 | 1.241 | 1.091 | 1.032 |
| **H2s estratégicos** | 9 (genéricos) | 6 (vendas) | 5 | 0 |
| **Schema** | Organization + WebSite + ClothingStore | Nenhum | Organization + Product | Nenhum |
| **Imagens** | 13 | 80 | 81 | 50 |

**Análise:** A home da Jaleca é mais "pobrinha" em conteúdo do que as concorrentes. JalecoOnline e Dr. Jaleco usam a home como vitrine com muitos produtos e reviews. A Jaleca tem muita prosa institucional ("Mais de 200 mil peças vendidas") e pouca prova social visual acima da dobra.

**Páginas claramente inferiores:**
- `/jaleco-premium` (996 palavras) vs. necessidade de mostrar diferenciação de preço/qualidade.
- `/uniformes-profissionais-saude` (921 palavras) vs. concorrentes que usam comparativos de profissões.
- City pages: todas são templates iguais. Concorrentes locais (Brancura) usam landing mais objetiva por cidade.

**Recomendação específica:**
- **Home:** Aumentar para 1.200+ palavras com seção comparativa de modelos (Slim vs Princesa vs Elastex) e vídeo curto.
- **City Pages:** Inserir mapa embed, foto da loja mais próxima (se houver) ou centro de distribuição, e depoimento com nome e cidade do cliente.

---

## 11. GOOGLE SHOPPING

| Keyword | Jaleca aparece? | Top concorrentes visíveis |
|---|---|---|
| `jaleco feminino` | **NÃO** | Brancura, Jussara Nunes, Donne |
| `jaleco médico feminino` | **NÃO** | Dr. Jaleco, JalecoOnline |
| `scrub feminino` | **NÃO** | Brancura, Casa do Jaleco |
| `jaleco bordado` | **NÃO** | Boutique dos Jalecos |

**Diagnóstico:** A Jaleca provavelmente **não tem feed de produtos ativo no Google Merchant Center** ou o feed está desatualizado/reprovado.

**Plano Shopping:**
1. Criar conta no Google Merchant Center.
2. Gerar feed XML com todos os produtos ativos (excluir os "produto não encontrado").
3. Otimizar títulos dos produtos no feed com estrutura: `[Modelo] [Gênero] [Cor] — [Marca] | [Tamanho]`
   - Ex: `Jaleco Slim Princesa Feminino Branco — Jaleca | PP ao G3`
4. Preços competitivos + frete grátis explícito no anúncio.
5. Ativar Performance Max com segmentação por profissão (médica, dentista, enfermeira).

---

## 12. OPORTUNIDADE DE KEYWORDS — VOLUME + CPC

Com base nas keywords fornecidas e nas variações não ranqueadas:

| Keyword | Intenção | Prioridade | Ação |
|---|---|---|---|
| `jaleco feminino` | Transacional | **1** | Consolidar autoridade da `/jaleco-feminino` e resolver cannibalização. |
| `scrub feminino` | Transacional | **1** | Criar categoria dedicada e comparativo scrub vs jaleco. |
| `pijama cirúrgico` | Transacional | **2** | Otimizar landing existente `/pijama-cirurgico-feminino`. |
| `jaleco personalizado bordado` | Transacional Alto CPC | **1** | Criar página de serviço + simulador. |
| `jaleco barato` | Transacional | **3** | Criar coleção "Jaleco Essential" ou otimizar categoria por preço. |
| `jaleco para formatura medicina` | Sazonal/Transacional | **2** | Já existe post; transformar em landing com CTA para compra em grupo. |
| `loja de jalecos` | Local/Navegacional | **2** | Criar `/lojas` otimizada. |
| `como lavar jaleco branco` | Informacional | **3** | Recuperar posição 1 (caiu para 11). |

---

## 13. INTELIGÊNCIA COMPETITIVA — DOMÍNIOS

Dados WHOIS não disponíveis, mas pela arquitetura:

- **Maior ameaça curto prazo:** **Brancura** — preço baixo ("a partir de R$39,90"), boa visualização no Shopping e schema de `AggregateRating` ativo.
- **Maior ameaça longo prazo:** **Dr. Jaleco / JalecoOnline** — arquitetura de catálogo madura, muitas imagens e reviews sociais.
- **Oportunidade:** Nenhum concorrente está explorando bem conteúdo de **normas regulatórias** (CFM, COFEN, NR-32). A Jaleca tem isso (artigos sobre conselhos), mas não converte bem.

---

## 14. PLANO DE AÇÃO DE HOJE

### ⚡ FAZER AGORA (esta sessão)

| URL / Ação | O que fazer | Impacto | Tempo |
|---|---|---|---|
| **Produtos fantasmas** (27 URLs de toucas/faixas) | Retornar **HTTP 410** ou redirecionar 301 para `/categoria/acessorios`. Remove sinal de baixa qualidade. | Alto | 30 min |
| `/jaleco-medico` | Reescrever title: *"Jaleco Médico Feminino e Masculino — Slim com Elastano \| Jaleca"* | Alto | 15 min |
| `/jaleco-dentista` | Adicionar schema `AggregateRating` (já tem 61 avaliações no texto). | Médio | 20 min |
| `/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar` | Reescrever title/meta para melhorar CTR (ver seção 5b). | Médio | 15 min |
| `/` (Home) | Corrigir canonical para `https://jaleca.com.br/` (com barra final, igual ao redirect atual). | Baixo | 5 min |

### 📅 ESTA SEMANA

| Página / Projeto | O que fazer | Impacto |
|---|---|---|
| **Cannibalização "lavar jaleco"** | Consolidar 3 posts em 1 (`/blog/como-lavar-jaleco-profissional-guia-completo`) e aplicar 301 nas duplicatas. | Alto |
| **City pages Top 10** | Enriquecer páginas de SP, RJ, BH, Curitiba, Porto Alegre, Salvador, Recife, Fortaleza, Goiânia e Brasília com 2 parágrafos únicos cada + depoimento local. | Médio |
| **Feed Google Shopping** | Criar conta Merchant Center e subir XML dos produtos ativos. | Alto |
| **Página `/jaleco-plus-size`** | Expandir de 856 para 1.200+ palavras com tabela G1-G3 real, fotos de modelo plus e FAQ. | Médio |
| **Core Web Vitals** | Auditar PSI mobile real. Se LCP > 2,5s, comprimir imagens e adiar JS. | Alto |

### 📆 ESTE MÊS

| Iniciativa | O que fazer | Impacto |
|---|---|---|
| **Hub "Jaleco Feminino"** | Transformar `/jaleco-feminino` em página definitiva. Remover competição interna da categoria. Adicionar vídeo, tabela comparativa de modelos e link interno massivo dos posts de blog. | Alto |
| **Backlinks locais** | Criar/otimizar 6 perfis do Google Meu Negócio das lojas físicas com link para o site e posts semanais. | Médio |
| **Conteúdo PAA** | Publicar 4 posts respondendo perguntas de alto volume:<br>1. *"Qual tecido de jaleco não amassa?"*<br>2. *"Quanto custa um jaleco de qualidade?"*<br>3. *"Jaleco gestante: quando comprar?"*<br>4. *"Jaleco branco ou colorido: o que o CFM permite?"* | Médio |
| **Relatório de cannibalização** | Mapear todas as URLs que competem por "jaleco slim", "jaleco feminino" e "scrub feminino". Definir canonicals ou redirecionamentos. | Alto |
| **Google Shopping PMax** | Ligar campanha de Performance Max com imagens de produto e públicos customizados (interesse: medicina, enfermagem, odontologia). | Alto |

---

**Resumo da estratégia:** A Jaleca não precisa de mais páginas agora — precisa **consolidar** as 460 existentes, eliminar as quebradas, corrigir a arquitetura de canibalização e ativar o Google Shopping. O conteúdo já existe em volume; falta **foco técnico e conversão**.
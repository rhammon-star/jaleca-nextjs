# Relatório SEO Noturno v4 — Jaleca
**Data:** 05/05/2026 15:08
**Páginas:** 467 | **Keywords:** 0

**INSTRUÇÕES:** Envie este arquivo para análise. Não salve na memória do Claude.

---

## 🚨 ALERTAS DO DIA

**1. SOFT 404 EM MASSA (80+ páginas indexáveis)**
As URLs `/cidade/jaleco-{cidade}` (ex: `https://jaleca.com.br/cidade/jaleco-sao-paulo`, `/cidade/jaleco-rio-de-janeiro`) possuem status 200, mas o **title é "Página não encontrada — Jaleca | Jaleca"**. O GSC mostra impressões para elas (ex: Salvador 175 imp, João Pessoa 171 imp, Cuiabá 153 imp). Isso consome crawl budget e envia sinal negativo de thin content. **Ação imediata:** 410 ou 301 para `/nossas-lojas`.

**2. CANNIBALIZAÇÃO "JALECA" (BRANDED) ATIVA**
4 páginas competem pelo branded mais valioso:
*   `/categoria/jalecos-femininos` (239 imp, pos 2.7)
*   `/nossas-lojas` (170 imp, pos 1.7)
*   `/jaleco-feminino` (61 imp, pos 3.3)
*   `/jaleco-enfermagem` (24 imp, pos 1.0)

**3. QUEDA LIVRE EM KEYWORDS GENÉRICAS (GSC - Último Período)**
*   `jaleco masculino`: **2.7 → 24.5** (-21.9 posições)
*   `jaleco de enfermagem`: **6 → 18** (-12 posições)
*   `jaleco scrubs`: **12 → 42.7** (-30.7 posições)
*   `jaleco`: **18.3 → 26.8** (-8.5 posições)

Isso coincide com as alterações de canonical/title de **05/05/2026**. É provável que a consolidação de `/jaleco-enfermagem` tenha removido sinais que sustentavam outras variantes, ou que o Google ainda esteja reprocessando.

**4. CONCORRENTE BOUTIQUE DOS JALECOS EXPANDE LONG-TAIL**
233 novas URLs detectadas hoje, com foco em profissões ultra-nichadas (`/profissoes/nutricao`, `/profissoes/fonoaudiologia`, `/jaleco-feminino-personalizado-branco-gola-padre-bordado-terapia-ocupacional`) + bordado. Jaleca não tem páginas para terapia ocupacional, perito criminal, naturologia, etc.

**5. CTR ZERO NA FRONTEIRA DA PÁGINA 1**
*   `jaleco de medico` (205 imp, pos **10.9**, CTR 0%)
*   `jaleco de médico` (170 imp, pos **11.0**, CTR 0%)
*   `jaleco dentista` (69 imp, pos **8.3**, CTR 0%)

O title `/jaleco-medico` foi reescrito em 05/05, mas a query "jaleco de medico" (com preposição) ainda não encontra match forte no title, e a posição 10.9 é exatamente o limiar da página 1.

---

## 1. RESUMO EXECUTIVO

**Score SEO Geral: 34/100**

*Justificativa:* A Jaleca tem uma base técnica razoável (schema presente, site rápido aparentemente sem erros JS), mas sofre de **ausência total de performance em keywords genéricas** (`jaleco feminino`, `jaleco médico` — todas `null` no ranking tracker), **problemas de arquitetura massivos** (80+ soft 404s), **E-A-T insuficiente para YMYL** (autor é "Organization", nunca uma pessoa com credenciais) e **cannibalização não resolvida** no GSC. O tráfego é 100% branded (`jaleca`, `jaleca ipatinga`, `jaleca colatina`).

**Top 5 Problemas Críticos**
| # | Problema | URL(s) de Exemplo | Impacto Estimado |
|---|----------|-------------------|------------------|
| 1 | **Soft 404 em massa** | 80× `/cidade/jaleco-{cidade}` com title "Página não encontrada" | Crawl budget desperdiçado; diluição de autoridade local |
| 2 | **E-A-T quebrado em YMYL** | `/jaleco-medico`, `/jaleco-dentista`, `/blog/como-escolher-jaleco-feminino` — autor = "Jaleca" (org), sem links CFM/CRO/ANVISA | Não ranqueia para saúde sem sinais de expertise real |
| 3 | **CTR 0% na página 1/limiar** | `/jaleco-medico` (pos 10.9, CTR 0%), `/jaleco-dentista` (pos 8.3, CTR 0%) | Perde cliques mesmo quando aparece |
| 4 | **Cannibalização pós-consolidação** | Queda de `jaleco masculino` (2.7→24.5) e `jaleco de enfermagem` (6→18) após 05/05 | Perda drástica de visibilidade genérica |
| 5 | **Produtos ativos com noindex** | `/produto/touca-de-elastico-jaleca`, 24 variações de toucas/faixas | Impossível ranquear para "touca cirúrgica", "faixa de cabelo" |

**Top 5 Oportunidades**
| # | Oportunidade | URL / Ação | Impacto |
|---|--------------|------------|---------|
| 1 | **Virar página 1 para "jaleco dentista"** | `/jaleco-dentista` já está pos 8.3; falta apenas imagem no Product schema + autor + link CRO | Alto: keyword com alta intenção comercial |
| 2 | **Criar hub de profissões faltantes** | Criar `/jaleco-fonoaudiologia`, `/jaleco-terapia-ocupacional` etc. (gap da Boutique) | Médio: long-tail de alto valor |
| 3 | **Ativar Google Shopping** | Feed de produtos não aparece para nenhuma keyword testada | Alto: captura transacional direta |
| 4 | **Consertar 25 toucas noindex** | Remover `noindex` e adicionar canonical self | Médio: tráfego de acessórios |
| 5 | **Transformar /cidade/ em landing real ou matar** | Se houver demanda (Salvador, Recife), criar LP com frete e prazo; senão, 410 | Alto: libera crawl budget |

---

## 2. SAÚDE TÉCNICA COMPLETA

**Soft 404s (Status 200, mas title "Página não encontrada")**
*   `https://jaleca.com.br/cidade/jaleco-sao-paulo`
*   `https://jaleca.com.br/cidade/jaleco-rio-de-janeiro`
*   `https://jaleca.com.br/cidade/jaleco-belo-horizonte`
*   `https://jaleca.com.br/cidade/jaleco-salvador` (175 impressões no GSC!)
*   ... **total de 81 URLs** no padrão `/cidade/jaleco-{cidade}`.

Essas páginas estão **indexadas** (aparecem no GSC), consomem orçamento de rastreamento e competem entre si com o mesmo title duplicado.

**Canonicals Incorretos**
*   `/blog/guia-jaleco-dentista-modelos-cores-como-escolher` → canonical aponta para `/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher` (redirect 301 existe, mas canonical está na URL antiga).
*   Variações de produto (cores) apontando corretamente para SKU principal (ex: `jaleco-slim-tradicional-feminino-jaleca-rose` → `/produto/jaleco-slim-tradicional-feminino-jaleca`). **Isso está OK.**
*   **Posts de blog duplicados:**
    *   `/blog/como-lavar-jaleco-branco` → canonical para `/blog/como-lavar-jaleco-profissional-guia-completo` (redirect chain detectado).
    *   `/blog/como-lavar-e-conservar-seu-jaleco-profissional-2` → mesmo canonical acima.

**Redirect Chains**
*   `/blog/como-lavar-jaleco-branco` → `/blog/como-lavar-jaleco-profissional-guia-completo`
*   `/blog/guia-jaleco-dentista-modelos-cores-como-escolher` → `/blog/guia-jaleco-para-dentista-modelos-cores-como-escolher`

**Títulos e H1 Duplicados (Risco de Confusão Algorítmica)**
*   **H1 "Jaleco Slim Tradicional Feminino"** usado em 3 SKUs de cor (rosa, uva, padrão).
*   **H1 "Conjunto Scrub Feminino"** usado em 4 SKUs de cor (cereja, chumbo, rose, padrão).
*   **Title "Como Lavar Jaleco Branco na Máquina Sem Amarelamento"** repetido em 3 URLs de blog.

**Páginas Órfãs (sem links internos detectados no crawl)**
*   `https://jaleca.com.br/blog`
*   `https://jaleca.com.br/jaleco-medico`
*   `https://jaleca.com.br/jaleco-feminino`
*   `https://jaleca.com.br/uniformes-profissionais-saude`
*   ... (total de 30 URLs importantes). *Nota: verificar se o header/menu não foi renderizado no crawl; se são realmente órfãs, isso explica a falta de autoridade.*

**Robots.txt**
*   Bloqueios aceitáveis: `/wp-admin/`, `/checkout`, `/api/`.
*   **Atenção:** `/api/` bloqueado é comum, mas se o site carrega conteúdo de produtos via `/api/` (Next.js/data), confirme que o HTML renderizado entrega tudo. Nenhum erro JS foi detectado.

**Imagens Sem Alt Text**
*   Nenhuma detectada no crawl (ótimo).

**Páginas com Noindex Inesperado**
*   25 produtos de **toucas e faixas de cabelo** estão com `noindex`:
    *   `/produto/touca-de-elastico-jaleca`
    *   `/produto/touca-de-amarrar-jaleca-areia`
    *   `/produto/faixa-de-cabelo-jaleca`
    *   ... e 22 variantes de cor.
    *   Se esses SKUs estão ativos no catálogo, **estão invisíveis no Google**.

---

## 3. SCHEMA MARKUP

**Produtos sem Product Schema:** 0 detectados no audit. No entanto, apenas **2 páginas** têm `AggregateRating`:

1.  **Homepage** (`/`) — `AggregateRating` { ratingValue: "4.9", reviewCount: 61 }
2.  **`/jaleco-dentista`** — `AggregateRating` { ratingValue: "4.9", reviewCount: "61" }

**Problema:** 176 produtos têm Product schema no site, mas **sem avaliações**. Em e-commerce, a ausência de `AggregateRating` em páginas de produto impede rich snippets de estrelas, que aumentam CTR em até 30% no nicho.

**Schema Incompleto**
*   **`/jaleco-dentista`**: Schema `Product` está presente, mas **falta o campo `image`**. Isso invalida o rich snippet de produto.

**FAQ Schema**
*   **381 páginas** com FAQPage schema. Isso é um ativo forte.
*   **Risco:** Algumas respostas podem ser genéricas demais. Exemplo na página `/jaleco-dentista`:
    > "Para dentistas, o Jaleco Slim é o mais indicado..."
    A resposta é comercial, não técnica. Para YMYL, o Google prefere respostas com embasamento normativo (NR-32, CRO).

**Recomendação por Tipo de Página**
| Tipo | Schema Atual | O que Fazer |
|------|--------------|-------------|
| **Home** | Organization + WebSite + ClothingStore + LocalBusiness ✅ | Adicionar `sameAs` do LinkedIn da empresa. |
| **Páginas de Profissão** (ex: /jaleco-medico) | FAQPage + Article | Adicionar `MedicalAudience` ou `Occupation` schema; trocar `author Organization` para `Person` com `medicalCredential`. |
| **Produtos** | Product (176x) | Adicionar `AggregateRating` (coletar reviews); incluir `offers` com `priceValidUntil`. |
| **Blog** | BlogPosting (lista na /blog) | Garantir `dateModified` atualizado; autor deve ser `Person`, não `Organization`. |

---

## 4. E-A-T — NICHO SAÚDE (YMYL)

**Páginas sem Autor Identificado (campo `autor: ""` no HTML)**
*   `/blog/como-escolher-jaleco-feminino-guia-completo`
*   `/blog/scrub-feminino-guia-completo`
*   `/blog/scrub-feminino-acinturado`
*   `/jaleco-dentista`
*   `/jaleco-medico`
*   `/jaleco-enfermeiro`
*   `/jaleco-fisioterapeuta`
*   `/jaleco-nutricionista`
*   `/jaleco-medica`
*   `/jaleco-enfermeira`
*   `/jaleco-medicina`
*   `/jaleco-fisioterapia`
*   `/jaleco-nutricao`
*   `/jaleco-enfermagem`
*   ... (20 URLs ao total)

**Páginas sem Links para Órgãos Reguladores (COFEN, CFM, CRO, ANVISA)**
São exatamente as mesmas 20 acima. Nenhuma cita `https://portal.cfm.org.br`, `https://www.cofen.gov.br` ou `https://www.gov.br/anvisa/pt-br`.

**Schema "Author" é "Jaleca" (Organization), nunca uma pessoa**
Exemplo do schema na página `/blog/como-escolher-jaleco-feminino-guia-completo`:
```json
"author": {"@type": "Organization", "name": "Jaleca"}
```
Para nicho YMYL, isso é insuficiente. O Google exige saber **quem** está dando a informação.

**O que adicionar para aumentar E-A-T nas páginas de profissão**
1.  **Autor humano:** Criar página `/autor/ana-luiza` com foto, bio, LinkedIn, e por quê ela fala sobre uniformes médicos (ex: "Especialista em vestuário profissional para saúde desde 2020").
2.  **Links de referência:** Em cada página de profissão, adicionar um bloco "Normas e Regulamentações" linkando para:
    *   `/jaleco-medico` → CFM, NR-32
    *   `/jaleco-dentista` → CRO, NR-32
    *   `/jaleco-enfermagem` → COFEN, COREN
3.  **Citações/Depoimentos médicos reais:** Incluir foto + CRM (parcial) de profissionais que usam a marca.
4.  **Atualizar datas:** `dateModified` deve refletir revisões reais do conteúdo.

---

## 5. FACETED NAVIGATION

Nenhuma URL parametrizada foi detectada no audit (`[]`), mas o `robots.txt` possui disallows específicos para:
*   `/produtos?*sale=*`
*   `/produtos?*categoria=*`
*   `/produtos?*filter_*=*`
*   `/color/`

**Recomendação:** Se a navegação facetada ainda existir em JS (Next.js), garantir que:
*   Filtros de cor/tamanho adicionem `rel="nofollow"` nos links.
*   Páginas de filtro aplicado tenham **self-canonical** para si mesmas (se forem úteis) ou **noindex** (se forem combinações infinitas).
*   A URL limpa da categoria (ex: `/categoria/jalecos-femininos`) seja a única indexada.

---

## 6. INTENÇÃO DE BUSCA

**Keywords Transacionais sem Landing Page Específica**
| Keyword | Intenção | Problema |
|---------|----------|----------|
| `jaleco barato` | Transacional | Jaleca não tem página de categoria "por preço". O posicionamento é premium (Elastex), mas o title não comunica valor. |
| `jaleco online` | Transacional | A home compete, mas não otimizada para "online" (frete, segurança). |
| `comprar jaleco` | Transacional | Falta um hub "/comprar-jaleco" ou otimização da `/produtos` para essa keyword. |

**Desalinhamento Intenção × Conteúdo**
*   **Keyword:** `jaleco de medico` (navegacional/comercial)
    *   **URL:** `/jaleco-medico`
    *   **Problema:** O title atual é `"Jaleco Médico Feminino e Masculino — Slim com Elastano | Jaleca"`. O usuário busca `"jaleco de medico"` (com preposição). O title não contém a preposição "de", o que pode reduzir relevância para o exact match. Além disso, a intenção de quem busca isso quer saber **se o CFM obriga**, **qual cor usar**, **como bordar** — a página tem FAQs, mas o title não promete resposta.
*   **Keyword:** `como lavar jaleco branco` (informacional)
    *   **URL:** `/blog/como-lavar-jaleco-profissional-guia-completo` (ou redirect do `/blog/como-lavar-jaleco-branco`)
    *   **Problema:** A URL final tem keyword "profissional", não "branco". O exact match fica enfraquecido.

---

## 7. CANNIBALIZAÇÃO — DIAGNÓSTICO COMPLETO

**Caso 1: Branded "jaleca"**
| URL | Impressões | Posição Média |
|-----|------------|---------------|
| `/categoria/jalecos-femininos` | 239 | 2.7 |
| `/nossas-lojas` | 170 | 1.7 |
| `/jaleco-feminino` | 61 | 3.3 |
| `/jaleco-enfermagem` | 24 | 1.0 |

**Ação:** `/nossas-lojas` não deveria ranquear para "jaleca" (termo geral da marca). Adicionar no schema e no conteúdo da `/nossas-lojas` que o target é "loja jaleca ipatinga", "loja jaleca bh", etc. Deixar `/` (home) e `/categoria/jalecos-femininos` como principais para o termo.

**Caso 2: Enfermagem (consolidação de 05/05)**
*   URLs envolvidas: `/jaleco-enfermagem`, `/jaleco-enfermeiro`, `/jaleco-enfermeira`, `/scrub-enfermagem`.
*   Ação tomada: canonicals apontando para `/jaleco-enfermagem`.
*   **Status no GSC:** A keyword `jaleco de enfermagem` caiu de 6 para 18. Isso indica que a consolidação **ainda não surtiu efeito positivo**; pode haver perda de signals das URLs secundárias. **Sugestão:** em vez de canonical, avaliar **301 permanente** de `/jaleco-enfermeiro` e `/jaleco-enfermeira` para `/jaleco-enfermagem?genero=masculino` (ou sessão na mesma página), transferindo link equity.

**Caso 3: Blog — "Como lavar jaleco branco"**
*   3 URLs no mesmo cluster:
    *   `/blog/como-lavar-jaleco-branco` → 301 para guia completo
    *   `/blog/como-lavar-jaleco-profissional-guia-completo` (canônica)
    *   `/blog/como-lavar-e-conservar-seu-jaleco-profissional-2` → canonical para a mesma
*   **Ação:** OK, mas garantir que não haja internal links apontando para as URLs antigas.

---

## 8. OPORTUNIDADES RÁPIDAS — POSIÇÃO 4-20

**Keywords com 50+ impressões na fronteira da página 1:**

| Keyword | Posição | Impressões | URL Atual | O que Fazer Exatamente |
|---------|---------|------------|-----------|------------------------|
| `jaleco dentista` | **8.3** | 69 | `/jaleco-dentista` | Adicionar `image` no schema Product; inserir no title: **"Jaleco para Dentista: Curto/Longo com Elastano \| Jaleca"**; adicionar link para CRO no corpo. |
| `jaleco de dentista` | **10.1** | 50 | `/jaleco-dentista` | Mesma página. A query usa "de". Incluir `H2` "Qual jaleco de dentista é melhor?" e `H3` "Jaleco de dentista curto ou longo?". |
| `jaleco de medico` | **10.9** | 205 | `/jaleco-medico` | Title sugerido: **`Jaleco de Médico: Elastano para Plantão \| PP ao G3 \| Jaleca`**. Adicionar badge de preço a partir de R$XX na meta. |
| `jaleco de médico` | **11.0** | 170 | `/jaleco-medico` | Mesma ação. Incluir link CFM e explicação sobre cor obrigatória (ou não). |
| `como lavar jaleco branco` | **10.4** | 123 | `/blog/como-lavar-jaleco-profissional-guia-completo` | Mudar `<title>` para **`Como Lavar Jaleco Branco: Guia Para Não Amarelhar \| Jaleca`**. O title atual foca "profissional", não "branco". |
| `jaleco salvador` | **7.4** | 77 | `/cidade/jaleco-salvador` | **URGENTE:** Essa URL é um soft 404 (title "Página não encontrada"). Ou cria conteúdo real ("Jalecos em Salvador — Entrega em X dias") com link para `/produtos`, ou aplica 301 para `/produtos`. |
| `jaleco cuiaba` | **8.7** | 56 | `/cidade/jaleco-cuiaba` | Idem ao de Salvador. |
| `jaleco odontologia` | **11.0** | 55 | `/blog/jaleco-odontologia-como-escolher` | Consolidar ação da landing `/jaleco-dentista`. O blog pode linkar mais fortemente para a categoria. |

---

## 9. GSC — AÇÕES URGENTES

**Queries com CTR Baixo (Reescrever Title/Meta)**
*   **`jaleco de medico` (205 imp, CTR 0%, pos 10.9)**
    *   Title atual: `Jaleco Médico Feminino e Masculino — Slim com Elastano | Jaleca`
    *   **Problema:** Sem "de"; sem diferencial de preço/entrega.
    *   **Novo Title:** `Jaleco de Médico: Elastano para 12h de Plantão | Jaleca` ou `Jaleco de Médico Feminino e Masculino — Envio em 2 Dias | Jaleca`
*   **`jaleco de médico` (170 imp, CTR 0%, pos 11.0)**
    *   Mesmo diagnóstico. A preposição importa para o algoritmo de embeddings, mas o title precisa de hook comercial para sair do 0% de CTR.

**Páginas que Perderam Posição (Diagnóstico)**
*   **`jaleco masculino` (2.7 → 24.5)**: Quase certamente a página `/categoria/jalecos-masculinos` ou `/jaleco-medico` (mas medico é unissex). Verificar se houve remoção de backlinks internos ou mudança de canonical em produtos masculinos.
*   **`jaleco scrubs` (12 → 42.7)**: O termo pode ter sido atendido por `/scrub-feminino` ou `/blog/scrub-feminino-guia-completo`. A queda sugere que nenhuma página consolidou autoridade para "scrubs" plural.
*   **`jaleco` (18.3 → 26.8)**: A home pode ter perdido relevância devido às 80+ páginas /cidade/ com title duplicado "Página não encontrada" diluindo a marca.

**Mobile vs Desktop**
*   Mobile: 21.700 imp, **2.04% CTR**
*   Desktop: 4.807 imp, **3.45% CTR**
*   **Diagnóstico:** O CTR mobile é 40% menor. Em mobile, o title é cortado mais cedo. Os titles da Jaleca são longos (ex: `Jaleco Feminino: Modelos Elegantes para Médica, Dentista e Enfermeira | Jaleca | Jaleca` — repete "Jaleca"!). Isso reduz visibilidade real no SERP mobile.

---

## 10. PÁGINAS CRÍTICAS — STATUS DETALHADO

| URL | Posição GSC (keyword) | Tendência | CTR | Indexação (URL Inspection) | Diagnóstico |
|-----|----------------------|-----------|-----|----------------------------|-------------|
| `/jaleco-enfermagem` | 1.0 (`jaleca`) | — | 0% | ✅ Indexed (crawl 26/04) | Canonical corrigido 05/05 para self. Ainda não aparece para `jaleco de enfermagem` (caiu para 18). **Aguardar reprocessamento ou aplicar 301 nas variantes.** |
| `/jaleco-medico` | 11.0 (`jaleco de médico`) | ⬇️ | 0.3% | ✅ Indexed (crawl 02/05) | Title reescrito 05/05. Ainda com CTR zero. Precisa de hook de preço/frete no title. |
| `/jaleco-dentista` | 8.3 (`jaleco dentista`) | estável | 0% | ✅ Indexed (crawl 02/05) | **Melhor oportunidade imediata.** Está na página 1. Falta apenas schema `image` e melhoria de meta. |
| `/jaleco-feminino` | 3.3 (`jaleca`) — branded | — | 0% | ✅ Indexed (crawl 05/05) | Não ranqueia para `jaleco feminino` (null no tracker). Conteúdo é bom (1331 palavras), mas competição é feroz. Precisa de backlinks e E-A-T. |
| `/scrub-feminino` | — | — | — | Não inspecionado | Palavra-chave "scrub feminino" é transacional. Página existe mas não ranqueia. Adicionar vídeo "como vestir", tabela de tamanhos em imagem, e linkar da home. |

---

## 11. GAP DE KEYWORDS

**Top 30 Gaps por Estratégia da Boutique dos Jalecos (competidor mais agressivo)**
A Jaleca não possui páginas equivalentes para:

| Profissão/Especialidade | Concorrente (URL) | Ação Jaleca |
|-------------------------|-------------------|-------------|
| Terapia Ocupacional | `/profissoes/terapia-ocupacional` | Criar `/jaleco-terapia-ocupacional` |
| Serviço Social | `/profissoes/servico-social` | Criar `/jaleco-servico-social` |
| Fonoaudiologia | `/profissoes/fonoaudiologia` | Criar `/jaleco-fonoaudiologia` |
| Biomedicina (já existe, mas gap de bordado) | `/profissoes/biomedicina` | Expandir `/jaleco-biomedico` com opções de bordado |
| Odontologia (existe, mas gap de logos CRO) | `/logomarca-das-profissoes-para-os-jalecos-personalizados-com-bordado` | Criar seção de personalização/bordado na página de odontologia |
| Acupuntura | `/jaleco-feminino-branco-gola-padre-bordado-102-acupuntura` | Criar `/jaleco-acupuntura` |
| Análises Clínicas | `/profissoes/analises-clinicas` | Criar `/jaleco-analises-clinicas` |
| Psicopedagogia | `/jaleco-feminino-branco-bordado-102-psicopedagogia` | Criar `/jaleco-psicopedagogia` |
| Técnico em Enfermagem | `/profissoes/tecnico-em-enfermagem` | Criar `/jaleco-tecnico-enfermagem` |
| Cabeleireira (existe beleza, mas não específico) | `/profissoes/jaleco-cabeleireira` | Expandir `/jaleco-cabeleireiro` com versão feminina otimizada |
| Jaleco personalizado / bordado | `/jaleco-feminino-personalizado-branco-gola-padre-bordado-{profissao}` | Criar `/jaleco-personalizado` e `/jaleco-bordado` |
| Jaleco Zíper | `/feminino/jaleco-com-ziper-feminino` | Criar categoria `/categoria/jalecos-femininos/ziper` |
| Jaleco Gola Padre (categoria) | `/feminino/jalecos-gola-padre` | Criar filtro/categoria (se houver demanda) |

**Gaps de Cidade**
*   As 81 URLs `/cidade/` existentes são soft 404s. Se houver intenção de manter, precisam virar landing pages de entrega. Senão, devem ser removidas. Não é gap se estão quebradas.

---

## 12. GSC — PÁGINAS COM ALTO IMPRESSÃO, CTR BAIXO

| URL | Impressões | CTR | Problema | Title/Meta Novo Sugerido |
|-----|------------|-----|----------|--------------------------|
| `/blog/jaleco-ou-scrub-qual-a-diferenca-quando-usar` | 350 | **0%** | Title não convence clique | `Jaleco ou Scrub: Qual Escolher? Guia por Profissão \| Jaleca` |
| `/blog/roupa-medica-profissional` | 311 | **0%** | Possivelmente desatualizado | `Uniforme Médico Profissional: Como Escolher em 2026 \| Jaleca` |
| `/jaleco-medico` | 328 | **0.3%** | Fraco para comercial | `Jaleco de Médico: Elastano para Plantão de 12h \| Jaleca` |
| `/jaleco-dentista` | 122 | **0%** | Está na pos 8.3, title genérico | `Jaleco para Dentista: Curto ou Longo com Elastano \| Jaleca` |
| `/categoria/jalecos-masculinos` | 288 | **0.35%** | Não ranqueia para "jaleco masculino" mais | `Jaleco Masculino: Slim e Profissional \| Jaleca` |

---

## 13. PEOPLE ALSO ASK — IDEIAS DE CONTEÚDO

(Os dados PAA vieram vazios, mas extraído das FAQs do site + concorrentes)

1.  **"Jaleco de médico precisa ser branco?"** → Post/blog otimizado ou FAQ expandida. Citar CFM.
2.  **"Qual tecido é melhor para jaleco?"** → Comparativo gabardine vs microfibra vs algodão (já existe, mas pode virar vídeo).
3.  **"Como bordar nome no jaleco?"** → Jaleca não oferece bordado. Pode criar conteúdo explicando **como o cliente faz após receber** e sugerindo bordadeiras parceiras (SEO de intenção informacional + afiliado/parceria).
4.  **"Jaleco ou scrub: qual a diferença?"** → Post já existe (`/blog/jaleco-ou-scrub-consultorio`), mas CTR é 0. Precisa de rich snippet.
5.  **"Jaleco com elastano vale a pena?"** → Post existe (`/blog/jaleco-elastano-vale-a-pena`), mas não ranqueia. Fortalecer link interno.

---

## 14. CONTEÚDO FRACO

**Páginas < 600 palavras (Thin Content)**
*   `/uniformes-beleza` — **584 palavras**
*   `/uniformes-gastronomia` — **539 palavras**
*   `/uniformes-servicos` — **522 palavras**
*   `/uniformes-escritorio` — **584 palavras**

**Comparação com Concorrentes (Homepage)**
*   Jaleca Home: **882 palavras**
*   Dr. Jaleco: **1.461 palavras**
*   Jaleco Online: **1.297 palavras**
*   Donne Jalecos: **963 palavras**

**O que adicionar especificamente**
*   Nas páginas de uniformes por segmento (`/uniformes-beleza`, etc.), adicionar:
    1.  **Seção de normas** (ex: NR-32 para estética).
    2.  **Tabela comparativa de tecidos** (gabardine vs microfibra para salão).
    3.  **Depoimento de cliente** com foto e profissão.
    4.  **Vídeo embed** do Instagram/TikTok (com lazy load) mostrando o produto em uso.

---

## 15. PERFORMANCE

**Core Web Vitals Mobile:**
Todos os dados retornaram `0` (performance: 0, seo: 0, accessibility: 0, best_practices: 0).

**Diagnóstico:** Os dados do PSI (PageSpeed Insights) não foram carregados ou o site está com bloqueio de fetch no ambiente de teste. **Isso é uma bandeira vermelha:** se o site for Next.js e não estiver fazendo SSR adequado, ou se o LCP for alto por causa de imagens não otimizadas, o Google pode estar rebaixando as páginas desde a atualização de maio/2026.

**Ação:** Rodar manualmente PSI para `jaleca.com.br/jaleco-feminino` e `jaleca.com.br/jaleco-medico`. Se LCP > 2.5s ou CLS > 0.1, priorizar otimização de imagens (WebP/AVIF) e layout shifts no menu mobile.

---

## 16. GOOGLE SHOPPING

**Status:** Jaleca **não aparece** para nenhuma das keywords monitoradas:
*   `jaleco feminino` → false
*   `jaleco médico feminino` → false
*   `scrub feminino` → false
*   `jaleco bordado` → false

**Quem domina:** Concorrentes como Donne Jalecos e Dr. Jaleco possuem feeds ativos. Boutique dos Jalecos investe em PLA para "jaleco personalizado".

**O que fazer:**
1.  Criar conta Google Merchant Center.
2.  Enviar feed XML com todos os produtos ativos (inclusive toucas/faixas).
3.  Títulos do feed devem ser otimizados: `Jaleco Feminino Slim {Cor} - Jaleca` em vez de código SKU.
4.  Ativar campanhas Smart Shopping com foco em ROAS.

---

## 17. INTELIGÊNCIA COMPETITIVA

**Preços:**
*   **Brancura:** R$ 39,90 (entrada de mercado, tecido básico).
*   **Casa do Jaleco:** R$ 160–438 (premium).
*   **Jaleca:** Não explicitado nas páginas raspadas, mas posicionamento é premium (Elastex, G3). **Falta comunicar preço ou faixa no title/meta** para filtrar cliques improdutivos.

**Arquitetura da Boutique dos Jalecos (Copiar e Melhorar):**
*   Eles têm **/profissoes/{nome}** e **/jaleco-por-cor/{cor}**.
*   A Jaleca tem `/uniformes-profissionais-saude` (genérico) e `/jaleco-{profissao}` (específico). Falta a profundidade de cor + profissão combinada (ex: `/jaleco-medico-branco`, `/jaleco-medico-azul`).

**Páginas Novas da Boutique (estratégia):**
Lançaram produtos com **bordado de profissão + gola padre + zíper + cor**. Isso é conteúdo de long-tail infinito. A Jaleca pode responder criando **filtros de cor dinâmicos na página de profissão** (ex: `/jaleco-medico?cor=azul`) com canonical self, mas indexando apenas a landing principal.

---

## 18. E-COMMERCE — PRODUTOS E ESTOQUE

**Thin Content em Produto**
*   Páginas de produto como `jaleco-slim-tradicional-feminino-jaleca-rose` têm canonical para a principal, mas o H1 é idêntico. Isso é aceitável.
*   **Problema grave:** As 25 páginas de **toucas e faixas** (`/produto/touca-de-elastico-jaleca`, `/produto/faixa-de-cabelo-jaleca`) estão com **`noindex`**!
    *   Se são produtos ativos e vendáveis, estão perdendo tráfego de cauda longa ("touca cirúrgica branca", "faixa de cabelo para médica").
    *   Além disso, **não possuem canonical self** (campo canonical vazio no audit).

**Recomendação**
*   **Remover `noindex`** de todos os produtos de touca/faixa.
*   Adicionar canonical self.
*   Incluir descrição de produto com pelo menos 150 palavras (ex: "Touca de elástico para médicas e enfermeiras. Tecido X, lavagem Y, combina com jaleco modelo Z").

---

## 19. RENDERIZAÇÃO JS

**Status:** Nenhum problema detectado (`[]`).

No entanto, como o site usa Next.js (`/_next/data/` no robots.txt), certifique-se de que as páginas de profissão e produto entreguem **HTML estático completo** no SSR, não apenas no client-side render. O Googlebot raramente executa JS profundo para e-commerce.

---

## 20. PLANO DE AÇÃO

### ⚡ FAZER AGORA (Próxima Sessão)

| # | URL / Escopo | O que Fazer Exatamente | Impacto | Tempo |
|---|--------------|------------------------|---------|-------|
| 1 | **80× `/cidade/jaleco-{cidade}`** | Verificar no GSC se geram cliques. Se não (apenas impressões), aplicar **status 410** ou **noindex** em massa. Se gerarem conversão, reescrever title para `"Jalecos em {Cidade} — Envio Rápido \| Jaleca"` e adicionar 2 parágrafos de conteúdo local. | **Alto** (crawl budget + eliminação de sinais negativos) | 30 min |
| 2 | **`/jaleco-medico` e `/jaleco-dentista`** | Reescrever title/meta para incluir call-to-action comercial. **Ex:** `Jaleco de Médico: Elastano para Plantão — PP ao G3 \| Jaleca`. Adicionar `image` no schema Product de `/jaleco-dentista`. | **Alto** (CTR + rich snippet) | 20 min |
| 3 | **25 produtos `/produto/touca-*` e `/produto/faixa-*`** | Remover tag `noindex`. Adicionar `<link rel="canonical" href="[URL self]"/>`. | **Médio** (recuperação de cauda longa) | 15 min |
| 4 | **`/blog/como-lavar-jaleco-profissional-guia-completo`** (canônica) | Alterar title para **exact match**: `Como Lavar Jaleco Branco: Guia Para Não Amarelar \| Jaleca`. | **Médio** (recupera ranking para "branco") | 10 min |
| 5 | **`/jaleco-medico`, `/jaleco-dentista`, `/jaleco-enfermagem`** | Trocar schema `author` de `Organization` para `Person` (Ana Luiza). Criar link para `/autor/ana-luiza` (criar página se não existir). Adicionar 1 link externo para CFM/CRO/COFEN em cada. | **Alto** (YMYL E-A-T) | 45 min |

### 📅 ESTA SEMANA

| URL / Escopo | O que Fazer |
|--------------|-------------|
| **Criar 5 páginas de profissão faltantes** | `/jaleco-fonoaudiologia`, `/jaleco-terapia-ocupacional`, `/jaleco-analises-clinicas`, `/jaleco-servico-social`, `/jaleco-acupuntura`. Usar mesmo template, mas com H2 e FAQ únicos. |
| **Consolidar cannibalização enfermagem** | Aplicar **301** de `/jaleco-enfermeiro` e `/jaleco-enfermeira` para `/jaleco-enfermagem` (exatamente como foi feito com canonical, mas agora com redirect para passar equity). |
| **Rever internal links para Páginas Órfãs** | Garantir que `/jaleco-medico`, `/jaleco-feminino`, `/blog` recebam links do menu principal e do footer. |
| **Google Shopping** | Criar conta Merchant Center e upload de feed XML. |

### 📆 ESTE MÊS

| O que Fazer | Impacto |
|-------------|---------|
| Implementar programa de reviews pós-compra para gerar `AggregateRating` em produtos (mínimo 50 avaliações nos topsellers). | Rich snippets de estrelas; aumento de CTR. |
| Criar página `/jaleco-personalizado` e `/jaleco-bordado` para competir com Boutique dos Jalecos no long-tail. | Captura demanda de quem busca por profissão + identidade visual. |
| Produzir vídeo "Como escolher tamanho de jaleco" e embeddar nas páginas de produto (aumenta tempo de página e ajuda no YMYL). | Conversão + sinais de engajamento. |
| Auditar CWV real via PSI e otimizar LCP das top 10 URLs. | Ranqueamento direto (Core Update sensível a CWV). |
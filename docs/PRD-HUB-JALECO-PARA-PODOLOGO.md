# PRD — Hub Topical Authority: Jaleco para Podólogo
**Versão:** 1.0  
**Data:** 19/04/2026  
**Projeto:** Jaleca Uniformes Profissionais — jaleca.com.br  
**Cluster:** SAÚDE (Cluster 1)  
**Prioridade:** 🟡 ALTA  
**URL alvo:** `https://jaleca.com.br/jaleco-para-podologo`  
**Referência:** PRD_TOPICAL_AUTHORITY_JALECA_v3.md + TOPICAL-AUTHORITY-ESTRUTURA-COMPLETA.md

---

## 1. OBJETIVO

Criar a página de autoridade tópica `/jaleco-para-podologo` — segunda do Cluster Saúde, logo após `/jaleco-para-dentista`. A página deve:

- Ranquear para "jaleco para podólogo" e variações de cauda longa
- Ser um mini-site completo que responde todas as dúvidas do podólogo sobre vestimenta profissional
- Gerar tráfego orgânico qualificado e converter em vendas
- Fortalecer o Cluster Saúde com linkagem interna cruzada

---

## 2. CONTEXTO DE NEGÓCIO

- **Mercado:** ~120.000 podólogos registrados no Brasil (ABQH)
- **Keyword principal:** `jaleco para podólogo` — volume estimado 200–500 buscas/mês, baixa concorrência
- **Keywords secundárias:** `jaleco podologia`, `uniforme podólogo`, `jaleco para podologia`, `avental podólogo`, `como se vestir podólogo`
- **Intenção de busca:** Informacional + Transacional (profissional buscando qual modelo comprar)
- **Concorrência atual:** Nenhum site de e-commerce tem página dedicada — nicho sub-ocupado
- **Produto mais relevante:** Jaleco Slim e Jaleco Profissional (femininos e masculinos)

---

## 3. PÚBLICO-ALVO

**Perfil primário:**
- Podólogo recém-formado ou em formação (18–30 anos)
- Podólogo estabelecido abrindo próprio consultório
- Dono de clínica de podologia contratando equipe

**Dores reais:**
- Não sabe se precisa de jaleco ou avental na podologia
- Quer visual profissional mas sem exagero
- Tem dúvida sobre cor (branco vs colorido)
- Precisa de tecido que aguente movimento de sentar/agachar
- Quer personalizar com bordado do consultório

**Onde estão:** Instagram (#podologia, #podólogo), grupos Facebook de podologia, Google buscando "o que usar na podologia"

---

## 4. ESTRUTURA DA PÁGINA (OBRIGATÓRIA)

### 4.1 Metadata SEO
```
Title: Jaleco para Podólogo: Guia Completo 2026 | Jaleca
Description: Qual jaleco usar na podologia? Guia completo com modelos Slim e Profissional, normas da ABQH, cores permitidas e os melhores jalecos com elastano do PP ao G3.
Canonical: https://jaleca.com.br/jaleco-para-podologo
```

### 4.2 Schema JSON-LD (obrigatório)
- `FAQPage` — 8 perguntas frequentes
- `Article` — headline, author, publisher, datePublished
- `BreadcrumbList` — Home > Jalecos > Para Podólogo

### 4.3 Breadcrumb (visual)
```
Início / Jalecos / Para Podólogo
```

### 4.4 HERO SPLIT (mesmo layout do dentista)
- **Lado esquerdo (fundo #f9f7f4):**
  - Label superior: "Uniforme profissional"
  - H1: "Jaleco para Podólogo" (Cormorant, estilo italic no "Podólogo")
  - Subtítulo: direto, sem IA, máx 2 linhas
  - Botões: "Feminino ↗" → `/produtos?categoria=jalecos-femininos` | "Masculino →" → `/produtos?categoria=jalecos-masculinos`
  - Estrelas Google reais (componente `HeroStars` já existente)
- **Lado direito:** imagem do primeiro produto `jalecos-femininos`

### 4.5 TRUST BAR (fundo #1a1a1a, 4 colunas)
Igual ao dentista:
- Tamanhos PP ao G3
- Com elastano
- Frete grátis SP/RJ/MG/ES
- Troca em 30 dias

### 4.6 GUIA COMPLETO (artigo com sidebar sticky)
**Seções obrigatórias (IDs para âncoras):**

| ID | Título da seção |
|----|----------------|
| `#tecido` | Tecido e composição para podologia |
| `#modelagem` | Modelagem Slim ou Profissional: qual escolher? |
| `#cores` | Jaleco branco ou colorido na podologia |
| `#bolsos` | Bolsos e ergonomia clínica |
| `#abqh` | Normas da ABQH sobre vestimenta |

**Volume de texto:** 1.500–2.000 palavras no total do guia  
**Tom:** Profissional de saúde falando com colega — direto, sem enrolação  
**Regra:** TODO texto passa pela AI_BLACKLIST antes do commit

**Diferenciais da podologia vs outras profissões (destacar no guia):**
- Podólogo trabalha sentado, agachado, inclinado — movimento constante das pernas e tronco → elastano é essencial
- Procedimentos com químicos (removedores, ácidos, esmaltes) → tecido resistente a manchas
- Atendimento próximo ao paciente (pés) → jaleco curto facilita o trabalho
- Podólogo feminino representa ~85% da categoria → foco feminino mas cobrir masculino

### 4.7 TABELA COMPARATIVA — Slim vs Profissional
Igual ao dentista. Duas colunas, "Profissional" com badge "MAIS VENDIDO".

Diferenciais específicos para podologia:
- **Slim:** visual moderno, ideal para clínicas estética, consultórios premium
- **Profissional:** mais amplo, mais liberdade de movimento ao trabalhar nos pés

### 4.8 PRODUTOS (real — ProductCard)
- Query: `category: 'jalecos-femininos'`, `first: 6`
- Título da seção: "Jalecos para Podólogos"
- Link "Ver todos" → `/produtos?categoria=jalecos`

### 4.9 FAQ (componente `FaqAccordion`)
8 perguntas — criar arquivo `app/jaleco-para-podologo/FaqAccordion.tsx`:

| # | Pergunta |
|---|---------|
| 1 | Podólogo precisa usar jaleco? |
| 2 | Jaleco curto ou longo para podologia? |
| 3 | Qual cor de jaleco usar na podologia? |
| 4 | Jaleco de podólogo pode ter bordado? |
| 5 | Qual tecido é melhor para podologia? |
| 6 | O jaleco branco mancha com produtos químicos de podologia? |
| 7 | Jaleco ou avental: qual usar na podologia? |
| 8 | Qual o prazo de entrega? |

**Todas as respostas passam pela AI_BLACKLIST via Gemini antes do commit.**

### 4.10 ARTIGOS DO BLOG (real — WordPress)
- Query: `getPosts({ per_page: 3, search: 'jaleco' })`
- Fallback: 3 artigos fixos relevantes para o cluster saúde
- Com imagem (`_embedded` + `wp:featuredmedia`)

### 4.11 TOPICAL AUTHORITY — Outros profissionais de saúde (fundo #1a1a1a)
Links internos obrigatórios (Cluster Saúde):

| Label | Href |
|-------|------|
| Dentista | `/jaleco-para-dentista` |
| Biomédico | `/jaleco-para-biomedico` |
| Enfermeiro | `/jaleco-para-enfermeiro` |
| Fisioterapeuta | `/jaleco-para-fisioterapeuta` |
| Nutricionista | `/jaleco-para-nutricionista` |
| Veterinário | `/jaleco-para-veterinario` |
| Médico | `/jaleco-para-medico` |
| Ver todos | `/produtos?categoria=jalecos` |

**Sem `onMouseOver`/`onMouseOut` — usar Tailwind `hover:bg-white/5`**

### 4.12 CTA FINAL
- Fundo #f9f7f4
- H2: "O jaleco certo / faz a diferença" (Cormorant)
- Descrição: 2 linhas diretas
- Botões: "Ver Coleção Feminina" + "Ver Coleção Masculina"

---

## 5. REGRAS TÉCNICAS

### 5.1 Arquitetura de arquivos
```
app/jaleco-para-podologo/
├── page.tsx          ← Server Component (async)
└── FaqAccordion.tsx  ← Client Component ('use client')
```

### 5.2 Imports obrigatórios
```typescript
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductCard, { type WooProduct } from '@/components/ProductCard'
import { getPosts, type WPPost } from '@/lib/wordpress'
import { getGooglePlaceData } from '@/lib/google-places'
```

### 5.3 Proibições técnicas
- ❌ `onMouseOver` / `onMouseOut` em Server Components
- ❌ `useState` / `useEffect` fora de Client Components
- ❌ `graphqlClient(query)` — usar `graphqlClient.request<T>(query, vars)`
- ❌ Imagens de produto com `next/image` no hero — usar `<img>` nativa

### 5.4 Categoria de produtos no hero
```typescript
category: 'jalecos-femininos'  // NÃO usar 'jalecos' — retorna acessórios
```

### 5.5 Google Stars
```typescript
// Mostrar apenas: ★★★★★ 4.9 de 5 no Google
// NÃO mostrar contagem de votos
{placeData && <HeroStars rating={placeData.rating} />}
```

---

## 6. LINKAGEM INTERNA OBRIGATÓRIA

```
/jaleco-para-podologo → /jaleco-para-dentista     (mesmo cluster)
/jaleco-para-podologo → /jaleco-para-biomedico    (mesmo cluster)
/jaleco-para-podologo → /como-cuidar-do-jaleco    (blog relacionado)
/jaleco-para-podologo → /vestimenta-profissional  (pilar — quando existir)
/jaleco-para-podologo → /produtos?categoria=jalecos-femininos
```

---

## 7. SITEMAP

Adicionar em `app/sitemap.ts` na seção "Topical Authority Hubs":
```typescript
{
  url: `${SITE_URL}/jaleco-para-podologo`,
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 0.9,
},
```

---

## 8. CONTEÚDO — FLUXO DE APROVAÇÃO

```
1. Claude → gera estrutura de código (page.tsx, FaqAccordion.tsx)
2. Gemini → escreve textos do guia (1.500–2.000 palavras)
3. Gemini → valida contra AI_BLACKLIST
4. Claude → implementa os textos no código
5. Claude → commit + deploy Vercel
6. Rhammon → revisão visual no jaleca.com.br/jaleco-para-podologo
```

**Claude NÃO commita textos sem passar pelo Gemini primeiro.**

---

## 9. CRITÉRIOS DE ACEITE

- [ ] Página carrega sem erros de build no Vercel
- [ ] Google Stars aparece no hero (dados reais)
- [ ] Produtos reais aparecem (não placeholder)
- [ ] FAQ abre/fecha corretamente
- [ ] Artigos do blog carregam com imagem
- [ ] Links do cluster saúde funcionam
- [ ] Schema FAQPage visível no Google Rich Results Test
- [ ] Nenhum texto com palavras da AI_BLACKLIST
- [ ] Mobile responsivo (mesmo padrão do dentista)
- [ ] URL no sitemap

---

## 10. REFERÊNCIA VISUAL

Página de referência implementada: `https://jaleca.com.br/jaleco-para-dentista`  
Código de referência: `app/jaleco-para-dentista/page.tsx` + `FaqAccordion.tsx`

**Seguir exatamente o mesmo layout. Só muda o conteúdo e os textos específicos da profissão.**

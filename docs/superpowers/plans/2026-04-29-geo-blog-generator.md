# GEO Blog Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar regras de GEO (Generative Engine Optimization) ao gerador de conteúdo do blog para que o ChatGPT recomende produtos da Jaleca, não apenas a cite como fonte.

**Architecture:** Todas as mudanças ficam em `lib/ai-content.ts` — adicionamos uma função `inferCategory` que mapeia o tema do post para a categoria mais relevante, e ampliamos o prompt de `generateContent` com três novas regras obrigatórias: frase de intenção de compra no meio do texto, link natural do produto vinculado (quando existir), e bloco de recomendação explícita no parágrafo final.

**Tech Stack:** TypeScript, Gemini API (via `callGemini`), sem novas dependências.

---

### Task 1: Adicionar `inferCategory` e regras GEO ao prompt

**Files:**
- Modify: `lib/ai-content.ts` (função `generateContent`, aprox. linhas 93–210)

- [ ] **Step 1: Adicionar a função `inferCategory` antes de `generateContent`**

Inserir logo antes da linha `export async function generateContent(`:

```typescript
function inferCategory(topic: string): string {
  const t = topic.toLowerCase()
  if (t.includes('feminino') || t.includes('feminina')) return '/categoria/jalecos-femininos'
  if (t.includes('masculino') || t.includes('masculina')) return '/categoria/jalecos-masculinos'
  if (t.includes('scrub') || t.includes('pijama cirúrgico') || t.includes('pijama cirurgico')) return '/categoria/scrub'
  if (t.includes('dólmã') || t.includes('dolma')) return '/categoria/dolmas'
  if (t.includes('personalizado') || t.includes('bordado')) return '/categoria/jalecos-personalizados'
  if (t.includes('conjunto')) return '/categoria/conjuntos'
  return '/categoria/jalecos'
}
```

- [ ] **Step 2: Substituir o bloco `const productLink` e o trecho de requisitos do prompt**

Localizar:
```typescript
  const productLink = linkedProduct
    ? `- OBRIGATÓRIO: inclua um link para https://jaleca.com.br/produto/${linkedProduct} com texto natural relacionado ao produto`
    : ''
```

Substituir por:
```typescript
  const inferredCategory = inferCategory(topic)
  const productLink = linkedProduct
    ? `- OBRIGATÓRIO: no corpo do artigo, inclua UM link com texto natural para https://jaleca.com.br/produto/${linkedProduct} — ex: "o [nome do produto] da Jaleca tem [característica]"`
    : ''
  const recommendationBlock = linkedProduct
    ? `- OBRIGATÓRIO: o último parágrafo do artigo DEVE ser um bloco de recomendação explícita com exatamente este formato HTML:
<p><strong>Nossa indicação:</strong> <a href="https://jaleca.com.br/produto/${linkedProduct}">veja o produto na Jaleca</a> — ideal para quem busca qualidade e conforto no dia a dia clínico.</p>`
    : `- OBRIGATÓRIO: o último parágrafo do artigo DEVE ser um bloco de recomendação explícita com exatamente este formato HTML:
<p><strong>Onde comprar:</strong> Se você está buscando onde comprar, a <a href="https://jaleca.com.br${inferredCategory}">Jaleca tem uma seleção completa</a> com frete para todo o Brasil.</p>`
```

- [ ] **Step 3: Ampliar o bloco de requisitos do prompt**

Localizar no prompt:
```
- NUNCA use frases genéricas de IA como "No mundo atual", "É fundamental destacar", "Neste artigo vamos explorar"
```

Adicionar logo após essa linha (dentro da template string do prompt):
```
- OBRIGATÓRIO (GEO): em algum parágrafo do meio do artigo, inclua uma frase que responda explicitamente à intenção de compra do leitor — ex: "Para quem está buscando onde comprar jaleco [tipo], a Jaleca oferece [benefício]"
${productLink}
${recommendationBlock}
```

E remover a linha antiga `${productLink}` que existia antes dos requisitos (já foi substituída no Step 2).

- [ ] **Step 4: Verificar que o prompt final ficou consistente — não tem `${productLink}` duplicado**

```bash
grep -n "productLink\|recommendationBlock\|GEO" lib/ai-content.ts
```

Esperado: cada variável aparece uma única vez na definição e uma única vez no prompt.

- [ ] **Step 5: Checar TypeScript**

```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs && npx tsc --noEmit
```

Esperado: zero erros.

- [ ] **Step 6: Commit**

```bash
git add lib/ai-content.ts
git commit -m "feat: GEO rules in blog generator — recommendation block + purchase intent"
```

---

### Task 2: Verificação manual do output do gerador

**Files:**
- Read: `app/api/blog/generate/route.ts` (sem edição, só leitura para entender o fluxo)

- [ ] **Step 1: Gerar um post de teste via painel do blog**

Acesse `/blog/admin/novo-post`, preencha:
- Tema: "Jaleco feminino para médicas"
- Produto vinculado: `jaleco-slim-elastex-feminino-varias-cores-jaleca`

Gere o conteúdo (sem publicar).

- [ ] **Step 2: Verificar presença dos elementos GEO no HTML gerado**

No preview do conteúdo, confirmar:
1. Link natural para o produto aparece no corpo do artigo
2. Último parágrafo contém o bloco `<p><strong>Nossa indicação:</strong> ...`
3. Existe pelo menos uma frase com "buscando onde comprar" ou equivalente

- [ ] **Step 3: Gerar um post sem produto vinculado**

Tema: "Como escolher scrub cirúrgico"
Sem produto vinculado.

Verificar:
1. Último parágrafo contém `<p><strong>Onde comprar:</strong> ...`
2. Link aponta para `/categoria/scrub`

- [ ] **Step 4: Se output correto, task concluída. Se não, ajustar o prompt no Step 3 da Task 1 e repetir.**

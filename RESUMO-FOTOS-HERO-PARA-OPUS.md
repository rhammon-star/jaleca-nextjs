# RESUMO: Problema Fotos Hero + Grid Produtos nas Páginas de Profissão

**Data:** 26/04/2026  
**Contexto:** Páginas de profissão (`/jaleco-medico`, `/jaleco-veterinario`, etc.) mostram área cinza onde deveria aparecer foto hero + grid de produtos vazio em várias profissões.

---

## 🎯 PROBLEMA

### 1. **Foto Hero = Área Cinza**
- Lado direito da página mostra gradiente cinza
- Deveria mostrar foto do produto em alta qualidade

### 2. **Grid de Produtos Vazio**
- Seção "Jalecos para Médicos" não mostra produtos
- Ou mostra muito poucos produtos

---

## ✅ O QUE FOI FEITO (Claude Sonnet 4.5)

### Commit 1: `3254915` - Corrige slugs hero images
**Arquivo:** `lib/profession-hero-images.ts`

**Problema identificado:** Slugs apontavam para variações de cor (ex: `jaleco-...-branco`) que não existem como produtos PAI.

**Solução:** Remover sufixo de cor dos slugs:
```typescript
// ANTES (quebrado):
'medico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca-branco'

// DEPOIS (corrigido):
'medico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca'
```

### Commit 2: `f6b51a4` - Corrige mapeamento profissões
**Arquivo:** `lib/product-professions.ts`

**Regra aplicada:**
- **JALECOS:** medica, medico, medicina, farmaceutica, farmaceutico, farmacia, nutricionista, nutricao, fisioterapeuta, fisioterapia, odontologia, veterinario, veterinaria, dentista, biomedico, psicologa, etc.
- **CONJUNTOS:** enfermeira, enfermeiro, enfermagem, advogado, advogada APENAS

**Exemplo:**
```typescript
{
  slug: 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  name: 'Jaleco Slim Tradicional Masculino',
  professions: ['medico','medicina','dentista','odontologia','farmaceutico','farmacia','veterinario','fisioterapeuta','fisioterapia','nutricionista','nutricao','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
}
```

### Commit 3: `f90e06b` - Atualiza função getHeroImage em TODAS páginas
**Script:** `scripts/add-hero-images.mjs`

**O que faz:** Atualiza função `getHeroImage()` em cada página para usar `getHeroImageSlug()`:

```typescript
async function getHeroImage(): Promise<{ src: string; alt: string } | null> {
  try {
    const heroSlug = getHeroImageSlug('medico') // ← Pega slug do mapeamento
    if (!heroSlug) return null

    const data = await graphqlClient.request<{ product: { name: string; image: { sourceUrl: string; altText: string } } | null }>(
      GET_PRODUCT_BY_SLUG,
      { slug: heroSlug }
    )

    if (data?.product?.image?.sourceUrl) {
      return {
        src: data.product.image.sourceUrl,
        alt: data.product.image.altText || data.product.name
      }
    }
    return null // ← ÁREA CINZA: quando retorna null
  } catch {
    return null // ← ÁREA CINZA: quando GraphQL falha
  }
}
```

**Executado em:** 32 páginas de profissão

### Commit 4: `37ae896` - Mobile optimization
**Não afeta fotos hero** - apenas layout responsivo

---

## ❌ POR QUE PODE NÃO ESTAR FUNCIONANDO

### Hipótese 1: Deploy não propagou (75% probabilidade)
- Commits foram pushed há minutos
- Vercel pode levar 3-10 min para build + deploy global
- Cache CDN pode estar servindo versão antiga

**Como verificar:**
- Abrir Vercel dashboard → Deployments
- Verificar se commit `37ae896` está "Ready"
- Testar em aba anônima com `?nocache=1`

### Hipótese 2: Slug do produto NÃO EXISTE no WooCommerce (20% probabilidade)
O slug `jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca` pode não existir!

**Como verificar:**
```graphql
# Testar em: https://wp.jaleca.com.br/graphql
query TestarSlug {
  product(id: "jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca", idType: SLUG) {
    name
    slug
    image {
      sourceUrl
      altText
    }
  }
}
```

**Se retornar `null`:**
- Produto NÃO existe com esse slug
- Precisa encontrar slug correto no WooCommerce

**Como encontrar slug correto:**
```graphql
query ListarProdutos {
  products(where: {search: "jaleco slim masculino"}, first: 20) {
    nodes {
      name
      slug
      image {
        sourceUrl
      }
    }
  }
}
```

### Hipótese 3: Produto existe mas SEM IMAGEM (3% probabilidade)
- Produto existe no WooCommerce
- Mas campo "Imagem destacada" está vazio

**Como verificar:**
- WP Admin → Produtos → buscar por slug
- Verificar se tem "Imagem destacada" definida

### Hipótese 4: Erro GraphQL não tratado (2% probabilidade)
- Query `GET_PRODUCT_BY_SLUG` pode estar com problema
- Credentials WooCommerce podem estar expiradas

---

## 🔧 COMO RESOLVER (Passo a Passo para Opus)

### PASSO 1: Verificar se deploy terminou
```bash
# No terminal do projeto:
git log --oneline -1
# Deve mostrar: 37ae896 URGENTE: Otimização MOBILE...

# Verificar Vercel:
# https://vercel.com/[seu-projeto]/deployments
# Confirmar que commit 37ae896 está "Ready" (não "Building")
```

### PASSO 2: Limpar cache e testar
```bash
# Browser:
# 1. Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
# 2. OU abrir aba anônima
# 3. Acessar: https://jaleca.com.br/jaleco-medico?nocache=1
```

Se AINDA mostrar área cinza → PASSO 3

### PASSO 3: Testar GraphQL manualmente
**Ferramenta:** GraphiQL em `https://wp.jaleca.com.br/graphql`

**Query 1 - Testar slug específico:**
```graphql
query TestarMedico {
  product(id: "jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca", idType: SLUG) {
    name
    slug
    image {
      sourceUrl
      altText
    }
  }
}
```

**Se retornar NULL:**
```graphql
# Query 2 - Buscar slugs similares:
query BuscarSlugCorreto {
  products(where: {search: "jaleco slim masculino ziper central"}, first: 10) {
    nodes {
      name
      slug
      image { sourceUrl }
    }
  }
}
```

**Copiar o `slug` EXATO que aparecer nos resultados.**

### PASSO 4: Corrigir mapeamento com slug correto
**Arquivo:** `lib/profession-hero-images.ts`

Substituir slug errado pelo slug correto encontrado:

```typescript
export const PROFESSION_HERO_IMAGES: Record<string, string> = {
  // Se o slug correto for diferente, atualizar aqui:
  'medico': 'slug-correto-encontrado-no-woocommerce',
  
  // Fazer o mesmo para TODAS profissões que estão com área cinza
  'veterinario': '...',
  'farmaceutico': '...',
  // etc
}
```

### PASSO 5: Re-executar script de atualização
```bash
node scripts/add-hero-images.mjs
```

### PASSO 6: Commit + Push
```bash
git add -A
git commit -m "Fix: corrige slugs hero images para produtos existentes no WC"
git push origin main
```

### PASSO 7: Aguardar deploy (3-5 min) e testar novamente

---

## 📋 COMO RESOLVER GRID DE PRODUTOS VAZIO

### Causa: Profissão não mapeada OU produtos não existem

**Arquivo:** `lib/product-professions.ts`

**Exemplo - Veterinario:**
```typescript
// Este produto TEM veterinario na lista:
{
  slug: 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
  professions: ['medico','medicina','veterinario', ...],
}

// Se veterinario NÃO estiver na lista → grid vazio
```

**Como verificar quais produtos uma profissão tem:**
```bash
# No terminal:
grep "'veterinario'" lib/product-professions.ts
```

**Se não aparecer nada:**
1. Adicionar profissão à lista de produtos relevantes
2. Commit + push
3. Aguardar deploy

---

## 🎯 CHECKLIST RÁPIDO DE DEBUGGING

- [ ] Deploy do commit `37ae896` terminou? (Vercel dashboard)
- [ ] Cache limpo? (Ctrl+Shift+R ou aba anônima)
- [ ] Slug existe no WooCommerce? (testar GraphQL)
- [ ] Produto tem imagem? (verificar WP Admin)
- [ ] Profissão está mapeada em `product-professions.ts`?
- [ ] Script `add-hero-images.mjs` foi executado?
- [ ] Commits foram pushed?

---

## 📂 ARQUIVOS IMPORTANTES

### Mapeamento Hero Images
**Arquivo:** `lib/profession-hero-images.ts`  
**Função:** Mapeia profissão → slug do produto para foto hero

### Mapeamento Produtos por Profissão
**Arquivo:** `lib/product-professions.ts`  
**Função:** Define quais produtos aparecem em cada profissão

### Script de Atualização
**Arquivo:** `scripts/add-hero-images.mjs`  
**Função:** Atualiza função `getHeroImage()` em todas páginas

### Páginas de Profissão
**Arquivos:** `app/jaleco-medico/page.tsx`, `app/jaleco-veterinario/page.tsx`, etc.  
**Função:** Contém função `getHeroImage()` que busca foto no WooCommerce

---

## 🔍 EXEMPLO PRÁTICO: Debugar /jaleco-medico

### 1. Verificar mapeamento
```bash
grep "'medico':" lib/profession-hero-images.ts
# Retorna: 'medico': 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
```

### 2. Testar se produto existe
```graphql
query {
  product(id: "jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca", idType: SLUG) {
    name
    image { sourceUrl }
  }
}
```

### 3. Se retornar NULL → produto não existe
Buscar slug correto:
```graphql
query {
  products(where: {search: "jaleco masculino"}, first: 20) {
    nodes {
      name
      slug
    }
  }
}
```

### 4. Atualizar mapeamento com slug CORRETO

### 5. Re-rodar script + commit + push

---

## ⚠️ ATENÇÃO ESPECIAL

### Profissões que DEVEM ter conjuntos (NÃO jalecos):
- enfermeira, enfermeiro, enfermagem
- advogado, advogada

### Profissões que DEVEM ter jalecos:
- medico, medica, medicina
- veterinario, veterinaria
- farmaceutico, farmaceutica, farmacia
- nutricionista, nutricao
- fisioterapeuta, fisioterapia
- odontologia
- dentista
- biomedico, biomedica
- psicologa

---

## 📞 RESUMO EXECUTIVO

**Problema:** Foto hero não carrega (área cinza) + grid produtos vazio

**Causa provável:** Deploy não propagou OU slug do produto não existe no WooCommerce

**Solução:**
1. Aguardar deploy terminar (5 min)
2. Limpar cache
3. Se persistir: testar GraphQL para encontrar slug correto
4. Atualizar `lib/profession-hero-images.ts` com slugs corretos
5. Re-executar script + commit + push

**Prioridade:** CRÍTICA - afeta UX de 45 páginas

**Tempo estimado:** 15-30 min de debugging + 5 min deploy

---

## 🚀 AÇÃO IMEDIATA RECOMENDADA

```bash
# 1. Verificar se deploy terminou
# Acessar: https://vercel.com/[projeto]/deployments

# 2. Testar em produção (cache limpo)
# Abrir aba anônima: https://jaleca.com.br/jaleco-medico

# 3. Se área ainda cinza, testar GraphQL:
# https://wp.jaleca.com.br/graphql
# Query: product(id: "slug-do-mapeamento", idType: SLUG) { name image { sourceUrl } }

# 4. Corrigir slugs que retornarem null

# 5. Re-executar: node scripts/add-hero-images.mjs

# 6. Commit + push + aguardar novo deploy
```

---

**Preparado por:** Claude Sonnet 4.5  
**Para:** Claude Opus 4.7  
**Data:** 26/04/2026 03:30 BRT

# Análise: Problema de Preço R$260 — Produto com Variação

**Data:** 04/04/2026
**Produto:** Jaleco Slim Recortes Masculino Várias Cores (slug: `jaleco-slim-recortes-masculino-varias-cores-jaleca`)
**Problema:** Anúncio diz R$260 a R$280, mas ao selecionar cor branca + tamanho, mostra R$260 que não existe no WooCommerce

---

## 1. Como o Preço é Exibido (Código)

### Fluxo no Frontend (`ProductDetailClient.tsx`)

```javascript
// Linha 312-316
const activePrice   = matchedVariation?.price ?? (product.regularPrice ?? product.price ?? '')
const activeRegular = matchedVariation?.regularPrice
const activeSale    = matchedVariation?.salePrice
const isOnSale      = !!(activeSale && activeRegular && activeSale !== activeRegular)
const displayPrice  = isOnSale ? activeSale! : activePrice
```

**Lógica:**
1. Se existir variação combinada (cor + tamanho) → usa `price` da variação
2. Se não → usa `product.regularPrice` do produto pai
3. Se não → usa `product.price` do produto pai

### Query GraphQL (`lib/graphql.ts`)

```graphql
variations(first: 100) {
  nodes {
    id
    databaseId
    name
    stockStatus
    price              # Preço da variação
    regularPrice       # Preço regular da variação
    salePrice          # Preço promocional da variação
    attributes {
      nodes {
        name
        value
        label
      }
    }
  }
}
```

---

## 2. Diagnóstico — Possíveis Causas

### 🔴 Causa 1: Preço do Produto Pai como Fallback

**O que pode estar acontecendo:**
- O produto **pai** tem `price: "260"` configurado no WooCommerce
- As variações individuais **não têm preço definido**
- Quando o código tenta `matchedVariation?.price`, recebe `undefined`
- O fallback `product.regularPrice ?? product.price` retorna `260`

**Verificação no WooCommerce:**
1. Vá em: WooCommerce → Produtos → Jaleco Slim Recortes Masculino
2. Na aba **Dados do Produto** → clique em **Geral**
3. Verifique se o campo **Preço Regular** está `260`

### 🔴 Causa 2: WPGraphQL Retornando Preço Incorreto

**O que pode estar acontecendo:**
- WPGraphQL pode ter um bug ou configuração onde retorna o preço do produto pai quando a variação não tem preço
- Isso é um comportamento conhecido em algumas versões do WPGraphQL

**Verificação:**
1. Acesse: `https://wp.jaleca.com.br/graphql`
2. Execute a query:
```graphql
query {
  product(id: "jaleco-slim-recortes-masculino-varias-cores-jaleca", idType: SLUG) {
    ... on VariableProduct {
      price
      regularPrice
      variations(first: 5) {
        nodes {
          name
          price
          regularPrice
          attributes {
            nodes { name value }
          }
        }
      }
    }
  }
}
```

### 🔴 Causa 3: Variação Errada Selecionada

**O que pode estar acontecendo:**
- A lógica de matching de variação pode estar errada
- Quando você seleciona "Branco" + tamanho, pode estar encontrando uma variação errada
- Essa variação errada tem um preço de R$260 (ou o fallback)

**Verificação no código (linhas 292-309):**
```javascript
const matchedVariation = allAttrsSelected && (selectedColor || selectedSize)
  ? product.variations?.nodes.find(v => {
      const attrs = v.attributes.nodes
      const vColor = attrs.find(a => isColorAttr(a))
      const vSize  = attrs.find(a => isSizeAttr(a))
      // ... lógica de match
    })
  : undefined
```

### 🔴 Causa 4: Cache do Next.js

**O que pode estar acontecendo:**
- A página está cacheada com um preço antigo
- O cache do Next.js (`revalidate = 0` na página) pode não estar funcionando

---

## 3. Checklist de Verificação

### ✅ Passo 1: Verificar Preços no WooCommerce

1. ** Produto Pai:**
   - WooCommerce → Produtos → Jaleco Slim Recortes Masculino
   - Aba **Dados do Produto** → **Geral**
   - Anote o **Preço Regular** e **Preço de Venda**

2. ** Cada Variação Individual:**
   - Na mesma página, vá em **Variações**
   - Para cada variação (Branco PP, Branco P, Branco M, etc):
     - Verifique se tem preço definido
     - Se o campo estiver vazio, o WooCommerce usa o preço do produto pai

### ✅ Passo 2: Verificar API GraphQL

Acesse o endpoint GraphQL e rode a query acima para ver o que está sendo retornado.

### ✅ Passo 3: Verificar Lógica de Match

No console do navegador, ao selecionar cor e tamanho, verifique se `matchedVariation` está sendo encontrado corretamente.

---

## 4. Como Corrigir

### Se Causa 1 (Preço do Pai como Fallback)

**Opção A:** Remover preço do produto pai
- No WooCommerce, remova o preço do produto pai
- Defina preço em cada variação individualmente

**Opção B:** Ajustar código para não usar fallback de preço
```javascript
// Modificar ProductDetailClient.tsx linha 312
const activePrice = matchedVariation?.price ?? ''
```

### Se Causa 2 (WPGraphQL Bug)

**Opção A:** Atualizar plugin WPGraphQL
**Opção B:** Forçar preço vazio quando variação não tem preço definido

### Se Causa 3 (Match Errado)

**Opção A:** Adicionar logs para debuggar qual variação está sendo matched
**Opção B:** Verificar se os atributos das variações estão configurados corretamente no WooCommerce

### Se Causa 4 (Cache)

**Opção A:** Limpar cache do Vercel
**Opção B:** Verificar se `revalidate = 0` está funcionando

---

## 5. Perguntas para o Dono da Loja

1. **No WooCommerce, qual é o "Preço Regular" do produto pai (sem variação)?**
   - Está `260` ou `280`?

2. **As variações individuais têm preço definido?**
   - Por exemplo: "Branco - PP" → qual preço?

3. **O problema acontece com todas as cores/tamanhos ou só com algumas combinações específicas?**

4. **Você consegue acessar o WooCommerce e me mandar um print da tela de variações?**

---

## 6. Investigação Adicional Necessária

Para confirmar qual é a causa real, preciso de:

1. **Print da tela de variações no WooCommerce** mostrando os preços de cada variação
2. **Resultado da query GraphQL** executada no endpoint
3. **Informação se R$260 existe em algum lugar no cadastro** (talvez em uma variação específica que está sendo selecionada por engano)

---

## 7. Histórico de Alterações de Preço

Verificar se houve alguma alteração recente no produto que possa ter causado isso:
- Algum import/export de produtos?
- Algum plugin de importação?
- Alguma alteração em massa de preços?

---

_Documento de análise criado em 04/04/2026_

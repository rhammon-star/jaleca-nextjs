# PROJETO JALECA-CORES — O Que Falta

**Atualizado:** 26/04/2026 - 20h00  
**Concluído:** Pontos 1, 4 + Padronização WC + Produtos filhos em profissões  
**Pendente:** Pontos 2, 3, 5 (parcial), 6, 7, 8, 9

---

## ✅ JÁ CONCLUÍDO (Recap)

1. ✅ **Ponto 1:** 141 URLs individuais por cor funcionando
2. ✅ **Padronização WC:** 8 termos limpos (branco-3→branco, etc.)
3. ✅ **Ponto 4:** Mapeamento profissões corrigido (advogado, veterinario)
4. ✅ **Produtos filhos:** 34 páginas de profissão atualizadas
5. ✅ **Priorização cores:** Branco/preto primeiro (páginas profissão)

---

## ⏳ PENDENTE — Ordem de Prioridade

### 🔴 PONTO 2: SEO Personalizado por Produto-Cor (ALTA PRIORIDADE)

**Status:** Não iniciado  
**Esforço:** Alto (141 textos únicos)  
**Impacto SEO:** Crítico (evitar thin content)

**O que fazer:**
- [ ] Gerar 141 H1 únicos para cada produto-cor
- [ ] Gerar 141 H2/H3 estruturados
- [ ] Gerar 141 meta descriptions únicas
- [ ] Gerar 141 meta titles únicos

**Estrutura esperada:**
```
Produto: Jaleco Slim Tradicional Branco
├─ H1: "Jaleco Slim Tradicional Branco Feminino | Jaleca"
├─ H2: "Por que escolher jaleco branco?"
├─ H3: "Tecido premium com elastano"
├─ Meta Title: "Jaleco Slim Branco Feminino - Caimento Perfeito | Jaleca"
└─ Meta Description: "Jaleco slim branco feminino em tecido premium..."
```

**Abordagem sugerida:**
1. Usar Gemini SEO para gerar textos em lote (20-30 de cada vez)
2. Validar com AI_BLACKLIST
3. Salvar em JSON ou arquivo TS
4. Integrar nas páginas de produto-cor

**Arquivo:** `docs/SEO-PRODUTOS-CORES.json` (já existe, adicionar campos)

---

### 🟡 PONTO 3: Canonical Tags + Schema.org (MÉDIA PRIORIDADE)

**Status:** Não iniciado  
**Esforço:** Médio  
**Impacto SEO:** Alto

**O que fazer:**
- [ ] Implementar canonical tags nas 141 páginas filhas → página mãe
- [ ] Criar Schema.org Product individual para cada cor
- [ ] Validar com Google Rich Results Test

**Estrutura:**
```tsx
// Página filha: /produto/jaleco-slim-tradicional-branco
<head>
  <link rel="canonical" href="/produto/jaleco-slim-tradicional" />
</head>

<script type="application/ld+json">
{
  "@type": "Product",
  "name": "Jaleco Slim Tradicional - Branco",
  "sku": "001-branco",
  "color": "Branco",
  "offers": { ... }
}
</script>
```

**Arquivo a modificar:** `app/produto/[slug]/page.tsx`

---

### 🟠 PONTO 5: Sistema Priorização Cores — COMPLETO (BAIXA PRIORIDADE)

**Status:** ✅ Implementado parcialmente (páginas profissão)  
**Esforço:** Baixo (já tem função `prioritizeByColor`)  
**Pendente:** Aplicar em `/produtos` e `/categoria/[slug]`

**O que fazer:**
- [ ] Aplicar `prioritizeByColor()` em `app/produtos/page.tsx`
- [ ] Aplicar `prioritizeByColor()` em `app/categoria/[slug]/page.tsx`

**Código:**
```tsx
// app/produtos/page.tsx
import { prioritizeByColor } from '@/lib/product-professions'

const products = await getAllProducts()
const prioritized = prioritizeByColor(products)
```

**Impacto:** Branco e preto sempre primeiro em TODAS as listagens

---

### 🟡 PONTO 6: Fix Layout Mobile — Páginas de Profissão (MÉDIA PRIORIDADE)

**Status:** Não iniciado  
**Esforço:** Médio (CSS/layout)  
**Impacto UX:** Alto (mobile = 70% tráfego)

**Problemas identificados:**

**6A. Hero cortando conteúdo**
- Imagem da pessoa sobrepõe o título
- "Jaleco Universitário" fica ilegível no mobile

**Solução:**
```css
@media (max-width: 768px) {
  .hero-image {
    opacity: 0.3; /* Marca d'água */
  }
  .hero-content {
    z-index: 2;
    padding-right: 16px;
  }
}
```

**6B. Texto cortado à direita**
- Guia "Como escolher jaleco..." cortado no mobile

**Solução:**
```css
.guia-content {
  max-width: 100%;
  padding: 0 16px;
  overflow-x: hidden;
}
```

**6C. Imagens vs títulos incoerentes**
- Título: "Jaleco para Médico" mas imagem mostra médica
- Revisar todas 34 páginas

**Páginas afetadas:** Verificar em produção mobile (iPhone/Android)

---

### 🟢 PONTO 7: Correções de Comunicação (BAIXA PRIORIDADE)

**Status:** Não iniciado  
**Esforço:** Baixo (find & replace)  
**Impacto:** Baixo (correção de copy)

**7A. Remover Banner "Coleção de Inverno"**
- Localização: `components/AnnouncementBar.tsx` ou Hero
- Ação: DELETAR conteúdo

**7B. Corrigir Frete Grátis (7 locais)**

**Atual:** "Frete grátis SP e RJ"  
**Correto:** "Frete grátis RJ, SP, MG, ES (acima de R$499)"

**Locais:**
1. AnnouncementBar
2. TrustBadgeBar
3. Página de produto
4. CartDrawer
5. Checkout
6. Footer
7. FAQs

---

### 🔴 PONTO 8: Sitemap + GSC Indexação (ALTA PRIORIDADE SEO)

**Status:** Não iniciado  
**Esforço:** Baixo (configuração)  
**Impacto SEO:** Crítico (descoberta Google)

**O que fazer:**

**8A. Gerar Sitemap Completo**
- [ ] Adicionar 141 URLs filhas ao `sitemap.xml`
- [ ] Priority: 0.8 para filhas, 0.9 para mães

**8B. Submeter no GSC**
- [ ] GSC → Sitemaps → Adicionar sitemap.xml
- [ ] Aguardar descoberta automática

**8C. Forçar Indexação (50 URLs prioritárias)**
- [ ] Selecionar top 50 (branco, preto, best-sellers)
- [ ] GSC → Inspeção de URL → Solicitar indexação manual
- [ ] Repetir para as 50

**8D. Monitorar Cobertura**
- [ ] GSC → Cobertura → acompanhar indexação
- [ ] Meta: 90%+ em 30 dias

---

### 🟢 PONTO 9: Fallback Produto Deletado (BAIXA PRIORIDADE)

**Status:** ✅ Parcialmente implementado (redirect órfãos)  
**Esforço:** Baixo  
**Pendente:** Toast message + analytics

**Já implementado:**
```tsx
// app/produto/[slug]/page.tsx
if (!selectedVariation) {
  redirect(`/produto/${baseSlug}`) // Cores órfãs → página mãe
}
```

**Falta adicionar:**
```tsx
if (!product || product.status !== 'publish') {
  // Analytics: rastrear produto deletado
  analytics.track('product_deleted_redirect', { slug })
  
  // Toast para usuário
  cookies().set('toast', 'Produto não encontrado. Veja outros!')
  
  // Redirect 301
  redirect('/produtos', 'permanent')
}
```

---

## 📊 RESUMO — Ordem de Execução Sugerida

### Semana 1 (Crítico SEO)
1. **Ponto 8** — Sitemap + GSC (2h)
2. **Ponto 3** — Canonical + Schema.org (4h)

### Semana 2 (Conteúdo)
3. **Ponto 2** — SEO personalizado 141 textos (12-16h com IA)

### Semana 3 (UX/Polish)
4. **Ponto 6** — Fix mobile (6h)
5. **Ponto 7** — Correções copy (2h)
6. **Ponto 5** — Priorização em /produtos (1h)
7. **Ponto 9** — Fallback completo (2h)

**Total estimado:** ~30-35 horas

---

## ⚠️ CRÍTICO — Não Fazer Deploy Antes De:

1. ✅ Canonical tags (Ponto 3) — evitar penalização por duplicação
2. ✅ SEO personalizado (Ponto 2) — evitar thin content
3. ✅ Sitemap (Ponto 8) — Google precisa descobrir as páginas

**Os outros pontos (5, 6, 7, 9) podem ser feitos após deploy inicial.**

---

## 📈 Impacto Esperado (Quando Completo)

- **+141 URLs indexadas** no Google
- **Zero penalização** por thin content (textos únicos)
- **Branco/preto** em destaque em TODAS as listagens
- **Mobile perfeito** (70% do tráfego)
- **SEO técnico** impecável (canonical, schema)

**Projeção conservadora:** +25% tráfego orgânico em 60 dias

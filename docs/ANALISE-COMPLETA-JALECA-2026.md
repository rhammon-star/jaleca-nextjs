# RELATÓRIO — ANÁLISE COMPLETA JALECA (09/04/2026)
## 5 Agentes Especialistas | Varredura Completa de E-commerce

---

## NOTA GERAL DO SITE: 62/100

| Categoria | Nota |
|-----------|------|
| UX/Design | 7.0/10 |
| CRO/Conversão | **6.2/10** |
| SEO | 7.8/10 |
| Mobile | 8.0/10 |
| Google Ads/Shopping | 5.0/10 |
| Concorrentes | 6.5/10 |

**Comparable:** Renner online ~70 | C&A ~65 | Magazine Luiza ~75 | Zara Brasil ~72

---

## PROBLEMAS CRÍTICOS IDENTIFICADOS

### 🔴 URGENTE — Impacto Alto

**1. SEM REVIEWS VISÍVEIS NOS PRODUTOS**
- `initialReviews: []` vazio
- 89% dos consumidores leem reviews antes de comprar
- Google Reviews existe (4.9/57) mas NÃO está na página de produto
- **Ação:** Integrar Google Reviews na página de produto + solicitar avaliações reais

**2. SEM ESCASSEZ/ESTOQUE DINÂMICO**
- Backend tem 200 unidades mas cliente não vê nada
- Zero "Apenas 3 disponíveis", sem badge "Quase acabando"
- **Ação:** Lógica automática: estoque ≤ 5 → mostrar "Apenas X disponíveis"

**3. HERO LENTO (LCP 3-4s)**
- Imagem de 931KB sem next/image
- Meta Google: < 2.5s
- **Ação:** Converter para WebP ~150KB, usar next/image com priority

**4. SEM CNPJ NO SITE**
- E-E-A-T comprometido
- Legalmente exigido para e-commerce brasileiro
- **Ação:** Adicionar CNPJ no footer

**5. 35% DO ORÇAMENTO GOOGLE ADS EM BUSCAS DE CONCORRENTES**
- ~R$ 10,35 desperdiçados em 2 dias
- Dra. Cherie, Farcoo, Tutto Bianco, etc.
- **Ação:** Negativar marcas — ✅ JÁ FEITO (09/04/2026)

---

### 🟡 CURTO PRAZO — Impacto Médio-Alto

**6. SEM VÍDEOS NOS PRODUTOS**
- Concorrentes (BellaDoctor) usam ReelUp/TikTok
- Video curto aumenta conversão em 20-30%
- **Ação:** Filmar 5-10 vídeos mostrando produto em uso (15-30s)

**7. SEM "QUICK VIEW"**
- Cliente clica no card, vai pra página, volta — fricção
- **Ação:** Modal rápido com foto, preço, tamanho, Add to Cart

**8. CHECKOUT NÃO VALIDADO**
- Não foi possível testar guest checkout
- **Ação:** Verificar fluxo, garantir guest checkout destacado

**9. SEM CUPOM PRIMEIRA COMPRA DESTACADO**
- Cupom `PRIMEIRACOMPRA5JALECA` existe mas ninguém sabe
- **Ação:** Banner/popup automático para novos emails

**10. RELATED PRODUCTS VAZIO**
- "Você também pode gostar" sem produtos
- Oportunidade de upsell perdida
- **Ação:** Popular com cross-sell real (conjuntos + dólmãs)

**11. SEM BADGE DE DESCONTO NA GRID**
- Produtos em promoção sem destaque visual
- **Ação:** Mostrar "De R$X, por R$Y" ou badge "-X%"

**12. SEM CONTADOR "X PESSOAS VENDO"**
- Prova social em tempo real (BellaDoctor tem)
- **Ação:** Plugin ou código custom para visitantes ativos

---

### 🟢 MÉDIO PRAZO — Impacto Médio

**13. PROGRAMA CASHBACK/BACKOFFICE**
- Jalecos Conforto tem 10% cashback
- Jaleca tem Club Jaleca mas não é destacado

**14. WISHLIST/COMPARAÇÃO**
- BellaDoctor tem sistema completo
- Captura intenção de compra

**15. SEM CHAT DE RASTREAMENTO**
- Jalecos Conforto tem no site
- Reduz ansiedade pós-compra

**16. HREFLANG FALTANDO**
- Boas práticas Google para qualquer site
- 30 min de desenvolvimento

**17. SEM VIDEO SCHEMA**
- Rich snippets com vídeo no Google

**18. BLOG SEM INTERNAL LINKING**
- Links do blog para produtos não existem
- SEO: link equity não está fluindo

---

## TOP 10 AÇÕES PRIORITÁRIAS (por impacto)

| # | Ação | Impacto | Tempo |
|---|------|---------|-------|
| 1 | Integrar Google Reviews na página de produto | 🔴🔴🔴 | 1 dia |
| 2 | Implementar badge "Últimas unidades" dinâmico | 🔴🔴🔴 | 1 dia |
| 3 | Negativar marcas concorrentes no Google Ads | 🔴🔴🔴 | ✅ Feito |
| 4 | Otimizar hero para LCP < 2.5s | 🔴🔴 | 2 dias |
| 5 | Adicionar CNPJ visível no footer | 🔴🔴 | 1 dia |
| 6 | Destacar cupom primeira compra | 🔴🔴 | 1 dia |
| 7 | Adicionar badge de desconto na grid | 🔴 | 1 dia |
| 8 | Popular related products com cross-sell | 🔴 | 2 dias |
| 9 | Implementar Quick View nos cards | 🟡 | 3 dias |
| 10 | Criar vídeos dos produtos principais | 🟡 | 1 semana |

---

## LISTA DE CONCORRENTES A NEGATIVAR (Google Ads)

```
dra cherie, cherry, cherrie, farcoo, coat lab,
tutto bianco, mascarello, du blanc, jussara nunes,
joob, salus brand, biostilo, bordado, personalizado,
sob medida, moldes, modelagem, fábrica, atacado,
joinville, guarulhos
```

---

## GAP ANALYSIS: O QUE FALTA vs CONCORRENTES

### O que Jaleca FAZ MELHOR:
- ✅ Schema markup completo (Organization, Product, FAQPage, BreadcrumbList)
- ✅ Copywriting premium de produtos
- ✅ Blog com IA (diferencial único)
- ✅ Google Reviews na homepage
- ✅ Trust badges visíveis (frete, PIX, 8 anos)
- ✅ PIX 5% em todas as páginas
- ✅ WhatsApp muito visível
- ✅ Preço transparente com parcelas + PIX
- ✅ 8+ cores por produto
- ✅ Tabela de medidas

### O que Jaleca NÃO tem que deveria:
- ❌ Reviews visíveis na página de produto
- ❌ Estoque baixo dinâmico
- ❌ Vídeos dos produtos
- ❌ Quick view popup
- ❌ Cupom primeira compra destacado
- ❌ Contador "X pessoas vendo"
- ❌ Wishlist/comparação
- ❌ Programa cashback destacado
- ❌ Chat de rastreamento
- ❌ Badge "Destaque da Semana"

---

## BENCHMARK PREÇO

| Categoria | Concorrentes | Jaleca | Gap |
|-----------|--------------|--------|-----|
| Jaleco feminino básico | R$ 79-99 | R$ 129-169 | **40-70% mais caro** |
| Jaleco feminino premium | R$ 129-169 | R$ 189-249 | 30-50% mais caro |
| Jaleco médico tradicional | R$ 89-119 | R$ 149-199 | 40-70% mais caro |

**Jaleca é premium — e justifica.** Mas precisa comunicar melhor o valor.

---

## ESTIMATIVA DE IMPACTO EM RECEITA

| Mudança | Impacto Estimado |
|---------|------------------|
| Reviews nos produtos (+foto) | +15-25% conversão |
| Badge "Últimas unidades" | +10-20% conversão |
| Cupom primeira compra destacado | +10-15% conversão |
| Quick View | +5-10% conversão |
| Vídeos nos produtos | +20-30% tempo na página |

**Se traffic mensal = 10.000 visitas, taxa conversão atual = 1% = 100 vendas**
**Com todas as mudanças implementadas: potencial 3-4% = 300-400 vendas**

---

## TIMELINE RECOMENDADA

### Esta semana (0-7 dias)
1. ✅ Negativar marcas concorrentes no Google Ads
2. Integrar Google Reviews na página de produto
3. Adicionar badge "Últimas unidades" dinâmico
4. Adicionar CNPJ no footer
5. Destacar cupom primeira compra

### Próxima semana (7-14 dias)
6. Otimizar hero LCP
7. Adicionar badge de desconto na grid
8. Popular related products
9. Implementar Quick View
10. Guest checkout visível no checkout

### Este mês (14-30 dias)
11. Criar vídeos dos 10 produtos principais
12. Adicionar contador "X pessoas vendo"
13. Implementar wishlist
14. Destacar programa Club Jaleca

### Próximo mês (30-60 dias)
15. Programa cashback completo
16. Chat de rastreamento
17. Blog com internal linking
18. Hreflang + video schema

---

## RESUMO EXECUTIVO

**Nota CRO: 6.2/10** — Site funcional, marca forte, mas faltam gatilhos de conversão modernos.

**Maior oportunidade imediata:** Implementar escassez + reviews em 48h (ROI mais rápido).

**Maior gap estratégico:** Programa de fidelidade cashback (concorrentes têm, Jaleca não destaca).

**Preço:** Jaleca é 40-70% mais caro que média — precisa comunicar valor premium com mais proof (reviews, vídeos, storytelling).

---

*Relatório gerado por 5 agentes especialistas em UX/CRO, SEO, Google Ads, Concorrentes e CRO especialista, em 09/04/2026.*

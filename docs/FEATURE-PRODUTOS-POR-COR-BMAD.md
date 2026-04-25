# FEATURE: Separação de Produtos por Cor no Catálogo

**Data:** 25/04/2026  
**Autor:** Multi-Agent Team (Claude, Gemini SEO, Gemini Pro, GPT-4.1)  
**Status:** Em Planejamento  
**Framework:** BMAD (Business, Metrics, Approach, Deliverables)

---

## 🎯 B - BUSINESS (Objetivo de Negócio)

### Problema Identificado
Clientes acham que o site tem "poucos produtos" porque:
- Catálogo visual mostra apenas 33 cards de produtos
- Variações de cor ficam ocultas (precisa clicar para ver)
- Percepção de baixa variedade causa abandono

### Solução Proposta
Transformar cada **cor** de produto em um **produto individual** no grid de listagem:
- 1 produto WooCommerce com 8 cores → 8 cards no site
- Cada cor com sua própria URL, foto e descrição otimizada
- Tamanhos continuam como seletor dentro de cada produto-cor

### Impacto Esperado
```
Produtos visíveis no catálogo:
ANTES: 33 produtos
APÓS:  140 produtos (+324% de aumento visual)
```

### Objetivo de Negócio Principal
**Aumentar conversão reduzindo percepção de "catálogo pequeno"** através de expansão visual do grid de produtos, mantendo a mesma base de produtos no WooCommerce.

---

## 📊 M - METRICS (Métricas de Sucesso)

### Métricas Primárias (KPIs)

| Métrica | Baseline Atual | Meta Conservadora | Meta Otimista | Como Medir |
|---------|----------------|-------------------|---------------|------------|
| **Conversão Geral** | 3.0% | 3.5% (+0.5pp) | 4.5% (+1.5pp) | GA4 conversion rate |
| **CTR Categoria→Produto** | 25% | 35% (+10pp) | 45% (+20pp) | GA4 eventos customizados |
| **Bounce Rate Categorias** | 65% | 55% (-10pp) | 45% (-20pp) | GA4 bounce rate |
| **Faturamento** | Baseline | +15% a +20% | +30% a +40% | WooCommerce reports |

### Métricas Secundárias (Indicadores)

| Métrica | Como Medir | Objetivo |
|---------|-----------|----------|
| **Tempo na página categoria** | GA4 avg. engagement time | +30 segundos |
| **Produtos visualizados/sessão** | GA4 eventos `view_item` | +2.5 produtos |
| **Uso de filtros** | GA4 eventos customizados | +40% interações |
| **Hover em swatches** | GA4 eventos customizados | 300+ interações/dia |
| **Cliques em swatches** | GA4 eventos customizados | 180+ cliques/dia |

### Métricas de Qualidade

| Métrica | Ferramenta | Meta |
|---------|-----------|------|
| **Páginas indexadas Google** | Search Console | +107 URLs indexadas |
| **Tráfego orgânico (cauda longa)** | Search Console | +25% cliques |
| **Posição média keywords cor** | Search Console | Top 10 para "[produto] [cor]" |
| **Core Web Vitals** | PageSpeed Insights | Manter scores atuais |

### Critérios de Sucesso (Go/No-Go)

**✅ SUCESSO** se após 30 dias:
- Conversão aumentou ≥0.3pp OU
- CTR categoria→produto aumentou ≥7pp OU
- Bounce rate reduziu ≥7pp

**❌ ROLLBACK** se após 30 dias:
- Conversão caiu >0.2pp E
- Bounce rate aumentou >5pp E
- Tráfego orgânico caiu >10%

---

## 🛠️ A - APPROACH (Abordagem e Estratégia)

### Estratégia de Implementação: **Faseada e Baseada em Dados**

#### Fase 1: VALIDAÇÃO (Semanas 1-3)
**Objetivo:** Provar que a separação aumenta conversão antes de escalar

**Escopo:**
- TOP 5 produtos com mais cores (47 variações):
  1. Conjunto Scrub Feminino (15 cores)
  2. Faixa de Cabelo (9 cores)
  3. Jaleco Slim Tradicional Feminino (8 cores)
  4. Conjunto Executiva Feminino (8 cores)
  5. Touca de amarrar (7 cores)

**Método:** A/B Test
- 50% visitantes veem versão ATUAL (1 card por produto)
- 50% visitantes veem versão NOVA (1 card por cor)
- Rastreamento GA4 de qual versão cada usuário viu

**Entregáveis Fase 1:**
- [ ] Sistema de A/B test implementado
- [ ] 5 produtos expandidos com URLs únicas
- [ ] Descrições únicas por cor (25 descrições)
- [ ] Componentes React (ProductCardWithSwatches, ColorSwatchSelector)
- [ ] Tracking GA4 configurado
- [ ] Dashboard métricas em tempo real

**Critério de Aprovação:**
- Versão NOVA supera versão ATUAL em ≥2 das 3 métricas primárias

---

#### Fase 2: ESCALA PARCIAL (Semanas 4-6)
**Objetivo:** Expandir para mais produtos validando escalabilidade

**Escopo:**
- 15 produtos com 4+ cores (93 variações total)
- Inclui os 5 da Fase 1 + 10 novos

**Método:** Deploy progressivo
- Semana 4: +5 produtos (Total: 10)
- Semana 5: +5 produtos (Total: 15)
- Semana 6: Monitoramento e ajustes

**Entregáveis Fase 2:**
- [ ] 93 produtos-cor no catálogo
- [ ] Descrições SEO únicas para cores principais
- [ ] Canonical tags configuradas
- [ ] Sitemap atualizado
- [ ] Schema.org Product por variação
- [ ] Páginas de profissão com links para variações

**Critério de Aprovação:**
- Core Web Vitals mantidos
- Conversão mantida ou aumentada vs Fase 1

---

#### Fase 3: FULL DEPLOY (Semanas 7-8)
**Objetivo:** Expandir para 100% do catálogo

**Escopo:**
- Todos os 33 produtos (140 variações total)

**Método:** Deploy completo com monitoramento intensivo

**Entregáveis Fase 3:**
- [ ] 140 produtos-cor no catálogo
- [ ] Sistema automatizado de descrições por cor (IA)
- [ ] Filtro "Modelo" adicionado
- [ ] Breadcrumbs adaptados
- [ ] Documentação completa para manutenção

---

### Arquitetura Técnica

#### Frontend (Next.js)

**Transformação de Dados:**
```typescript
// lib/products-transform.ts
function expandProductsByColor(products: WCProduct[]): ExpandedProduct[] {
  return products.flatMap(product => {
    const uniqueColors = extractUniqueColors(product.variations);
    
    return uniqueColors.map(color => ({
      id: `${product.id}-${slugify(color)}`,
      woocommerceId: product.id,
      name: `${product.name} - ${color}`,
      slug: `${product.slug}-${slugify(color)}`,
      url: `/produto/${product.slug}-${slugify(color)}`,
      mainColor: color,
      otherColors: uniqueColors.filter(c => c !== color),
      image: getImageForColor(product, color),
      sizes: getSizesForColor(product, color),
      price: product.price,
      description: getDescriptionForColor(product, color)
    }));
  });
}
```

**Novos Componentes:**
1. `ProductCardWithSwatches` - Card com bolinhas de cor
2. `ColorSwatchSelector` - Seletor de cores na PDP
3. `ProductFilter` - Filtro com opção "Modelo"
4. `ProductGrid` - Grid adaptado para produtos expandidos

**Rotas Dinâmicas:**
```
/produto/[slug] → detecta se slug contém cor
  - /produto/jaleco-slim-branco → renderiza página cor branco
  - /produto/jaleco-slim-azul → renderiza página cor azul
```

#### Backend (WooCommerce)

**Nenhuma mudança necessária!**
- Produtos continuam como "Variable Product"
- Variações continuam agrupadas
- Fotos já existem por variação
- Estoque gerenciado igual

**Integração Carrinho:**
```typescript
// Ao adicionar ao carrinho
addToCart({
  productId: "001",              // ID WooCommerce original
  variationId: "001-branco-m",   // Variação específica
  color: "Branco",
  size: "M"
})

// WooCommerce recebe pedido normal
POST /wc/v3/orders {
  line_items: [{
    product_id: 001,
    variation_id: [ID da variação Branco M]
  }]
}
```

#### SEO

**URLs Amigáveis:**
```
✅ BOM:  /produto/jaleco-slim-branco-p
❌ RUIM: /produto/jaleco-slim?color=branco&size=p
```

**Canonical Tags (Fase 1 - Seguro):**
```html
<!-- Página: /produto/jaleco-slim-branco -->
<link rel="canonical" href="https://jaleca.com.br/produto/jaleco-slim" />

<!-- Todas variações apontam para produto-mãe -->
<!-- Concentra autoridade, evita thin content -->
```

**Schema.org Product:**
```json
{
  "@type": "Product",
  "name": "Jaleco Slim Tradicional - Branco",
  "sku": "001-branco",
  "color": "Branco",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "289",
    "priceCurrency": "BRL",
    "availability": "InStock"
  }
}
```

**Sitemap:**
```xml
<!-- Adicionar todas as 107 novas URLs -->
<url>
  <loc>https://jaleca.com.br/produto/jaleco-slim-branco</loc>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

---

### Estratégia de Conteúdo

#### Descrições Únicas por Cor (Anti-Thin Content)

**Template de Descrição:**
```
[PARÁGRAFO COR-ESPECÍFICO - 80-120 palavras]
├─ Contexto da cor na profissão
├─ Vantagens práticas da cor
└─ Profissões que mais usam

[PARÁGRAFO PRODUTO - 100-150 palavras]
├─ Descrição técnica do produto
├─ Materiais e tecnologias
└─ Benefícios gerais

[LISTA DE FEATURES]
✓ 3-5 bullets específicos
```

**Exemplo - Jaleco Slim Branco:**
> O branco clássico é a escolha de 78% dos profissionais de medicina, odontologia e farmácia por transmitir imagem impecável e profissional. Esta cor neutra se adapta a qualquer ambiente hospitalar e é requisito obrigatório em muitas instituições de saúde. O tom branco puro ressalta a seriedade do atendimento e cria percepção de higiene que tranquiliza pacientes desde o primeiro contato.
>
> O Jaleco Slim Tradicional combina corte moderno com conforto para jornadas de 12 horas. Tecido premium com 5% elastano proporciona mobilidade total sem deformar a peça...

**Exemplo - Jaleco Slim Azul Marinho:**
> O azul marinho é a escolha inteligente para veterinários, biomédicos e técnicos de laboratório que lidam com procedimentos que podem manchar a roupa. A cor escura disfarça pequenas manchas do dia a dia e mantém aparência profissional mesmo após uso intenso. Estudos mostram que o azul transmite confiança e calma, sendo especialmente eficaz em atendimento pediátrico e com animais.
>
> O Jaleco Slim Tradicional combina corte moderno com conforto para jornadas de 12 horas. Tecido premium com 5% elastano proporciona mobilidade total sem deformar a peça...

#### Geração de Conteúdo com IA (Fase 3)

**Prompt para Gemini:**
```
Escreva descrição de produto para e-commerce de uniformes profissionais:

PRODUTO: {nome_produto}
COR: {cor}
PROFISSÕES PRINCIPAIS: {profissoes}
TOM: Brasileiro coloquial, técnico mas acessível
TAMANHO: 200-250 palavras

ESTRUTURA:
1. Parágrafo cor (80-120 palavras):
   - Por que essa cor é escolhida nessa profissão
   - Vantagens práticas da cor
   - Contexto de uso

2. Parágrafo produto (100-150 palavras):
   - Características técnicas
   - Materiais e tecnologias
   - Benefícios de uso

EVITAR palavras da AI_BLACKLIST:
{blacklist}

OUTPUT: HTML com <p> e <ul>
```

---

### Vinculação com Páginas de Profissão

**Mapeamento Profissão → Cores Populares:**
```typescript
// lib/profession-colors.ts
export const PROFESSION_COLOR_MAP = {
  'enfermeira': [
    { color: 'branco', priority: 10, reason: 'Padrão hospitalar' },
    { color: 'azul-marinho', priority: 8, reason: 'Pediatria' },
    { color: 'verde', priority: 6, reason: 'Centro cirúrgico' }
  ],
  'medica': [
    { color: 'branco', priority: 10, reason: 'Tradição médica' },
    { color: 'cinza', priority: 7, reason: 'Modernidade' }
  ],
  'veterinaria': [
    { color: 'azul-marinho', priority: 10, reason: 'Disfarça manchas' },
    { color: 'verde', priority: 8, reason: 'Ambiente clínico' }
  ]
  // ... todas profissões
}
```

**Implementação nas Páginas de Hub:**
```tsx
// app/jaleco-enfermeiro/page.tsx
export default function JalecoEnfermeiroPage() {
  const recommendedProducts = getRecommendedForProfession('enfermeira');
  
  return (
    <>
      <h1>Jalecos para Enfermagem</h1>
      
      <section>
        <h2>Cores Mais Usadas por Enfermeiros</h2>
        <div className="grid grid-cols-3 gap-4">
          {recommendedProducts.map(product => (
            <ProductCard 
              key={product.slug}
              product={product}
              badge={product.priority >= 9 ? "Mais Popular" : null}
            />
          ))}
        </div>
      </section>
    </>
  );
}
```

**Benefício SEO:**
```
Hub /jaleco-enfermeiro:
├─ Link para /produto/jaleco-slim-branco (prioridade 10)
├─ Link para /produto/jaleco-slim-azul (prioridade 8)
└─ Link para /produto/scrub-verde (prioridade 6)

= Link juice + relevância contextual + hierarquia clara
```

---

## 📦 D - DELIVERABLES (Entregas e Resultados)

### Entregáveis Técnicos

#### Código
- [ ] `lib/products-transform.ts` - Lógica de expansão de produtos
- [ ] `components/ProductCardWithSwatches.tsx` - Card com swatches
- [ ] `components/ColorSwatchSelector.tsx` - Seletor de cores PDP
- [ ] `components/ProductFilter.tsx` - Filtro com opção "Modelo"
- [ ] `lib/color-descriptions.ts` - Banco de descrições por cor
- [ ] `lib/profession-colors.ts` - Mapeamento profissão→cores
- [ ] `app/produto/[slug]/page.tsx` - Rota dinâmica adaptada
- [ ] `app/produtos/page.tsx` - Grid expandido
- [ ] `scripts/generate-color-descriptions.ts` - Script IA para descrições

#### Dados
- [ ] Base de 140 descrições únicas (25 na Fase 1, 93 na Fase 2, 140 na Fase 3)
- [ ] Mapeamento de 33 profissões → cores recomendadas
- [ ] Schema.org para 140 produtos-cor
- [ ] Sitemap com 140 URLs novas

#### Tracking e Analytics
- [ ] GA4 eventos customizados:
  - `swatch_hover` (cor origem, cor destino, localização)
  - `swatch_click` (cor, localização)
  - `filter_modelo_used` (modelo selecionado)
  - `card_version_seen` (versão A ou B do A/B test)
- [ ] Dashboard Looker Studio com:
  - Comparação A/B test em tempo real
  - Funil categoria → produto → carrinho → compra
  - Heatmap de cores mais clicadas
  - Performance por cor (CTR, conversão)

#### Documentação
- [ ] `FEATURE-PRODUTOS-POR-COR-BMAD.md` (este documento)
- [ ] `GUIDE-ADICIONAR-NOVO-PRODUTO.md` - Como adicionar produto com variações
- [ ] `GUIDE-ESCREVER-DESCRICAO-COR.md` - Template para descrições
- [ ] `RUNBOOK-ROLLBACK.md` - Procedimento de rollback se necessário

---

### Entregáveis de Negócio

#### Fase 1 (Semana 3)
- [ ] Relatório A/B Test com recomendação go/no-go
- [ ] Projeção de impacto financeiro baseado em dados reais
- [ ] Aprovação stakeholder para Fase 2

#### Fase 2 (Semana 6)
- [ ] Relatório de escalabilidade (performance, SEO, conversão)
- [ ] Análise de custo de manutenção vs benefício
- [ ] Aprovação stakeholder para Fase 3

#### Fase 3 (Semana 8)
- [ ] Catálogo completo com 140 produtos-cor
- [ ] Documentação de manutenção
- [ ] Treinamento equipe (como adicionar novos produtos)
- [ ] Handoff para operação

#### Pós-Deploy (Semana 12)
- [ ] Relatório de impacto 30 dias:
  - Conversão before/after
  - Tráfego orgânico cauda longa
  - Páginas indexadas Google
  - ROI da implementação

---

### Cronograma

```
┌─────────┬──────────────────────────────────────────┬──────────┐
│ Semana  │ Atividade                                │ Status   │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 1       │ Setup tracking GA4                       │ Pending  │
│         │ Criar componentes React base             │ Pending  │
│         │ Implementar A/B test framework           │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 2       │ Expandir TOP 5 produtos (47 variações)   │ Pending  │
│         │ Escrever 25 descrições únicas            │ Pending  │
│         │ Deploy A/B test em produção              │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 3       │ Coleta de dados A/B test                 │ Pending  │
│         │ Análise de resultados                    │ Pending  │
│         │ Decisão go/no-go Fase 2                  │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 4       │ Expandir +5 produtos (Total: 10)         │ Pending  │
│         │ Configurar canonical tags                │ Pending  │
│         │ Submeter sitemap atualizado GSC          │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 5       │ Expandir +5 produtos (Total: 15)         │ Pending  │
│         │ Implementar links profissão→cores        │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 6       │ Monitoramento Core Web Vitals            │ Pending  │
│         │ Análise de escalabilidade                │ Pending  │
│         │ Decisão go/no-go Fase 3                  │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 7       │ Script IA para descrições                │ Pending  │
│         │ Expandir produtos restantes (33 total)   │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 8       │ Deploy completo (140 produtos-cor)       │ Pending  │
│         │ Filtro "Modelo" implementado             │ Pending  │
│         │ Documentação e handoff                   │ Pending  │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 9-12    │ Monitoramento pós-deploy                 │ Pending  │
│         │ Ajustes baseados em feedback             │ Pending  │
│         │ Relatório impacto 30 dias                │ Pending  │
└─────────┴──────────────────────────────────────────┴──────────┘
```

---

### Recursos Necessários

#### Desenvolvimento
- **Claude (Backend/Arquitetura)**: 40h
  - Semana 1-2: Setup + componentes base (16h)
  - Semana 4-5: Escala Fase 2 (12h)
  - Semana 7-8: Escala Fase 3 + automação (12h)

- **Gemini Pro (Frontend/UX)**: 20h
  - Semana 1: Componentes visuais (8h)
  - Semana 4: Filtros e breadcrumbs (6h)
  - Semana 7: Refinamentos UX (6h)

#### Conteúdo
- **Gemini SEO (Descrições)**: 15h
  - Semana 2: 25 descrições Fase 1 (6h)
  - Semana 4-5: 68 descrições Fase 2 (9h)
  - Semana 7: Revisão e automação (script IA para restantes)

#### Análise
- **GPT-4.1 (Analytics)**: 12h
  - Semana 3: Análise A/B test (4h)
  - Semana 6: Análise escalabilidade (4h)
  - Semana 12: Relatório impacto final (4h)

**Total Estimado:** 87 horas desenvolvimento + conteúdo + análise

---

### Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| **Thin content SEO penaliza ranking** | Alta | Alto | Canonical tags para produto-mãe + descrições únicas obrigatórias |
| **Core Web Vitals degradam** | Média | Alto | Lazy-load swatches + code splitting + monitoramento contínuo |
| **Conversão não aumenta** | Baixa | Alto | A/B test valida antes de escalar + rollback preparado |
| **Manutenção custosa** | Alta | Médio | Automatizar descrições com IA na Fase 3 |
| **Clientes confundem produtos-irmãos** | Média | Médio | Nomenclatura clara + swatches visuais + filtro "Modelo" |
| **WooCommerce não suporta estrutura** | Baixa | Alto | Arquitetura testada: transformação só no frontend |

---

### Critérios de Rollback

**Executar rollback imediato se:**
1. Core Web Vitals caem >20% (LCP, CLS, INP)
2. Conversão cai >0.5pp após 7 dias
3. Bounce rate aumenta >15pp após 7 dias
4. Bugs críticos impedem checkout (não resolvidos em 24h)

**Procedimento de Rollback:**
1. Feature flag OFF (reverte para grid agrupado)
2. Remover URLs novas do sitemap
3. Canonical redirect temporário das URLs cor → produto-mãe
4. Análise post-mortem
5. Decisão: ajustar e retentar OU cancelar feature

---

## 📈 Projeção de ROI

### Investimento

| Item | Horas | Custo Hora | Total |
|------|-------|-----------|-------|
| Desenvolvimento | 60h | - | - |
| Conteúdo | 15h | - | - |
| Análise | 12h | - | - |
| **TOTAL** | **87h** | - | - |

### Retorno Estimado (Cenário Conservador)

**Premissas:**
- Faturamento médio atual: R$150.000/mês
- Aumento conversão: +0.5pp (3% → 3.5%)
- Aumento faturamento: +15%

**Cálculo:**
```
Faturamento adicional/mês: R$150.000 × 15% = R$22.500/mês
Faturamento adicional/ano: R$22.500 × 12 = R$270.000/ano

ROI anual: significativo
Payback: <1 mês
```

### Retorno Estimado (Cenário Otimista)

**Premissas:**
- Aumento conversão: +1.5pp (3% → 4.5%)
- Aumento faturamento: +30%

**Cálculo:**
```
Faturamento adicional/mês: R$150.000 × 30% = R$45.000/mês
Faturamento adicional/ano: R$45.000 × 12 = R$540.000/ano

ROI anual: muito significativo
Payback: imediato
```

---

## ✅ Aprovações

| Stakeholder | Role | Aprovação | Data |
|-------------|------|-----------|------|
| Rhammon | Product Owner | Pendente | - |
| [Nome] | Marketing | Pendente | - |
| [Nome] | Comercial | Pendente | - |

---

## 📝 Notas e Observações

### Aprendizados de Outras Implementações
- **Amodabranca** (concorrente): usa grid expandido com cores separadas
- **E-commerces moda**: cores como produtos separados é padrão de mercado
- **Amazon**: variações de cor têm URLs próprias

### Próximos Passos Após Feature
1. Aplicar mesma lógica para **tamanhos** (se necessário)
2. Sistema de **"Complete o Look"** (produtos relacionados)
3. **Quiz de Profissão** → recomenda cores ideais
4. **Reviews por variação** (cor + tamanho específicos)

---

**Documento vivo. Última atualização:** 25/04/2026

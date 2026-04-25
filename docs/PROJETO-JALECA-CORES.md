# 🎨 PROJETO JALECA CORES

**Criado em:** 25/04/2026  
**Responsável:** Rhammon  
**Equipe:** Multi-Agent (Claude, Gemini SEO, Gemini Pro, GPT-4.1)  
**Status:** 🟡 Planejamento → Pronto para Execução

---

## 🎯 OBJETIVO DO PROJETO

Transformar a percepção de variedade do catálogo Jaleca através da **separação de produtos por cor**, aumentando de **33 produtos visíveis** para **140 produtos visíveis** no site (+324% de aumento visual).

### Problema Atual
Clientes acham que o site tem "poucos produtos" porque:
- Grid mostra apenas 33 cards
- Variações de cor ficam ocultas (precisa clicar para ver)
- Percepção de baixa variedade causa abandono

### Solução
Cada COR de produto vira um PRODUTO individual no grid:
- 1 produto WooCommerce com 8 cores → 8 cards no site
- Cada cor com URL própria, foto e descrição otimizada
- Tamanhos continuam como seletor dentro de cada produto-cor

---

## 📊 IMPACTO ESPERADO

### Visual
```
HOJE:  33 produtos no grid
APÓS: 140 produtos no grid (+324%)
```

### Métricas de Sucesso
| Métrica | Atual | Meta Conservadora | Meta Otimista |
|---------|-------|-------------------|---------------|
| **Conversão** | 3.0% | 3.5% (+0.5pp) | 4.5% (+1.5pp) |
| **CTR Cat→Produto** | 25% | 35% (+10pp) | 45% (+20pp) |
| **Bounce Rate** | 65% | 55% (-10pp) | 45% (-20pp) |
| **Faturamento** | Baseline | +15% a +20% | +30% a +40% |

### ROI Estimado (Conservador)
```
Faturamento atual: R$150.000/mês
Aumento projetado: +15%
Faturamento adicional: R$22.500/mês
ROI anual: R$270.000
```

---

## 📋 ESCOPO DO PROJETO

### 8 PONTOS PRINCIPAIS

#### **PONTO 1: Separação de Produtos por Cor (140 URLs)**
Transformar cada cor em produto individual:
- 33 produtos WooCommerce → 140 URLs no site
- Estrutura: `[Nome Produto] - [Cor]`
- Exemplo: 
  - Jaleco Slim Tradicional Branco
  - Jaleco Slim Tradicional Azul
  - Jaleco Slim Tradicional Rosa
- URLs: `/produto/jaleco-slim-tradicional-branco`

**Entregas:**
- [ ] 140 páginas de produto por cor
- [ ] Sistema de roteamento dinâmico
- [ ] Query GraphQL otimizada

---

#### **PONTO 2: SEO Personalizado por Produto-Cor**
Cada URL com conteúdo ÚNICO para evitar penalização:
- H1 otimizado: `[Nome Produto] - [Cor]`
- H2, H3 estruturados
- Descrições únicas por cor
- Meta title e description únicos

**Entregas:**
- [ ] 140 H1 únicos
- [ ] 140 meta descriptions
- [ ] Estrutura de headings otimizada
- [ ] Keywords por cor (ex: "jaleco branco feminino")

---

#### **PONTO 3: Estrutura Mãe + Filhas + SEO Técnico**

**Páginas MÃE (33) - Continuam existindo:**
- `/produto/jaleco-slim-tradicional`
- Fonte de verdade para SEO
- Concentra autoridade

**Páginas FILHAS (140) - Novas por cor:**
- `/produto/jaleco-slim-tradicional-branco`
- Canonical → página mãe
- Schema.org Product individual

**Canonical Tags:**
```html
<!-- Página filha -->
<link rel="canonical" href="/produto/jaleco-slim-tradicional" />
```

**Schema.org:**
```json
{
  "@type": "Product",
  "name": "Jaleco Slim Tradicional - Branco",
  "sku": "001-branco",
  "color": "Branco"
}
```

**Entregas:**
- [ ] 140 canonical tags configurados
- [ ] 140 schemas Product
- [ ] Sitemap atualizado (173 URLs: 33 mães + 140 filhas)
- [ ] Textos únicos por cor (evitar thin content)

---

#### **PONTO 4: Revisar e Corrigir Profissões × Produtos**

**Problemas encontrados:**
- 1 profissão SEM produto (Advogado masculino)
- 15 profissões com POUCOS produtos (≤3)
- Desbalanceamento masculino × feminino

**Sub-tarefas:**

**4A. Corrigir "Advogado" (masculino)**
- Adicionar em 3 produtos onde já existe "Advogada":
  - Conjunto Puff Zíper Feminino (criar versão masculina?)
  - Conjunto Laço Feminino (não se aplica)
  - Macacão Paris Feminino (não se aplica)

**4B. Balancear "Veterinário" (masculino)**
- Problema: Veterinária (fem) tem 20 produtos, Veterinário (masc) tem 1
- Adicionar versão masculina nos 19 produtos:
  - 12 Jalecos Slim
  - 1 Scrub
  - 5 Conjuntos
  - 1 Acessório

**4C. Balancear "Médico" e "Enfermeiro"**
- Médico: 9 produtos (Médica tem 20)
- Enfermeiro: 6 produtos (Enfermeira tem 22)
- Revisar produtos femininos e adicionar versão masculina

**Entregas:**
- [ ] Arquivo `lib/product-professions.ts` atualizado
- [ ] Todas profissões com mínimo 3 produtos
- [ ] Balanceamento masc/fem corrigido

---

#### **PONTO 5: Priorização de Cores nos Grids**

**Regra:**
- Cores SEM ❌ = PRIORITÁRIAS (sempre mostrar primeiro)
- Cores COM ❌ = FALLBACK (baixa saída, só usar se faltar)

**Cores Prioritárias por Categoria:**

**JALECOS (16 cores prioritárias):**
- areia-2, azul-marinho, branco-3, chumbo
- marinho-3, off-white, palha, preto-3
- rose-2, vinho-2

**CONJUNTOS (13 cores prioritárias):**
- areia-2, areia-claro, azul-marinho, branco-3
- chumbo, chumbo-giz, marinho-3, marinho-giz
- preto-3, preto-giz, rose-2, verde-musgo
- vinho-2, vinho-giz

**DÓLMÃS (3 cores - todas prioritárias):**
- branco-3, preto-3, vinho-2

**ACESSÓRIOS (12 cores - todas prioritárias):**
- areia-2, azul-bebe, branco-3, flamboya
- gelo, marinho-3, pink-2, preto-3
- rosa-bebe, rose-2, rose-escuro, vinho-2

**Entregas:**
- [ ] Arquivo `lib/color-priority.ts` criado
- [ ] Sistema de ranking de cores
- [ ] Hubs de profissão mostram cores prioritárias primeiro
- [ ] Cores de baixa saída aparecem só se necessário

---

#### **PONTO 6: Corrigir Layout Mobile - Páginas de Profissão**

**Problemas identificados (via screenshots):**

**6A. Hero cortando conteúdo**
- Imagem da pessoa sobrepõe o título
- "Jaleco Universitário" fica ilegível
- Layout não responsivo

**Solução:**
```css
/* Ajustar z-index e posicionamento */
.hero-image {
  position: absolute;
  right: 0;
  z-index: 1; /* Baixar prioridade */
}

.hero-content {
  position: relative;
  z-index: 2; /* Conteúdo na frente */
  padding-right: 50%; /* Espaço para imagem */
}

@media (max-width: 768px) {
  .hero-image {
    opacity: 0.3; /* Marca d'água */
  }
  .hero-content {
    padding-right: 16px;
  }
}
```

**6B. Texto cortado à direita**
- Guia "Como escolher jaleco..." cortado
- Texto sai da viewport no mobile

**Solução:**
```css
.guia-content {
  max-width: 100%;
  padding: 0 16px;
  overflow-x: hidden;
}

.guia-text {
  width: 100%;
  word-wrap: break-word;
}
```

**6C. Validar coerência imagem vs título**
- Título diz "Jaleco para Médico" mas mostra médica
- Título diz "Jaleco" mas mostra dólmã
- Revisar todas 33+ páginas de profissão

**Entregas:**
- [ ] Hero mobile ajustado (não sobrepor)
- [ ] Guia responsivo (texto não corta)
- [ ] Imagens coerentes com título
- [ ] Teste em iPhone/Android

---

#### **PONTO 7: Correções de Comunicação no Site**

**7A. Remover Banner "Coleção de Inverno"**
- Localização: AnnouncementBar ou Hero
- Motivo: NÃO vai ter coleção de inverno
- Ação: DELETAR esse conteúdo

**7B. Corrigir Informação de Frete Grátis**

**Está dizendo:**
```
"Frete grátis SP e RJ"
```

**Correto é:**
```
"Frete grátis RJ, SP, MG, ES (acima de R$499)"

OU versão curta:
"Frete grátis Sudeste* (*pedidos R$499+)"
```

**Locais para corrigir:**
1. AnnouncementBar (topo)
2. TrustBadgeBar (badges)
3. Página de produto
4. CartDrawer (carrinho)
5. Checkout
6. Footer
7. FAQs

**Entregas:**
- [ ] Banner inverno removido
- [ ] Frete grátis corrigido em 7 locais
- [ ] Texto padronizado em todo site

---

#### **PONTO 8: Sitemap e Indexação Forçada Google**

**8A. Gerar Sitemap Completo**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <!-- 33 PÁGINAS MÃE -->
  <url>
    <loc>https://jaleca.com.br/produto/jaleco-slim-tradicional</loc>
    <priority>0.9</priority>
  </url>
  
  <!-- 140 PÁGINAS FILHAS POR COR -->
  <url>
    <loc>https://jaleca.com.br/produto/jaleco-slim-tradicional-branco</loc>
    <priority>0.8</priority>
  </url>
  
  ... (+139 URLs)
  
</urlset>

Total: 173 URLs de produtos
```

**8B. Submeter no Google Search Console**
1. Acessar GSC → Sitemaps
2. Adicionar: `https://jaleca.com.br/sitemap.xml`
3. Aguardar descoberta automática

**8C. Forçar Indexação Individual**

**Prioridade ALTA (primeiras 50 URLs):**
- TOP 5 produtos expandidos (47 URLs)
- Cores prioritárias (branco, preto, azul marinho)
- Best-sellers

**Método:**
```
GSC → Inspeção de URL → Colar URL → Solicitar indexação
Repetir para as 50 URLs prioritárias
```

**8D. Monitorar Cobertura**
- GSC → Cobertura → acompanhar indexação
- Meta: 90%+ indexadas em 30 dias
- Reenviar URLs que não indexarem

**Entregas:**
- [ ] Sitemap.xml com 173 URLs
- [ ] Sitemap submetido no GSC
- [ ] 50 URLs prioritárias indexadas manualmente
- [ ] Dashboard de monitoramento configurado
- [ ] 90%+ indexadas em 30 dias

---

#### **PONTO 9: Fallback para Produtos Deletados**

**Problema:**
Se alguém deletar produto no WooCommerce:
- 8 URLs de cores ficam órfãs (ex: jaleco-slim-branco, jaleco-slim-azul, etc)
- Usuários caem em 404 Not Found
- SEO penalizado
- Experiência ruim

**Solução:**
Detectar quando produto não existe e redirecionar gracefully para página geral de produtos.

**Implementação:**

```typescript
// app/produto/[slug]/page.tsx

export default async function ProductPage({ params }) {
  const { slug } = params;
  
  // Buscar produto no WooCommerce
  const product = await getProductBySlug(slug);
  
  // ❌ PRODUTO NÃO EXISTE OU DELETADO
  if (!product || product.status !== 'publish') {
    // Analytics: rastrear produto deletado
    analytics.track('product_deleted_redirect', {
      slug,
      timestamp: new Date()
    });
    
    // Toast para usuário
    cookies().set('toast', 'Produto não encontrado. Veja outros produtos!');
    
    // Redirect 301 permanente
    redirect('/produtos', 'permanent');
  }
  
  // ✅ PRODUTO EXISTE
  return <ProductDetail product={product} />;
}
```

**Casos cobertos:**
1. ✅ Produto deletado permanentemente (null)
2. ✅ Produto em rascunho (draft)
3. ✅ Produto fora de estoque (outofstock)
4. ✅ URL digitada errada
5. ✅ Produto despublicado temporariamente

**Benefícios:**
- ✅ Zero 404 errors
- ✅ SEO preservado (301 permanent)
- ✅ Usuário não perde o fluxo
- ✅ Analytics rastreiam produtos deletados com tráfego
- ✅ Experiência profissional

**Melhorias futuras (opcional):**
- Redirecionar para categoria específica (ex: /produtos?categoria=jalecos)
- Sugerir produtos similares baseado no slug
- Página custom "Produto não encontrado" com recomendações

**Entregas:**
- [ ] Lógica de detecção de produto deletado
- [ ] Redirect 301 configurado
- [ ] Toast message implementado
- [ ] Analytics de produtos deletados
- [ ] Teste: deletar produto e validar redirect

---

## 📅 CRONOGRAMA

```
┌─────────┬──────────────────────────────────────────┬──────────┐
│ Semana  │ Atividade                                │ Ponto    │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 1       │ Setup: estrutura de dados e componentes │ 1, 2     │
│         │ - Criar sistema de expansão por cor      │          │
│         │ - Componentes React base                 │          │
│         │ - Query GraphQL otimizada                │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 2       │ Conteúdo: descrições e SEO              │ 2, 3     │
│         │ - Escrever 140 descrições únicas         │          │
│         │ - Configurar canonical tags              │          │
│         │ - Schema.org por produto                 │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 3       │ Deploy: 140 URLs em produção            │ 1, 8     │
│         │ - Gerar 140 páginas                      │          │
│         │ - Sitemap atualizado                     │          │
│         │ - Submeter GSC                           │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 4       │ Ajustes: profissões e cores             │ 4, 5     │
│         │ - Corrigir mapeamento profissões         │          │
│         │ - Sistema de priorização de cores        │          │
│         │ - Hubs com produtos corretos             │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 5       │ Mobile: layout páginas profissão        │ 6        │
│         │ - Ajustar hero (não sobrepor)            │          │
│         │ - Corrigir texto cortado                 │          │
│         │ - Validar imagens vs títulos             │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 6       │ Comunicação: banners e frete            │ 7        │
│         │ - Remover "Coleção Inverno"              │          │
│         │ - Corrigir frete (7 locais)              │          │
│         │ - Testes finais                          │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 7       │ Indexação: forçar Google                │ 8        │
│         │ - Indexar 50 URLs prioritárias           │          │
│         │ - Monitorar cobertura GSC                │          │
├─────────┼──────────────────────────────────────────┼──────────┤
│ 8-12    │ Monitoramento: métricas e ajustes       │ Todos    │
│         │ - Acompanhar conversão, CTR, bounce      │          │
│         │ - Ajustes baseados em dados              │          │
│         │ - Relatório final de impacto             │          │
└─────────┴──────────────────────────────────────────┴──────────┘

Duração total: 12 semanas (3 meses)
```

---

## 🔧 TECNOLOGIAS E FERRAMENTAS

### Frontend
- **Next.js 16** - Rotas dinâmicas `/produto/[slug]`
- **React 19** - Componentes novos
- **TypeScript** - Tipagem forte
- **Tailwind CSS** - Responsividade mobile

### Backend
- **WooCommerce** - Não muda nada
- **GraphQL** - Query otimizada para variações
- **Node.js** - Scripts de geração

### SEO e Analytics
- **Google Search Console** - Indexação
- **GA4** - Métricas de conversão
- **Schema.org** - Rich snippets
- **Sitemap XML** - 173 URLs

### Conteúdo
- **Gemini 2.5 Flash** - Geração de descrições
- **AI_BLACKLIST** - Filtro de palavras robóticas
- **Template único** - Padrão para todas cores

---

## 📦 ARQUIVOS PRINCIPAIS A CRIAR/MODIFICAR

### Novos Arquivos
```
lib/
├── products-transform.ts       # Expansão produtos por cor
├── color-priority.ts           # Sistema priorização cores
├── color-descriptions.ts       # Banco descrições por cor
└── profession-colors.ts        # Mapeamento profissão→cores

components/
├── ProductCardWithSwatches.tsx # Card com bolinhas cor
├── ColorSwatchSelector.tsx     # Seletor cores PDP
└── ProductFilter.tsx           # Filtro com "Modelo"

scripts/
├── generate-color-pages.ts     # Gera 140 páginas
└── generate-sitemap.ts         # Gera sitemap 173 URLs

docs/
└── PROJETO-JALECA-CORES.md     # Este documento
```

### Arquivos a Modificar
```
app/
├── produto/[slug]/page.tsx     # Detectar cor no slug
├── produtos/page.tsx           # Grid expandido
└── [profissao]/page.tsx        # Layout mobile corrigido

lib/
├── graphql.ts                  # Query otimizada variações
├── product-professions.ts      # Balancear profissões
└── products.ts                 # Manter compatibilidade

components/
├── AnnouncementBar.tsx         # Remover inverno
├── TrustBadgeBar.tsx           # Corrigir frete
├── CartDrawer.tsx              # Corrigir frete
├── Footer.tsx                  # Corrigir frete
└── Header.tsx                  # Ajustes gerais
```

---

## ✅ CRITÉRIOS DE SUCESSO

### Técnicos
- [ ] 140 URLs de produto-cor funcionando
- [ ] 173 URLs no sitemap (33 mães + 140 filhas)
- [ ] 100% canonical tags corretos
- [ ] 100% schemas Product configurados
- [ ] 90%+ URLs indexadas no Google (30 dias)
- [ ] 0 erros de layout mobile
- [ ] Core Web Vitals mantidos (≥75)

### Conteúdo
- [ ] 140 descrições únicas escritas
- [ ] 0% textos com palavras AI_BLACKLIST
- [ ] 100% H1/H2 otimizados
- [ ] Todas profissões com ≥3 produtos
- [ ] Balanceamento masc/fem corrigido

### Negócio (após 30 dias)
- [ ] Conversão: +0.5pp mínimo (meta conservadora)
- [ ] CTR categoria→produto: +10pp mínimo
- [ ] Bounce rate: -10pp mínimo
- [ ] Faturamento: +15% mínimo
- [ ] Tráfego orgânico: +25% (cauda longa)

### Comunicação
- [ ] Banner inverno removido
- [ ] Frete grátis corrigido em 7 locais
- [ ] Mensagem padronizada em todo site

---

## 🚨 RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| **Thin content penaliza SEO** | Alta | Alto | Descrições únicas obrigatórias + canonical tags |
| **Core Web Vitals degradam** | Média | Alto | Lazy-load + code splitting + monitoramento |
| **Conversão não aumenta** | Baixa | Alto | Métricas em tempo real + rollback preparado |
| **Manutenção custosa** | Alta | Médio | Automatizar descrições com IA |
| **Clientes confundem cores** | Média | Médio | Nomenclatura clara + swatches visuais |
| **Google não indexa tudo** | Média | Médio | Indexação forçada manual das prioritárias |

---

## 🎯 DEFINIÇÃO DE "PRONTO"

Uma tarefa está **PRONTA** quando:

✅ Código implementado e testado  
✅ Layout mobile funcionando  
✅ Conteúdo revisado (sem AI_BLACKLIST)  
✅ SEO técnico configurado (canonical, schema)  
✅ Deploy em produção realizado  
✅ Métricas sendo rastreadas  
✅ Documentação atualizada  

---

## 📊 DASHBOARD DE MÉTRICAS

### Acompanhamento Semanal

**Técnicas:**
- URLs criadas: X/140
- URLs indexadas Google: X/173
- Canonical tags: X/140
- Schemas configurados: X/140

**Conteúdo:**
- Descrições escritas: X/140
- Profissões balanceadas: X/43
- Cores priorizadas: X/4 categorias

**Negócio:**
- Conversão: X% (Δ vs baseline)
- CTR cat→produto: X% (Δ vs baseline)
- Bounce rate: X% (Δ vs baseline)
- Faturamento: R$ X (Δ% vs mês anterior)

---

## 🔄 ROLLBACK PLAN

**Executar rollback SE:**
1. Conversão cair >0.5pp após 7 dias
2. Core Web Vitals cair >20%
3. Bugs críticos impedem checkout
4. Google penalizar por thin content

**Procedimento:**
1. Feature flag OFF (reverter para 33 produtos)
2. Remover 140 URLs do sitemap
3. Redirect 301 temporário: URLs cor → página mãe
4. Análise post-mortem
5. Decisão: ajustar e retentar OU cancelar

---

## 📝 PRÓXIMOS PASSOS

### Imediato (Hoje)
1. ✅ Projeto criado e aprovado
2. ⏳ Criar tasks detalhadas
3. ⏳ Definir responsáveis

### Semana 1
1. ⏳ Setup ambiente dev
2. ⏳ Criar estrutura de dados
3. ⏳ Primeiros componentes React

### Semana 2
1. ⏳ Escrever descrições (batch 1)
2. ⏳ Configurar SEO técnico
3. ⏳ Deploy staging

---

## 📞 STAKEHOLDERS

| Nome | Role | Responsabilidade |
|------|------|------------------|
| Rhammon | Product Owner | Aprovações finais |
| Claude | Tech Lead | Arquitetura e código |
| Gemini SEO | SEO Specialist | Conteúdo e otimização |
| Gemini Pro | Frontend Dev | UX e componentes |
| GPT-4.1 | Data Analyst | Métricas e insights |

---

## 📚 DOCUMENTAÇÃO RELACIONADA

- `FEATURE-PRODUTOS-POR-COR-BMAD.md` - Feature detalhada com BMAD
- `AGENTS.md` - Configuração do projeto
- `CLAUDE.md` - Instruções globais
- `lib/product-professions.ts` - Mapeamento profissões

---

**Projeto criado em:** 25/04/2026  
**Última atualização:** 25/04/2026  
**Status:** 🟢 APROVADO - Pronto para Execução

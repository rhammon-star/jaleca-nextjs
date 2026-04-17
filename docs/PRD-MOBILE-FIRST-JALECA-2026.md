# PRD — MOBILE FIRST: Melhor Mobile do Brasil para E-commerce de Jalecos

**Versao:** 1.0
**Data:** 17/04/2026
**Autores:** Claude (auditoria de codigo), MiniMax (benchmark concorrentes), Gemini (consideracoes SEO/CRO), GPT-4.1 (consideracoes UX/acessibilidade)
**Status:** Aprovado para implementacao
**Contexto:** 90% do publico da Jaleca chega via mobile. Score mobile atual: 3/10 (MiniMax). Nenhum concorrente tem mobile excelente — oportunidade de dominar o nicho.

---

## 1. DIAGNOSTICO CONSOLIDADO — ESTADO ATUAL

### 1.1 Auditoria de Fontes (Claude)

| Faixa | Instancias | Impacto |
|-------|-----------|---------|
| 8-9px | 3 | Badges decorativos — baixo impacto |
| 10px | 62 | CRITICO — badges produto, labels carrinho, form labels minha-conta, hero, footer |
| 11px | 61 | CRITICO — breadcrumb, announcement bar, trust badges, carrinho, checkout, produto |
| 12px (text-xs) | 336 | ALTO — helper text, labels, info secundaria em todo o site |
| 13px | 1 | Hero description |
| 14px (text-sm) | 288 | MODERADO — body text, descricoes |
| **Total < 16px** | **620** | **Maioria do texto secundario do site e ilegivel no mobile** |

**Arquivos mais afetados:**
- `components/ProductCard.tsx` — 6x text-[10px] (badges "MAIS VENDIDO", "PROMOCAO")
- `components/CartDrawer.tsx` — 9x text-[10px/11px] (detalhes dos itens)
- `app/minha-conta/MinhaContaClient.tsx` — 13x text-[10px] (labels de formulario)
- `app/produto/[slug]/ProductDetailClient.tsx` — 8x text-[11px] (specs produto)
- `components/Header.tsx` — 12x text-[10px/12px] (nav, maioria desktop-only)

### 1.2 Auditoria de Touch Targets (Claude)

| Categoria | Quantidade | Status |
|-----------|-----------|--------|
| Botoes >= 48px (WCAG AAA) | 8 | Excelente |
| Botoes 44-47px (WCAG AA) | 4 | Aceitavel |
| **Botoes < 44px (FALHA)** | **32** | CRITICO |
| **Compliance geral** | **27%** | REPROVADO |

**Elementos criticos abaixo de 44px:**
- Header: icones busca/wishlist/conta/carrinho = 36px (p-3)
- ProductCard: botoes wishlist/compare = 32px (w-8 h-8)
- CartDrawer: botoes +/- quantidade = 40px (w-10 h-10)
- CartDrawer: botao remover item = 20px (p-1.5)
- CartDrawer: botao remover cupom = 14px (so icone)
- CartDrawer: botao aplicar cupom = 36px (py-2)
- Header: hamburger/fechar menu = 28px (p-2)
- Produto: tabs info = 40px (py-3)

**Elementos que JA estao corretos:**
- "Adicionar a Sacola" = 56px (min-h-14) — EXCELENTE
- Seletor cor/tamanho = 48px (min-h-12/h-12) — BOM
- "Finalizar Compra" checkout = 48px (py-4) — BOM
- Links menu mobile = 44px (py-4) — BOM

### 1.3 Layout e Checkout (Claude)

| Area | Status | Detalhe |
|------|--------|---------|
| Checkout single-column | OK | `grid-cols-1 lg:grid-cols-[1fr_380px]` |
| Checkout CTA sticky | OK | `order-3` no mobile, sempre visivel |
| Produto sticky CTA | AUSENTE | Botao "Comprar" sai da tela ao rolar |
| Cart drawer full-width | OK | `min(420px, 100vw)` |
| Cart drawer footer sticky | OK | `flex-shrink-0` |
| Bottom nav bar | AUSENTE | Sem navegacao inferior no mobile |
| Header inline height | PROBLEMA | `height: '116px'` inline, nao responsivo |

### 1.4 PWA (Claude + Live Audit)

| Componente | Status |
|-----------|--------|
| manifest.json | 404 — AUSENTE |
| Service Worker | PARCIAL — so push notifications (sw.js), registrado apenas no BackInStockButton |
| theme-color | AUSENTE |
| apple-mobile-web-app-capable | AUSENTE |
| apple-mobile-web-app-status-bar-style | AUSENTE |
| Offline support | AUSENTE |
| Cache strategies | AUSENTE |
| Install prompt | AUSENTE |

### 1.5 Performance (Live Audit)

| Metrica | Valor | Veredito |
|---------|-------|----------|
| HTML size | ~850KB | CRITICO — RSC streaming payload inflando |
| TTFB | 295ms | EXCELENTE (Vercel edge) |
| Fontes | Self-hosted WOFF2 + preload | BOM |
| Scripts | Todos async/lazyOnload | BOM |
| CSS bundle | Single chunk | BOM |
| Hero preload | Separado mobile/desktop | BOM |

### 1.6 Benchmark Concorrentes (MiniMax)

| Posicao | Site | Nota | Maior problema |
|---------|------|------|----------------|
| 1 | dublanc.com.br | 6/10 | Sem srcset |
| 1 | amodabranca.com.br | 6/10 | HTML 1.44MB |
| 1 | namastemodabranca.com.br | 6/10 | Checkout 404 |
| 4 | jalecosconforto.com.br | 5/10 | HTML 705KB |
| 5 | dracherie.com.br | 4/10 | Viewport conflitante |
| 5 | belladoctor.com.br | 4/10 | Sem CDN, TTFB 1s |
| 5 | rbroupabranca.com.br | 4/10 | Fonte 10px |
| 8 | reidosjalecos.com.br | 3/10 | HTML 4.3MB |
| 8 | **Jaleca** | **3/10** | **Fonte 10-11px** |

**Conclusao: TODOS os concorrentes tem mobile ruim. Quem corrigir primeiro domina o nicho.**

---

## 2. CONSIDERACOES POR AGENTE

### 2.1 Claude (Codigo/Engenharia)

**Validacao do relatorio MiniMax:**
- Contagem de fontes CONFIRMADA — 62x text-[10px] e 61x text-[11px] estao no codigo
- Touch targets PIOR que o relatado — encontrei 32 elementos abaixo de 44px, nao "ZERO" como MiniMax reportou (ZERO era para min-h-[44px] explicito, mas muitos botoes tem padding suficiente)
- PWA CONFIRMADA ausente — manifest.json retorna 404, SW so para push
- HTML 850KB e mais grave que os 218KB do relatorio original — RSC streaming payload nao foi contado antes

**Correcoes tecnicas:**
- Usar Tailwind responsive prefixes `text-xs md:text-xs` -> `text-sm md:text-xs` para inverter a escala (mobile maior)
- Touch targets: trocar `p-2` por `p-3`, `w-8 h-8` por `w-11 h-11`, `w-10 h-10` por `w-12 h-12`
- Header height inline `116px` deve virar classe Tailwind responsiva
- Sticky CTA no produto: usar `fixed bottom-0` com `safe-area-inset-bottom` para iPhone
- PWA: `next-pwa` ou manual manifest + workbox para cache strategies

### 2.2 Gemini (SEO/Conteudo)

**Impacto SEO do mobile ruim:**
- Google usa Mobile-First Indexing — o que o Googlebot ve no mobile e o que indexa
- Core Web Vitals mobile afetam ranking diretamente
- HTML de 850KB penaliza TTFB e FCP em 3G/4G — afeta INP e LCP
- Fontes ilegíveis = bounce rate alto = sinal negativo de engajamento
- Touch targets pequenos = CLS potencial (toques acidentais causam layout shifts)

**Oportunidade SEO:**
- PWA com manifest.json gera rich install banner — aumenta brand recall
- Service Worker com cache offline melhora Speed Index em visitas recorrentes
- `theme-color` meta melhora aparencia nos resultados de busca (Android)
- Bottom nav com link para categorias melhora crawlability e internal linking

### 2.3 GPT-4.1 (UX/Acessibilidade)

**WCAG 2.1 — Compliance atual:**
- Level A: REPROVADO (32 touch targets < 44px)
- Level AA: REPROVADO
- Level AAA: REPROVADO
- Contraste: nao auditado neste PRD, mas `text-muted-foreground` em 10-11px e risco

**Padroes de UX mobile que faltam:**
1. **Sticky Add-to-Cart** — padrao universal em e-commerce mobile (Amazon, Shopee, Mercado Livre)
2. **Bottom Navigation** — reduz friccao de navegacao em 40% (estudo NNGroup)
3. **Thumb Zone** — 75% dos toques mobile estao na zona inferior da tela. CTAs primarios devem estar la
4. **Progressive Disclosure** — informacoes secundarias (SKU, specs tecnicas) devem estar em accordion, nao inline
5. **Input zoom prevention** — inputs com font < 16px causam zoom automatico no iOS Safari

**Alerta critico — iOS Safari:**
Qualquer `<input>` ou `<select>` com `font-size < 16px` causa zoom automatico no iOS Safari. Isso afeta:
- Campo CEP no ShippingCalculator
- Campo cupom no CartDrawer
- Todos os campos do checkout
- Campos de login/cadastro

### 2.4 MiniMax (Benchmark/Estrategia)

**Oportunidade unica identificada:**
- ZERO concorrentes tem PWA
- ZERO concorrentes tem fonte >= 16px consistente
- ZERO concorrentes tem touch targets 48px
- Melhor concorrente: dublanc (6/10) — ainda muito ruim

**Meta realista:**
- Jaleca 3/10 -> 8/10 em 4 semanas = melhor mobile do nicho por margem absurda
- Nao precisa ser perfeito, precisa ser MUITO melhor que 6/10 (dublanc)
- PWA e o diferencial de longo prazo — repeat visitors, "instalar app", cache offline

---

## 3. PLANO DE IMPLEMENTACAO

### FASE 1 — TIPOGRAFIA MOBILE (Semana 1) — IMPACTO IMEDIATO

**Objetivo:** Eliminar TODOS os textos < 14px no mobile. Meta: 0 elementos < 14px.

#### 1.1 Regra global de fonte minima

```css
/* app/globals.css — adicionar */
@media (max-width: 767px) {
  /* Previne zoom automatico no iOS Safari */
  input, select, textarea {
    font-size: 16px !important;
  }
}
```

#### 1.2 Substituicoes por arquivo

**Principio:** No mobile, texto decorativo (badges, labels uppercase) sobe de 10px para 11-12px. Texto informativo (precos, detalhes, breadcrumb) sobe de 11px para 13-14px. Texto de leitura (body, descricoes) permanece 14px+ (text-sm).

| Arquivo | De | Para | Elementos |
|---------|-----|------|-----------|
| `components/ProductCard.tsx` | text-[10px] | text-[11px] md:text-[10px] | Badges MAIS VENDIDO, PROMOCAO |
| `components/CartDrawer.tsx` | text-[10px] | text-[12px] md:text-[10px] | Cor/tamanho item, notas |
| `components/CartDrawer.tsx` | text-[11px] | text-[13px] md:text-[11px] | Detalhes carrinho |
| `components/Breadcrumb.tsx` | text-[11px] | text-[13px] md:text-[11px] | Breadcrumb |
| `components/AnnouncementBar.tsx` | text-[11px] | text-[13px] md:text-[11px] | Banner topo |
| `components/TrustBadgeBar.tsx` | text-[11px] | text-[13px] md:text-[11px] | Trust badges |
| `components/ShippingCalculator.tsx` | text-[11px] | text-[13px] md:text-[11px] | Prazo entrega |
| `app/minha-conta/MinhaContaClient.tsx` | text-[10px] | text-[12px] md:text-[10px] | Form labels |
| `app/produto/[slug]/ProductDetailClient.tsx` | text-[11px] | text-[13px] md:text-[11px] | Specs produto |
| `app/checkout/CheckoutClient.tsx` | text-[11px] | text-[13px] md:text-[11px] | Resumo pedido |
| `components/Footer.tsx` | text-[10px] | text-[12px] md:text-[10px] | Headers footer |
| `components/GoogleReviewsSection.tsx` | text-[10px/11px] | text-[12px] md:text-[10px] | Reviews |
| `components/CategoryCard.tsx` | text-[10px] | text-[11px] md:text-[10px] | Labels categoria |
| `app/page.tsx` | text-[10px]/text-[13px] | text-[12px]/text-[15px] md:text-[10px]/text-[13px] | Hero |
| `components/UrgencyToast.tsx` | text-[10px/11px] | text-[12px/13px] | Urgencia estoque |

#### 1.3 Reducao de letter-spacing no mobile

Textos `uppercase tracking-widest` em 10-11px ficam opticamente ainda menores. No mobile:

```
tracking-widest (0.1em) -> tracking-wider (0.05em) ou tracking-wide (0.025em)
```

Aplicar via `tracking-widest md:tracking-widest` -> `tracking-wider md:tracking-widest`

**Metricas de sucesso Fase 1:**
- 0 elementos text < 14px no mobile (exceto badges decorativos de 1-2 caracteres)
- 0 inputs com font < 16px (prevencao zoom iOS)
- Bounce rate mobile: monitorar reducao em 7 dias

---

### FASE 2 — TOUCH TARGETS (Semana 1-2) — ACESSIBILIDADE

**Objetivo:** 100% dos elementos interativos >= 44px. Meta WCAG AA compliance.

#### 2.1 Correcoes por prioridade

**PRIORIDADE CRITICA (afeta conversao):**

| Arquivo | Elemento | De | Para |
|---------|----------|-----|------|
| `Header.tsx:64` | Hamburger menu | p-2 (28px) | p-3 (46px) |
| `Header.tsx:191-225` | Icones busca/wishlist/conta/carrinho | p-3 (36px) | p-3 min-h-[44px] min-w-[44px] |
| `Header.tsx:266` | Fechar menu mobile | p-2 (28px) | p-3 (46px) |
| `ProductCard.tsx:138,152` | Wishlist/Compare icons | w-8 h-8 (32px) | w-11 h-11 (44px) |
| `CartDrawer.tsx:147` | Fechar carrinho (X) | p-2 (28px) | p-3 min-h-[44px] |
| `CartDrawer.tsx:240,248` | Quantidade +/- | w-10 h-10 (40px) | w-11 h-11 (44px) |
| `CartDrawer.tsx:256` | Remover item (lixeira) | p-1.5 (20px) | p-2.5 min-h-[44px] min-w-[44px] |
| `CartDrawer.tsx:284` | Remover cupom (X) | 14px | wrapper min-h-[44px] min-w-[44px] |
| `CartDrawer.tsx:304` | Aplicar cupom | py-2 (36px) | py-3 (44px) |

**PRIORIDADE ALTA (UX):**

| Arquivo | Elemento | De | Para |
|---------|----------|-----|------|
| `ProductDetailClient.tsx:847` | Tabs produto | py-3 (40px) | py-4 (48px) |

#### 2.2 Regra de implementacao

Para botoes de icone (sem texto), usar wrapper com area de toque invisivel:

```tsx
{/* Padrao: icone pequeno visual, area de toque grande */}
<button className="flex items-center justify-center min-h-[44px] min-w-[44px] -m-2">
  <Icon size={18} />
</button>
```

Isso mantem o visual compacto mas expande a area clicavel.

**Metricas de sucesso Fase 2:**
- 0 elementos interativos < 44px
- WCAG 2.1 Level AA para touch targets
- Monitorar ContentSquare: reducao em "rage clicks" e "dead clicks"

---

### FASE 3 — STICKY CTA + BOTTOM NAV (Semana 2) — CONVERSAO

**Objetivo:** CTA "Comprar" sempre visivel no produto. Navegacao principal acessivel com polegar.

#### 3.1 Sticky Add-to-Cart no produto

```tsx
{/* Aparece quando botao original sai da viewport */}
<div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
  <div className="flex items-center gap-3">
    <div className="flex-1">
      <p className="text-sm font-semibold truncate">{product.name}</p>
      <p className="text-base font-bold">{formatPrice(price)}</p>
    </div>
    <button className="flex-shrink-0 bg-ink text-background px-6 py-3 min-h-[48px] text-xs font-semibold tracking-widest uppercase">
      COMPRAR
    </button>
  </div>
</div>
```

**Detalhes:**
- Usar IntersectionObserver no botao original — sticky aparece quando original sai da tela
- `env(safe-area-inset-bottom)` para iPhone com notch/Dynamic Island
- Mostrar nome + preco + botao — contexto completo sem scroll

#### 3.2 Bottom Navigation (mobile-only)

```
[Home]  [Categorias]  [Busca]  [Sacola]  [Conta]
```

**Especificacoes:**
- `fixed bottom-0` com `z-[90]` (abaixo do sticky CTA do produto que e z-50)
- Cada item: `min-h-[56px]` com icone 20px + label 10px
- `pb-[env(safe-area-inset-bottom)]` para iPhone
- Oculto no checkout (nao distrair)
- Badge de quantidade no icone Sacola
- `md:hidden` — so mobile

**Consideracao GPT-4.1:** Bottom nav e opcional para e-commerce. A prioridade e o sticky CTA no produto. Bottom nav pode ser Fase 4 se o sticky CTA ja melhorar a conversao.

**Metricas de sucesso Fase 3:**
- Taxa de adicao ao carrinho mobile: monitorar aumento
- Scroll depth na pagina de produto: deve diminuir (compra mais rapida)

---

### FASE 4 — PWA (Semana 3-4) — DIFERENCIAL COMPETITIVO

**Objetivo:** Site instalavel como app, cache offline, experience nativa.

#### 4.1 manifest.json

Criar `public/manifest.json`:
```json
{
  "name": "Jaleca - Uniformes Medicos",
  "short_name": "Jaleca",
  "description": "Jalecos, dolmas e conjuntos para profissionais da saude",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1a1a1a",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["shopping", "health"],
  "screenshots": [
    { "src": "/screenshots/home-mobile.webp", "sizes": "390x844", "type": "image/webp", "form_factor": "narrow" }
  ]
}
```

#### 4.2 Meta tags em layout.tsx

```tsx
<meta name="theme-color" content="#1a1a1a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="manifest" href="/manifest.json" />
```

#### 4.3 Service Worker (expandir sw.js)

Estrategias de cache:
- **Cache First:** fontes WOFF2, icones, imagens de produto (raramente mudam)
- **Stale While Revalidate:** HTML de paginas, CSS bundle, JS chunks
- **Network First:** API calls (carrinho, precos, estoque — devem ser frescos)
- **Offline fallback:** pagina `/offline` com logo + "Sem conexao. Tente novamente."

Usar Workbox (via `next-pwa` ou manual) para gerar precache manifest automaticamente.

#### 4.4 Install prompt

Componente `InstallPrompt.tsx`:
- Detecta `beforeinstallprompt` event
- Mostra banner discreto apos 2a visita: "Instale o app Jaleca no seu celular"
- Armazena dismissal em localStorage por 30 dias

**Consideracao Gemini:** PWA install prompt melhora branded search — usuarios que instalam voltam 2-3x mais. Impacto indireto no SEO via sinais de engajamento.

**Metricas de sucesso Fase 4:**
- Lighthouse PWA score: 0 -> 100
- Install rate: monitorar quantos instalam
- Repeat visit rate mobile: monitorar aumento

---

### FASE 5 — PERFORMANCE HTML (Semana 3-4) — VELOCIDADE

**Objetivo:** Reduzir HTML de 850KB para < 300KB.

#### 5.1 Diagnostico

O HTML de 850KB vem do RSC (React Server Components) streaming payload. Next.js 16 injeta dados serializados no HTML para hydration.

**Causas provaveis:**
- Dados de produto completos (30 produtos x variações) sendo serializados na homepage
- Dados de reviews Google completos no HTML
- Blog posts data no HTML

#### 5.2 Solucoes

1. **Paginar dados server-side** — homepage nao precisa de 30 produtos, mostrar 8-12
2. **Client-side data fetching para below-the-fold** — reviews, depoimentos, blog devem ser fetched client-side
3. **Limitar variações no response** — nao enviar todas as 559 variações para o browser
4. **React.lazy + Suspense** — componentes abaixo do fold (Reviews, Depoimentos, Blog) carregam depois
5. **Compression** — verificar se Vercel esta servindo com Brotli (deve estar por padrao)

**Metricas de sucesso Fase 5:**
- HTML size: 850KB -> < 300KB
- LCP mobile: < 2.5s
- FCP mobile: < 1.8s

---

## 4. CRONOGRAMA

| Semana | Fase | Entregas | Impacto esperado |
|--------|------|----------|------------------|
| 1 | Fase 1 + 2 | Fontes corrigidas + touch targets | Bounce rate -15%, compliance WCAG AA |
| 2 | Fase 3 | Sticky CTA + (opcional) bottom nav | Conversao mobile +10-20% |
| 3 | Fase 4 | PWA completa | Install rate, repeat visitors +20% |
| 3-4 | Fase 5 | HTML otimizado | LCP < 2.5s, PageSpeed 85+ |

---

## 5. METRICAS GLOBAIS

| Metrica | Atual | Meta 30 dias | Meta 90 dias |
|---------|-------|-------------|-------------|
| Nota mobile MiniMax | 3/10 | 8/10 | 9/10 |
| PageSpeed mobile | ~64-72 | 85+ | 90+ |
| Lighthouse PWA | 0 | 100 | 100 |
| WCAG touch compliance | 27% | 100% | 100% |
| Elementos font < 14px | 134 | 0 | 0 |
| CTR mobile (GSC) | 4.8% | 6% | 7-8% |
| Bounce rate mobile | ? | -15% | -25% |
| Conversao mobile | ? | +15% | +30% |
| HTML size | ~850KB | < 400KB | < 300KB |

---

## 6. RISCOS E MITIGACOES

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|--------------|---------|-----------|
| Fonte maior quebra layout em telas pequenas (320px) | Media | Alto | Testar em iPhone SE (320px) + Galaxy Fold |
| Sticky CTA sobrepoe conteudo importante | Baixa | Medio | Padding-bottom no body quando sticky visivel |
| PWA Service Worker cacheia dados desatualizados | Media | Alto | Network First para APIs, versioning no SW |
| HTML reduction quebra hydration | Baixa | Alto | Testar SSR vs CSR em staging antes de deploy |
| Bottom nav conflita com CompareBar/CookieConsent | Alta | Medio | Z-index hierarchy: cookie(150) > compare(90) > bottomnav(80) |

---

## 7. REGRAS DE IMPLEMENTACAO

1. **Mobile-first sempre:** escrever a classe mobile primeiro, depois `md:` para desktop
2. **Testar em 3 devices:** iPhone SE (320px), iPhone 14 (390px), Galaxy S23 (360px)
3. **iOS Safari obrigatorio:** todo `fixed bottom-0` deve ter `pb-[env(safe-area-inset-bottom)]`
4. **Nenhum input < 16px:** previne zoom automatico no iOS Safari
5. **ContentSquare:** monitorar heatmaps e rage clicks apos cada fase
6. **Deploy por fase:** cada fase e um deploy separado com monitoramento de 2-3 dias antes da proxima
7. **Rollback plan:** feature flags nao sao necessarias — Git revert e suficiente para mudancas CSS/layout

---

## 8. VALIDACAO POS-IMPLEMENTACAO

Apos cada fase, rodar:
1. **Lighthouse mobile** — Performance, Accessibility, Best Practices, PWA
2. **PageSpeed Insights** — Core Web Vitals reais (CrUX data)
3. **axe DevTools** — audit de acessibilidade completa
4. **ContentSquare** — heatmaps, session recordings, zone-based analytics
5. **GSC** — CTR mobile, posicao media, impressoes
6. **GA4** — bounce rate mobile, conversao mobile, session duration

---

## RESUMO EXECUTIVO

```
JALECA MOBILE — DE 3/10 PARA 8/10 EM 4 SEMANAS

Problema:   90% do publico e mobile, nota 3/10
Causa raiz: 620 textos < 16px, 32 botoes < 44px, sem PWA, HTML 850KB
Solucao:    5 fases progressivas (fonte > touch > sticky > PWA > HTML)
Diferencial: ZERO concorrentes tem mobile bom — dominar nicho inteiro
Investimento: 4 semanas de desenvolvimento
ROI esperado: +30% conversao mobile em 90 dias
```

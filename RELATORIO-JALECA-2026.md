# RELATÓRIO COMPLETO — JALECA 2026
### Compilado em: 2026-04-04
### Arquivos: ANALISE-JALECA-2026.md + CRO-SALES-ANALYSIS.md

---

## PARTE 1 — RESUMO EXECUTIVO

**Investimento até agora:** R$50k+ em IA
**Posição:** Mid-premium (R$280-350), design mais sofisticado do segmento, infraestrutura técnica superior
**Site:** jaleca.com.br | Stack: Next.js 16 + React 19 + TypeScript + Tailwind v3.4 + WooCommerce GraphQL

### O que está EXCELENTE:
- Infraestrutura técnica (SEO, performance, Core Web Vitals)
- Design premium (tipografia, cores, layout)
- Integrações (PIX/Boleto/Cartão, Brevo, GA4, Meta Pixel, Meta CAPI)
- Blog CMS com IA (Gemini)
- Programa de fidelidade (1 ponto/R$1)
- Virtual try-on, Size advisor, Wishlist, Compare

### O que está FALTANDO (gap competitivo):
1. **Programa de fidelidade visível** — Dr. Charm tem cashback 10%, Jaleca tem mas não mostra ao cliente
2. **Reviews na página de produto** — schema existe mas não aparece na UI
3. **Reviews com foto** — Dr. Charm, Jalecos Conforto têm
4. **Urgência/escasez** — nenhum "últimas unidades", countdown, edição limitada
5. **Desconto PIX explícito** — não aparece no checkout de forma destacada
6. **Trust badges na homepage** — SSL, Troca 30 dias, Frete Grátis não visíveis
7. **Categorias gender-split** — `/categoria/jaleco-feminino` não existe
8. **FAQ page** — schema existe mas não tem página própria
9. **Carrinho abandonado** — estrutura pronta mas emails não automatizados
10. **Blog** — só 10 posts (meta: 30+)

---

## PARTE 2 — DIAGNÓSTICO DE CONVERSÃO (CRO)

### 2.1 Por que o cliente NÃO compra?

| Objeção | evidência | Solução |
|---------|-----------|---------|
| "Não sei se fica bem" | Ausência de reviews com foto na página | Adicionar reviews + virtual try-on |
| "E se não servir?" | Sem "troca fácil" visível | Trust badges: "Troca em 30 dias" |
| "Frete é caro" | Sem threshold de frete grátis | Frete grátis progressivo |
| "É seguro?" | Sem badges na homepage | Adicionar SSL, Google Safe, Compra Segura |
| "Não conheço a marca" | Sem provas sociais extensas | + depoimentos, fotos reais, números |
| "O preço é alto" | Copy transacional não justifica | Storytelling emocional, benefícios |
| "Não tenho certeza do tamanho" | Size advisor não funciona (bug) | Fix alinhamento Size Advisor |
| "E se eu encontrar mais barato?" | Sem programa de fidelidade | Club Jaleca visível |

### 2.2 Pontos de abandono

| Ponto | Taxa estimada | Solução |
|-------|--------------|---------|
| Homepage → Produto | ~60% | Hero mais focado em CTA |
| Produto → Carrinho | ~70% (indústria) | Prova social mais visível, urgencia |
| Carrinho → Checkout | ~65% (indústria) | Free shipping threshold, trust badges |
| Checkout → Pagamento | ~20% (PIX mais alto) | Destacar desconto PIX |

### 2.3 Gatilhos de conversão ausentes

| Gatilho | Status atual | Implementar |
|---------|-------------|------------|
| Escassez (estoque baixo) | ❌ Ausente | "Apenas 3 unidades" quando < 5 |
| Urgência (countdown) | ❌ Ausente | Promoção com tempo limitado |
| Prova social (reviews na página) | ⚠️ Schema existe, UI não | Mostrar estrelas + count + excerpt |
| Garantia forte | ⚠️ "Troca em 30 dias" existe mas não visível | Badge perto do CTA |
| Frete grátis progressivo | ❌ Ausente | "Faltam R$XX para frete grátis" |
| Email capture | ❌ Ausente | Popup de desconto na saída |
| Cupom de primeira compra | ❌ Ausente | 5-10% primeiro pedido |
| Programa de fidelidade | ⚠️ Existe mas cliente não vê | Banner "Você tem X pontos" |

---

## PARTE 3 — HOMEPAGE ATUAL vs. IDEAL

### 3.1 Homepage ATUAL (O que existe)

```
✅ HERO: "Elegância clínica em cada detalhe" + CTA
✅ PROVA SOCIAL: 3 depoimentos
✅ CATEGORIAS: Jalecos / Scrubs / newborn?
✅ DESTAQUES: 8 produtos em grid
✅ VIRTUAL TRY-ON: CTA "Experimente Antes de Comprar"
✅ DIFERENCIAIS: Tecidos Premium, Tamanhos, Estilo, Garantia
✅ FOOTER: Formas de pagamento, SSL, links
❌ SEM: Trust badges na homepage (SSL, Compra Segura, Troca 30 dias)
❌ SEM: Free shipping progress bar
❌ SEM: Urgência/escasez
❌ SEM: Contagem de pontos Club Jaleca
❌ SEM: Reviews agregados visíveis (só 3 depoimentos)
❌ SEM: Newsletter com cupom de desconto
```

### 3.2 Homepage IDEAL (O que adicionar)

```
┌─────────────────────────────────────────────────────────┐
│  🔔 BARRA: "Ganhe 5% no PIX +Frete Grátis >R$299"    │
├─────────────────────────────────────────────────────────┤
│  LOGO    [Busca...]    [Club: 127 pts] [♥] [👤] [🛒]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "Elegância clínica em cada detalhe"                   │
│  "O jaleco que trabalha tão duro quanto você"         │
│                                                         │
│  Subheadline: Jalecos premium com tecido               │
│  anti-microbial para profissionais que não            │
│  se contentam com o básico.                           │
│                                                         │
│  [Ver Novidades 2026]  [Explorar Coleção]            │
│                                                         │
│            [HERO IMAGE]                               │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ⭐ 4.9/5 (387 avaliações) │ 2.847+ profissionais    │
│  │    🔒 Compra 100% Segura  │  🚚 Frete >R$299    │
└─────────────────────────────────────────────────────────┘

SEÇÃO 2: TRUST BADGES
┌─────────────────────────────────────────────────────────┐
│  🔒    💳    🚚    ↩️    ⭐                          │
│  SSL    Pague  Frete  Troca  Avaliações              │
│  Seguro 3x s/ juros Grátis 30 dias 4.9/5             │
└─────────────────────────────────────────────────────────┘

SEÇÃO 3: FREE SHIPPING PROGRESS
┌─────────────────────────────────────────────────────────┐
│  🚚 Faltam R$47 para Frete Grátis!                    │
│  [███████████████░░░░░░░░] R$252 / R$299             │
│  [Adicionar ao carrinho]                               │
└─────────────────────────────────────────────────────────┘

SEÇÃO 4: HERO CATEGORIAS
┌──────────────┬──────────────┬──────────────┐
│  JALECOS    │    SCRUBS    │  PERSONALIZADO│
│  R$280-350  │  R$199-280  │   Bordado R$ │
│  [Ver →]    │   [Ver →]    │   20-50      │
│              │              │   [Ver →]    │
└──────────────┴──────────────┴──────────────┘

SEÇÃO 5: MAIS VENDIDOS
┌─────────────────────────────────────────────────────────┐
│  🔥 OS MAIS VENDIDOS                                  │
│  [produto] [produto] [produto] [produto]             │
└─────────────────────────────────────────────────────────┘

SEÇÃO 6: POR QUE JALECA
┌─────────────────────────────────────────────────────────┐
│  Tecido Anti-Microbial │ Tamanhos PP-G3 │ Estilo       │
│  [detalhe]            │ [detalhe]       │ [detalhe]  │
└─────────────────────────────────────────────────────────┘

SEÇÃO 7: AVALIAÇÕES SELECIONADAS
┌─────────────────────────────────────────────────────────┐
│  ⭐⭐⭐⭐⭐ "O melhor jaleco que já tive..."           │
│  Dra. Ana Carolina, Ginecologista, São Paulo          │
│  [Ver todas as 387 avaliações →]                      │
└─────────────────────────────────────────────────────────┘

SEÇÃO 8: BLOG RECENTES
┌─────────────────────────────────────────────────────────┐
│  Leia também: [post] [post] [post]                    │
└─────────────────────────────────────────────────────────┘

SEÇÃO 9: CTA FINAL
┌─────────────────────────────────────────────────────────┐
│  "Pronto para elevar seu padrão profissional?"         │
│  [Ver toda a coleção →]                               │
└─────────────────────────────────────────────────────────┘

FOOTER:
┌─────────────────────────────────────────────────────────┐
│  📧 NEWSLETTER: "Ganhe 10% no primeiro pedido"         │
│  [email] [CADASTRAR]                                  │
└─────────────────────────────────────────────────────────┘
```

---

## PARTE 4 — PÁGINA DE PRODUTO: ALTERAÇÕES NECESSÁRIAS

### 4.1 O que existe agora:
```
✅ Título do produto
✅ Galeria de imagens
✅ Seleção de cor (swatches)
✅ Seleção de tamanho (PP-G3)
✅ Preço + PIX discount + parcelamento
✅ Size Advisor (bug de alinhamento)
✅ Virtual Try-On
✅ Add to cart
✅ Wishlist
✅ Compare
✅ Breadcrumbs
✅ Descrição + especificações técnicas
✅ FAQ schema (mas FAQ não aparece na UI)
✅ aggregateRating schema (mas não mostra)
✅ Variações
❌ SEM: Reviews visíveis (estrelas, count, excerpt)
❌ SEM: Trust badges perto do CTA ("Troca 30 dias", "Frete Grátis")
❌ SEM: Urgência ("Apenas 3 disponíveis")
❌ SEM: Cross-sells ("Combine com...")
❌ SEM: Countdown de promoção
❌ SEM: Guia de tamanho inline (texto + tabela)
```

### 4.2 O que adicionar:

```
┌──────────────────────────────────────────────────────────┐
│  ⭐⭐⭐⭐⭐ 4.9/5 (23 avaliações) [Ver todas ↓]      │
│                                                          │
│  R$ 350,00                                              │
│  ou 3x de R$ 116,67 sem juros                         │
│  💳 5% PIX                                              │
│                                                          │
│  ✓ Compra 100% Segura                                  │
│  ✓ Frete Grátis acima de R$299                        │
│  ✓ Troca em 30 dias                                    │
│  ✓ Envio Imediato                                      │
│                                                          │
│  COR: [●] [●] [●]                                     │
│                                                          │
│  TAMANHO: [PP] [P] [M] [G] [GG] [G1] [G2] [G3]     │
│  📏 Não sabe seu tamanho? [Guia de Medidas]            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          [COMPRAR AGORA — R$ 350,00]           │  │
│  │           ou 3x sem juros                       │  │
│  └──────────────────────────────────────────────────┘  │
│  [♥ Adicionar à Lista]                                │
│                                                          │
│  🔥 Apenas 4 unidades em estoque                       │
│  ⏰ Promoção termina em: 23:59:47                     │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  PERGUNTAS FREQUENTES                                 │
│  ▶ Como escolher o tamanho? (expand)                   │
│  ▶ Posso lavar na máquina? (expand)                    │
│  ▶ Tem garantia? (expand)                              │
│  ▶ Como funciona a troca? (expand)                     │
├──────────────────────────────────────────────────────────┤
│  QUEM VIU TAMBÉM VIU                                   │
│  [produto] [produto] [produto] [produto]              │
├──────────────────────────────────────────────────────────┤
│  COMPLETE O LOOK                                       │
│  [scrub] [calça] [accessório]  [+R$199] [Ver]        │
└──────────────────────────────────────────────────────────┘
```

---

## PARTE 5 — COPY QUE VENDE (RECOMENDAÇÕES)

### 5.1 Hero Headline — ATUAL vs. RECOMENDADO

**ATUAL:**
"Elegância clínica em cada detalhe"

**RECOMENDADO (escolher um):**
1. "O jaleco que trabalha tão duro quanto você"
2. "Profissional desde a primeira impressão"
3. "O jaleco que sua colega de plantão vai perguntar onde você comprou"
4. "Para quem sabe que cada detalhe importa — e cada paciente percebe"

### 5.2 Descrição de Produto — ATUAL vs. RECOMENDADO

**ATUAL:**
> "Jaleco Slim Princesa Laise Feminino. Tecido Gabardine Premium com elastano..."

**RECOMENDADO:**
> **O Jaleco que trabalha tão duro quanto você.**
>
> Plantão de 12 horas? O Jaleco Slim Princesa Laise foi desenvolvido para profissionais que não podem parar — e não podem perder o caimento impecável.
>
> Seu tecido Gabardine Premium com tecnologia anti-microbial neutraliza odores mesmo após horas de uso. Sem precisar trocar, sem perder o profissionalismo.
>
> O corte slim valoriza o corpo sem apertar. Acompanha seus movimentos do primeiro café da manhã ao último plantão.
>
> **Ideal para:** médicas, enfermeiras, dentistas, fisioterapeutas e todas as profissionais que sabem: a vestimenta é parte do cuidado.
>
> • Anti-microbial: neutraliza odores em plantões longos
> • Gabardine Premium: não amassa, não desbota, não precisa passar
> • Corte slim: caimento que valoriza sem limitar
> • Tamanhos PP ao G3: para todos os tipos de corpo
> • Fabricação própria: rigoroso controle de qualidade

### 5.3 CTAs — ATUAL vs. RECOMENDADO

| LOCAL | ATUAL | RECOMENDADO |
|-------|-------|-------------|
| Hero botão 1 | "Ver Novidades" | "Ver Novidades 2026 →" |
| Hero botão 2 | "Explorar Coleção" | "Escolher meu Jaleco →" |
| Produto | "Comprar" | "Comprar Agora — R$350" |
| Carrinho vazio | (nada) | "Ver nossas novidades" |
| Footer newsletter | "Cadastrar" | "Ganhar 10% off" |

### 5.4 Objeções — Textos para Quebrar

| Objeção | Copy de resposta |
|---------|-----------------|
| "E se não servir?" | "Troca em 30 dias, sem burocracia. E se não servir, a gente troca." |
| "É seguro?" | "Compra 100% Segura. Seus dados protegidos por SSL. Pague com PIX, cartão ou boleto." |
| "O frete é caro?" | "Frete grátis para pedidos acima de R$299. Para todo o Brasil." |
| "Demora a chegar?" | "Envio imediato. Para Belo Horizonte: 1-2 dias úteis. Para SP: 2-3 dias." |
| "É muito caro?" | "A partir de R$280, em até 6x sem juros. Masccorrencias: um jaleco Jaleca dura anos. O outro, meses." |
| "Não sei escolher o tamanho" | "Use nosso guia interactivo — mede em 2 minutos, acerta na primeira." |

---

## PARTE 6 — GATILHOS DE CONVERSÃO (IMPLEMENTAR)

| Gatilho | Como implementar | Prioridade |
|---------|-----------------|------------|
| **Escassez real** | API WooCommerce retorna `stock_quantity`. Se <= 5, mostrar "Apenas X unidades" | 🔴 ALTA |
| **Urgência de tempo** | Promoção com countdown. Criar campo `promotion_ends` no WooCommerce. Mostrar timer se ativa | 🟠 MÉDIA |
| **Prova social de verdade** | Adicionar reviews com foto ao produto. Email pós-compra pedindo avaliação com foto | 🔴 ALTA |
| **Garantia visível** | Badge "Troca em 30 dias" perto do botão de compra | 🔴 ALTA |
| **Frete grátis progressivo** | `CartDrawer` mostra progresso: "Faltam R$XX para Frete Grátis". Ao atingir, animação de celebração | 🟠 MÉDIA |
| **Email capture com incentivo** | Exit-intent popup: "Esqueceu algo? Ganhe 5% off com PIX no seu primeiro pedido" | 🟡 MÉDIA |
| **Cupom de primeira compra** | Não é coupon — é discount automático no checkout para novos clientes (via Meta Pixel identificar) | 🟡 MÉDIA |
| **Contagem de pontos** | Banner "Você tem 127 pontos (R$6,35 de desconto)" visível no header para membros | 🟡 MÉDIA |
| **PIX discount explícito** | Mostrar "5% PIX" em destaque verde, não só como texto pequeno | 🔴 ALTA |
| **Social proof do header** | "⭐ 4.9/5 — 387 avaliações" visível no topo | 🟠 MÉDIA |
| **Reviews na página de produto** | aggregateRating com estrelas + "Veja todas as X avaliações" | 🔴 ALTA |

---

## PARTE 7 — FUNIL DE VENDAS

### 7.1 Fluxo atual vs. Ideal

**ATUAL:**
```
Visitante → Homepage → Produto → Carrinho → Checkout → Pagamento → Confirmação
                                                    ↑
                                         Carrinho abandonado
                                         (estrutura pronta mas
                                          emails não automatizados)
```

**IDEAL:**
```
Visitante → Homepage → Produto → Carrinho → Checkout → Pagamento → Confirmação
     ↑                                                              ↓
     └─── Exit-intent popup (5% off)                    Email pós-compra
                                                        (avaliação + foto)
     ↑                                                              ↓
     └─── Retargeting ads (Meta/Google)            Review solicitation
     ↑                                                    ↓
     └─── Email recovery (1h, 24h, 72h)        Cliente volta → recompra
     ↑
     └─── Club Jaleca points (próxima compra com desconto)
```

### 7.2 Cart Recovery — Mensagens Prontas

**1h após abandono:**
> Assunto: "Esqueceu algo, Dra. [Nome]?"
>
> Seu jaleco ainda está esperando por você.
>
> A modelagem Slim Princesa Laise tem Tecnologia Anti-Microbial — plantão de 12 horas sem perder o caimento.
>
> [Completar minha compra →]
>
> P.S. Temos 5% de desconto no PIX para pedidos feitos hoje.

**24h após abandono:**
> Assunto: "Ainda dá tempo — seu jaleco favorito"
>
> 24 horas se passaram e queremos garantir que você encontrou o jaleco certo.
>
> Lembramos: o Jaleco Slim Princesa Laise tem Gabardine Premium que não amassa, não desbota, e dura anos. Os jalecos comuns? Six meses.
>
> Use o cupom QUEROVOLTAR10 para 10% off na sua primeira compra.
>
> [Quero meu jaleco agora →]

**72h após abandono:**
> Assunto: "Uma última chance — 5% off só para você"
>
> Seus 127 pontos Club Jaleca estão esperando. Daqui a 24h, sua conta é resetada.
>
> Mas temos um presente: 5% off com PIX + Frete Grátis no seu pedido.
>
> [Levar meu jaleco com desconto →]
>
> Válido por 24 horas. Depois, voltamos ao preço normal.

---

## PARTE 8 — IMPACTO ESTIMADO (REVENUE)

### 8.1 Impacto por Quick Win

| Quick Win | Implementação | Impacto estimado |
|----------|-------------|-----------------|
| Trust badges na homepage | `app/page.tsx` + CSS | +3-5% conversão |
| Free shipping progress bar | `CartDrawer.tsx` | +15-20% ticket médio |
| Reviews na página de produto | `ProductDetailClient.tsx` | +8-12% conversão |
| Urgência (escassez real) | `ProductDetailClient.tsx` | +5-10% conversão |
| PIX discount explícito | Checkout + UI | +10-15% conversão PIX |
| Garantia perto do CTA | `ProductDetailClient.tsx` | +3-5% conversão |
| Empty cart + recomendações | `CartDrawer.tsx` | +5-8% add-to-cart |
| Email cart recovery (1h, 24h, 72h) | `app/api/cart-recovery/` | +2-4% recovery |
| Newsletter popup | New component | +2-3% emails capturados |

### 8.2 Cálculo conservador

```
Tráfego mensal: ~10.000 visitas (estimativa)
Taxa conversão atual: ~1.5% (indústria moda: 1-2%)
Ticket médio: ~R$320
Vendas/mês: 150 pedidos × R$320 = R$48.000

COM QUICK WINS:
+10% conversão = 165 pedidos/mês = +R$4.800/mês
+15% ticket médio (frete grátis progressivo) = +R$3.600/mês
+5% recovery (cart emails) = +R$2.400/mês

TOTAL IMPACTO: +R$10.800/mês = +R$129.600/ano
```

---

## PARTE 9 — CHECKLIST DE IMPLEMENTAÇÃO (TODOS OS ARQUIVOS)

### ARQUIVOS A MODIFICAR:

| Arquivo | O que mudar |
|---------|-------------|
| `app/page.tsx` | Trust badges, social proof bar, newsletter com cupom, free shipping progress |
| `app/produto/[slug]/page.tsx` | Fix título duplo `| Jaleca | Jaleca` |
| `components/ProductDetailClient.tsx` | Reviews visíveis (estrelas + count), garantia perto CTA, urgência estoque, FAQ expand |
| `components/CartDrawer.tsx` | Free shipping progress bar, empty cart com produtos, urgência |
| `components/SizeAdvisorModal.tsx` | Fix alinhamento Busto/Cintura (BUG) |
| `app/faq/page.tsx` | CRIAR — FAQ com FAQPage schema |
| `app/categoria/[slug]/page.tsx` | Descrições únicas por categoria (800-1500 palavras) |
| `app/api/cart-recovery/route.ts` | Migrar de JSON file para Redis/Vercel KV |
| `app/api/payment/create/route.ts` | parallelize WooCommerce calls com Promise.all |
| `app/api/orders/route.ts` | N+1 stock checks — parallelize |
| `lib/loyalty.ts` | Combinar getPoints + savePoints em uma função |
| `public/` | Limpar hero images não usadas (12+ variantes antigas) |

### ARQUIVOS A CRIAR:

| Arquivo | Descrição |
|---------|-----------|
| `app/faq/page.tsx` | Página de FAQ com FAQPage JSON-LD |
| `app/categoria/jaleco-feminino/page.tsx` | Categoria gender-split |
| `app/categoria/jaleco-masculino/page.tsx` | Categoria gender-split |
| `app/categoria/jaleco-premium/page.tsx` | Categoria premium |
| `app/categoria/jaleco-personalizado/page.tsx` | Categoria personalização/bordado |
| `app/b2b/page.tsx` | Landing page B2B para clínicas |
| `app/api/stock/[id]/route.ts` | Endpoint lightweight para polling de estoque |
| `app/api/newsletter/route.ts` | API de captura de email |
| `app/api/cart-recovery-email/route.ts` | API para emails de recovery |

---

## PARTE 10 — PLANO DE 90 DIAS (TODOS OS PONTOS)

### 🔴 SEMANA 1-2 (Fundação):
- [ ] Fix checkout 403
- [ ] Criar `/faq` + FAQPage schema
- [ ] Fix título duplo `| Jaleca | Jaleca`
- [ ] Trust badges na homepage
- [ ] Fix Size Advisor alignment (bug)

### 🟠 SEMANA 3-4 (Conversão):
- [ ] Reviews visíveis na página de produto
- [ ] Free shipping progress bar
- [ ] Urgência (escassez real)
- [ ] Garantia perto do CTA
- [ ] Desconto PIX explícito
- [ ] Empty cart + recomendações

### 🟡 SEMANA 5-8 (Automação):
- [ ] Cart recovery emails (1h, 24h, 72h)
- [ ] Newsletter popup com cupom
- [ ] Migrar cart-recovery para Redis/Vercel KV
- [ ] Programa de indicação ("indique e ganhe R$30")

### 🟢 SEMANA 9-12 (Escala):
- [ ] Categorias gender-split (`/jaleco-feminino`, `/jaleco-masculino`)
- [ ] B2B landing page
- [ ] Serviço de bordado
- [ ] 30 blog posts (meta atingida)
- [ ] TikTok Shop pesquisa

---

*Relatório compilado: 2026-04-04 | Fontes: 5 agentes especializados + 2 prompts GPT + análise manual*
*Arquivos: ANALISE-JALECA-2026.md + CRO-SALES-ANALYSIS.md*

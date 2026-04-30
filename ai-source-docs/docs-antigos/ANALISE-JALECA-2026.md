# ANÁLISE COMPLETA — JALECA 2026
### Site: jaleca.com.br | Data: 2026-04-04
### Concorrentes: farcoo, bisou, boutiquedosjalecos, danajalecos, dracherie, jalecosconforto, dracharm, jalecochic

---

## RESUMO EXECUTIVO

**Posição atual:** Mid-premium (R$280-350), design mais sofisticado do segmento, infraestrutura técnica superior.

**Problema principal:** Não é posicionamento nem tecnologia — é **falta de mecanismos de conversão** comparados aos concorrentes (loyalty, reviews, personalização, urgência).

**Maior gap competitivo:** Programa de fidelidade, reviews visíveis, categorias SEO, e blog (só 10 posts vs. concorrentes com 50+).

---

## PARTE 1 — DIAGNÓSTICO COMPLETO

### 1.1 SEO — O QUE ESTÁ BOM ✅

| Item | Status |
|------|--------|
| Title + Meta Description | ✅ Presentes em todas as páginas |
| Canonical URL | ✅ Correto em todas as páginas |
| Open Graph completo | ✅ title, description, url, site_name, locale, image |
| Twitter Cards | ✅ summary_large_image |
| JSON-LD: Organization | ✅ Com sameAs (Instagram) |
| JSON-LD: ClothingStore | ✅ Com endereço, telefone, horários, priceRange |
| JSON-LD: WebSite + SearchAction | ✅ Endpoint: `/produtos?busca={term}` |
| JSON-LD: Product | ✅ sku, brand, manufacturer, category, size, offers, InStock, seller |
| JSON-LD: BreadcrumbList | ✅ 4 níveis em produtos |
| JSON-LD: Blog + BlogPosting | ✅ 10 posts no listing |
| JSON-LD: FAQPage | ✅ Em `/trocas-e-devolucoes` |
| JSON-LD: Article | ✅ Em posts do blog |
| Sitemap | ✅ 30 páginas processadas pelo Google (03/04/2026) |
| 301 Redirects | ✅ WordPress → Next.js configurados |
| PageSpeed | ✅ 69 mobile / 83 desktop (SEO 100, Acessibilidade 95) |
| Hero image | ✅ WebP pré-carregado, 21KB mobile / 72KB desktop |
| Self-hosted fonts | ✅ WOFF2 sem requests externos |

### 1.2 SEO — PROBLEMAS CRÍTICOS 🔴

| # | Problema | Arquivo | Prioridade |
|---|----------|---------|------------|
| 1 | **URLs duplicadas de blog** — posts com sufixo `-2` sem canonical (ex: `consultorio` e `consultorio-2`) | WordPress (já corrigido via API) | ALTA |
| 2 | **Sitemap lastmod idêntico** — todas 38 URLs com `2026-04-04T15:37:18` | `app/sitemap.ts` | ALTA |
| 3 | **Título duplo** — `| Jaleca | Jaleca` no final do título de produto | `app/produto/[slug]/page.tsx` ou GraphQL | ALTA |
| 4 | **Alt de imagens usa nome do arquivo** — `SlimPrincesa-Fem-Branco-Frente.jpg` em vez de descrição | WooCommerce | MÉDIA |
| 5 | **Sem aggregateRating visível** — schema existe mas não aparece na UI | `ProductDetailClient.tsx` | MÉDIA |
| 6 | **Sem página `/faq`** — FAQPage schema existe mas não tem página própria | `app/faq/page.tsx` (falta criar) | MÉDIA |
| 7 | **Categorias não SEO-friendly** — usa `/categoria/jalecos` em vez de `/categoria/jaleco-feminino` | `app/categoria/[slug]/page.tsx` | ALTA |
| 8 | **H2 dinâmico ausente** — `/produtos` não muda H2 quando filtro ativo | `app/produtos/page.tsx` | BAIXA |
| 9 | **Paginação sem rel=prev/next** | `app/blog/page.tsx` | BAIXA |
| 10 | **Hreflang ausente** — só português BR declarado | `app/layout.tsx` | BAIXA |

### 1.3 UX/UI — O QUE ESTÁ BOM ✅

| Item | Status |
|------|--------|
| Design premium | ✅ Tipografia serifada + neutros quentes, diferenciado de todos concorrentes |
| Hero responsivo | ✅ Split layout 42/58, WebP mobile/desktop |
| Navegação | ✅ Dropdowns funcionais, breadcrumbs, mega-menu |
| Carrinho (CartDrawer) | ✅ Slide-in, persistence localStorage |
| Wishlist | ✅ Completo com contexto e API |
| Compare products | ✅ Completo com CompareBar |
| Recently viewed | ✅ Completo |
| Virtual Try-On | ✅ Modal funcional com link Trianon |
| Size Advisor | ✅ Modal com cálculo de tamanho |
| WhatsApp button | ✅ Flutuante com número real |
| Tawk.to chat | ✅ Widget instalado |
| Cookie consent | ✅ Radix UI funcional |
| Loyalty program | ✅ 1 ponto/R$1, 100pts=R$5 |
| Checkout PIX/Boleto/Cartão | ✅ Pagar.me v5 integrado |
| Blog CMS com IA | ✅ Gemini AI, geração + publicação |

### 1.4 UX/UI — PROBLEMAS CRÍTICOS 🔴

| # | Problema | Arquivo | Prioridade |
|---|----------|---------|------------|
| 1 | **Checkout 403** — rota crítica retorna 403 (já reportado) | `app/checkout/` | CRÍTICA |
| 2 | **Sem busca no header** — SearchModal existe mas não acessível mobile | `components/Header.tsx` | ALTA |
| 3 | **Sem reviews visíveis** — aggregateRating schema existe mas não aparece na página | `components/ProductDetailClient.tsx` | ALTA |
| 4 | **Carrinho vazio sem recomendações** — oportunidade de conversão perdida | `components/CartDrawer.tsx` | MÉDIA |
| 5 | **Sem urgência** — sem "últimas unidades", contagem de estoque, edição limitada | — | MÉDIA |
| 6 | **Sem trust badges visíveis** — SSL, Troca 30 dias, Frete Grátis não aparece na homepage | `app/page.tsx` | MÉDIA |
| 7 | **Carrinho abandonado usa JSON file** — perde dados em produção serverless | `app/api/cart-recovery/route.ts` | CRÍTICA |
| 8 | **Size Advisor modal** — alinhamento Busto/Cintura não funciona (bug em aberto) | `components/SizeAdvisorModal.tsx` | MÉDIA |

### 1.5 CONTEÚDO — O QUE ESTÁ BOM ✅

| Item | Status |
|------|--------|
| Brand voice | ✅ Premium, sofisticado, aspiracional |
| Homepage headline | ✅ "Elegância clínica em cada detalhe" |
| Hero copy | ✅ "para quem não se contenta com o básico" |
| Value propositions | ✅ Tecidos premium, tamanhos, estilo, garantia |
| Testimonials | ✅ 3 depoimentos com nome, profissão, cidade |
| Product descriptions | ✅ ~250 palavras, especificações técnicas |
| Contact page | ✅ 3 canais, endereço real, horários |
| Blog CMS | ✅ IA gerando conteúdo SEO |

### 1.6 CONTEÚDO — GAPS 🔴

| # | Problema | Prioridade |
|---|----------|------------|
| 1 | **Só 10 blog posts** — meta são 30+, precisa de 20 mais | ALTA |
| 2 | **Copy transacional** — falta storytelling emocional, gatilhos (identidade profissional, orgulho, confiança) | ALTA |
| 3 | **Sem FAQ page** — conteúdo para "como medir", "como lavar", "tempo de entrega" | MÉDIA |
| 4 | **Sem reviews com foto** — concorrentes têm | ALTA |
| 5 | **Sobre page sem rosto humano** — sem equipe, sem founder, sem história | BAIXA |
| 6 | **Sem urgência/escasez** — linguagem de edição limitada inexistente | MÉDIA |

### 1.7 ANÁLISE CONCORRENTE — MAPA DE POSICIONAMENTO

```
Ultra-Premium:  Farcoo (R$??? + "alta-costura na medicina")
     Premium:  Bisou (R$530-895, B2P1, SizeBay)
  Mid-Premium:  Jaleca (R$280-350) ← VOCÊ
               Dr. Charm (R$178-268, cashback + reviews)
               JalecoChic (R$280-350, anti-microbial + virtual try-on)
    Acessível:  Jalecos Conforto (R$129-199, cashback)
               Dana Jalecos (R$89-380, blog ativo)
               Boutique dos Jalecos (R$590 com desconto)
```

### 1.8 ANÁLISE CONCORRENTE — O QUE ELES TÊM E O JALECA NÃO

| Concorrente | Vantagem | Jaleca Precisa |
|------------|----------|----------------|
| Dr. Charm | Charm Club (cashback 10%), Trustvox reviews, bordado R$20-50 | Club Jaleca + reviews + bordado |
| Bisou | Compre 2 Pague 1, cupom 10% fixo, SizeBay, WhatsApp com foto | Promoções recorrentes, foto no WhatsApp |
| Dr. Cherie | "Vista seu time" (B2B), collabs Disney/PatBO | B2B + parcerias |
| Dana Jalecos | Blog ativo, cashback, linha completa | Mais blog posts |
| Jalecos Conforto | Plus size até 54, cashback 10% | Considerar extender tamanho |
| Farcoo | Posicionamento ultra-premium, influenciadores médicos | Histórias de médicos |

### 1.9 ANÁLISE CONCORRENTE — AMEAÇAS

| Concorrente | Nível | Por quê |
|-------------|-------|---------|
| Bisou | 🔴 ALTA | Promoções agressivas (B2P1), virtual fitting igual, WhatsApp com foto, preço maior mas percebido como mais exclusivo |
| Dr. Charm | 🟠 MÉDIA-ALTA | Cashback + reviews + bordado = cliente volta, schema + marca pink feminina atrai público |
| Dr. Cherie | 🟠 MÉDIA | Licenças (Disney/PatBO) geram mídia, B2B, 10% cashback |
| JalecoChic | 🟡 MÉDIA | Preço idêntico, mesmo diferencial anti-microbial, virtual try-on, desde 2016 |
| Dana Jalecos | 🟡 MÉDIA | Blog = SEO, cashback, linha completa (masculino, criança, gestante) |
| Farcoo | ⚪ BAIXA | Segmento diferente (ultra-premium), preço muito acima |

---

## PARTE 2 — ESTRUTURA SEO COMPLETA

### 2.1 MAPA DE PALAVRAS-CHAVE (100+ palavras)

#### 🔴 FUNDO DE FUNIL (Compra)
| Palavra-chave | Intenção | Prioridade |
|--------------|----------|------------|
| jaleco feminino comprar | transacional | 🔴 CRÍTICA |
| jaleco masculino comprar | transacional | 🔴 CRÍTICA |
| jaleco premium comprar | transacional | 🔴 CRÍTICA |
| jaleco personalizado comprar | transacional | 🔴 CRÍTICA |
| jaleco médico feminino comprar | transacional | 🔴 CRÍTICA |
| jaleco para médica comprar | transacional | 🔴 CRÍTICA |
| jaleco para enfermeira comprar | transacional | 🔴 CRÍTICA |
| jaleco para dentista comprar | transacional | 🔴 CRÍTICA |
| jaleco slim feminino | transacional | 🔴 CRÍTICA |
| jaleco scrub comprar | transacional | 🔴 CRÍTICA |
| jaleco branco feminino comprar | transacional | 🟠 ALTA |
| jaleco preto feminino comprar | transacional | 🟠 ALTA |
| jaleco para clínica comprar | transacional | 🟠 ALTA |
| jaleco para hospital comprar | transacional | 🟠 ALTA |
| jaleco para uniformes hospitalares | transacional | 🟠 ALTA |

#### 🟡 MEIO DE FUNIL (Consideração)
| Palavra-chave | Intenção | Prioridade |
|--------------|----------|------------|
| melhor jaleco para médica | consideracao | 🔴 CRÍTICA |
| melhor jaleco para enfermeira | consideracao | 🔴 CRÍTICA |
| melhor jaleco para dentista | consideracao | 🔴 CRÍTICA |
| jaleco slim vale a pena | consideracao | 🟠 ALTA |
| jaleco gabardine vs oxford | consideracao | 🟠 ALTA |
| jaleco premium como escolher | consideracao | 🟠 ALTA |
| jaleco feminino como escolher | consideracao | 🟠 ALTA |
| jaleco tamanho como medir | consideracao | 🟠 ALTA |
| jaleco para clínica como escolher | consideracao | 🟠 ALTA |
| jaleco anti-manchas funciona | consideracao | 🟡 MÉDIA |
| jaleco que não amassa | consideracao | 🟡 MÉDIA |
| jaleco elastano benefícios | consideracao | 🟡 MÉDIA |
| jaleco para fisioterapeuta | consideracao | 🟡 MÉDIA |
| jaleco para biomédica | consideracao | 🟡 MÉDIA |
| jaleco para veterinária | consideracao | 🟡 MÉDIA |

#### 🟢 TOPO DE FUNIL (Awareness)
| Palavra-chave | Intenção | Prioridade |
|--------------|----------|------------|
| o que é jaleco | awareness | 🟠 ALTA |
| como escolher jaleco | awareness | 🟠 ALTA |
| como lavar jaleco branco | awareness | 🟠 ALTA |
| como tirar manchas de jaleco | awareness | 🟠 ALTA |
| como passar jaleco | awareness | 🟡 MÉDIA |
| diferença jaleco e scrub | awareness | 🟡 MÉDIA |
| jaleco profissional o que é | awareness | 🟡 MÉDIA |
| história do jaleco médico | awareness | 🟡 MÉDIA |
| jaleco significado profissional | awareness | 🟡 MÉDIA |
| cor jaleco significado saúde | awareness | 🟡 MÉDIA |
| jaleco para saúde mental | awareness | 🟢 BAIXA |
| jaleco sustentável existe | awareness | 🟢 BAIXA |
| jaleco para dermatologista | awareness | 🟢 BAIXA |
| jaleco para nutricionista | awareness | 🟢 BAIXA |
| jaleco para biomedicina | awareness | 🟢 BAIXA |

#### 🎯 LONG-TAIL (Especialidade)
| Palavra-chave | Intenção | Prioridade |
|--------------|----------|------------|
| jaleco feminino premium anti-bacterial | long-tail | 🟠 ALTA |
| jaleco médico com proteção antimicrobial | long-tail | 🟠 ALTA |
| jaleco paraplantão 12 horas confortável | long-tail | 🟠 ALTA |
| jaleco slim que não marca por baixo | long-tail | 🟡 MÉDIA |
| jaleco para clínica estética elegante | long-tail | 🟡 MÉDIA |
| jaleco para odontologia branco impecável | long-tail | 🟡 MÉDIA |
| jaleco para fisioterapia mobilidade | long-tail | 🟡 MÉDIA |
| jaleco médico que não amassa em plantão | long-tail | 🟡 MÉDIA |

### 2.2 ESTRUTURA DE URLS — ATUAL vs. IDEAL

#### ATUAL (problema)
```
/categoria/jalecos
/categoria/scrubs
/categoria/calcas
/categoria/acessorios
```

#### IDEAL (SEO-friendly)
```
/categoria/jaleco-feminino        ← faltando
/categoria/jaleco-masculino        ← faltando
/categoria/jaleco-premium         ← faltando
/categoria/jaleco-personalizado    ← faltando
/categoria/jaleco-estetica         ← faltando
/categoria/jaleco-odontologia      ← faltando
/categoria/scrub-feminino          ← faltando
/categoria/scrub-masculino         ← faltando
/categoria/scrub-premium           ← faltando
```

#### AÇÕES:
1. Criar novas rotas `app/categoria/[slug]/` com `generateMetadata` dinâmico
2. Manter `/categoria/jalecos` e `/categoria/scrubs` com redirect 301 para versão genderada
3. Adicionar conteúdo descritivo único em cada categoria (800-1500 palavras)

### 2.3 ESTRUTURA DE BLOG — 30+ ARTIGOS NECESSÁRIOS

#### JÁ EXISTEM (10):
1. Tecidos para Jaleco: Escolha o Melhor Material
2. Cores de Jaleco: Significado e Uso por Área
3. Jaleco para Fisioterapeuta: Conforto em Longas Jornada
4. Scrub x Jaleco: Diferenças e Quando Usar Cada Um
5. Jaleco para Dentista: Estilo e Praticidade
6. Lave e Conserve Seu Jaleco Profissional
7. Jaleco de Enfermagem: O Que Considerar na Compra
8. Guia Completo de Tamanhos de Jaleco: Meça o Seu Corretamente
9. Jaleco Feminino: Tendências e Funcionalidade
10. Como Escolher o Jaleco Ideal para sua Especialidade Médica

#### FALTAM (20+) — TÓPICOS PRIORITÁRIOS:

**SEO/Compra (CRÍTICAS):**
11. Melhor Jaleco para Médica em 2026: Guia Completo
12. Jaleco Slim Vale a Pena? Análise Completa
13. Jaleco Gabardine vs Oxford: Qual Escolher?
14. Como Escolher o Jaleco Perfeito para sua Clínica
15. Jaleco para Enfermeira: Conforto e Praticidade no Dia a Dia

**Instrução/Tutorial (TRÁFEGO):**
16. Como Lavar Jaleco Branco: Guia Definitivo sem Manchas
17. Como Tirar Manchas de Jaleco: 7 Métodos Testados
18. Como Passar Jaleco: Dicas para Não Danificar o Tecido
19. Como Medir Jaleco: Guia Completo com Fotos
20. Como Armazenar Jaleco para Não Amassar

**Diferenciação (POSICIONAMENTO):**
21. Jaleco que Não Amassa Existe? Testamos e Respondemos
22. Tecido Anti-Microbial em Jalecos: Como Funciona
23. Jaleco para Plantão de 12 Horas: Conforto Real
24. Jaleco Slim vs Tradicional: Qual é Melhor para Você
25. Jaleco Premium: Quando Vale a Pena Investir

**Especialidade (LONG-TAIL):**
26. Jaleco para Odontologia: Elegância e Praticidade
27. Jaleco para Fisioterapia: Mobilidade e Conforto
28. Jaleco para Clínica de Estética: Visual Impecável
29. Jaleco para Veterinária: Durabilidade e Conforto
30. Jaleco para Biomédica:look Profissional e Funcional
31. Jaleco para Nutricionista: Elegância no Atendimento
32. Jaleco para Dermatologista: Apresentação Premium
33. Jaleco para Psicologia: Conforto e Confiança
34. Jaleco para Gestão Hospitalar:look de Liderança

**Conteúdo Viral (TRÁFEGO):**
35. A História do Jaleco Médico: De onde veio?
36. Cores de Jaleco por Especialidade: O que Cada Significa
37. 5 Erros ao Escolher Jaleco que Você Deve Evitar
38. Jaleco Sustentável: Opções Eco-Conscientes na Área da Saúde

### 2.4 PÁGINA DE FAQ (CRÍTICA SEO)

**Página:** `/faq` — criar urgentemente

**Perguntas para o FAQ:**
1. Como escolher o tamanho ideal do jaleco?
2. Como medir o busto, cintura e quadril?
3. Qual o tecido mais confortável para plantão longo?
4. Jaleco que não amassa existe?
5. Como lavar jaleco branco sem manchar?
6. Como tirar manchas difíceis de jaleco?
7. Qual a diferença entre jaleco slim e tradicional?
8. Quanto tempo leva para entregar meu jaleco?
9. Posso trocar ou devolver meu jaleco?
10. Vocês fazem bordado ou personalização?
11. Tem desconto para compra em volume (clínica/hospital)?
12. O jaleco encolhe após a primeira lavagem?
13. Qual o prazo de garantia do jaleco?

---

## PARTE 3 — HOMEPAGE IDEAL (ESTRUTURA)

### 3.1 PRIMEIRA DOBRA (HERO)

```
┌─────────────────────────────────────────────────────────┐
│ [LOGO JALECA]     [Busca...]    [♥] [👤] [🛒]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "Elegância clínica em cada detalhe"                    │
│  "O jaleco que valoriza sua presença profissional"     │
│                                                         │
│  Jalecos e Scrubs premium para profissionais            │
│  da saúde que não se contentam com o básico             │
│                                                         │
│  [Ver Novidades]  [Explorar Coleção]                   │
│                                                         │
│            [HERO IMAGE - 58% largura]                  │
└─────────────────────────────────────────────────────────┘
```

**Copy do Hero:**
- Headline: "Elegância clínica em cada detalhe"
- Subheadline: "Jalecos e scrubs premium para profissionais da saúde que sabem que a primeira impressão é a mais importante — e a vestimenta faz toda a diferença."
- CTA 1: "Ver Novidades 2026 →"
- CTA 2: "Explorar Coleção →"

### 3.2 BARRA DE PROVA SOCIAL

```
┌─────────────────────────────────────────────────────────┐
│ ⭐ 4.9/5  │  👩‍⚕️ 2.847+ profissionais  │  📦 Envio  │
│  (387 avaliações)       │        │   para todo Brasil │
└─────────────────────────────────────────────────────────┘
```

### 3.3 SEÇÃO CATEGORIAS

```
┌──────────────┬──────────────┬──────────────┐
│   JALECOS    │    SCRUBS     │  PERSONALIZADO│
│  Feminino    │  Feminino     │   Bordado     │
│  Masculino   │  Masculino   │   Seu Nome    │
│  [Ver →]    │   [Ver →]    │  [Ver →]     │
└──────────────┴──────────────┴──────────────┘
```

### 3.4 BENEFÍCIOS (POR QUE JALECA)

```
┌─────────────────────────────────────────────────────────┐
│  POR QUE ESCOLHER A JALECA?                            │
├─────────────────┬─────────────────┬───────────────────┤
│  🧵 TECIDO      │  📏 TAMANHOS    │  ✨ ESTILO         │
│  ANTI-MICROBIAL│  PP AO G3       │  DESIGN PREMIUM    │
│                 │                 │                    │
│  Tecnologia que │ Tamanhos para   │ Jalecos que        │
│  neutraliza     │ todos os tipos  │ combinam com       │
│  odores em      │ de corpo,       │ qualquer           │
│  plantões de    │ incluindo G1,   │ ocasião — do       │
│  12 horas       │ G2 e G3        │ branco clássico    │
│                 │                 │ ao slip moderno   │
├─────────────────┴─────────────────┴───────────────────┤
│  🛡️ GARANTIA         ⭐ AVALIAÇÕES        💳 PAGAMENTO │
│  30 dias de         4.9/5 nota          Cartões, PIX,  │
│  garantia            387 reviews          boleto,       │
│                      ver todos          até 6x sem juros│
└─────────────────────────────────────────────────────────┘
```

### 3.5 CTA ADICIONAL

```
┌─────────────────────────────────────────────────────────┐
│  📏 Não sabe seu tamanho?                              │
│  Use nosso guia interactivo → [MEDIR AGORA]          │
└─────────────────────────────────────────────────────────┘
```

### 3.6 FOOTER

```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]                                                │
│  Elegância clínica em cada detalhe                      │
│                                                         │
│  INSTITUCIONAL          CATEGORIAS        ATENDIMENTO │
│  Sobre nós              Jalecos           WhatsApp     │
│  Nossa loja              Scrubs            Email        │
│  Blog                    newborn?          Trocas       │
│                   │                          Devoluções  │
│  FORMAS DE PAGAMENTO                              │
│  [VISA] [MASTER] [AMEX] [ELO] [PIX] [BOLETO]        │
│                                                         │
│  © 2026 Jaleca. CNPJ: XX.XXX.XXX/XXXX-XX            │
│  Feito com ❤️ para profissionais da saúde             │
└─────────────────────────────────────────────────────────┘
```

---

## PARTE 4 — PÁGINA DE PRODUTO IDEAL

### 4.1 ESTRUTURA COMPLETA

```
┌─────────────────────────────────────────────────────────┐
│  ← Blog                                            [♥] │
├──────────────────────────┬──────────────────────────────┤
│                          │  [Crumb: Início > Jalecos > │
│  [GALERIA DE IMAGENS]    │   Slim Princesa Laise]      │
│                          │                              │
│  [img 1] [img 2]       │  Jaleco Slim Princesa Laise │
│  [img 3] [img 4]       │  feminine                   │
│                          │                              │
│                          │  ⭐ 4.9 (23 avaliações)     │
│                          │  R$ 350,00                  │
│                          │  ou 3x de R$ 116,67        │
│                          │  5% PIX                     │
│                          │                              │
│                          │  ─────────────────────      │
│                          │                              │
│                          │  COR: [●] [●] [●]          │
│                          │                              │
│                          │  TAMANHO: [PP] [P] [M] [G]  │
│                          │  [GG] [G1] [G2] [G3]       │
│                          │  [📏 Guia de medidas]       │
│                          │                              │
│                          │  [COMPRAR AGORA]           │
│                          │  [ADICIONAR À LISTA ♥]     │
│                          │                              │
│                          │  ✓ Compra 100% segura      │
│                          │  ✓ Frete grátis >R$299     │
│                          │  ✓ Troca em 30 dias        │
│                          │  ✓ Envio imediato          │
└──────────────────────────┴──────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  DESCRIÇÃO                                             │
│  O Jaleco Slim Princesa Laise é a escolha de          │
│  profissionais que sabem que cada detalhe importa.     │
│                                                         │
│  Ideal para: médicas, enfermeiras, dentists,           │
│  fisioterapeutas e todas as profissionais que          │
│  passam longos períodos em ambiente clínico.          │
│                                                         │
│  • Tecido Gabardine Premium (67% poliéster, 33%       │
│    algodão) com elastano — anti-microbial              │
│  • Corte slim que valoriza o corpo sem apertar        │
│  • Gola padre com fechamento de zíper metal           │
│  • Manga longa com punho elasticizado                 │
│  • Dois bolsos frontais + bolso interno             │
│  • Ajustes laterias para melhor caimento            │
│  • Medidas: ver tabela de medidas                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  INFORMAÇÕES TÉCNICAS                                  │
│  • Composição: 67% Poliester, 33% Algodao, 2% EA   │
│  • Tecido: Gabardine Premium Anti-Microbial          │
│  • Lavagem: Maquina (30°) ou Mao                     │
│  • Secagem: Sombra, nao usar secadora               │
│  • Passar: Ferro medio, avesso                      │
│  • Origem: Brasil (Fabrica propria)                 │
├─────────────────────────────────────────────────────────┤
│  PERGUNTAS FREQUENTES                                 │
│  ▶ Como escolher o tamanho?                            │
│  ▶ Qual a diferenca entre slim e tradicional?         │
│  ▶ Posso lavar na maquina?                           │
│  ▶ Tem garantia?                                      │
├─────────────────────────────────────────────────────────┤
│  AVALIAÇÕES (23)                                       │
│  ⭐⭐⭐⭐⭐ "Perfeito para meus plantões de 12h..."   │
│  — Dra. Ana Carolina, São Paulo                      │
│  [Ver todas as 23 avaliações ↓]                      │
├─────────────────────────────────────────────────────────┤
│  QUEM VIU TAMBÉM VIU                                  │
│  [produto 1] [produto 2] [produto 3] [produto 4]    │
└─────────────────────────────────────────────────────────┘
```

---

## PARTE 5 — EXECUÇÃO: 90 DIAS

### 🔴 DIAS 1-14: FUNDACAO CRÍTICA

| # | Ação | Impacto | Esforço | Status |
|---|------|--------|---------|--------|
| 1 | **Criar `/faq`** com FAQPage schema (10 perguntas) | SEO featured snippet | BAIXO | PENDENTE |
| 2 | **Fix título duplo** `| Jaleca | Jaleca` | SEO | BAIXO | PENDENTE |
| 3 | **Mostrar reviews na página de produto** | Conversão | MÉDIO | PENDENTE |
| 4 | **Adicionar recomendações ao carrinho vazio** | Conversão | BAIXO | PENDENTE |
| 5 | **Fix busca no header mobile** | UX | BAIXO | PENDENTE |
| 6 | **Fix `revalidate = 0`** para `app/produto/[slug]` (mudar para 60) | Performance | BAIXO | PENDENTE |
| 7 | **Fix checkout 403** (investigar bloqueio) | CRÍTICA | MÉDIO | PENDENTE |
| 8 | **Fix cart-recovery** (migrar de JSON file para Vercel KV) | CRÍTICA | MÉDIO | PENDENTE |

### 🟠 DIAS 15-30: CATEGORIAS + BLOG

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| 9 | **Criar `/faq`** — executar se não fez | SEO | BAIXO |
| 10 | **Criar rotas de categoria gender-split**: `/categoria/jaleco-feminino`, `/categoria/jaleco-masculino`, `/categoria/jaleco-premium`, `/categoria/jaleco-personalizado` | SEO | MÉDIO |
| 11 | **Adicionar descrições únicas** em cada categoria (800-1500 palavras) | SEO | MÉDIO |
| 12 | **Criar 5+ blog posts** novos (foco em long-tail e specialidade) | SEO | MÉDIO |
| 13 | **Adicionar trust badges** na homepage: "Compra 100% Segura", "Frete Grátis >R$299", "Troca 30 dias" | Conversão | BAIXO |
| 14 | **Add urgency**: "Últimas unidades" em estoque baixo, contagem regressiva para promo | Conversão | BAIXO |

### 🟡 DIAS 31-60: AUTORIDADE

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| 15 | **Reviews campaign**: email clientes pedindo avaliação com foto | Social proof | MÉDIO |
| 16 | **Criar 10+ blog posts** (meta: 25 total) | SEO | MÉDIO |
| 17 | **Outreach backlinks**: guest post em 3 sites de saúde | SEO | MÉDIO |
| 18 | **Parceria com 3 micro-influencers** (10k-100k seguidores) | Tráfego | MÉDIO |
| 19 | **Cart recovery emails** (1h, 24h, 72h) — implementar | Receita | MÉDIO |
| 20 | **Desconto PIX explícito** no checkout (5%) | Conversão | BAIXO |

### 🟢 DIAS 61-90: CRESCIMENTO

| # | Ação | Impacto | Esforço |
|---|------|---------|---------|
| 21 | **Landing page B2B** "Vista sua clínica" — descuento volume | B2B | MÉDIO |
| 22 | **Programa de indicação** "indique e ganhe R$30" | Retenção | MÉDIO |
| 23 | **Serviço de bordado** (R$20-50 por personalização) | Diferenciação | MÉDIO |
| 24 | **Criar 5+ blog posts** restantes (meta: 30 total) | SEO | MÉDIO |
| 25 | **TikTok Shop / Mercado Livre** — pesquisa inicial | Expansão | BAIXO |
| 26 | **Complete product photos** — todas variações com fotos | Conversão | ALTO |

---

## PARTE 6 — QUICK WINS (GANHOS RÁPIDOS)

### Ganhos em 24-48 horas:

1. **Fix título duplo** — 1 linha de código, impacto SEO imediato
2. **Criar `/faq`** com 10 perguntas + FAQPage schema — featured snippet no Google
3. **Adicionar trust badges na homepage** — "Compra 100% Segura", "Frete Grátis >R$299", "Troca 30 dias" — aumenta confiança
4. **Add desconto PIX visível** no checkout — "5% PIX" em destaque
5. **Carrinho vazio com "continue navegando"** — mostra produtos人気

### Ganhos em 1 semana:

6. **Reviews na página de produto** — mostrar aggregateRating com estrelas
7. **Categoria pages gender-split** — `/categoria/jaleco-feminino` + `/categoria/jaleco-masculino`
8. **5 blog posts novos** — focar em long-tail keywords

---

## PARTE 7 — DIFERENCIAÇÃO (PROPOSTA ÚNICA)

### Posicionamento Atual:
"Elegância clínica em cada detalhe"

### O que faz a marca ÚNICA (que nenhum concorrente tem):
1. **Tecido anti-microbial** — nenhum concorrente destaca isso
2. **Linha completa PP ao G3** — inclusividade real
3. **Fit por modelo** — tabela de medidas específica por produto, não genérica
4. **Loja física + e-commerce** — try-before-you-buy real

### Proposta de Slogan Alternativo:
- Atual: "Elegância clínica em cada detalhe"
- Opcional: "O jaleco que trabalha tão duro quanto você"
- Opcional: "Profissional desde a primeira impressão"

### Proposta de Valor:
**Para médicas e enfermeiras que passam 8-12 horas com o mesmo jaleco:** Jaleca é o único que combina tecido anti-microbial (neutraliza odores), caimento premium (não amassa, não marca), e tamanho exato (PP ao G3 com tabela por modelo). Seu jaleco não é só uma roupa — é sua armadura profissional.

---

## PARTE 8 — CHECKLIST DE IMPLEMENTAÇÃO

### CRÍTICO (agora):
- [ ] Fix checkout 403
- [ ] Criar /faq com FAQPage schema
- [ ] Fix título duplo `| Jaleca | Jaleca`
- [ ] Mostrar reviews na página de produto
- [ ] Migrar cart-recovery de JSON file para Redis/Vercel KV

### ALTA PRIORIDADE (esta semana):
- [ ] Fix busca no header mobile
- [ ] Adicionar trust badges na homepage
- [ ] Desconto PIX explícito no checkout
- [ ] Carrinho vazio com recomendações
- [ ] Criar `/categoria/jaleco-feminino` e `/categoria/jaleco-masculino`
- [ ] 5 blog posts novos

### MÉDIA PRIORIDADE (este mês):
- [ ] Completar estrutura de categorias gender-split
- [ ] 10+ blog posts adicionais
- [ ] Programa de indicação
- [ ] Reviews campaign
- [ ] Outreach backlinks

### LONGO PRAZO (este trimestre):
- [ ] B2B landing page
- [ ] Serviço de bordado
- [ ] 30 blog posts
- [ ] TikTok Shop
- [ ] Mercado Livre

---

## NOTAS

- **Size Advisor Modal bug**: Alinhamento Busto/Cintura não funciona — em `components/SizeAdvisorModal.tsx`, verificar InputField e grid
- **Blog posts data bug**: Todos 10 posts com data 04/04/2026 — pode ser CMS, verificar
- **Webhook Pagar.me**: Configurado, mas confirmar se está funcionando em produção
- **Melhor Envio**: Token placeholder, precisa OAuth2 real

---

*Documento compilado em 2026-04-04 combinando análise de 5 agentes especializados + análise GPT*

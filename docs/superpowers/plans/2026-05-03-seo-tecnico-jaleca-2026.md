# SEO Jaleca 2026 — Plano Completo (Técnico + Conteúdo)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aumentar tráfego orgânico +15-20% em 30 dias via infraestrutura técnica de Schema, UGC Gallery e 5 artigos com dados proprietários reais.

**Architecture:** Componentes React reutilizáveis (FAQSchema, HowToSchema, ProductSchema, UGCGallery) inseridos nas páginas Next.js App Router existentes via JSON-LD. 5 posts publicados no WordPress via REST API com dados proprietários exclusivos do Jaleca.

**Tech Stack:** Next.js 14 App Router, TypeScript, JSON-LD, Tailwind CSS, WordPress REST API

**Spec:** `docs/superpowers/specs/2026-05-03-seo-strategy-jaleca-2026-design.md`

---

## Mapa de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `components/seo/FAQSchema.tsx` | Criar | Componente FAQ com JSON-LD embutido |
| `components/seo/HowToSchema.tsx` | Criar | Componente HowTo com JSON-LD embutido |
| `components/seo/ProductSchema.tsx` | Criar | Schema de produto completo |
| `components/UGCGallery.tsx` | Criar | Galeria de fotos UGC por profissão |
| `data/ugc.ts` | Criar | Banco de dados UGC aprovado |
| `app/jaleco-medico/page.tsx` | Modificar | Adicionar FAQSchema |
| `app/jaleco-dentista/page.tsx` | Modificar | Adicionar FAQSchema |
| `app/jaleco-enfermeiro/page.tsx` | Modificar | Adicionar FAQSchema |
| `app/jaleco-professor/page.tsx` | Modificar | Adicionar FAQSchema |
| `app/produto/[slug]/page.tsx` | Modificar | Adicionar ProductSchema completo |
| `app/blog/*/page.tsx` (10 PAA posts) | Auditar | Qualidade de metadata e links internos |
| WordPress REST API | 5 posts | Artigos com dados proprietários |

---

## Task 1: Auditoria dos Posts PAA Existentes

**Objetivo:** Garantir que os posts PAA passem no filtro de qualidade do Google 2026. Posts fracos não indexam mais.

**Files:**
- Audit: `app/blog/*/page.tsx`

- [ ] **Step 1: Listar todos os posts PAA**

```bash
find app/blog -name "page.tsx" | sort
```

- [ ] **Step 2: Para cada post, checar os critérios de qualidade**

Abrir cada `page.tsx` e verificar:
- Title tag única com palavra-chave específica (não genérica)
- Primeiro parágrafo responde diretamente a pergunta do título
- Conteúdo tem mínimo 400 palavras
- Tem pelo menos 1 link interno para página de produto ou hub de profissão
- Meta description entre 120-160 chars
- Tem H2s estruturados além do H1

- [ ] **Step 3: Corrigir metadata dos posts com problemas**

```tsx
export const metadata: Metadata = {
  title: "[Título específico com palavra-chave] | Jaleca",
  description: "[Resposta direta de 120-160 chars que resolve a dúvida do usuário]",
  openGraph: {
    title: "[Mesmo título]",
    description: "[Mesma description]",
  },
}
```

- [ ] **Step 4: Adicionar link interno nos posts sem link**

```tsx
<p>
  Veja nossa linha completa de{" "}
  <a href="/jaleco-[profissao]">jalecos para [profissão]</a>{" "}
  com entrega para todo o Brasil.
</p>
```

- [ ] **Step 5: Commit**

```bash
git add app/blog/
git commit -m "seo: auditoria qualidade posts PAA — metadata e links internos"
```

---

## Task 2: Componente FAQSchema

**Files:**
- Criar: `components/seo/FAQSchema.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// components/seo/FAQSchema.tsx
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FAQItem[]
  title?: string
}

export function FAQSchema({ items, title = "Perguntas Frequentes" }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="space-y-4">
        {items.map((item, i) => (
          <details key={i} className="border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">{item.question}</summary>
            <p className="mt-3 text-gray-600 leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/seo/FAQSchema.tsx
git commit -m "feat: componente FAQSchema com JSON-LD para rich results"
```

---

## Task 3: Componente HowToSchema

**Files:**
- Criar: `components/seo/HowToSchema.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// components/seo/HowToSchema.tsx
interface HowToStep {
  name: string
  text: string
  image?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string
}

export function HowToSchema({ name, description, steps, totalTime }: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  }

  return (
    <section className="mt-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{step.name}</p>
              <p className="text-gray-600 mt-1">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/seo/HowToSchema.tsx
git commit -m "feat: componente HowToSchema com JSON-LD"
```

---

## Task 4: Componente ProductSchema

**Files:**
- Criar: `components/seo/ProductSchema.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
// components/seo/ProductSchema.tsx
interface ProductReview {
  author: string
  rating: number
  reviewBody: string
  datePublished: string
}

interface ProductSchemaProps {
  name: string
  description: string
  sku?: string
  brand?: string
  image: string | string[]
  price: number
  currency?: string
  availability?: "InStock" | "OutOfStock" | "PreOrder"
  reviews?: ProductReview[]
}

export function ProductSchema({
  name,
  description,
  sku,
  brand = "Jaleca",
  image,
  price,
  currency = "BRL",
  availability = "InStock",
  reviews = [],
}: ProductSchemaProps) {
  const aggregateRating =
    reviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
          reviewCount: reviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(sku && { sku }),
    brand: { "@type": "Brand", name: brand },
    image: Array.isArray(image) ? image : [image],
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      seller: { "@type": "Organization", name: "Jaleca" },
    },
    ...(aggregateRating && { aggregateRating }),
    ...(reviews.length > 0 && {
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.reviewBody,
        datePublished: r.datePublished,
      })),
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 2: Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add components/seo/ProductSchema.tsx
git commit -m "feat: componente ProductSchema com reviews e AggregateRating"
```

---

## Task 5: FAQ Schema nos Hubs de Profissão

**Files:**
- Modificar: `app/jaleco-medico/page.tsx`
- Modificar: `app/jaleco-dentista/page.tsx`
- Modificar: `app/jaleco-enfermeiro/page.tsx`
- Modificar: `app/jaleco-professor/page.tsx`

- [ ] **Step 1: Verificar quais hubs existem**

```bash
find app -maxdepth 1 -name "jaleco-*" -type d
```

- [ ] **Step 2: Adicionar FAQSchema no hub de médico**

Em `app/jaleco-medico/page.tsx`, importar e adicionar ao final do JSX:

```tsx
import { FAQSchema } from "@/components/seo/FAQSchema"

// No return, após o conteúdo principal:
<FAQSchema
  items={[
    {
      question: "Qual o melhor tecido para jaleco de médico?",
      answer:
        "O tecido mais pedido por médicos na Jaleca é o gabardine com elastano, pela combinação de durabilidade, conforto e liberdade de movimento durante longas jornadas. Para gestores e diretores clínicos, o tecido alfaiataria premium é o mais escolhido, por transmitir elegância e postura profissional.",
    },
    {
      question: "Qual tamanho de jaleco escolher?",
      answer:
        "Os tamanhos M e G acinturados são os mais vendidos na Jaleca. O erro mais comum é pedir M e precisar trocar por G — antes de comprar, meça a largura dos seus ombros. Se estiver em dúvida, prefira o tamanho maior: o jaleco não deve prender nos ombros nem no tórax durante o atendimento.",
    },
    {
      question: "Jaleco médico pode ser colorido?",
      answer:
        "Não há obrigatoriedade legal de jaleco branco no Brasil. Tons como azul claro, cinza e verde são cada vez mais usados em clínicas modernas. Consulte a norma interna do seu hospital ou clínica antes de escolher.",
    },
    {
      question: "Como lavar jaleco sem amarelamento?",
      answer:
        "Jalecos em gabardine com elastano suportam lavagens frequentes sem amarelamento quando lavados com água morna (máx. 40°C) e sabão neutro. Evite alvejante com cloro em tecidos com elastano — use perborato de sódio para brancos.",
    },
    {
      question: "A Jaleca fornece uniformes para hospital inteiro?",
      answer:
        "Sim. A Jaleca atende clínicas e hospitais com uniformização completa: médicos, equipe de enfermagem, recepção, administrativo e limpeza. Cada setor recebe uniforme adequado à função, com identidade visual alinhada ao posicionamento da instituição.",
    },
  ]}
/>
```

- [ ] **Step 3: Adicionar FAQSchema no hub de dentista**

```tsx
<FAQSchema
  items={[
    {
      question: "Qual jaleco usar na odontologia?",
      answer:
        "Na odontologia, o jaleco ideal tem manga longa para proteção contra respingos, fechamento total e tecido de fácil higienização. O gabardine com elastano é o mais pedido pelos dentistas da Jaleca: lava com facilidade, não amassa e oferece conforto mesmo em longas consultas.",
    },
    {
      question: "Jaleco de dentista pode ser colorido?",
      answer:
        "Sim. Não há restrição legal no Brasil. Muitos dentistas usam tons como azul, verde menta ou lilás, especialmente em atendimento pediátrico, para transmitir acolhimento. A Jaleca oferece diversas cores para dentistas.",
    },
    {
      question: "Qual o comprimento ideal de jaleco para dentista?",
      answer:
        "O comprimento médio (85cm a 95cm) é o mais escolhido por dentistas: cobre bem a roupa sem dificultar o movimento de sentar e levantar durante os atendimentos.",
    },
    {
      question: "Qual tamanho escolher no jaleco de dentista?",
      answer:
        "M e G acinturados são os mais vendidos. Se estiver em dúvida entre dois tamanhos, prefira o maior — o jaleco não deve apertar nos ombros. Meça a largura dos seus ombros antes de comprar para evitar troca.",
    },
    {
      question: "Posso personalizar jaleco com o nome da clínica?",
      answer:
        "Sim. A Jaleca oferece bordado e silk screen para identificação do profissional ou da clínica odontológica. Para uniformização de equipes completas, entre em contato para orçamento.",
    },
  ]}
/>
```

- [ ] **Step 4: Adicionar FAQSchema no hub de enfermeiro**

```tsx
<FAQSchema
  items={[
    {
      question: "Qual o melhor tecido para jaleco ou scrub de enfermagem?",
      answer:
        "Para enfermagem, o gabardine com elastano é o mais pedido na Jaleca: suporta múltiplas lavagens diárias, seca rápido e oferece liberdade de movimento em plantões longos. Para uso em ambientes de alta exposição, o gabardine 100% poliéster é mais fácil de higienizar.",
    },
    {
      question: "Jaleco ou scrub para enfermagem — qual escolher?",
      answer:
        "Depende do ambiente. Scrubs (conjunto calça + blusa) são padrão em UTI, centros cirúrgicos e pronto-socorro por facilitar movimentação e troca rápida. Jalecos tradicionais são mais usados em postos de enfermagem, ambulatórios e consultas.",
    },
    {
      question: "Qual tamanho de jaleco escolher para enfermagem?",
      answer:
        "M e G acinturados são os mais vendidos. O erro mais frequente é pedir M e precisar trocar por G. Meça seus ombros antes de comprar — o jaleco não deve apertar no tórax durante movimentos de extensão dos braços.",
    },
    {
      question: "Com que frequência lavar o jaleco de enfermagem?",
      answer:
        "Recomenda-se lavar após cada plantão. Jalecos Jaleca em gabardine com elastano suportam lavagens frequentes sem perda de qualidade quando lavados entre 30°C e 40°C com detergente neutro.",
    },
    {
      question: "A Jaleca fornece uniformes para toda a equipe de enfermagem?",
      answer:
        "Sim. Hospitais e clínicas podem uniformizar equipes completas com a Jaleca, incluindo diferentes modelos por cargo (técnico, enfermeiro, coordenador). Consulte-nos para orçamento de pedidos em volume.",
    },
  ]}
/>
```

- [ ] **Step 5: Adicionar FAQSchema no hub de professor**

```tsx
<FAQSchema
  items={[
    {
      question: "Qual jaleco usar para professor?",
      answer:
        "Para professores, o jaleco mais escolhido na Jaleca é o gabardine 100% poliéster: durável, fácil de lavar e com excelente custo-benefício para uso diário em sala de aula. Para professores universitários e coordenadores, o tecido alfaiataria premium transmite mais autoridade e elegância.",
    },
    {
      question: "Jaleco de professor precisa ser branco?",
      answer:
        "Não. Professores de ciências, laboratório e educação física frequentemente usam branco por convenção, mas não há obrigação legal. Cores como azul, cinza e bege são populares entre professores de outras áreas.",
    },
    {
      question: "Qual tamanho de jaleco para professor?",
      answer:
        "M e G acinturados são os mais vendidos. Se estiver em dúvida, prefira o maior — o jaleco deve ter folga suficiente para escrever no quadro com os braços levantados sem apertar.",
    },
    {
      question: "Jaleco de aluno é igual ao de professor?",
      answer:
        "Não. Jalecos para alunos da Jaleca são feitos em gabardine 100% poliéster, com foco em durabilidade e custo acessível para uso intenso. Jalecos para professores usam tecidos premium com acabamento superior.",
    },
    {
      question: "A escola pode uniformizar todos os professores com a Jaleca?",
      answer:
        "Sim. A Jaleca atende escolas e universidades com uniformização completa de professores, incluindo bordado com o nome da instituição. Entre em contato para orçamento por volume.",
    },
  ]}
/>
```

- [ ] **Step 6: Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Testar rich results localmente**

```bash
npm run dev
```

Abrir `http://localhost:3000/jaleco-medico` e verificar no source que o JSON-LD da FAQPage está presente.

- [ ] **Step 8: Commit**

```bash
git add app/jaleco-*/
git commit -m "seo: FAQSchema JSON-LD nos hubs de profissão"
```

---

## Task 6: ProductSchema nas Páginas de Produto

**Files:**
- Modificar: `app/produto/[slug]/page.tsx`

- [ ] **Step 1: Ler a estrutura atual**

```bash
cat "app/produto/[slug]/page.tsx"
```

- [ ] **Step 2: Identificar onde os dados do produto são carregados**

Procurar a variável `product` com os campos `name`, `price`, `images`, `description`, `stock_status`.

- [ ] **Step 3: Adicionar ProductSchema no return**

Logo após a abertura do container principal:

```tsx
import { ProductSchema } from "@/components/seo/ProductSchema"

<ProductSchema
  name={product.name}
  description={product.short_description || product.description.replace(/<[^>]*>/g, "")}
  sku={product.sku}
  image={product.images.map((img: { src: string }) => img.src)}
  price={parseFloat(product.price)}
  availability={product.stock_status === "instock" ? "InStock" : "OutOfStock"}
/>
```

- [ ] **Step 4: Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Testar em uma página de produto**

```bash
npm run dev
```

Abrir uma URL de produto, inspecionar o source e confirmar JSON-LD com `@type: Product` presente.

- [ ] **Step 6: Commit**

```bash
git add "app/produto/[slug]/page.tsx"
git commit -m "seo: ProductSchema JSON-LD nas páginas de produto"
```

---

## Task 7: Componente UGCGallery

**Files:**
- Criar: `data/ugc.ts`
- Criar: `components/UGCGallery.tsx`

- [ ] **Step 1: Criar banco de dados UGC**

```ts
// data/ugc.ts
export interface UGCEntry {
  id: string
  profession: "medico" | "dentista" | "enfermeiro" | "professor" | "estetica" | "veterinario"
  authorName: string
  authorHandle?: string
  imageUrl: string
  caption: string
  productName?: string
  rating?: number
  date: string
}

// Preencher com fotos coletadas via DM do Instagram (com permissão)
export const ugcEntries: UGCEntry[] = []
```

- [ ] **Step 2: Criar componente UGCGallery**

```tsx
// components/UGCGallery.tsx
import Image from "next/image"
import { ugcEntries, type UGCEntry } from "@/data/ugc"

interface UGCGalleryProps {
  profession?: UGCEntry["profession"]
  maxItems?: number
  title?: string
}

export function UGCGallery({
  profession,
  maxItems = 6,
  title = "Quem usa Jaleca",
}: UGCGalleryProps) {
  const entries = ugcEntries
    .filter((e) => !profession || e.profession === profession)
    .slice(0, maxItems)

  if (entries.length === 0) return null

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: entries
      .filter((e) => e.rating)
      .map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Review",
          author: { "@type": "Person", name: e.authorName },
          reviewRating: { "@type": "Rating", ratingValue: e.rating, bestRating: 5 },
          reviewBody: e.caption,
          datePublished: e.date,
          ...(e.productName && { itemReviewed: { "@type": "Product", name: e.productName } }),
        },
      })),
  }

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="relative rounded-lg overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={entry.imageUrl}
                alt={`${entry.authorName} usando ${entry.productName || "jaleco Jaleca"}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-sm font-semibold">{entry.authorName}</p>
              {entry.authorHandle && (
                <p className="text-white/70 text-xs">{entry.authorHandle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verificar compilação**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/UGCGallery.tsx data/ugc.ts
git commit -m "feat: componente UGCGallery com Schema Review para fotos de clientes"
```

---

## Task 8: Integrar UGCGallery nas Páginas

**Files:**
- Modificar: `app/produto/[slug]/page.tsx`
- Modificar: `app/jaleco-medico/page.tsx` (e demais hubs)
- Modificar: `app/page.tsx` ou `app/home/page.tsx`

- [ ] **Step 1: Adicionar UGCGallery nos hubs de profissão**

Em cada hub (`jaleco-medico`, `jaleco-dentista`, `jaleco-enfermeiro`, `jaleco-professor`), após o FAQSchema:

```tsx
import { UGCGallery } from "@/components/UGCGallery"

<UGCGallery profession="medico" maxItems={6} title="Profissionais que escolhem Jaleca" />
```

- [ ] **Step 2: Adicionar galeria geral na home**

Em `app/page.tsx` ou `app/home/page.tsx`, adicionar seção antes do footer:

```tsx
import { UGCGallery } from "@/components/UGCGallery"

<section className="py-16 px-4 max-w-6xl mx-auto">
  <UGCGallery maxItems={9} title="Nossa comunidade de profissionais" />
</section>
```

- [ ] **Step 3: Build completo**

```bash
npm run build
```

Expected: build sem erros. UGCGallery retorna `null` enquanto `ugcEntries` estiver vazio — sem impacto visual.

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat: UGCGallery integrada em hubs de profissão e home"
```

---

## Task 9: Artigo 1 — Tecidos para Jaleco (Dados Proprietários)

**Objetivo:** Publicar via WordPress REST API artigo com dados reais de tecidos do Jaleca — conteúdo que nenhum concorrente tem.

**Título:** "Qual o melhor tecido para jaleco? O que aprendemos com milhares de pedidos"
**Slug:** `melhor-tecido-para-jaleco`

- [ ] **Step 1: Ler credenciais WP da memória**

Credenciais disponíveis em `memory/wp_credentials.md`.

- [ ] **Step 2: Publicar o artigo via REST API**

```bash
curl -X POST "https://jaleca.com.br/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'USER:APP_PASSWORD' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Qual o melhor tecido para jaleco? O que aprendemos com milhares de pedidos",
    "slug": "melhor-tecido-para-jaleco",
    "status": "publish",
    "categories": [ID_CATEGORIA_SEO],
    "content": "<p>A escolha do tecido é a decisão mais importante ao comprar um jaleco profissional. Após milhares de pedidos atendidos, a Jaleca identificou três tecidos que dominam as escolhas dos profissionais brasileiros — cada um com um perfil de uso diferente.</p>\n\n<h2>Gabardine com elastano: o favorito dos profissionais</h2>\n<p>O tecido mais pedido na Jaleca para jalecos e conjuntos profissionais é o <strong>gabardine com elastano</strong>. A combinação de durabilidade com liberdade de movimento o torna ideal para médicos, dentistas, enfermeiros e estetas que passam longas jornadas em atendimento. O elastano garante que o jaleco acompanha o corpo sem apertar, mesmo em movimentos amplos como estender os braços ou se abaixar.</p>\n<p>É o tecido que recomendamos para quem precisa de um jaleco para uso diário intenso com excelente custo-benefício.</p>\n\n<h2>Alfaiataria premium: para quem quer transmitir autoridade</h2>\n<p>O tecido <strong>alfaiataria premium</strong> é a escolha dos profissionais que priorizam aparência e postura: coordenadores médicos, diretores clínicos, dentistas com consultórios de alto padrão. Tem caimento superior, aparência mais formal e estruturada — o jaleco parece ter saído de uma alfaiataria, não de uma prateleira.</p>\n<p>É mais indicado para ambientes em que a imagem profissional tem peso estratégico, como clínicas premium e hospitais de referência.</p>\n\n<h2>Gabardine 100% poliéster: praticidade e custo acessível</h2>\n<p>O <strong>gabardine 100% poliéster</strong> é o tecido mais escolhido para jalecos de estudantes e professores. Resiste bem a lavagens frequentes, seca rapidamente e tem o melhor custo de entrada. Para quem está em fase de formação ou usa jaleco pontualmente (laboratório, sala de aula), é a escolha mais inteligente.</p>\n\n<h2>Como escolher o tecido certo para o seu jaleco</h2>\n<ul>\n<li><strong>Uso diário em atendimento clínico</strong> → Gabardine com elastano</li>\n<li><strong>Ambiente premium, imagem formal</strong> → Alfaiataria premium</li>\n<li><strong>Estudante ou uso pontual</strong> → Gabardine 100% poliéster</li>\n</ul>\n\n<p>Conheça nossa linha completa de <a href=\"/jaleco-medico\">jalecos para médicos</a>, <a href=\"/jaleco-dentista\">jalecos para dentistas</a> e <a href=\"/jaleco-professor\">jalecos para professores</a> com cada um desses tecidos disponíveis.</p>\n\n<h2>Perguntas frequentes sobre tecido de jaleco</h2>\n\n<h3>Jaleco de gabardine com elastano pode ser lavado na máquina?</h3>\n<p>Sim. Lave com água morna (máx. 40°C) e detergente neutro. Evite centrifugação forte para preservar o elastano. Seque à sombra.</p>\n\n<h3>Qual tecido de jaleco não amarela?</h3>\n<p>Gabardine com elastano e alfaiataria premium são os mais resistentes ao amarelamento. Evite cloro — use perborato de sódio para brancos. O gabardine 100% poliéster pode amarelecer com lavagens em água muito quente.</p>\n\n<h3>Tecido de jaleco interfere no ranqueamento do Google?</h3>\n<p>Não diretamente, mas a escolha do tecido impacta a satisfação do cliente e a taxa de devolução — que afeta a reputação da loja.</p>"
  }'
```

- [ ] **Step 3: Verificar publicação**

```bash
curl "https://jaleca.com.br/wp-json/wp/v2/posts?slug=melhor-tecido-para-jaleco"
```

Expected: retorna o post com `"status": "publish"`.

- [ ] **Step 4: Confirmar que a URL está acessível**

Abrir `https://jaleca.com.br/melhor-tecido-para-jaleco` no browser e verificar que o conteúdo aparece corretamente.

---

## Task 10: Artigo 2 — Guia de Tamanhos (Dados Proprietários)

**Título:** "Como escolher o tamanho certo do jaleco — e por que a maioria erra"
**Slug:** `como-escolher-tamanho-jaleco`

- [ ] **Step 1: Publicar via REST API**

```bash
curl -X POST "https://jaleca.com.br/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'USER:APP_PASSWORD' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Como escolher o tamanho certo do jaleco — e por que a maioria erra",
    "slug": "como-escolher-tamanho-jaleco",
    "status": "publish",
    "categories": [ID_CATEGORIA_SEO],
    "content": "<p>Os tamanhos M e G acinturados são os mais vendidos na Jaleca — e também os mais trocados. O motivo número um de troca de jaleco é simples: o cliente pede M e precisa de G. Se você já fez isso, não está sozinho. Neste guia, você aprende como acertar o tamanho na primeira vez.</p>\n\n<h2>Por que as pessoas erram o tamanho do jaleco?</h2>\n<p>O jaleco tem uma modelagem diferente de roupas do dia a dia. O <strong>jaleco acinturado</strong> — o modelo mais pedido na Jaleca — tem uma entrada marcada na cintura que pode dar a impressão de que é menor do que realmente é. Quando o cliente experimenta o M, sente que cabe bem na cintura mas aperta nos ombros e no tórax — e aí vem a troca pelo G.</p>\n<p>A regra de ouro: <strong>o jaleco não deve apertar em nenhum movimento</strong>. Se apertar na cintura ao levantar os braços, está pequeno.</p>\n\n<h2>Como medir o tamanho certo em 3 passos</h2>\n<ol>\n<li><strong>Meça a largura dos ombros</strong> — com uma fita métrica, da ponta de um ombro à ponta do outro, passando pelas costas. Essa é a medida mais importante.</li>\n<li><strong>Meça o busto</strong> — passe a fita ao redor da parte mais larga do tórax, sem apertar.</li>\n<li><strong>Consulte a tabela de tamanhos Jaleca</strong> — com essas duas medidas em mãos, encontre o tamanho correspondente na tabela disponível em cada página de produto.</li>\n</ol>\n\n<h2>Se estiver entre dois tamanhos, escolha o maior</h2>\n<p>O jaleco profissional precisa ter folga suficiente para movimentos amplos: estender os braços, se abaixar, gesticular durante o atendimento. Se estiver entre M e G, vá de G. O jaleco acinturado ainda vai valorizar a silhueta mesmo no tamanho maior.</p>\n\n<h2>Modelagem acinturada vs. reta — qual escolher?</h2>\n<p>A <strong>modelagem acinturada</strong> é a mais pedida pelos nossos clientes: valoriza a silhueta sem perder o profissionalismo. É ideal para médicas, dentistas e enfermeiras que querem aliar conforto e elegância.</p>\n<p>A <strong>modelagem reta</strong> oferece mais liberdade de movimento e é preferida por quem realiza procedimentos que exigem muita mobilidade ou prefere um visual mais neutro.</p>\n\n<p>Veja nossa linha completa de <a href=\"/jaleco-feminino\">jalecos femininos</a> e <a href=\"/jaleco-masculino\">jalecos masculinos</a> com tabela de medidas detalhada em cada produto.</p>\n\n<h2>Perguntas frequentes sobre tamanho de jaleco</h2>\n\n<h3>Posso trocar o jaleco se errar o tamanho?</h3>\n<p>Sim. A Jaleca aceita troca de tamanho. Mas seguindo este guia, as chances de acertar na primeira compra são muito maiores.</p>\n\n<h3>Jaleco encolhe depois de lavar?</h3>\n<p>Jalecos em gabardine com elastano e alfaiataria premium da Jaleca não encolhem quando lavados dentro das instruções (água até 40°C, sem secadora em temperatura alta). O gabardine 100% poliéster é ainda mais estável.</p>\n\n<h3>Tamanho de jaleco é igual ao de camisa?</h3>\n<p>Não. O jaleco tem modelagem própria. Sempre use a tabela de medidas específica do jaleco — não assuma que seu tamanho de camisa equivale ao tamanho do jaleco.</p>"
  }'
```

- [ ] **Step 2: Verificar publicação**

```bash
curl "https://jaleca.com.br/wp-json/wp/v2/posts?slug=como-escolher-tamanho-jaleco"
```

Expected: `"status": "publish"`.

---

## Task 11: Artigo 3 — Por Que Jalecos São Devolvidos

**Título:** "Por que jalecos são devolvidos — e como acertar na primeira compra"
**Slug:** `por-que-jalecos-sao-devolvidos`

- [ ] **Step 1: Publicar via REST API**

```bash
curl -X POST "https://jaleca.com.br/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'USER:APP_PASSWORD' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Por que jalecos são devolvidos — e como acertar na primeira compra",
    "slug": "por-que-jalecos-sao-devolvidos",
    "status": "publish",
    "categories": [ID_CATEGORIA_SEO],
    "content": "<p>A principal razão pela qual jalecos são devolvidos na Jaleca é uma só: <strong>o cliente pediu M e precisou de G</strong>. Não é problema de qualidade, nem de cor diferente da foto — é a modelagem do jaleco que engana quem está acostumado com roupas comuns. Neste artigo, explicamos por que isso acontece e como evitar.</p>\n\n<h2>O principal motivo de devolução: subestimar o tamanho</h2>\n<p>O jaleco acinturado — o modelo mais vendido da Jaleca — tem uma entrada marcada na cintura que cria uma ilusão: parece menor no cabide do que realmente é. O cliente compara mentalmente com sua camisa ou blusa, pede M, e quando recebe percebe que aperta nos ombros ou no tórax durante os movimentos.</p>\n<p>A troca por G resolve o problema — e o jaleco G acinturado continua valorizando a silhueta sem ficar largo.</p>\n\n<h2>Como evitar a troca: meça os ombros antes de comprar</h2>\n<p>A medida que define o tamanho do jaleco não é a cintura — é a <strong>largura dos ombros</strong>. Com uma fita métrica, meça da ponta de um ombro à ponta do outro pelas costas. Compare com a tabela de tamanhos disponível em cada produto do site.</p>\n\n<h2>Outros cuidados para acertar na primeira compra</h2>\n<ul>\n<li><strong>Modelagem acinturada vs. reta:</strong> se você faz muitos movimentos amplos no trabalho, considere a reta — ela tem mais folga no tórax.</li>\n<li><strong>Comprimento:</strong> verifique o comprimento descrito na ficha técnica. Jalecos longos (105cm+) cobrem mais a roupa; curtos (85cm-90cm) são mais práticos para quem senta muito.</li>\n<li><strong>Tecido:</strong> gabardine com elastano tem caimento mais fluído; alfaiataria premium é mais estruturado — ambos mantêm o tamanho após as lavagens.</li>\n</ul>\n\n<p>Com essas informações, a chance de acertar na primeira compra é muito maior. Veja nossa <a href=\"/jaleco-feminino\">linha feminina</a> e <a href=\"/jaleco-masculino\">linha masculina</a> com tabela de medidas completa em cada produto.</p>\n\n<h2>Perguntas frequentes</h2>\n\n<h3>Posso trocar o jaleco se não servir?</h3>\n<p>Sim. A Jaleca aceita troca de tamanho dentro do prazo legal. Mas com as medidas certas em mãos, as chances de precisar trocar caem drasticamente.</p>\n\n<h3>Jaleco encolhe e fica pequeno depois de lavar?</h3>\n<p>Os tecidos utilizados pela Jaleca (gabardine com elastano, alfaiataria premium e gabardine 100% poliéster) não encolhem quando lavados conforme as instruções — água até 40°C, sem secadora em alta temperatura.</p>\n\n<h3>E se eu estiver entre dois tamanhos?</h3>\n<p>Escolha o maior. O jaleco precisa ter folga para movimentos profissionais sem apertar. O tamanho maior em modelagem acinturada ainda valoriza a silhueta.</p>"
  }'
```

- [ ] **Step 2: Verificar publicação**

```bash
curl "https://jaleca.com.br/wp-json/wp/v2/posts?slug=por-que-jalecos-sao-devolvidos"
```

Expected: `"status": "publish"`.

---

## Task 12: Artigo 4 — Jaleco por Profissão

**Título:** "Jaleco por profissão: qual modelo cada profissional escolhe"
**Slug:** `jaleco-por-profissao`

- [ ] **Step 1: Publicar via REST API**

```bash
curl -X POST "https://jaleca.com.br/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'USER:APP_PASSWORD' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Jaleco por profissão: qual modelo cada profissional escolhe",
    "slug": "jaleco-por-profissao",
    "status": "publish",
    "categories": [ID_CATEGORIA_SEO],
    "content": "<p>Cada profissão tem necessidades específicas para o jaleco de trabalho. Após anos atendendo médicos, dentistas, enfermeiros, professores, veterinários e estetas, a Jaleca identificou os padrões de escolha de cada grupo. Se você quer acertar na compra sem pesquisar horas, este guia foi feito para você.</p>\n\n<h2>Jaleco para médico</h2>\n<p>Médicos priorizam <strong>durabilidade e aparência profissional</strong>. O modelo mais escolhido é o jaleco de manga longa em gabardine com elastano, modelagem acinturada para médicas e reta para médicos. Tamanho M e G são os mais pedidos. Coordenadores e diretores clínicos frequentemente optam pelo tecido alfaiataria premium para transmitir mais autoridade.</p>\n<p>→ <a href=\"/jaleco-medico\">Veja todos os jalecos para médico</a></p>\n\n<h2>Jaleco para dentista</h2>\n<p>Dentistas buscam <strong>proteção e praticidade</strong>. Manga longa é padrão para proteção contra respingos. O gabardine com elastano é o tecido favorito pela facilidade de higienização e conforto durante consultas longas. Comprimento médio (85-95cm) facilita sentar e levantar durante o atendimento.</p>\n<p>→ <a href=\"/jaleco-dentista\">Veja todos os jalecos para dentista</a></p>\n\n<h2>Jaleco para enfermeiro</h2>\n<p>Enfermeiros e técnicos de enfermagem dividem-se entre <strong>jalecos tradicionais e scrubs</strong>. Scrubs (conjunto calça + blusa) dominam em UTI e centro cirúrgico; jalecos em postos de enfermagem e ambulatórios. O gabardine com elastano é o mais pedido pela resistência a lavagens diárias.</p>\n<p>→ <a href=\"/jaleco-enfermeiro\">Veja todos os jalecos para enfermeiro</a></p>\n\n<h2>Jaleco para professor</h2>\n<p>Professores priorizam <strong>custo-benefício e durabilidade</strong>. Para professores universitários e de ciências, o gabardine 100% poliéster atende bem. Coordenadores e reitores frequentemente escolhem alfaiataria premium. Cores neutras (branco, azul, cinza) são as mais pedidas.</p>\n<p>→ <a href=\"/jaleco-professor\">Veja todos os jalecos para professor</a></p>\n\n<h2>Jaleco para estética</h2>\n<p>Profissionais de estética combinam <strong>funcionalidade com elegância</strong>. Modelos com modelagem acinturada e cores diferenciadas (rosê, lilás, branco) são os mais pedidos. O gabardine com elastano domina pela aparência impecável após lavagem.</p>\n<p>→ <a href=\"/jaleco-estetica\">Veja todos os jalecos para estética</a></p>\n\n<h2>Jaleco para veterinário</h2>\n<p>Veterinários buscam <strong>resistência e praticidade</strong>. Jalecos de manga longa com bolsos amplos para instrumentos são os mais pedidos. O gabardine com elastano ou 100% poliéster são preferidos pela facilidade de limpeza após procedimentos.</p>\n<p>→ <a href=\"/jaleco-veterinario\">Veja todos os jalecos para veterinário</a></p>\n\n<h2>Perguntas frequentes</h2>\n\n<h3>Existe jaleco universal que serve para qualquer profissão?</h3>\n<p>Existe — mas não é a melhor escolha. Um jaleco de gabardine com elastano, manga longa, modelagem acinturada serve para a maioria das profissões de saúde. Mas cada profissão tem necessidades específicas de comprimento, bolsos e tecido que um jaleco especializado atende melhor.</p>\n\n<h3>Qual profissão usa mais jaleco no Brasil?</h3>\n<p>A área de saúde (medicina, odontologia, enfermagem) representa a maior parte dos pedidos da Jaleca, seguida de educação e estética.</p>"
  }'
```

- [ ] **Step 2: Verificar publicação**

```bash
curl "https://jaleca.com.br/wp-json/wp/v2/posts?slug=jaleco-por-profissao"
```

Expected: `"status": "publish"`.

---

## Task 13: Artigo 5 — Case B2B Hospital Dr. Luiz Ronaldo

**Título:** "Uniformização hospitalar completa: o case do Dr. Luiz Ronaldo"
**Slug:** `case-uniformizacao-hospitalar-jaleca`

- [ ] **Step 1: Publicar via REST API**

```bash
curl -X POST "https://jaleca.com.br/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'USER:APP_PASSWORD' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Uniformização hospitalar completa: o case do Dr. Luiz Ronaldo",
    "slug": "case-uniformizacao-hospitalar-jaleca",
    "status": "publish",
    "categories": [ID_CATEGORIA_SEO],
    "content": "<p>Quando um hospital decide uniformizar toda a equipe, o desafio vai além de escolher modelos e cores. É preciso criar uma identidade visual que transmita profissionalismo, acolha diferentes perfis de colaboradores e posicione a instituição no mercado. Este é o case do Dr. Luiz Ronaldo, médico angiologista que escolheu a Jaleca como parceira estratégica para a abertura do seu hospital em Ipatinga (MG).</p>\n\n<h2>O desafio: identidade visual para um hospital referência</h2>\n<p>O Dr. Luiz Ronaldo já era cliente da Jaleca — usava nossos jalecos em sua rotina de atendimentos. Com a inauguração do hospital próprio, projetado para ser referência regional, surgiu uma necessidade mais ampla: <strong>criar uma identidade visual forte e padronizar a apresentação de toda a equipe</strong>.</p>\n<p>O hospital contemplava diferentes perfis de colaboradores, cada um com necessidades específicas:</p>\n<ul>\n<li>Atendimento e recepção</li>\n<li>Secretariado e administrativo</li>\n<li>Equipe de limpeza</li>\n<li>Corpo clínico (médicos)</li>\n</ul>\n<p>O desafio era atender todos esses perfis com uniformes adequados à função, sem perder a coesão visual que posicionaria o hospital como referência.</p>\n\n<h2>A solução Jaleca: uniformização estratégica</h2>\n<p>A Jaleca foi escolhida como parceira estratégica para a uniformização completa. As ações implementadas foram:</p>\n<ul>\n<li>✅ Padronização de uniformes para todos os setores do hospital</li>\n<li>✅ Desenvolvimento de identidade visual alinhada ao posicionamento premium da instituição</li>\n<li>✅ Entrega de jalecos exclusivos para todos os médicos atuantes</li>\n<li>✅ Aplicação de design moderno, confortável e funcional em cada cargo</li>\n</ul>\n\n<h2>Além do uniforme: posicionamento de marca</h2>\n<p>O que a Jaleca entregou para o hospital do Dr. Luiz Ronaldo foi mais do que tecido e costura. Foi:</p>\n<ul>\n<li><strong>Posicionamento de marca:</strong> a identidade visual dos uniformes reforçou o posicionamento premium do hospital</li>\n<li><strong>Experiência para o paciente:</strong> a coesão visual da equipe transmite organização e confiança no primeiro contato</li>\n<li><strong>Valorização da equipe:</strong> colaboradores uniformizados com qualidade sentem-se parte de uma instituição de referência</li>\n<li><strong>Branding institucional:</strong> o jaleco virou parte da marca do hospital</li>\n</ul>\n\n<h2>Resultados</h2>\n<ul>\n<li>🏆 Fortalecimento da imagem do hospital como referência regional em Ipatinga (MG)</li>\n<li>👥 Maior engajamento e valorização da equipe interna</li>\n<li>👁️ Percepção imediata de profissionalismo pelos pacientes no primeiro atendimento</li>\n<li>🏷️ Consolidação da Jaleca como fornecedora oficial do hospital</li>\n</ul>\n\n<h2>Como funciona a uniformização B2B com a Jaleca</h2>\n<p>Se você gerencia uma clínica, hospital ou consultório e quer uniformizar sua equipe, o processo com a Jaleca é simples:</p>\n<ol>\n<li><strong>Diagnóstico:</strong> mapeamos os setores e perfis de colaboradores</li>\n<li><strong>Curadoria:</strong> selecionamos modelos e tecidos adequados para cada função</li>\n<li><strong>Identidade visual:</strong> aplicamos bordado ou silk screen com a marca da instituição</li>\n<li><strong>Entrega:</strong> fornecemos os uniformes com prazo acordado para toda a equipe</li>\n</ol>\n<p>Entre em contato para um orçamento personalizado para sua clínica ou hospital.</p>\n\n<h2>Perguntas frequentes sobre uniformização hospitalar</h2>\n\n<h3>A Jaleca atende pedidos grandes para hospitais inteiros?</h3>\n<p>Sim. Atendemos desde consultórios com 3 colaboradores até hospitais com equipes completas de diferentes setores.</p>\n\n<h3>É possível personalizar os uniformes com a identidade visual do hospital?</h3>\n<p>Sim. Oferecemos bordado e silk screen com logo, nome da instituição ou nome do profissional.</p>\n\n<h3>Qual o prazo de entrega para pedidos em volume?</h3>\n<p>O prazo varia conforme o volume e a personalização. Entre em contato para um orçamento com prazo específico para o seu caso.</p>"
  }'
```

- [ ] **Step 2: Verificar publicação**

```bash
curl "https://jaleca.com.br/wp-json/wp/v2/posts?slug=case-uniformizacao-hospitalar-jaleca"
```

Expected: `"status": "publish"`.

---

## Task 14: Verificação Final e Monitoramento

**Files:**
- Criar: `docs/seo/monitoramento-quinzenal.md`

- [ ] **Step 1: Verificar todos os JSON-LDs com Rich Results Test**

Testar URLs no Google Rich Results Test:
- `jaleca.com.br/jaleco-medico` → deve mostrar FAQ eligível
- `jaleca.com.br/jaleco-dentista` → deve mostrar FAQ eligível
- Uma URL de produto → deve mostrar Product eligível

- [ ] **Step 2: Verificar no GSC após 48-72h**

Acessar Google Search Console → Melhorias → Resultados Avançados e verificar:
- FAQs detectadas nas páginas de profissão
- Produtos detectados nas páginas de produto
- Erros de Schema a corrigir

- [ ] **Step 3: Criar checklist de monitoramento quinzenal**

```markdown
# Monitoramento SEO Quinzenal — Jaleca

## A cada 15 dias

### Indexação (GSC)
- [ ] "Páginas rastreadas mas não indexadas" — houve aumento?
- [ ] "Páginas indexadas" — houve queda?
- [ ] Novos erros de cobertura?

### Performance (GSC)
- [ ] Impressões totais vs. quinzena anterior (meta: +20% em 30 dias)
- [ ] Cliques totais vs. quinzena anterior (meta: +15% em 30 dias)
- [ ] CTR médio — subiu ou caiu?
- [ ] Posição média (baseline: 7.9)

### Rich Results
- [ ] "Resultados avançados" no GSC — FAQ snippets ativos?
- [ ] Testar 3 URLs aleatórias no Rich Results Test

### AI Overviews (busca manual)
- [ ] Buscar 10 queries-alvo no Google incognito
- [ ] Jaleca é citada em alguma AIO?
- [ ] Queries com AIO onde Jaleca não aparece → candidatas a novo artigo

### UGC
- [ ] Novas fotos coletadas no Instagram esta quinzena?
- [ ] Adicionar aprovadas em data/ugc.ts e fazer deploy
```

- [ ] **Step 4: Commit final**

```bash
git add docs/seo/
git commit -m "docs: checklist monitoramento SEO quinzenal"
```

---

## Resumo de Execução — 30 dias

| Semana | Tasks | Impacto esperado |
|---|---|---|
| 1 | 1, 2, 3, 4 (componentes + auditoria PAA) | Base técnica pronta |
| 2 | 5, 6 (FAQ + Product Schema nos hubs) | Rich results elegíveis |
| 3 | 7, 8, 9, 10 (UGCGallery + artigos 1 e 2) | Conteúdo proprietário indexando |
| 4 | 11, 12, 13, 14 (artigos 3-5 + monitoramento) | Todas as frentes ativas |

---

## Consumo estimado por IA neste plano

| IA | Participação estimada | Papel |
|---|---:|---|
| Claude Code | 85% | Plano técnico e conteúdo completo |
| Gemini | 10% | Contexto histórico do projeto |
| GPT | 0% | MCP indisponível |
| GSC | 5% | Baseline pos 7.9 |

*Estimativa operacional — não medição financeira exata.*

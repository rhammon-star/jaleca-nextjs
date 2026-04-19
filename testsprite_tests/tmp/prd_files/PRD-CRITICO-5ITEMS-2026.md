# PRD — 5 Itens Críticos Jaleca
### Data: 05/04/2026
### Status: PRONTO PARA IMPLEMENTAÇÃO

---

## OVERVIEW

5 mudanças de UI que NÃO exigem redesign, NÃO alteram lógica de negócio, e têm impacto direto na conversão. Todas podem ser implementadas em 2-4 horas e deployadas sem risco de quebra.

**Complexidade geral:** Baixa. Mudanças cosméticas + 1 meta tag.
**Risco em produção:** Mínimo (só adiciona conteúdo, não remove).

---

## ITEM 1 — Meta Robots Tag
### Arquivo: `app/layout.tsx`
### Tempo estimado: 5 minutos
### Risco: ZERO

### O que é
Adicionar `<meta name="robots" content="INDEX,FOLLOW" />` no `<head>` para garantir que Google indexe todas as páginas.

### Estado atual
O arquivo `app/layout.tsx` NÃO tem meta robots tag. 7 dos 12 concorrentes têm.

### Implementação
No `export const metadata` do arquivo `app/layout.tsx`, adicionar:

```ts
export const metadata: Metadata = {
  // ... campos existentes ...
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

### Verificação pós-deploy
```bash
curl -s https://jaleca.com.br/ | grep -i "meta.*robots"
# Deve retornar: <meta name="robots" content="...">
```

---

## ITEM 2 — OG Image como Foto Real
### Arquivo: `public/og-home.jpg` (criar) + `app/layout.tsx` (já está referenciando)
### Tempo estimado: 15 minutos + foto
### Risco: ZERO (só adiciona arquivo)

### O que é
Substituir o OG image de logo para foto lifestyle real (1200x630px). Hoje quando alguém compartilha `jaleca.com.br` no WhatsApp/Facebook aparece o logo — não gera click.

### Estado atual
`app/layout.tsx` linha 51 referencia:
```
images: [{ url: "https://jaleca.com.br/og-home.jpg", width: 1200, height: 630 }]
```
Mas o arquivo `public/og-home.jpg` NÃO existe no filesystem. Imagem provavelmente está no Vercel Blob Storage ou não existe.

### Implementação
**Passo 1:** Criar arquivo `public/og-home.jpg` com:
- Dimensões: 1200x630px
- Formato: JPG ou WebP
- Conteúdo: Foto lifestyle de produto (modelo usando jaleco em contexto profissional) OU collage de produtos
- A imagem deve comunicar "profissional de saúde" + "moda/estilo"

**Sugestão de imagem:**
- Usar uma das fotos existentes: `public/hero-modelo.jpg` ou `public/hero-jaleca-v2.jpg` — verificar se tem 1200x630
- Ou criar collage: 3 produtos lado a lado com logo no cantinho

**Passo 2:** Vercel Blob (se imagem não for estática)
Se a imagem for muito grande para o filesystem (Next.js limita public a ~50KB):
- Fazer upload no Vercel Blob ou AWS S3
- Usar URL absoluta: `https://jaleca.com.br/og-home.jpg` (já está assim)

### Alternativa rápida
Copiar uma foto existente do public que seja mais representativa:
```bash
# Verificar dimensões de fotos existentes
file /Users/rhammon/SiteJaleca/jaleca-nextjs/public/hero-*.jpg
# Escolher a melhor e renomear/symlink para og-home.jpg
```

### Verificação pós-deploy
```bash
# 1. Verificar se imagem existe
curl -sI https://jaleca.com.br/og-home.jpg | head -5

# 2. Testar OG tag no Facebook
# https://developers.facebook.com/tools/debug/og/object/
# Deve mostrar: imagem preview com foto real (não logo)
```

---

## ITEM 3 — Trust Badges na Homepage
### Arquivo: `app/page.tsx`
### Tempo estimado: 30 minutos
### Risco: ZERO

### O que é
Adicionar tarja/banner no topo da homepage (abaixo do AnnouncementBar) com ícones de confiança: "Compra 100% Segura | Frete Grátis >R$599 | Troca 30 dias | PIX 5% | 3x sem juros"

### Estado atual
`app/page.tsx` NÃO tem trust badges. AnnouncementBar existe mas não tem badges de confiança. Carrinho (`CartDrawer.tsx`) já tem some trust elements.

### Design sugerido
Criar novo componente `components/TrustBadgeBar.tsx`:

```tsx
'use client'

const badges = [
  { icon: '🔒', text: 'Compra 100% Segura' },
  { icon: '🚚', text: 'Frete Grátis >R$599' },
  { icon: '🔄', text: 'Troca em 30 dias' },
  { icon: '💳', text: 'PIX 5% de desconto' },
  { icon: '💳', text: '3x sem juros' },
]

export default function TrustBadgeBar() {
  return (
    <div className="bg-secondary/30 border-b border-border py-3">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true">{badge.icon}</span>
              <span>{badge.text}</span>
              {i < badges.length - 1 && (
                <span className="text-border ml-2" aria-hidden="true">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Posicionamento
Importar no `app/page.tsx` e colocar logo abaixo do `<Header />` (mas dentro do `<main>` ou como primeiro elemento):

```tsx
// app/page.tsx
import TrustBadgeBar from '@/components/TrustBadgeBar'

export default function HomePage() {
  return (
    <>
      <Header />  {/* já existe */}
      <TrustBadgeBar />  {/* ADICIONAR AQUI */}
      <main>
        {/* resto do conteúdo */}
      </main>
    </>
  )
}
```

### Alternativa: Usar AnnouncementBar
Modificar `components/AnnouncementBar.tsx` para incluir trust badges no cycling banner:

```tsx
const messages = [
  { text: '🔒 Compra 100% Segura | 🔄 Troca em 30 dias | 💳 PIX 5% | 3x sem juros', href: null, cta: null },
  { text: '🚚 Frete Grátis para compras acima de R$599 (SP, RJ, ES, MG)', href: '/produtos', cta: 'Ver produtos' },
  // ... existing message ...
]
```

**Recomendação:** Usar TrustBadgeBar separado (mais visível que AnnouncementBar que é pequeno e rotativo).

### Estilo参考
Concorrentes que fazem bem:
- **Grafitte**: tarja preta no topo com ícones + texto branco
- **Jalecos Conforto**: badge "Frete Grátis Fixo" na tarja superior

### Verificação pós-deploy
Acessar https://jaleca.com.br e verificar se tarja aparece abaixo do AnnouncementBar.

---

## ITEM 4 — Loyalty Visível (Club Jaleca)
### Arquivo: `components/LoyaltyBadge.tsx` + `components/Header.tsx`
### Tempo estimado: 20 minutos
### Risco: BAIXO

### O que é
Mostrar "Club Jaleca" badge no header para TODOS os visitantes (não só logados), e ao passar o mouse ou clicar, mostrar "Cadastre-se e ganhe pontos". Para logados, mostrar saldo de pontos.

### Estado atual
`LoyaltyBadge.tsx` retorna `null` se não estiver logado (linha 25):
```tsx
if (!isLoggedIn || points === null) return null
```
Isso significa que o badge de loyalty só aparece DEPOIS do login — cliente não sabe que existe programa de pontos.

### Implementação

**Mudança 1:** Mostrar badge para todos (mesmo não logados)

Modificar `components/LoyaltyBadge.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getPointsDiscount } from '@/lib/loyalty-utils'
import { Star } from 'lucide-react'
import Link from 'next/link'

export default function LoyaltyBadge() {
  const { user, isLoggedIn } = useAuth()
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setPoints(null)
      return
    }
    fetch(`/api/loyalty?customerId=${user.id}`)
      .then(r => r.json())
      .then((data: { points?: number }) => {
        if (typeof data.points === 'number') setPoints(data.points)
      })
      .catch(() => {})
  }, [isLoggedIn, user])

  // NÃO LOGADO — mostra badge de programa
  if (!isLoggedIn) {
    return (
      <Link
        href="/minha-conta"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Club Jaleca: ganhe pontos em cada compra"
      >
        <Star size={12} className="text-yellow-500 fill-yellow-400" />
        <span className="font-medium hidden sm:inline">Club Jaleca</span>
      </Link>
    )
  }

  // LOGADO — mostra pontos
  if (points === null) return null

  const discount = getPointsDiscount(points)

  return (
    <div
      className="flex items-center gap-1 text-xs text-muted-foreground"
      title={`${points} pontos = R$${discount} de desconto`}
    >
      <Star size={12} className="text-yellow-500 fill-yellow-400" />
      <span className="font-medium tabular-nums">{points} pts</span>
    </div>
  )
}
```

**Mudança 2:** No header, mover LoyaltyBadge para antes do search icon (já está na posição certa — linha 150).

### Variação: Badge flutuante de loyalty
Se não quiser poluir o header, criar `components/FirstPurchasePopup.tsx` (já existe) para mostrar loyalty:
```tsx
// No FirstPurchasePopup, adicionar uma mensagem:
// " Aproveite:cadastre-se e ganhe 100 pontos na primeira compra!"
```

### Verificação pós-deploy
1. Homepage sem login → badge "Club Jaleca" visível no header
2. Fazer login → badge muda para "X pts"
3. Sem login em mobile → badge "Club Jaleca" aparece no header (sm:hidden = não aparece em mobile pequeno)

---

## ITEM 5 — Reviews Visíveis na Página de Produto
### Arquivo: `app/produto/[slug]/ProductDetailClient.tsx`
### Tempo estimado: 45 minutos
### Risco: ZERO (não altera lógica, só move elemento)

### O que é
Mostrar estrelas + número de avaliações LOGO ABAIXO do nome do produto (acima do preço), não escondido dentro da tab "Avaliações". Hoje já existe Rating summary (linha 538) mas está dentro da tab.

### Estado atual
O código JÁ TEM:
- `avgRating` (linha 441) — calcula média das avaliações
- `reviews.length` — conta avaliações
- `<StarRating rating={Math.round(avgRating)} size={13} />` (linha 540) — componente de estrelas
- Mas tudo isso só aparece DENTRO da tab "Avaliações" (linha 538: `{reviews.length > 0 && (...) }`)

### Implementação

**Passo 1:** Encontrar onde o nome do produto aparece

Ler o componente de ProductDetailClient e encontrar onde `product.name` é renderizado. Provavelmente algo como:
```tsx
<h1 className="font-display text-3xl">{product.name}</h1>
```

**Passo 2:** Adicionar stars logo após o nome do produto

Inserir logo após o heading do produto (antes do preço):
```tsx
{/* Adicionar LOGO APÓS o nome do produto, antes do preço */}
{reviews.length > 0 && (
  <div className="flex items-center gap-2 mb-2">
    <StarRating rating={Math.round(avgRating)} size={14} />
    <span className="text-xs text-muted-foreground">
      {avgRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})
    </span>
  </div>
)}
```

**Passo 3:** Garantir que o componente StarRating seja importado
Verificar se `StarRating` está definido no arquivo ou importado. Se for inline, pode precisar extrair para `components/StarRating.tsx`.

### StarRating (se não existir)
Se `StarRating` não estiver exportado como componente separado, criar:

```tsx
// components/StarRating.tsx
import { Star } from 'lucide-react'

type Props = { rating: number; size?: number }

export function StarRating({ rating, size = 16 }: Props) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default StarRating
```

### Posicionamento exato
O review stars deve aparecer LOGO após o nome do produto, neste ordem:
```
[Nome do Produto]
[★★★★☆ 4.5 (23 avaliações)]  ← NOVO
R$ 289,00
[Selecione o tamanho]
[Botão comprar]
```

### Verificação pós-deploy
1. Ir para página de produto que TEM avaliações
2. Verificar que estrelas aparecem logo abaixo do nome do produto
3. Ir para página de produto SEM avaliações → nome do produto aparece normalmente (sem stars)

---

## ORDEM DE IMPLEMENTAÇÃO SUGERIDA

| # | Item | Tempo | Depende de |
|---|------|-------|------------|
| 1 | Meta robots tag | 5 min | Nenhum |
| 2 | OG image | 15 min | Nenhum (mas precisa de foto) |
| 3 | Trust badges | 30 min | Nenhum |
| 4 | Loyalty visível | 20 min | Nenhum |
| 5 | Reviews na página | 45 min | Verificar StarRating |

**Tempo total estimado:** 2-4 horas

---

## TESTES PÓS-DEPLOY ( checklist )

### Meta robots
- [ ] `curl -sI https://jaleca.com.br/ | grep -i robots` retorna meta robots
- [ ] Google Search Console mostra páginas indexadas

### OG image
- [ ] https://jaleca.com.br/og-home.jpg retorna 200
- [ ] Facebook Debugger mostra preview com imagem correta
- [ ] WhatsApp mostra thumbnail ao compartilhar link

### Trust badges
- [ ] Homepage mostra tarja de badges
- [ ] Mobile mostra badges (pode simplificar 2 linhas)
- [ ] Não quebra em nenhuma resolução

### Loyalty
- [ ] Desktop sem login → "Club Jaleca" visível no header
- [ ] Desktop logado → "X pts" visível
- [ ] Mobile sem login → decide: mostrar ou não (espaço é limitado)

### Reviews
- [ ] Produto com avaliações → estrelas visíveis abaixo do nome
- [ ] Produto sem avaliações → nome aparece normalmente
- [ ] Click nas estrelas → scroll para tab Avaliações

---

## ARQUIVOS A MODIFICAR

| Arquivo | Mudança |
|---------|---------|
| `app/layout.tsx` | Adicionar `robots` no metadata export |
| `public/og-home.jpg` | Criar (upload de imagem 1200x630) |
| `app/page.tsx` | Importar TrustBadgeBar |
| `components/TrustBadgeBar.tsx` | Criar (novo componente) |
| `components/LoyaltyBadge.tsx` | Mostrar badge para não-logados |
| `app/produto/[slug]/ProductDetailClient.tsx` | Adicionar stars após nome do produto |
| `components/StarRating.tsx` | Criar se não existir |

---

## ROLLBACK PLAN

Se algo quebrar:
1. Reverter arquivo específico via Vercel Dashboard → Deployments → previous deployment
2. Ou: git checkout do arquivo e novo deploy

**Sem git no diretório local?** Deploy manual via Vercel CLI:
```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs
vercel --prod  # redeploy
```

---

## COMENTÁRIOS

- **Nenhum item exige mudança de API ou lógica de backend**
- **Nenhum item muda的结构 de dados**
- **Nenhum item afeta checkout ou pagamentos**
- **Todos são acréscimos puros (additive changes)**

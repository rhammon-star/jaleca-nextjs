export const maxDuration = 300

import { NextRequest, NextResponse } from 'next/server'
import { verifyBlogToken, getUserById } from '@/lib/blog-auth'
import { generateContent, humanizeContent, analyzeSEO, generateImageQuery, improveSEOContent } from '@/lib/ai-content'
import { searchImage } from '@/lib/pexels'
import { publishPost, uploadMedia } from '@/lib/wordpress'
import { getProductImageBySlug, getProductRatingBySlug } from '@/lib/woocommerce'
import { pickAuthor, authorSchema } from '@/lib/authors'
import { cookies } from 'next/headers'

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7)
  return null
}

export async function POST(request: NextRequest) {
  // Auth check
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get('blog-token')
  const token = tokenCookie?.value || getToken(request)
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const payload = verifyBlogToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  let body: { topic?: string; keywords?: string[]; publishDirectly?: boolean; linkedProduct?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  const { topic, keywords, publishDirectly, linkedProduct } = body
  if (!topic) {
    return NextResponse.json({ error: 'Tema é obrigatório' }, { status: 400 })
  }

  // Use SSE for real-time progress
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Step 1: Generate content
        send('progress', { step: 1, message: 'Gerando conteúdo...' })
        const generated = await generateContent(topic, keywords, linkedProduct)

        // Step 2: Humanize
        send('progress', { step: 2, message: 'Humanizando texto...' })
        const humanizedContent = await humanizeContent(generated.content)

        // Step 3: SEO analysis
        send('progress', { step: 3, message: 'Analisando SEO...' })
        const seoAnalysis = await analyzeSEO({
          title: generated.title,
          content: humanizedContent,
          metaDescription: generated.metaDescription,
          slug: generated.suggestedSlug,
        })

        // Step 3.5: Auto-improve SEO based on suggestions
        send('progress', { step: 3, message: 'Otimizando SEO automaticamente...' })
        const optimizedContent = seoAnalysis.suggestions?.length
          ? await improveSEOContent(humanizedContent, seoAnalysis.suggestions, generated.suggestedKeywords)
          : humanizedContent

        // Inject recommendation block programmatically (Gemini may ignore prompt instruction)
        const hasRecommendation = optimizedContent.includes('Nossa indicação') || optimizedContent.includes('Onde comprar')
        let finalContent = optimizedContent
        if (!hasRecommendation) {
          const recommendationHtml = linkedProduct
            ? `<p><strong>Nossa indicação:</strong> <a href="https://jaleca.com.br/produto/${linkedProduct}">veja o produto na Jaleca</a> — ideal para quem busca qualidade e conforto no dia a dia clínico.</p>`
            : `<p><strong>Onde comprar:</strong> Se você está buscando onde comprar, a <a href="https://jaleca.com.br/categoria/jalecos">Jaleca tem uma seleção completa</a> com frete para todo o Brasil.</p>`
          finalContent = optimizedContent + '\n' + recommendationHtml
        } else if (linkedProduct && optimizedContent.includes('Onde comprar') && !optimizedContent.includes('Nossa indicação')) {
          // Gemini used the wrong template — replace last paragraph
          const lastOndeIdx = optimizedContent.lastIndexOf('<p><strong>Onde comprar:')
          finalContent = lastOndeIdx !== -1
            ? optimizedContent.slice(0, lastOndeIdx) + `<p><strong>Nossa indicação:</strong> <a href="https://jaleca.com.br/produto/${linkedProduct}">veja o produto na Jaleca</a> — ideal para quem busca qualidade e conforto no dia a dia clínico.</p>`
            : optimizedContent
        }

        // AggregateRating schema when product is linked (G)
        let aggregateRatingTag = ''
        if (linkedProduct) {
          const rating = await getProductRatingBySlug(linkedProduct)
          if (rating && rating.reviewCount > 0) {
            const ratingSchema = {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: generated.title,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating.ratingValue,
                reviewCount: rating.reviewCount,
              },
            }
            aggregateRatingTag = `<script type="application/ld+json">${JSON.stringify(ratingSchema)}</script>\n`
          }
        }

        // Author (B) + about/mentions + HowTo schemas (AEO)
        const author = pickAuthor(topic)
        const aboutSchema = JSON.stringify([
          { '@type': 'Thing', name: 'Jaleco', sameAs: 'https://pt.wikipedia.org/wiki/Jaleco' },
          { '@type': 'Thing', name: topic },
        ])
        const mentionsSchema = JSON.stringify([
          { '@type': 'Organization', name: 'Anvisa', sameAs: 'https://pt.wikipedia.org/wiki/Ag%C3%AAncia_Nacional_de_Vigil%C3%A2ncia_Sanit%C3%A1ria' },
          { '@type': 'Organization', name: 'CFM', sameAs: 'https://pt.wikipedia.org/wiki/Conselho_Federal_de_Medicina' },
        ])
        const dateIso = new Date().toISOString().split('T')[0]

        const articleSchemaTag = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(generated.title)},"author":${JSON.stringify(authorSchema(author))},"about":${aboutSchema},"mentions":${mentionsSchema},"dateModified":"${dateIso}","publisher":{"@type":"Organization","name":"Jaleca","url":"https://jaleca.com.br","logo":{"@type":"ImageObject","url":"https://jaleca.com.br/logo-jaleca-512.png"}}}</script>\n`

        // Author bio block injected at end of content (B)
        const authorBioBlock = `\n<div style="border-top:1px solid #e8e0d5;margin-top:2rem;padding-top:1rem;display:flex;align-items:flex-start;gap:0.75rem"><div><p style="font-size:0.82rem;font-weight:600;color:#1a1a1a;margin:0">${author.name}</p><p style="font-size:0.78rem;color:#888;margin:0">${author.jobTitle} · <a href="https://jaleca.com.br/autor/${author.slug}" style="color:#c4a97d">Ver perfil completo</a></p><p style="font-size:0.8rem;color:#555;margin-top:0.25rem">${author.bio.slice(0, 120)}...</p></div></div>`

        let howToSchemaTag = ''
        if (generated.isTutorial && generated.faqItems?.length) {
          const steps = generated.faqItems.map((f, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: f.question,
            text: f.answer,
          }))
          howToSchemaTag = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"HowTo","name":${JSON.stringify(generated.title)},"step":${JSON.stringify(steps)}}</script>\n`
        }

        // Visible dateModified block (I + F)
        const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        const dateBlock = `<p style="font-size:0.8rem;color:#888;margin-bottom:1.5rem">📅 Atualizado em ${today} · Equipe Jaleca</p>\n`

        finalContent = aggregateRatingTag + articleSchemaTag + howToSchemaTag + dateBlock + finalContent + authorBioBlock

        // Re-analyze after improvements
        const finalSEO = await analyzeSEO({
          title: generated.title,
          content: finalContent,
          metaDescription: generated.metaDescription,
          slug: generated.suggestedSlug,
        })

        // Step 4: Find image — alternates between WooCommerce product (A) and Pexels contextual (B)
        send('progress', { step: 4, message: 'Buscando imagem...' })
        const imageQuery = await generateImageQuery(topic)

        let imageResult: Awaited<ReturnType<typeof searchImage>> = null
        let imageSource: 'product' | 'pexels' = 'pexels'

        if (linkedProduct) {
          const productImageUrl = await getProductImageBySlug(linkedProduct)
          if (productImageUrl) {
            imageResult = {
              url: productImageUrl,
              authorName: 'Jaleca',
              authorLink: 'https://jaleca.com.br',
              caption: `${generated.title} — Jaleca`,
            }
            imageSource = 'product'
          }
        }

        if (!imageResult) {
          imageResult = await searchImage(imageQuery)
          imageSource = 'pexels'
        }

        void imageSource

        let wpPostId: number | undefined
        let wpPostLink: string | undefined

        // Step 5: Optionally publish
        if (publishDirectly) {
          send('progress', { step: 5, message: 'Publicando no WordPress...' })
          const user = getUserById(payload.sub)
          const wpUser = user?.wpUsername || process.env.WP_ADMIN_USER
          const wpPass = user?.wpAppPassword || process.env.WP_ADMIN_APP_PASSWORD

          if (wpUser && wpPass) {
            const credentials = { username: wpUser, appPassword: wpPass }
            let featuredMediaId: number | undefined

            if (imageResult?.url) {
              try {
                featuredMediaId = await uploadMedia(
                  imageResult.url,
                  `${generated.suggestedSlug}.jpg`,
                  credentials
                )
              } catch {
                // Continue without featured image
              }
            }

            const wpPost = await publishPost(
              {
                title: generated.title,
                content: humanizedContent,
                excerpt: generated.excerpt,
                slug: generated.suggestedSlug,
                status: 'publish',
                featured_media: featuredMediaId,
              },
              credentials
            )
            wpPostId = wpPost.id
            wpPostLink = wpPost.link
          }
        }

        send('complete', {
          title: generated.title,
          content: finalContent,
          excerpt: generated.excerpt,
          metaDescription: generated.metaDescription,
          slug: generated.suggestedSlug,
          suggestedKeywords: generated.suggestedKeywords,
          faqItems: generated.faqItems ?? [],
          isTutorial: generated.isTutorial ?? false,
          externalLinks: generated.externalLinks ?? [],
          seoScore: finalSEO.score,
          seoAnalysis: finalSEO,
          imageUrl: imageResult?.url ?? null,
          imageCaption: imageResult?.caption ?? null,
          imageAuthor: imageResult
            ? { name: imageResult.authorName, link: imageResult.authorLink }
            : null,
          wpPostId,
          wpPostLink,
        })
      } catch (error) {
        send('error', { message: error instanceof Error ? error.message : 'Erro desconhecido' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

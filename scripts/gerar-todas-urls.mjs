#!/usr/bin/env node
/**
 * GERAR TODAS AS URLs DO SITE
 *
 * Compila um arquivo completo com todas as URLs públicas:
 * - Páginas estáticas
 * - Produtos (cores individuais)
 * - Cidades
 * - Profissões (hubs)
 * - Blog
 */

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const BASE_URL = 'https://jaleca.com.br'

// ─── PÁGINAS ESTÁTICAS ────────────────────────────────────────────────────────

const PAGINAS_ESTATICAS = [
  '/',
  '/produtos',
  '/categoria/jalecos',
  '/categoria/dolmas',
  '/categoria/conjuntos',
  '/categoria/acessorios',
  '/blog',
  '/nossas-lojas',
  '/loja-matriz',
  '/loja-jaleco',
  '/sobre',
  '/contato',
  '/faq',
  '/trocas-e-devolucoes',
  '/privacidade',
  '/termos',
  '/medidas',
  '/lookbook',
  '/comparar',
  '/wishlist',
  '/minha-conta',

  // Hubs profissões
  '/jaleco-advogado',
  '/jaleco-barbeiro',
  '/jaleco-biomedico',
  '/jaleco-branco',
  '/jaleco-cabeleireiro',
  '/jaleco-churrasqueiro',
  '/jaleco-colorido',
  '/jaleco-cozinheiro',
  '/jaleco-dentista',
  '/jaleco-dentista-feminino',
  '/jaleco-dona-casa',
  '/jaleco-enfermagem',
  '/jaleco-enfermagem-feminino',
  '/jaleco-enfermeiro',
  '/jaleco-esteticista',
  '/jaleco-estiloso',
  '/jaleco-farmaceutico',
  '/jaleco-farmacia',
  '/jaleco-feminino',
  '/jaleco-fisioterapeuta',
  '/jaleco-fisioterapia',
  '/jaleco-masculino',
  '/jaleco-massagista',
  '/jaleco-medicina',
  '/jaleco-medico',
  '/jaleco-medico-feminino',
  '/jaleco-nutricao',
  '/jaleco-nutricionista',
  '/jaleco-odontologia',
  '/jaleco-pastor',
  '/jaleco-plus-size',
  '/jaleco-podologo',
  '/jaleco-premium',
  '/jaleco-preto',
  '/jaleco-preto-feminino',
  '/jaleco-professor',
  '/jaleco-psicologa',
  '/jaleco-secretaria',
  '/jaleco-sushiman',
  '/jaleco-tatuador',
  '/jaleco-universitario',
  '/jaleco-vendedor',
  '/jaleco-veterinario',
  '/jalecos-femininos',
  '/melhor-marca-jaleco',
  '/comprar-jaleco-online',

  // Dólmãs
  '/dolma-churrasqueiro',
  '/dolma-cozinheiro',
  '/dolma-sushiman',

  // Conjuntos
  '/conjunto-advogado',
  '/conjunto-farmaceutico',
  '/conjunto-pastor',
  '/conjunto-psicologa',
  '/pijama-cirurgico-feminino',
  '/scrub-enfermagem',
  '/scrub-feminino',
  '/scrub-medico',

  // Uniformes por setor
  '/uniformes-beleza',
  '/uniformes-escritorio',
  '/uniformes-gastronomia',
  '/uniformes-profissionais-saude',
  '/uniformes-servicos',
  '/uniforme-professor',

  // Dia das Mães 2026
  '/dia-das-maes/jaleco-medica',
  '/dia-das-maes/jaleco-dentista',
  '/dia-das-maes/jaleco-enfermeira',
  '/dia-das-maes/jaleco-veterinaria',
  '/dia-das-maes/jaleco-farmaceutica',
  '/dia-das-maes/jaleco-nutricionista',
  '/dia-das-maes/jaleco-fisioterapeuta',
]

// ─── CIDADES ──────────────────────────────────────────────────────────────────

const CIDADES = [
  'jaleco-belo-horizonte',
  'jaleco-campo-grande',
  'jaleco-vitoria',
  'jaleco-barra-da-tijuca',
  'jaleco-muriae',
  'jaleco-marilia',
  'jaleco-itabira',
  'jaleco-contagem',
  'jaleco-londrina',
  'jaleco-rio-de-janeiro',
  'jaleco-sao-paulo',
  'jaleco-brasilia',
  'jaleco-salvador',
  'jaleco-fortaleza',
  'jaleco-recife',
  'jaleco-manaus',
  'jaleco-curitiba',
  'jaleco-porto-alegre',
  'jaleco-goiania',
  'jaleco-belem',
  'jaleco-guarulhos',
  'jaleco-campinas',
  'jaleco-sao-luis',
  'jaleco-maceio',
  'jaleco-natal',
  'jaleco-teresina',
  'jaleco-joao-pessoa',
  'jaleco-ribeirao-preto',
  'jaleco-sao-jose-dos-campos',
  'jaleco-uberlandia',
  'jaleco-florianopolis',
  'jaleco-juiz-de-fora',
  'jaleco-betim',
  'jaleco-sete-lagoas',
  'jaleco-divinopolis',
  'jaleco-pocos-de-caldas',
  'jaleco-patos-de-minas',
  'jaleco-pouso-alegre',
  'jaleco-varginha',
  'jaleco-barbacena',
  'jaleco-cuiaba',
  'jaleco-porto-velho',
  'jaleco-aracaju',
  'jaleco-feira-de-santana',
  'jaleco-joinville',
  'jaleco-caxias-do-sul',
  'jaleco-pelotas',
  'jaleco-canoas',
  'jaleco-mogi-das-cruzes',
  'jaleco-sorocaba',
  'jaleco-santos',
  'jaleco-colatina',
]

// ─── FUNÇÃO PRINCIPAL ─────────────────────────────────────────────────────────

async function main() {
  console.log('🌐 GERANDO LISTA COMPLETA DE URLs\n')

  const allUrls = new Set()

  // 1. Páginas estáticas
  console.log('📄 Adicionando páginas estáticas...')
  PAGINAS_ESTATICAS.forEach(path => {
    allUrls.add(`${BASE_URL}${path}`)
  })
  console.log(`   ${PAGINAS_ESTATICAS.length} páginas\n`)

  // 2. URLs de cores de produtos
  console.log('🎨 Adicionando URLs de cores de produtos...')
  const seoPath = join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json')
  const seoData = JSON.parse(await readFile(seoPath, 'utf-8'))
  seoData.forEach(item => {
    allUrls.add(`${BASE_URL}${item.url}`)
  })
  console.log(`   ${seoData.length} páginas de cores\n`)

  // 3. URLs de cidades
  console.log('🏙️  Adicionando URLs de cidades...')
  CIDADES.forEach(slug => {
    allUrls.add(`${BASE_URL}/cidade/${slug}`)
  })
  console.log(`   ${CIDADES.length} cidades\n`)

  // 4. Blog posts (buscar do WordPress)
  console.log('📝 Buscando posts do blog...')
  try {
    const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
    const response = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=100&status=publish`)

    if (response.ok) {
      const posts = await response.json()
      posts.forEach(post => {
        allUrls.add(`${BASE_URL}/blog/${post.slug}`)
      })
      console.log(`   ${posts.length} posts do blog\n`)
    } else {
      console.warn(`   ⚠️  Não foi possível buscar posts (${response.status})\n`)
    }
  } catch (err) {
    console.warn(`   ⚠️  Erro ao buscar blog: ${err.message}\n`)
  }

  // Ordenar URLs
  const sortedUrls = Array.from(allUrls).sort()

  // Salvar em arquivo
  const outputPath = join(process.cwd(), 'docs', 'TODAS-AS-URLS.txt')
  const content = sortedUrls.join('\n')
  await writeFile(outputPath, content)

  // Resumo
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('## ✅ CONCLUÍDO\n')
  console.log(`Total de URLs: ${sortedUrls.length}`)
  console.log(`Arquivo salvo: docs/TODAS-AS-URLS.txt\n`)

  // Estatísticas por tipo
  const stats = {
    home: sortedUrls.filter(u => u === BASE_URL + '/').length,
    produtos: sortedUrls.filter(u => u.includes('/produto/')).length,
    categorias: sortedUrls.filter(u => u.includes('/categoria/')).length,
    cidades: sortedUrls.filter(u => u.includes('/cidade/')).length,
    blog: sortedUrls.filter(u => u.includes('/blog/')).length,
    hubs: sortedUrls.filter(u => /jaleco-|dolma-|conjunto-|scrub-|pijama-|uniformes-/.test(u) && !u.includes('/produto/') && !u.includes('/cidade/')).length,
    outros: 0,
  }
  stats.outros = sortedUrls.length - Object.values(stats).reduce((a, b) => a + b, 0)

  console.log('📊 Breakdown:')
  console.log(`   Home: ${stats.home}`)
  console.log(`   Produtos (cores): ${stats.produtos}`)
  console.log(`   Categorias: ${stats.categorias}`)
  console.log(`   Cidades: ${stats.cidades}`)
  console.log(`   Blog: ${stats.blog}`)
  console.log(`   Hubs profissões: ${stats.hubs}`)
  console.log(`   Outros: ${stats.outros}\n`)
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})

import { notifyAllForUrl, pingSitemap } from '../lib/google-indexing'

process.env.INDEXNOW_KEY = '1ca71e9dfe8bac6ba3ad7a8ed532d1a7d3105a5eafa979859975b5114fbe1e53'

async function main() {
  const key = process.env.INDEXNOW_KEY!
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'jaleca.com.br',
      key,
      keyLocation: `https://jaleca.com.br/${key}.txt`,
      urlList: ['https://jaleca.com.br/produto/jaleco-medico-azul-marinho'],
    }),
  })
  console.log('IndexNow status:', res.status, await res.text())
  await pingSitemap()
  console.log('Sitemap ping: OK')
}

main().catch(console.error)

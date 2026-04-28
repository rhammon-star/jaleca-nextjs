export async function notifyIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY
  if (!key) return false
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'jaleca.com.br',
        key,
        keyLocation: `https://jaleca.com.br/${key}.txt`,
        urlList: urls,
      }),
    })
    return res.ok
  } catch (e) {
    console.error('[notifyIndexNow]', e)
    return false
  }
}

export async function pingSitemap(): Promise<void> {
  const sitemapUrl = encodeURIComponent('https://jaleca.com.br/sitemap.xml')
  await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`).catch(() => {})
}

export async function notifyAllForUrl(url: string): Promise<void> {
  const fullUrl = url.startsWith('http') ? url : `https://jaleca.com.br${url}`
  await notifyIndexNow([fullUrl])
}

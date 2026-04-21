const INDEXNOW_KEY = '96f4dccdc25fd5e8303a0563fbef9c2a'
const HOST = 'jaleca.com.br'

export async function notifyIndexNow(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : [urls]
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: INDEXNOW_KEY, urlList }),
    })
  } catch {
    // Non-critical — indexing notification failure should not break the app
  }
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const KEY = '96f4dccdc25fd5e8303a0563fbef9c2a'
const HOST = 'jaleca.com.br'
const BASE = 'https://jaleca.com.br'

const data = JSON.parse(readFileSync(join(process.cwd(), 'docs', 'SEO-PRODUTOS-CORES.json'), 'utf8'))
const urlList = [...new Set(data.map(p => `${BASE}${p.url}`))]

console.log(`Submetendo ${urlList.length} URLs de cores ao IndexNow...`)

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, urlList }),
})

console.log(`IndexNow response: ${res.status} ${res.statusText}`)
if (res.status === 200 || res.status === 202) console.log('✅ URLs submetidas')
else console.log(await res.text())

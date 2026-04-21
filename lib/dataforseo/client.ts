const BASE_URL = 'https://api.dataforseo.com/v3'

export async function dataForSeoRequest<T = unknown>(
  endpoint: string,
  payload: object[]
): Promise<T> {
  const login = process.env.DATAFORSEO_LOGIN
  const password = process.env.DATAFORSEO_PASSWORD

  if (!login || !password) {
    throw new Error('DATAFORSEO_LOGIN e DATAFORSEO_PASSWORD não configurados')
  }

  const credentials = Buffer.from(`${login}:${password}`).toString('base64')

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    throw new Error(`DataForSEO ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()

  if (data.status_code !== 20000) {
    throw new Error(`DataForSEO API error: ${data.status_message}`)
  }

  return data
}

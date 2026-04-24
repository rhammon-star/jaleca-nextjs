import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// URLs prioritárias para submeter
const PRIORITY_URLS = [
  // 10 cidades top
  'https://jaleca.com.br/cidade/sao-paulo',
  'https://jaleca.com.br/cidade/rio-de-janeiro',
  'https://jaleca.com.br/cidade/belo-horizonte',
  'https://jaleca.com.br/cidade/brasilia',
  'https://jaleca.com.br/cidade/salvador',
  'https://jaleca.com.br/cidade/fortaleza',
  'https://jaleca.com.br/cidade/curitiba',
  'https://jaleca.com.br/cidade/recife',
  'https://jaleca.com.br/cidade/porto-alegre',
  'https://jaleca.com.br/cidade/goiania',

  // 10 cidades MG
  'https://jaleca.com.br/cidade/juiz-de-fora',
  'https://jaleca.com.br/cidade/uberlandia',
  'https://jaleca.com.br/cidade/betim',
  'https://jaleca.com.br/cidade/montes-claros',
  'https://jaleca.com.br/cidade/ribeirao-das-neves',
  'https://jaleca.com.br/cidade/uberaba',
  'https://jaleca.com.br/cidade/governador-valadares',
  'https://jaleca.com.br/cidade/sete-lagoas',
  'https://jaleca.com.br/cidade/divinopolis',
  'https://jaleca.com.br/cidade/ipatinga',

  // 10 hubs profissão
  'https://jaleca.com.br/jaleco-para-dentista',
  'https://jaleca.com.br/jaleco-para-medico',
  'https://jaleca.com.br/jaleco-para-enfermeiro',
  'https://jaleca.com.br/jaleco-para-veterinario',
  'https://jaleca.com.br/jaleco-para-nutricionista',
  'https://jaleca.com.br/jaleco-para-fisioterapeuta',
  'https://jaleca.com.br/jaleco-para-biomedico',
  'https://jaleca.com.br/jaleco-para-podologo',
  'https://jaleca.com.br/jaleco-para-farmaceutico',
  'https://jaleca.com.br/jaleco-para-esteticista',
]

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()

    // Proteção básica - apenas para uso interno
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const CLIENT_ID = process.env.GSC_CLIENT_ID
    const CLIENT_SECRET = process.env.GSC_CLIENT_SECRET
    const REFRESH_TOKEN = process.env.GSC_REFRESH_TOKEN

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json(
        { error: 'GSC credentials not configured' },
        { status: 500 }
      )
    }

    // Configurar OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    )

    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    })

    const indexing = google.indexing({
      version: 'v3',
      auth: oauth2Client,
    })

    const results = {
      success: [] as string[],
      failed: [] as string[],
      alreadyIndexed: [] as string[],
    }

    for (const url of PRIORITY_URLS) {
      try {
        const response = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        })

        if (response.status === 200) {
          results.success.push(url)
        } else {
          results.alreadyIndexed.push(url)
        }

        // Rate limiting - Google permite ~200/min
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error: any) {
        if (error.code === 429) {
          // Rate limit - aguardar 60s
          await new Promise((resolve) => setTimeout(resolve, 60000))
          // Retry
          try {
            await indexing.urlNotifications.publish({
              requestBody: { url: url, type: 'URL_UPDATED' },
            })
            results.success.push(url)
          } catch (retryError) {
            results.failed.push(url)
          }
        } else {
          results.failed.push(url)
        }
      }
    }

    return NextResponse.json({
      total: PRIORITY_URLS.length,
      success: results.success.length,
      failed: results.failed.length,
      alreadyIndexed: results.alreadyIndexed.length,
      details: results,
    })
  } catch (error: any) {
    console.error('GSC Submit Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

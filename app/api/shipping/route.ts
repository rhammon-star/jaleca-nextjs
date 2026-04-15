import { NextRequest, NextResponse } from 'next/server'
import { calculateShipping, type ShippingOption } from '@/lib/melhor-envio'

export type { ShippingOption }

type ViaCEPResponse = {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      cep?: string
      weight?: number
      items?: number
      subtotal?: number
    }

    const { cep, weight = 0.5, items = 1, subtotal = 0 } = body

    if (!cep) {
      return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 })
    }

    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
    }

    // Consulta ViaCEP para obter endereço — falha graciosamente se indisponível
    let cepData: ViaCEPResponse | null = null
    try {
      const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, { signal: AbortSignal.timeout(5000) })
      if (viaCepRes.ok) {
        const data = (await viaCepRes.json()) as ViaCEPResponse
        if (!data.erro) cepData = data
      }
    } catch {
      // ViaCEP indisponível — continua sem dados de endereço
    }

    const rawOptions = await calculateShipping(cleanCep, weight, items, subtotal)
    const options = rawOptions.map(opt => ({
      ...opt,
      cost: parseFloat((parseFloat(String(opt.cost)) + 0).toFixed(2)),
    }))

    return NextResponse.json({
      options,
      address: cepData ? {
        city:         cepData.localidade,
        state:        cepData.uf,
        neighborhood: cepData.bairro,
        street:       cepData.logradouro,
      } : null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao calcular frete'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

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
    }

    const { cep, weight = 0.5, items = 1 } = body

    if (!cep) {
      return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 })
    }

    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
    }

    // Validate CEP via ViaCEP to get address info
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    if (!viaCepRes.ok) {
      return NextResponse.json({ error: 'Erro ao consultar CEP' }, { status: 400 })
    }

    const cepData = (await viaCepRes.json()) as ViaCEPResponse
    if (cepData.erro) {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 400 })
    }

    const rawOptions = await calculateShipping(cleanCep, weight, items)
    const options = rawOptions.map(opt => ({
      ...opt,
      cost: (parseFloat(String(opt.cost)) + 5).toFixed(2),
    }))

    return NextResponse.json({
      options,
      address: {
        city:         cepData.localidade,
        state:        cepData.uf,
        neighborhood: cepData.bairro,
        street:       cepData.logradouro,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao calcular frete'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

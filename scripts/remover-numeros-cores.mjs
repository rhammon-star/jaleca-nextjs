#!/usr/bin/env node
/**
 * REMOVER NÚMEROS DAS CORES
 *
 * Remove números do final dos nomes de cores (Branco 3 → Branco)
 * via WooCommerce REST API
 */

import { readFile, writeFile } from 'fs/promises'

const WC_URL = 'https://wp.jaleca.com.br/wp-json/wc/v3'
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET

if (!WC_KEY || !WC_SECRET) {
  console.error('❌ Credenciais WooCommerce não configuradas')
  process.exit(1)
}

async function buscarAtributos() {
  const url = `${WC_URL}/products/attributes?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Erro ao buscar atributos: ${res.status}`)
  return await res.json()
}

async function buscarTermosAtributo(attributeId) {
  const url = `${WC_URL}/products/attributes/${attributeId}/terms?per_page=100&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Erro ao buscar termos: ${res.status}`)
  return await res.json()
}

async function atualizarTermo(attributeId, termId, novoNome) {
  const url = `${WC_URL}/products/attributes/${attributeId}/terms/${termId}?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`

  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: novoNome })
  })

  if (!res.ok) {
    const erro = await res.text()
    throw new Error(`Erro ao atualizar: ${res.status} - ${erro}`)
  }

  return await res.json()
}

function removerNumeros(nome) {
  // Remove números no final: " 2", " 3", etc
  return nome.replace(/\s+\d+$/, '').trim()
}

async function main() {
  console.log('🎨 REMOVENDO NÚMEROS DAS CORES\n')

  // 1. Buscar atributos
  console.log('📋 Buscando atributos...')
  const atributos = await buscarAtributos()

  // 2. Encontrar atributo de cor
  const attrCor = atributos.find(a =>
    a.name.toLowerCase() === 'cor' ||
    a.name.toLowerCase() === 'color' ||
    a.slug === 'pa_cor' ||
    a.slug === 'pa_color'
  )

  if (!attrCor) {
    console.error('❌ Atributo de cor não encontrado!')
    process.exit(1)
  }

  console.log(`✅ Atributo encontrado: ${attrCor.name} (ID: ${attrCor.id})\n`)

  // 3. Buscar termos do atributo
  console.log('🔍 Buscando termos de cor...')
  const termos = await buscarTermosAtributo(attrCor.id)
  console.log(`✅ ${termos.length} cores encontradas\n`)

  // 4. Filtrar cores com números
  const coresComNumero = termos.filter(t => /\s+\d+$/.test(t.name))

  if (coresComNumero.length === 0) {
    console.log('✅ Nenhuma cor com número encontrada!')
    return
  }

  console.log(`📊 ${coresComNumero.length} cores com números:\n`)

  // Mostrar preview das mudanças
  const mudancas = []
  for (const termo of coresComNumero) {
    const nomeNovo = removerNumeros(termo.name)
    mudancas.push({
      id: termo.id,
      nomeAntigo: termo.name,
      nomeNovo
    })
    console.log(`   ${termo.name} → ${nomeNovo}`)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('⚠️  ATENÇÃO: Isso vai alterar os nomes das cores no WooCommerce!')
  console.log('⚠️  Todas as variações de produtos serão afetadas.\n')
  console.log('Salvando backup em /tmp/backup-cores.json...\n')

  // Salvar backup
  await writeFile('/tmp/backup-cores.json', JSON.stringify(termos, null, 2))
  console.log('✅ Backup salvo!\n')

  // 5. Aplicar mudanças
  console.log('🔄 Aplicando mudanças...\n')

  let sucessos = 0
  let erros = 0

  for (const mudanca of mudancas) {
    try {
      console.log(`   Atualizando: ${mudanca.nomeAntigo} → ${mudanca.nomeNovo}`)
      await atualizarTermo(attrCor.id, mudanca.id, mudanca.nomeNovo)
      console.log('   ✅ Atualizado')
      sucessos++

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`)
      erros++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('## 📊 RESUMO\n')
  console.log(`✅ Sucessos: ${sucessos}/${mudancas.length}`)
  console.log(`❌ Erros: ${erros}/${mudancas.length}\n`)

  if (sucessos > 0) {
    console.log('## ✅ PRÓXIMOS PASSOS\n')
    console.log('1. Verificar alguns produtos no WooCommerce')
    console.log('2. Verificar se as cores aparecem corretamente no site')
    console.log('3. Se algo der errado, restaurar do backup:\n')
    console.log('   cat /tmp/backup-cores.json\n')
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  console.error(err.stack)
  process.exit(1)
})

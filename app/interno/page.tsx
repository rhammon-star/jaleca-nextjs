'use client'
import { useEffect, useState } from 'react'

export default function InternoPage() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(localStorage.getItem('jaleca_internal_traffic') === '1')
  }, [])

  function toggle() {
    if (active) {
      localStorage.removeItem('jaleca_internal_traffic')
      setActive(false)
    } else {
      localStorage.setItem('jaleca_internal_traffic', '1')
      setActive(true)
    }
  }

  return (
    <main style={{ padding: '4rem 2rem', fontFamily: 'monospace', maxWidth: 500 }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Modo tráfego interno</h1>
      <p style={{ marginBottom: '2rem', color: '#666', fontSize: '0.9rem' }}>
        Quando ativo, todos os eventos GA4/Google Ads/Meta Pixel são bloqueados neste dispositivo.
        Use em Ipatinga para que testes não contaminem os dados de conversão.
      </p>
      <button
        onClick={toggle}
        style={{
          padding: '0.75rem 2rem',
          background: active ? '#dc2626' : '#16a34a',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          borderRadius: 4,
        }}
      >
        {active ? '🔴 Desativar filtro' : '🟢 Ativar filtro (modo teste)'}
      </button>
      <p style={{ marginTop: '1.5rem', color: active ? '#dc2626' : '#16a34a', fontWeight: 'bold' }}>
        Status atual: {active ? 'ATIVO — eventos bloqueados' : 'INATIVO — rastreamento normal'}
      </p>
      <p style={{ marginTop: '3rem', color: '#999', fontSize: '0.75rem' }}>
        jaleca.com.br/interno — acesso restrito
      </p>
    </main>
  )
}

'use client'
import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import type { SeoEntry } from '@/lib/kv'
import { regenerateGemini, forceRevalidate, submitToGoogle } from './actions'

const QUALITY_BADGE: Record<string, string> = {
  template: 'bg-yellow-100 text-yellow-800',
  gemini: 'bg-blue-100 text-blue-800',
  premium: 'bg-green-100 text-green-800',
}

export default function VariacoesTable({ entries }: { entries: SeoEntry[] }) {
  const [filterQuality, setFilterQuality] = useState<string>('all')
  const [filterStock, setFilterStock] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterQuality !== 'all' && e.seoQuality !== filterQuality) return false
      if (filterStock !== 'all' && e.stockStatus !== filterStock) return false
      if (search && !`${e.productName} ${e.colorName}`.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [entries, filterQuality, filterStock, search])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          placeholder="Buscar produto ou cor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 min-w-64"
        />
        <select
          value={filterQuality}
          onChange={(e) => setFilterQuality(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todas qualidades</option>
          <option value="template">Template</option>
          <option value="gemini">Gemini</option>
          <option value="premium">Premium</option>
        </select>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Todos estoques</option>
          <option value="instock">Em estoque</option>
          <option value="outofstock">Sem estoque</option>
        </select>
      </div>

      <p className="text-sm text-stone-600 mb-2">
        {filtered.length} de {entries.length}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-stone-50">
            <tr>
              <th className="text-left p-2">Produto / Cor</th>
              <th className="text-left p-2">SEO</th>
              <th className="text-left p-2">Estoque</th>
              <th className="text-left p-2">Indexada</th>
              <th className="text-left p-2">Última sync</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.url} className="border-t hover:bg-stone-50">
                <td className="p-2">
                  <Link
                    href={`/admin/variacoes/${e.url.replace(/^\/produto\//, '')}`}
                    className="font-semibold hover:underline"
                  >
                    {e.productName} — {e.colorName}
                  </Link>
                  <div className="text-xs text-stone-500">{e.url}</div>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${QUALITY_BADGE[e.seoQuality]}`}>
                    {e.seoQuality}
                  </span>
                </td>
                <td className="p-2">{e.stockStatus === 'instock' ? '✅' : '❌'}</td>
                <td className="p-2">{e.noindex ? '❌' : '✅'}</td>
                <td className="p-2 text-xs">
                  {new Date(e.lastSyncedAt).toLocaleString('pt-BR')}
                </td>
                <td className="p-2">
                  <div className="flex gap-1 flex-wrap">
                    <button
                      disabled={pending || e.seoQuality === 'premium'}
                      onClick={() => startTransition(() => regenerateGemini(e.variationId))}
                      className="text-xs bg-blue-100 px-2 py-1 rounded disabled:opacity-50"
                      title={e.seoQuality === 'premium' ? 'Premium não é sobrescrito' : 'Rodar Gemini'}
                    >
                      Regerar
                    </button>
                    <button
                      disabled={pending}
                      onClick={() =>
                        startTransition(() =>
                          forceRevalidate(e.url.replace(/^\/produto\//, 'produto/')),
                        )
                      }
                      className="text-xs bg-stone-100 px-2 py-1 rounded disabled:opacity-50"
                    >
                      Revalidar
                    </button>
                    <button
                      disabled={pending}
                      onClick={() =>
                        startTransition(() =>
                          submitToGoogle(e.url.replace(/^\/produto\//, 'produto/')),
                        )
                      }
                      className="text-xs bg-stone-100 px-2 py-1 rounded disabled:opacity-50"
                    >
                      IndexNow
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

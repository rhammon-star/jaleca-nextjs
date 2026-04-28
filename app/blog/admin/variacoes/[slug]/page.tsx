import { kv, seoKey, type SeoEntry } from '@/lib/kv'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SeoEditor from '../SeoEditor'
import { setNoindex, regenerateGemini } from '../actions'

export const dynamic = 'force-dynamic'

export default async function VariacaoDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = await kv.get<SeoEntry>(seoKey(`produto/${slug}`))
  if (!entry) notFound()

  return (
    <div>
      <Link href="/blog/admin/variacoes" className="text-sm text-blue-700 hover:underline">
        ← Voltar à listagem
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-1">
        {entry.productName} — {entry.colorName}
      </h1>
      <p className="text-stone-500 text-sm mb-6">
        URL: <code>{entry.url}</code> · Estoque:{' '}
        <strong>{entry.stockStatus}</strong> · SEO:{' '}
        <strong>{entry.seoQuality}</strong> · Tentativas Gemini:{' '}
        {entry.geminiAttempts ?? 0}
      </p>

      <div className="flex gap-3 mb-8">
        <form action={setNoindex.bind(null, `produto/${slug}`, !entry.noindex)}>
          <button className="text-sm bg-stone-100 border px-3 py-2 rounded hover:bg-stone-200">
            {entry.noindex ? 'Tirar noindex' : 'Marcar como noindex'}
          </button>
        </form>
        {entry.seoQuality !== 'premium' && (
          <form action={regenerateGemini.bind(null, entry.variationId)}>
            <button className="text-sm bg-blue-100 border px-3 py-2 rounded hover:bg-blue-200">
              Regerar com Gemini
            </button>
          </form>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-4">Editar SEO</h2>
      <SeoEditor entry={entry} />
    </div>
  )
}

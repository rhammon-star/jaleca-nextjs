import Link from 'next/link'
import AviseMeForm from './AviseMeForm'
import type { SeoEntry } from '@/lib/kv'

type Props = {
  seo: SeoEntry
  otherColors: Array<{ url: string; colorName: string; image?: string }>
}

export default function OutOfStockPage({ seo, otherColors }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{seo.h1 ?? `${seo.productName} ${seo.colorName}`}</h1>

      <div className="bg-yellow-50 border border-yellow-300 rounded p-4 my-6">
        <p className="font-semibold">Esta cor está temporariamente sem estoque.</p>
        <p className="text-sm text-stone-700 mt-1">
          Cadastre seu email e te avisamos assim que voltar.
        </p>
        <div className="mt-3">
          <AviseMeForm variationId={seo.variationId} />
        </div>
      </div>

      {otherColors.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">Veja em outras cores disponíveis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherColors.map((c) => (
              <Link key={c.url} href={c.url} className="block border rounded p-3 hover:shadow">
                {c.image && (
                  <img src={c.image} alt={c.colorName} className="w-full h-32 object-cover rounded" />
                )}
                <p className="mt-2 text-sm">{c.colorName}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: `${seo.productName} ${seo.colorName}`,
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/OutOfStock',
              url: `https://jaleca.com.br${seo.url}`,
            },
          }),
        }}
      />
    </div>
  )
}

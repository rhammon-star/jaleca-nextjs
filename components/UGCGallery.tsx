import Image from 'next/image'
import { ugcEntries, type UGCEntry } from '@/data/ugc'

interface UGCGalleryProps {
  profession?: UGCEntry['profession']
  maxItems?: number
  title?: string
}

export function UGCGallery({
  profession,
  maxItems = 6,
  title = 'Quem usa Jaleca',
}: UGCGalleryProps) {
  const entries = ugcEntries
    .filter((e) => !profession || e.profession === profession)
    .slice(0, maxItems)

  if (entries.length === 0) return null

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: entries
      .filter((e) => e.rating)
      .map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Review',
          author: { '@type': 'Person', name: e.authorName },
          reviewRating: { '@type': 'Rating', ratingValue: e.rating, bestRating: 5 },
          reviewBody: e.caption,
          datePublished: e.date,
          ...(e.productName && { itemReviewed: { '@type': 'Product', name: e.productName } }),
        },
      })),
  }

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="relative rounded-lg overflow-hidden group">
            <div className="relative aspect-square">
              <Image
                src={entry.imageUrl}
                alt={`${entry.authorName} usando ${entry.productName || 'jaleco Jaleca'}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
              <p className="text-white text-sm font-semibold">{entry.authorName}</p>
              {entry.authorHandle && (
                <p className="text-white/70 text-xs">{entry.authorHandle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

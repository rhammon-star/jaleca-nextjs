import howtoData from './profession-howto-data.json'

type HowToEntry = {
  occupationName: string
  isMedical: boolean
  howToName: string
  steps: { name: string; text: string }[]
}

const DATA = howtoData as Record<string, HowToEntry>

export function getProfessionData(slug: string): HowToEntry | null {
  return DATA[slug] ?? null
}

export function buildHowToSchema(slug: string, pageUrl: string) {
  const d = DATA[slug]
  if (!d) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: d.howToName,
    inLanguage: 'pt-BR',
    totalTime: 'PT5M',
    mainEntityOfPage: pageUrl,
    step: d.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${pageUrl}#step-${i + 1}`,
    })),
  }
}

export function buildOccupationSchema(slug: string, pageUrl: string) {
  const d = DATA[slug]
  if (!d) return null
  const type = d.isMedical ? 'MedicalBusiness' : 'Occupation'
  if (d.isMedical) {
    return {
      '@context': 'https://schema.org',
      '@type': 'MedicalAudience',
      audienceType: d.occupationName,
      healthCondition: { '@type': 'MedicalCondition', name: 'Saúde ocupacional' },
      url: pageUrl,
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    name: d.occupationName,
    occupationalCategory: d.occupationName,
    url: pageUrl,
  }
}

export const AI_CONTENT_DECLARATION = 'human-authored-with-ai-assistance' as const

type ItemListProduct = {
  name?: string
  slug?: string
  image?: { sourceUrl?: string | null } | string | null
}

export function buildItemListSchema(produtos: ItemListProduct[], pageUrl: string, listName: string) {
  if (!produtos || produtos.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: produtos.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: produtos.map((p, i) => {
      const img = typeof p.image === 'string' ? p.image : p.image?.sourceUrl ?? undefined
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: p.slug ? `https://jaleca.com.br/produto/${p.slug}` : pageUrl,
        name: p.name,
        ...(img ? { image: img } : {}),
      }
    }),
  }
}

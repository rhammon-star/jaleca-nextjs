export interface GoogleReview {
  authorName: string
  rating: number
  relativeTime: string
  text: string
  photoUri?: string
}

export interface PlaceData {
  rating: number
  reviewCount: number
  reviews: GoogleReview[]
  mapsUrl: string
}

const API_KEY  = process.env.GOOGLE_PLACES_API_KEY
const PLACE_ID = process.env.GOOGLE_PLACE_ID

export async function getGooglePlaceData(): Promise<PlaceData | null> {
  if (!API_KEY || !PLACE_ID) {
    console.error('[GooglePlaces] Missing API_KEY or PLACE_ID env vars')
    return null
  }

  try {
    const fields = 'rating,userRatingCount,reviews,googleMapsUri'
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=${fields}&languageCode=pt-BR&key=${API_KEY}`

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // cache 24h
    })

    if (!res.ok) {
      console.error(`[GooglePlaces] API returned ${res.status} for place ${PLACE_ID}`)
      return null
    }

    const data = await res.json()

    if (!data.rating || !data.userRatingCount) {
      console.error('[GooglePlaces] API response missing rating or userRatingCount:', JSON.stringify(data).slice(0, 200))
      return null
    }

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .filter((r: { rating?: number; text?: { text?: string } }) => (r.rating ?? 0) >= 4 && r.text?.text)
      .slice(0, 3)
      .map((r: {
        authorAttribution?: { displayName?: string; photoUri?: string }
        rating: number
        relativePublishTimeDescription?: string
        text?: { text?: string }
      }) => ({
        authorName: r.authorAttribution?.displayName ?? 'Cliente',
        rating: r.rating,
        relativeTime: r.relativePublishTimeDescription ?? '',
        text: r.text?.text ?? '',
        photoUri: r.authorAttribution?.photoUri?.replace('=s128', '=s72'),
      }))

    console.log(`[GooglePlaces] Success: rating=${data.rating}, count=${data.userRatingCount}, reviews=${reviews.length}`)

    return {
      rating: data.rating ?? 0,
      reviewCount: data.userRatingCount ?? 0,
      reviews,
      mapsUrl: data.googleMapsUri ?? `https://www.google.com/maps/search/Jaleca+Ipatinga+MG`,
    }
  } catch (err) {
    console.error('[GooglePlaces] Unexpected error:', err)
    return null
  }
}

import { getGooglePlaceData } from '@/lib/google-places'
import GoogleReviewsSection from './GoogleReviewsSection'

// Componente servidor assíncrono — os dados das reviews são carregados separadamente
// via React Suspense streaming, reduzindo o payload HTML inicial da homepage
export default async function GoogleReviewsServer() {
  const place = await getGooglePlaceData()
  if (!place) return null
  return <GoogleReviewsSection place={place} />
}

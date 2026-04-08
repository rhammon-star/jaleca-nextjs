export type Franqueado = {
  id: string
  cidade: string
  estado: string
  nome_loja: string
  endereco: string
  instagram: string
  whatsapp: string
  lat: number
  lng: number
}

export const franqueados: Franqueado[] = [
  {
    id: '1',
    cidade: 'Caratinga',
    estado: 'MG',
    nome_loja: 'Jaleca Caratinga',
    endereco: 'Av. Olegário Maciel, nº 416A, Centro, Caratinga - MG',
    instagram: '@jaleca.caratinga',
    whatsapp: '+5533999281815',
    lat: -19.7897,
    lng: -42.1378,
  },
  {
    id: '2',
    cidade: 'Colatina',
    estado: 'ES',
    nome_loja: 'Jaleca Colatina',
    endereco: 'Rua Moacyr Ávidos, nº 380, Vila Nova, Colatina - ES',
    instagram: '@jaleca.colatina',
    whatsapp: '+5527999814612',
    lat: -19.5408,
    lng: -40.6301,
  },
  {
    id: '3',
    cidade: 'Contagem',
    estado: 'MG',
    nome_loja: 'Jaleca Contagem',
    endereco: 'Av. Dr. João Augusto Fonseca e Silva, nº 1053, Novo Eldorado, Contagem - MG',
    instagram: '@jaleca.contagem',
    whatsapp: '+5531994538370',
    lat: -19.9317,
    lng: -44.0533,
  },
  {
    id: '4',
    cidade: 'Guarapuava',
    estado: 'PR',
    nome_loja: 'Jaleca Guarapuava',
    endereco: 'Rua Guaíra, nº 3621, Sala 02, Centro, Guarapuava - PR',
    instagram: '@jaleca.guarapuava',
    whatsapp: '+5542998698724',
    lat: -25.3937,
    lng: -51.4564,
  },
  {
    id: '5',
    cidade: 'Ipatinga',
    estado: 'MG',
    nome_loja: 'Jaleca Ipatinga',
    endereco: 'Av. Castelo Branco, nº 391-B, Horto, Ipatinga - MG',
    instagram: '@jaleca.horto',
    whatsapp: '+553133672467',
    lat: -19.4692,
    lng: -42.5277,
  },
  {
    id: '6',
    cidade: 'Teófilo Otoni',
    estado: 'MG',
    nome_loja: 'Jaleca Teófilo Otoni',
    endereco: 'Rua Antônio Benjanmin, nº 85, Centro, Teófilo Otoni - MG',
    instagram: '@jaleca.to',
    whatsapp: '+5533998138787',
    lat: -17.8597,
    lng: -41.5053,
  },
]

// Haversine — distância em km entre dois pontos
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Busca por raio — retorna o franqueado mais próximo dentro do raio (padrão 100km)
export function findFranqueadoByRadius(
  userLat: number,
  userLng: number,
  radiusKm = 100
): (Franqueado & { distanciaKm: number }) | null {
  let closest: (Franqueado & { distanciaKm: number }) | null = null

  for (const f of franqueados) {
    const dist = haversineKm(userLat, userLng, f.lat, f.lng)
    if (dist <= radiusKm && (!closest || dist < closest.distanciaKm)) {
      closest = { ...f, distanciaKm: Math.round(dist) }
    }
  }

  return closest
}

// Mantém compatibilidade com código existente
export function findFranqueado(cidade: string, estado: string): Franqueado | null {
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  return (
    franqueados.find(
      f =>
        normalize(f.cidade) === normalize(cidade) &&
        f.estado.toUpperCase() === estado.toUpperCase()
    ) ?? null
  )
}

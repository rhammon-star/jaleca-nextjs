export interface UGCEntry {
  id: string
  profession: 'medico' | 'dentista' | 'enfermeiro' | 'professor' | 'estetica' | 'veterinario'
  authorName: string
  authorHandle?: string
  imageUrl: string
  caption: string
  productName?: string
  rating?: number
  date: string
}

// Preencher com fotos reais após coleta de permissões via DM do Instagram
export const ugcEntries: UGCEntry[] = []

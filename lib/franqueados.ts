export type Franqueado = {
  id: string
  cidade: string
  estado: string
  nome_loja: string
  endereco: string
  instagram: string
  whatsapp: string
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
  },
  {
    id: '2',
    cidade: 'Colatina',
    estado: 'ES',
    nome_loja: 'Jaleca Colatina',
    endereco: 'Rua Moacyr Ávidos, nº 380, Vila Nova, Colatina - ES',
    instagram: '@jaleca.colatina',
    whatsapp: '+5527999814612',
  },
  {
    id: '3',
    cidade: 'Contagem',
    estado: 'MG',
    nome_loja: 'Jaleca Contagem',
    endereco: 'Av. Dr. João Augusto Fonseca e Silva, nº 1053, Novo Eldorado, Contagem - MG',
    instagram: '@jaleca.contagem',
    whatsapp: '+5531994538370',
  },
  {
    id: '4',
    cidade: 'Guarapuava',
    estado: 'PR',
    nome_loja: 'Jaleca Guarapuava',
    endereco: 'Rua Guaíra, nº 3621, Sala 02, Centro, Guarapuava - PR',
    instagram: '@jaleca.guarapuava',
    whatsapp: '+5542998698724',
  },
  {
    id: '5',
    cidade: 'Ipatinga',
    estado: 'MG',
    nome_loja: 'Jaleca Ipatinga',
    endereco: 'Av. Castelo Branco, nº 391-B, Horto, Ipatinga - MG',
    instagram: '@jaleca.horto',
    whatsapp: '+553133672467',
  },
  {
    id: '6',
    cidade: 'Teófilo Otoni',
    estado: 'MG',
    nome_loja: 'Jaleca Teófilo Otoni',
    endereco: 'Rua Antônio Benjanmin, nº 85, Centro, Teófilo Otoni - MG',
    instagram: '@jaleca.to',
    whatsapp: '+5533998138787',
  },
]

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

// Mapeamento central: produto ↔ profissões
// Atualizado em 26/04/2026 — com todas as revisões do cliente

export type ProfessionInfo = {
  label: string   // Nome exibido
  hub: string     // URL do hub (vazio se não tiver hub ainda)
}

/** Todas as profissões reconhecidas pelo sistema */
export const PROFESSION_MAP: Record<string, ProfessionInfo> = {
  medica:              { label: 'Médica',              hub: '/jaleco-medica' },
  medico:              { label: 'Médico',              hub: '/jaleco-medico' },
  dentista:            { label: 'Dentista',            hub: '/jaleco-dentista' },
  enfermeira:          { label: 'Enfermeira',          hub: '/jaleco-enfermeira' },
  enfermeiro:          { label: 'Enfermeiro',          hub: '/jaleco-enfermeiro' },
  farmaceutica:        { label: 'Farmacêutica',        hub: '/jaleco-farmaceutica' },
  farmaceutico:        { label: 'Farmacêutico',        hub: '/jaleco-farmaceutico' },
  nutricionista:       { label: 'Nutricionista',       hub: '/jaleco-nutricionista' },
  veterinaria:         { label: 'Veterinária',         hub: '/jaleco-veterinaria' },
  veterinario:         { label: 'Veterinário',         hub: '/jaleco-veterinario' },
  psicologa:           { label: 'Psicóloga',           hub: '/jaleco-psicologa' },
  biomedica:           { label: 'Biomédica',           hub: '/jaleco-biomedica' },
  biomedico:           { label: 'Biomédico',           hub: '/jaleco-biomedico' },
  pastor:              { label: 'Pastor',              hub: '/jaleco-pastor' },
  'nail design':       { label: 'Nail Design',         hub: '/jaleco-esteticista' },
  micropigmentadora:   { label: 'Micropigmentadora',   hub: '/jaleco-esteticista' },
  massagista:          { label: 'Massagista',          hub: '/jaleco-massagista' },
  fisioterapeuta:      { label: 'Fisioterapeuta',      hub: '/jaleco-fisioterapeuta' },
  podologo:            { label: 'Podólogo',            hub: '/jaleco-podologo' },
  podologa:            { label: 'Podóloga',            hub: '/jaleco-podologa' },
  tatuador:            { label: 'Tatuador',            hub: '/jaleco-tatuador' },
  cabeleireira:        { label: 'Cabeleireira',        hub: '/jaleco-cabeleireira' },
  cabeleireiro:        { label: 'Cabeleireiro',        hub: '/jaleco-cabeleireiro' },
  barbeiro:            { label: 'Barbeiro',            hub: '/jaleco-barbeiro' },
  professor:           { label: 'Professor',           hub: '/jaleco-professor' },
  professora:          { label: 'Professora',          hub: '/jaleco-professor' },
  esteticista:         { label: 'Esteticista',         hub: '/jaleco-esteticista' },
  churrasqueiro:       { label: 'Churrasqueiro',       hub: '/jaleco-churrasqueiro' },
  churrasqueira:       { label: 'Churrasqueira',       hub: '/jaleco-churrasqueiro' },
  cozinheiro:          { label: 'Cozinheiro',          hub: '/dolma-cozinheiro' },
  cozinheira:          { label: 'Cozinheira',          hub: '/dolma-cozinheiro' },
  sushiman:            { label: 'Sushiman',            hub: '/jaleco-sushiman' },
  advogada:            { label: 'Advogada',            hub: '/jaleco-advogado' },
  advogado:            { label: 'Advogado',            hub: '/jaleco-advogado' },
  secretaria:          { label: 'Secretária',          hub: '/jaleco-secretaria' },
  aluno:               { label: 'Aluno',               hub: '/jaleco-universitario' },
  universitario:       { label: 'Universitário',       hub: '/jaleco-universitario' },
  estudante:           { label: 'Estudante',           hub: '/jaleco-universitario' },
  buffet:              { label: 'Buffet',              hub: '/dolma-cozinheiro' },
  confeiteira:         { label: 'Confeiteira',         hub: '/dolma-cozinheiro' },
  confeiteiro:         { label: 'Confeiteiro',         hub: '/dolma-cozinheiro' },
  'secretaria do lar': { label: 'Secretária do Lar',  hub: '/jaleco-dona-casa' },
  'dona-de-casa':      { label: 'Dona de Casa',        hub: '/jaleco-dona-casa' },

  // Hubs genéricos de profissões (aliases para áreas)
  enfermagem:          { label: 'Enfermagem',          hub: '/jaleco-enfermagem' },
  medicina:            { label: 'Medicina',            hub: '/jaleco-medicina' },
  odontologia:         { label: 'Odontologia',         hub: '/jaleco-odontologia' },
  farmacia:            { label: 'Farmácia',            hub: '/jaleco-farmacia' },
  fisioterapia:        { label: 'Fisioterapia',        hub: '/jaleco-fisioterapia' },
  nutricao:            { label: 'Nutrição',            hub: '/jaleco-nutricao' },

  // Variações de conjunto/dólma específicas
  'conjunto-advogado':     { label: 'Conjunto Advogado',     hub: '/conjunto-advogado' },
  'conjunto-psicologa':    { label: 'Conjunto Psicóloga',    hub: '/conjunto-psicologa' },
  'dolma-churrasqueiro':   { label: 'Dólmã Churrasqueiro',   hub: '/dolma-churrasqueiro' },
  'dolma-sushiman':        { label: 'Dólmã Sushiman',        hub: '/dolma-sushiman' },

  // Variações de gênero específicas
  'dentista-feminino':     { label: 'Dentista Feminino',     hub: '/jaleco-dentista-feminino' },
  'medico-feminino':       { label: 'Médica (Slim)',         hub: '/jaleco-medico-feminino' },
  'enfermagem-feminino':   { label: 'Enfermagem Feminino',   hub: '/jaleco-enfermagem-feminino' },
  'uniforme-professor':    { label: 'Uniforme Professor',    hub: '/uniforme-professor' },
  'scrub-enfermagem':      { label: 'Scrub Enfermagem',      hub: '/scrub-enfermagem' },

  // Scrubs/cirúrgico
  'cirurgico-feminino': { label: 'Scrub Feminino',     hub: '/scrub-feminino' },
  'cirurgico-masculino': { label: 'Scrub Masculino',   hub: '/scrub-medico' },
  'cirurgico':         { label: 'Scrub Médico',        hub: '/scrub-medico' },
  'estiloso':          { label: 'Estiloso',            hub: '/jaleco-estiloso' },
  'preto':             { label: 'Preto',               hub: '/jaleco-preto' },
}

export type ProductProfessions = {
  /** Slug real do WooCommerce */
  slug: string
  /** Nome de exibição do produto */
  name: string
  /** Chaves das profissões (de PROFESSION_MAP) */
  professions: string[]
}

/** Lista completa de produtos com suas profissões indicadas */
export const PRODUCT_PROFESSIONS: ProductProfessions[] = [
  // ── JALECOS FEMININOS ──────────────────────────────────────────────────────
  {
    slug: 'jaleco-slim-tradicional-feminino-jaleca',
    name: 'Jaleco Slim Tradicional Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-pala-feminino-jaleca',
    name: 'Jaleco Slim Pala Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-gold-feminino-jaleca',
    name: 'Jaleco Slim Gold Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','podologo','tatuador','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-gold-pala-feminino-jaleca',
    name: 'Jaleco Slim Gold Pala Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','podologo','tatuador','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-duquesa-feminino-jaleca',
    name: 'Jaleco Slim Duquesa Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-elastex-feminino-jaleca',
    name: 'Jaleco Slim Elastex Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','tatuador','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-feminino-lateral-jaleca',
    name: 'Jaleco Slim Feminino Lateral',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','estiloso','podologo','tatuador','cozinheira','confeiteira','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-princesa-feminino-jaleca',
    name: 'Jaleco Slim Princesa Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','nail design','micropigmentadora','estiloso','podologo','tatuador','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-princesa-manga-curta-feminino-jaleca',
    name: 'Jaleco Slim Princesa Manga Curta Feminino',
    professions: ['massagista','cabeleireira','nutricionista','nutricao','fisioterapeuta','fisioterapia','podologa','psicologa','esteticista','professora','tatuador','nail design','micropigmentadora','estiloso','farmacia','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-princesa-laise-feminino-jaleca',
    name: 'Jaleco Slim Princesa Laise Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','nail design','micropigmentadora','estiloso','podologo','tatuador','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-moratty-feminino-jaleca',
    name: 'Jaleco Slim Moratty Feminino',
    professions: ['medica','medico-feminino','medicina','dentista','dentista-feminino','odontologia','farmaceutica','farmacia','nutricionista','nutricao','veterinaria','veterinario','psicologa','biomedica','nail design','micropigmentadora','estiloso','podologo','tatuador','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-slim-tradicional-manga-curta-feminino-jaleca',
    name: 'Jaleco Slim Tradicional Manga Curta Feminino',
    professions: ['massagista','cabeleireira','nutricionista','nutricao','fisioterapeuta','fisioterapia','podologa','psicologa','esteticista','professora','tatuador','nail design','micropigmentadora','estiloso','farmacia','enfermeira','enfermagem','enfermagem-feminino','preto'],
  },
  {
    slug: 'jaleco-padrao-aluno-feminino-jaleca',
    name: 'Jaleco Padrão Aluno Feminino',
    professions: ['aluno','universitario','professor','estudante','uniforme-professor','enfermagem-feminino'],
  },

  // ── JALECOS MASCULINOS ─────────────────────────────────────────────────────
  {
    slug: 'jaleco-slim-tradicional-masculino-jaleca',
    name: 'Jaleco Slim Tradicional Masculino',
    professions: ['medico','medicina','dentista','odontologia','farmaceutico','farmacia','veterinario','nutricionista','nutricao','biomedico','barbeiro','cabeleireiro','tatuador','pastor','churrasqueiro','cozinheiro','enfermeiro','preto'],
  },
  {
    slug: 'jaleco-slim-recortes-masculino-jaleca',
    name: 'Jaleco Slim Recortes Masculino',
    professions: ['medico','medicina','dentista','odontologia','farmaceutico','farmacia','veterinario','nutricionista','nutricao','biomedico','barbeiro','cabeleireiro','tatuador','pastor','enfermeiro','preto'],
  },
  {
    slug: 'jaleco-slim-moratty-masculino-jaleca',
    name: 'Jaleco Slim Moratty Masculino',
    professions: ['medico','medicina','dentista','odontologia','farmaceutico','farmacia','veterinario','nutricionista','nutricao','biomedico','barbeiro','cabeleireiro','tatuador','pastor','enfermeiro','preto'],
  },
  {
    slug: 'jaleco-padrao-aluno-masculino-jaleca',
    name: 'Jaleco Padrão Aluno Masculino',
    professions: ['aluno','universitario','estudante','professor','uniforme-professor'],
  },

  // ── UNISSEX ────────────────────────────────────────────────────────────────
  {
    slug: 'jaleco-universitario-unissex-jaleca',
    name: 'Jaleco Universitário Unissex',
    professions: ['aluno','universitario','estudante','professor','uniforme-professor'],
  },

  // ── CONJUNTOS / SCRUB ──────────────────────────────────────────────────────
  {
    slug: 'conjunto-scrub-feminino-jaleca',
    name: 'Conjunto Scrub Feminino',
    professions: ['dentista','dentista-feminino','odontologia','enfermeira','enfermagem','enfermagem-feminino','biomedica','veterinaria','veterinario','podologa','psicologa','conjunto-psicologa','esteticista','cabeleireira','professor','tatuador','massagista','cirurgico-feminino','cirurgico','medicina','fisioterapeuta','fisioterapia','scrub-enfermagem','preto'],
  },
  {
    slug: 'conjunto-scrub-masculino-jaleca',
    name: 'Conjunto Scrub Masculino',
    professions: ['dentista','odontologia','enfermeiro','enfermagem','veterinario','biomedico','barbeiro','cabeleireiro','professor','massagista','tatuador','cirurgico-masculino','cirurgico','advogado','medico','medicina','uniforme-professor','scrub-enfermagem','preto'],
  },
  {
    slug: 'conjunto-puff-ziper-feminino-jaleca',
    name: 'Conjunto Puff Zíper Feminino',
    professions: ['secretaria','dentista','dentista-feminino','biomedica','veterinaria','veterinario','podologa','psicologa','conjunto-psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista','buffet','confeiteira','enfermagem-feminino','preto'],
  },
  {
    slug: 'conjunto-laco-feminino-jaleca',
    name: 'Conjunto Laço Feminino',
    professions: ['secretaria','dentista','dentista-feminino','biomedica','veterinaria','veterinario','podologa','psicologa','conjunto-psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista','buffet','confeiteira','enfermagem-feminino','preto'],
  },
  {
    slug: 'conjunto-princesa-nobre-feminino-jaleca',
    name: 'Conjunto Princesa Nobre Feminino',
    professions: ['secretaria','dentista','dentista-feminino','biomedica','veterinaria','veterinario','podologa','psicologa','conjunto-psicologa','esteticista','cabeleireira','professor','tatuador','advogada','cirurgico-feminino','cirurgico','buffet','confeiteira','enfermagem-feminino','scrub-enfermagem','preto'],
  },
  {
    slug: 'conjunto-executiva-feminino-jaleca',
    name: 'Conjunto Executiva Feminino',
    professions: ['secretaria','dentista','dentista-feminino','biomedica','veterinaria','veterinario','podologa','psicologa','conjunto-psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista','conjunto-advogado','buffet','confeiteira','enfermagem-feminino','preto'],
  },
  {
    slug: 'macacao-paris-feminino-jaleca',
    name: 'Macacão Paris Feminino',
    professions: ['secretaria','dentista','dentista-feminino','biomedica','veterinaria','veterinario','podologa','psicologa','conjunto-psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista','buffet','confeiteira','enfermagem-feminino','preto'],
  },

  // ── DÓLMÃS ────────────────────────────────────────────────────────────────
  {
    slug: 'conjunto-dolma-cozinheiro-feminino-jaleca',
    name: 'Conjunto Dólmã Cozinheiro Feminino',
    professions: ['churrasqueira','cozinheira','buffet','confeiteira','secretaria do lar','sushiman','dolma-sushiman'],
  },
  {
    slug: 'conjunto-dolma-cozinheiro-masculino-jaleca',
    name: 'Conjunto Dólmã Cozinheiro Masculino',
    professions: ['churrasqueiro','cozinheiro','buffet','confeiteiro','sushiman','dolma-churrasqueiro','dolma-sushiman'],
  },

  // ── ACESSÓRIOS ────────────────────────────────────────────────────────────
  {
    slug: 'colete-multiuso-jaleca',
    name: 'Colete Multiuso',
    professions: ['farmaceutica','podologa','esteticista','cabeleireira','professor','professora','nail design','tatuador','secretaria do lar','micropigmentadora','enfermagem-feminino'],
  },
  {
    slug: 'max-colete-jaleca',
    name: 'Max Colete',
    professions: ['medica','dentista','dentista-feminino','enfermeira','enfermagem','enfermagem-feminino','farmaceutica','nutricionista','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'faixa-de-cabelo-jaleca',
    name: 'Faixa de Cabelo',
    professions: ['medica','dentista','dentista-feminino','enfermeira','enfermagem','enfermagem-feminino','farmaceutica','nutricionista','veterinaria','veterinario','psicologa','biomedica','pastor','nail design','micropigmentadora','dona-de-casa'],
  },
  {
    slug: 'touca-de-elastico-jaleca',
    name: 'Touca de Elástico',
    professions: ['biomedica','nutricionista','nutricao','enfermeira','enfermagem','enfermagem-feminino','dona-de-casa'],
  },
  {
    slug: 'touca-de-amarrar-jaleca',
    name: 'Touca de Amarrar',
    professions: ['biomedica','nutricionista','nutricao','medico','enfermeiro','enfermagem','dona-de-casa'],
  },
]

// ── ÍNDICE REVERSO: profissão → slugs de produtos ─────────────────────────

/** Dado uma chave de profissão, retorna os slugs dos produtos indicados */
export const PROFESSION_PRODUCT_SLUGS: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {}
  for (const p of PRODUCT_PROFESSIONS) {
    for (const prof of p.professions) {
      if (!map[prof]) map[prof] = []
      map[prof].push(p.slug)
    }
  }
  return map
})()

/** Dado um slug de produto, retorna as profissões indicadas (com info de hub) */
export function getProfessionsForProduct(productSlug: string): ProfessionInfo[] {
  const entry = PRODUCT_PROFESSIONS.find(p => p.slug === productSlug)
  if (!entry) return []
  // deduplicar por hub (ex: medica + medico → mesmo hub)
  const seen = new Set<string>()
  const result: ProfessionInfo[] = []
  for (const key of entry.professions) {
    const info = PROFESSION_MAP[key]
    if (!info) continue
    const dedupeKey = info.hub || info.label
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    result.push(info)
  }
  return result
}

// ── PRODUTOS POR COR ───────────────────────────────────────────────────────

/** Slugs de produtos disponíveis em preto */
export const PRETO_PRODUCT_SLUGS = [
  'jaleco-slim-tradicional-feminino-jaleca',
  'jaleco-slim-pala-feminino-jaleca',
  'jaleco-slim-gold-feminino-jaleca',
  'jaleco-slim-gold-pala-feminino-jaleca',
  'jaleco-slim-duquesa-feminino-jaleca',
  'jaleco-slim-elastex-feminino-jaleca',
  'jaleco-slim-feminino-lateral-jaleca',
  'jaleco-slim-princesa-feminino-jaleca',
  'jaleco-slim-princesa-manga-curta-feminino-jaleca',
  'jaleco-slim-princesa-laise-feminino-jaleca',
  'jaleco-slim-moratty-feminino-jaleca',
  'jaleco-slim-tradicional-manga-curta-feminino-jaleca',
  'jaleco-slim-tradicional-masculino-jaleca',
  'jaleco-slim-recortes-masculino-jaleca',
  'jaleco-slim-moratty-masculino-jaleca',
]

/** Dado uma chave de profissão, retorna os slugs dos produtos */
export function getProductSlugsForProfession(professionKey: string): string[] {
  return PROFESSION_PRODUCT_SLUGS[professionKey] ?? []
}

/** Retorna slugs dos produtos em preto */
export function getPretoProductSlugs(): string[] {
  return PRETO_PRODUCT_SLUGS
}

/** Mapeamento profissão → filtro de gênero preferido */
const PROFESSION_GENDER_FILTER: Record<string, 'feminino' | 'masculino' | null> = {
  // Feminino
  'medica': 'feminino',
  'enfermeira': 'feminino',
  'dentista': 'feminino',  // Por padrão feminino (mais comum)
  'nutricionista': 'feminino',
  'veterinaria': 'feminino',
  'psicologa': 'feminino',
  'farmaceutica': 'feminino',
  'biomedica': 'feminino',
  'podologa': 'feminino',
  'advogada': 'feminino',
  'secretaria': 'feminino',
  'professora': 'feminino',
  'cabeleireira': 'feminino',
  'esteticista': 'feminino',
  'massagista': 'feminino',
  'fisioterapeuta': 'feminino',  // Profissão unissex, mas tendência feminina
  'micropigmentadora': 'feminino',
  'nail design': 'feminino',
  'confeiteira': 'feminino',
  'cozinheira': 'feminino',
  'churrasqueira': 'feminino',
  'dona-de-casa': 'feminino',
  'secretaria do lar': 'feminino',

  // Masculino
  'medico': 'masculino',
  'enfermeiro': 'masculino',
  'veterinario': 'masculino',
  'farmaceutico': 'masculino',
  'biomedico': 'masculino',
  'podologo': 'masculino',
  'advogado': 'masculino',
  'professor': 'masculino',
  'cabeleireiro': 'masculino',
  'barbeiro': 'masculino',
  'tatuador': 'masculino',
  'pastor': 'masculino',
  'confeiteiro': 'masculino',
  'cozinheiro': 'masculino',
  'churrasqueiro': 'masculino',
  'sushiman': 'masculino',

  // Sem filtro de gênero (unissex ou genérico)
  'enfermagem': null,
  'medicina': null,
  'odontologia': null,
  'farmacia': null,
  'fisioterapia': null,
  'nutricao': null,
  'aluno': null,
  'universitario': null,
  'estudante': null,
  'buffet': null,
  'cirurgico': null,
  'cirurgico-feminino': 'feminino',
  'cirurgico-masculino': 'masculino',
  'estiloso': null,
  'preto': null,
  'conjunto-advogado': 'masculino',
  'conjunto-psicologa': 'feminino',
  'dolma-churrasqueiro': 'masculino',
  'dolma-sushiman': 'masculino',
  'dentista-feminino': 'feminino',
  'medico-feminino': 'feminino',
  'enfermagem-feminino': 'feminino',
  'uniforme-professor': 'masculino',
  'scrub-enfermagem': null,
}

/**
 * Retorna URL do filtro "Ver mais" para uma profissão
 *
 * @example
 * getVerMaisUrl('medica') // '/produtos?categoria=jalecos-femininos'
 * getVerMaisUrl('medico') // '/produtos?categoria=jalecos-masculinos'
 * getVerMaisUrl('enfermagem') // '/produtos?categoria=jalecos'
 */
export function getVerMaisUrl(professionKey: string): string {
  const gender = PROFESSION_GENDER_FILTER[professionKey]

  if (gender === 'feminino') {
    return '/produtos?categoria=jalecos-femininos'
  } else if (gender === 'masculino') {
    return '/produtos?categoria=jalecos-masculinos'
  } else {
    return '/produtos?categoria=jalecos'
  }
}

/**
 * Prioriza produtos por cor: branco e preto primeiro (mais vendidos)
 *
 * @param products - Lista de produtos WooCommerce
 * @returns Lista ordenada com branco/preto primeiro
 */
export function prioritizeByColor<T extends { slug: string; name: string }>(products: T[]): T[] {
  const priority: T[] = []
  const others: T[] = []

  products.forEach(product => {
    const slug = product.slug.toLowerCase()
    const name = product.name.toLowerCase()

    // Branco ou preto no slug ou nome
    if (slug.includes('branco') || name.includes('branco')) {
      priority.unshift(product) // Branco no início
    } else if (slug.includes('preto') || name.includes('preto')) {
      priority.push(product) // Preto depois do branco
    } else {
      others.push(product)
    }
  })

  return [...priority, ...others]
}

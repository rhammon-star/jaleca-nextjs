// Mapeamento central: produto ↔ profissões
// Atualizado em 19/04/2026 — lista oficial do dono

export type ProfessionInfo = {
  label: string   // Nome exibido
  hub: string     // URL do hub (vazio se não tiver hub ainda)
}

/** Todas as profissões reconhecidas pelo sistema */
export const PROFESSION_MAP: Record<string, ProfessionInfo> = {
  medica:              { label: 'Médica',              hub: '/jaleco-para-medico' },
  medico:              { label: 'Médico',              hub: '/jaleco-para-medico' },
  dentista:            { label: 'Dentista',            hub: '/jaleco-para-dentista' },
  enfermeira:          { label: 'Enfermeira',          hub: '/jaleco-para-enfermeiro' },
  enfermeiro:          { label: 'Enfermeiro',          hub: '/jaleco-para-enfermeiro' },
  farmaceutica:        { label: 'Farmacêutica',        hub: '/jaleco-para-farmaceutico' },
  farmaceutico:        { label: 'Farmacêutico',        hub: '/jaleco-para-farmaceutico' },
  nutricionista:       { label: 'Nutricionista',       hub: '/jaleco-para-nutricionista' },
  veterinaria:         { label: 'Veterinária',         hub: '/jaleco-para-veterinario' },
  veterinario:         { label: 'Veterinário',         hub: '/jaleco-para-veterinario' },
  psicologa:           { label: 'Psicóloga',           hub: '/jaleco-para-psicologa' },
  biomedica:           { label: 'Biomédica',           hub: '/jaleco-para-biomedico' },
  biomedico:           { label: 'Biomédico',           hub: '/jaleco-para-biomedico' },
  pastor:              { label: 'Pastor',              hub: '/jaleco-para-pastor' },
  'nail design':       { label: 'Nail Design',         hub: '/jaleco-para-esteticista' },
  micropigmentadora:   { label: 'Micropigmentadora',   hub: '/jaleco-para-esteticista' },
  massagista:          { label: 'Massagista',          hub: '/jaleco-para-massagista' },
  fisioterapeuta:      { label: 'Fisioterapeuta',      hub: '/jaleco-para-fisioterapeuta' },
  podologo:            { label: 'Podólogo',            hub: '/jaleco-para-podologo' },
  podologa:            { label: 'Podóloga',            hub: '/jaleco-para-podologo' },
  tatuador:            { label: 'Tatuador',            hub: '/jaleco-para-tatuador' },
  cabeleireira:        { label: 'Cabeleireira',        hub: '/jaleco-para-cabeleireiro' },
  cabeleireiro:        { label: 'Cabeleireiro',        hub: '/jaleco-para-cabeleireiro' },
  barbeiro:            { label: 'Barbeiro',            hub: '/jaleco-para-barbeiro' },
  professor:           { label: 'Professor',           hub: '/jaleco-para-professor' },
  professora:          { label: 'Professora',          hub: '/jaleco-para-professor' },
  esteticista:         { label: 'Esteticista',         hub: '/jaleco-para-esteticista' },
  churrasqueiro:       { label: 'Churrasqueiro',       hub: '/jaleco-para-churrasqueiro' },
  churrasqueira:       { label: 'Churrasqueira',       hub: '/jaleco-para-churrasqueiro' },
  cozinheiro:          { label: 'Cozinheiro',          hub: '/jaleco-para-cozinheiro' },
  cozinheira:          { label: 'Cozinheira',          hub: '/jaleco-para-cozinheiro' },
  sushiman:            { label: 'Sushiman',            hub: '/jaleco-para-sushiman' },
  advogada:            { label: 'Advogada',            hub: '/jaleco-para-advogado' },
  advogado:            { label: 'Advogado',            hub: '/jaleco-para-advogado' },
  secretaria:          { label: 'Secretária',          hub: '/jaleco-para-secretaria' },
  aluno:               { label: 'Aluno',               hub: '/jaleco-universitario' },
  universitario:       { label: 'Universitário',       hub: '/jaleco-universitario' },
  estudante:           { label: 'Estudante',           hub: '/jaleco-universitario' },
  buffet:              { label: 'Buffet',              hub: '/jaleco-para-cozinheiro' },
  confeiteira:         { label: 'Confeiteira',         hub: '/jaleco-para-cozinheiro' },
  confeiteiro:         { label: 'Confeiteiro',         hub: '/jaleco-para-cozinheiro' },
  'secretaria do lar': { label: 'Secretária do Lar',  hub: '/jaleco-para-dona-de-casa' },
  'dona-de-casa':      { label: 'Dona de Casa',        hub: '/jaleco-para-dona-de-casa' },
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
    slug: 'jaleco-slim-feminino-de-ziper-central-varias-cores-jaleca',
    name: 'Jaleco Slim Tradicional Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-pala-feminino-jaleca',
    name: 'Jaleco Slim Pala Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-gold-feminino-jaleca',
    name: 'Jaleco Slim Gold Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-gold-pala-feminino-jaleca',
    name: 'Jaleco Slim Gold Pala Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-dama-feminino-jaleca',
    name: 'Jaleco Slim Dama Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-duquesa-feminino-varias-cores-jaleca',
    name: 'Jaleco Slim Duquesa Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-elastex-feminino-varias-cores-jaleca',
    name: 'Jaleco Slim Elastex Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','tatuador','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-feminino-de-ziper-lateral-varias-cores-jaleca',
    name: 'Jaleco Slim Feminino Lateral',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-princesa-feminino-varias-cores-jaleca',
    name: 'Jaleco Slim Princesa Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-princesa-manga-curta-feminino-jaleca',
    name: 'Jaleco Slim Princesa Manga Curta Feminino',
    professions: ['massagista','enfermeira','cabeleireira','nutricionista','fisioterapeuta','podologa','psicologa','esteticista','professora','tatuador','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-princesa-laise-feminino-jaleca',
    name: 'Jaleco Slim Princesa Laise Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-moratty-feminino-ziper-central-jaleca',
    name: 'Jaleco Slim Moratty Feminino',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','massagista','fisioterapeuta','podologo','tatuador','biomedica','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-slim-tradicional-manga-curta-feminino-jaleca',
    name: 'Jaleco Slim Tradicional Manga Curta Feminino',
    professions: ['massagista','enfermeira','cabeleireira','nutricionista','fisioterapeuta','podologa','psicologa','esteticista','professora','tatuador','nail design','micropigmentadora'],
  },
  {
    slug: 'jaleco-padrao-aluno-feminino-de-botao-varias-cores-jaleca',
    name: 'Jaleco Padrão Aluno Feminino',
    professions: ['aluno','universitario','professor','estudante'],
  },

  // ── JALECOS MASCULINOS ─────────────────────────────────────────────────────
  {
    slug: 'jaleco-slim-masculino-de-ziper-central-varias-cores-jaleca',
    name: 'Jaleco Slim Tradicional Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
  },
  {
    slug: 'jaleco-slim-recortes-masculino-varias-cores-jaleca',
    name: 'Jaleco Slim Recortes Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
  },
  {
    slug: 'jaleco-slim-moratty-masculino-ziper-central-jaleca',
    name: 'Jaleco Slim Moratty Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','fisioterapeuta','nutricionista','biomedico','barbeiro','cabeleireiro','tatuador','pastor'],
  },
  {
    slug: 'jaleco-padrao-aluno-masculino-de-botao-varias-cores-jaleca',
    name: 'Jaleco Padrão Aluno Masculino',
    professions: ['aluno','universitario','estudante','professor'],
  },

  // ── UNISSEX ────────────────────────────────────────────────────────────────
  {
    slug: 'jaleco-universitario-unissex-jaleca',
    name: 'Jaleco Universitário Unissex',
    professions: ['aluno','universitario','estudante','professor'],
  },

  // ── CONJUNTOS / SCRUB ──────────────────────────────────────────────────────
  {
    slug: 'conjunto-pijama-cirurgico-scrub-feminino-varias-cores-jaleca',
    name: 'Conjunto Scrub Feminino',
    professions: ['dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','massagista'],
  },
  {
    slug: 'conjunto-pijama-cirurgico-scrub-masculino-varias-cores-jaleca',
    name: 'Conjunto Scrub Masculino',
    professions: ['medico','dentista','enfermeiro','farmaceutico','fisioterapeuta','nutricionista','biomedico','veterinario','barbeiro','cabeleireiro','professor','massagista','tatuador'],
  },
  {
    slug: 'conjunto-puff-ziper-feminino-jaleca',
    name: 'Conjunto Puff Zíper Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },
  {
    slug: 'conjunto-laco-feminino-jaleca',
    name: 'Conjunto Laço Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },
  {
    slug: 'conjunto-pijama-cirurgico-princesa-scrub-feminino-varias-cores-jaleca',
    name: 'Conjunto Princesa Nobre Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada'],
  },
  {
    slug: 'conjunto-executiva-feminino-jaleca',
    name: 'Conjunto Executiva Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },
  {
    slug: 'macacao-paris-feminino-jaleca',
    name: 'Macacão Paris Feminino',
    professions: ['secretaria','dentista','medica','enfermeira','farmaceutica','fisioterapeuta','nutricionista','biomedica','veterinaria','podologa','psicologa','esteticista','cabeleireira','professor','tatuador','advogada','massagista'],
  },

  // ── DÓLMÃS ────────────────────────────────────────────────────────────────
  {
    slug: 'conjunto-dolma-cozinheiro-de-ziper-e-avental-saia-slim-jaleca',
    name: 'Conjunto Dólmã Cozinheiro Feminino',
    professions: ['churrasqueira','cozinheira','buffet','confeiteira','secretaria do lar','dona-de-casa','sushiman'],
  },
  {
    slug: 'conjunto-dolma-cozinheiro-masculino-de-ziper-e-avental-saia-slim-jaleca',
    name: 'Conjunto Dólmã Cozinheiro Masculino',
    professions: ['churrasqueiro','cozinheiro','buffet','confeiteiro','sushiman'],
  },

  // ── ACESSÓRIOS ────────────────────────────────────────────────────────────
  {
    slug: 'colete-multiuso-jaleca',
    name: 'Colete Multiuso',
    professions: ['farmaceutica','podologa','esteticista','cabeleireira','professor','nail design','tatuador','secretaria do lar','dona-de-casa','micropigmentadora'],
  },
  {
    slug: 'max-colete-jaleca',
    name: 'Max Colete',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'faixa-de-cabelo-jaleca',
    name: 'Faixa de Cabelo',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora'],
  },
  {
    slug: 'touca-de-elastico-jaleca',
    name: 'Touca de Elástico',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora','cozinheira','churrasqueira','confeiteira'],
  },
  {
    slug: 'touca-de-amarrar-jaleca',
    name: 'Touca de Amarrar',
    professions: ['medica','dentista','enfermeira','farmaceutica','nutricionista','veterinaria','psicologa','biomedica','pastor','nail design','micropigmentadora','cabeleireira','barbeiro','churrasqueiro','podologa','esteticista','sushiman'],
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

/** Dado uma chave de profissão, retorna os slugs dos produtos */
export function getProductSlugsForProfession(professionKey: string): string[] {
  return PROFESSION_PRODUCT_SLUGS[professionKey] ?? []
}

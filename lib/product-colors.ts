/**
 * PROJETO JALECA CORES — Utilitários para URLs de produtos por cor
 *
 * Sistema de mapeamento de URLs individuais por cor:
 * - Produto mãe: /produto/jaleco-slim-tradicional
 * - Produto filha: /produto/jaleco-slim-tradicional-branco
 *
 * 140 variações de cor → 140 URLs únicas
 */

/**
 * Lista de todas as cores possíveis nos produtos Jaleca
 * Formato slug → nome display
 */
export const COLOR_SLUG_MAP: Record<string, string> = {
  // Cores básicas
  'branco': 'Branco',
  'branco-1': 'Branco 1',
  'branco-2': 'Branco 2',
  'branco-3': 'Branco 3',
  'preto': 'Preto',
  'preto-1': 'Preto 1',
  'preto-2': 'Preto 2',
  'preto-3': 'Preto 3',
  'preto-giz': 'Preto Giz',
  'azul': 'Azul',
  'azul-marinho': 'Azul Marinho',
  'azul-petroleo': 'Azul Petróleo',
  'azul-turquesa': 'Azul Turquesa',
  'azul-bebe': 'Azul Bebe',
  'azul-royal': 'Azul Royal',
  'azul-ceu': 'Azul Ceu',
  'azul-claro': 'Azul Claro',
  'azul-pastel': 'Azul Pastel',
  'rosa': 'Rosa',
  'rosa-bebe': 'Rosa Bebe',
  'rosa-antigo': 'Rosa Antigo',
  'rosa-cha': 'Rosa Chá',
  'rosa-pink': 'Rosa Pink',
  'rose-2': 'Rose 2',
  'rose-escuro': 'Rose Escuro',
  'pink': 'Pink',
  'pink-2': 'Pink 2',
  'rose': 'Rose',
  'cereja': 'Cereja',
  'verde': 'Verde',
  'verde-1': 'Verde 1',
  'verde-hospitalar': 'Verde Hospitalar',
  'verde-cirurgico': 'Verde Cirúrgico',
  'verde-escuro': 'Verde Escuro',
  'verde-agua': 'Verde Agua',
  'verde-bb': 'Verde Bb',
  'verde-claro': 'Verde Claro',
  'verde-folha': 'Verde Folha',
  'verde-garrafa': 'Verde Garrafa',
  'verde-militar': 'Verde Militar',
  'verde-musgo': 'Verde Musgo',
  'vinho': 'Vinho',
  'vinho-2': 'Vinho 2',
  'vinho-giz': 'Vinho Giz',
  'bordo': 'Bordô',
  'marsala': 'Marsala',
  'cinza': 'Cinza',
  'cinza-1': 'Cinza 1',
  'cinza-escuro': 'Cinza Escuro',
  'cinza-claro': 'Cinza Claro',
  'areia': 'Areia',
  'areia-2': 'Areia 2',
  'areia-claro': 'Areia Claro',
  'bege': 'Bege',
  'nude': 'Nude',
  'caramelo': 'Caramelo',
  'mostarda': 'Mostarda',
  'terracota': 'Terracota',
  'laranja': 'Laranja',
  'coral': 'Coral',
  'pessego': 'Pêssego',
  'lilas': 'Lilás',
  'roxo': 'Roxo',
  'uva': 'Uva',
  'lavanda': 'Lavanda',
  'amarelo': 'Amarelo',
  'amarelo-ouro': 'Amarelo Ouro',
  'tiffany': 'Tiffany',
  'menta': 'Menta',
  'jade': 'Jade',
  'esmeralda': 'Esmeralda',
  'acqua': 'Acqua',
  'navy': 'Navy',
  'marinho': 'Marinho',
  'marinho-giz': 'Marinho Giz',
  'chumbo': 'Chumbo',
  'chumbo-giz': 'Chumbo Giz',
  'grafite': 'Grafite',
  'champagne': 'Champagne',
  'dourado': 'Dourado',
  'prata': 'Prata',
  'off-white': 'Off White',
  'cru': 'Cru',
  'natural': 'Natural',
  'canela': 'Canela',
  'flamboya': 'Flamboya',
  'gelo': 'Gelo',
  'marrom': 'Marrom',
  'palha': 'Palha',
}

/**
 * Cores prioritárias por categoria de produto
 * (do Ponto 5 do PROJETO-JALECA-CORES.md)
 */
export const PRIORITY_COLORS = {
  JALECOS: [
    'branco-3', 'azul-marinho', 'preto-3', 'rosa', 'verde-1', 'areia',
    'vinho', 'cinza-1', 'rosa-bebe', 'branco-2', 'azul', 'verde-hospitalar',
    'preto-2', 'rosa-antigo', 'azul-petroleo', 'lilas'
  ],
  CONJUNTOS: [
    'branco-3', 'azul-marinho', 'preto-3', 'rosa', 'verde-1', 'areia',
    'cinza-1', 'rosa-bebe', 'azul', 'verde-hospitalar', 'preto-2',
    'rosa-antigo', 'lilas'
  ],
  DOLMAS: ['branco-3', 'preto-3', 'areia'],
  ACESSORIOS: [
    'branco-3', 'azul-marinho', 'preto-3', 'rosa', 'verde-1', 'areia',
    'vinho', 'cinza-1', 'rosa-bebe', 'branco-2', 'azul', 'preto-2'
  ],
}

/**
 * Detecta se um slug contém cor e extrai o slug base + cor
 *
 * @example
 * parseColorSlug('jaleco-slim-tradicional-branco')
 * // { baseSlug: 'jaleco-slim-tradicional', colorSlug: 'branco', hasColor: true }
 *
 * parseColorSlug('jaleco-slim-tradicional')
 * // { baseSlug: 'jaleco-slim-tradicional', colorSlug: null, hasColor: false }
 */
export function parseColorSlug(slug: string): {
  baseSlug: string
  colorSlug: string | null
  colorName: string | null
  hasColor: boolean
} {
  // Tenta encontrar cores de 2 palavras primeiro (ex: azul-marinho, rosa-bebe)
  const twoWordColors = Object.keys(COLOR_SLUG_MAP).filter(c => c.includes('-'))
  for (const colorSlug of twoWordColors) {
    if (slug.endsWith(`-${colorSlug}`)) {
      const baseSlug = slug.replace(`-${colorSlug}`, '')
      return {
        baseSlug,
        colorSlug,
        colorName: COLOR_SLUG_MAP[colorSlug],
        hasColor: true,
      }
    }
  }

  // Depois tenta cores de 1 palavra
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]

  if (COLOR_SLUG_MAP[lastPart]) {
    const baseSlug = parts.slice(0, -1).join('-')
    return {
      baseSlug,
      colorSlug: lastPart,
      colorName: COLOR_SLUG_MAP[lastPart],
      hasColor: true,
    }
  }

  // Sem cor detectada
  return {
    baseSlug: slug,
    colorSlug: null,
    colorName: null,
    hasColor: false,
  }
}

/**
 * Gera slug de produto com cor
 *
 * @example
 * buildColorSlug('jaleco-slim-tradicional', 'Azul Marinho')
 * // 'jaleco-slim-tradicional-azul-marinho'
 */
export function buildColorSlug(baseSlug: string, colorName: string): string {
  // Encontra o slug da cor baseado no nome
  const colorSlug = Object.entries(COLOR_SLUG_MAP).find(
    ([_, name]) => name.toLowerCase() === colorName.toLowerCase()
  )?.[0]

  if (!colorSlug) {
    // Fallback: normaliza o nome manualmente
    return `${baseSlug}-${colorName.toLowerCase().replace(/\s+/g, '-')}`
  }

  return `${baseSlug}-${colorSlug}`
}

/**
 * Normaliza valor de atributo cor do WooCommerce
 * Remove números, hifens extras, capitaliza
 *
 * @example
 * normalizeColorAttribute('azul-marinho-1') // 'Azul Marinho'
 * normalizeColorAttribute('BRANCO 3') // 'Branco 3'
 */
export function normalizeColorAttribute(color: string): string {
  return color
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Remove acentos de uma string
 */
function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Encontra variação específica por cor nos dados do produto WooCommerce
 */
export function findVariationByColor(
  variations: any[],
  targetColor: string
): any | null {
  const normalizedTarget = removeAccents(targetColor.toLowerCase().trim())

  return variations.find(variation => {
    const colorAttr = variation.attributes?.nodes?.find(
      (attr: any) => /cor|color/i.test(attr.name)
    )

    if (!colorAttr?.value) return false

    const variationColor = removeAccents(normalizeColorAttribute(colorAttr.value).toLowerCase())
    return variationColor === normalizedTarget ||
           variationColor.includes(normalizedTarget) ||
           normalizedTarget.includes(variationColor)
  }) || null
}

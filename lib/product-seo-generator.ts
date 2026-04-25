/**
 * PROJETO JALECA CORES — Ponto 2: Gerador de SEO Personalizado
 *
 * Gera H1, H2, meta descriptions únicos para cada produto × cor
 * Evita thin content e penalização Google
 */

/**
 * Templates de descrição por cor
 * Rotaciona entre 4 variações para evitar duplicação
 */
const COLOR_DESCRIPTION_TEMPLATES = {
  branco: [
    'na cor branca clássica',
    'em branco atemporal',
    'no tom branco tradicional',
    'na elegante cor branca',
  ],
  'branco-3': [
    'na cor branca premium',
    'em branco sofisticado',
    'no tom branco premium',
    'na refinada cor branca',
  ],
  preto: [
    'na cor preta elegante',
    'em preto moderno',
    'no tom preto sofisticado',
    'na clássica cor preta',
  ],
  'preto-3': [
    'na cor preta premium',
    'em preto refinado',
    'no tom preto executivo',
    'na distinta cor preta',
  ],
  'azul-marinho': [
    'na cor azul marinho profissional',
    'em azul marinho clássico',
    'no tom azul marinho elegante',
    'na versátil cor azul marinho',
  ],
  'marinho-3': [
    'na cor azul marinho premium',
    'em azul marinho sofisticado',
    'no tom marinho profissional',
    'na refinada cor marinho',
  ],
  rosa: [
    'na cor rosa delicada',
    'em rosa feminino',
    'no tom rosa suave',
    'na elegante cor rosa',
  ],
  'rosa-bebe': [
    'na cor rosa bebê',
    'em rosa bebê delicado',
    'no tom rosa bebê suave',
    'na suave cor rosa bebê',
  ],
  'rose-2': [
    'na cor rosê moderna',
    'em rosê sofisticado',
    'no tom rosê contemporâneo',
    'na elegante cor rosê',
  ],
  verde: [
    'na cor verde hospitalar',
    'em verde profissional',
    'no tom verde cirúrgico',
    'na clássica cor verde',
  ],
  'verde-1': [
    'na cor verde premium',
    'em verde hospitalar sofisticado',
    'no tom verde profissional',
    'na refinada cor verde',
  ],
  'verde-agua': [
    'na cor verde água',
    'em verde água refrescante',
    'no tom verde água suave',
    'na delicada cor verde água',
  ],
  areia: [
    'na cor areia neutra',
    'em areia versátil',
    'no tom areia elegante',
    'na sofisticada cor areia',
  ],
  'areia-2': [
    'na cor areia premium',
    'em areia refinado',
    'no tom areia moderno',
    'na distinta cor areia',
  ],
  vinho: [
    'na cor vinho elegante',
    'em vinho sofisticado',
    'no tom vinho profissional',
    'na rica cor vinho',
  ],
  'vinho-2': [
    'na cor vinho premium',
    'em vinho refinado',
    'no tom vinho executivo',
    'na nobre cor vinho',
  ],
  cinza: [
    'na cor cinza moderna',
    'em cinza contemporâneo',
    'no tom cinza neutro',
    'na versátil cor cinza',
  ],
  'cinza-1': [
    'na cor cinza premium',
    'em cinza sofisticado',
    'no tom cinza elegante',
    'na refinada cor cinza',
  ],
  lilas: [
    'na cor lilás suave',
    'em lilás delicado',
    'no tom lilás feminino',
    'na elegante cor lilás',
  ],
  'lilas-2': [
    'na cor lilás premium',
    'em lilás sofisticado',
    'no tom lilás moderno',
    'na refinada cor lilás',
  ],
  uva: [
    'na cor uva vibrante',
    'em uva moderno',
    'no tom uva elegante',
    'na distinta cor uva',
  ],
  pink: [
    'na cor pink vibrante',
    'em pink moderno',
    'no tom pink feminino',
    'na alegre cor pink',
  ],
  'pink-2': [
    'na cor pink premium',
    'em pink sofisticado',
    'no tom pink contemporâneo',
    'na vibrante cor pink',
  ],
  chocolate: [
    'na cor chocolate',
    'em chocolate sofisticado',
    'no tom chocolate elegante',
    'na rica cor chocolate',
  ],
  chumbo: [
    'na cor chumbo moderna',
    'em chumbo contemporâneo',
    'no tom chumbo profissional',
    'na sóbria cor chumbo',
  ],
}

/**
 * Descritores de benefício por cor (para H2 e descrição)
 */
const COLOR_BENEFITS: Record<string, string[]> = {
  branco: [
    'Transmite limpeza e profissionalismo',
    'Ideal para ambientes hospitalares',
    'Combina com qualquer ambiente',
    'Clássico e atemporal',
  ],
  preto: [
    'Disfarça manchas do dia a dia',
    'Elegante e moderno',
    'Versátil para diferentes contextos',
    'Sofisticado e profissional',
  ],
  'azul-marinho': [
    'Combina com todos os tons de pele',
    'Profissional e confiável',
    'Versátil para uso diário',
    'Elegante e discreto',
  ],
  rosa: [
    'Transmite empatia e acolhimento',
    'Feminino e delicado',
    'Ideal para pediatria e estética',
    'Suave e profissional',
  ],
  verde: [
    'Tradicional da área cirúrgica',
    'Reduz fadiga visual',
    'Reconhecido na área da saúde',
    'Profissional e funcional',
  ],
  areia: [
    'Neutro e versátil',
    'Disfarça pequenas manchas',
    'Moderno e elegante',
    'Ideal para uso prolongado',
  ],
  vinho: [
    'Sofisticado e marcante',
    'Disfarça manchas',
    'Elegante e profissional',
    'Destaque com bom gosto',
  ],
}

/**
 * Gera slug de cor normalizado
 */
function normalizeColorSlug(color: string): string {
  return color
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

/**
 * Seleciona template baseado em hash do produto (consistente)
 */
function selectTemplate(templates: string[], productId: number): string {
  const index = productId % templates.length
  return templates[index]
}

/**
 * Seleciona benefício baseado em hash do produto
 */
function selectBenefit(benefits: string[], productId: number): string {
  const index = Math.floor(productId / 2) % benefits.length
  return benefits[index]
}

/**
 * Gera H1 otimizado para página de produto-cor
 */
export function generateColorH1(
  productName: string,
  colorName: string
): string {
  return `${productName} ${colorName}`
}

/**
 * Gera H2 (subtítulo) com benefício da cor
 */
export function generateColorH2(
  productName: string,
  colorName: string,
  productId: number,
  category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros'
): string {
  const colorSlug = normalizeColorSlug(colorName)
  const baseColorSlug = colorSlug.replace(/-\d+$/, '') // Remove números (branco-3 → branco)

  const benefits = COLOR_BENEFITS[colorSlug] || COLOR_BENEFITS[baseColorSlug] || [
    'Qualidade premium',
    'Conforto durante todo o dia',
    'Durabilidade comprovada',
    'Acabamento impecável',
  ]

  const benefit = selectBenefit(benefits, productId)

  // Templates de H2 por categoria
  const templates = {
    jalecos: [
      `Jaleco profissional ${colorName.toLowerCase()} — ${benefit}`,
      `${benefit} em ${productName.toLowerCase()}`,
      `Uniforme médico ${colorName.toLowerCase()} de alta qualidade`,
      `${productName} ${colorName} — ${benefit}`,
    ],
    conjuntos: [
      `Conjunto cirúrgico ${colorName.toLowerCase()} — ${benefit}`,
      `${benefit} em scrub profissional`,
      `Pijama cirúrgico ${colorName.toLowerCase()} premium`,
      `${productName} ${colorName} — ${benefit}`,
    ],
    dolmas: [
      `Dólmã ${colorName.toLowerCase()} profissional — ${benefit}`,
      `${benefit} em uniforme de cozinha`,
      `Dólmã premium ${colorName.toLowerCase()}`,
      `${productName} ${colorName} — ${benefit}`,
    ],
    acessorios: [
      `Acessório ${colorName.toLowerCase()} profissional`,
      `${benefit} em ${productName.toLowerCase()}`,
      `Complemento perfeito na cor ${colorName.toLowerCase()}`,
      `${productName} ${colorName} — ${benefit}`,
    ],
    outros: [
      `${productName} ${colorName} profissional`,
      `${benefit} em uniforme premium`,
      `Qualidade Jaleca na cor ${colorName.toLowerCase()}`,
      `${productName} ${colorName} — ${benefit}`,
    ],
  }

  return selectTemplate(templates[category], productId)
}

/**
 * Gera meta description única (150-160 caracteres)
 */
export function generateColorMetaDescription(
  productName: string,
  colorName: string,
  productId: number,
  category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros'
): string {
  const colorSlug = normalizeColorSlug(colorName)
  const baseColorSlug = colorSlug.replace(/-\d+$/, '')

  const templates = COLOR_DESCRIPTION_TEMPLATES[colorSlug] ||
                    COLOR_DESCRIPTION_TEMPLATES[baseColorSlug] || [
    `na cor ${colorName.toLowerCase()}`,
    `em ${colorName.toLowerCase()}`,
    `no tom ${colorName.toLowerCase()}`,
    `na versão ${colorName.toLowerCase()}`,
  ]

  const colorDesc = selectTemplate(templates, productId)

  const categoryTerms = {
    jalecos: [
      'Jaleco profissional de tecido premium com modelagem confortável',
      'Uniforme médico de alta durabilidade com acabamento impecável',
      'Avental profissional com design moderno e funcional',
      'Jaleco premium com caimento perfeito e qualidade superior'
    ],
    conjuntos: [
      'Conjunto cirúrgico de tecido respirável com ajuste confortável',
      'Scrub profissional de alta qualidade com bolsos funcionais',
      'Pijama cirúrgico premium com modelagem anatômica',
      'Conjunto profissional durável com design ergonômico'
    ],
    dolmas: [
      'Dólmã profissional de tecido resistente com modelagem moderna',
      'Uniforme de cozinha premium com ventilação superior',
      'Dólmã de alta qualidade com acabamento refinado',
      'Uniforme gastronômico durável com design funcional'
    ],
    acessorios: [
      'Acessório profissional de qualidade premium',
      'Complemento essencial para seu uniforme',
      'Item profissional durável e prático',
      'Acessório premium com design funcional'
    ],
    outros: [
      'Uniforme profissional de qualidade superior',
      'Produto premium para área da saúde',
      'Item de alta durabilidade Jaleca',
      'Produto profissional com acabamento impecável'
    ],
  }

  const term = selectTemplate(categoryTerms[category], productId)

  const ctas = [
    'Frete grátis SP/RJ/MG/ES acima de R$499',
    'Entrega para todo Brasil. 3x sem juros',
    'PIX 5% off. Troca grátis 30 dias',
    'Compre parcelado. Entrega expressa',
  ]

  const cta = selectTemplate(ctas, productId)

  return `${productName} ${colorDesc}. ${term}. ${cta}.`
}

/**
 * Gera objeto SEO completo para uma variação de cor
 */
export function generateColorSEO(
  productName: string,
  colorName: string,
  productId: number,
  category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros'
) {
  return {
    h1: generateColorH1(productName, colorName),
    h2: generateColorH2(productName, colorName, productId, category),
    metaDescription: generateColorMetaDescription(productName, colorName, productId, category),
    title: `${productName} ${colorName} — Jaleca`,
  }
}

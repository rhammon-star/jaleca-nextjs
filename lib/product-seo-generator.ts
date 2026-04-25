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
 * Psicologia da cor — texto único por cor (combate thin content)
 * Rotaciona entre 4 variações por cor
 */
const COLOR_PSYCHOLOGY: Record<string, string[]> = {
  branco: [
    'A cor branca transmite pureza e higiene, sendo a escolha preferida em ambientes hospitalares. Combine com calça preta para um visual profissional impecável.',
    'Branco simboliza limpeza e confiança na área da saúde. Ideal para profissionais que buscam transmitir credibilidade e profissionalismo.',
    'O branco clássico nunca sai de moda. Perfeito para quem valoriza tradição e quer um uniforme que combina com qualquer ambiente.',
    'Cor branca: sinônimo de assepsia e seriedade. Escolha de 78% dos profissionais de saúde no Brasil.',
  ],
  'branco-3': [
    'Branco premium com acabamento superior. A sofisticação do branco clássico com qualidade Jaleca.',
    'Tom branco refinado que valoriza sua imagem profissional. Combine com acessórios em tons neutros.',
    'Branco exclusivo com toque premium. Para profissionais que não abrem mão de qualidade.',
    'A elegância do branco em versão premium. Destaque-se mantendo a tradição.',
  ],
  preto: [
    'Preto disfarça manchas e transmite autoridade. Ideal para quem busca praticidade sem perder elegância.',
    'A cor preta é versátil e moderna. Perfeita para profissionais de estética, tatuagem e áreas não-clínicas.',
    'Preto: elegância atemporal. Combine com tênis branco para um visual contemporâneo e profissional.',
    'Escolha de profissionais modernos. O preto traz sofisticação e esconde melhor o desgaste do dia a dia.',
  ],
  'preto-3': [
    'Preto premium com tecido de alta gramatura. Sofisticação e durabilidade em um só produto.',
    'Tom preto executivo que valoriza sua imagem. Para quem exige o melhor em uniforme profissional.',
    'Preto refinado com acabamento impecável. Destaque-se com elegância discreta.',
    'A nobreza do preto em versão premium Jaleca. Qualidade visível, conforto garantido.',
  ],
  'azul-marinho': [
    'Azul marinho combina com todos os tons de pele. A escolha certeira para quem quer acertar sempre.',
    'Cor preferida em cirurgias: reduz contraste com sangue e cansa menos a vista. Funcional e elegante.',
    'Marinho transmite confiança e profissionalismo. Combine com tênis branco ou preto.',
    'O azul marinho é atemporal. Perfeito para uso diário sem perder a elegância.',
  ],
  'marinho-3': [
    'Azul marinho premium com toque refinado. Profissionalismo e sofisticação em cada detalhe.',
    'Tom marinho exclusivo que valoriza qualquer profissional. Qualidade superior Jaleca.',
    'Marinho premium: a escolha de quem exige o melhor. Elegância discreta, qualidade visível.',
    'Azul marinho refinado com acabamento impecável. Destaque-se mantendo a tradição.',
  ],
  rosa: [
    'Rosa transmite empatia e acolhimento. Ideal para pediatria, estética e atendimentos que exigem delicadeza.',
    'A cor rosa acalma pacientes e cria ambiente acolhedor. Perfeita para profissionais da área infantil.',
    'Rosa suave que combina profissionalismo e feminilidade. Combine com calça branca ou preta.',
    'Escolha de 65% das profissionais de estética no Brasil. O rosa valoriza sem perder seriedade.',
  ],
  'rosa-bebe': [
    'Rosa bebê: delicadeza e profissionalismo juntos. Ideal para quem trabalha com crianças.',
    'Tom rosa suave que transmite calma. Perfeito para pediatras e profissionais de estética.',
    'Rosa bebê clássico com qualidade premium. Acolhimento visível, conforto garantido.',
    'A ternura do rosa bebê em uniforme profissional. Encante mantendo a seriedade.',
  ],
  'rose-2': [
    'Rosê moderno e sofisticado. Para profissionais que buscam um rosa mais contemporâneo.',
    'Tom rosê exclusivo que une feminilidade e modernidade. Destaque-se com bom gosto.',
    'Rose premium: a evolução do rosa clássico. Elegância discreta, qualidade superior.',
    'Rosê refinado que valoriza sua imagem. Perfeito para estética e harmonização facial.',
  ],
  verde: [
    'Verde cirúrgico reduz fadiga visual em ambientes de alta concentração. Escolha técnica dos centros cirúrgicos.',
    'A cor verde é reconhecida mundialmente na área da saúde. Transmite seriedade e tradição.',
    'Verde hospitalar: funcionalidade comprovada. Ideal para quem valoriza a tradição da medicina.',
    'Tom verde clássico usado há décadas em cirurgias. Confiança e profissionalismo garantidos.',
  ],
  'verde-1': [
    'Verde premium com tonalidade refinada. Tradição cirúrgica com qualidade superior.',
    'Tom verde exclusivo que valoriza o profissional. Funcionalidade e elegância juntas.',
    'Verde premium: a escolha de cirurgiões exigentes. Qualidade Jaleca em cada detalhe.',
    'Verde refinado com acabamento impecável. Destaque-se mantendo a tradição médica.',
  ],
  'verde-agua': [
    'Verde água traz leveza e modernidade. Perfeito para profissionais que buscam um verde mais suave.',
    'Tom refrescante que acalma e transmite confiança. Ideal para pediatria e estética.',
    'Verde água: a delicadeza do verde clássico. Combine com acessórios em tons neutros.',
    'Cor verde suave que valoriza sem cansar a vista. Modernidade e profissionalismo juntos.',
  ],
  areia: [
    'Areia é neutro e versátil. Disfarça manchas e combina com tudo — a escolha inteligente.',
    'Tom areia moderno que valoriza qualquer ambiente. Ideal para uso prolongado sem desgaste visual.',
    'Cor areia: elegância discreta. Perfeita para quem busca praticidade e sofisticação.',
    'Neutro e atemporal. O areia é a escolha de profissionais que valorizam versatilidade.',
  ],
  'areia-2': [
    'Areia premium com tonalidade refinada. Neutralidade elegante em versão superior.',
    'Tom areia exclusivo que valoriza sua imagem. Sofisticação discreta, conforto garantido.',
    'Areia premium: versatilidade com qualidade superior. Destaque-se com elegância neutra.',
    'Areia refinado que combina com tudo. Para quem exige o melhor em uniforme profissional.',
  ],
  vinho: [
    'Vinho transmite sofisticação e autoridade. Ideal para quem quer destaque mantendo profissionalismo.',
    'Cor vinho disfarça manchas e valoriza todos os tons de pele. Elegância garantida.',
    'Tom vinho marcante sem ser chamativo. Perfeito para profissionais de estética e harmonização.',
    'Vinho: a escolha de quem busca diferenciação. Sofisticado, elegante e prático.',
  ],
  'vinho-2': [
    'Vinho premium com tonalidade nobre. Sofisticação e qualidade em cada detalhe.',
    'Tom vinho exclusivo que valoriza qualquer profissional. Elegância superior Jaleca.',
    'Vinho refinado: destaque-se com classe. Qualidade visível, conforto garantido.',
    'A nobreza do vinho em versão premium. Para quem exige o melhor.',
  ],
  cinza: [
    'Cinza moderno e versátil. Disfarça manchas e combina com qualquer ambiente profissional.',
    'Tom cinza neutro que valoriza sem cansar. Ideal para uso diário em qualquer área.',
    'Cor cinza: sofisticação discreta. Perfeita para profissionais contemporâneos.',
    'Cinza é a escolha de quem busca modernidade. Neutro, elegante e prático.',
  ],
  'cinza-1': [
    'Cinza premium com acabamento superior. Neutralidade moderna com qualidade Jaleca.',
    'Tom cinza refinado que valoriza sua imagem. Sofisticação discreta garantida.',
    'Cinza exclusivo: modernidade e elegância. Destaque-se mantendo a neutralidade.',
    'Cinza premium para profissionais exigentes. Qualidade visível em tom contemporâneo.',
  ],
  lilas: [
    'Lilás transmite criatividade e delicadeza. Ideal para estética, harmonização e áreas wellness.',
    'Cor lilás suave que acalma e acolhe. Perfeita para profissionais de terapias holísticas.',
    'Tom lilás feminino e moderno. Combine com calça branca para visual profissional leve.',
    'Lilás: a escolha de profissionais de bem-estar. Delicadeza e seriedade juntas.',
  ],
  'lilas-2': [
    'Lilás premium com tonalidade refinada. Delicadeza e sofisticação em versão superior.',
    'Tom lilás exclusivo que valoriza sua imagem. Modernidade com qualidade Jaleca.',
    'Lilás refinado: feminilidade com elegância. Destaque-se com bom gosto.',
    'Lilás premium para profissionais exigentes. Suavidade e qualidade visíveis.',
  ],
  uva: [
    'Uva é vibrante sem ser exagerado. Perfeito para quem busca diferenciação mantendo seriedade.',
    'Tom uva moderno que valoriza e destaca. Ideal para estética e harmonização facial.',
    'Cor uva: elegância com personalidade. Combine com acessórios neutros.',
    'Uva: a escolha de profissionais modernos. Destaque-se com sofisticação.',
  ],
  pink: [
    'Pink vibrante para profissionais ousadas. Ideal para estética, nail design e áreas criativas.',
    'Cor pink moderna que destaca sem perder profissionalismo. Perfeita para quem tem atitude.',
    'Tom pink alegre que valoriza e anima o ambiente. Combine com branco ou preto.',
    'Pink: a escolha de profissionais confiantes. Feminilidade e modernidade juntas.',
  ],
  'pink-2': [
    'Pink premium com tonalidade sofisticada. Vibração controlada, qualidade superior.',
    'Tom pink exclusivo que valoriza sua imagem. Modernidade com elegância Jaleca.',
    'Pink refinado: destaque-se com classe. Feminilidade e qualidade visíveis.',
    'Pink premium para profissionais ousadas. Vibração certa, conforto garantido.',
  ],
  chocolate: [
    'Chocolate é sofisticado e versátil. Disfarça manchas e valoriza todos os tons de pele.',
    'Tom chocolate moderno que transmite acolhimento. Ideal para áreas gastronômicas e wellness.',
    'Cor chocolate: elegância natural. Perfeita para quem busca diferenciação com bom gosto.',
    'Chocolate: a escolha de profissionais únicos. Sofisticação e praticidade juntas.',
  ],
  chumbo: [
    'Chumbo moderno e urbano. Perfeito para profissionais contemporâneos que buscam diferenciação.',
    'Tom chumbo neutro que valoriza. Ideal para áreas não-clínicas e ambientes modernos.',
    'Cor chumbo: sofisticação industrial. Combine com tênis branco para visual atual.',
    'Chumbo: a escolha de profissionais descolados. Neutro, moderno e versátil.',
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
 * DIFERENCIADO do Title para melhor SEO
 */
export function generateColorH1(
  productName: string,
  colorName: string,
  productId: number,
  category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros'
): string {
  const contextTemplates = {
    jalecos: [
      `${productName} ${colorName} — Uniforme Médico Profissional`,
      `${productName} ${colorName} | Jaleco Premium`,
      `${productName} ${colorName} para Profissionais de Saúde`,
      `${productName} ${colorName} — Qualidade Jaleca`,
    ],
    conjuntos: [
      `${productName} ${colorName} — Scrub Profissional`,
      `${productName} ${colorName} | Conjunto Cirúrgico`,
      `${productName} ${colorName} para Área da Saúde`,
      `${productName} ${colorName} — Pijama Cirúrgico Premium`,
    ],
    dolmas: [
      `${productName} ${colorName} — Uniforme de Cozinha`,
      `${productName} ${colorName} | Dólmã Profissional`,
      `${productName} ${colorName} para Gastronomia`,
      `${productName} ${colorName} — Qualidade Premium`,
    ],
    acessorios: [
      `${productName} ${colorName} — Acessório Profissional`,
      `${productName} ${colorName} | Complemento Perfeito`,
      `${productName} ${colorName} para Uniforme`,
      `${productName} ${colorName} — Qualidade Jaleca`,
    ],
    outros: [
      `${productName} ${colorName} — Uniforme Profissional`,
      `${productName} ${colorName} | Qualidade Premium`,
      `${productName} ${colorName} para Profissionais`,
      `${productName} ${colorName} — Alta Durabilidade`,
    ],
  }

  return selectTemplate(contextTemplates[category], productId)
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
 * Gera meta description única com psicologia da cor (120-160 caracteres)
 * INCLUI urgência e diferenciação por cor
 */
export function generateColorMetaDescription(
  productName: string,
  colorName: string,
  productId: number,
  category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros'
): string {
  const colorSlug = normalizeColorSlug(colorName)
  const baseColorSlug = colorSlug.replace(/-\d+$/, '')

  // Pega APENAS a primeira frase da psicologia da cor
  const psychology = COLOR_PSYCHOLOGY[colorSlug] || COLOR_PSYCHOLOGY[baseColorSlug]
  const psychologySnippet = psychology
    ? selectTemplate(psychology, productId).split('.')[0] + '.'
    : `${colorName} é elegante e profissional.`

  const categoryTerms = {
    jalecos: 'Jaleco premium',
    conjuntos: 'Scrub profissional',
    dolmas: 'Dólmã premium',
    acessorios: 'Acessório profissional',
    outros: 'Uniforme premium',
  }

  const term = categoryTerms[category]

  const ctas = [
    'Frete grátis SE. PIX 5% off',
    '3x sem juros. Entrega rápida',
    'PIX 5% off. Troca 30 dias',
    'Compre agora. Frete grátis SE',
  ]

  const cta = selectTemplate(ctas, productId)

  // Formato: ProductName ColorName. Termo. Psicologia (1 frase). CTA.
  // Exemplo: "Jaleco Slim Branco. Jaleco premium. Transmite pureza e higiene. Frete grátis SE. PIX 5% off."
  return `${productName} ${colorName}. ${term}. ${psychologySnippet} ${cta}.`
}

/**
 * Gera Title otimizado (50-60 chars)
 * Formato compacto mas completo para evitar truncamento na SERP
 */
export function generateColorTitle(
  productName: string,
  colorName: string,
  productId: number,
  category: 'jalecos' | 'conjuntos' | 'dolmas' | 'acessorios' | 'outros'
): string {
  // Mantém nome completo mas adiciona sufixo conciso
  const titleTemplates = {
    jalecos: [
      `${productName} ${colorName} — Uniforme Médico | Jaleca`,
      `${productName} ${colorName} | Jaleco Premium Jaleca`,
      `${productName} ${colorName} — Jaleco Profissional`,
      `${productName} ${colorName} | Saúde — Jaleca`,
    ],
    conjuntos: [
      `${productName} ${colorName} — Scrub Cirúrgico | Jaleca`,
      `${productName} ${colorName} | Conjunto Premium Jaleca`,
      `${productName} ${colorName} — Pijama Cirúrgico`,
      `${productName} ${colorName} | Scrub — Jaleca`,
    ],
    dolmas: [
      `${productName} ${colorName} — Uniforme Cozinha | Jaleca`,
      `${productName} ${colorName} | Dólmã Premium Jaleca`,
      `${productName} ${colorName} — Dólmã Profissional`,
      `${productName} ${colorName} | Gastronomia Jaleca`,
    ],
    acessorios: [
      `${productName} ${colorName} — Acessório | Jaleca`,
      `${productName} ${colorName} | Premium Jaleca`,
      `${productName} ${colorName} — Profissional`,
      `${productName} ${colorName} | Jaleca`,
    ],
    outros: [
      `${productName} ${colorName} — Uniforme | Jaleca`,
      `${productName} ${colorName} | Premium Jaleca`,
      `${productName} ${colorName} — Profissional`,
      `${productName} ${colorName} | Jaleca`,
    ],
  }

  return selectTemplate(titleTemplates[category], productId)
}

/**
 * Retorna texto completo de psicologia da cor (para página do produto)
 * Combate thin content com diferenciação real por cor
 */
export function getColorPsychology(
  colorName: string,
  productId: number
): string {
  const colorSlug = normalizeColorSlug(colorName)
  const baseColorSlug = colorSlug.replace(/-\d+$/, '')

  const psychology = COLOR_PSYCHOLOGY[colorSlug] || COLOR_PSYCHOLOGY[baseColorSlug]

  if (!psychology) {
    return `A cor ${colorName} é uma excelente escolha para profissionais que buscam um uniforme moderno e versátil.`
  }

  return selectTemplate(psychology, productId)
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
    h1: generateColorH1(productName, colorName, productId, category),
    h2: generateColorH2(productName, colorName, productId, category),
    metaDescription: generateColorMetaDescription(productName, colorName, productId, category),
    title: generateColorTitle(productName, colorName, productId, category),
    colorPsychology: getColorPsychology(colorName, productId),
  }
}

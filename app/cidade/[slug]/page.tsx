import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react'
import { getAllProducts } from '@/lib/all-products'
import UGCSection from '@/components/UGCSection'
import { getPosts } from '@/lib/wordpress'
import type { WPPost } from '@/lib/wordpress'

type CidadeInfo = {
  nome: string
  estado: string
  uf: string
  tipo: 'fechada' | 'revenda' | 'propria'
  profissoes: string
  freteGratis?: boolean
  conteudoLocal?: string
  heroUrl?: string
  keywordsExtra?: string
  metaTitle?: string
  metaDescription?: string
}


const FAQ_TEMPLATE = (nome: string, estado: string) => [
  {
    pergunta: `Qual o prazo de entrega para jalecos em ${nome}?`,
    resposta: `O prazo de entrega para ${nome}, ${estado}, varia de 3 a 7 dias úteis após a confirmação do pagamento. Você recebe o código de rastreamento por e-mail assim que o pedido for despachado.`,
  },
  {
    pergunta: `Tem frete grátis para ${nome}?`,
    resposta: `Oferecemos frete grátis (PAC) para ${nome} nas compras acima de R$499, válido para os estados de SP, RJ, MG e ES. Para outros estados ou valores menores, calcule o frete informando seu CEP no checkout.`,
  },
  {
    pergunta: `Como funciona a troca de jalecos em ${nome}?`,
    resposta: `Arrependimento: 7 dias após o recebimento, produto sem uso e com etiqueta (CDC). Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Entre em contato pelo WhatsApp.`,
  },
  {
    pergunta: `Como rastrear meu pedido para ${nome}?`,
    resposta: `Assim que o pedido for despachado, você recebe o código de rastreamento por e-mail. O acompanhamento é feito diretamente no site dos Correios ou da transportadora escolhida.`,
  },
  {
    pergunta: `A Jaleca faz bordado de nome e registro profissional no jaleco enviado para ${nome}?`,
    resposta: `Não. A Jaleca não oferece serviço de bordado. Os jalecos são enviados para ${nome} sem bordado. Após receber, você pode levar a peça a uma bordadeira local — é simples e acessível. Importante: depois de bordado, o jaleco não pode mais ser trocado.`,
  },
]

const CIDADES: Record<string, CidadeInfo> = {
  'jaleco-belo-horizonte': {
    nome: 'Belo Horizonte',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de BH',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Belo Horizonte com entrega rápida: médicas e dentistas de BH — do Mater Dei ao Santa Casa, das clínicas do Savassi ao hospital de Contagem — escolhem a Jaleca pelo tecido que não amassa e pelo corte acinturado real. Lojas de jaleco em BH raramente têm grade do PP ao G3 com molde próprio — a Jaleca tem, com frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Praca_do_Papa%2C_Belo_Horizonte_%28cropped%292.jpg',
    keywordsExtra: 'jaleco bh, jalecos belo horizonte, jalecos bh, loja de jaleco em bh, lojas de jaleco em bh, loja de jalecos em bh',
  },
  'jaleco-campo-grande': {
    nome: 'Campo Grande',
    estado: 'Mato Grosso do Sul',
    uf: 'MS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Campo Grande',
    conteudoLocal: 'Em Campo Grande, onde o calor é constante boa parte do ano, o tecido do jaleco importa. A Jaleca tem opções leves e duráveis pra quem trabalha na Santa Casa, no Hospital Regional ou nas clínicas da Avenida Afonso Pena. Entrega rastreada pra todo o MS.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Lago_do_Parque_das_Na%C3%A7%C3%B5es_Ind%C3%ADgenas.jpg',
  },
  'jaleco-vitoria': {
    nome: 'Vitória',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Vitória',
    freteGratis: true,
    conteudoLocal: 'Em Vitória, ES, profissionais do HUCAM e das clínicas da Praia do Canto precisam de jaleco que aguente o clima úmido da ilha e ainda fique bem depois de horas de uso. Tecido leve, corte moderno e frete grátis pra ES acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/VitorJubini_TerceiraPonte_Vitoria_ES_%2827121005458%29.jpg',
  },
  'jaleco-barra-da-tijuca': {
    nome: 'Barra da Tijuca',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde da Barra da Tijuca',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Barra da Tijuca para profissionais de saúde: clínicas renomadas ou o Hospital Barra D\'Or exigem jalecos que unem estilo e conforto. A Jaleca entrega o jaleco feminino ideal para sua rotina na Barra da Tijuca, com frete grátis pra RJ nas compras acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Rua_Martinho_de_Mesquita_-_Barra_da_Tijuca_-_Rio_de_Janeiro%2C_RJ.jpg',
  },
  'jaleco-muriae': {
    nome: 'Muriaé',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Muriaé',
    freteGratis: true,
    conteudoLocal: 'Em Muriaé, no leste de Minas, profissionais de saúde do Hospital São Paulo e das clínicas da cidade contam com a Jaleca pra jaleco que aguenta o dia a dia — sem encolher, sem amolgar. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Muria%C3%A9_MG_Brasil_-_Vista_parcial_-_panoramio.jpg/3840px-Muria%C3%A9_MG_Brasil_-_Vista_parcial_-_panoramio.jpg',
  },
  'jaleco-marilia': {
    nome: 'Marília',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Marília',
    freteGratis: true,
    conteudoLocal: 'Em Marília, polo de saúde com o complexo FAMEMA e diversos hospitais, a Jaleca veste com excelência as profissionais que buscam jalecos femininos com qualidade e design superior. Frete grátis pra SP acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Panorama_Urbano_de_Mar%C3%ADlia.jpg',
  },
  'jaleco-itabira': {
    nome: 'Itabira',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Itabira',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Itabira para profissionais de saúde: do Hospital Nossa Senhora das Dores a outros centros, a Jaleca oferece qualidade e design nos jalecos femininos para uma imagem impecável. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Itabira_MG_Brasil_-_Vista_a%C3%A9rea_-_panoramio_%281%29.jpg/3840px-Itabira_MG_Brasil_-_Vista_a%C3%A9rea_-_panoramio_%281%29.jpg',
  },
  'jaleco-joao-monlevade': {
    nome: 'João Monlevade',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de João Monlevade',
    freteGratis: true,
    conteudoLocal: 'Jaleco em João Monlevade para enfermeiras e médicas: a Jaleca oferece jalecos femininos de alta qualidade, perfeitos para o Hospital Margarida e clínicas da região, unindo estilo e funcionalidade. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Vista_Jo%C3%A3o_Monlevade.jpg/3840px-Vista_Jo%C3%A3o_Monlevade.jpg',
  },
  'jaleco-lagoa-santa': {
    nome: 'Lagoa Santa',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Lagoa Santa',
    freteGratis: true,
    conteudoLocal: 'Em Lagoa Santa, cidade de clima seco e turismo científico perto da Grande BH, profissionais de saúde das clínicas locais contam com a Jaleca pra jaleco que não perde a forma e ainda fica bem. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Gruta_da_Lapinha_-_Entrada_da_Gruta%2C_Lagoa_Santa_-_MG_-_panoramio.jpg',
  },
  'jaleco-teixeira-de-freitas': {
    nome: 'Teixeira de Freitas',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Teixeira de Freitas',
    conteudoLocal: 'Jaleco em Teixeira de Freitas com entrega rastreada: a Jaleca oferece jalecos femininos profissionais para quem atua no Hospital Municipal ou nas diversas clínicas da cidade, com muito estilo e qualidade.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Imagem_a%C3%A9rea_Teixeira_de_Freitas.png',
  },
  'jaleco-curitiba': {
    nome: 'Curitiba',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Curitiba',
    conteudoLocal: 'Jaleco em Curitiba entregue direto da fábrica: a Jaleca é fabricante brasileira — do Hospital Marcelino Champagnat às clínicas do Batel e do Água Verde. Tecido encorpado que não murcha no frio do sul, corte acinturado real do PP ao G3. Sem loja física em Curitiba, mas com entrega via PAC ou SEDEX em até 5 dias úteis para todo o Paraná.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Estufa_principal_do_Jardim_Bot%C3%A2nico_de_Curitiba_02.jpg',
    keywordsExtra: 'loja de jalecos curitiba, jalecos curitiba, jaleco curitiba, jaleco feminino curitiba',
  },
  'jaleco-londrina': {
    nome: 'Londrina',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Londrina',
    conteudoLocal: 'Em Londrina, do HU ao Hospital da Zona Norte, a Jaleca atende profissionais de saúde do norte paranaense. Tecido que não desfia, costura que não cede, tamanhos de PP ao G3. Entrega rastreada pra todo o PR.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Panoramica3-lago.jpg',
  },
  'jaleco-governador-valadares': {
    nome: 'Governador Valadares',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Governador Valadares',
    freteGratis: true,
    conteudoLocal: 'Em Governador Valadares, maior cidade do Vale do Rio Doce, profissionais do Hospital Regional e das clínicas da cidade encontram na Jaleca jaleco que aguenta a rotina intensa. Entrega rastreada pra todo o Vale do Aço. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Rio_Doce_e_Governador_Valadares_MG.JPG',
  },
  'jaleco-uberaba': {
    nome: 'Uberaba',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Uberaba',
    freteGratis: true,
    conteudoLocal: 'Em Uberaba, polo da medicina veterinária e da saúde no Triângulo Mineiro, profissionais do HC da UFTM e do Hospital Mário Palmério encontram na Jaleca jaleco que cabe no dia corrido — leve, sem amolgar. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Skyline_de_Uberaba.png',
  },
  'jaleco-montes-claros': {
    nome: 'Montes Claros',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Montes Claros',
    freteGratis: true,
    conteudoLocal: 'Em Montes Claros, polo regional do Norte de Minas, profissionais da Santa Casa e do Hospital Aroldo Tourinho escolhem a Jaleca pelo jaleco que aguenta a jornada longa. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/MOCcity_%28cropped%29.jpg',
  },
  'jaleco-vila-velha': {
    nome: 'Vila Velha',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Vila Velha',
    freteGratis: true,
    conteudoLocal: 'Em Vila Velha, na Grande Vitória, profissionais do Hospital Santa Mônica e do HVV escolhem a Jaleca pelo tecido que respira no calor do ES. Frete grátis pra compras acima de R$499 no Espírito Santo.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Convento_da_Penha_-_Vila_Velha-ES%2C_Brazil_03103.jpg',
  },
  'jaleco-cachoeiro-de-itapemirim': {
    nome: 'Cachoeiro de Itapemirim',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Cachoeiro de Itapemirim',
    freteGratis: true,
    conteudoLocal: 'Em Cachoeiro de Itapemirim, profissionais da Santa Casa ou do Hospital Evangélico escolhem Jaleca para jalecos que unem design moderno e alta performance, essenciais no dia a dia.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Cachoeiro.jpg',
  },
  'jaleco-serra': {
    nome: 'Serra',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Serra',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Serra, ES, para profissionais de saúde: do Hospital Jayme dos Santos Neves a outras unidades, a Jaleca oferece a qualidade e o estilo ideais para jalecos femininos com conforto e durabilidade. Frete grátis pra ES acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mestre_%C3%81lvaro.jpg/3840px-Mestre_%C3%81lvaro.jpg',
  },
  'jaleco-vitoria-da-conquista': {
    nome: 'Vitória da Conquista',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Vitória da Conquista',
    conteudoLocal: 'Em Vitória da Conquista, maior cidade do sudoeste baiano, profissionais do Hospital Geral e das clínicas da cidade contam com a Jaleca pra jaleco que não perde a forma. Entrega rastreada pra toda a região.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Panoramica_Conquista.png',
  },
  'jaleco-colatina': {
    nome: 'Colatina',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'propria',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Colatina',
    freteGratis: true,
    conteudoLocal: 'Em Colatina, ES, seja no Hospital São José ou nas clínicas da cidade, profissionais valorizam durabilidade e design. Os jalecos da Jaleca combinam funcionalidade e elegância para o dia a dia da saúde colatinense.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Vista_parcial_de_Colatina_ES.JPG',
  },
  'jaleco-contagem': {
    nome: 'Contagem',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Contagem',
    freteGratis: true,
    conteudoLocal: 'Em Contagem, MG, a segunda maior cidade do estado, a Jaleca entrega jalecos premium para médicas, dentistas e enfermeiras. Frete grátis para MG nas compras acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Arpoador%2C_Contagem_-_MG%2C_Brazil_-_panoramio.jpg',
  },
  'jaleco-sao-paulo': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Marginal_Pinheiros_e_Jockey_Club.jpg/1280px-Marginal_Pinheiros_e_Jockey_Club.jpg',
    nome: 'São Paulo',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São Paulo',
    freteGratis: true,
    conteudoLocal: 'Jaleco em São Paulo com entrega rápida: a capital paulista concentra o maior número de profissionais de saúde do Brasil. A Jaleca entrega jalecos premium para médicas, dentistas e enfermeiras com frete grátis para SP acima de R$499.',
  },
  'jaleco-rio-de-janeiro': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cidade_Maravilhosa.jpg/1280px-Cidade_Maravilhosa.jpg',
    nome: 'Rio de Janeiro',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde do Rio de Janeiro',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Rio de Janeiro com frete grátis: dos grandes hospitais às clínicas do Leblon, profissionais de saúde escolhem a Jaleca pela qualidade e entrega rápida. Frete grátis para RJ nas compras acima de R$499.',
  },
  'jaleco-campinas': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Werner_Haberkorn_-_Vista_panor%C3%A2mica_da_cidade._Campinas-SP.jpg',
    nome: 'Campinas',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Campinas',
    freteGratis: true,
    conteudoLocal: 'Em Campinas, polo médico do interior paulista, a Jaleca fornece jalecos premium para profissionais do Unicamp e das clínicas da cidade. Frete grátis para SP acima de R$499.',
  },
  'jaleco-porto-alegre': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/IBPA_17398_-_Vista_a%C3%A9rea_da_Orla_Moacyr_Scliar%2C_na_capital._O_-_2018-10-02_-_Luciano_Lanes-PMPA_%28cropped%29.jpg/1280px-IBPA_17398_-_Vista_a%C3%A9rea_da_Orla_Moacyr_Scliar%2C_na_capital._O_-_2018-10-02_-_Luciano_Lanes-PMPA_%28cropped%29.jpg',
    nome: 'Porto Alegre',
    estado: 'Rio Grande do Sul',
    uf: 'RS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Porto Alegre',
    freteGratis: false,
    conteudoLocal: 'Em Porto Alegre, do Hospital de Clínicas ao Santa Casa e as clínicas do Moinhos de Vento, profissionais de saúde escolhem a Jaleca pelo jaleco que aguentam a jornada longa sem amolgar. Tecido encorpado pro frio gaúcho, corte que fica bem mesmo depois de um plantão inteiro.',
  },
  'jaleco-goiania': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Panomara_Goi%C3%A2nia_2022.jpg/1280px-Panomara_Goi%C3%A2nia_2022.jpg',
    nome: 'Goiânia',
    estado: 'Goiás',
    uf: 'GO',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Goiânia',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Goiânia, um dos maiores polos de saúde do Centro-Oeste: profissionais do Hospital das Clínicas da UFG e dos centros médicos do Setor Bueno encontram na Jaleca jalecos com tecido premium, corte moderno e entrega rápida para toda a capital goiana.',
  },
  'jaleco-florianopolis': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Morro_da_Cruz%2C_Florian%C3%B3polis_-_SC%2C_Brazil_-_panoramio_%28cropped%29.jpg/1280px-Morro_da_Cruz%2C_Florian%C3%B3polis_-_SC%2C_Brazil_-_panoramio_%28cropped%29.jpg',
    nome: 'Florianópolis',
    estado: 'Santa Catarina',
    uf: 'SC',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Florianópolis',
    freteGratis: false,
    conteudoLocal: 'Em Florianópolis, capital catarinense com alto IDH e crescente setor de saúde, do HU-UFSC às clínicas da Trindade e Kobrasol, a Jaleca veste profissionais que valorizam qualidade, estilo e conforto em seus jalecos.',
  },
  'jaleco-brasilia': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Planalto_Central_%28cropped%29.jpg/1280px-Planalto_Central_%28cropped%29.jpg',
    nome: 'Brasília',
    estado: 'Distrito Federal',
    uf: 'DF',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Brasília',
    freteGratis: false,
    conteudoLocal: 'Em Brasília, capital federal com um dos maiores complexos de saúde do país — do Hospital de Base ao Hospital Sarah Kubitschek e HUB da UnB — profissionais de saúde encontram na Jaleca jalecos que combinam elegância, conforto e durabilidade para a rotina exigente.',
  },
  'jaleco-salvador': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Salvador_BA_%28cropped%29_2.jpg/1280px-Salvador_BA_%28cropped%29_2.jpg',
    nome: 'Salvador',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Salvador',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Salvador entregue com rastreamento para toda a Bahia: do HUPES (Hospital das Clínicas) às clínicas do Corredor da Vitória e do Itaigara, médicas e dentistas escolhem a Jaleca pelo jaleco que suporta o calor baiano — tecido leve com elastano, corte acinturado do PP ao G3. Compre online e receba em Salvador em até 7 dias úteis.',
    keywordsExtra: 'loja de jaleco em salvador, jaleco salvador, jalecos salvador, jaleco feminino salvador, jaleco bahia',
    metaTitle: 'Jaleco em Salvador BA: Tecido Leve pro Calor | 4.9★ | Jaleca',
    metaDescription: 'Jaleco em Salvador com tecido leve e elastano que aguenta o calor baiano. Modelos Slim, Princesa e Scrub do PP ao G3. Entrega rastreada em até 7 dias úteis. 4.9★ por mais de 2.000 clientes.',
  },
  'jaleco-fortaleza': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Fortaleza%2C_Brazil_%284%29_%28cropped%29.jpg',
    nome: 'Fortaleza',
    estado: 'Ceará',
    uf: 'CE',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Fortaleza',
    freteGratis: false,
    conteudoLocal: 'Em Fortaleza, polo de saúde do Nordeste, do Hospital Geral de Fortaleza ao HU Walter Cantídio e às clínicas da Aldeota, a Jaleca entrega jalecos com tecido premium e design moderno para médicas e enfermeiras que exigem o melhor.',
  },
  'jaleco-manaus': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Manaus_amazonas.jpg/1280px-Manaus_amazonas.jpg',
    nome: 'Manaus',
    estado: 'Amazonas',
    uf: 'AM',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Manaus',
    freteGratis: false,
    conteudoLocal: 'Em Manaus, capital da Amazônia, do Hospital Universitário Getúlio Vargas ao FMT-HVD e HPS 28 de Agosto, profissionais de saúde encontram na Jaleca jalecos de alta qualidade com entrega rápida para toda a cidade.',
  },
  'jaleco-recife': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Antonio_Vaz_island_-_Recife%2C_Pernambuco%2C_Brazil_%28cropped%29.jpg/1280px-Antonio_Vaz_island_-_Recife%2C_Pernambuco%2C_Brazil_%28cropped%29.jpg',
    nome: 'Recife',
    estado: 'Pernambuco',
    uf: 'PE',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Recife',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Recife para médicas e dentistas: do HCFMUPE ao Real Hospital Português, das clínicas da Boa Viagem ao Imip, a Jaleca entrega jaleco que respira no calor pernambucano e mantém o corte acinturado após horas de uso. Tecido leve com elastano bidirecional, grade completa do PP ao G3. Entrega rastreada pra toda a Região Metropolitana do Recife em até 7 dias úteis.',
    keywordsExtra: 'jaleco recife, jalecos recife, jaleco feminino recife, jaleco pernambuco',
  },
  'jaleco-belem': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/L1010748-L1010765_copie_%28cropped%29.jpg/1280px-L1010748-L1010765_copie_%28cropped%29.jpg',
    nome: 'Belém',
    estado: 'Pará',
    uf: 'PA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Belém',
    freteGratis: false,
    conteudoLocal: 'Em Belém, capital do Pará, do Hospital Universitário João de Barros Barreto ao Santa Casa de Misericórdia, a Jaleca fornece jalecos profissionais com tecido de qualidade e corte elegante para os profissionais de saúde paraenses.',
  },
  'jaleco-guarulhos': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Vista_da_cidade_de_Guarulhos_%28SP%29.JPG',
    nome: 'Guarulhos',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Guarulhos',
    freteGratis: true,
    conteudoLocal: 'Em Guarulhos, segunda maior cidade paulista, do Hospital Municipal de Urgências ao Pronto-Socorro Central, profissionais de saúde contam com a Jaleca para jalecos premium com frete grátis para SP nas compras acima de R$499.',
  },
  'jaleco-sao-luis': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/80/S%C3%A3o_Lu%C3%ADs_A%C3%A9rea_%28cropped%29.jpg',
    nome: 'São Luís',
    estado: 'Maranhão',
    uf: 'MA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São Luís',
    freteGratis: false,
    conteudoLocal: 'Em São Luís, capital do Maranhão, do HUUFMA ao Hospital Presidente Vargas e às clínicas do Renascença, profissionais de saúde encontram na Jaleca jalecos com qualidade superior e entrega ágil para toda a ilha.',
  },
  'jaleco-maceio': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Ponta_Verde_Lighthouse_landscape_-_Macei%C3%B3%2C_Brazil_%28edited%29.jpg/1280px-Ponta_Verde_Lighthouse_landscape_-_Macei%C3%B3%2C_Brazil_%28edited%29.jpg',
    nome: 'Maceió',
    estado: 'Alagoas',
    uf: 'AL',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Maceió',
    freteGratis: false,
    conteudoLocal: 'Em Maceió, cidade litorânea com calor constante, profissionais do HU da UFAL e das clínicas da Pajuçara precisam de jaleco que respire. A Jaleca entrega pra todo o AL — tecido leve, costura que dura.',
  },
  'jaleco-natal': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Natal%2C_capital_do_Rio_Grande_do_Norte%2C_Brasil.jpg/1280px-Natal%2C_capital_do_Rio_Grande_do_Norte%2C_Brasil.jpg',
    nome: 'Natal',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Natal',
    freteGratis: false,
    conteudoLocal: 'Em Natal, capital potiguar, do Hospital Walfredo Gurgel ao HU Onofre Lopes da UFRN e às clínicas de Ponta Negra, profissionais de saúde escolhem a Jaleca por jalecos com tecido premium e design moderno.',
  },
  'jaleco-teresina': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ponte_Estaiada_-_Teresina.jpg/1280px-Ponte_Estaiada_-_Teresina.jpg',
    nome: 'Teresina',
    estado: 'Piauí',
    uf: 'PI',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Teresina',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Teresina para profissionais de saúde: do Hospital Getúlio Vargas ao HU da UFPI e às clínicas da zona leste, a Jaleca entrega jalecos e scrubs com tecido que suporta o calor piauiense. Grade completa do PP ao G3, entrega rastreada em até 7 dias úteis.',
    keywordsExtra: 'scrubs teresina, jaleco teresina, jalecos teresina, scrub feminino teresina, jaleco piauí',
  },
  'jaleco-joao-pessoa': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Centro_Hist%C3%B3rico_de_Jo%C3%A3o_Pessoa.jpg/1280px-Centro_Hist%C3%B3rico_de_Jo%C3%A3o_Pessoa.jpg',
    nome: 'João Pessoa',
    estado: 'Paraíba',
    uf: 'PB',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de João Pessoa',
    freteGratis: false,
    conteudoLocal: 'Em João Pessoa, capital da Paraíba, do Hospital Universitário Lauro Wanderley ao Instituto de Medicina Integral Professor Fernando Figueira, a Jaleca entrega jalecos profissionais com qualidade e design para os profissionais de saúde pessoenses.',
  },
  'jaleco-ribeirao-preto': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Vista_a%C3%A9rea_Ribeir%C3%A3o_Preto_2025.jpg',
    nome: 'Ribeirão Preto',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Ribeirão Preto',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Ribeirão Preto, um dos maiores polos médicos do interior do Brasil: profissionais do HCRP da USP, do Hospital das Clínicas e das clínicas do Jardim Sumaré encontram na Jaleca jalecos premium com frete grátis para SP acima de R$499.',
  },
  'jaleco-sao-jose-dos-campos': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/38/SJos%C3%A9Campos.jpg',
    nome: 'São José dos Campos',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São José dos Campos',
    freteGratis: true,
    conteudoLocal: 'Em São José dos Campos, polo tecnológico e de saúde do Vale do Paraíba, do Hospital Regional ao CRS José Alencar, profissionais de saúde escolhem a Jaleca por jalecos que unem qualidade, conforto e elegância.',
  },
  'jaleco-uberlandia': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CentrosulUdi2.jpg/3840px-CentrosulUdi2.jpg',
    nome: 'Uberlândia',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Uberlândia',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Uberlândia, o maior polo de saúde do Triângulo Mineiro: profissionais do Hospital de Clínicas da UFU, da Santa Casa e das clínicas do Bairro Brasil encontram na Jaleca jalecos com tecido premium e corte moderno. Frete grátis pra MG acima de R$499.',
  },
  'jaleco-juiz-de-fora': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Catedral_de_Ju%C3%ADz_de_Fora.jpg',
    nome: 'Juiz de Fora',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Juiz de Fora',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Juiz de Fora, o maior polo de saúde da Zona da Mata Mineira: profissionais do Hospital Universitário da UFJF, do Santa Casa e das clínicas do Bairro São Mateus encontram na Jaleca jalecos com tecido premium e frete grátis para MG acima de R$499.',
  },
  'jaleco-betim': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Betim_vista_do_alto.jpg',
    nome: 'Betim',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Betim',
    freteGratis: true,
    conteudoLocal: 'Em Betim, na Grande BH, profissionais de saúde do Hospital Municipal e das clínicas da cidade contam com a Jaleca para jalecos de alta qualidade com entrega rápida e frete grátis para MG acima de R$499.',
  },
  'jaleco-sete-lagoas': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Sete_Lagoas%2C_Minas_Gerais_-2.jpg',
    nome: 'Sete Lagoas',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Sete Lagoas',
    freteGratis: true,
    conteudoLocal: 'Em Sete Lagoas, polo regional de saúde no centro de MG, profissionais do Hospital Nossa Senhora das Graças e das clínicas da Avenida Getúlio Vargas escolhem a Jaleca pelo jaleco que não perde a forma. Frete grátis pra MG acima de R$499.',
  },
  'jaleco-divinopolis': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Catedral_de_Divin%C3%B3polis_-_MG_-_panoramio.jpg',
    nome: 'Divinópolis',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Divinópolis',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Divinópolis, referência em saúde no Centro-Oeste de Minas: profissionais do Hospital São João de Deus e das clínicas da cidade escolhem a Jaleca por jalecos que aliam design moderno, conforto e frete grátis para MG acima de R$499.',
  },
  'jaleco-pocos-de-caldas': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Po%C3%A7os_de_Caldas_-_Serra.jpg',
    nome: 'Poços de Caldas',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Poços de Caldas',
    freteGratis: true,
    conteudoLocal: 'Em Poços de Caldas, cidade conhecida pelo turismo de saúde e bem-estar no Sul de Minas, profissionais do Hospital Dr. José Valverde e das clínicas locais encontram na Jaleca jalecos premium com entrega rápida.',
  },
  'jaleco-patos-de-minas': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Patos-de-Minas-MG.jpg/1280px-Patos-de-Minas-MG.jpg',
    nome: 'Patos de Minas',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Patos de Minas',
    freteGratis: true,
    conteudoLocal: 'Em Patos de Minas, principal polo de saúde do Alto Paranaíba, do Hospital de Clínicas às clínicas da região, profissionais de saúde contam com a Jaleca para jalecos com qualidade superior e frete grátis para MG acima de R$499.',
  },
  'jaleco-pouso-alegre': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Pouso_Alegre_72.jpg',
    nome: 'Pouso Alegre',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Pouso Alegre',
    freteGratis: true,
    conteudoLocal: 'Em Pouso Alegre, polo médico do Sul de Minas, do Hospital das Clínicas Samuel Libânio às clínicas da cidade, a Jaleca veste profissionais de saúde com jalecos de tecido premium e corte elegante.',
  },
  'jaleco-varginha': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Varginha%2C_MG.jpg',
    nome: 'Varginha',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Varginha',
    freteGratis: true,
    conteudoLocal: 'Em Varginha, no coração do Sul de Minas, do Hospital Bom Pastor às clínicas da Avenida Rui Barbosa, profissionais de saúde escolhem a Jaleca por jalecos que combinam elegância, durabilidade e entrega rápida.',
  },
  'jaleco-barbacena': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Pra%C3%A7a_dos_Andradas_com_igreja.jpg',
    nome: 'Barbacena',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Barbacena',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Barbacena, polo de saúde e ensino médico em MG com a Faculdade de Medicina da UNIPAC: profissionais de saúde da cidade contam com a Jaleca pra jaleco que dura e não perde o corte. Frete grátis pra MG acima de R$499.',
  },
  // MG — ex-franquia / demanda confirmada
  'jaleco-ipatinga': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Vista_parcial_de_Ipatinga_MG_a_partir_do_Morro_do_C3.JPG',
    nome: 'Ipatinga',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Ipatinga',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Ipatinga, no Vale do Aço mineiro, uma das cidades de maior renda per capita de MG: profissionais do Hospital Márcio Cunha e das clínicas do Bairro Cidade Nobre encontram na Jaleca jalecos premium com frete grátis para MG acima de R$499.',
  },
  // Capitais brasileiras restantes
  'jaleco-cuiaba': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Cuiab%C3%A1_center.jpg/1280px-Cuiab%C3%A1_center.jpg',
    nome: 'Cuiabá',
    estado: 'Mato Grosso',
    uf: 'MT',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Cuiabá',
    freteGratis: false,
    conteudoLocal: 'Em Cuiabá, capital do Mato Grosso e porta de entrada para o Pantanal, do Hospital Universitário Júlio Müller às clínicas do Bosque da Saúde, profissionais de saúde encontram na Jaleca jalecos com qualidade e entrega rápida.',
  },
  'jaleco-aracaju': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Ponte_tobias_barreto2.jpg/1280px-Ponte_tobias_barreto2.jpg',
    nome: 'Aracaju',
    estado: 'Sergipe',
    uf: 'SE',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Aracaju',
    freteGratis: false,
    conteudoLocal: 'Em Aracaju, capital sergipana com forte polo de saúde, profissionais do HU da UFS e das clínicas da Atalaia escolhem a Jaleca pelo tecido que respira no calor nordestino. Entrega rastreada pra todo o Sergipe.',
  },
  'jaleco-porto-velho': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/SILVAJUNIOR_MUSEU_PALACIO_DA_MEMORIA_RONDONIENSE_PORTO_VELHO_RO_%2840036370975%29.jpg/1280px-SILVAJUNIOR_MUSEU_PALACIO_DA_MEMORIA_RONDONIENSE_PORTO_VELHO_RO_%2840036370975%29.jpg',
    nome: 'Porto Velho',
    estado: 'Rondônia',
    uf: 'RO',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Porto Velho',
    freteGratis: false,
    conteudoLocal: 'Em Porto Velho, capital de Rondônia, do Hospital de Base ao Cemetron e às clínicas da cidade, profissionais de saúde contam com a Jaleca para jalecos de alta qualidade com entrega para todo o estado.',
  },
  'jaleco-macapa': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Orla_de_Macap%C3%A1%2C_Amap%C3%A1.jpg/1280px-Orla_de_Macap%C3%A1%2C_Amap%C3%A1.jpg',
    nome: 'Macapá',
    estado: 'Amapá',
    uf: 'AP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Macapá',
    freteGratis: false,
    conteudoLocal: 'Em Macapá, capital do Amapá às margens do Rio Amazonas, do Hospital de Emergências ao HU da UNIFAP, profissionais de saúde encontram na Jaleca jalecos premium com entrega ágil para a capital amapaense.',
  },
  'jaleco-boa-vista': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Centro_c%C3%ADvico_de_Boa_Vista%2C_RR_%28cropped%29.jpg/1280px-Centro_c%C3%ADvico_de_Boa_Vista%2C_RR_%28cropped%29.jpg',
    nome: 'Boa Vista',
    estado: 'Roraima',
    uf: 'RR',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Boa Vista',
    freteGratis: false,
    conteudoLocal: 'Em Boa Vista, capital de Roraima e cidade mais ao norte do Brasil, do Hospital Geral de Roraima às clínicas da cidade, profissionais de saúde escolhem a Jaleca por jalecos com qualidade e entrega para toda a região.',
  },
  'jaleco-rio-branco': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Marcos_Vicentti_Rio_Acre_Rio_Branco_AC_%2840821853872%29.jpg',
    nome: 'Rio Branco',
    estado: 'Acre',
    uf: 'AC',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Rio Branco',
    freteGratis: false,
    conteudoLocal: 'Em Rio Branco, capital do Acre na fronteira da Amazônia, do Hospital das Clínicas ao Instituto de Traumatologia, profissionais de saúde encontram na Jaleca jalecos profissionais com entrega rápida para toda a capital acreana.',
  },
  'jaleco-palmas': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Palmas-TO.jpg',
    nome: 'Palmas',
    estado: 'Tocantins',
    uf: 'TO',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Palmas',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Palmas, a mais jovem capital do Brasil no coração do Tocantins: com um setor de saúde em rápida expansão, profissionais do HGP e das clínicas da cidade encontram na Jaleca jalecos modernos com entrega ágil.',
  },
  // SP interior
  'jaleco-sorocaba': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Torre_da_Catedral_de_Sorocaba_vista_do_fundo.jpg',
    nome: 'Sorocaba',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Sorocaba',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Sorocaba, polo industrial e de saúde do interior paulista: o Hospital Regional e diversas clínicas especializadas da cidade têm profissionais que escolhem a Jaleca por jalecos premium com frete grátis para SP acima de R$499.',
  },
  'jaleco-sao-jose-do-rio-preto': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Vista_A%C3%A9rea_de_S%C3%A3o_Jos%C3%A9_do_Rio_Preto.jpg/3840px-Vista_A%C3%A9rea_de_S%C3%A3o_Jos%C3%A9_do_Rio_Preto.jpg',
    nome: 'São José do Rio Preto',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São José do Rio Preto',
    freteGratis: true,
    conteudoLocal: 'Jaleco em São José do Rio Preto, referência em saúde no interior paulista: o Hospital de Base e a FUNFARME atendem toda a região Noroeste de SP. A Jaleca entrega jalecos premium para profissionais da cidade com frete grátis acima de R$499.',
  },
  'jaleco-santos': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Ponta_da_Praia2.jpg',
    nome: 'Santos',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Santos',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Santos, maior porto da América Latina e polo de saúde da Baixada Santista: do Hospital Guilherme Álvaro às clínicas da Orla, a Jaleca entrega jalecos de qualidade com frete grátis para SP acima de R$499.',
  },
  'jaleco-jundiai': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Serra_do_Japi.JPG',
    nome: 'Jundiaí',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Jundiaí',
    freteGratis: true,
    conteudoLocal: 'Em Jundiaí, uma das cidades com maior IDH do interior paulista, profissionais de saúde do Hospital São Vicente e das clínicas da cidade encontram na Jaleca jalecos com design elegante e frete grátis para SP acima de R$499.',
  },
  'jaleco-bauru': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Bauru_SaoPaulo_Brasil.jpg',
    nome: 'Bauru',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Bauru',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Bauru, polo educacional do centro-oeste paulista com a Faculdade de Odontologia da UNESP: referência na área de saúde, profissionais do Hospital de Base e das clínicas locais contam com a Jaleca pra jaleco que aguenta a semana inteira. Frete grátis pra SP acima de R$499.',
  },
  // Sul
  'jaleco-joinville': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Rua_das_Palmeiras%2C_Joinville.jpg',
    nome: 'Joinville',
    estado: 'Santa Catarina',
    uf: 'SC',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Joinville',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Joinville, maior cidade de Santa Catarina e polo industrial do Sul: o Hospital Regional Hans Dieter Schmidt e diversas clínicas de alto padrão têm profissionais que encontram na Jaleca jalecos premium com entrega rápida.',
  },
  'jaleco-caxias-do-sul': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Casa_de_pedra.jpg',
    nome: 'Caxias do Sul',
    estado: 'Rio Grande do Sul',
    uf: 'RS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Caxias do Sul',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Caxias do Sul, segunda maior cidade gaúcha e polo industrial da Serra Gaúcha: o Hospital Geral e diversas clínicas especializadas têm profissionais que a Jaleca veste com jalecos de tecido premium e corte moderno.',
  },
  'jaleco-maringa': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Maring%C3%A1_City.jpg',
    nome: 'Maringá',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Maringá',
    freteGratis: false,
    conteudoLocal: 'Em Maringá, uma das cidades mais planejadas do Brasil, profissionais do Hospital Universitário e das clínicas da Zona 7 escolhem a Jaleca pelo jaleco que fica bem o dia inteiro. Entrega via PAC e SEDEX pra todo o norte do Paraná.',
  },
  'jaleco-ponta-grossa': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Ponta_Grossa_2019_%28cropped%29.jpg/3840px-Ponta_Grossa_2019_%28cropped%29.jpg',
    nome: 'Ponta Grossa',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Ponta Grossa',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Ponta Grossa, polo regional dos Campos Gerais no Paraná: do Hospital Universitário ao São Lucas, profissionais de saúde encontram na Jaleca jalecos com tecido de qualidade e design que transmite profissionalismo.',
  },
  'jaleco-blumenau': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Foto_a%C3%A9rea_Blumenau.jpg',
    nome: 'Blumenau',
    estado: 'Santa Catarina',
    uf: 'SC',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Blumenau',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Blumenau, polo têxtil e tecnológico de SC com forte setor de saúde: do Hospital Santo Antônio às clínicas do Centro, a Jaleca entrega jalecos premium para profissionais que buscam qualidade e elegância no dia a dia.',
  },
  // RJ interior
  'jaleco-niteroi': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/31/MAC_Niter%C3%B3i_-_Glauber_Silveira.jpg',
    nome: 'Niterói',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Niterói',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Niterói com frete grátis para RJ: do Hospital Universitário Antônio Pedro às clínicas de Icaraí e do Centro, profissionais de saúde encontram na Jaleca jalecos que ficam bem mesmo depois de horas de uso. Frete grátis nas compras acima de R$499.',
  },
  'jaleco-campos-dos-goytacazes': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Montagem_de_Campos_dos_Goytacazes-RJ_2.jpeg',
    nome: 'Campos dos Goytacazes',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Campos dos Goytacazes',
    freteGratis: true,
    conteudoLocal: 'Jaleco em Campos dos Goytacazes, maior cidade do interior fluminense e polo de petróleo: o Hospital Ferreira Machado e diversas clínicas especializadas têm profissionais atendidos pela Jaleca com jalecos premium e frete grátis para RJ acima de R$499.',
  },
  // Nordeste interior
  'jaleco-feira-de-santana': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Urban_landscapes_of_Feira_de_Santana_02.jpg',
    nome: 'Feira de Santana',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Feira de Santana',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Feira de Santana, segunda maior cidade da Bahia e principal entroncamento rodoviário do Nordeste: do Hospital da Mulher ao HGCA, referência regional em saúde, a Jaleca atende profissionais com jalecos de alto padrão e entrega rápida.',
  },
  'jaleco-campina-grande': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/A%C3%A7ude_Velho_Campina_Grande_PB_-_40175999034.jpg/1280px-A%C3%A7ude_Velho_Campina_Grande_PB_-_40175999034.jpg',
    nome: 'Campina Grande',
    estado: 'Paraíba',
    uf: 'PB',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Campina Grande',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Campina Grande, polo tecnológico e de saúde do interior paraibano com a UFCG e o Hospital Universitário Alcides Carneiro: referência no sertão nordestino, a Jaleca entrega jalecos profissionais com qualidade para os profissionais da cidade.',
  },
  'jaleco-mossoro': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Apr2024._Mossor%C3%B3%2C_state_of_Rio_Grande_do_Norte%2C_Brazil_04.jpg',
    nome: 'Mossoró',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Mossoró',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Mossoró, segunda maior cidade do RN e polo de saúde do interior potiguar: do Hospital Wilson Rosado às clínicas da cidade, profissionais encontram na Jaleca jalecos com qualidade e entrega para toda a região.',
  },
  // GO interior
  'jaleco-anapolis': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Parque_Ambiental_Ipiranga%2C_An%C3%A1polis%2C_2022.jpg/3840px-Parque_Ambiental_Ipiranga%2C_An%C3%A1polis%2C_2022.jpg',
    nome: 'Anápolis',
    estado: 'Goiás',
    uf: 'GO',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Anápolis',
    freteGratis: false,
    conteudoLocal: 'Jaleco em Anápolis, terceira maior cidade de Goiás e polo farmacêutico do Brasil: do Hospital Evangélico às clínicas do setor Sul, profissionais de saúde escolhem a Jaleca por jalecos que aliam qualidade, conforto e design moderno.',
  },
}

// Cidades com tráfego real (≥1 clique OU ≥50 impressões — GSC auditado 2026-04-30)
const CIDADES_INDEXADAS = new Set([
  // lojas físicas
  'jaleco-ipatinga', 'jaleco-belo-horizonte', 'jaleco-colatina', 'jaleco-contagem',
  // cidades com cliques reais nos últimos 90 dias
  'jaleco-joinville', 'jaleco-curitiba', 'jaleco-marilia', 'jaleco-salvador',
  'jaleco-cuiaba', 'jaleco-montes-claros', 'jaleco-palmas', 'jaleco-florianopolis',
  'jaleco-bauru', 'jaleco-campos-dos-goytacazes', 'jaleco-caxias-do-sul',
  'jaleco-joao-monlevade', 'jaleco-jundiai', 'jaleco-natal', 'jaleco-ponta-grossa',
  'jaleco-porto-velho', 'jaleco-recife', 'jaleco-anapolis', 'jaleco-barbacena',
  'jaleco-blumenau', 'jaleco-boa-vista', 'jaleco-campinas', 'jaleco-divinopolis',
  'jaleco-feira-de-santana', 'jaleco-fortaleza', 'jaleco-juiz-de-fora',
  'jaleco-lagoa-santa', 'jaleco-londrina', 'jaleco-manaus', 'jaleco-maringa',
  'jaleco-muriae', 'jaleco-patos-de-minas', 'jaleco-porto-alegre', 'jaleco-pouso-alegre',
  'jaleco-sao-jose-do-rio-preto', 'jaleco-sao-luis', 'jaleco-sorocaba',
  'jaleco-uberaba', 'jaleco-vitoria-da-conquista',
  // 0 cliques mas ≥50 impressões (potencial real)
  'jaleco-betim', 'jaleco-macapa', 'jaleco-santos', 'jaleco-cachoeiro-de-itapemirim',
])

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cidade = CIDADES[slug]
  if (!cidade) return { title: 'Página não encontrada' }

  const title = cidade.metaTitle ?? `Jaleco em ${cidade.nome}: Feminino, Masculino e Scrub — Jaleca`
  const description = cidade.metaDescription ?? `Compre jalecos femininos e masculinos em ${cidade.nome}, ${cidade.estado}. Modelos Slim, Princesa e Scrub para médicas, dentistas e enfermeiras. Frete rápido para ${cidade.nome} — Jaleca.`

  return {
    title,
    description,
    ...(CIDADES_INDEXADAS.has(slug) ? {} : { robots: { index: false, follow: false } }),
    keywords: `jaleco ${cidade.nome.toLowerCase()}, jaleca ${cidade.nome.toLowerCase()}, jaleco ${cidade.uf.toLowerCase()}, jaleco feminino ${cidade.nome.toLowerCase()}, jaleco médico ${cidade.nome.toLowerCase()}, comprar jaleco ${cidade.nome.toLowerCase()}, uniforme saúde ${cidade.nome.toLowerCase()}${cidade.keywordsExtra ? ', ' + cidade.keywordsExtra : ''}`,
    alternates: { canonical: `https://jaleca.com.br/cidade/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://jaleca.com.br/cidade/${slug}`,
      siteName: 'Jaleca',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: `Jaleco em ${cidade.nome}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}


export default async function CidadePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cidade = CIDADES[slug]
  if (!cidade) notFound()

  const [products, posts] = await Promise.all([
    getAllProducts(),
    getPosts({ per_page: 3, search: 'jaleco' }).catch(() => [] as WPPost[]),
  ])
  const heroImage = cidade.heroUrl ?? null

  const faq = FAQ_TEMPLATE(cidade.nome, cidade.estado)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://jaleca.com.br/produtos' },
      { '@type': 'ListItem', position: 3, name: `Jaleco em ${cidade.nome}`, item: `https://jaleca.com.br/cidade/${slug}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(({ pergunta, resposta }) => ({
      '@type': 'Question',
      name: pergunta,
      acceptedAnswer: { '@type': 'Answer', text: resposta },
    })),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[itemprop="name"]', '[itemprop="acceptedAnswer"]'],
    },
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Jalecos em ${cidade.nome}`,
    url: `https://jaleca.com.br/cidade/${slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '[data-speakable]'],
    },
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Jaleca',
    url: `https://jaleca.com.br/cidade/${slug}`,
    logo: 'https://jaleca.com.br/logo-cropped.jpg',
    image: 'https://jaleca.com.br/og-home.jpg',
    telephone: '+553134461777',
    description: `Uniformes profissionais com entrega em ${cidade.nome}. Jalecos, dólmãs e conjuntos para ${cidade.profissoes}.`,
    areaServed: {
      '@type': 'City',
      name: cidade.nome,
      containedInPlace: {
        '@type': 'State',
        name: cidade.estado,
      },
    },
    sameAs: [
      'https://www.instagram.com/jalecaa/',
      'https://www.facebook.com/jalecaa/',
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />

      {/* Hero */}
      <section
        className="relative text-white py-20 px-4"
        style={
          heroImage
            ? {
                backgroundImage: `url(${heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1a1a1a',
              }
            : { backgroundColor: '#1a1a1a' }
        }
      >
        {heroImage && (
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        )}
        <div className="container max-w-3xl text-center relative z-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/60 mb-3">
            Entregamos em {cidade.nome} — {cidade.uf}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4 drop-shadow-md">
            Jaleco em {cidade.nome}
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8 drop-shadow">
            Jalecos, dólmãs e conjuntos profissionais para {cidade.profissoes}.
            Qualidade premium, entrega rápida, troca garantida.
          </p>
          <Link
            href="#produtos"
            className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-white/90 transition-all"
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b border-border bg-secondary/30 py-5">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-foreground" />
              <span>{cidade.freteGratis ? `Frete Grátis acima de R$499 para ${cidade.nome}` : `Entrega para ${cidade.nome}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-foreground" />
              <span>Devolução em 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-foreground" />
              <span>Compra 100% segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-foreground" />
              <span>4.9 ★ no Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-semibold mb-2">
              Nossos Produtos
            </h2>
            <p className="text-muted-foreground">
              Enviamos para {cidade.nome} via PAC, SEDEX e Jadlog
            </p>
          </div>
          <ProductsClient products={products} initialCat="Todos" />
        </div>
      </section>

      {/* ── CTA 200k ── */}
      <section className="bg-secondary/30 py-16 px-4 text-center relative overflow-hidden">
        <span aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(5rem,18vw,16rem)] font-light text-foreground/[0.03] whitespace-nowrap pointer-events-none select-none">
          JALECA
        </span>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-3">200.000+ peças vendidas</p>
          <h2 className="font-display text-4xl md:text-5xl font-normal leading-tight mb-4">
            O jaleco certo<br /><em className="italic font-light">faz a diferença</em>
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-md mx-auto">
            Enviamos para {cidade.nome} com rastreamento completo. Troca grátis em 30 dias.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-ink text-background px-7 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all">
              Ver Coleção Feminina
            </Link>
            <Link href="/categoria/jalecos-masculinos" className="inline-flex items-center gap-2 border border-ink text-ink px-7 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink hover:text-background transition-all">
              Ver Coleção Masculina
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPLORE A COLEÇÃO ── */}
      <section className="py-10 px-4 border-t border-border" style={{ background: '#fff' }}>
        <div className="container max-w-3xl text-center">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-3">Explore a coleção</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/jaleco-feminino" className="text-sm px-4 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-white transition">→ Jaleco feminino</Link>
            <Link href="/jaleco-masculino" className="text-sm px-4 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-white transition">→ Jaleco masculino</Link>
            <Link href="/jaleco" className="text-sm px-4 py-2 border border-border text-muted-foreground hover:text-foreground transition">→ Visão geral</Link>
          </div>
        </div>
      </section>

      {/* ── CLIENTES USANDO (UGC) ── */}
      <UGCSection />

      {/* ── BLOG ── */}
      <section className="py-14 px-4" style={{ background: '#f9f7f4' }}>
        <div className="container max-w-5xl">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground mb-2">Blog Jaleca</p>
          <h2 className="font-display text-3xl font-normal mb-10">
            Leitura para<br /><em className="italic font-light">profissionais</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {(posts.length > 0 ? posts : [
              { id: 1, slug: 'como-lavar-jaleco', title: { rendered: 'Como lavar e conservar seu jaleco' }, excerpt: { rendered: 'Erros simples de lavagem aceleram o amarelamento. Veja o guia completo.' }, _embedded: undefined },
              { id: 2, slug: '', title: { rendered: 'Jaleco branco: tradição profissional' }, excerpt: { rendered: 'Por que o branco domina as profissões de saúde.' }, _embedded: undefined },
              { id: 3, slug: 'medidas', title: { rendered: 'Como escolher o tamanho certo' }, excerpt: { rendered: 'Passo a passo para encontrar o tamanho ideal.' }, _embedded: undefined },
            ] as WPPost[]).map(post => {
              const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
              const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 110) + '…'
              const title = post.title.rendered.replace(/<[^>]+>/g, '')
              const href = post.slug ? `/blog/${post.slug}` : '/blog'
              return (
                <Link key={post.id} href={href} className="block bg-background text-foreground no-underline hover:bg-secondary/20 transition-colors">
                  {img ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={img} alt={title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-secondary/40 flex items-center justify-center">
                      <span className="font-display italic text-muted-foreground text-sm">Jaleca</span>
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">Blog</span>
                    <h3 className="font-display text-lg font-normal leading-snug mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">{excerpt}</p>
                    <span className="text-xs tracking-wider uppercase">Ler artigo →</span>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="text-center mt-6">
            <Link href="/blog" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors">
              Ver todos os artigos →
            </Link>
          </div>
        </div>
      </section>

      {/* Conteúdo local */}
      {cidade.conteudoLocal && (
        <section className="py-10 px-4">
          <div className="container max-w-2xl text-center">
            <p className="text-muted-foreground leading-relaxed">{cidade.conteudoLocal}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Veja a coleção completa de{' '}
              <a href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline">
                jaleco feminino em {cidade.nome}
              </a>{' '}
              com entrega para todo o Brasil.
            </p>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-secondary/30 py-12 px-4">
        <div className="container max-w-2xl">
          <h2 className="font-display text-2xl font-semibold mb-8 text-center">
            Dúvidas sobre entrega em {cidade.nome}
          </h2>
          <div className="space-y-4">
            {faq.map(({ pergunta, resposta }) => (
              <details key={pergunta} className="border border-border bg-background group">
                <summary className="px-5 py-4 cursor-pointer text-sm font-semibold list-none flex justify-between items-center gap-2">
                  {pergunta}
                  <span className="shrink-0 text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre entrega */}
      <section className="py-12 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Enviamos para {cidade.nome}
          </h2>
          <p className="text-muted-foreground mb-6">
            Todos os pedidos para {cidade.nome}, {cidade.estado}, são enviados com rastreamento completo.
            Prazo estimado de 3 a 7 dias úteis dependendo da modalidade de frete escolhida.
            {cidade.freteGratis && ' Frete grátis (PAC) para compras acima de R$499.'}{' '}
            Devolução em até 7 dias por arrependimento (CDC).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center gap-2 bg-ink text-background px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all"
            >
              Ver Todos os Produtos
            </Link>
            <Link
              href="/trocas-e-devolucoes"
              className="inline-flex items-center justify-center gap-2 border border-border px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-all"
            >
              Política de Troca
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import ProductsClient from '@/app/produtos/ProductsClient'
import type { WooProduct } from '@/components/ProductCard'
import type { Metadata } from 'next'
import { Truck, RotateCcw, ShieldCheck, Star } from 'lucide-react'
import { getAllProducts } from '@/lib/all-products'

type CidadeInfo = {
  nome: string
  estado: string
  uf: string
  tipo: 'fechada' | 'revenda' | 'propria'
  profissoes: string
  freteGratis?: boolean
  conteudoLocal?: string
  heroUrl?: string // URL direta da foto do ponto turístico (Unsplash)
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
]

const CIDADES: Record<string, CidadeInfo> = {
  'jaleco-belo-horizonte': {
    nome: 'Belo Horizonte',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de BH',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde em BH, do Mater Dei ao Santa Casa e as clínicas do Savassi, escolhem a Jaleca pelo tecido que não amassa e pelo corte que valoriza — seja no plantão ou no consultório particular. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Praca_do_Papa%2C_Belo_Horizonte_%28cropped%292.jpg',
  },
  'jaleco-campo-grande': {
    nome: 'Campo Grande',
    estado: 'Mato Grosso do Sul',
    uf: 'MS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Campo Grande',
    conteudoLocal: 'Em Campo Grande, onde o calor é constante boa parte do ano, o tecido do jaleco importa. A Jaleca tem opções leves e duráveis pra quem trabalha na Santa Casa, no Hospital Regional ou nas clínicas da Avenida Afonso Pena. Entrega rastreada pra todo o MS.',
    heroUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
  },
  'jaleco-vitoria': {
    nome: 'Vitória',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Vitória',
    freteGratis: true,
    conteudoLocal: 'Em Vitória, ES, profissionais do HUCAM e das clínicas da Praia do Canto precisam de jaleco que aguente o clima úmido da ilha e ainda fique bem depois de horas de uso. Tecido leve, corte moderno e frete grátis pra ES acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
  },
  'jaleco-barra-da-tijuca': {
    nome: 'Barra da Tijuca',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde da Barra da Tijuca',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde na Barra da Tijuca, atuando em clínicas renomadas ou no Hospital Barra D\'Or, encontram na Jaleca o jaleco feminino ideal que une estilo e conforto para sua rotina. Frete grátis pra RJ nas compras acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=80',
  },
  'jaleco-muriae': {
    nome: 'Muriaé',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Muriaé',
    freteGratis: true,
    conteudoLocal: 'Em Muriaé, no leste de Minas, profissionais de saúde do Hospital São Paulo e das clínicas da cidade contam com a Jaleca pra jaleco que aguenta o dia a dia — sem encolher, sem amolgar. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80',
  },
  'jaleco-marilia': {
    nome: 'Marília',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Marília',
    freteGratis: true,
    conteudoLocal: 'Em Marília, polo de saúde com o complexo FAMEMA e diversos hospitais, a Jaleca veste com excelência as profissionais que buscam jalecos femininos com qualidade e design superior. Frete grátis pra SP acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1400&q=80',
  },
  'jaleco-itabira': {
    nome: 'Itabira',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Itabira',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde em Itabira, do Hospital Nossa Senhora das Dores a outros centros, contam com a qualidade e o design dos jalecos femininos Jaleca para uma imagem impecável.',
    heroUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1400&q=80',
  },
  'jaleco-joao-monlevade': {
    nome: 'João Monlevade',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de João Monlevade',
    freteGratis: true,
    conteudoLocal: 'Para enfermeiras e médicas em João Monlevade, a Jaleca oferece jalecos femininos de alta qualidade, perfeitos para o Hospital Margarida e clínicas da região, unindo estilo e funcionalidade.',
    heroUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80',
  },
  'jaleco-lagoa-santa': {
    nome: 'Lagoa Santa',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Lagoa Santa',
    freteGratis: true,
    conteudoLocal: 'Em Lagoa Santa, cidade de clima seco e turismo científico perto da Grande BH, profissionais de saúde das clínicas locais contam com a Jaleca pra jaleco que não perde a forma e ainda fica bem. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80',
  },
  'jaleco-teixeira-de-freitas': {
    nome: 'Teixeira de Freitas',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas e profissionais de saúde de Teixeira de Freitas',
    conteudoLocal: 'Atendendo Teixeira de Freitas, a Jaleca oferece jalecos femininos profissionais para quem atua no Hospital Municipal ou nas diversas clínicas da cidade, com muito estilo e qualidade.',
    heroUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
  },
  'jaleco-curitiba': {
    nome: 'Curitiba',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Curitiba',
    conteudoLocal: 'Profissionais de Curitiba, do Hospital Marcelino Champagnat às clínicas do Batel, escolhem a Jaleca pelo jaleco que não murcha no frio do sul. Tecido encorpado, corte ajustado, entrega via PAC ou SEDEX pra todo o Paraná.',
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Estufa_principal_do_Jardim_Bot%C3%A2nico_de_Curitiba_02.jpg',
  },
  'jaleco-londrina': {
    nome: 'Londrina',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Londrina',
    conteudoLocal: 'Em Londrina, do HU ao Hospital da Zona Norte, a Jaleca atende profissionais de saúde do norte paranaense. Tecido que não desfia, costura que não cede, tamanhos de PP ao G3. Entrega rastreada pra todo o PR.',
    heroUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80',
  },
  'jaleco-governador-valadares': {
    nome: 'Governador Valadares',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Governador Valadares',
    freteGratis: true,
    conteudoLocal: 'Em Governador Valadares, maior cidade do Vale do Rio Doce, profissionais do Hospital Regional e das clínicas da cidade encontram na Jaleca jaleco que aguenta a rotina intensa. Entrega rastreada pra todo o Vale do Aço. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
  },
  'jaleco-uberaba': {
    nome: 'Uberaba',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Uberaba',
    freteGratis: true,
    conteudoLocal: 'Em Uberaba, polo da medicina veterinária e da saúde no Triângulo Mineiro, profissionais do HC da UFTM e do Hospital Mário Palmério encontram na Jaleca jaleco que cabe no dia corrido — leve, sem amolgar. Frete grátis pra MG acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80',
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
    heroUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
  },
  'jaleco-cachoeiro-de-itapemirim': {
    nome: 'Cachoeiro de Itapemirim',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Cachoeiro de Itapemirim',
    freteGratis: true,
    conteudoLocal: 'Em Cachoeiro de Itapemirim, profissionais da Santa Casa ou do Hospital Evangélico escolhem Jaleca para jalecos que unem design moderno e alta performance, essenciais no dia a dia.',
    heroUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80',
  },
  'jaleco-serra': {
    nome: 'Serra',
    estado: 'Espírito Santo',
    uf: 'ES',
    tipo: 'revenda',
    profissoes: 'médicos, dentistas e profissionais de saúde de Serra',
    freteGratis: true,
    conteudoLocal: 'Profissionais de saúde na Serra, do Hospital Jayme dos Santos Neves a outras unidades, encontram na Jaleca a qualidade e o estilo ideais para seus jalecos femininos, garantindo conforto e durabilidade.',
    heroUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1400&q=80',
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
    heroUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
  },
  'jaleco-contagem': {
    nome: 'Contagem',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Contagem',
    freteGratis: true,
    conteudoLocal: 'Em Contagem, MG, a segunda maior cidade do estado, a Jaleca entrega jalecos premium para médicas, dentistas e enfermeiras. Frete grátis para MG nas compras acima de R$499.',
    heroUrl: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1400&q=80',
  },
  'jaleco-sao-paulo': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Marginal_Pinheiros_e_Jockey_Club.jpg/1280px-Marginal_Pinheiros_e_Jockey_Club.jpg',
    nome: 'São Paulo',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São Paulo',
    freteGratis: true,
    conteudoLocal: 'São Paulo concentra o maior número de profissionais de saúde do Brasil. A Jaleca entrega jalecos premium para médicas, dentistas e enfermeiras da capital paulista com frete grátis para SP acima de R$499.',
  },
  'jaleco-rio-de-janeiro': {
    heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cidade_Maravilhosa.jpg/1280px-Cidade_Maravilhosa.jpg',
    nome: 'Rio de Janeiro',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde do Rio de Janeiro',
    freteGratis: true,
    conteudoLocal: 'No Rio de Janeiro, dos grandes hospitais às clínicas do Leblon, profissionais de saúde escolhem a Jaleca pela qualidade dos jalecos e entrega rápida. Frete grátis para RJ nas compras acima de R$499.',
  },
  'jaleco-campinas': {
    heroUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80',
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
    conteudoLocal: 'Goiânia é um dos maiores polos de saúde do Centro-Oeste. Profissionais do Hospital das Clínicas da UFG e dos centros médicos do Setor Bueno encontram na Jaleca jalecos com tecido premium, corte moderno e entrega rápida para toda a capital goiana.',
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
    conteudoLocal: 'Em Salvador, maior cidade do Nordeste, do HUPES (Hospital das Clínicas) às clínicas do Corredor da Vitória e do Itaigara, profissionais de saúde escolhem a Jaleca por jalecos premium que unem estilo e funcionalidade para a rotina baiana.',
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
    conteudoLocal: 'Em Recife, do HCFMUPE ao Real Hospital Português, profissionais de saúde escolhem a Jaleca pelo tecido que respira no calor pernambucano e pelo corte que valoriza. Entrega rastreada pra toda Região Metropolitana do Recife.',
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
    heroUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=80',
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
    conteudoLocal: 'Em Teresina, capital do Piauí e polo de saúde do Meio-Norte, do Hospital Getúlio Vargas ao HU da UFPI, profissionais de saúde encontram na Jaleca jalecos de alta qualidade com entrega para toda a cidade.',
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
    heroUrl: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1400&q=80',
    nome: 'Ribeirão Preto',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Ribeirão Preto',
    freteGratis: true,
    conteudoLocal: 'Ribeirão Preto é um dos maiores polos médicos do interior do Brasil. Profissionais do HCRP da USP, do Hospital das Clínicas e das clínicas do Jardim Sumaré encontram na Jaleca jalecos premium com frete grátis para SP acima de R$499.',
  },
  'jaleco-sao-jose-dos-campos': {
    heroUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80',
    nome: 'São José dos Campos',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São José dos Campos',
    freteGratis: true,
    conteudoLocal: 'Em São José dos Campos, polo tecnológico e de saúde do Vale do Paraíba, do Hospital Regional ao CRS José Alencar, profissionais de saúde escolhem a Jaleca por jalecos que unem qualidade, conforto e elegância.',
  },
  'jaleco-uberlandia': {
    heroUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1400&q=80',
    nome: 'Uberlândia',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Uberlândia',
    freteGratis: true,
    conteudoLocal: 'Uberlândia é o maior polo de saúde do Triângulo Mineiro. Profissionais do Hospital de Clínicas da UFU, da Santa Casa e das clínicas do Bairro Brasil encontram na Jaleca jalecos com tecido premium e corte moderno.',
  },
  'jaleco-juiz-de-fora': {
    heroUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80',
    nome: 'Juiz de Fora',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Juiz de Fora',
    freteGratis: true,
    conteudoLocal: 'Juiz de Fora é o maior polo de saúde da Zona da Mata Mineira. Profissionais do Hospital Universitário da UFJF, do Santa Casa e das clínicas do Bairro São Mateus encontram na Jaleca jalecos com tecido premium, frete grátis para MG acima de R$499.',
  },
  'jaleco-betim': {
    heroUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1400&q=80',
    nome: 'Betim',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Betim',
    freteGratis: true,
    conteudoLocal: 'Em Betim, na Grande BH, profissionais de saúde do Hospital Municipal e das clínicas da cidade contam com a Jaleca para jalecos de alta qualidade com entrega rápida e frete grátis para MG acima de R$499.',
  },
  'jaleco-sete-lagoas': {
    heroUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80',
    nome: 'Sete Lagoas',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Sete Lagoas',
    freteGratis: true,
    conteudoLocal: 'Em Sete Lagoas, polo regional de saúde no centro de MG, profissionais do Hospital Nossa Senhora das Graças e das clínicas da Avenida Getúlio Vargas escolhem a Jaleca pelo jaleco que não perde a forma. Frete grátis pra MG acima de R$499.',
  },
  'jaleco-divinopolis': {
    heroUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=80',
    nome: 'Divinópolis',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Divinópolis',
    freteGratis: true,
    conteudoLocal: 'Divinópolis é referência em saúde no Centro-Oeste de Minas. Profissionais do Hospital São João de Deus e das clínicas da cidade escolhem a Jaleca por jalecos que aliam design moderno, conforto e frete grátis para MG acima de R$499.',
  },
  'jaleco-pocos-de-caldas': {
    heroUrl: 'https://images.unsplash.com/photo-1473800447596-01729482b8eb?w=1400&q=80',
    nome: 'Poços de Caldas',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Poços de Caldas',
    freteGratis: true,
    conteudoLocal: 'Em Poços de Caldas, cidade conhecida pelo turismo de saúde e bem-estar no Sul de Minas, profissionais do Hospital Dr. José Valverde e das clínicas locais encontram na Jaleca jalecos premium com entrega rápida.',
  },
  'jaleco-patos-de-minas': {
    heroUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
    nome: 'Patos de Minas',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Patos de Minas',
    freteGratis: true,
    conteudoLocal: 'Em Patos de Minas, principal polo de saúde do Alto Paranaíba, do Hospital de Clínicas às clínicas da região, profissionais de saúde contam com a Jaleca para jalecos com qualidade superior e frete grátis para MG acima de R$499.',
  },
  'jaleco-pouso-alegre': {
    heroUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80',
    nome: 'Pouso Alegre',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Pouso Alegre',
    freteGratis: true,
    conteudoLocal: 'Em Pouso Alegre, polo médico do Sul de Minas, do Hospital das Clínicas Samuel Libânio às clínicas da cidade, a Jaleca veste profissionais de saúde com jalecos de tecido premium e corte elegante.',
  },
  'jaleco-varginha': {
    heroUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
    nome: 'Varginha',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Varginha',
    freteGratis: true,
    conteudoLocal: 'Em Varginha, no coração do Sul de Minas, do Hospital Bom Pastor às clínicas da Avenida Rui Barbosa, profissionais de saúde escolhem a Jaleca por jalecos que combinam elegância, durabilidade e entrega rápida.',
  },
  'jaleco-barbacena': {
    heroUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=80',
    nome: 'Barbacena',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Barbacena',
    freteGratis: true,
    conteudoLocal: 'Barbacena é polo de saúde e ensino médico em MG, com a Faculdade de Medicina da UNIPAC. Profissionais de saúde da cidade contam com a Jaleca pra jaleco que dura e não perde o corte. Frete grátis pra MG acima de R$499.',
  },
  // MG — ex-franquia / demanda confirmada
  'jaleco-ipatinga': {
    heroUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1400&q=80',
    nome: 'Ipatinga',
    estado: 'Minas Gerais',
    uf: 'MG',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Ipatinga',
    freteGratis: true,
    conteudoLocal: 'Ipatinga, no Vale do Aço mineiro, é uma das cidades de maior renda per capita de MG. Profissionais do Hospital Márcio Cunha e das clínicas do Bairro Cidade Nobre encontram na Jaleca jalecos premium com frete grátis para MG acima de R$499.',
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
    heroUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80',
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
    conteudoLocal: 'Palmas, a mais jovem capital do Brasil no coração do Tocantins, conta com um setor de saúde em rápida expansão. Profissionais do HGP e das clínicas da cidade encontram na Jaleca jalecos modernos com entrega ágil.',
  },
  // SP interior
  'jaleco-sorocaba': {
    heroUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80',
    nome: 'Sorocaba',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Sorocaba',
    freteGratis: true,
    conteudoLocal: 'Sorocaba, polo industrial e de saúde do interior paulista, conta com o Hospital Regional e diversas clínicas especializadas. Profissionais de saúde da cidade escolhem a Jaleca por jalecos premium com frete grátis para SP acima de R$499.',
  },
  'jaleco-sao-jose-do-rio-preto': {
    heroUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80',
    nome: 'São José do Rio Preto',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de São José do Rio Preto',
    freteGratis: true,
    conteudoLocal: 'São José do Rio Preto é referência em saúde no interior paulista, com o Hospital de Base e a FUNFARME atendendo toda a região Noroeste de SP. A Jaleca entrega jalecos premium para profissionais da cidade com frete grátis acima de R$499.',
  },
  'jaleco-santos': {
    heroUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',
    nome: 'Santos',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Santos',
    freteGratis: true,
    conteudoLocal: 'Santos, maior porto da América Latina e polo de saúde da Baixada Santista, do Hospital Guilherme Álvaro às clínicas da Orla, a Jaleca entrega jalecos de qualidade com frete grátis para SP acima de R$499.',
  },
  'jaleco-jundiai': {
    heroUrl: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1400&q=80',
    nome: 'Jundiaí',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Jundiaí',
    freteGratis: true,
    conteudoLocal: 'Em Jundiaí, uma das cidades com maior IDH do interior paulista, profissionais de saúde do Hospital São Vicente e das clínicas da cidade encontram na Jaleca jalecos com design elegante e frete grátis para SP acima de R$499.',
  },
  'jaleco-bauru': {
    heroUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1400&q=80',
    nome: 'Bauru',
    estado: 'São Paulo',
    uf: 'SP',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Bauru',
    freteGratis: true,
    conteudoLocal: 'Bauru, polo educacional do centro-oeste paulista com a Faculdade de Odontologia da UNESP, é referência na área de saúde. Profissionais do Hospital de Base e das clínicas locais contam com a Jaleca pra jaleco que aguenta a semana inteira. Frete grátis pra SP acima de R$499.',
  },
  // Sul
  'jaleco-joinville': {
    heroUrl: 'https://images.unsplash.com/photo-1473800447596-01729482b8eb?w=1400&q=80',
    nome: 'Joinville',
    estado: 'Santa Catarina',
    uf: 'SC',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Joinville',
    freteGratis: false,
    conteudoLocal: 'Joinville, maior cidade de Santa Catarina e polo industrial do Sul, conta com o Hospital Regional Hans Dieter Schmidt e diversas clínicas de alto padrão. Profissionais de saúde encontram na Jaleca jalecos premium com entrega rápida.',
  },
  'jaleco-caxias-do-sul': {
    heroUrl: 'https://images.unsplash.com/photo-1543832923-44667a44c804?w=1400&q=80',
    nome: 'Caxias do Sul',
    estado: 'Rio Grande do Sul',
    uf: 'RS',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Caxias do Sul',
    freteGratis: false,
    conteudoLocal: 'Caxias do Sul, segunda maior cidade gaúcha e polo industrial da Serra Gaúcha, conta com o Hospital Geral e diversas clínicas especializadas. A Jaleca veste profissionais de saúde com jalecos de tecido premium e corte moderno.',
  },
  'jaleco-maringa': {
    heroUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80',
    nome: 'Maringá',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Maringá',
    freteGratis: false,
    conteudoLocal: 'Em Maringá, uma das cidades mais planejadas do Brasil, profissionais do Hospital Universitário e das clínicas da Zona 7 escolhem a Jaleca pelo jaleco que fica bem o dia inteiro. Entrega via PAC e SEDEX pra todo o norte do Paraná.',
  },
  'jaleco-ponta-grossa': {
    heroUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80',
    nome: 'Ponta Grossa',
    estado: 'Paraná',
    uf: 'PR',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Ponta Grossa',
    freteGratis: false,
    conteudoLocal: 'Ponta Grossa, polo regional dos Campos Gerais no Paraná, do Hospital Universitário ao São Lucas, profissionais de saúde encontram na Jaleca jalecos com tecido de qualidade e design que transmite profissionalismo.',
  },
  'jaleco-blumenau': {
    heroUrl: 'https://images.unsplash.com/photo-1473800447596-01729482b8eb?w=1400&q=80',
    nome: 'Blumenau',
    estado: 'Santa Catarina',
    uf: 'SC',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Blumenau',
    freteGratis: false,
    conteudoLocal: 'Blumenau, polo têxtil e tecnológico de SC com forte setor de saúde, do Hospital Santo Antônio às clínicas do Centro, a Jaleca entrega jalecos premium para profissionais que buscam qualidade e elegância no dia a dia.',
  },
  // RJ interior
  'jaleco-niteroi': {
    heroUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=80',
    nome: 'Niterói',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Niterói',
    freteGratis: true,
    conteudoLocal: 'Niterói, do Hospital Universitário Antônio Pedro às clínicas de Icaraí e do Centro, profissionais de saúde encontram na Jaleca jalecos que ficam bem mesmo depois de horas de uso. Frete grátis pra RJ nas compras acima de R$499.',
  },
  'jaleco-campos-dos-goytacazes': {
    heroUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80',
    nome: 'Campos dos Goytacazes',
    estado: 'Rio de Janeiro',
    uf: 'RJ',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Campos dos Goytacazes',
    freteGratis: true,
    conteudoLocal: 'Campos dos Goytacazes, maior cidade do interior fluminense e polo de petróleo, conta com o Hospital Ferreira Machado e diversas clínicas especializadas. A Jaleca entrega jalecos premium com frete grátis para RJ acima de R$499.',
  },
  // Nordeste interior
  'jaleco-feira-de-santana': {
    heroUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    nome: 'Feira de Santana',
    estado: 'Bahia',
    uf: 'BA',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Feira de Santana',
    freteGratis: false,
    conteudoLocal: 'Feira de Santana, segunda maior cidade da Bahia e principal entroncamento rodoviário do Nordeste, do Hospital da Mulher ao HGCA, é referência regional em saúde. A Jaleca atende profissionais com jalecos de alto padrão e entrega rápida.',
  },
  'jaleco-campina-grande': {
    heroUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=1400&q=80',
    nome: 'Campina Grande',
    estado: 'Paraíba',
    uf: 'PB',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Campina Grande',
    freteGratis: false,
    conteudoLocal: 'Campina Grande, polo tecnológico e de saúde do interior paraibano com a UFCG e o Hospital Universitário Alcides Carneiro, é referência no sertão nordestino. A Jaleca entrega jalecos profissionais com qualidade para os profissionais da cidade.',
  },
  'jaleco-mossoro': {
    heroUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
    nome: 'Mossoró',
    estado: 'Rio Grande do Norte',
    uf: 'RN',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Mossoró',
    freteGratis: false,
    conteudoLocal: 'Mossoró, segunda maior cidade do RN e polo de saúde do interior potiguar, do Hospital Wilson Rosado às clínicas da cidade, profissionais encontram na Jaleca jalecos com qualidade e entrega para toda a região.',
  },
  // GO interior
  'jaleco-anapolis': {
    heroUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=80',
    nome: 'Anápolis',
    estado: 'Goiás',
    uf: 'GO',
    tipo: 'fechada',
    profissoes: 'médicos, dentistas, enfermeiros e profissionais de saúde de Anápolis',
    freteGratis: false,
    conteudoLocal: 'Anápolis, terceira maior cidade de Goiás e polo farmacêutico do Brasil, do Hospital Evangélico às clínicas do setor Sul, profissionais de saúde escolhem a Jaleca por jalecos que aliam qualidade, conforto e design moderno.',
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

  const title = `Jaleca em ${cidade.nome}: Jalecos Profissionais com Entrega Rápida | Compre Online`
  const description = `Compre jalecos femininos e masculinos em ${cidade.nome}, ${cidade.estado}. Modelos Slim, Princesa e Scrub para médicas, dentistas e enfermeiras. Frete rápido para ${cidade.nome} — Jaleca.`

  return {
    title,
    description,
    ...(CIDADES_INDEXADAS.has(slug) ? {} : { robots: { index: false, follow: false } }),
    keywords: `jaleco ${cidade.nome.toLowerCase()}, jaleca ${cidade.nome.toLowerCase()}, jaleco ${cidade.uf.toLowerCase()}, jaleco feminino ${cidade.nome.toLowerCase()}, jaleco médico ${cidade.nome.toLowerCase()}, comprar jaleco ${cidade.nome.toLowerCase()}, uniforme saúde ${cidade.nome.toLowerCase()}`,
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

  const [products] = await Promise.all([
    getAllProducts(),
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

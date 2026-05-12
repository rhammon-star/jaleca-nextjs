export type ClusterPost = {
  slug: string
  title: string
  description: string
}

export type TopicCluster = {
  pillarSlug: string
  pillarTitle: string
  pillarDescription: string
  category: string
  posts: ClusterPost[]
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    pillarSlug: 'guia-completo-jaleco-feminino',
    pillarTitle: 'Jaleco Feminino: Guia Completo para Profissionais de Saúde',
    pillarDescription: 'Qual jaleco feminino comprar? Guia completo com modelos Slim, Elastex e Clássico, comparativo de tecidos, tamanhos do PP ao G3 e dicas por especialidade — médica, dentista, enfermeira e esteticista.',
    category: '/categoria/jalecos-femininos',
    posts: [
      { slug: 'jaleco-slim-feminino', title: 'Jaleco Slim Feminino', description: 'Por que é o favorito das médicas' },
      { slug: 'jaleco-feminino-como-escolher-modelo-certo-especialidade', title: 'Como escolher por especialidade', description: 'Guia por profissão' },
      { slug: 'jaleco-feminino-branco-ou-colorido-qual-usar', title: 'Branco ou colorido?', description: 'Quando usar cada cor' },
      { slug: 'jaleco-feminino-tamanho-certo-como-medir', title: 'Como medir o tamanho certo', description: 'Guia de medidas' },
      { slug: 'jaleco-colorido-permitido-hospital-regras', title: 'Jaleco colorido no hospital', description: 'Regras e normas' },
      { slug: 'jaleco-plus-size-feminino-guia', title: 'Plus size feminino', description: 'Guia completo' },
      { slug: 'jaleco-feminino-gestante-como-escolher', title: 'Jaleco para gestante', description: 'Como escolher' },
    ],
  },
  {
    pillarSlug: 'guia-completo-scrub-feminino',
    pillarTitle: 'Scrub Feminino: Guia Completo para Profissionais de Saúde',
    pillarDescription: 'Tudo sobre scrub feminino: tecidos, modelagens, cores, cuidados e onde comprar.',
    category: '/categoria/scrub',
    posts: [
      { slug: 'scrub-feminino-guia-completo', title: 'Guia completo scrub feminino', description: 'O essencial' },
      { slug: 'melhores-tecidos-scrub-feminino', title: 'Melhores tecidos', description: 'Comparativo completo' },
      { slug: 'scrub-feminino-acinturado', title: 'Scrub acinturado', description: 'Modelagem e vantagens' },
      { slug: 'scrub-feminino-colorido', title: 'Scrub colorido', description: 'Tendências e significados' },
      { slug: 'scrub-feminino-plus-size', title: 'Plus size', description: 'Guia de modelagem' },
      { slug: 'tabela-medidas-scrub-feminino', title: 'Tabela de medidas', description: 'Como medir certo' },
      { slug: 'como-cuidar-scrub-feminino', title: 'Como cuidar', description: 'Lavagem e conservação' },
    ],
  },
  {
    pillarSlug: 'guia-jaleco-por-especialidade',
    pillarTitle: 'Jaleco por Especialidade: Guia Completo para cada Profissional de Saúde',
    pillarDescription: 'Qual jaleco usar em cada especialidade — médica, enfermeira, dentista, fisioterapeuta, nutricionista e mais.',
    category: '/categoria/jalecos',
    posts: [
      { slug: 'jaleco-para-medica-guia-completo', title: 'Jaleco para médica', description: 'Consultório e plantão' },
      { slug: 'jaleco-para-enfermeira-regras-cofen', title: 'Jaleco para enfermeira', description: 'Regras COFEN' },
      { slug: 'jaleco-para-dentista-modelos-cores-como-escolher', title: 'Jaleco para dentista', description: 'Modelos e cores' },
      { slug: 'jaleco-para-fisioterapeuta-guia', title: 'Jaleco para fisioterapeuta', description: 'Guia completo' },
      { slug: 'jaleco-para-nutricionista-consultorio', title: 'Jaleco para nutricionista', description: 'Consultório' },
      { slug: 'jaleco-para-esteticista-guia', title: 'Jaleco para esteticista', description: 'Guia completo' },
      { slug: 'jaleco-para-veterinaria-guia', title: 'Jaleco para veterinária', description: 'Guia completo' },
      { slug: 'jaleco-para-psicologa-guia', title: 'Jaleco para psicóloga', description: 'Guia completo' },
    ],
  },
]

export function getClusterForPost(postSlug: string): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find(c => c.posts.some(p => p.slug === postSlug))
}

export type Author = {
  slug: string
  name: string
  jobTitle: string
  bio: string
  knowsAbout: string[]
  linkedin: string
  avatar: string
}

export const AUTHORS: Author[] = [
  {
    slug: 'ana-lima',
    name: 'Ana Lima',
    jobTitle: 'Especialista em Moda e Uniformes Profissionais',
    bio: 'Especialista em uniformes profissionais para saúde com mais de 10 anos de experiência em moda clínica. Acompanha tendências de tecidos técnicos, ergonomia e regulamentações do COFEN e CFM. Escreve sobre escolha de jaleco, scrub e moda profissional na Jaleca.',
    knowsAbout: ['Jaleco feminino', 'Scrub profissional', 'Tecidos técnicos', 'Moda clínica', 'Normas COFEN'],
    linkedin: 'https://www.linkedin.com/company/jaleca-uniformes',
    avatar: 'https://jaleca.com.br/og-home.jpg',
  },
  {
    slug: 'carlos-mendes',
    name: 'Carlos Mendes',
    jobTitle: 'Consultor de Uniformes para Área da Saúde',
    bio: 'Consultor com 12 anos de experiência em uniformes hospitalares e biossegurança. Especialista em tecidos antimicrobianos, normas NR-32 e escolha de uniformes por especialidade médica. Colabora com a equipe da Jaleca em guias técnicos e comparativos de produtos.',
    knowsAbout: ['Jaleco masculino', 'Biossegurança NR-32', 'Tecidos antimicrobianos', 'Uniformes hospitalares', 'Normas CFM'],
    linkedin: 'https://www.linkedin.com/company/jaleca-uniformes',
    avatar: 'https://jaleca.com.br/og-home.jpg',
  },
]

export function getAuthorBySlug(slug: string): Author | undefined {
  return AUTHORS.find(a => a.slug === slug)
}

export function pickAuthor(topic: string): Author {
  const isMasculino = /masculino|médico\b|enfermeiro\b|dentista\b/i.test(topic)
  return isMasculino ? AUTHORS[1] : AUTHORS[0]
}

export function authorSchema(author: Author) {
  return {
    '@type': 'Person',
    name: author.name,
    url: `https://jaleca.com.br/autor/${author.slug}`,
    jobTitle: author.jobTitle,
    knowsAbout: author.knowsAbout,
    sameAs: [author.linkedin],
  }
}

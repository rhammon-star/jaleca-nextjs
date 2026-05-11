type Props = {
  profession: 'medico' | 'dentista' | 'enfermeiro' | 'fisioterapeuta' | 'veterinario' | 'nutricionista'
  lastUpdated?: string
}

const FONTES: Record<Props['profession'], { conselho: string; link: string; norma: string }[]> = {
  medico: [
    { conselho: 'CFM — Conselho Federal de Medicina', link: 'https://portal.cfm.org.br/', norma: 'Resolução CFM 2.217/2018 (Código de Ética Médica) — identificação do profissional' },
    { conselho: 'ANVISA', link: 'https://www.gov.br/anvisa/', norma: 'RDC 50/2002 — controle de infecção em serviços de saúde' },
  ],
  dentista: [
    { conselho: 'CFO — Conselho Federal de Odontologia', link: 'https://website.cfo.org.br/', norma: 'Resolução CFO 63/2005 — Código de Ética Odontológica' },
    { conselho: 'ANVISA', link: 'https://www.gov.br/anvisa/', norma: 'RDC 15/2012 — boas práticas em serviços odontológicos' },
  ],
  enfermeiro: [
    { conselho: 'COFEN — Conselho Federal de Enfermagem', link: 'http://www.cofen.gov.br/', norma: 'Resolução COFEN 564/2017 — Código de Ética dos Profissionais de Enfermagem' },
    { conselho: 'ANVISA', link: 'https://www.gov.br/anvisa/', norma: 'NR 32 (MTE) — segurança em serviços de saúde' },
  ],
  fisioterapeuta: [
    { conselho: 'COFFITO — Conselho Federal de Fisioterapia', link: 'https://www.coffito.gov.br/', norma: 'Resolução COFFITO 424/2013 — Código de Ética e Deontologia' },
  ],
  veterinario: [
    { conselho: 'CFMV — Conselho Federal de Medicina Veterinária', link: 'https://www.cfmv.gov.br/', norma: 'Resolução CFMV 1.138/2016 — Código de Ética do Médico Veterinário' },
  ],
  nutricionista: [
    { conselho: 'CFN — Conselho Federal de Nutricionistas', link: 'https://www.cfn.org.br/', norma: 'Resolução CFN 599/2018 — Código de Ética e de Conduta do Nutricionista' },
  ],
}

export default function EATBlock({ profession, lastUpdated = '2026-05-10' }: Props) {
  const fontes = FONTES[profession]
  return (
    <section style={{ background: '#f9f7f4', borderTop: '1px solid #e5e0d8', borderBottom: '1px solid #e5e0d8', padding: 'clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
          Sobre este conteúdo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.25rem' }}>Autor</strong>
            <span style={{ fontSize: '0.82rem', color: '#4a4a4a' }}>Equipe Editorial Jaleca</span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.25rem' }}>Revisão</strong>
            <span style={{ fontSize: '0.82rem', color: '#4a4a4a' }}>Equipe técnica Jaleca · uniformes profissionais desde 2015</span>
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.25rem' }}>Última atualização</strong>
            <span style={{ fontSize: '0.82rem', color: '#4a4a4a' }}>{new Date(lastUpdated).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        <strong style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.5rem' }}>Fontes consultadas</strong>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {fontes.map(f => (
            <li key={f.conselho} style={{ fontSize: '0.8rem', color: '#4a4a4a', lineHeight: 1.6 }}>
              <a href={f.link} target="_blank" rel="noopener nofollow" style={{ color: '#c8a96e', textDecoration: 'none' }}>{f.conselho}</a>
              <span style={{ color: '#6b6b6b' }}> — {f.norma}</span>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: '0.72rem', color: '#6b6b6b', marginTop: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
          Este conteúdo é informativo e baseado em normativas vigentes. Não substitui consulta ao conselho profissional da sua categoria nem orientações específicas da instituição onde você atua.
        </p>
      </div>
    </section>
  )
}

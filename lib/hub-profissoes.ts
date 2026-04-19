export type FaqItem = { q: string; a: string }
export type GuiaSecao = { id: string; titulo: string; paragrafos: string[] }

export type HubProfissao = {
  slug: string
  titulo: string
  cluster: 'saude' | 'beleza' | 'gastronomia' | 'servicos' | 'escritorio'
  metadata: { title: string; description: string }
  hero: { subtitulo: string }
  guia: {
    tituloSidebar: string
    secoes: GuiaSecao[]
  }
  comparacao: { slimIdeal: string; profissionalIdeal: string }
  faq: FaqItem[]
  cta: { descricao: string }
}

// ─── CLUSTER LINKS ────────────────────────────────────────────────────────────

export const CLUSTER_LINKS: Record<string, Array<{ label: string; href: string; desc: string }>> = {
  saude: [
    { label: 'Dentista', href: '/jaleco-para-dentista', desc: 'Guia completo' },
    { label: 'Podólogo', href: '/jaleco-para-podologo', desc: 'Guia completo' },
    { label: 'Biomédico', href: '/jaleco-para-biomedico', desc: 'Guia completo' },
    { label: 'Enfermeiro', href: '/jaleco-para-enfermeiro', desc: 'Guia completo' },
    { label: 'Fisioterapeuta', href: '/jaleco-para-fisioterapeuta', desc: 'Guia completo' },
    { label: 'Nutricionista', href: '/jaleco-para-nutricionista', desc: 'Guia completo' },
    { label: 'Veterinário', href: '/jaleco-para-veterinario', desc: 'Guia completo' },
    { label: 'Médico', href: '/jaleco-para-medico', desc: 'Guia completo' },
  ],
  beleza: [
    { label: 'Barbeiro', href: '/jaleco-para-barbeiro', desc: 'Guia completo' },
    { label: 'Tatuador', href: '/jaleco-para-tatuador', desc: 'Guia completo' },
    { label: 'Esteticista', href: '/jaleco-para-esteticista', desc: 'Guia completo' },
    { label: 'Massagista', href: '/jaleco-para-massagista', desc: 'Guia completo' },
    { label: 'Cabeleireiro', href: '/jaleco-para-cabeleireiro', desc: 'Guia completo' },
  ],
  gastronomia: [
    { label: 'Churrasqueiro', href: '/jaleco-para-churrasqueiro', desc: 'Guia completo' },
    { label: 'Sushiman', href: '/jaleco-para-sushiman', desc: 'Guia completo' },
    { label: 'Cozinheiro', href: '/jaleco-para-cozinheiro', desc: 'Guia completo' },
  ],
  servicos: [
    { label: 'Professor', href: '/jaleco-para-professor', desc: 'Guia completo' },
    { label: 'Vendedor', href: '/jaleco-para-vendedor', desc: 'Guia completo' },
  ],
  escritorio: [
    { label: 'Advogado', href: '/jaleco-para-advogado', desc: 'Guia completo' },
    { label: 'Pastor', href: '/jaleco-para-pastor', desc: 'Guia completo' },
    { label: 'Psicólogo', href: '/jaleco-para-psicologa', desc: 'Guia completo' },
    { label: 'Farmacêutico', href: '/jaleco-para-farmaceutico', desc: 'Guia completo' },
  ],
}

// ─── PROFISSÕES ───────────────────────────────────────────────────────────────

export const HUB_PROFISSOES: HubProfissao[] = [

  // ── CLUSTER SAÚDE ──────────────────────────────────────────────────────────

  {
    slug: 'podologo',
    titulo: 'Podólogo',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Podólogo: Guia Completo 2026 | Jaleca',
      description: 'Qual jaleco usar na podologia? Tecido certo, modelagem Slim ou Profissional, cores e normas. Guia completo com jalecos com elastano do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco prático e confortável para quem trabalha sentado, agachado e em movimento.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para podologia',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para podologia',
          paragrafos: [
            'O elastano no tecido garante liberdade de movimento. Faz diferença para quem passa horas curvado atendendo.',
            'Todos os jalecos Jaleca têm elastano na composição. O tecido volta ao formato depois de cada movimento.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional: qual escolher?',
          paragrafos: [
            'O Slim tem corte mais ajustado, visual moderno — bom para clínicas de estética e podologia premium. O Profissional tem mais folga, ideal para quem precisa de movimento amplo durante os procedimentos.',
          ],
        },
        {
          id: 'cores', titulo: 'Jaleco branco ou colorido na podologia',
          paragrafos: [
            'Branco é o padrão por transmitir higiene. Mas tons pastel são aceitos na maioria dos consultórios de podologia.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade clínica',
          paragrafos: [
            'Bolsos estratégicos facilitam acesso rápido a instrumentos pequenos. Tudo à mão, sem atrapalhar o atendimento.',
            'O corte precisa permitir flexão e rotação sem puxar. Quem senta e se levanta várias vezes por hora sente isso na pele.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas e biossegurança na podologia',
          paragrafos: [
            'O CFFa e os conselhos regionais recomendam jaleco de uso exclusivo no ambiente de trabalho — não fora da clínica.',
            'Lavagem regular e tecido resistente são obrigatórios. O jaleco precisa estar sempre limpo e em bom estado.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Clínicas de estética e podologia premium',
      profissionalIdeal: 'Rotina clínica intensa com muito movimento',
    },
    faq: [
      { q: 'Podólogo precisa usar jaleco?', a: 'Sim. O jaleco é parte do uniforme profissional na podologia — higiene e biossegurança.' },
      { q: 'Jaleco curto ou longo para podologia?', a: 'Jaleco curto é mais comum. Facilita o trabalho sentado, sem prender nas pernas.' },
      { q: 'Qual tecido é melhor para podólogo?', a: 'Tecidos com elastano são os melhores. Oferecem flexibilidade e conforto durante os atendimentos.' },
      { q: 'Qual cor de jaleco usar na podologia?', a: 'Branco é o padrão. Cores claras como azul e verde menta também são boas escolhas.' },
      { q: 'Jaleco de podólogo pode ter bordado?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'O jaleco precisa ser impermeável?', a: 'Não necessariamente, mas resistência a líquidos é uma vantagem na podologia.' },
      { q: 'Como escolher o tamanho certo?', a: 'Meça o busto e compare com a tabela de medidas da Jaleca. O jaleco não pode apertar nem sobrar muito.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'biomedico',
    titulo: 'Biomédico',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Biomédico: Guia Completo 2026 | Jaleca',
      description: 'Jaleco certo para biomédico: tecido resistente a químicos, manga longa obrigatória, normas ANVISA. Modelos com elastano do PP ao G3.',
    },
    hero: { subtitulo: 'Para o biomédico, o jaleco é proteção e ferramenta de trabalho ao mesmo tempo.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para biomedicina',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o laboratório',
          paragrafos: [
            'Resistência a químicos leves é crucial no trabalho do biomédico. Tecidos mistos com poliéster e elastano são duráveis e fáceis de lavar.',
            'O elastano oferece flexibilidade para movimentos repetitivos no laboratório. Você alcança bancadas sem sentir o jaleco puxar.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional na biomedicina',
          paragrafos: [
            'O Slim confere agilidade no laboratório. O Profissional dá mais liberdade de movimento sobre a roupa e para alcançar equipamentos em posições difíceis.',
          ],
        },
        {
          id: 'cores', titulo: 'Cor do jaleco na biomedicina',
          paragrafos: [
            'Branco é a cor padrão e exigida na maioria dos laboratórios. Simboliza higiene e facilita a identificação de contaminações visíveis.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Bolsos e ergonomia no laboratório',
          paragrafos: [
            'Bolsos profundos são indispensáveis para canetas e pequenos instrumentos. Facilitam a organização sem tirar as mãos do trabalho.',
            'O corte precisa permitir alcance total nas bancadas — sem puxar nos ombros nem apertar nos braços.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas ANVISA e biossegurança',
          paragrafos: [
            'As normas de biossegurança da ANVISA são claras: o jaleco é EPI obrigatório em laboratórios de análises clínicas e biomedicina.',
            'Manga longa é regra — protege os braços de químicos, reagentes e agentes biológicos no dia a dia.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Laboratórios menores e ambulatórios com visual moderno',
      profissionalIdeal: 'Análises clínicas e trabalho intenso em bancadas',
    },
    faq: [
      { q: 'Jaleco de manga longa é obrigatório para biomédico?', a: 'Sim. A manga longa protege contra produtos químicos e agentes biológicos — exigência da ANVISA.' },
      { q: 'Qual tecido é ideal para biomédico?', a: 'Gabardine ou microfibra com elastano. Resistem bem a lavagens frequentes e dão flexibilidade.' },
      { q: 'Pode usar jaleco colorido no laboratório?', a: 'Não. O branco é geralmente obrigatório — permite identificar contaminações visíveis.' },
      { q: 'Bolsos são importantes no jaleco de biomédico?', a: 'Sim. Bolsos espaçosos guardam canetas, réguas e pequenos instrumentos do dia a dia.' },
      { q: 'O jaleco precisa ter gola?', a: 'Sim. A gola oferece proteção extra para o pescoço — detalhe importante para a biossegurança.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. O jaleco não pode atrapalhar os movimentos no laboratório.' },
      { q: 'Jaleca tem modelos para biomédico masculino?', a: 'Sim, temos jalecos masculinos do PP ao G3 com elastano.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'enfermeiro',
    titulo: 'Enfermeiro',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Enfermeiro: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para enfermagem: tecido respirável, resistente a lavagens hospitalares, normas COREN. Modelos Slim e Profissional com elastano.',
    },
    hero: { subtitulo: 'Jalecos que combinam conforto e proteção para quem cuida o dia todo.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para enfermagem',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para enfermagem',
          paragrafos: [
            'Tecidos leves e respiráveis. Perfeitos para longas jornadas — plantão de 12h exige conforto de verdade.',
            'Materiais resistentes que suportam lavagens frequentes e desinfecção hospitalar. O jaleco não pode deteriorar rápido.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para enfermeiro',
          paragrafos: [
            'Corte pensado para a rotina da enfermagem — movimento livre, sem apertar nos ombros nem puxar nas costas durante procedimentos.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na enfermagem',
          paragrafos: [
            'Branco clássico é o padrão hospitalar. Mas muitas instituições adotam cores por setor — azul, verde, rosê — para identificação rápida da equipe.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade',
          paragrafos: [
            'Cortes que acompanham o corpo sem restringir. Curvar, estender os braços, agachar — tudo sem sentir o jaleco atrapalhar.',
            'Bolsos práticos e bem posicionados. Caneta, termômetro, luvas — tudo acessível com uma mão.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas COREN e biossegurança',
          paragrafos: [
            'O COREN recomenda jaleco de uso exclusivo no ambiente hospitalar. Não pode ser usado em transporte público ou fora da instituição.',
            'Tecidos que atendem biossegurança hospitalar. Proteção contra respingos de fluidos e agentes biológicos.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Ambulatórios e clínicas com visual mais moderno',
      profissionalIdeal: 'Plantões hospitalares e rotinas de alta movimentação',
    },
    faq: [
      { q: 'Qual tecido é melhor para jaleco de enfermagem?', a: 'Tecidos com elastano. Dão mobilidade e conforto durante o plantão.' },
      { q: 'Os jalecos Jaleca aguentam lavagem hospitalar?', a: 'Sim. Suportam lavagem a 60°C para higienização clínica.' },
      { q: 'Posso personalizar com o nome do hospital?', a: 'Sim. Para pedidos acima de 5 peças, fale com a gente pelo contato@jaleca.com.br.' },
      { q: 'Jaleca tem modelos masculinos para enfermeiro?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Os jalecos têm bolsos suficientes?', a: 'Nossos modelos têm bolsos frontais e laterais — perfeitos para canetas, luvas e termômetro.' },
      { q: 'Jaleco de manga curta serve para enfermagem?', a: 'Para maior proteção, manga longa é preferível — recomendação geral de biossegurança hospitalar.' },
      { q: 'Como funciona a troca de tamanho?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'fisioterapeuta',
    titulo: 'Fisioterapeuta',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Fisioterapeuta: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para fisioterapia: elastano obrigatório, movimento livre, cores e normas COFFITO. Modelos Slim e Profissional do PP ao G3.',
    },
    hero: { subtitulo: 'Jalecos com elastano para acompanhar cada movimento da sua sessão.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para fisioterapia',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para fisioterapia',
          paragrafos: [
            'Tecidos flexíveis e resistentes. Quem se movimenta o dia todo sente a diferença de um tecido com elastano.',
            'Materiais que deixam a pele respirar. Conforto em qualquer estação — inverno e verão.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para fisioterapeuta',
          paragrafos: [
            'Cortes modernos e funcionais. Liberdade total para exercícios e terapias manuais — agachar, esticar, alcançar o paciente.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na fisioterapia',
          paragrafos: [
            'Branco e tons neutros são os mais comuns. Clínicas de fisioterapia geralmente seguem uma identidade visual própria — a Jaleca tem 12 cores para combinar.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e mobilidade nas sessões',
          paragrafos: [
            'Cortes anatômicos projetados para dar total mobilidade em cada movimento terapêutico.',
            'O jaleco não pode puxar nas costas quando você se inclina sobre o paciente. O elastano resolve isso.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas COFFITO e vestimenta profissional',
          paragrafos: [
            'O COFFITO orienta que o jaleco seja de uso exclusivo no ambiente de trabalho — não usar em transporte ou fora da clínica.',
            'A vestimenta precisa estar sempre limpa e em bom estado. Transmite confiança para o paciente.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Clínicas privadas com visual moderno e elegante',
      profissionalIdeal: 'Fisioterapia hospitalar e reabilitação intensiva',
    },
    faq: [
      { q: 'Qual tecido é melhor para fisioterapeuta?', a: 'Tecidos com elastano ou stretch. Garantem a mobilidade que a fisioterapia exige.' },
      { q: 'Os jalecos Jaleca são confortáveis para longas jornadas?', a: 'Sim. Leves e respiráveis — feitos para quem fica em pé e em movimento o dia todo.' },
      { q: 'Jaleco curto ou longo para fisioterapia?', a: 'Jaleco curto é mais comum — dá liberdade para os movimentos e não atrapalha nos procedimentos.' },
      { q: 'Posso personalizar com o logo da clínica?', a: 'Sim. Para pedidos acima de 5 peças, fale com a gente pelo contato@jaleca.com.br.' },
      { q: 'Os jalecos encurtam depois de lavar?', a: 'Nossos tecidos são pré-tratados. Seguindo as instruções da etiqueta, o tamanho é mantido.' },
      { q: 'Jaleca tem tamanhos grandes?', a: 'Sim, do PP ao G3. Consulte a tabela de medidas no site.' },
      { q: 'Como funciona a troca de tamanho?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'nutricionista',
    titulo: 'Nutricionista',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Nutricionista: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para nutricionista: tecido leve, modelagem Slim ou Profissional, normas CFN. Guia completo com jalecos do PP ao G3.',
    },
    hero: { subtitulo: 'Conforto e elegância para o consultório de nutrição.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para nutricionista',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para nutrição',
          paragrafos: [
            'Tecidos leves, respiráveis e de alta durabilidade. Fáceis de cuidar, ideais para a rotina intensa de consultas.',
            'Com elastano para acompanhar o movimento. Nada de puxar ou apertar durante o atendimento.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para nutricionista',
          paragrafos: [
            'Modelagens que valorizam o corpo sem atrapalhar os movimentos — consultas, avaliações e manipulação alimentar.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na nutrição',
          paragrafos: [
            'Branco é o clássico. Mas tons pastel — verde, azul claro, rosê — são muito usados e transmitem leveza e bem-estar para o paciente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Bolsos e funcionalidade no consultório',
          paragrafos: [
            'Bolsos funcionais para guardar fita métrica, caneta e pequenos instrumentos. Tudo acessível sem atrapalhar a consulta.',
            'Liberdade de movimento para avaliações antropométricas e consultas dinâmicas.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFN e vestimenta profissional',
          paragrafos: [
            'O CFN orienta que a vestimenta profissional transmita higiene e seriedade. O jaleco branco é o mais alinhado a essa expectativa.',
            'Em ambientes hospitalares ou clínicos, siga as normas da instituição — algumas exigem cor específica por equipe.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Consultórios particulares com foco em imagem profissional',
      profissionalIdeal: 'Hospitais e clínicas multidisciplinares',
    },
    faq: [
      { q: 'Qual o melhor tecido para jaleco de nutricionista?', a: 'Gabardine ou microfibra leve. Confortáveis e de fácil manutenção.' },
      { q: 'Quais cores são mais usadas por nutricionistas?', a: 'Branco é o mais comum. Tons pastel como verde água e rosê são populares e transmitem leveza.' },
      { q: 'O jaleco pode ter bordado?', a: 'Sim. Para pedidos acima de 5 peças, fale com a gente pelo contato@jaleca.com.br.' },
      { q: 'Os jalecos têm bom caimento?', a: 'Nossas modelagens são pensadas para ter caimento impecável sem apertar.' },
      { q: 'Jaleco curto ou longo para nutricionista?', a: 'Jaleco curto é mais comum em consultórios. O longo fica mais para hospitais.' },
      { q: 'Como lavar o jaleco da nutricionista?', a: 'Lave com água morna e sabão neutro. Evite alvejante clorado para preservar a cor.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. Meça busto, cintura e quadril.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'veterinario',
    titulo: 'Veterinário',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Veterinário: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para veterinário: resistente a manchas e fluidos animais, fácil de limpar, normas CFMV. Modelos com elastano do PP ao G3.',
    },
    hero: { subtitulo: 'Durabilidade e proteção para quem cuida de animais.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para veterinária',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para veterinária',
          paragrafos: [
            'Resistência a manchas e fluidos animais. O jaleco de veterinário precisa de tecido que aguente o dia a dia intenso.',
            'Confortável e fácil de limpar — pelos, fluidos e produtos de limpeza não podem deteriorar o tecido rápido.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para veterinário',
          paragrafos: [
            'Modelagens ergonômicas para liberdade total de movimento — conter animais, realizar exames e cirurgias exige amplitude.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na veterinária',
          paragrafos: [
            'Branco é o mais comum. Mas cinza claro e azul também são usados — cores que transmitem higiene e profissionalismo e minimizam pelos claros.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na clínica',
          paragrafos: [
            'Liberdade para se mover com segurança durante consultas, cirurgias e procedimentos em animais de todos os tamanhos.',
            'Bolsos estratégicos para estetoscópio, canetas e pequenos instrumentos. Organização sem atrapalhar o trabalho.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFMV e biossegurança',
          paragrafos: [
            'O CFMV recomenda que a vestimenta clínica seja de uso exclusivo do ambiente de trabalho — não usar em transporte ou fora da clínica.',
            'Tecidos resistentes a lavagens e desinfecções frequentes são obrigatórios para manter a biossegurança.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Consultórios e clínicas pequenas e médias',
      profissionalIdeal: 'Hospitais veterinários e cirurgias de grande porte',
    },
    faq: [
      { q: 'Qual tecido é melhor para jaleco de veterinário?', a: 'Gabardine e microfibra são ótimos. Resistem ao dia a dia e são fáceis de higienizar.' },
      { q: 'Os jalecos Jaleca minimizam a aderência de pelos?', a: 'Nossos tecidos têm acabamento liso, o que facilita a remoção de pelos.' },
      { q: 'O jaleco suporta desinfecção?', a: 'Suporta lavagem a 60°C. Para esterilização química, consulte a etiqueta de cada modelo.' },
      { q: 'Qual cor é melhor para veterinário?', a: 'Branco é o mais comum. Cinza e azul claro também são boas opções e disfarçam manchas leves.' },
      { q: 'Os jalecos têm bolsos para instrumentos?', a: 'Sim. Nossos modelos têm bolsos estratégicos para guardar estetoscópio, canetas e pequenos itens.' },
      { q: 'Jaleca tem modelos para veterinário masculino?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. O jaleco precisa ter folga para movimentos amplos.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'medico',
    titulo: 'Médico',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Médico: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para médico: elegância e proteção para consultório e hospital. Modelos Slim e Profissional com elastano, do PP ao G3.',
    },
    hero: { subtitulo: 'Jalecos que combinam elegância e proteção para a rotina médica.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para médico',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para médico',
          paragrafos: [
            'Tecido tecnológico com elastano: liberdade de movimento e secagem rápida. Não amassa depois de horas no consultório.',
            'Algodão: conforto total para longas jornadas. Respirável e hipoalergênico — bom para quem tem pele sensível.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para médico',
          paragrafos: [
            'O Slim valoriza a silhueta com um corte mais ajustado — visual moderno para consultório particular. O Profissional tem mais amplitude, ideal para plantões e procedimentos.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na medicina',
          paragrafos: [
            'Branco é o clássico médico — padrão de higiene e profissionalismo. Versátil para consultório, hospital ou clínica.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade',
          paragrafos: [
            'Mangas com mobilidade que permitem movimentos amplos sem restringir — examinar, palpar, realizar procedimentos.',
            'Costuras reforçadas para durabilidade em plantões longos. O jaleco precisa aguentar lavagens frequentes sem perder a forma.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFM e biossegurança',
          paragrafos: [
            'O jaleco de médico deve ser de uso exclusivo do ambiente clínico — não usar em transporte público ou fora do hospital.',
            'Modelos que cobrem bem o corpo protegem contra respingos e contaminação. Manga longa é recomendada em procedimentos.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Consultórios particulares e ambulatórios com visual sofisticado',
      profissionalIdeal: 'Plantões hospitalares e clínicas de alta movimentação',
    },
    faq: [
      { q: 'Qual tecido é melhor para jaleco médico?', a: 'Algodão para conforto ou tecido com elastano para mais mobilidade. Os dois são boas escolhas.' },
      { q: 'Os jalecos Jaleca aguentam lavagem hospitalar?', a: 'Sim. Suportam lavagem a 60°C — temperatura padrão para higienização clínica.' },
      { q: 'Jaleca tem modelos masculinos para médico?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Os jalecos têm bolsos?', a: 'Nossos modelos vêm com bolsos funcionais para canetas, estetoscópio e pequenos instrumentos.' },
      { q: 'Posso personalizar com o nome e CRM?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Como escolher entre jaleco curto e longo?', a: 'Jaleco curto para consultório. Jaleco longo para plantão e procedimentos cirúrgicos.' },
      { q: 'Como funciona a troca de tamanho?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elastano para total conforto. 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER BELEZA ─────────────────────────────────────────────────────────

  {
    slug: 'barbeiro',
    titulo: 'Barbeiro',
    cluster: 'beleza',
    metadata: {
      title: 'Jaleco para Barbeiro: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para barbeiro: tecido que não retém pelos, cores escuras, estilo premium para barbearias. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'Estilo e praticidade para quem trabalha na barbearia todo dia.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para barbeiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para barbearia',
          paragrafos: [
            'Sarja é excelente pela resistência e por não reter pelos — o tecido certo para quem lida com cabelo o dia todo.',
            'Tecidos com tratamento de repelência a líquidos também são ótimos. Facilitam a limpeza no fim do expediente.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para barbeiro',
          paragrafos: [
            'O Slim tem corte mais ajustado — visual moderno que combina com o estilo das barbearias premium. O Profissional dá mais folga para movimentar os braços livremente.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para barbeiro',
          paragrafos: [
            'Preto e grafite são os favoritos nas barbearias — disfarçam pelos e manchas. Mas branco e azul navy também ficam muito bem com o estilo do setor.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na barbearia',
          paragrafos: [
            'Corte que facilita a amplitude dos braços — garante liberdade para cortes e acabamentos sem restrição.',
            'Bolsos funcionais para pentes, tesoura pequena e itens do dia a dia. Sem usar bancada o tempo todo.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação na barbearia',
          paragrafos: [
            'Jaleco limpo e bem conservado é parte da apresentação profissional — os clientes reparam.',
            'Fácil de lavar e resistente ao uso diário. O jaleco precisa durar muito nessa rotina intensa.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Barbearias premium com foco em imagem e estilo',
      profissionalIdeal: 'Barbearias de alto volume com jornadas longas',
    },
    faq: [
      { q: 'Qual tecido é melhor para barbeiro?', a: 'Sarja é excelente — não retém pelos e aguenta bem o uso diário.' },
      { q: 'Cores escuras são melhores para barbeiro?', a: 'Sim. Preto e grafite disfarçam pelos cortados e manchas leves de produtos.' },
      { q: 'Os jalecos Jaleca mancham com tintura?', a: 'Nossos tecidos resistem melhor, mas limpe o quanto antes para melhores resultados.' },
      { q: 'Posso bordar o logo da minha barbearia?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Os jalecos têm bolsos para ferramentas?', a: 'Sim. Nossos modelos têm bolsos estratégicos para pentes, tesouras e pequenos utensílios.' },
      { q: 'Pode lavar na máquina?', a: 'Sim, a maioria dos nossos jalecos vai à máquina. Siga as instruções da etiqueta.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para barbearia, um tamanho com um pouco de folga nos ombros é ideal.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Estilo e conforto para a barbearia. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'tatuador',
    titulo: 'Tatuador',
    cluster: 'beleza',
    metadata: {
      title: 'Jaleco para Tatuador: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para tatuador: tecido resistente a tinta, cores escuras, estilo para estúdio. Guia completo com modelos do PP ao G3.',
    },
    hero: { subtitulo: 'Proteção e estilo para longas sessões no estúdio de tatuagem.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para tatuador',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para estúdio de tatuagem',
          paragrafos: [
            'Tecido resistente a manchas e de fácil limpeza. Na tatuagem, respingos de tinta fazem parte da rotina.',
            'Com elastano para acompanhar o movimento. Sessões longas exigem que o jaleco não restrinja o traço.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para tatuador',
          paragrafos: [
            'O Slim tem visual moderno que combina com o estilo do estúdio. O Profissional dá mais amplitude para trabalhar em ângulos difíceis.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para tatuador',
          paragrafos: [
            'Cores escuras — preto, cinza, azul navy — são as mais usadas. Disfarçam melhor pequenas manchas de tinta durante o trabalho.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade no estúdio',
          paragrafos: [
            'Movimentos livres para o traço — o jaleco não pode puxar nos ombros quando você se inclina sobre o cliente.',
            'Design que evita restrições nos braços. Sessões de 4 a 6 horas exigem conforto de verdade.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e biossegurança no estúdio',
          paragrafos: [
            'Higiene é parte da confiança que o cliente deposita no tatuador. Jaleco limpo e apresentável é obrigatório.',
            'Tecidos de fácil lavagem facilitam a rotina de higienização após cada sessão.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Estúdios com identidade visual forte e foco em imagem',
      profissionalIdeal: 'Tatuadores que fazem sessões longas e precisam de máxima mobilidade',
    },
    faq: [
      { q: 'Jaleco é obrigatório para tatuador?', a: 'Não há regulamentação específica, mas ajuda na higiene, proteção e profissionalismo.' },
      { q: 'Qual cor de jaleco é melhor para tatuador?', a: 'Preto e grafite. Disfarçam manchas de tinta e combinam com o estilo dos estúdios.' },
      { q: 'Como tirar manchas de tinta do jaleco?', a: 'Lave o quanto antes com produto específico para remoção de tinta.' },
      { q: 'Posso bordar o logo do meu estúdio?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Jaleco com elastano é bom para tatuador?', a: 'Sim. O elastano garante mobilidade total para trabalhar em qualquer ângulo.' },
      { q: 'O jaleco amassa rápido?', a: 'Nossos tecidos são tratados para manter o jaleco apresentável por mais tempo.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para sessões longas, prefira um tamanho com boa folga nos ombros.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Estilo e conforto para o seu estúdio. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'esteticista',
    titulo: 'Esteticista',
    cluster: 'beleza',
    metadata: {
      title: 'Jaleco para Esteticista: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para esteticista: conforto, higiene e elegância para a clínica de estética. Modelos Slim e Profissional com elastano do PP ao G3.',
    },
    hero: { subtitulo: 'Conforto, higiene e estilo para a sua rotina na estética.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para esteticista',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para clínica de estética',
          paragrafos: [
            'Tecidos que não amassam e são de fácil lavagem. A clínica de estética exige apresentação impecável o dia todo.',
            'Com elastano — garante liberdade total de movimento para os procedimentos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para esteticista',
          paragrafos: [
            'Cortes acinturados e modernos valorizam a silhueta. Para esteticista, a imagem é parte do serviço.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para esteticista',
          paragrafos: [
            'Branco clássico, tons pastel e cores que transmitem tranquilidade. A paleta de cores certa reforça a identidade visual da clínica.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade nos procedimentos',
          paragrafos: [
            'Mangas que permitem total flexibilidade — procedimentos estéticos exigem amplitude de movimento dos braços.',
            'Bolsos estratégicos para pequenos instrumentos. Organização sem atrapalhar o atendimento.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação na estética',
          paragrafos: [
            'Tecidos que facilitam a assepsia e manutenção da higiene. Obrigatório em clínicas regulamentadas.',
            'Apresentação impecável transmite confiança para a cliente — e faz parte do serviço prestado.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Clínicas premium com foco em imagem e elegância',
      profissionalIdeal: 'Clínicas de alto volume com muitos procedimentos por dia',
    },
    faq: [
      { q: 'Qual tecido é ideal para esteticista?', a: 'Tecidos leves que não amassam. Com elastano para mais conforto nos procedimentos.' },
      { q: 'Quais cores são mais indicadas para esteticista?', a: 'Branco é clássico. Tons pastéis como lavanda e rosê também são muito usados.' },
      { q: 'Posso personalizar com o nome da minha clínica?', a: 'Sim. Para pedidos acima de 5 peças, fale com a gente pelo contato@jaleca.com.br.' },
      { q: 'Como lavar jaleco de esteticista?', a: 'Lave com água fria ou morna e sabão neutro. Evite alvejante para preservar a cor.' },
      { q: 'Jaleca tem modelos femininos para esteticista?', a: 'Sim. Temos diversas opções femininas com cortes modernos e elastano.' },
      { q: 'Os jalecos têm bolsos?', a: 'Sim. Nossos modelos têm bolsos para guardar pequenos itens do procedimento.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. Meça busto, cintura e quadril.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elegância e conforto para a sua clínica. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'massagista',
    titulo: 'Massagista',
    cluster: 'beleza',
    metadata: {
      title: 'Jaleco para Massagista: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para massagista e massoterapeuta: tecido leve, alta elasticidade, liberdade de movimento. Modelos do PP ao G3.',
    },
    hero: { subtitulo: 'Liberdade e bem-estar para cada sessão de massagem.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para massagista',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para massoterapia',
          paragrafos: [
            'Tecido leve com toque suave na pele. Alta elasticidade para movimentos fluidos durante as sessões.',
            'Seca rápido e não amassa. Prático para a rotina de quem atende vários clientes por dia.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para massagista',
          paragrafos: [
            'O Slim tem caimento elegante sem apertar. O Profissional é mais solto — dá amplitude total para os movimentos de massagem.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para massagista',
          paragrafos: [
            'Tons que transmitem calma e profissionalismo. Branco, bege e azul claro são os mais usados em spas e centros de massoterapia.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e mobilidade nas sessões',
          paragrafos: [
            'Permite ampla movimentação dos braços — essencial para técnicas de massagem que exigem força e amplitude.',
            'Design que evita atrito e pressão. O jaleco não pode incomodar durante sessões longas.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação no spa',
          paragrafos: [
            'Higiene e apresentação impecáveis são obrigatórios em spas e clínicas de massoterapia.',
            'Tecido de fácil higienização. Cada sessão começa com jaleco limpo.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Spas e centros de estética premium',
      profissionalIdeal: 'Massoterapia clínica e reabilitação física',
    },
    faq: [
      { q: 'Qual jaleco é melhor para massagista?', a: 'Jaleco com elastano e tecido leve. A mobilidade dos braços é essencial para técnicas de massagem.' },
      { q: 'O jaleco atrapalha os movimentos de massagem?', a: 'Não, se tiver elastano. O tecido acompanha o movimento sem puxar.' },
      { q: 'Quais cores usar para massagista?', a: 'Branco, bege e azul claro são os mais comuns em ambientes de bem-estar.' },
      { q: 'Posso bordar o logo do meu spa?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'O tecido amassa rápido?', a: 'Nossos tecidos têm baixa tendência a amarrotar. O jaleco fica apresentável o dia todo.' },
      { q: 'Como lavar jaleco de massagista?', a: 'Lave com água morna e sabão neutro. Seque à sombra para preservar a cor.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. Para massagem, prefira um tamanho com folga nos ombros.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Conforto e liberdade para cada sessão. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'cabeleireiro',
    titulo: 'Cabeleireiro',
    cluster: 'beleza',
    metadata: {
      title: 'Jaleco para Cabeleireiro: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para cabeleireiro e salão de beleza: tecido antiestático, proteção de produtos químicos, estilo para o salão. Guia completo.',
    },
    hero: { subtitulo: 'Proteção e estilo para quem trabalha com beleza no salão todo dia.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para cabeleireiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para salão de beleza',
          paragrafos: [
            'Tecidos com acabamento liso e antiestático minimizam a aderência de cabelos cortados. Muito mais fácil de limpar ao longo do dia.',
            'Resistência a produtos químicos — tinturas, descolorantes e finalizadores fazem parte da rotina do salão.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para cabeleireiro',
          paragrafos: [
            'O Slim tem visual moderno que combina com salões contemporâneos. O Profissional é mais solto, confortável para quem fica em pé o dia inteiro.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para cabeleireiro',
          paragrafos: [
            'Branco transmite higiene e profissionalismo, mas exige mais cuidado. Preto e tons neutros são práticos e combinam com qualquer identidade de salão.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e conforto no salão',
          paragrafos: [
            'Conforto para os braços levantados — o cabeleireiro passa horas nessa posição. O elastano faz diferença real aqui.',
            'Movimento livre o dia todo. Cortar, pentear, aplicar — sem sentir o jaleco travar os ombros.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação no salão',
          paragrafos: [
            'Jaleco limpo é parte da imagem do salão. Os clientes percebem e associam à qualidade do serviço.',
            'Tecidos de fácil lavagem para a rotina diária. O jaleco precisa estar apresentável a cada atendimento.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Salões modernos com foco em imagem e identidade visual',
      profissionalIdeal: 'Salões de alto volume com longas jornadas de trabalho',
    },
    faq: [
      { q: 'Qual tecido não gruda cabelo para cabeleireiro?', a: 'Tecidos com acabamento liso e antiestático são os melhores — os cabelos escorregam facilmente.' },
      { q: 'O jaleco protege de tintura?', a: 'Sim, ele protege sua roupa de respingos e manchas de produtos químicos.' },
      { q: 'Posso bordar o logo do meu salão?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Jaleco branco é boa escolha para salão?', a: 'Sim, transmite higiene. Mas exige mais cuidado com manchas de tintura.' },
      { q: 'Como lavar jaleco de cabeleireiro?', a: 'Lave na máquina com temperatura indicada na etiqueta. Separe do restante da roupa.' },
      { q: 'O jaleco amassa muito?', a: 'Nossos tecidos mantêm o jaleco apresentável — baixa tendência a amarrotar.' },
      { q: 'Jaleca tem tamanhos grandes?', a: 'Sim, do PP ao G3. Consulte a tabela de medidas no site.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Estilo e conforto para o seu salão. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER GASTRONOMIA ────────────────────────────────────────────────────

  {
    slug: 'churrasqueiro',
    titulo: 'Churrasqueiro',
    cluster: 'gastronomia',
    metadata: {
      title: 'Jaleco para Churrasqueiro: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para churrasqueiro profissional: tecido resistente ao calor, proteção de gordura, estilo para buffets e churrascarias. Guia completo.',
    },
    hero: { subtitulo: 'Estilo e proteção para quem trabalha com o fogo.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para churrasqueiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para churrascaria',
          paragrafos: [
            'Tecido resistente ao calor e a manchas de gordura. A rotina da churrasqueira exige material que aguente o ambiente.',
            'Respirável mesmo perto da brasa. Conforto para longas jornadas no churrasco.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para churrasqueiro',
          paragrafos: [
            'O Slim tem visual moderno para buffets premium. O Profissional tem mais folga, ideal para liberdade de movimento ao cortar e servir.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para churrasqueiro',
          paragrafos: [
            'Tons neutros e escuros são os mais práticos — disfarçam respingos de gordura e marcas do uso intenso.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na churrascaria',
          paragrafos: [
            'Movimento livre para cortes e preparos. O jaleco não pode travar os braços na hora do trabalho.',
            'Bolsos funcionais para utensílios. Praticidade sem precisar parar para buscar ferramentas.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e segurança alimentar',
          paragrafos: [
            'Jaleco limpo e adequado atende às normas da vigilância sanitária para manipulação de alimentos.',
            'Material de qualidade resiste a lavagens frequentes e mantém a apresentação profissional.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Buffets e churrascarias premium com foco em apresentação',
      profissionalIdeal: 'Eventos de alto volume com longa jornada de trabalho',
    },
    faq: [
      { q: 'Jaleco serve para churrasqueiro profissional?', a: 'Sim. Protege da gordura, do calor e mantém a apresentação profissional no buffet ou churrascaria.' },
      { q: 'Qual tecido é melhor para churrasqueiro?', a: 'Tecidos resistentes ao calor e de fácil limpeza. A gordura precisa sair sem deixar mancha.' },
      { q: 'Que cor é melhor para churrasqueiro?', a: 'Preto e grafite são práticos — disfarçam respingos de gordura e marcas do uso.' },
      { q: 'O jaleco protege do calor da brasa?', a: 'Oferece uma camada de proteção contra respingos e calor leve. Para alta temperatura, use avental específico.' },
      { q: 'Posso bordar o logo do meu buffet?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Como lavar jaleco manchado de gordura?', a: 'Aplique removedor de gordura antes de lavar. Lave com água quente conforme a etiqueta.' },
      { q: 'Jaleca tem tamanhos grandes para homem?', a: 'Sim, do PP ao G3 em modelos masculinos com elastano.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Resistência e estilo para a sua churrascaria. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'sushiman',
    titulo: 'Sushiman',
    cluster: 'gastronomia',
    metadata: {
      title: 'Jaleco para Sushiman: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para sushiman e chef de cozinha oriental: tecido resistente a molhos, higiene para manipulação de alimentos. Guia completo.',
    },
    hero: { subtitulo: 'O jaleco certo para o sushiman que não abre mão de higiene e estilo.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para sushiman',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para cozinha oriental',
          paragrafos: [
            'Tecidos leves e respiráveis, como gabardine. Ideais para ambientes quentes e trabalho intenso.',
            'Resistência a manchas de molho shoyu e outros condimentos. Fácil de limpar ao final do expediente.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para sushiman',
          paragrafos: [
            'O Slim veste bem e não atrapalha o movimento rápido do sushiman. O Profissional tem fendas laterais para amplitude total durante o corte.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para sushiman',
          paragrafos: [
            'Branco clássico, preto elegante ou cores neutras. Branco transmite higiene. Preto dá um visual moderno ao restaurante.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na cozinha',
          paragrafos: [
            'Movimentos livres para corte e montagem. Nada de puxar nos ombros na hora de fatiar o peixe.',
            'Bolsos estratégicos para utensílios pequenos. Mãos livres para trabalhar.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e vigilância sanitária',
          paragrafos: [
            'Jaleco limpo atende às normas da vigilância sanitária para manipulação de alimentos crus.',
            'Material de qualidade resiste a lavagens frequentes e mantém o visual profissional.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Restaurantes japoneses com foco em apresentação e imagem',
      profissionalIdeal: 'Cozinhas de alto volume e produção intensa',
    },
    faq: [
      { q: 'Qual tecido é melhor para jaleco de sushiman?', a: 'Gabardine ou brim leve — respiráveis e fáceis de limpar.' },
      { q: 'O jaleco de sushiman precisa ser branco?', a: 'Não obrigatoriamente. Branco é clássico, mas preto e cinza também são elegantes e práticos.' },
      { q: 'Pode lavar jaleco de sushiman na máquina?', a: 'Sim, a maioria dos nossos jalecos vai à máquina. Siga as instruções da etiqueta.' },
      { q: 'O jaleco tem bolsos para sushiman?', a: 'Sim. Nossos modelos têm bolsos estratégicos para guardar utensílios essenciais.' },
      { q: 'Posso bordar o nome do restaurante?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Um bom caimento garante conforto e segurança.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Higiene e estilo para a sua cozinha. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'cozinheiro',
    titulo: 'Cozinheiro',
    cluster: 'gastronomia',
    metadata: {
      title: 'Jaleco para Cozinheiro: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para cozinheiro profissional: tecido resistente, proteção contra calor e respingos, higiene para cozinha. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'Proteção e praticidade para quem trabalha na cozinha profissional.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para cozinheiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para cozinha profissional',
          paragrafos: [
            'Tecidos resistentes a altas temperaturas e respingos. Brim pesado ou sarja são boas escolhas para cozinhas profissionais.',
            'Material que deixa a pele respirar mesmo em ambientes quentes. Conforto em jornadas longas.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para cozinheiro',
          paragrafos: [
            'Modelagem com liberdade para levantar os braços, curvar e manusear panelas — sem restrições em nenhuma tarefa.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para cozinheiro',
          paragrafos: [
            'Branco clássico para higiene. Preto e cinza para um visual moderno e para disfarçar sujeiras leves do serviço.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na cozinha',
          paragrafos: [
            'Cortes para liberdade total — alcançar bancadas, mexer panelas, trabalhar em diferentes alturas sem o jaleco puxar.',
            'Bolsos práticos para termômetro, caneta e pequenos utensílios. Sempre à mão.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e segurança alimentar',
          paragrafos: [
            'Atende às exigências da vigilância sanitária para cozinhas profissionais. O jaleco é parte dos EPIs da cozinha.',
            'Tecidos duráveis que resistem a lavagens frequentes e desinfecção. A vida útil do jaleco precisa acompanhar o uso intenso.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Restaurantes com foco em imagem e apresentação da equipe',
      profissionalIdeal: 'Cozinhas industriais e de alto volume com jornadas longas',
    },
    faq: [
      { q: 'Jaleco é obrigatório para cozinheiro?', a: 'Em cozinhas profissionais sim — é parte dos EPIs exigidos pela vigilância sanitária.' },
      { q: 'Qual tecido é melhor para cozinheiro?', a: 'Brim pesado ou sarja. Resistem ao calor, são duráveis e de fácil limpeza.' },
      { q: 'Jalecos escuros são aceitos em cozinhas?', a: 'Sim. Preto e cinza são usados em muitos restaurantes — disfarçam sujeiras leves.' },
      { q: 'O jaleco protege contra calor?', a: 'Oferece proteção contra respingos. Para calor extremo, use avental específico por cima.' },
      { q: 'Posso bordar o nome do restaurante?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Como escolher o tamanho para cozinheiro?', a: 'Use a tabela de medidas da Jaleca. Na cozinha, um tamanho com boa folga nos ombros é o ideal.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Resistência para a cozinha profissional. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER SERVIÇOS ───────────────────────────────────────────────────────

  {
    slug: 'professor',
    titulo: 'Professor',
    cluster: 'servicos',
    metadata: {
      title: 'Jaleco para Professor: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para professor universitário e de laboratório: prático, confortável, com bolsos. Modelos Slim e Profissional com elastano do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco prático para a sala de aula e o laboratório.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para professor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para professor',
          paragrafos: [
            'Tecidos leves e de fácil lavagem. Aguentam a rotina intensa de aulas e laboratórios sem deteriorar rápido.',
            'Com elastano para movimento livre. Gesticular, escrever na lousa, circular pela sala — tudo sem apertar.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para professor',
          paragrafos: [
            'O Slim funciona bem para salas de aula e faz um visual moderno. O Profissional é ideal para laboratórios — mais proteção e espaço de movimento.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para professor',
          paragrafos: [
            'Branco é o mais comum em laboratórios. Para sala de aula, cores sóbrias — azul marinho, cinza, preto — são bem aceitas.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade em aula',
          paragrafos: [
            'Bolsos para canetas, apagador e pequenos materiais. Tudo acessível sem parar a aula para buscar.',
            'Corte que permite gesticular e circular pela sala sem o jaleco travar os movimentos.',
          ],
        },
        {
          id: 'normas', titulo: 'Uso do jaleco na educação',
          paragrafos: [
            'Sem regulamentação específica de conselho. A exigência varia por escola ou instituição.',
            'Em laboratórios de ciências, química e biologia: manga longa e fechamento frontal são recomendados por segurança.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Salas de aula e professores que buscam visual moderno',
      profissionalIdeal: 'Laboratórios e professores que precisam de mais proteção',
    },
    faq: [
      { q: 'Professor precisa usar jaleco?', a: 'Depende da instituição. Em laboratórios, é obrigatório por segurança.' },
      { q: 'Jaleco curto ou longo para professor?', a: 'Jaleco curto para sala de aula. Longo para laboratório — mais proteção.' },
      { q: 'Qual cor de jaleco para professor?', a: 'Branco para laboratório. Para sala de aula, qualquer cor sóbria é aceita.' },
      { q: 'Os jalecos têm bolsos suficientes?', a: 'Nossos modelos têm bolsos para canetas, marcadores e pequenos materiais.' },
      { q: 'Posso personalizar com o nome da escola?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Como funciona a troca de tamanho?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Prático e confortável para a sala e o laboratório. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'vendedor',
    titulo: 'Vendedor',
    cluster: 'servicos',
    metadata: {
      title: 'Jaleco para Vendedor: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para vendedor de loja: visual elegante, confortável para longas jornadas, opções de personalização com logo. Guia completo.',
    },
    hero: { subtitulo: 'Sua imagem é sua principal ferramenta de venda.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para vendedor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para loja',
          paragrafos: [
            'Tecidos de bom caimento que resistem a vincos. O vendedor precisa estar apresentável do início ao fim do expediente.',
            'Com leve elastano para conforto em jornadas longas — ficar em pé atendendo clientes exige um tecido que não canse.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para vendedor',
          paragrafos: [
            'O Slim tem corte mais ajustado — visual de autoridade e elegância. O Profissional é mais confortável para longas jornadas em loja.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para vendedor',
          paragrafos: [
            'Depende da identidade da marca. Cores clássicas como preto, azul marinho e branco são versáteis e transmitem credibilidade.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e conforto em loja',
          paragrafos: [
            'Conforto para longas jornadas em pé. Nada de jaleco que apertar ou puxar depois de horas de trabalho.',
            'Liberdade para gesticular e atender clientes com naturalidade.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e identidade da marca',
          paragrafos: [
            'O jaleco é parte da identidade visual da loja. Apresentação impecável reflete a qualidade do serviço.',
            'Personalização com logo e nome da loja reforça o profissionalismo da equipe.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Lojas premium e showrooms com foco em imagem',
      profissionalIdeal: 'Lojas de alto volume com jornadas longas de atendimento',
    },
    faq: [
      { q: 'Jaleco para vendedor pode ser colorido?', a: 'Sim. A cor deve seguir a identidade visual da loja — o que importa é o conjunto harmonioso.' },
      { q: 'Posso bordar o logo da minha loja?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Os tecidos amassam durante o expediente?', a: 'Nossos tecidos têm tratamento para manter o jaleco apresentável durante toda a jornada.' },
      { q: 'O jaleco é confortável para ficar em pé o dia todo?', a: 'Sim. Tecidos leves e com elastano fazem diferença em jornadas longas.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. Para vendedor, um caimento bem ajustado passa mais credibilidade.' },
      { q: 'Como funciona a troca?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Apresentação impecável para a sua equipe. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER ESCRITÓRIO ─────────────────────────────────────────────────────

  {
    slug: 'advogado',
    titulo: 'Advogado',
    cluster: 'escritorio',
    metadata: {
      title: 'Jaleco para Advogado: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para advogado e escritório jurídico: elegância, tecido de bom caimento, personalização. Guia completo com modelos do PP ao G3.',
    },
    hero: { subtitulo: 'Vista-se com autoridade no escritório jurídico.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para advogado',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para escritório jurídico',
          paragrafos: [
            'Malhas nobres e resistentes a vincos. O advogado precisa estar impecável da manhã até a audiência da tarde.',
            'Tecidos que não amassam fácil — manter a apresentação em reuniões longas e audiências exige isso.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para advogado',
          paragrafos: [
            'O Slim tem corte mais ajustado — visual de autoridade e distinção. O Profissional é mais confortável para quem passa o dia em audiências e reuniões longas.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para advogado',
          paragrafos: [
            'Cores clássicas do ambiente jurídico — preto, azul marinho, cinza e branco. Transmitem seriedade e credibilidade.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e conforto no escritório',
          paragrafos: [
            'Movimentos livres para o dia a dia — sentar, levantar, gesticular em audiências e reuniões.',
            'Conforto em jornadas longas. Um jaleco que não aperta é essencial para quem passa horas na frente de clientes.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e ética profissional',
          paragrafos: [
            'A OAB não regulamenta vestimenta, mas a boa apresentação é parte da ética profissional do advogado.',
            'O jaleco com logo do escritório reforça a identidade da firma e transmite coesão para os clientes.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Escritórios premium e advogados com foco em imagem pessoal',
      profissionalIdeal: 'Audiências longas e advogados que precisam de mais conforto',
    },
    faq: [
      { q: 'Advogado pode usar jaleco?', a: 'Sim. Muitos escritórios usam jaleco como uniforme de equipe — reforça a identidade da firma.' },
      { q: 'Qual cor de jaleco para advogado?', a: 'Preto, azul marinho e cinza são os mais usados. Combinam com qualquer estilo de escritório.' },
      { q: 'Os tecidos amassam durante o dia?', a: 'Nossos tecidos têm tratamento para manter o jaleco apresentável em reuniões e audiências longas.' },
      { q: 'Posso bordar o logo do escritório?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho certo?', a: 'Use a tabela de medidas da Jaleca. Para escritório, o caimento precisa ser impecável.' },
      { q: 'Tem opções com mais bolsos?', a: 'Sim, alguns modelos têm bolsos frontais e laterais — práticos para o dia no escritório.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Elegância e autoridade para o escritório. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'pastor',
    titulo: 'Pastor',
    cluster: 'escritorio',
    metadata: {
      title: 'Jaleco para Pastor: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para pastor evangélico: jaleco branco pastoral, tecido de bom caimento, elegância para cultos. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'Vista-se com dignidade e respeito para o seu ministério.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para pastor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o ministério',
          paragrafos: [
            'Caimento perfeito e toque suave na pele. O jaleco do pastor precisa de tecido que mantém a postura e a apresentação durante todo o culto.',
            'Tecido que não amassa — praticidade para a rotina intensa de eventos, cultos e reuniões.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para pastor',
          paragrafos: [
            'O Slim tem linhas elegantes que valorizam a figura. O Profissional tem mais amplitude — confortável para longos períodos de ministério.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para pastor',
          paragrafos: [
            'Branco é o mais associado ao jaleco pastoral — simboliza santidade e pureza. Preto e cores sóbrias também são muito usados.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto em cerimônias longas',
          paragrafos: [
            'Conforto para permanecer em pé durante cultos, pregações e cerimônias. O jaleco não pode apertar após horas de uso.',
            'Mobilidade para gesticular durante a pregação. O tecido precisa acompanhar.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e reverência',
          paragrafos: [
            'Adequado ao ambiente de fé e reverência. A apresentação do pastor reflete a seriedade do ministério.',
            'Transmite serenidade e respeito para a congregação.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Pastores que buscam um visual elegante e moderno',
      profissionalIdeal: 'Pastores que pregam em cerimônias e cultos longos',
    },
    faq: [
      { q: 'Jaleco branco é obrigatório para pastor?', a: 'Não é regulamentado. Mas o jaleco branco é a tradição mais forte no ministério evangélico.' },
      { q: 'Qual tecido é melhor para jaleco de pastor?', a: 'Tecidos de bom caimento que não amassam. O pastor precisa estar impecável durante todo o culto.' },
      { q: 'Tem opções de jaleco mais fechado?', a: 'Sim, temos modelos com fechamento frontal completo e decote discreto.' },
      { q: 'Posso bordar o nome da igreja?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Os tecidos são transparentes?', a: 'Não. Usamos tecidos com boa gramatura — sem transparência.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Como funciona a troca?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Dignidade e conforto para o seu ministério. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'psicologa',
    titulo: 'Psicólogo',
    cluster: 'escritorio',
    metadata: {
      title: 'Jaleco para Psicólogo: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para psicólogo: conforto, tons neutros que transmitem acolhimento, modelagem elegante para o consultório. Guia completo.',
    },
    hero: { subtitulo: 'Transmita acolhimento e confiança com o jaleco certo no consultório.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para psicólogo',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o consultório',
          paragrafos: [
            'Toque suave na pele e malhas flexíveis. O psicólogo passa horas sentado — o tecido precisa ser confortável e não apertar.',
            'Tecidos respiráveis para conforto durante as sessões. Clima agradável facilita o atendimento.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para psicólogo',
          paragrafos: [
            'O Slim tem caimento elegante sem apertar — transmite seriedade. O Profissional é mais solto, ótimo para quem prefere conforto em sessões longas.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para psicólogo',
          paragrafos: [
            'Tons neutros que inspiram calma — branco, bege, cinza claro, azul sereno. A cor do jaleco contribui para o ambiente terapêutico.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto durante as sessões',
          paragrafos: [
            'Liberdade de movimentos durante as sessões — o psicólogo não fica imóvel durante o atendimento.',
            'O jaleco não pode apertar ou incomodar depois de horas com pacientes.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e ambiente terapêutico',
          paragrafos: [
            'O CRP não regulamenta a vestimenta, mas a apresentação profissional contribui para criar um ambiente de confiança.',
            'Um jaleco bem cuidado reforça a seriedade profissional sem criar distância do paciente.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Consultórios particulares com foco em imagem profissional',
      profissionalIdeal: 'Atendimentos longos e clínicas de saúde mental',
    },
    faq: [
      { q: 'Psicólogo precisa usar jaleco?', a: 'Não é obrigatório, mas o jaleco reforça a identidade profissional e cria um contexto de seriedade.' },
      { q: 'Quais cores são melhores para psicólogo?', a: 'Tons neutros — branco, bege, cinza e azul claro. Transmitem calma para o paciente.' },
      { q: 'Os tecidos são antiérgicos?', a: 'Sim. Selecionamos tecidos com tratamento suave, adequados para uso prolongado.' },
      { q: 'Posso personalizar com o nome?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Os jalecos têm bolsos funcionais?', a: 'Sim, com bolsos discretos para pequenos objetos do dia a dia.' },
      { q: 'A cor desbota com lavagens?', a: 'Nossas cores têm boa fixação e resistem bem a lavagens frequentes.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Meça busto, cintura e quadril.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Conforto e acolhimento para o seu consultório. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'farmaceutico',
    titulo: 'Farmacêutico',
    cluster: 'escritorio',
    metadata: {
      title: 'Jaleco para Farmacêutico: Guia Completo 2026 | Jaleca',
      description: 'Jaleco para farmacêutico: tecido antimicrobiano, normas CFF, biossegurança em farmácia e laboratório. Modelos com elastano do PP ao G3.',
    },
    hero: { subtitulo: 'Higiene e praticidade para a rotina na farmácia e no laboratório.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para farmacêutico',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para farmácia',
          paragrafos: [
            'Tecidos com propriedades antimicrobianas e de alta durabilidade. A farmácia exige resistência a lavagens frequentes.',
            'Fácil de limpar e secagem rápida — prático para a rotina de quem atende muitos clientes por dia.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para farmacêutico',
          paragrafos: [
            'O Slim tem ajuste preciso e visual clean — perfeito para farmácias modernas. O Profissional tem mais liberdade para trabalho em laboratório de manipulação.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para farmacêutico',
          paragrafos: [
            'Branco clássico é o padrão na farmácia — transmite higiene e assepsia. Tons claros são bem aceitos em redes de farmácias.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na farmácia',
          paragrafos: [
            'Total liberdade de movimentos para atender, manipular e trabalhar nas bancadas do laboratório.',
            'Conforto para longas horas de trabalho — o farmacêutico fica em pé a maior parte do tempo.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFF e biossegurança',
          paragrafos: [
            'O CFF orienta que a vestimenta do farmacêutico atenda aos padrões de biossegurança da instituição.',
            'Em laboratórios de manipulação: manga longa e fechamento frontal são recomendados por segurança.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Farmácias modernas e atendimento ao balcão',
      profissionalIdeal: 'Laboratórios de manipulação e hospitais',
    },
    faq: [
      { q: 'Jaleco branco é obrigatório para farmacêutico?', a: 'Em muitas farmácias sim. O branco é o padrão de higiene e identificação profissional.' },
      { q: 'Qual tecido é melhor para farmacêutico?', a: 'Tecidos leves com elastano são ótimos — conforto em longas jornadas e liberdade de movimento.' },
      { q: 'Jaleco de manga longa é necessário para farmácia?', a: 'Em laboratórios de manipulação sim. Para atendimento ao balcão, manga curta é aceita.' },
      { q: 'Posso personalizar com o nome da farmácia?', a: 'Sim. Para pedidos acima de 5 peças, entre em contato pelo contato@jaleca.com.br.' },
      { q: 'Os jalecos têm bolsos para farmacêutico?', a: 'Sim. Nossos modelos têm bolsos para canetas e pequenos instrumentos do dia a dia.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Na farmácia, o caimento precisa ser prático e apresentável.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Higiene e conforto para a farmácia. Frete grátis no Sudeste acima de R$499.' },
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getHubProfissao(slug: string): HubProfissao | undefined {
  return HUB_PROFISSOES.find(p => p.slug === slug)
}

export function getClusterLinks(cluster: string, currentSlug: string) {
  return (CLUSTER_LINKS[cluster] ?? []).filter(l => !l.href.endsWith(currentSlug))
}

export const ALL_HUB_SLUGS = HUB_PROFISSOES.map(p => p.slug)

export type FaqItem = { q: string; a: string }
export type GuiaSecao = { id: string; titulo: string; paragrafos: string[] }

export type HubProfissao = {
  slug: string
  titulo: string
  cluster: 'saude' | 'beleza' | 'gastronomia' | 'servicos' | 'escritorio'
  produto?: 'jaleco' | 'dolma' | 'conjunto'   // padrão: 'jaleco'
  urlSlug?: string                              // URL path sem leading slash; se omitido deriva como `jaleco-para-${slug}`
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
    { label: '← Uniformes para Saúde', href: '/uniformes-profissionais-para-saude', desc: 'Guia completo da área' },
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
    { label: 'Churrasqueiro', href: '/jaleco-para-churrasqueiro', desc: 'Jaleco' },
    { label: 'Sushiman', href: '/jaleco-para-sushiman', desc: 'Jaleco' },
    { label: 'Cozinheiro', href: '/jaleco-para-cozinheiro', desc: 'Jaleco' },
    { label: 'Dólmã Churrasqueiro', href: '/dolma-para-churrasqueiro', desc: 'Dólmã' },
    { label: 'Dólmã Sushiman', href: '/dolma-para-sushiman', desc: 'Dólmã' },
    { label: 'Dólmã Cozinheiro', href: '/dolma-para-cozinheiro', desc: 'Dólmã' },
  ],
  servicos: [
    { label: 'Professor', href: '/jaleco-para-professor', desc: 'Guia completo' },
    { label: 'Vendedor', href: '/jaleco-para-vendedor', desc: 'Guia completo' },
    { label: 'Uniforme Professor', href: '/uniforme-para-professor', desc: 'Guia completo' },
  ],
  escritorio: [
    { label: 'Advogado', href: '/jaleco-para-advogado', desc: 'Jaleco' },
    { label: 'Pastor', href: '/jaleco-para-pastor', desc: 'Jaleco' },
    { label: 'Psicólogo', href: '/jaleco-para-psicologa', desc: 'Jaleco' },
    { label: 'Farmacêutico', href: '/jaleco-para-farmaceutico', desc: 'Jaleco' },
    { label: 'Conjunto Advogado', href: '/conjunto-para-advogado', desc: 'Conjunto' },
    { label: 'Conjunto Pastor', href: '/conjunto-para-pastor', desc: 'Conjunto' },
    { label: 'Conjunto Psicóloga', href: '/conjunto-para-psicologa', desc: 'Conjunto' },
    { label: 'Conjunto Farmacêutico', href: '/conjunto-para-farmaceutico', desc: 'Conjunto' },
  ],
}

// ─── PROFISSÕES ───────────────────────────────────────────────────────────────

export const HUB_PROFISSOES: HubProfissao[] = [

  // ── CLUSTER SAÚDE ──────────────────────────────────────────────────────────

  {
    slug: 'dentista',
    titulo: 'Dentista',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Dentista: NR-32 e Modelo Certo 2026 | Jaleca',
      description:
        'Jaleco dentista com manga longa NR-32: roupa dentista que protege e passa profissionalismo. Jaleco para dentista em branco ou colorido, do PP ao G3.',
    },
    hero: {
      subtitulo:
        'Jaleco para dentista: manga longa NR-32, tecido antimicrobiano e o modelo certo para cada especialidade.',
    },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para dentista',
      secoes: [
        {
          id: 'tecido',
          titulo: 'Tecido e composição para odontologia',
          paragrafos: [
            'O jaleco para dentista precisa de manga longa — essa é a exigência da NR-32, que classifica o consultório odontológico como ambiente de risco biológico. O tecido certo é poliéster 65% + viscose 30% + elastano 5%: resiste a respingos de sangue e aerossóis do alta-rotação, não amassa em 8h de atendimento e suporta lavagem a 60°C sem encolher.',
            'Tratamento antimicrobiano (prata iônica) reduz a colonização bacteriana na superfície do jaleco entre lavagens — vantagem real em consultórios com alto fluxo de pacientes em clareamento, facetas e harmonização facial.',
            'Evite 100% algodão na odontologia. Absorve fluidos biológicos com facilidade e exige lavagem mais agressiva.',
          ],
        },
        {
          id: 'modelagem',
          titulo: 'Modelagem Slim ou Profissional para dentista',
          paragrafos: [
            'O Slim tem corte ajustado que fica bem em fotos do consultório — para dentistas que fazem harmonização facial e constroem clientela pelo Instagram.',
            'O Profissional tem folga calibrada nos ombros — permite a abdução total dos braços que procedimentos como extração, implante e cirurgia periodontal exigem.',
          ],
        },
        {
          id: 'cores',
          titulo: 'Jaleco branco ou colorido para dentista',
          paragrafos: [
            'Branco é o padrão histórico na odontologia e o que o paciente espera ver — transmite assepsia e confiança. O CRO não proíbe outras cores, mas branco facilita identificar contaminação visível.',
            'Dentistas que fazem harmonização facial usam cada vez mais tons pastel — azul claro, verde menta, lilás. A escolha de cor pode ser parte do posicionamento da clínica.',
          ],
        },
        {
          id: 'ergonomia',
          titulo: 'Ergonomia e funcionalidade no consultório',
          paragrafos: [
            'O dentista trabalha com os braços elevados por longos períodos — o jaleco precisa ter cava com amplitude mínima de 120° sem criar tração nas costas.',
            'Bolso no peito para caneta; bolso lateral esquerdo para luvas (acesso single-hand entre pacientes); bolso direito para EPI extras.',
          ],
        },
        {
          id: 'normas',
          titulo: 'NR-32 e biossegurança na odontologia',
          paragrafos: [
            'A NR-32 classifica o jaleco como EPI em ambientes odontológicos — manga longa é obrigatória contra aerossóis do alta-rotação e respingos de sangue e saliva.',
            'O CFO orienta que o jaleco seja de uso exclusivo do consultório — proibido usá-lo fora do ambiente clínico para evitar contaminação cruzada.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Consultórios estéticos, harmonização facial e dentistas que filmam conteúdo',
      profissionalIdeal: 'Cirurgias, implantes e rotina clínica de alto volume',
    },
    faq: [
      {
        q: 'Jaleco de manga longa é obrigatório para dentista?',
        a: 'Sim. A NR-32 exige manga longa em ambientes odontológicos — protege contra aerossóis e respingos de sangue.',
      },
      {
        q: 'Qual cor de jaleco pode usar o dentista?',
        a: 'O CRO não proíbe cores. Branco é o padrão de biossegurança. Cores claras e pastel são aceitas em consultórios estéticos.',
      },
      {
        q: 'Qual tecido é melhor para jaleco de dentista?',
        a: 'Poliéster com elastano. Resiste a lavagem a 60°C, não amassa e tem boa amplitude de movimento.',
      },
      {
        q: 'O jaleco precisa de tratamento antimicrobiano?',
        a: 'Não é obrigatório, mas ajuda — reduz colonização bacteriana entre lavagens.',
      },
      {
        q: 'Como lavar o jaleco de dentista?',
        a: 'Lavar a 60°C com detergente enzimático. Tecidos poliéster com elastano resistem bem.',
      },
      {
        q: 'Jaleco curto ou longo para dentista?',
        a: 'Comprimento médio (acima do joelho) é o mais comum. Facilita o trabalho sentado na cadeira odontológica.',
      },
      {
        q: 'Como escolher o tamanho certo?',
        a: 'Meça o busto e compare com a tabela de medidas da Jaleca.',
      },
      {
        q: 'Qual o prazo de entrega?',
        a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.',
      },
    ],
    cta: { descricao: 'Do PP ao G3. Manga longa NR-32, elastano e 12 cores. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'podologo',
    titulo: 'Podólogo',
    cluster: 'saude',
    metadata: {
      title: 'Jaleco para Podólogo: Elastano e Conforto 2026 | Jaleca',
      description: 'Jaleco para podologo com elastano: mais conforto para quem atende sentado. Uniforme podologia do PP ao G3 — modelos Slim e Profissional, antimicrobiano, 12 cores.',
    },
    hero: { subtitulo: 'Jaleco para podólogo com elastano: liberdade de movimento para quem passa horas curvado sobre os pés do paciente.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para podologia',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para podologia',
          paragrafos: [
            'O jaleco para podólogo precisa de elastano — não tem outro caminho. Quem atende sentado por 8 a 10 horas seguidas e fica constantemente curvado sobre os pés do paciente sente cada tração do tecido. Composição com 4 a 8% de elastano garante recuperação de forma depois de cada flexão, sem o cansaço que um gabardine sem stretch causa.',
            'Microfibra com elastano tem ainda vantagem adicional: repele líquidos leves e secreções do atendimento. A limpeza entre pacientes é mais rápida e o jaleco chega ao fim do dia apresentável.',
            'Evite 100% algodão para uso diário em podologia — o tecido pura-fibra absorve umidade, pesa ao longo do dia e encolhe nas lavagens a 40°C necessárias para higienização clínica adequada.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional: qual escolher?',
          paragrafos: [
            'O Slim tem corte ajustado e visual moderno — ótimo para clínicas de podologia estética e consultórios premium onde a imagem do profissional é parte do serviço. O corte acompanha o corpo sem sobrar tecido na frente ao se curvar.',
            'O Profissional tem folga calibrada nos ombros e cava — permite flexão anterior profunda (até 90°) e rotação lateral sem puxar nas costas. Ideal para quem realiza procedimentos ungueais e tratamentos plantares que exigem ângulo fechado por longos períodos.',
          ],
        },
        {
          id: 'cores', titulo: 'Jaleco branco ou colorido na podologia',
          paragrafos: [
            'Branco é o padrão pela associação direta com higiene e assepsia. Na podologia, onde o contato com pele e unhas é direto, a cor transmite ao paciente que os protocolos de biossegurança estão sendo seguidos.',
            'Tons pastel — azul claro, verde menta, lilás — são amplamente aceitos nos consultórios de podologia e estética podológica. Algumas clínicas adotam paleta própria como parte da identidade visual. A Jaleca tem 12 cores disponíveis para o profissional alinhar com sua marca.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade clínica',
          paragrafos: [
            'O podólogo trabalha em flexão anterior repetida — curvado sobre os pés do paciente por blocos de 30 a 60 minutos. O jaleco precisa ter cava funda e costura de manga com amplitude suficiente para essa posição sem criar tração nas costas.',
            'Bolsos laterais posicionados acima da linha da cintura facilitam acesso a curetas, bisturis e instrumentos menores sem precisar se levantar. Para quem usa avental aberto por cima, bolsos frontais no peito são mais práticos.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas e biossegurança na podologia',
          paragrafos: [
            'O Conselho Federal de Fisioterapia e Terapia Ocupacional (CFFa) orienta que o jaleco seja de uso exclusivo no ambiente de trabalho — não deve ser usado em transporte público, mercados ou espaços fora da clínica para evitar contaminação cruzada.',
            'A biossegurança na podologia envolve risco biológico nível 2: exposição a sangue, fluidos, pele e unhas potencialmente infectadas. O jaleco atua como barreira física primária — resistente a respingos e lavável a temperatura mínima de 40°C com sabão enzimático.',
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
      { q: 'O CFFa regulamenta o jaleco na podologia?', a: 'Sim. O conselho orienta uso de vestimenta clínica exclusiva no ambiente de trabalho — não circular em transporte público com o jaleco.' },
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
      title: 'Jaleco para Biomédico: Lab e Harmonização 2026 | Jaleca',
      description: 'Jaleco para biomédico: uniforme biomedicina para laboratório e estética. Manga longa para lab, Slim para harmonização facial. Do PP ao G3, elastano, normas ANVISA.',
    },
    hero: { subtitulo: 'Uniforme biomedicina do jeito certo: jaleco de lab para análises clínicas e jaleco de apresentação para harmonização facial.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para biomedicina',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o laboratório',
          paragrafos: [
            'O uniforme biomedicina muda bastante dependendo de onde você trabalha. Para análises clínicas, a composição certa é poliéster 65% + viscose 30% + elastano 5% — o poliéster resiste a reagentes e solventes leves, a viscose confere caimento e conforto térmico, o elastano garante liberdade de movimento nas bancadas.',
            'Evite algodão puro no laboratório de análises clínicas — absorve reagentes e pode carregar contaminantes biológicos por mais tempo na fibra. O tecido sintético facilita a descontaminação com álcool 70% entre procedimentos.',
            'Tecidos com tratamento antimicrobiano são uma vantagem extra para biomédicos que trabalham com hemoculturas e materiais de alto risco biológico — reduzem a colonização da superfície do jaleco entre lavagens.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional na biomedicina',
          paragrafos: [
            'O Slim tem corte ajustado que facilita movimentos em espaços apertados entre equipamentos. Sem excesso de tecido, evita arrastar no material sobre a bancada — importante em labs de microbiologia e hematologia.',
            'O Profissional tem manga com amplitude de cava maior — essencial para quem usa centrífugas altas, espectrofotômetros e equipamentos que exigem extensão total dos braços. Também veste melhor sobre roupas de manga longa no inverno.',
          ],
        },
        {
          id: 'cores', titulo: 'Cor do jaleco na biomedicina',
          paragrafos: [
            'Branco é obrigatório na maioria dos laboratórios clínicos por exigência da ANVISA RDC 302/2005 — que regulamenta laboratórios de análises clínicas. A cor facilita a identificação visual de contaminações por sangue, corantes ou reagentes.',
            'Em biomedicina estética (procedimentos como intradermoterapia e bioestimulação), tons claros como azul e verde são aceitos. O importante é manter o padrão de higiene — jaleco limpo por turno.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Bolsos e ergonomia no laboratório',
          paragrafos: [
            'Bolso no peito (esquerdo preferencial para destros) é padrão para caneta de etiquetagem, marcador e loops de calibração. Bolsos laterais profundos guardam luvas extras e pequenos adaptadores de pipeta sem ocupar a bancada.',
            'O jaleco precisa permitir abdução de ombros acima de 120° sem tração — para alcançar estantes altas e câmaras de fluxo laminar. Costuras de manga em curva anatômica (raglan ou sem costura de cava) garantem esse movimento.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas ANVISA e biossegurança',
          paragrafos: [
            'A ANVISA RDC 302/2005 determina que laboratórios de análises clínicas forneçam EPI adequado — incluindo jaleco de manga longa — para todos os profissionais em contato com amostras biológicas. O CRBio também orienta nessa direção para biomédicos.',
            'Manga longa é regra inegociável em laboratório de biossegurança nível 2 (BSL-2) — onde se manipulam amostras com potencial de agentes infecciosos como MRSA, HIV e hepatites. Cobre os braços contra aerossóis e respingos que ocorrem em centrifugação e pipetagem.',
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
      title: 'Jaleco de Enfermagem: COFEN e Lavagem 60°C 2026 | Jaleca',
      description: 'Jaleco enfermagem que aguenta lavagem a 60°C, cumpre COFEN 375/2011 e dura o plantão inteiro. Uniforme enfermagem Slim e Profissional com elastano, do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco de enfermagem que aguenta a correria do plantão: respirável, resistente a 60°C e com mobilidade total.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para enfermagem',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para enfermagem',
          paragrafos: [
            'O jaleco de enfermagem precisa resistir à lavagem a 60°C — exigência básica de biossegurança hospitalar. Composição ideal: poliéster 67% + viscose 29% + elastano 4%. O poliéster suporta esse ciclo sem encolher; a viscose regula a temperatura no plantão de 12 horas; o elastano acompanha os movimentos amplos sem fadiga do tecido.',
            'Em ambientes de isolamento e UTI, tecidos com acabamento antimicrobiano (prata iônica ou tratamento quaternário) são recomendados — reduzem a colonização bacteriana na superfície do jaleco entre lavagens.',
            'Evite malhas de algodão puro para enfermagem hospitalar. O algodão absorve fluidos biológicos e exige lavagem mais agressiva para descontaminação — o que acelera o desgaste e encurta a vida útil do jaleco.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para enfermeiro',
          paragrafos: [
            'O Slim tem corte estruturado que não frouxa ao longo do plantão — ideal para enfermeiros de ambulatório e clínicas. O tecido ajustado não enrola durante procedimentos de curativo e cateterismo.',
            'O Profissional tem abertura de cava ampla — essencial para os movimentos de AVDs do cuidado direto: higienização do paciente, posicionamento, mobilização no leito e RCP. Nesses procedimentos a amplitude de ombros precisa ser total.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na enfermagem',
          paragrafos: [
            'Branco é o padrão histórico hospitalar — associado à higiene e neutralidade. Em hospitais modernos, a cor passou a indicar setor: azul para UTI, verde para centro cirúrgico, rosê para obstetrícia, branco para clínica geral.',
            'Essa codificação por cor facilita a identificação da equipe em situações de emergência — saber de qual setor veio o profissional é informação crítica no corredor de um hospital de grande porte.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade',
          paragrafos: [
            'O enfermeiro realiza em média 150 a 200 movimentos de alcance e flexão por plantão. O jaleco precisa permitir abdução de ombro a 180° (braço acima da cabeça) e flexão de tronco a 90° sem tração nas costas.',
            'Bolso lateral esquerdo para estetoscópio dobrado, bolso peito direito para caneta e termômetro de bolso, bolso lateral direito para luvas de procedimento — posicionamento ergonômico que evita flexão lombar repetida para buscar materiais.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas COREN e biossegurança',
          paragrafos: [
            'A Resolução COFEN 375/2011 estabelece que o jaleco é roupa privativa do ambiente de trabalho — proibido usá-lo em supermercados, transporte público ou qualquer local fora da instituição. A contaminação cruzada é o risco principal.',
            'A NR-32 (Segurança e Saúde no Trabalho em Serviços de Saúde) classifica o jaleco como EPI em ambientes de risco biológico e químico. O empregador é responsável por fornecer e manter. O profissional tem o dever de usar corretamente e não retirar do ambiente hospitalar.',
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
      { q: 'Qual diferença entre algodão e poliéster para enfermagem?', a: 'Algodão absorve suor e é mais confortável em plantões longos. Poliéster seca mais rápido e resiste melhor às lavagens a 60°C exigidas pela biossegurança hospitalar.' },
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
      title: 'Jaleco de Fisioterapia: RPG, Pilates e Movimento 2026 | Jaleca',
      description: 'Jaleco fisioterapia com elastano para RPG, pilates e esportiva. Roupa fisioterapeuta com amplitude total de movimento, normas COFFITO. Do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco de fisioterapia com elastano: para RPG, pilates e qualquer técnica que exige movimento total do terapeuta.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para fisioterapia',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para fisioterapia',
          paragrafos: [
            'O jaleco de fisioterapia precisa de elastano — e ponto. Quem trabalha com RPG, pilates clínico ou fisioterapia esportiva sabe que o tecido sem stretch trava na hora errada. Elastano bidirecional (4-way stretch) com percentual mínimo de 6% garante que o jaleco acompanhe rotações de tronco, flexões e extensões sem criar pontos de resistência.',
            'Microfibra é excelente para fisioterapia: levíssima, respirável, seca rápido e tem superfície lisa que não acumula sujeira de mesas e macas. Composição prática: poliéster 92% + elastano 8%.',
            'Para fisioterapia aquática ou hidroterapia, tecidos com tratamento hidrófugo (repelente a água) são essenciais. Secagem em 20 a 30 minutos sem necessidade de troca entre sessões.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para fisioterapeuta',
          paragrafos: [
            'O Slim tem cava em curva anatômica que permite abdução de ombros a 180° — essencial para técnicas como RPG, Pilates clínico e mobilizações neurais onde o fisio apoia o membro do paciente acima da cabeça.',
            'O Profissional tem comprimento de manga calibrado — cobre os braços na posição de repouso mas não arrasta na maca durante técnicas de drenagem linfática manual e mobilização passiva de articulações.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na fisioterapia',
          paragrafos: [
            'Branco e tons neutros são os mais comuns — transmitem higiene em ambientes clínicos e hospitalares. Em clínicas privadas de fisioterapia, cores da identidade visual da marca são tendência e reforçam o posicionamento.',
            'Verde claro e azul são associados à reabilitação e bem-estar — cores que transmitem calma ao paciente em processo de recuperação. A paleta escolhida deve ser consistente entre toda a equipe para criar coesão visual.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e mobilidade nas sessões',
          paragrafos: [
            'Em uma sessão de 50 minutos de fisioterapia, o profissional realiza em média 80 a 120 mudanças de posição — da postura ereta para inclinação anterior, lateral e agachamento. O jaleco precisa ter corte que não crie tração lombar nessas transições.',
            'Cava com amplitude mínima de 35 cm de circunferência e costura de manga posicionada 2 cm para frente do ponto natural garantem liberdade em técnicas de terapia manual como Mulligan, McKenzie e mobilização de tecidos moles.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas COFFITO e vestimenta profissional',
          paragrafos: [
            'A Resolução COFFITO 424/2013 e o Código de Ética do Fisioterapeuta estabelecem que a vestimenta profissional deve ser adequada ao ambiente clínico — limpa, conservada e de uso exclusivo do local de trabalho.',
            'Em hospitais e clinicas multidisciplinares, o COFFITO orienta que o fisioterapeuta adote o padrão de cor ou uniforme da instituição. Em clínica própria, tem liberdade de escolha desde que a apresentação seja impecável e transmita credibilidade ao paciente.',
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
      { q: 'O elastano afeta a durabilidade do jaleco na fisioterapia?', a: 'Não. Tecidos com 4 a 8% de elastano mantêm a elasticidade por mais de 50 lavagens sem perder a forma — durabilidade ideal para a rotina clínica intensa.' },
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
      title: 'Jaleco Nutricionista: Autoridade no Consultório 2026 | Jaleca',
      description: 'Jaleco nutricionista para consultório de emagrecimento, low carb e jejum. Roupa nutricionista que passa autoridade científica. Normas CFN, do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco nutricionista: porque no consultório de emagrecimento a imagem do profissional também influencia a adesão do paciente.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para nutricionista',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para nutrição',
          paragrafos: [
            'O jaleco nutricionista para consultório precisa de tecido que não amasse em 8 horas de atendimento. Microfibra com elastano (92% poliéster + 8% elastano) é a escolha certa — seca em 15 minutos após lavagem, não amassa em consultas longas e tem superfície lisa que facilita limpeza rápida entre atendimentos de emagrecimento.',
            'Em laboratórios de técnica dietética e UAN (Unidade de Alimentação e Nutrição), onde há contato com alimentos e equipamentos de cocção, tecidos com tratamento de repelência a líquidos são indicados — protegem contra respingos de caldos e óleos quentes.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para nutricionista',
          paragrafos: [
            'O Slim funciona melhor no consultório particular — caimento elegante que valoriza a profissional sem apertar durante as avaliações. Para plicometria (medição de dobras cutâneas), o jaleco precisa ter manga que não restrinja a extensão do braço com o adipômetro.',
            'O Profissional é mais adequado para hospitais, UANs e atendimento clínico intenso — mais amplitude para movimentação entre equipamentos de bioimpedância, balança e mesa de consulta.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na nutrição',
          paragrafos: [
            'Branco é o padrão em hospitais e clínicas multidisciplinares, onde a nutricionista integra equipe de saúde. Verde e verde água são as cores mais associadas à nutrição e alimentação saudável — reforçam a especialidade.',
            'Rosê, lilás e azul claro são muito usados em consultórios de nutrição estética e emagrecimento — criam ambiente mais acolhedor e menos clínico, adequado para pacientes em tratamento emocional alimentar.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Bolsos e funcionalidade no consultório',
          paragrafos: [
            'Bolso lateral esquerdo para fita métrica (deve caber sem dobrar — mínimo 15 cm de profundidade), bolso direito para caneta e calculadora de pocket, bolso peito para estetoscópio quando atua em contexto clínico hospitalar.',
            'O jaleco precisa permitir flexão lateral completa — a plicometria de dobra subescapular e suprailíaca exige inclinação lateral do tronco com o braço estendido na horizontal. Tecido sem elastano trava esse movimento.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFN e vestimenta profissional',
          paragrafos: [
            'O CFN Resolução 380/2005 e o Código de Ética do Nutricionista determinam que a vestimenta clínica transmita higiene, seriedade e identidade profissional. Jaleco com o nome da profissional e CRN visível é recomendado em atendimento hospitalar.',
            'Em UANs e cozinhas industriais, a RDC ANVISA 216/2004 exige jaleco ou avental de uso exclusivo, touca cobrindo todo o cabelo e não uso de adornos. O jaleco da nutricionista precisa estar no padrão de manipuladora de alimentos quando em área de produção.',
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
      { q: 'O CFN exige algum modelo específico de jaleco para nutricionista?', a: 'O CFN não especifica modelo, mas orienta vestimenta higiênica de uso exclusivo no trabalho. A Resolução 380/2005 reforça a identidade profissional — jaleco é parte disso.' },
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
            'Veterinários enfrentam tripla agressão ao jaleco: pelos de animais, fluidos biológicos (sangue, urina, secreções) e desinfetantes concentrados como clorexidina, iodopovidona e quaternários de amônio. Tecido ideal: poliéster 65% + viscose 30% + elastano 5% — resiste a químicos, facilita remoção de pelos e suporta lavagem a 60°C.',
            'Tecidos com acabamento DWR (Durable Water Repellency) são recomendados para veterinários de pequenos animais — repelem fluidos na superfície antes de absorver. Para grandes animais, tecido mais pesado (gramatura 200 g/m² acima) oferece barreira mais eficiente.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para veterinário',
          paragrafos: [
            'O Slim é indicado para clínicas de pequenos animais onde a imagem profissional tem peso. Cava em curva anatômica permite alcançar o animal na mesa de exame sem tração nas costas.',
            'O Profissional é indispensável para grandes animais e cirurgias — a contenção de bovinos, equinos e suínos exige amplitude total de ombros e liberdade de tronco. Costuras reforçadas em pontos de tensão evitam rasgo durante procedimentos de força.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na veterinária',
          paragrafos: [
            'Branco é o padrão em clínicas e hospitais veterinários — transmite higiene e facilita identificar contaminações. Cinza e azul são usados para disfarçar pelos de animais de pelagem clara.',
            'Verde é a cor do centro cirúrgico veterinário por absorver menos reflexo de luz — padrão internacional adotado em HVRT (Hospitais Veterinários de Referência em Trauma). Em atendimento geral, a cor fica a critério da clínica.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na clínica',
          paragrafos: [
            'Contenção de animal envolve força muscular intensa e posições extremas — o jaleco precisa ter amplitude de cava de no mínimo 40 cm e costura de manga sem restrição. Em cirurgia, manga que não cai sobre o campo operatório é crítico.',
            'Bolso peito para lanterna clínica e otoscópio veterinário; bolso lateral direito para seringas (acesso single-hand); bolso esquerdo para luvas extras. Profundidade mínima de 18 cm para guardar seringa de 20 ml.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFMV e biossegurança',
          paragrafos: [
            'O CFMV Resolução 1138/2016 que regulamenta médicos veterinários estabelece que EPIs adequados — incluindo jaleco — são obrigatórios em atividades clínicas. A NR-32 também se aplica a veterinários em contexto hospitalar que manipulam zoonoses.',
            'Risco biológico é real na veterinária: leptospirose, brucelose, raiva, toxoplasmose e influenza aviária são transmissíveis por fluidos animais. O jaleco como barreira física é a primeira linha de defesa — nunca sair da clínica com jaleco potencialmente contaminado.',
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
      title: 'Roupa Médico: Jaleco para Telemedicina e Consultório 2026 | Jaleca',
      description: 'Roupa médico e jaleco médico para telemedicina, consultório e plantão. O branco na câmera ainda importa — normas CFM 1931/2009. Do PP ao G3 com elastano.',
    },
    hero: { subtitulo: 'Roupa médico para quem atende na câmera e no consultório: o branco certo faz diferença na primeira impressão.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para médico',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para médico',
          paragrafos: [
            'A roupa médico para telemedicina tem um detalhe que não aparece em outras profissões: o tecido precisa ficar bem na câmera. Jaleco médico branco em tecido com boa estrutura (gramatura entre 170-200 g/m²) não transparece sob luz artificial e não cria reflexo que atrapalha a imagem. Para consultório presencial, o mesmo tecido com 5-8% de elastano não amassa em 8h de atendimento.',
            'Para plantão hospitalar, scrub (conjunto calça + blusa) em poliéster antimicrobiano está em crescimento acelerado — tendência que veio dos EUA e já é realidade nos principais hospitais brasileiros. O scrub substitui o jaleco em UTI, centro cirúrgico e emergência.',
            'Gabardine poliéster para consultório particular: visual mais formal, resistente a vincos, caimento nobre. Para pediatria, tecidos em cores vibrantes ou estampas divertidas criam vínculo com a criança — reduz ansiedade e melhora adesão ao tratamento.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para médico',
          paragrafos: [
            'O Slim com corte ajustado está em alta nos consultórios particulares — transmite modernidade e cuidado com a imagem, especialmente em especialidades como dermatologia, cardiologia e medicina estética onde a aparência influencia a percepção do paciente.',
            'O Profissional longo (até o joelho) é padrão para clínicos gerais e especialistas que trabalham em hospital. Cobre bem as pernas durante procedimentos e exames físicos. O comprimento afeta a percepção de autoridade em alguns contextos culturais.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores na medicina',
          paragrafos: [
            'Branco é o código universal — transmite higiene, assepsia e seriedade em qualquer especialidade. A resolução CFM exige que o jaleco contenha nome e CRM visíveis, e que seja branco ou na cor padrão da instituição.',
            'Cores por especialidade são tendência crescente: azul para radiologia, verde para cirurgia, azul escuro para emergência, lavanda para psiquiatria. A codificação ajuda na identificação rápida em emergências hospitalares.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade',
          paragrafos: [
            'Palpação abdominal exige flexão anterior profunda com os braços estendidos — o jaleco precisa ter cava com amplitude mínima de 180° de rotação sem puxar. Em ACLS (suporte avançado de vida), o médico realiza compressões torácicas que exigem amplitude total de ombros.',
            'Bolso superior esquerdo para estetoscópio (ou gancho interno de cabo), bolso frontal para receituário, bolso lateral para reflex hammer e lanterna diagnóstica. Médicos que carregam tablet clínico precisam de bolso lateral com largura mínima de 20 cm.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFM e biossegurança',
          paragrafos: [
            'A Resolução CFM 1931/2009 (Código de Ética Médica) e a Resolução CFM 1973/2011 regulamentam que o médico deve usar jaleco identificado em ambientes de saúde. O jaleco é parte da identificação profissional — nome e CRM são obrigatórios.',
            'A NR-32 classifica o jaleco como EPI em ambientes hospitalares de risco biológico. Em surtos de infecção hospitalar (IRAS), o jaleco de uso exclusivo é protocolo de contenção — proibido sair do setor com ele. Troca após procedimentos invasivos é obrigatória.',
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
      { q: 'Qual tecido resiste melhor às lavagens hospitalares a 60°C?', a: 'Tecidos de poliéster + elastano resistem melhor. O algodão puro pode encolher em lavagens repetidas acima de 40°C — importante checar a composição antes de comprar.' },
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
      title: 'Jaleco Barbearia: Uniforme Barbeiro Guia 2026 | Jaleca',
      description: 'Jaleco barbearia e uniforme barbeiro: tecido que não retém pelos, cores escuras, estilo premium. Do hot towel shave ao corte masculino, guia completo PP ao G3.',
    },
    hero: { subtitulo: 'Uniforme barbeiro com estilo — jaleco barbearia que combina com a vibe do seu espaço.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para barbeiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para barbearia',
          paragrafos: [
            'Jaleco barbearia tem exigência específica: a superfície não pode reter pelo. Gabardine com acabamento calendrado (laminado) é a escolha técnica — os fios cortados escorregam e caem, em vez de cravar no tecido. Para uniforme barbeiro com jornadas longas, sarja pesada 200 g/m² aguenta o tranco.',
            'Tecidos com tratamento DWR repelem pomadas, gel e finalizadores que pingam durante o trabalho — produto escorrega sem absorver, limpeza em segundos com pano úmido.',
            'Para barbeiros que filmam conteúdo para redes sociais — tendência crescente nas barbearias — sarja acetinada ou gabardine com leve brilho ficam melhor em câmera que tecidos opacos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para barbeiro',
          paragrafos: [
            'O Slim é o visual dominante nas barbearias premium — combina com a estética curada das barbershops modernas. A manga precisa ter cava ampla para levantar os braços acima da cabeça sem puxar a roupa de baixo.',
            'O Profissional é mais confortável para jornadas longas (8-10h) com muitos cortes — sem apertar na axila após horas com os braços levantados. Escolha depende do volume de clientes vs. posicionamento da barbearia.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para barbeiro',
          paragrafos: [
            'Preto domina nas barbearias — combina com qualquer decoração, disfarça pelos de todas as cores e tem apelo visual forte no Instagram e TikTok.',
            'Branco está voltando nas barbearias minimalistas e premium — transmite higiene cirúrgica e contrasta bem com decoração industrial. Navy blue é a terceira opção mais popular para quem quer sair do preto.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na barbearia',
          paragrafos: [
            'O barbeiro passa 6-8h com os braços levantados acima de 90° — cortar, aparar, aplicar finalizador. Abdução de ombro continuada causa fadiga e dor. O jaleco precisa ter cava recuada e costura de manga 3 cm para frente do eixo natural do ombro.',
            'Bolso peito com divisória para tesoura e pente de acabamento; bolso lateral com abertura larga para máquina de corte (acesso com uma mão); bolso interno para celular — acesso ao conteúdo e app de agendamento sem parar o trabalho.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação na barbearia',
          paragrafos: [
            'A Vigilância Sanitária fiscaliza barbearias segundo a RDC ANVISA 22/2021 para serviços de estética — exige uniforme limpo e identificável. Jaleco sujo em fiscalização é evidência de descumprimento e pode resultar em autuação.',
            'Barbearias que acumulam avaliações negativas sobre higiene têm queda direta no ranking do Google Maps — e o jaleco do profissional é um dos primeiros elementos que o cliente fotografa e comenta.',
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
      { q: 'Qual tecido não agarra pelo cortado para barbeiro?', a: 'Gabardine com acabamento calendrado (superfície laminada) repele pelos cortados. Evite tecidos com trama aberta ou felpudos — pelos cravam e são difíceis de remover.' },
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
      title: 'Jaleco para Tatuador: Higiene e Estilo no Estúdio 2026 | Jaleca',
      description: 'Jaleco para tatuador: tecido resistente a tinta, biossegurança ANVISA, estilo para estúdio. Uniforme tatuador higiene do PP ao G3 — RDC 56/2010.',
    },
    hero: { subtitulo: 'Proteção e estilo para longas sessões — jaleco para tatuador que respeita a biossegurança.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para tatuador',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para estúdio de tatuagem',
          paragrafos: [
            'Jaleco para tatuador precisa resistir à tinta antes de tudo. Pigmentos orgânicos e metais pesados mancham permanentemente se não tratados em 5 minutos — tecido escuro (preto ou grafite) é escolha inteligente para o uniforme tatuador higiene do dia a dia no estúdio.',
            'Composição ideal: poliéster 90% + elastano 10% em tecido escuro — não absorve tinta com a mesma facilidade que algodão, fácil de limpar com água fria imediatamente após o respingo.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para tatuador',
          paragrafos: [
            'O Slim combina com a identidade visual dos estúdios modernos e fica bem no conteúdo de redes sociais — onde muitos tatuadores constroem sua clientela.',
            'O Profissional dá mais amplitude para ângulos difíceis: tatuar a parte interna do braço, a coluna ou o tornozelo exige que o tatuador se incline em posições extremas por longos períodos.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para tatuador',
          paragrafos: [
            'Preto é o padrão absoluto nos estúdios de tatuagem — combina com a estética do setor, disfarça tinta e tem apelo visual forte nas fotos do Instagram.',
            'Grafite, cinza escuro e azul navy são as alternativas para quem quer variar sem perder o lado profissional. Evite branco ou cores claras — a tinta é quase impossível de remover.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade no estúdio',
          paragrafos: [
            'Uma sessão de 4-6 horas exige que o tatuador se mantenha inclinado sobre o cliente em posições fixas prolongadas. O jaleco precisa ter stretch de 4 vias para não criar tensão muscular nas costas e ombros.',
            'Sem bolsos frontais que pressionem a máquina de tatuar ou os copos de tinta quando o artista se inclina — bolso lateral ou interno é mais funcional.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e biossegurança no estúdio',
          paragrafos: [
            'A RDC ANVISA 56/2010 regulamenta estúdios de tatuagem e piercing e exige que o profissional use EPI adequado — jaleco, luvas, máscara e óculos de proteção em procedimentos com risco de exposição a sangue.',
            'O jaleco cria barreira biológica nível 1 — protege a roupa e a pele do tatuador contra contato com sangue do cliente. Troca entre sessões é protocolo de biossegurança obrigatório.',
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
      { q: 'A ANVISA exige jaleco para tatuadores?', a: 'Sim. A RDC 56/2010 da ANVISA regulamenta estúdios de tatuagem e exige EPI adequado — jaleco é parte da biossegurança obrigatória no procedimento.' },
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
      title: 'Jaleco Estética: Uniforme Esteticista Clínica 2026 | Jaleca',
      description: 'Jaleco estética para esteticista: elegância, higiene e conforto na cabine. Jaleco para esteticista com elastano — tratamentos faciais, corporais e cosméticos. PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco estética que eleva a percepção da cliente antes de você falar uma palavra.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para esteticista',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para clínica de estética',
          paragrafos: [
            'Jaleco estética de microfibra 92% poliéster + 8% elastano é o padrão nas clínicas premium — não amassa durante 8h de procedimentos, seca em 20 minutos e repele óleos essenciais e géis que fazem parte da rotina de tratamentos faciais e corporais.',
            'Tecidos com tratamento antimicrobiano são indicados para esteticistas que realizam procedimentos invasivos como microagulhamento, peeling químico e limpeza de pele — reduzem risco de contaminação cruzada entre cliente e profissional.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para esteticista',
          paragrafos: [
            'O Slim acinturado é a escolha dominante nas clínicas de estética — valoriza a silhueta e faz parte da identidade visual do espaço. A cliente avalia a esteticista por inteiro, e o jaleco com caimento elegante comunica padrão.',
            'Para procedimentos corporais (drenagem, massagem redutora), o Profissional com manga mais folgada permite força de aplicação sem restrição. Procedimentos faciais não exigem tanta amplitude — o Slim serve perfeitamente.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para esteticista',
          paragrafos: [
            'Branco, lavanda, rosê e verde menta são as paletas mais usadas em clínicas de estética — transmitem leveza, feminilidade e bem-estar. A cor certa reforça o posicionamento da clínica.',
            'Clínicas de estética médica (laser, peelings, procedimentos minimamente invasivos) tendem ao branco — mais alinhado ao ambiente clínico que as clientes esperam nesses serviços.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade nos procedimentos',
          paragrafos: [
            'Drenagem linfática manual, massagem modeladora e procedimentos corporais exigem amplitude total de ombros e força aplicada com os braços. O jaleco não pode criar tensão axilar nesse trabalho.',
            'Para procedimentos faciais com equipamentos (radiofrequência, HIFU, microagulhamento), bolsos laterais profundos guardam ponteiras e acessórios sem precisar ir até a bancada.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação na estética',
          paragrafos: [
            'A RDC ANVISA 56/2010 estabelece requisitos sanitários para serviços de estética: uniforme limpo e exclusivo, EPIs adequados e desinfecção de superfícies. Jaleco sujo em fiscalização é infração passível de autuação.',
            'A ABIH e entidades de estética orientam que o jaleco seja trocado a cada cliente em procedimentos com fluidos corporais (drenagem, esfoliação). O cliente percebe e associa higiene à qualidade do serviço.',
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
      { q: 'A RDC 56/2010 da ANVISA se aplica a esteticistas?', a: 'Sim. A resolução que regulamenta serviços de estética exige EPI adequado, jaleco incluso. Clínicas fiscalizadas precisam manter a equipe uniformizada e o jaleco em boas condições.' },
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
      title: 'Jaleco Massagem: Uniforme Massagista Mobilidade 2026 | Jaleca',
      description: 'Jaleco massagem e uniforme massagista: tecido leve com elastano, liberdade total de movimento. Uniforme spa premium do PP ao G3 — massagem relaxante e terapias corporais.',
    },
    hero: { subtitulo: 'Jaleco massagem com mobilidade real — uniforme massagista que acompanha cada técnica.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para massagista',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para massoterapia',
          paragrafos: [
            'Jaleco massagem precisa de stretch de 4 vias — técnicas como lomi lomi, shiatsu e drenagem linfática exigem amplitude de ombros acima de 180°. Uniforme massagista com elastano de 8-10% garante esse range sem rasgar e sem prender o movimento.',
            'Microfibra de baixa gramatura (130-150 g/m²) é ideal — leve para não esquentar durante o esforço físico da massagem, seca rápido após lavagem e não retém odor de óleos essenciais com a mesma intensidade que algodão.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para massagista',
          paragrafos: [
            'O Profissional com cava ampla e manga sem costura de restrição é a escolha técnica certa — permita abdução máxima durante pressões profundas e effleurage com força.',
            'O Slim serve bem para massagem facial e drenagem leve — procedimentos que não exigem força intensa. O caimento elegante reforça o posicionamento premium do spa.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para massagista',
          paragrafos: [
            'Branco, bege, areia e azul lavanda são as cores dominantes em spas e centros de bem-estar — transmitem calma, pureza e ambiente terapêutico. Cores quentes como laranja ou vermelho criam tensão visual no ambiente de relaxamento.',
            'Para massoterapia clínica (fisiatria, reabilitação), branco ou azul hospitalar — o contexto clínico exige visual mais formal que o spa.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e mobilidade nas sessões',
          paragrafos: [
            'O massagista aplica força média de 3-8 kgf em técnicas de pressão profunda — Swedish, deep tissue e Tuiná. Esse esforço com os braços estendidos exige que o jaleco tenha comprimento calibrado que não suba durante a aplicação.',
            'Sem bolsos frontais volumosos que pressionem a maca ao se inclinar. Bolso lateral slim ou bolso interno para celular (música, timer de sessão) são as opções ergonômicas.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação no spa',
          paragrafos: [
            'A ABRATH (Associação Brasileira de Terapeutas Holísticos) orienta troca de jaleco entre clientes — óleos essenciais carregam cheiros que o próximo cliente percebe. Jaleco limpo é parte do protocolo de bem-estar.',
            'Spas certificados pela SPAS Association Brasil exigem uniforme padronizado da equipe como critério de qualidade. O jaleco da massagista impacta diretamente a avaliação de estrelas na certificação.',
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
      { q: 'Jaleco com elastano funciona em técnicas como shiatsu e lomi lomi?', a: 'Sim. Tecidos com 6 a 10% de elastano têm stretch de 4 vias — acompanham os movimentos amplos do shiatsu e do lomi lomi sem restringir os braços.' },
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
      title: 'Jaleco para Cabeleireiro: Uniforme Salão Beleza 2026 | Jaleca',
      description: 'Jaleco para cabeleireiro: proteção contra tinta, descolorante e químicos. Uniforme cabeleireiro para salão — transição capilar, alisamento e queda de cabelo. PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco para cabeleireiro que protege de tinta e químicos — uniforme cabeleireiro com estilo no salão.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para cabeleireiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para salão de beleza',
          paragrafos: [
            'Jaleco para cabeleireiro precisa de tratamento antiestático — sem ele, os fios cortados grudam no tecido o dia inteiro. Uniforme cabeleireiro com gabardine tratada resolve: os cabelos deslizam e caem ao chão em vez de ficar presos no tecido.',
            'Resistência química é crítica: água oxigenada (H₂O₂) em 20, 30 e 40 volumes, amônia e formol degradam fibras naturais ao longo do tempo. Poliéster de alta densidade resiste muito mais que algodão ou viscose a esses oxidantes.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para cabeleireiro',
          paragrafos: [
            'O Slim com cava anatômica é o modelo certo para salões premium — estética impecável e liberdade de braço para trabalhar acima da cabeça sem mostrar a roupa de baixo.',
            'O Profissional é mais confortável para jornadas de 10h+ com muitos clientes — sem apertar embaixo do braço após horas de trabalho. Ambos funcionam bem; escolha pelo volume de atendimento.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para cabeleireiro',
          paragrafos: [
            'Preto é o mais popular — combina com tudo, disfarça qualquer mancha de produto e tem apelo visual moderno nas redes sociais. Navy, grafite e vinho são as alternativas mais escolhidas.',
            'Branco funciona em salões com identidade clean e minimalista — transmite higiene impecável mas exige mais cuidado com tintura. Amarelo acridina do colorista pode manchar permanentemente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e conforto no salão',
          paragrafos: [
            'O cabeleireiro mantém os braços acima de 90° por 6-8h por dia — principal causa de síndrome do manguito rotador na profissão. Jaleco com cava recuada e manga com costura anatômica reduz a tensão acumulada nos ombros.',
            'Bolso lateral com divisória para tesoura de acabamento, navalha e escovas pequenas; bolso peito para caneta e grampos. Tudo acessível sem abaixar os braços durante o atendimento.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e apresentação no salão',
          paragrafos: [
            'A RDC ANVISA 22/2021 e normas estaduais de vigilância sanitária exigem que profissionais de beleza usem uniforme limpo e adequado. Salões que descumprem podem ter alvará suspenso em fiscalização.',
            'O jaleco da equipe é o primeiro elemento de higiene que o cliente avalia — antes de sentar na cadeira, observa quem vai atendê-lo. Jaleco bem conservado e sem manchas visíveis é fator de decisão de retorno.',
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
      { q: 'Jaleco protege contra produtos oxidantes como água oxigenada e amônia?', a: 'Sim. Tecidos densos criam barreira física contra respingos. Lave com sabão neutro logo após o expediente — resíduos de oxidantes acumulados degradam o tecido ao longo do tempo.' },
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
            'Brim pesado (gramatura 200-240 g/m²) é o tecido tradicional para churrasco profissional — durável, resistente a respingos de gordura quente e suporta lavagem a 60°C para higienização alimentar. A desvantagem é o calor: em dias quentes, o brim pesa.',
            'Gabardine poliéster com tratamento DWR é a alternativa moderna — mais leve que brim, repele gordura antes de absorver e seca em 20 minutos. Para buffets premium onde a apresentação importa, o caimento do gabardine é superior.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para churrasqueiro',
          paragrafos: [
            'O Slim é adequado para buffets de alto padrão onde o churrasqueiro interage diretamente com os convidados — aparência cuidada faz parte do serviço premium.',
            'O Profissional com manga regulável (botão ou viés) é mais funcional no trabalho ativo — permite enrolar as mangas para o corte e abaixá-las na presença dos clientes.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para churrasqueiro',
          paragrafos: [
            'Preto e grafite disfarçam respingos de gordura e marcas de fumaça — as cores mais práticas para quem trabalha com brasa e calor.',
            'Branco é exigência de higiene em churrascarias formais e eventos gastronômicos certificados — transmite assepsia para os clientes. Com tratamento DWR, a gordura respinga mas não absorve.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na churrascaria',
          paragrafos: [
            'Cortar peças grandes (picanha, costela, fraldinha) exige força e amplitude de braço. Jaleco com cava larga e manga que não sobe durante os cortes é crítico para um trabalho fluido.',
            'Bolso lateral profundo para termômetro de carne, anotações e pequenos utensílios — sem precisar parar para ir até a bancada em serviços de buffet.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e segurança alimentar',
          paragrafos: [
            'A RDC ANVISA 216/2004 (serviços de alimentação) e a Lei 1.283/1950 (inspeção industrial de alimentos) exigem uniformes limpos, exclusivos e trocados diariamente para manipuladores de alimentos em buffets, restaurantes e eventos.',
            'Vigilância sanitária municipal fiscaliza churrascarias e buffets regularmente — jaleco sujo ou inadequado é infração sanitária. Equipamentos de proteção (luvas e avental) completam o kit obrigatório.',
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
      { q: 'O jaleco substitui o avental para churrasqueiro?', a: 'Não. O avental de couro ou algodão pesado é EPI para calor intenso da brasa. O jaleco é vestimenta de higiene e apresentação — os dois se usam juntos na churrascaria profissional.' },
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
      title: 'Dólmã para Sushiman: Higiene e Apresentação 2026 | Jaleca',
      description: 'Dólmã para sushiman e uniforme de cozinha japonesa: tecido resistente a molhos, higiene para manipulação de alimentos, roupa certa para quem trabalha com sushi. Guia completo.',
    },
    hero: { subtitulo: 'Dólmã para sushiman com higiene e estilo: o uniforme certo para quem trabalha com comida japonesa.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para sushiman',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para cozinha oriental',
          paragrafos: [
            'A dólmã para sushiman precisa passar no teste da higiene antes de qualquer outra coisa. Peixe cru, vinagre de arroz e shoyu — o uniforme de cozinha japonesa está em contato direto com tudo isso. Gabardine 150-180 g/m² é o tecido dominante na gastronomia oriental. Poliéster 65% / viscose 35% — caimento limpo e respiração adequada para trabalho em temperatura ambiente controlada de um sushi counter.',
            'Para sushimans que atuam em cozinhas mistas, tecidos com tratamento DWR (Durable Water Repellency) são vantagem real: respingo de shoyu e vinagre de arroz saem com um pano úmido — o jaleco chega intacto até a troca do turno.',
            'Evite tecidos grossos como brim 240 g/m² para cozinhas de sushi. O sushiman faz movimentos de corte rápidos e precisos — manga pesada trava o punho e cansa o ombro em jornadas de 6+ horas de fatiamento.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para sushiman',
          paragrafos: [
            'Manga longa com punho firme é a escolha de sushimans que trabalham com peixe cru — protege o pulso durante o fatiamento e dá firmeza ao movimento. No verão, manga ¾ é uma alternativa funcional.',
            'O Slim tem manga tubular próxima ao corpo — não bate na bancada nem no peixe durante o corte. O Profissional tem manga mais larga — boa ventilação em cozinhas sem ar-condicionado regulado.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para sushiman',
          paragrafos: [
            'Branco é o mais usado nos sushi counters — transmite ao cliente que o ambiente é limpo e os produtos são frescos. No contexto de manipulação de proteína crua, branco é também um controle visual de contaminação.',
            'Preto ganhou espaço nos restaurantes japoneses modernos e fusion. Disfarça manchas leves de shoyu durante o serviço e mantém o visual profissional mesmo no rush do jantar.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na cozinha',
          paragrafos: [
            'O movimento de corte do sushiman envolve flexão do punho e rotação do ombro repetidos — a cava do jaleco precisa ter amplitude para essa rotação sem criar tração lateral nas costas ao longo de horas de trabalho.',
            'Bolso no peito para anotações e pedidos é prático. Para facas e utensílios, o sushiman usa as bancadas — bolsos laterais devem ser rasos para não acumular resíduos de alimento entre os atendimentos.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e vigilância sanitária',
          paragrafos: [
            'A RDC ANVISA 216/2004 exige que manipuladores de alimentos usem uniforme limpo, exclusivo para trabalho, e não circulem fora do ambiente de produção. Peixe cru tem protocolo específico: jaleco nunca sai da área de preparo.',
            'A legislação de segurança alimentar que inspira muitas operações de sushi no Brasil também orienta uso de jaleco de manga longa durante a manipulação de proteínas cruas — combinado com luvas descartáveis para cada cliente atendido.',
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
      { q: 'A RDC 216/2004 da ANVISA exige jaleco para sushiman?', a: 'Sim. A norma de serviços de alimentação exige uniformes limpos e em boas condições para manipuladores de alimentos, trocados diariamente.' },
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
      title: 'Dólmã de Chef: Roupa de Cozinheiro Profissional 2026 | Jaleca',
      description: 'Dólmã de chef e roupa de cozinheiro profissional: dólmã cozinheiro para alta gastronomia, personal chef e eventos. Proteção contra calor, tecido resistente, do PP ao G3.',
    },
    hero: { subtitulo: 'Dólmã de chef ou roupa de cozinheiro profissional: o uniforme que aguenta o rush sem perder o caimento.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para cozinheiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para cozinha profissional',
          paragrafos: [
            'Dólmã de chef e roupa de cozinheiro profissional são escolhas diferentes para contextos diferentes. A dólmã tem abotoamento duplo e manga com estrutura — padrão da alta gastronomia. O jaleco é mais leve e prático para cozinhas de rotina rápida. Brim pesado (gramatura 200-240 g/m²) é o tecido tradicional para cozinhas profissionais. A trama densa cria barreira contra respingos de óleo quente — o impacto é dissipado pela fibra antes de atingir a pele.',
            'Gabardine poliéster com tratamento DWR é a alternativa moderna para cozinhas que priorizam leveza. O calor gerado por fogões industriais em jornadas longas torna a gramatura um fator de conforto: 150-170 g/m² respira melhor do que brim 240 g/m².',
            'Em cozinhas de alto volume, a lavagem é frequente — às vezes diária. Tecidos com >50% poliéster secam em metade do tempo do algodão e não encolhem após ciclos de lavagem a 60°C recomendados pela vigilância sanitária.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para cozinheiro',
          paragrafos: [
            'Fenda lateral aberta no Profissional permite alcançar bancadas baixas e regar panelas altas sem o jaleco criar tensão nos ombros. É o modelo para cozinhas de alto volume com jornadas de 10+ horas.',
            'O Slim funciona bem em restaurantes fine dining onde o cozinheiro interage com os clientes na cozinha aberta — caimento preciso transmite o cuidado que é parte da experiência gastronômica.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para cozinheiro',
          paragrafos: [
            'Branco clássico para higiene — em cozinhas profissionais, branco sujo indica que o uniforme precisa de troca. Essa função visual de controle de qualidade é parte dos protocolos de segurança alimentar.',
            'Preto e cinza são cada vez mais comuns em cozinhas contemporâneas — a estética de chef se tornou parte da identidade gastronômica e da experiência do cliente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na cozinha',
          paragrafos: [
            'O cozinheiro levanta os braços acima do ombro com frequência — para alcançar prateleiras, mexer panelas em altura e usar campanas de exaustão. O jaleco precisa de cava profunda que permita esse arco sem puxar a camisa por baixo.',
            'Bolso no peito para termômetro de carne e caneta. Bolso lateral fundo no Profissional guarda pano de copa para proteção rápida de alças quentes — acesso em menos de 2 segundos no meio do rush.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene e segurança alimentar',
          paragrafos: [
            'A RDC ANVISA 216/2004 define que o jaleco é parte do uniforme obrigatório — limpo, trocado diariamente, e nunca usado fora do ambiente de trabalho ou em banheiros. A vigilância sanitária municipal fiscaliza esse protocolo in loco.',
            'A Portaria 326/1997 de Boas Práticas de Fabricação (BPF) exige que todo manipulador em cozinha industrial use vestuário exclusivo de trabalho, lavado e guardado separado de roupas pessoais.',
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
      { q: 'O que a RDC 216/2004 exige de cozinheiros sobre uniforme?', a: 'Uniformes exclusivos de trabalho, trocados diariamente, lavados e guardados separados da roupa pessoal. Sem adornos sobre o jaleco. Cabelo coberto obrigatoriamente.' },
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
      title: 'Roupa para Professor: Jaleco e Uniforme com Autoridade | Jaleca',
      description: 'Roupa para professor e uniforme professor: jaleco para sala de aula presencial, EAD e laboratório. Roupa professor com autoridade visual, confortável para longas jornadas. Do PP ao G3.',
    },
    hero: { subtitulo: 'Roupa para professor que funciona: jaleco e uniforme professor para sala de aula, EAD e laboratório.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para professor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para professor',
          paragrafos: [
            'Roupa para professor é um dos termos mais buscados no Google quando o assunto é uniforme de educação — e faz sentido. O professor precisa de uma peça que funcione tanto na sala de aula quanto em frente à câmera no EAD. O uniforme professor mais usado é o jaleco, pela praticidade de colocar sobre qualquer roupa e pelo sinal de autoridade que transmite. Microfibra leve (gramatura 120-150 g/m²) é excelente para professores que passam o dia em sala — leve, não cansa nos ombros e aguenta lavagens semanais sem perder forma ao longo de meses de uso.',
            'Blends com elastano bidirecional (4-6%) são os mais práticos para ensino. O professor gesticula, aponta, escreve na lousa — o tecido precisa acompanhar sem criar tensão ou puxar a camisa por baixo.',
            'Em laboratórios de ciências, química ou biologia: a ABNT NBR 14787 recomenda jaleco de algodão ou algodão/poliéster de manga longa — algodão não propaga chama como sintéticos puros, reduz risco em acidentes com reagentes inflamáveis diluídos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para professor',
          paragrafos: [
            'O Slim funciona muito bem para sala de aula — visual de autoridade sem excesso de tecido. Para professores universitários e de ensino médio, o corte moderno reforça a seriedade sem criar distância com os alunos.',
            'Para laboratórios de ciências e ensino técnico: o Profissional com manga longa é a opção mais segura. Protege mais área de pele e tem amplitude para movimentos na bancada e em equipamentos.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para professor',
          paragrafos: [
            'Branco é obrigatório em muitos laboratórios escolares — facilita a identificação de contaminantes e reforça os protocolos de segurança. Para sala de aula regular, não há norma específica.',
            'Azul marinho, cinza e verde escuro são escolhas comuns em uniformes de instituições de ensino — sobrepõem bem com calças de qualquer cor e mantêm apresentação sóbria durante o dia inteiro.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade em aula',
          paragrafos: [
            'Três bolsos são o mínimo para o professor: peito para marcador, lateral esquerda para o celular/controle de apresentações e lateral direita para chaves e materiais pequenos do dia.',
            'O professor entra e sai de salas diferentes ao longo do dia. Fechamento por botão de pressão ou snap é mais prático do que zíper em entradas e saídas rápidas entre aulas.',
          ],
        },
        {
          id: 'normas', titulo: 'Uso do jaleco na educação',
          paragrafos: [
            'A LDB (Lei 9.394/1996) não regulamenta vestimenta de professores. As diretrizes são institucionais — cada escola ou universidade define o padrão. Em laboratórios de química e biologia: jaleco é equipamento de segurança obrigatório.',
            'A NR-6 (EPIs obrigatórios) e a ABNT NBR 14787 são as referências para laboratórios escolares. Jaleco de manga longa, fechado na frente, sem bolsos externos abertos e de material com resistência a chamas são os critérios técnicos.',
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
      { q: 'Jaleco de professor de laboratório precisa de manga longa?', a: 'Sim. Em labs de química e biologia, manga longa é obrigatória por normas de biossegurança (ABNT NBR 14787). Protege contra respingos de reagentes e ácidos diluídos.' },
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
      title: 'Jaleco de Loja: Roupa de Vendedor que Gera Confiança 2026 | Jaleca',
      description: 'Jaleco de loja e roupa de vendedor: jaleco para loja que padroniza a equipe e aumenta a confiança do cliente. Jaleco para vendedor com elastano, do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco de loja: o uniforme do vendedor que a equipe usa e o cliente confia.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para vendedor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para loja',
          paragrafos: [
            'Jaleco de loja é a roupa de vendedor mais usada no varejo brasileiro — de farmácia a loja de roupa, de pet shop a ótica. Ele padroniza a equipe, facilita a identificação pelo cliente e aumenta a percepção de confiança na marca. Gabardine 150-165 g/m² com elastano bidirecional (4-6%) é o melhor custo-benefício para vendedores. O caimento é limpo — sem vincos após horas na cadeira de atendimento — e o elastano garante que o jaleco não aperta nos ombros quando o vendedor se abaixa para mostrar produtos.',
            'Tecidos com tratamento antivinco são recomendados para equipes de vendas. O jaleco amassa na cadeira, no carro entre visitas, em reuniões longas — sem tratamento especial, perde a apresentação antes da metade do turno.',
            'Poliéster 100% seca rápido e resiste bem a lavagens — prático para equipes que trabalham 6 dias por semana. Em lojas sem ar-condicionado regulado, blends com viscose (65/35) melhoram o conforto térmico.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para vendedor',
          paragrafos: [
            'O Slim em vendas tem função psicológica documentada: apresentação impecável aumenta a percepção de credibilidade e competência pelo cliente — o que se traduz em conversão maior especialmente em decisões de compra de valor mais alto.',
            'O Profissional é a escolha para vendedores que se movem muito — técnicos de vendas externos, demonstradores em feiras ou representantes que carregam mostruários. O corte mais folgado nos ombros evita cansaço acumulado.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para vendedor',
          paragrafos: [
            'A cor do jaleco precisa seguir o manual de identidade visual da empresa. Em redes varejistas — farmácias, óticas, pet shops, lojas de roupa — o jaleco é parte do branding: a equipe uniformizada reforça a padronização e a confiança da marca.',
            'Para profissionais autônomos e consultores de vendas: branco, cinza e azul marinho transmitem autoridade sem sobrecarregar a comunicação não-verbal com o cliente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e conforto em loja',
          paragrafos: [
            'Vendedores ficam em pé entre 6 e 10 horas por dia. O jaleco com elastano faz diferença real: o tecido com recuperação de forma não deixa marcas de pressão nos ombros nem cria "balão" na frente ao sentar entre atendimentos.',
            'Bolso no peito para caneta e bloco de anotações — acesso imediato durante a venda é velocidade. Bolso lateral fundo para tablet ou pasta fina de catálogo é o diferencial do Profissional para vendas consultivas.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e identidade da marca',
          paragrafos: [
            'O CDC (Lei 8.078/1990) não exige uniforme específico, mas muitas redes varejistas definem cor, modelo e condições de uso do jaleco em regulamento interno de trabalho.',
            'Setores regulamentados como farmácias (RDC ANVISA 44/2009) e óticas têm normas específicas para o atendente — o jaleco é obrigatório como elemento de identificação profissional perante o cliente.',
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
      { q: 'Jaleco com elastano aguenta jornada de 10 horas em pé?', a: 'Sim. Tecidos com elastano bidirecional mantêm o formato e não apertam ao longo do dia — conforto real para quem está em pé no atendimento por longas horas.' },
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
      title: 'Roupa para Advogado: Jaleco e Conjunto com Autoridade | Jaleca',
      description: 'Roupa para advogado: jaleco e conjunto para advogado no tribunal, audiências e escritório. Roupa advogado que aguenta o dia inteiro e transmite credibilidade. Do PP ao G3.',
    },
    hero: { subtitulo: 'Roupa para advogado: jaleco e conjunto que transmitem autoridade no tribunal e no escritório.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para advogado',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para escritório jurídico',
          paragrafos: [
            'Roupa para advogado no tribunal é a pesquisa que cresce quando a OAB tem aumento de inscrições — e o profissional percebe que a apresentação visual é parte da credibilidade que o cliente está contratando. O conjunto para advogado e o jaleco são as duas opções mais usadas no dia a dia jurídico. Gabardine 150-170 g/m² com poliéster ou viscose é a composição mais indicada para advogados. O caimento é sóbrio e a resistência a vincos aguenta audiências que se estendem por horas — o jaleco precisa estar impecável quando o cliente está sob pressão emocional.',
            'Malha de poliéster texturizado com leve trama diagonal imita visualmente o gabardine de alfaiataria. É a escolha para quem quer caimento premium sem o peso de tecidos mais nobres — prático em escritórios onde o jaleco é usado 8-10 horas por dia.',
            'Tecidos 100% algodão não são recomendados para ambiente jurídico — amassam rápido e perdem a apresentação em reuniões longas. Blends poliéster/viscose (65/35) têm o caimento do algodão sem a tendência a vincos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para advogado',
          paragrafos: [
            'O Slim tem linha estruturada nos ombros — visual de autoridade que reforça a percepção de competência em atendimentos onde o cliente está contratando credibilidade.',
            'Para advogados que passam horas em audiências — de pé, sentados, virando para documentos e interagindo com o juiz — o Profissional tem amplitude nos ombros e cava mais funda que elimina a tensão acumulada na região cervical.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para advogado',
          paragrafos: [
            'Preto, azul marinho e cinza chumbo são as cores do ambiente jurídico formal. Combinam com qualquer paleta de roupa de baixo e transmitem seriedade ao cliente em um contexto de alto impacto emocional e financeiro.',
            'Branco tem espaço em escritórios modernos e boutiques jurídicas — especialmente em cidades com clima quente. A aposta no branco funciona quando a identidade visual valoriza acessibilidade e modernidade em vez de formalidade clássica.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e conforto no escritório',
          paragrafos: [
            'O advogado alterna entre mesa (digitando, folheando processos), em pé (falando com juízes e partes) e transporte — o jaleco acompanha tudo isso. Tecido com recuperação rápida, que volta ao caimento original após horas sentado, é critério diferenciador.',
            'Dois bolsos externos rasos são suficientes para o escritório. Caneta no peito, cartão de visitas acessível. Evitar bolsos fundos cheios — criam volume que prejudica o caimento e a autoridade visual.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e ética profissional',
          paragrafos: [
            'A OAB não possui Provimento que regulamente vestimenta do advogado. O Código de Ética e Disciplina da OAB (Res. 02/2015) faz referência genérica a "traje adequado" para audiências — a decisão é discricionária do profissional.',
            'Em sessões do Tribunal do Júri: alguns tribunais possuem regulamentos internos que exigem traje formal. Consultar o regimento interno da vara antes da audiência para não ter a entrada negada na sala.',
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
      { q: 'O jaleco precisa de fechamento completo para o escritório jurídico?', a: 'Depende do estilo. Modelos abertos transmitem modernidade, fechados passam autoridade tradicional. Ambos são bem aceitos em escritórios — o que importa é o caimento impecável.' },
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
      title: 'Uniforme Pastor: Roupas para Ministério e Cultos 2026 | Jaleca',
      description: 'Uniforme pastor e roupas para ministério: jaleco e conjunto para pastor em cultos, batismos e cerimônias. Roupas ministério com dignidade e elegância. Do PP ao G3.',
    },
    hero: { subtitulo: 'Roupas para ministério e uniforme pastor: jaleco e conjunto para cultos, cerimônias e aconselhamento.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para pastor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o ministério',
          paragrafos: [
            'Roupas para ministério precisam comunicar reverência sem pesar nos ombros durante cultos que podem durar 3 horas. Uniforme pastor é um mercado que cresceu junto com o evangelismo — cada denominação tem sua tradição, mas o jaleco branco é o ponto em comum. Gabardine com toque suave (viscose 35% / poliéster 65%) tem caimento que "flui" sobre o corpo — visual cerimonial adequado ao ministério. A composição resiste a vincos durante cultos que duram de 2 a 4 horas seguidas.',
            'Gramatura 150-165 g/m² equilibra elegância e conforto térmico — igrejas têm variação de temperatura significativa entre salas de reunião, santuário e atividades externas. Um jaleco muito pesado fatiga em cultos noturnos longos.',
            'Jalecos de cetim leve ou poliéster brilhoso não são recomendados para uso pastoral — o brilho excessivo remete a look de festa e pode criar inconsistência visual com a solenidade do ministério.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para pastor',
          paragrafos: [
            'O Slim tem linha estruturada que valoriza a figura sem excesso de volume — transmite autoridade espiritual sem criar distância física com a congregação.',
            'O Profissional, com manga levemente mais ampla, é mais confortável para pastores que ministram adoração com braços levantados por longos períodos. A cava mais funda também reduz cansaço durante pregações de 45 a 90 minutos em pé.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para pastor',
          paragrafos: [
            'Branco é o mais associado ao jaleco pastoral no Brasil — simboliza santidade, separação e missão. Em cerimônias de batismo, crisma e ordenação, o branco é quase universalmente adotado nas denominações evangélicas.',
            'Preto, roxo e azul marinho são usados por denominações com tradições litúrgicas mais formais. Pastores que atuam em múltiplas igrejas optam por neutros que funcionam em qualquer contexto denominacional.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto em cerimônias longas',
          paragrafos: [
            'Pastores que pregam gesticulam intensamente — braços estendidos, levantados, posição de bênção. O jaleco precisa de cava funda e manga com amplitude para essa gesticulação sem criar pressão axilar que cansa após 20 minutos de pregação.',
            'Para quem ministra em pé por mais de 1 hora: jaleco leve (abaixo de 165 g/m²) faz diferença perceptível no cansaço acumulado. A diferença de 100g em gramatura se multiplica ao longo de um culto inteiro.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e reverência',
          paragrafos: [
            'Nenhum conselho ou órgão regulador define vestimenta pastoral no Brasil. A escolha é guiada pela tradição denominacional, manual de liturgia da denominação e estética do ministério.',
            'Em cultos ecumênicos e eventos inter-denominacionais: jaleco branco é a escolha que funciona em qualquer contexto — reconhecida como símbolo ministerial universal no contexto cristão evangélico brasileiro.',
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
      { q: 'Qual diferença entre jaleco pastoral e jaleco hospitalar?', a: 'O jaleco pastoral prioriza caimento cerimonial — tecidos nobres e linha elegante. O hospitalar foca em biossegurança e resistência a químicos. São modelos pensados para fins distintos.' },
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
      title: 'Jaleco de Psicologia: Roupa para Psicóloga no Consultório | Jaleca',
      description: 'Jaleco de psicologia e roupa para psicóloga: jaleco psicologia para setting terapêutico, terapia online e consultório. Cores neutras, conforto para sessões longas. Do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco de psicologia: a roupa da psicóloga que muda a dinâmica do setting terapêutico.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para psicólogo',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o consultório',
          paragrafos: [
            'Jaleco de psicologia é diferente do jaleco clínico. Não é sobre biossegurança — é sobre setting. A roupa da psicóloga comunica ao paciente que ele está num espaço de cuidado, com um profissional preparado. Estudos em saúde mental mostram que o jaleco de psicologia reduz resistência no início do tratamento, especialmente em casos de depressão e ansiedade. Microfibra leve (120-140 g/m²) com elastano 4-6% é a composição ideal para o consultório — o psicólogo fica sentado por 45 a 50 minutos consecutivos e o tecido não pode criar pressão nos quadris ou apertar no tronco ao longo de 8 sessões seguidas.',
            'Viscose com elastano tem toque sedoso e temperatura regulada — agradável ao toque e não cria sensação de calor excessivo em consultórios com pouca ventilação ou durante sessões emocionalmente intensas.',
            'Evite poliéster 100% para psicólogos em climas quentes — o tecido sintético acumula calor e pode gerar desconforto térmico perceptível, o que afeta a presença e o estado interno do profissional durante sessões longas.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para psicólogo',
          paragrafos: [
            'O Slim tem corte que não cria hierarquia visual excessiva — transmite presença sem intimidar. Psicólogos cognitivo-comportamentais e de linha humanista frequentemente preferem jaleco ajustado que comunica serenidade e cuidado.',
            'Para psicólogos que atuam com crianças: o Profissional mais folgado tem aparência mais gentil e acessível. Cores suaves + modelagem menos estruturada facilitam o rapport visual com pacientes pediátricos.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para psicólogo',
          paragrafos: [
            'Branco no consultório de psicologia é uma escolha com impacto na dinâmica terapêutica. Em alguns contextos de ansiedade e trauma, o branco remete ao setting hospitalar. Tons neutros quentes como bege e off-white são alternativas que mantêm profissionalismo sem o impacto clínico do branco puro.',
            'Azul sereno, lavanda e verde sage têm respaldo em estudos de psicologia ambiental — associados a calma, confiança e segurança. A cor do jaleco é parte do ambiente não-verbal do consultório.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto durante as sessões',
          paragrafos: [
            'O psicólogo mantém postura sentada por blocos de 45-50 minutos. O jaleco não pode criar tensão nos ombros ou puxar na cava — a postura ereta e relaxada do terapeuta é comunicação não-verbal essencial no processo terapêutico.',
            'Bolsos discretos e rasos — chave, caneta, anotações pequenas. Nada que crie volume visível ou ruído ao se movimentar na cadeira, pois qualquer distração sonora chama a atenção do paciente.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e ambiente terapêutico',
          paragrafos: [
            'O CFP (Conselho Federal de Psicologia) não possui Resolução que obrigue o uso de jaleco. A Resolução CFP 11/2012 (Psicólogo Hospitalar) menciona que em contextos hospitalares o profissional segue as normas de cada instituição — onde frequentemente o jaleco é exigido.',
            'Em serviços de psicologia integrados a equipes de saúde (UBS, CAPS, hospital): o jaleco é parte da identificação multiprofissional e reforça o papel do profissional dentro da equipe interdisciplinar.',
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
      { q: 'Usar jaleco muda a relação terapeuta-paciente?', a: 'Sim. Estudos em saúde mental mostram que o jaleco reforça o setting terapêutico — delimita o papel profissional e pode reduzir a resistência do paciente ao início do tratamento.' },
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
      title: 'Jaleco de Farmácia: Normas, RDC 67 e Manga Longa 2026 | Jaleca',
      description: 'Jaleco de farmácia: jaleco para farmacêutico com manga longa obrigatória (RDC 67/2007), antimicrobiano para manipulação de Ozempic e similares. Jaleco farmácia do PP ao G3.',
    },
    hero: { subtitulo: 'Jaleco de farmácia: manga longa, antimicrobiano e o que a RDC 67/2007 exige para manipulação.' },
    guia: {
      tituloSidebar: 'Como escolher o jaleco ideal para farmacêutico',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para farmácia',
          paragrafos: [
            'Jaleco de farmácia não é só questão de apresentação — é norma. A RDC 67/2007 exige manga longa obrigatória para farmacêuticos em área de manipulação, e esse requisito ficou ainda mais relevante com o crescimento das farmácias de manipulação de Ozempic, Wegovy e similares. Tecidos com tratamento antimicrobiano ativo são a escolha técnica para farmacêuticos em farmácias de manipulação. O processo de produção envolve exposição a matérias-primas em pó e excipientes que se depositam no jaleco — o tratamento reduz proliferação bacteriana na superfície do tecido entre as lavagens.',
            'Para farmacêuticos em farmácias de dispensação (atendimento ao público): gabardine 150-165 g/m² equilibra caimento profissional com leveza para longas jornadas em pé. O farmacêutico anda entre balcões e áreas de estoque o dia todo — tecido pesado cansa.',
            'Lavagem a 60°C é padrão em farmácias de manipulação para garantir higiene dos uniformes. Tecidos com ≥60% poliéster resistem a esse ciclo sem encolher. Algodão 100% pode encolher até 8% em lavagens repetidas a alta temperatura — inviável para uso semanal intensivo.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem Slim ou Profissional para farmacêutico',
          paragrafos: [
            'Manga longa com acabamento no punho é a escolha para farmácia de manipulação — protege os pulsos durante o manuseio de matérias-primas e evita contato da pele com os produtos. É mais eficiente do que manga curta + luvas sobrepostas.',
            'Para atendimento em balcão: o Slim tem caimento limpo e visual de autoridade — o farmacêutico que orienta sobre medicamentos precisa transmitir competência desde o primeiro contato visual com o cliente.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para farmacêutico',
          paragrafos: [
            'Branco é padrão em farmácias — a RDC ANVISA 44/2009 orienta uso de uniformes limpos como condição de boas práticas. Branco facilita a identificação visual de contaminação: o profissional percebe imediatamente quando o jaleco precisa ser trocado.',
            'Azul e verde claro são aceitos em redes de farmácias com identidade visual própria. A padronização de cor por função — farmacêutico responsável vs atendente — é uma prática que melhora a identificação pelo cliente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade na farmácia',
          paragrafos: [
            'O farmacêutico de manipulação trabalha em bancada em pé — rotação de ombros, alcance frontal e lateral, movimentos de pesagem e mistura. O jaleco precisa de cava funda para esses arcos de movimento sem criar tração no ombro ao longo de horas.',
            'Bolso no peito para caneta e calculadora de bolso. Bolso lateral para o CRF de identificação e documentos. Bolsos com aba são os mais adequados em manipulação — evitam acúmulo de pó de matéria-prima no interior.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas CFF e biossegurança',
          paragrafos: [
            'A RDC ANVISA 44/2009 (Farmácias e Drogarias) exige uniformes limpos e em boas condições para profissionais. Para farmácias de manipulação, a RDC ANVISA 67/2007 (BPPM — Boas Práticas de Manipulação) define jaleco exclusivo de trabalho, de cor clara, com manga longa em áreas de produção.',
            'O CFF (Conselho Federal de Farmácia) não possui Resolução específica sobre modelo de jaleco, mas as Boas Práticas Farmacêuticas publicadas nas RDCs são referência obrigatória para toda a equipe da farmácia — incluindo a indumentária.',
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
      { q: 'A RDC 44/2009 da ANVISA exige jaleco para farmacêutico?', a: 'Sim. A norma exige que o farmacêutico use jaleco identificado com nome e número do CRF durante o atendimento. É parte da identificação obrigatória na dispensação de medicamentos.' },
      { q: 'Os jalecos têm bolsos para farmacêutico?', a: 'Sim. Nossos modelos têm bolsos para canetas e pequenos instrumentos do dia a dia.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Na farmácia, o caimento precisa ser prático e apresentável.' },
      { q: 'Jaleca tem modelos masculinos?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Higiene e conforto para a farmácia. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER GASTRONOMIA — DÓLMÃ ───────────────────────────────────────────

  {
    slug: 'dolma-churrasqueiro',
    titulo: 'Churrasqueiro',
    cluster: 'gastronomia',
    produto: 'dolma',
    urlSlug: 'dolma-para-churrasqueiro',
    metadata: {
      title: 'Dólmã para Churrasqueiro: Uniforme Completo 2026 | Jaleca',
      description: 'Dólmã para churrasqueiro profissional + avental: kit uniforme churrasqueiro completo, brim resistente a respingos de gordura, abotoamento duplo padrão chef. PP ao G3.',
    },
    hero: { subtitulo: 'Kit uniforme churrasqueiro completo: dólmã + avental para quem trabalha com fogo de verdade.' },
    guia: {
      tituloSidebar: 'Como montar o uniforme de churrasqueiro profissional',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para churrasco profissional',
          paragrafos: [
            'Brim 200-240 g/m² é o tecido padrão do uniforme churrasqueiro. A trama densa age como barreira mecânica contra respingos de gordura quente — os glóbulos de óleo em alta temperatura impactam a superfície sem atravessar para a pele.',
            'A dólmã tem abotoamento duplo lateral — a função original era inverter a peça quando um lado sujar. Para o churrasqueiro que trabalha com carvão, esse design distribui as manchas e dobra a vida útil da roupa antes de precisar trocar.',
            'Gabardine com tratamento DWR é a alternativa para churrasqueiro a domicílio e eventos em ambiente fechado. Mais leve que o brim, resiste a respingos de molho e gordura fria. A escolha depende do ambiente — grelha a carvão ao ar livre exige gramatura maior.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Kit churrasqueiro profissional: dólmã + avental',
          paragrafos: [
            'O kit churrasqueiro profissional completo é: dólmã de manga longa + avental longo de brim resistente. A dólmã protege tronco e braços; o avental cobre da cintura para baixo na hora do corte — especialmente importante em churrascos a domicílio onde o churrasqueiro circula entre a grelha e os convidados.',
            'A manga da dólmã tem posição dobrável — o churrasqueiro dobra na hora do corte para proteger o braço, e dobra de volta ao servir. A manga precisa manter a posição sem descer. O avental churrasqueiro profissional deve ter bolsos laterais para pinças e termômetro de carne.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para churrasqueiro',
          paragrafos: [
            'Branco clássico com xadrez preto é o padrão histórico da gastronomia. Para churrasqueiros, o branco tem função prática: manchas visíveis indicam que a hora de trocar chegou — controle de qualidade visual direto.',
            'Preto liso é a escolha contemporânea para churrascarias premium — caimento elegante, disfarça respingos leves no meio do serviço. Vai bem com avental escuro.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade no churrasco',
          paragrafos: [
            'O churrasqueiro levanta os braços para regar, abaixa para posicionar carvão, gira para atender clientes em rodízio. A cava da dólmã precisa ter amplitude para esse arco sem puxar nas costas ou subir a frente durante os movimentos.',
            'Bolso no peito esquerdo para termômetro de carne. Manga da dólmã sem abertura larga — não "flap" no vento da grelha, sem risco de pegar chama acidental.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas e segurança alimentar',
          paragrafos: [
            'A RDC ANVISA 216/2004 exige uniforme exclusivo de trabalho, limpo e em boas condições. Para churrascarias: a vigilância sanitária municipal fiscaliza o padrão na frente do cliente — dólmã com manchas excessivas gera advertência.',
            'A dólmã deve permanecer no ambiente de trabalho — não circular no salão com dólmã de churrasco, não sair com ela em transporte público. Mesmo protocolo das outras áreas de manipulação de alimentos.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Churrascarias premium e eventos com foco em apresentação',
      profissionalIdeal: 'Rodízios de alto volume e grelhas a carvão com jornadas longas',
    },
    faq: [
      { q: 'Dólmã de churrasqueiro precisa ser branca?', a: 'Não. Branco clássico e preto são os mais usados. O importante é que esteja limpa e em boas condições — a RDC ANVISA 216/2004 não define cor obrigatória.' },
      { q: 'Qual a diferença entre dólmã e jaleco para churrasqueiro?', a: 'A dólmã tem abotoamento duplo lateral — design padrão chef. O jaleco tem abotoamento central ou zíper. Para ambiente de grelha profissional, a dólmã é o uniforme correto da gastronomia.' },
      { q: 'Dólmã precisa de avental por cima?', a: 'Sim. O churrasqueiro profissional usa dólmã + avental longo. A dólmã protege tronco e braços; o avental protege da cintura para baixo — especialmente na hora de cortar.' },
      { q: 'Qual tecido é melhor para dólmã de churrasqueiro?', a: 'Brim 200-240 g/m² para grelha a carvão. Gabardine DWR para churrascarias fechadas e eventos — mais leve e fácil de limpar.' },
      { q: 'A dólmã protege contra o calor da grelha?', a: 'Oferece barreira contra respingos e gordura quente. Para calor radiante de carvão: use avental de brim por cima — é a barreira primária. A dólmã é a segunda camada.' },
      { q: 'Jaleca tem dólmã para churrasqueiro?', a: 'Sim. O modelo Conjunto Dólmã Cozinheiro Masculino inclui dólmã + avental — conjunto completo para o profissional de churrasco.' },
      { q: 'Como lavar a dólmã de churrasqueiro?', a: 'Pré-tratar manchas de gordura antes de lavar. Lavar a 40-60°C no ciclo pesado. Secar ao ar para manter a gramatura.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Dólmã para o profissional da grelha. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'dolma-sushiman',
    titulo: 'Sushiman',
    cluster: 'gastronomia',
    produto: 'dolma',
    urlSlug: 'dolma-para-sushiman',
    metadata: {
      title: 'Dólmã para Sushiman: Guia Completo 2026 | Jaleca',
      description: 'Dólmã para sushiman: visual clean, tecido leve para peixe cru, abotoamento lateral padrão chef japonês. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'A dólmã do sushiman que apresenta o peixe e o profissional.' },
    guia: {
      tituloSidebar: 'Como escolher a dólmã ideal para sushiman',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para sushi counter',
          paragrafos: [
            'Gabardine 150-165 g/m² com DWR é a escolha para sushiman de restaurante com ambiente controlado. O tratamento repele vinagre de arroz e shoyu sem impregnar no tecido — manchas de condimentos saem com pano úmido antes de fixar.',
            'Poliéster 100% respira melhor que brim pesado e seca em menos de 1h — necessário para quem precisa do uniforme limpo no meio do serviço em cozinhas mistas com calor elevado.',
            'Evite tecidos felpudos ou com textura porosa para sushiman — acumulam resíduo de peixe entre as fibras, dificultando a higienização entre atendimentos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem para sushiman',
          paragrafos: [
            'A dólmã do sushiman tem manga ¾ ou longa com punho firme — protege o pulso durante o fatiamento do peixe e não arrasta na superfície limpa da tábua de corte.',
            'O abotoamento duplo lateral da dólmã é funcional no sushi counter: quando um lado mancha, inverte a peça para continuar o serviço sem interromper o atendimento durante o rush do jantar.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para sushiman',
          paragrafos: [
            'Branco é a escolha dos counters de sushi que querem transmitir pureza e frescor ao cliente — o visual clean combina com o minimalismo japonês e a apresentação do peixe.',
            'Preto é a escolha dos restaurantes fusion e premium. A estética contemporânea da cozinha japonesa abraçou o all-black e o sushiman de preto tem autoridade visual no ambiente moderno.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia no sushi counter',
          paragrafos: [
            'O sushiman faz movimento de corte contínuo — punho, ombro, cotovelo repetidos em sequência. A manga da dólmã não pode criar tração que canse o ombro acumulando ao longo de um jantar de 4 horas.',
            'Abotoamento firme que não abre com o movimento de corte. A dólmã precisa se manter fechada durante toda a jornada sem precisar reajustar na frente do cliente.',
          ],
        },
        {
          id: 'normas', titulo: 'Higiene para manipulação de peixe cru',
          paragrafos: [
            'Peixe cru é proteína de alto risco — a RDC ANVISA 216/2004 é rigorosa: uniforme limpo, exclusivo, não sai da área de manipulação. No sushi counter, o protocolo é ainda mais exigente pela presença do cliente observando.',
            'Troca de uniforme ao início e ao final do serviço. Alguns restaurantes exigem dólmã diferente para preparo e para atendimento no balcão. Mínimo de 3 peças em rotação para garantir que sempre há uma limpa disponível.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Restaurantes japoneses e sushi counters premium',
      profissionalIdeal: 'Cozinhas de alto volume com produção intensa de sushi',
    },
    faq: [
      { q: 'Sushiman usa jaleco ou dólmã?', a: 'Dólmã é o uniforme correto para gastronomia profissional. O abotoamento duplo lateral, manga que protege o pulso e design padrão chef fazem a dólmã a escolha técnica certa para o sushiman.' },
      { q: 'Qual cor de dólmã para sushiman?', a: 'Branco para visual clean minimalista. Preto para restaurantes premium e fusion. Os dois são aceitos — a escolha depende da identidade do restaurante.' },
      { q: 'Dólmã de sushiman precisa de manga longa?', a: 'Sim. Manga longa ou ¾ com punho firme — protege o pulso durante o corte e não arrasta na tábua de trabalho.' },
      { q: 'Como higienizar a dólmã entre os serviços?', a: 'Pré-tratar manchas de peixe imediatamente — proteínas fixam rápido no tecido. Lavar a 40-60°C. Ter pelo menos 2 dólmãs para revezar durante o serviço.' },
      { q: 'A RDC 216/2004 se aplica ao sushiman?', a: 'Sim. Sushi é serviço de alimentação — a norma exige uniforme limpo, exclusivo de trabalho, trocado diariamente. Peixe cru exige protocolo ainda mais rigoroso.' },
      { q: 'Jaleca tem dólmã para sushiman?', a: 'Sim. Temos dólmã em conjunto completo — dólmã + avental — para o profissional de cozinha oriental.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para dólmã, o tamanho com boa mobilidade nos ombros é o ideal.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Dólmã para o profissional de cozinha oriental. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'dolma-cozinheiro',
    titulo: 'Cozinheiro',
    cluster: 'gastronomia',
    produto: 'dolma',
    urlSlug: 'dolma-para-cozinheiro',
    metadata: {
      title: 'Dólmã para Cozinheiro: Guia Completo 2026 | Jaleca',
      description: 'Dólmã para cozinheiro profissional: abotoamento duplo padrão chef, tecido resistente ao calor, normas ANVISA. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'O uniforme padrão chef para a cozinha profissional.' },
    guia: {
      tituloSidebar: 'Como escolher a dólmã ideal para cozinheiro',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para cozinha profissional',
          paragrafos: [
            'Brim 200-240 g/m² é o tecido padrão para dólmã de cozinheiro. Em cozinhas com fogão industrial e fritadeiras, a gramatura densa reduz a velocidade de penetração do calor radiante e forma barreira contra respingos de óleo.',
            'Para cozinhas frias — confeitaria, garde manger — gabardine 150 g/m² com DWR é mais confortável. O confeiteiro não enfrenta o calor da grelha, então leveza e apresentação pesam mais na decisão.',
            'Poliéster ≥60% seca mais rápido e aguenta ciclos de lavagem a 60°C sem perder a estrutura da dólmã — necessário em cozinhas de alto volume com jornadas de 10-12 horas.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Dólmã padrão chef para cozinheiro',
          paragrafos: [
            'O abotoamento duplo lateral define a dólmã. A dupla camada de tecido no tronco frontal é barreira extra contra calor e respingos — mais proteção que um jaleco simples de fechamento central.',
            'Manga longa obrigatória para cozinha quente. O cozinheiro que trabalha com forno, vapor e grelha precisa da manga comprida. Em confeitaria e cozinha fria, manga ¾ é aceita.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para cozinheiro',
          paragrafos: [
            'Branco com xadrez clássico é o símbolo histórico da gastronomia profissional. A dólmã xadrez foi popularizada por Auguste Escoffier no século XIX — ainda é o padrão em escolas de gastronomia e cozinhas tradicionais.',
            'Preto liso ganhou espaço nos últimos 15 anos — a nova geração de chefs adotou o all-black como statement profissional. Em cozinhas abertas e restaurantes contemporâneos, o preto transmite autoridade.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia e funcionalidade',
          paragrafos: [
            'O cozinheiro levanta os braços acima do ombro com frequência — alcançar prateleiras, mexer caldeirões e manipular equipamentos em altura. A dólmã com cava funda permite esse arco sem criar tração que canse a região cervical.',
            'Três bolsos mínimos: peito para termômetro, lateral direita para espatula/caneta, lateral esquerda para pano de copa. A dólmã de cozinheiro é funcional além da proteção.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas e vigilância sanitária',
          paragrafos: [
            'A RDC ANVISA 216/2004 define que o cozinheiro profissional usa uniforme exclusivo de trabalho, limpo, trocado diariamente. Em restaurante licenciado pela vigilância sanitária, o padrão do uniforme é auditado periodicamente.',
            'A Portaria 326/1997 (Boas Práticas de Fabricação) exige que uniformes de trabalho sejam lavados separados de roupas pessoais e guardados em local limpo. Em cozinhas industriais com APPCC, o protocolo de uniformes é parte do plano.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Cozinhas premium, confeitaria e restaurantes com cozinha aberta',
      profissionalIdeal: 'Cozinhas industriais de alto volume com jornadas longas',
    },
    faq: [
      { q: 'Qual a diferença entre dólmã e jaleco para cozinheiro?', a: 'A dólmã tem abotoamento duplo lateral — cria dupla camada no tronco para maior proteção. O jaleco tem fechamento simples. Para cozinha profissional, a dólmã é o uniforme padrão.' },
      { q: 'Cozinheiro precisa de dólmã ou jaleco?', a: 'Ambos são aceitos pela vigilância sanitária. Mas em escolas de gastronomia, restaurantes profissionais e brigadas de cozinha, a dólmã é o uniforme padrão — é parte da identidade e hierarquia da cozinha.' },
      { q: 'Qual tecido de dólmã para cozinheiro?', a: 'Brim 200-240 g/m² para grelha e fritadeira. Gabardine DWR para confeitaria e cozinha fria. Poliéster ≥60% para cozinhas que lavam a 60°C.' },
      { q: 'Dólmã precisa de manga longa?', a: 'Sim para cozinha quente — protege contra queimaduras e respingos. Em confeitaria e cozinha fria, manga ¾ é aceita.' },
      { q: 'O xadrez clássico é obrigatório?', a: 'Não. É tradição, não norma. Branco sólido, preto e outras cores são igualmente aceitos pela vigilância sanitária.' },
      { q: 'Jaleca tem dólmã para cozinheiro?', a: 'Sim. O Conjunto Dólmã Cozinheiro inclui dólmã + avental — conjunto completo para o profissional de cozinha.' },
      { q: 'Como funciona a troca de tamanho?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Dólmã padrão chef para a cozinha profissional. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER ESCRITÓRIO — CONJUNTO ─────────────────────────────────────────

  {
    slug: 'conjunto-advogado',
    titulo: 'Advogado',
    cluster: 'escritorio',
    produto: 'conjunto',
    urlSlug: 'conjunto-para-advogado',
    metadata: {
      title: 'Conjunto para Advogado: Guia Completo 2026 | Jaleca',
      description: 'Conjunto profissional para advogado e escritório jurídico: caimento impecável para audiências, com elastano. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'Conjunto profissional para o escritório e a sala de audiência.' },
    guia: {
      tituloSidebar: 'Como escolher o conjunto ideal para advogado',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o escritório jurídico',
          paragrafos: [
            'Gabardine 150-165 g/m² com poliéster/viscose (65/35) é a composição padrão para conjuntos de escritório jurídico. O caimento vertical limpo e a resistência a vincos fazem a diferença em audiências que se estendem por horas.',
            'Elastano bidirecional (4-6%) garante que calça e blusa acompanhem os movimentos — sentar e levantar repetido em audiência, gesticular, dobrar sobre documentos — sem criar vincos que se acumulam ao longo do dia.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem do conjunto para advogado',
          paragrafos: [
            'Conjunto de calça reta (corte estruturado) + blusa de mangas longas é o padrão para advogados que frequentam tribunais. O par combinado transmite coesão visual — mais formal que blusa + calça separadas de cores próximas mas não iguais.',
            'Para advogados em escritório sem agenda de tribunal: conjunto com calça mais ajustada + blusa slim passa autoridade e modernidade sem o nível de formalidade exigido na sala de audiência.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores do conjunto para advogado',
          paragrafos: [
            'Preto, azul marinho e cinza são as cores do ambiente jurídico. O conjunto monocromático tem impacto visual mais forte que jaleco sobre roupa — a linha do corpo é contínua, sem quebra de cor.',
            'Branco funciona em escritórios modernos e boutiques jurídicas. Para tribunal: cores neutras frias têm melhor recepção do que branco ou tons quentes.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto em audiências e reuniões',
          paragrafos: [
            'O conjunto com elastano aguenta a sequência inteira de um dia de tribunal — sentado na sala de espera, em pé na sustentação oral, andando entre salas — sem criar vincos permanentes ou perder caimento.',
            'Calça do conjunto com cós elástico parcial é mais confortável para jornadas de 8-10 horas. O elástico parcial mantém a linha reta da frente sem apertar na lateral.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e ética profissional',
          paragrafos: [
            'A OAB não possui Provimento que defina vestimenta. O Código de Ética (Res. 02/2015) menciona "traje adequado" para audiências. O conjunto profissional é a interpretação mais segura disso no Judiciário brasileiro.',
            'Em alguns tribunais estaduais e na Justiça Federal, há portarias internas que definem padrão de vestimenta. Verificar o regimento interno da vara antes de audiências importantes.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Escritórios premium e advogados com foco em imagem pessoal forte',
      profissionalIdeal: 'Audiências longas e advogados que precisam de mais conforto',
    },
    faq: [
      { q: 'Advogado usa conjunto ou jaleco?', a: 'Os dois são aceitos. O conjunto dá visual mais completo — calça + blusa combinando transmite mais coesão do que jaleco sobre qualquer roupa. Para tribunal, o conjunto é a escolha mais segura.' },
      { q: 'Qual cor de conjunto para advogado?', a: 'Preto, azul marinho e cinza são os mais usados. Conjunto monocromático em cores neutras frias é o padrão no ambiente jurídico formal.' },
      { q: 'Conjunto com elastano aguenta um dia de tribunal?', a: 'Sim. Tecidos com elastano bidirecional mantêm o caimento após horas sentado e em pé alternados — o conjunto chega ao final do dia apresentável.' },
      { q: 'Conjunto feminino tem calça reta ou ajustada?', a: 'Temos as duas opções. Para tribunal: calça reta, mais formal. Para escritório: calça slim, mais moderna.' },
      { q: 'Jaleca tem conjuntos masculinos?', a: 'Sim. Temos conjuntos masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho do conjunto?', a: 'Use a tabela de medidas da Jaleca. Para conjunto, meça o maior ponto entre busto e quadril — o tamanho que acomoda os dois.' },
      { q: 'Como funciona a troca?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Conjunto profissional para o escritório e o tribunal. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'conjunto-pastor',
    titulo: 'Pastor',
    cluster: 'escritorio',
    produto: 'conjunto',
    urlSlug: 'conjunto-para-pastor',
    metadata: {
      title: 'Conjunto para Pastor: Guia Completo 2026 | Jaleca',
      description: 'Conjunto pastoral para pastor evangélico: elegância cerimonial, conforto em cultos longos, tecido de bom caimento. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'Conjunto pastoral com dignidade para o seu ministério.' },
    guia: {
      tituloSidebar: 'Como escolher o conjunto ideal para pastor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o ministério',
          paragrafos: [
            'Gabardine de viscose/poliéster (65/35) com toque suave é a composição que mais aparece em conjuntos pastorais. O caimento fluído e a resistência a vincos fazem o conjunto manter a apresentação durante cultos de 2-4 horas sem precisar repassar a ferro entre eventos.',
            'Gramatura 150-165 g/m² equilibra elegância e conforto térmico — igrejas têm variação de temperatura entre santuário, sala de reunião e atividades externas. Um conjunto pesado demais fatiga em cultos longos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem para pastor',
          paragrafos: [
            'O conjunto com blusa de linha limpa e calça reta transmite autoridade espiritual sem excesso. A silhueta unificada (blusa + calça na mesma cor) cria impacto visual maior que qualquer outra combinação.',
            'Para pastores que pregam com gesticulação intensa e braços levantados: a blusa precisa de manga com amplitude de cava suficiente. O conjunto não pode criar pressão axilar durante a pregação.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para conjunto pastoral',
          paragrafos: [
            'Branco é a cor mais associada ao conjunto pastoral no Brasil — simboliza santidade e separa o ministério do cotidiano. Para cerimônias de batismo e ordenação, o branco é quase universalmente adotado.',
            'Preto, roxo e azul royal são usados em denominações com liturgia mais formal. Cada denominação tem sua própria simbologia de cor — pastores que atuam em múltiplos contextos optam por neutros que funcionam em qualquer ambiente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto em cultos e cerimônias',
          paragrafos: [
            'O pastor alterna entre sentado (reuniões, aconselhamento) e em pé (pregação, adoração) múltiplas vezes por dia. O conjunto com elastano bidirecional acompanha isso sem criar vincos que se acumulam ao longo do dia.',
            'Para cultos de adoração onde o pastor levanta os braços por períodos longos: a blusa com cava funda faz diferença no cansaço acumulado na região do ombro após 30-40 minutos de ministério.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação e reverência',
          paragrafos: [
            'Nenhum órgão regulador define vestimenta pastoral no Brasil. A escolha é guiada pela tradição denominacional e o manual de liturgia de cada ministério.',
            'O conjunto pastoral precisa inspirar reverência na congregação. A apresentação do pastor reflete a seriedade do ministério — um conjunto bem cuidado comunica isso antes das primeiras palavras.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Pastores que buscam visual moderno e elegante no ministério',
      profissionalIdeal: 'Cerimônias longas e cultos com pregação de 45+ minutos',
    },
    faq: [
      { q: 'Pastor usa jaleco ou conjunto?', a: 'Os dois são usados. O conjunto tem impacto visual maior — a silhouette unificada transmite mais autoridade pastoral do que jaleco sobre outra roupa.' },
      { q: 'Conjunto branco é o padrão para pastor?', a: 'Não é regulamentado. Mas o conjunto branco é a tradição mais forte no ministério evangélico brasileiro — especialmente em batismos e ordenações.' },
      { q: 'Qual cor de conjunto para pastor?', a: 'Branco para cerimônias. Preto, roxo e azul royal para cultos regulares — a escolha depende da denominação e da tradição da igreja.' },
      { q: 'Conjunto aguentado cultos de 3-4 horas?', a: 'Sim, com elastano. O conjunto se adapta aos movimentos de pregação e ministério sem criar vincos ou apertar ao longo do culto.' },
      { q: 'Os tecidos são transparentes?', a: 'Não. Usamos tecidos com boa gramatura — sem transparência em nenhuma cor.' },
      { q: 'Jaleca tem conjuntos femininos e masculinos?', a: 'Sim. Temos conjuntos femininos e masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para conjunto, o tamanho que acomoda busto e quadril sem folha excessiva é o ideal.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Conjunto pastoral para o seu ministério. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'conjunto-psicologa',
    titulo: 'Psicólogo',
    cluster: 'escritorio',
    produto: 'conjunto',
    urlSlug: 'conjunto-para-psicologa',
    metadata: {
      title: 'Conjunto para Psicólogo: Guia Completo 2026 | Jaleca',
      description: 'Conjunto para psicólogo: tons neutros para o setting terapêutico, conforto em sessões longas, modelagem elegante para o consultório. Guia completo.',
    },
    hero: { subtitulo: 'Conjunto profissional para o psicólogo que atende com presença.' },
    guia: {
      tituloSidebar: 'Como escolher o conjunto ideal para psicólogo',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para o consultório',
          paragrafos: [
            'Microfibra leve (120-140 g/m²) com elastano 4-6% é a composição ideal para conjunto de psicólogo — o profissional fica sentado por blocos de 45-50 minutos e o tecido não pode criar pressão nos quadris ou apertar no tronco ao longo do dia.',
            'Viscose com elastano tem toque sedoso e temperatura regulada — confortável durante sessões em consultórios com ar-condicionado. A sensação tátil do tecido é parte do ambiente não-verbal que o psicólogo cria para o paciente.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem do conjunto para psicólogo',
          paragrafos: [
            'Conjunto slim com calça que não aperta na cintura é a escolha para quem passa o dia sentado. A blusa deve ter comprimento suficiente para não subir ao se mover na cadeira — evita reajuste constante que distrai durante a sessão.',
            'Para psicólogos que atuam com crianças: conjunto com modelagem menos estruturada e cores suaves tem aparência mais gentil, criando rapport visual com pacientes pediátricos.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores do conjunto para psicólogo',
          paragrafos: [
            'Tons neutros quentes — bege, off-white, cinza claro — são a melhor escolha para psicólogos. Em conjunto, a cor envolve toda a silhouette, então o impacto emocional é maior do que em um jaleco parcial.',
            'Azul sereno e lavanda têm respaldo em psicologia ambiental — associados a calma e confiança. Evitar vermelho, laranja intenso e cores muito saturadas, que ativam o estado de alerta.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Conforto em sessões longas',
          paragrafos: [
            'O psicólogo mantém postura sentada por 45-50 minutos consecutivos, 6-8 vezes ao dia. A calça do conjunto não pode criar pressão no cós ou nas coxas — o desconforto físico interfere na presença e na qualidade do atendimento.',
            'Conjunto sem bolsos externos salientes é ideal para o consultório — nada que crie ruído ao se movimentar na cadeira ou volume que distraia o paciente durante a sessão.',
          ],
        },
        {
          id: 'normas', titulo: 'Apresentação no setting terapêutico',
          paragrafos: [
            'O CFP não possui Resolução que obrigue uso de conjunto. Em contextos hospitalares e de saúde pública (CAPS, UBS), o conjunto serve como identificação profissional dentro da equipe multiprofissional.',
            'A apresentação do terapeuta é parte da comunicação não-verbal do processo. Um conjunto neutro e bem cuidado delimita o papel profissional sem criar hierarquia visual que dificulte a aliança terapêutica.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Consultórios particulares com foco em imagem e presença profissional',
      profissionalIdeal: 'Serviços públicos de saúde mental e atendimentos longos',
    },
    faq: [
      { q: 'Psicólogo usa jaleco ou conjunto?', a: 'Os dois são válidos. O conjunto tem impacto visual maior — silhouette completa em tons neutros cria ambiente de presença e acolhimento mais consistente que jaleco sobre qualquer roupa.' },
      { q: 'Qual cor de conjunto para psicólogo?', a: 'Tons neutros quentes: bege, off-white, cinza claro. Azul sereno e lavanda também funcionam. Evitar cores saturadas que ativem estado de alerta no paciente.' },
      { q: 'Conjunto de psicólogo não aperta após horas sentado?', a: 'Não com elastano bidirecional. Nossos conjuntos têm tecido de recuperação de forma — não criam pressão acumulada em sessões longas.' },
      { q: 'Conjunto precisa ser branco para psicólogo?', a: 'Não. Branco no consultório pode remeter ao setting hospitalar. Tons neutros quentes são a escolha mais técnica para criar acolhimento.' },
      { q: 'Jaleca tem conjuntos em tons neutros?', a: 'Sim. Temos conjuntos em várias cores incluindo tons neutros adequados para o consultório.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para conjunto, meça busto, cintura e quadril.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
      { q: 'Como funciona a troca?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
    ],
    cta: { descricao: 'Do PP ao G3. Conjunto para o consultório de psicologia. Frete grátis no Sudeste acima de R$499.' },
  },

  {
    slug: 'conjunto-farmaceutico',
    titulo: 'Farmacêutico',
    cluster: 'escritorio',
    produto: 'conjunto',
    urlSlug: 'conjunto-para-farmaceutico',
    metadata: {
      title: 'Conjunto para Farmacêutico: Guia Completo 2026 | Jaleca',
      description: 'Conjunto para farmacêutico: visual clean, biossegurança em farmácias e laboratórios, normas RDC ANVISA. Guia completo do PP ao G3.',
    },
    hero: { subtitulo: 'Conjunto profissional para a farmácia e o laboratório de manipulação.' },
    guia: {
      tituloSidebar: 'Como escolher o conjunto ideal para farmacêutico',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido e composição para farmácia',
          paragrafos: [
            'Poliéster ≥60% com elastano é a composição prática para conjuntos de farmacêutico. Seca rápido, resiste a lavagens a 60°C sem encolher e mantém a cor mesmo em ciclos frequentes — necessário em farmácias de manipulação onde o uniforme é lavado diariamente.',
            'Para farmacêuticos no balcão: gabardine 150 g/m² com elastano é mais confortável para jornadas longas em pé. O caimento limpo do conjunto transmite profissionalismo ao cliente que busca orientação sobre medicamentos.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Modelagem do conjunto para farmacêutico',
          paragrafos: [
            'Conjunto com blusa de manga longa é a escolha para farmácia de manipulação — protege pulsos e braços durante o manuseio de matérias-primas. A calça fecha o conjunto de proteção completo.',
            'Para atendimento em balcão: conjunto com blusa de manga ¾ ou curta é mais prático no verão. O calor do balcão de farmácia em dias quentes torna a manga longa desconfortável em jornadas de 8+ horas.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para farmacêutico',
          paragrafos: [
            'Branco é o padrão histórico na farmácia — a RDC ANVISA 44/2009 orienta uniformes limpos como condição de boas práticas. O conjunto branco tem impacto de higiene mais forte que jaleco branco sobre calça de cor diferente.',
            'Azul e verde claro são usados em redes com identidade visual própria. Em farmácias com padronização de cor por função, o conjunto diferenciado facilita a identificação do farmacêutico pelo cliente.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Ergonomia na farmácia',
          paragrafos: [
            'O farmacêutico de manipulação trabalha em bancada em pé — rotação de ombros, alcance frontal e lateral, movimentos de pesagem. A blusa do conjunto precisa de cava com amplitude para esses movimentos sem travar na bancada.',
            'O conjunto elimina a faixa entre blusa e calça que aparece ao se curvar — detalhe importante em farmácias de manipulação onde nenhuma parte do corpo deve ficar exposta próximo dos produtos.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas RDC ANVISA e CFF',
          paragrafos: [
            'A RDC ANVISA 67/2007 (BPPM) define que manipuladores usem uniforme exclusivo de trabalho, de cor clara, com manga longa em áreas de produção. O conjunto atende plenamente — é uniforme completo, não apenas sobreposta.',
            'A RDC 44/2009 exige que haja farmacêutico identificável durante o horário de funcionamento. O conjunto padronizado facilita essa identificação do responsável técnico pelo cliente.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Farmácias de balcão e redes com foco em apresentação da equipe',
      profissionalIdeal: 'Farmácias de manipulação e laboratórios com jornadas longas',
    },
    faq: [
      { q: 'Farmacêutico usa jaleco ou conjunto?', a: 'Os dois são válidos. O conjunto tem vantagem em farmácias de manipulação — cobre completamente, sem faixa entre blusa e calça ao se curvar sobre bancadas.' },
      { q: 'O conjunto pode ser lavado a 60°C?', a: 'Sim, os conjuntos com ≥60% poliéster resistem a esse ciclo sem encolher ou perder cor. Verifique a etiqueta do modelo.' },
      { q: 'Qual cor de conjunto para farmacêutico?', a: 'Branco para o padrão clássico de biossegurança. Azul e verde claro para redes com identidade visual própria.' },
      { q: 'Manga longa é obrigatória na manipulação?', a: 'A RDC ANVISA 67/2007 (BPPM) recomenda manga longa em áreas de produção. Para farmácias de manipulação, blusa de manga longa é a escolha mais segura e conforme.' },
      { q: 'Jaleca tem conjuntos masculinos?', a: 'Sim. Temos conjuntos masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para conjunto, o tamanho que acomoda ombro, busto e quadril.' },
      { q: 'Como funciona a troca?', a: 'Aceitamos troca em até 30 dias com o produto sem uso e etiqueta.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Conjunto profissional para a farmácia. Frete grátis no Sudeste acima de R$499.' },
  },

  // ── CLUSTER SERVIÇOS — PROFESSOR GENÉRICO ────────────────────────────────

  {
    slug: 'professor-uniforme',
    titulo: 'Professor',
    cluster: 'servicos',
    produto: 'jaleco',
    urlSlug: 'uniforme-para-professor',
    metadata: {
      title: 'Uniforme para Professor: Jaleco Escola e Laboratório 2026 | Jaleca',
      description: 'Jaleco e uniforme para professor de escola, laboratório e universidade: confortável, prático, com bolsos. Guia completo para educadores do PP ao G3.',
    },
    hero: { subtitulo: 'O uniforme certo para o professor que está em sala ou no laboratório.' },
    guia: {
      tituloSidebar: 'Como escolher o uniforme ideal para professor',
      secoes: [
        {
          id: 'tecido', titulo: 'Tecido para o professor em sala e laboratório',
          paragrafos: [
            'O professor tem dois contextos de uso distintos. Em sala de aula: microfibra leve (120-140 g/m²) com elastano — leve para o dia inteiro, fácil de lavar, resiste a manchas de giz e marcador. Em laboratório: algodão ou blends algodão/poliéster — a ABNT NBR 14787 recomenda resistência mínima a chamas para labs de química e biologia.',
            'Elastano bidirecional (4-6%) é importante para o professor que gesticula, escreve na lousa, se curva sobre bancadas e circula pela sala. Um tecido sem stretch cria tensão nos ombros que acumula ao longo de 5-6 aulas seguidas.',
          ],
        },
        {
          id: 'modelagem', titulo: 'Jaleco para cada tipo de professor',
          paragrafos: [
            'Professor universitário e de ensino médio: Slim é a escolha — visual moderno e de autoridade sem criar distância dos alunos. Para laboratório de ciências: Profissional com manga longa — mais proteção e maior amplitude para movimentos em bancada.',
            'Para professores de educação infantil e fundamental: modelagem com mais liberdade de movimento e tecido fácil de limpar. O professor de crianças se abaixa, senta no chão, gesticula amplos — a modelagem precisa acompanhar.',
          ],
        },
        {
          id: 'cores', titulo: 'Cores para professor',
          paragrafos: [
            'Em laboratórios: branco ou cor clara é obrigatório em muitas instituições — facilita a identificação de reagentes e materiais na roupa. Para sala de aula: qualquer cor sóbria. Muitas escolas definem a cor no regulamento do uniforme.',
            'Azul marinho e cinza são os mais comuns em uniformes de professores de escolas particulares. Para professores de cursos livres e treinadores: cores que combinam com a identidade da escola ou empresa.',
          ],
        },
        {
          id: 'ergonomia', titulo: 'Praticidade em sala e no laboratório',
          paragrafos: [
            'Mínimo de três bolsos para o professor: peito para marcador e apagador, lateral esquerda para celular/controle de apresentação, lateral direita para chaves e materiais menores. O professor não pode parar a aula para buscar materiais.',
            'O professor entra e sai de salas diferentes ao longo do dia. Fechamento por botão é mais prático do que zíper em trocas rápidas entre aulas e intervalos.',
          ],
        },
        {
          id: 'normas', titulo: 'Normas para professores de laboratório',
          paragrafos: [
            'A LDB (Lei 9.394/1996) não regulamenta vestimenta docente. Para laboratórios escolares: a NR-6 (EPIs) classifica o jaleco como EPI obrigatório em ambientes com riscos biológicos, químicos ou físicos. A ABNT NBR 14787 define os critérios para jalecos de proteção contra chamas.',
            'Em escolas que adotam uniforme docente como política institucional: o professor segue o regulamento. A maioria das escolas particulares tem regulamento interno que especifica modelo, cor e condições de uso.',
          ],
        },
      ],
    },
    comparacao: {
      slimIdeal: 'Professores de sala de aula, cursos livres e treinamentos',
      profissionalIdeal: 'Laboratórios de ciências, química, biologia e ensino técnico',
    },
    faq: [
      { q: 'Professor precisa usar jaleco?', a: 'Em laboratórios sim — é EPI obrigatório pela NR-6. Em sala de aula, depende da política institucional. Muitas escolas particulares exigem jaleco como parte do uniforme docente.' },
      { q: 'Qual jaleco para professor de laboratório?', a: 'Jaleco de manga longa, fechamento frontal completo, tecido de algodão ou algodão/poliéster. A ABNT NBR 14787 é a referência para labs com reagentes e risco de chama.' },
      { q: 'Professor universitário usa jaleco?', a: 'Depende do departamento. Em ciências da saúde, biológicas e exatas: jaleco é norma. Em humanas e sociais: opcional, mas muitos adotam para demarcar o papel docente.' },
      { q: 'Qual cor de jaleco para professor?', a: 'Branco para laboratório. Para sala de aula: qualquer cor sóbria aceita pela instituição. As mais comuns são branco, azul marinho e cinza.' },
      { q: 'O jaleco de professor pode ir à máquina?', a: 'Sim. A maioria dos modelos aguenta lavagem na máquina. Para labs de biologia: lavar a 40°C para higienização adequada.' },
      { q: 'Jaleca tem modelos masculinos para professor?', a: 'Sim. Temos jalecos masculinos com elastano do PP ao G3.' },
      { q: 'Como escolher o tamanho?', a: 'Use a tabela de medidas da Jaleca. Para professor que gesticula muito, um tamanho com boa amplitude nos ombros é o ideal.' },
      { q: 'Qual o prazo de entrega?', a: 'Enviamos em até 2 dias úteis. Capitais do Sudeste recebem em 3 a 5 dias úteis.' },
    ],
    cta: { descricao: 'Do PP ao G3. Jaleco confortável para o professor de sala e laboratório. Frete grátis no Sudeste acima de R$499.' },
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

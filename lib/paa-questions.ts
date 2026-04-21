/**
 * PAA (People Also Ask) — Perguntas comuns por profissão
 * Foco: perguntas sobre TECIDO, CAIMENTO, TAMANHO, COR, CONFORTO, LAVAGEM de uniformes profissionais
 * Fonte: simulações baseadas em padrões de busca brasileiros + DataForSEO insights
 */

export type PaaQuestion = {
  q: string
  a: string // resposta curta (para o accordion do hub)
}

export type PaaByProfession = Record<string, PaaQuestion[]>

export const PAA_BY_PROFESSION: PaaByProfession = {
  // ── SAÚDE ────────────────────────────────────────────────────────────────────
  dentista: [
    { q: 'Qual o tecido ideal para jaleco de dentista que não amassa?', a: 'Polyester 65% + viscose 30% + elastano 5% é o melhor: não amassa em 8h de atendimento, suporta lavagem a 60°C e tem elastano que dá memória ao tecido.' },
    { q: 'Jaleco de dentista precisa ser branco ou pode ter cor?', a: 'O branco é o clássico da odontologia, mas cores discretas e tons pastel são aceitos pelo CRO. O importante é manter visual impecável e tecido liso.' },
    { q: 'Qual o tamanho certo de jaleco para dentista?', a: 'Meça busto, cintura e quadril. O jaleco Jaleca tem caimento que permite movimento — se estiver entre dois tamanhos, opte pelo maior.' },
    { q: 'Jaleco de dentista com elastano faz diferença no dia a dia?', a: 'Sim. O elastano permite que o tecido volte ao formato original após cada movimento. Para dentistas que trabalham com braços elevados, isso é essencial.' },
    { q: 'Como lavar jaleco de dentista para não amarelar?', a: 'Lave a 60°C com sabão neutro, não guarde sujo e evite alvejante clorado. Nossos jalecos têm branqueadores ópticos que ajudam a manter a brancura.' },
    { q: 'Jaleco curto ou longo para dentista?', a: 'O jaleco curto (até o quadril) é o mais comum na odontologia — facilita o movimento ao redor da cadeira. O longo é mais usado em procedimentos cirúrgicos.' },
  ],
  enfermeiro: [
    { q: 'Qual o tecido melhor para jaleco de enfermeira em plantão?', a: 'O mesmo polyester + viscose + elastano: suporta lavagens frequentes, não amassa e o elastano dá conforto em movimentos repetitivos durante horas.' },
    { q: 'Enfermeira pode usar jaleco colorido?', a: 'Cada hospital tem seu código de vestimenta. Muitos aceitam cores como azul, verde e rosa — confiram a norma da instituição antes de escolher.' },
    { q: 'Jaleco de enfermeira rasga fácil? Como escolher tecido resistente?', a: 'O polyester 65% da Jaleca é resistente a atritos e lavagens frequentes. Evite 100% algodão — absorve fluidos e desgasta mais rápido.' },
    { q: 'Qual tamanho de jaleco para enfermeira que trabalha em pé o dia todo?', a: 'Escolha um tamanho que permita movimento sem apertar. Modelos com elastano adaptam-se ao corpo e não restrictem movimentos.' },
    { q: 'Como desinfetar jaleco de enfermeira sem danificar o tecido?', a: 'Lavagem a 60°C é suficiente para matar a maioria dos microorganismos. Não use alvejante agressivo — prefira alvejante sem cloro.' },
  ],
  medico: [
    { q: 'Qual o tecido mais indicado para jaleco médico?', a: 'Polyester + viscose + elastano é o mais usado em ambiente hospitalar: durability, fácil lavagem e elastano para conforto em longos plantões.' },
    { q: 'Jaleco médico pode ser colorido ou precisa ser branco?', a: 'Branco é o padrão hospitalar por associar a higiene. Algumas especialidades aceitam cores claras. Verifiquem as normas do hospital ou clínica.' },
    { q: 'Jaleco slim ou tradicional para médico?', a: 'O slim oferece visual moderno e profissional. O tradicional tem mais espaço para movimento. Para quem usa por baixo de estetoscópio e outros equipamentos, o tradicional pode ser mais prático.' },
    { q: 'Como lavar jaleco médico para preservar o tecido?', a: 'Lave imediatamente após o uso, a 60°C com sabão neutro. Não use secadora em temperatura alta — o ar natural é melhor para preservar o elastano.' },
    { q: 'Jaleco com elastano é confortavel para médico em plantão?', a: 'Sim. O elastano permite que o jaleco acompanhe o movimento sem apertar. Para médicos que se curvam e levantam pacientes, faz diferença real.' },
  ],
  biomedico: [
    { q: 'Qual o tecido ideal para jaleco de biomédico em laboratório?', a: 'Polyester + viscose + elastano com tratamento antimicrobiano é o mais indicado — reduz colonização bacteriana e suporta lavagens frequentes.' },
    { q: 'Jaleco de laboratório pode ser de qualquer cor?', a: 'Branco é o mais comum em laboratórios por questões de higiene. Algumas áreas aceitam cores claras. O fundamental é que o tecido seja de fácil higienização.' },
    { q: 'Como escolher o tamanho de jaleco para biomédico?', a: 'Considerando que biomédicos usam o jaleco sobre a roupa de trabalho, escolha um tamanho que permita movimento sem apertar — geralmente o mesmo que vestiria em uma camisa sociais.' },
  ],
  fisioterapeuta: [
    { q: 'Qual o melhor tecido para jaleco de fisioterapeuta?', a: 'Polyester + viscose + elastano: flexibility para movimentos de terapia, suporta transpiração e lavagens frequentes sem deformar.' },
    { q: 'Jaleco de fisioterapeuta precisa de manga longa?', a: 'Depende da especialidade. Para pilates e RPG, manga longa pode atrapalhar. Para dermatofuncional e reabilitação, oferece proteção adicional.' },
    { q: 'Jaleco slim ou profissional para fisioterapeuta?', a: 'O slim funciona bem para consultórios modernos. O profissional é melhor para quem faz terapiamanual intensiva e precisa de mais liberdade.' },
  ],
  nutricionista: [
    { q: 'Qual o tecido ideal para jaleco de nutricionista?', a: 'Leve, de fácil lavagem e com boa apresentação. O polyester + viscose + elastano da Jaleca é antimicrobiano e mantém o visual impecável em um dia inteiro de consultas.' },
    { q: 'Nutricionista pode usar jaleco de outra cor além do branco?', a: 'Sim. Tons pastel como lilás, azul claro e verde menta são elegantes e transmitem leveza — adequado para o ambiente de consultório.' },
    { q: 'Jaleco de nutricionista precisa de bolsos?', a: 'Não é obrigatório, mas é prático para carregar canetas, fichas e outros itens pequenos. Muitos modelos Jaleca têm bolso frontal discreto.' },
  ],
  podologo: [
    { q: 'Qual o tecido ideal para jaleco de podólogo?', a: 'Polyester + viscose + elastano com antimicrobiano: o trabalho com客户提供 requiring both hygiene and flexibility, and this blend handles both well.' },
    { q: 'Jaleco de podólogo precisa de manga longa?', a: 'Para procedimentos de podologia geral, manga longa oferece proteção adicional contra respingos. A NR-32 recomenda manga longa em ambientes de risco biológico.' },
    { q: 'Como lavar jaleco de podólogo para manter a higiene?', a: 'Lave a 60°C após cada dia de trabalho. O tecido antimicrobial da Jaleca reduz bactérias entre lavagens, mas a higienização regular é essencial.' },
  ],
  veterinario: [
    { q: 'Qual o melhor tecido para jaleco de veterinário?', a: 'Polyester + viscose + elastano com resistência a pelos e líquidos: o elastano permite movimento rápido e o tecido é fácil de limpar após procedimentos.' },
    { q: 'Jaleco de veterinário mancha fácil? Como evitar?', a: 'O polyester 65% resiste melhor a manchas que o algodão. Em caso de respingos, lave rapidamente. Tons mais escuros disfarçam sujeira leve.' },
    { q: 'Veterinário pode usar jaleco de qualquer cor?', a: 'Branco é o mais prático para visualizar sujeira e fazer higiene. Tons mais escuros são mais tolerantes a manchas, mas exigem verificação visual mais frequente.' },
  ],
  farmacêutico: [
    { q: 'Qual o tecido ideal para jaleco de farmacêutico?', a: 'Polyester + viscose + elastano: mantiene a aparência profissional após horas em pé no balcão, easy to wash e não amassa durante o expediente.' },
    { q: 'Jaleco de farmacêutico precisa de qualidades específicas?', a: 'Sim: fácil limpeza (resistente a respingos de produtos), antimicrobial (ambiente com exposição a medicamentos) e confortável para longos períodos em pé.' },
    { q: 'Jaleco branco ou colorido para farmácia?', a: 'Branco é o mais tradicional e transmite limpeza. Algumas redes de farmácia permitem cores corporativas — consulte a norma da sua farmácia.' },
  ],

  // ── BELEZA ─────────────────────────────────────────────────────────────────
  barbeiro: [
    { q: 'Qual o tecido ideal para jaleco ou capa de barbeiro?', a: 'Polyester + viscose: resistente a pelos, não absorve líquidos de produtos químicos e é fácil de sacudir. O elastano dá caimento justo sem apertar.' },
    { q: 'Jaleco de barbeiro precisa ser grosso?', a: 'Não. Tecido médio é melhor: permite ventilação durante o corte e ao mesmo tempo protege contra pelos e produtos químicos.' },
    { q: 'Qual cor de jaleco é mais profissional para barbeiro?', a: 'Preto é o mais popular entre barbeiros: disfarça pelos cortados, não mostra manchas de tinta de cabelo e transmite profissionalismo.' },
    { q: 'Jaleco slim ou tradicional para barbeiro?', a: 'O slim é mais moderno e permite movimento rápido entre tesoura e máquina. O tradicional dá mais espaço para movimentos amplos.' },
    { q: 'Como limpar jaleco de barbeiro para remover pelos?', a: 'Sacuda bem após cada uso, lave a cada 2-3 dias com água fria e sabão neutro. O polyester não absorve odores como o algodão.' },
  ],
  tatuador: [
    { q: 'Qual o tecido mais resistente para jaleco de tatuador?', a: 'Polyester + viscose + elastano: resiste a limpeza frequente com álcool e desinfetantes, não absorve tinta e seca rápido.' },
    { q: 'Jaleco de tatuador precisa ser à prova de tinta?', a: 'Não existe tecido 100% à prova de tinta, mas o polyester 65% da Jaleca é mais resistente a respingos. Limpe sempre que houver respingo para evitar manchas permanentes.' },
    { q: 'Qual cor de jaleco é mais prática para tatuador?', a: 'Preto é a melhor escolha: não mostra manchas de tinta, transmite profissionalismo e disfarça respingos durante a sessão.' },
    { q: 'Jaleco de tatuador com elastano faz diferença?', a: 'Sim. O elastano permite que o jaleco volte ao formato original após cada stretching movement — importante para tatuadores que ficam muito tempo na mesma posição.' },
    { q: 'Como lavar jaleco de tatuador para remover tinta?', a: 'Aplique removedor de tinta o mais rápido possível antes de lavar. Depois, lave com água fria e sabão neutro. Não use água quente — fixa a mancha.' },
  ],
  esteticista: [
    { q: 'Qual o tecido ideal para jaleco de esteticista?', a: 'Polyester + viscose + elastano: não amassa durante o dia de trabalho, easy-care para manter o visual impecável e antimicrobiano para ambiente de estética.' },
    { q: 'Jaleco de esteticista precisa ser antimicrobial?', a: 'Sim. O ambiente de estética envolve contato com produtos químicos e fluidos. O tratamento antimicrobial reduz colonização de bactérias no tecido.' },
    { q: 'Qual cor de jaleco é mais profissional para estética?', a: 'Branco é o clássico que transmite limpeza. Tons pastel como rosa claro e lavanda são elegantes e diferenciados para clínicas femininas.' },
    { q: 'Jaleco de esteticista deve ser justo ou solto?', a: 'Um caimento semi-slim é ideal: elegante sem limitar movimentos. Permite trabalhar com movimentos amplos sem parecer largueirento.' },
  ],
  massagista: [
    { q: 'Qual o melhor tecido para uniforme de massagista?', a: 'Polyester + viscose + elastano: flexível, não restinge movimento e easy-care para óleos de massagem. O elastano permite stretching durante sessões longas.' },
    { q: 'Uniforme de massagista precisa ser absorvente?', a: 'Para óleos de massagem, o polyester é melhor que algodão: não absorve tanto o óleo, facilitando a limpeza. Use avental sobre o jaleco se necessário.' },
    { q: 'Qual cor é mais adequada para uniforme de massagista?', a: 'Tons neutros e relaxantes como verde-menta, azul claro e off-white transmitem calma e higiene. Evite cores muito escuras se usar óleos claros.' },
    { q: 'Jaleco de massagista com elastano é importante?', a: 'Sim. Sessões longas de massagem exigem movimentos repetitivos. O elastano permite que o tecido acompanhe sem apertar ou restrict movement.' },
  ],
  cabeloereiro: [
    { q: 'Qual o tecido ideal para jaleco de cabeloereiro?', a: 'Polyester + viscose: resistente a químicas de cabelo, não absorve coloração e é fácil de sacudir. O elastano dá caimento moderno e confortável.' },
    { q: 'Jaleco de cabeloereiro mancha com tintura?', a: 'O polyester resiste mais que algodão a manchas de tintura. Aplique removedor rápido em respingos e lave brevemente para evitar manchas permanentes.' },
    { q: 'Qual cor de jaleco é mais prática para cabeloereiro?', a: 'Preto ou branco são as mais práticas: o preto disfarça respingos de tintura e químicos; o branco permite visualizar claramente sujeira para lavar com frequência.' },
    { q: 'Jaleco de cabeloereiro precisa de qualidades específicas?', a: 'Resistência a produtos químicos, fácil lavagem e não amassar durante o expediente. O elastano ajuda a manter o formato mesmo após muitas horas de trabalho.' },
  ],

  // ── GASTRONOMIA ───────────────────────────────────────────────────────────
  cozinheiro: [
    { q: 'Qual o tecido ideal para dolmã de cozinheiro?', a: 'Polyester 65% + viscose 30% + elastano 5%: suporta altas temperaturas da cozinha, não amassa em serviços intensos e seca rápido após lavagens.' },
    { q: 'Dolmã de cozinheiro esquenta muito?', a: 'Não se o tecido for respirável como o nosso. O elastano permite que o ar circule melhor. Para cozinhas muito quentes, dolmã com tecido mais leve é opção.' },
    { q: 'Qual a cor mais prática para dolmã de cozinheiro?', a: 'Branco é o clássico por mostrar limpo — qualquer mancha aparece, mas isso garante higiene. Preto é mais tolerante a manchas mas requer verificação visual.' },
    { q: 'Dolmã curta ou longa para cozinheiro?', a: 'Curta (até o quadril) é mais prática para movimento na cozinha. Longa oferece mais cobertura mas pode atrapalhar em cozinhas com pouco espaço.' },
    { q: 'Como lavar dolmã de cozinheiro para remover gordura?', a: 'Deixe de molho com detergente antes de lavar. Use água quente (60°C) e ciclo pesado. O polyester da Jaleca é mais resistente a gordura que algodão puro.' },
  ],
  churrasqueiro: [
    { q: 'Qual o tecido mais resistente para uniforme de churrasqueiro?', a: 'Polyester + viscose + elastano: resiste a respingos de gordura e brasa, não amassa e suporta lavagens pesadas. O elastano dá conforto em movimentos rápidos.' },
    { q: 'Avental de churrasqueiro protege contra brasa?', a: 'O polyester 65% não é à prova de fogo, mas resiste a respingos de brasa melhores que algodão. Para proteção máxima, mantenha distância segura da grelha.' },
    { q: 'Qual cor de uniforme é mais prática para churrasqueiro?', a: 'Preto ou grafite: disfarçam gordura e fumaça, não exigem lavagem frequente e transmitem profissionalismo no churrasco.' },
    { q: 'Como lavar uniforme de churrasqueiro para remover cheiro de fumaça?', a: 'Deixe de molho em água quente com detergente por 30 minutos antes da lavagem. Vinagre branco no enxágue ajuda a remover odores残留.' },
  ],
  sushiman: [
    { q: 'Qual o tecido ideal para dolmã de sushiman?', a: 'Polyester + viscose + elastano: fácil de lavar após contato com peixes, não amassa durante o serviço e seca rápido. O elastano permite movimentos precisos.' },
    { q: 'Dolmã de sushiman precisa de manga longa?', a: 'Sim. A NR-32 recomenda manga longa para ambientes com risco biológico. Além disso, protege contra respingos de peixes e outros ingredientes.' },
    { q: 'Dolmã branca de sushiman mancha fácil?', a: 'Branco mostra tudo, mas transmite a higiene que o trabalho com alimentos exige. Use umedecedor de manchas para manter a brancura impecável.' },
    { q: 'Como lavar dolmã de sushiman para remover odores de peixe?', a: 'Deixe de molho em água fria com pouco detergente por 15 minutos antes de lavar. Água quente pode fixar odores de peixe. Vinagre branco no enxágue final ajuda.' },
  ],

  // ── SERVIÇOS ───────────────────────────────────────────────────────────────
  professor: [
    { q: 'Qual o tecido ideal para jaleco de professor?', a: 'Polyester + viscose + elastano: não amassa em 8h de aula, permite movimento ao escrever no quadro e o elastano garante conforto durante todo o dia.' },
    { q: 'Professor pode usar jaleco de qualquer cor?', a: 'A maioria das escolas não restringe cor, mas tons mais neutros e sóbrios (branco, azul-marinho, cinza) transmitem mais autoridade e profissionalismo.' },
    { q: 'Jaleco slim ou profissional para professor?', a: 'O slim é mais moderno e adequado para professores de ciências exatas e universidade. O profissional é melhor para quem se.move muito durante as aulas.' },
    { q: 'Como evitar que o jaleco de professor fique amassado?', a: 'O tecido polyester 65% da Jaleca não amassa em condições normais de uso. Se guardado úmido ou dobrado, solta com uma passagem rápida de ferro na temperatura média.' },
  ],
  vendedor: [
    { q: 'Qual o tecido ideal para jaleco de vendedor?', a: 'Polyester + viscose + elastano: o elastano permite que o jaleco volte ao formato após ficar sentado ou se movimentar. Visual impecável durante todo o expediente.' },
    { q: 'Jaleco de vendedor pode ser slim?', a: 'Sim. O slim é moderno e elegante para ambientes comerciais. Mas verifique se permite movimento ao atender clientes, pegar mercadorias etc.' },
    { q: 'Qual cor de jaleco é mais profissional para vendedor?', a: 'Branco é o mais seguro e profissional. Azul-marinho transmite autoridade. Tons mais escuros disfarçam mais sujeira em ambientes de trabalho intenso.' },
  ],
  universitario: [
    { q: 'Qual o melhor tecido para jaleco de universitário?', a: 'Polyester + viscose: resistente para o dia a dia de faculdades e laboratórios, não amassa na mochila e é fácil de lavar. Elastano ajuda no conforto.' },
    { q: 'Jaleco de aluno precisa de manga longa?', a: 'Para laboratórios, sim — NR-32 exige manga longa em ambientes de risco biológico. Para aulas teóricas, manga curta é mais confortável.' },
    { q: 'Como escolher o tamanho de jaleco para universitário?', a: 'Considere usar por cima da roupa de rotina. Se quiser um visual mais justo, opte pelo tamanho que mede. Se preferir mais folga, escolha o próximo tamanho.' },
  ],
  'dona-de-casa': [
    { q: 'Qual o tecido ideal para jaleco de dona de casa?', a: 'Polyester + viscose + elastano: easy-care para lavar sempre, não amassa e o elastano garante conforto em tarefas domésticas intenseivas.' },
    { q: 'Jaleco para dona de casa deve ser prático?', a: 'Sim. Tecido que seca rápido, não precisa passar e resiste a produtos de limpeza é o ideal. O nosso polyester 65% atende bem a esses requisitos.' },
    { q: 'Qual cor de jaleco é mais prática para uso doméstico?', a: 'Cores médias como azul-marinho e grafite disfarçam manchas e combinam com qualquer ambiente da casa. Branco limpa visual mas mancha mais fácil.' },
  ],

  // ── ESCRITÓRIO ─────────────────────────────────────────────────────────────
  advogado: [
    { q: 'Advogado pode usar jaleco como roupa profissional?', a: 'Sim. O jaleco transmite profissionalismo e é aceito em tribunais e escritórios. Combine com calça social para um visual completo e elegante.' },
    { q: 'Qual o tecido ideal para jaleco de advogado?', a: 'Polyester + viscose + elastano: não amassa durante audiências longas, mantém caimento elegante e o elastano garante conforto sob toga.' },
    { q: 'Jaleco slim ou profissional para advogado?', a: 'O slim é mais moderno e adequado para advogados jovens. O profissional é mais clássico e permite mais movimento sob toga ou jaquet.' },
    { q: 'Qual cor de jaleco é mais profissional para advogado?', a: 'Preto é o mais elegante e formal. Azul-marinho é alternativo mas sóbrio. Cinza é menos formal mas ainda profissional.' },
  ],
  pastor: [
    { q: 'Qual o tecido ideal para jaleco de pastor?', a: 'Polyester + viscose + elastano: não amassa durante cultos longos, easy-care para lavagens frequentes e transmite seriedade appropriate for ministry.' },
    { q: 'Pastor pode usar jaleco preto?', a: 'Sim. Preto é o mais tradicional e apropriado para cultos e eventos religiosos. O visual sório e elegante transmite respeito e dignidade.' },
    { q: 'Jaleco de pastor precisa de qualidades específicas?', a: 'Conforto em longos períodos, tecido que não amasse e visual sório são as principais. O elastano ajuda a manter o caimento durante todo o evento.' },
  ],
  psicologa: [
    { q: 'Psicólogo deve usar jaleco?', a: 'Não é obrigatório, mas muitos psicólogos usam jaleco ou roupa social como parte da vestimenta profissional. O jaleco transmite acolhimento e profissionalismo.' },
    { q: 'Qual o tecido ideal para roupa de psicólogo?', a: 'Se usar jaleco, polyester + viscose + elastano: confortável em sessões longas, não amassa e easy-care. Para roupas sociais, opt for não-amassa.' },
    { q: 'Qual cor de jaleco é mais adequada para psicólogo?', a: 'Tons suaves como azul claro, verde-menta e off-white transmitem calma e acolhimento. Cores vibrantes podem ser energética demais para o ambiente.' },
    { q: 'Jaleco slim ou profissional para psicólogo?', a: 'O slim oferece visual moderno e acolhedor. O profissional é mais tradicional. Ambos funcionam — escolha conforme seu estilo e ambiente de trabalho.' },
  ],
  farmaceutico: [
    { q: 'Qual o tecido ideal para jaleco de farmacêutico?', a: 'Polyester + viscose + elastano: fácil de lavar, não amassa durante o turno e antimicrobial — importante para quem trabalha em contato com medicamentos.' },
    { q: 'Farmacêutico precisa de jaleco com qualidades específicas?', a: 'Antimicrobiano (reduz colonização de bactérias), easy-care (para lavagens frequentes) e confortável (longos períodos em pé no balcão).' },
    { q: 'Jaleco branco ou colorido para farmácia?', a: 'Branco é o mais comum e transmite limpeza. Algumas redes de farmácia usam cores corporativas — confiram a norma antes de escolher.' },
  ],
  secretaria: [
    { q: 'Qual o tecido ideal para jaleco de Secretária?', a: 'Polyester + viscose + elastano: não amassa durante 8h de trabalho, easy-care e o elastano garante conforto ao se sentar e levantar repetidamente.' },
    { q: 'Secretária pode usar jaleco como uniforme?', a: 'Sim. O jaleco é prático e transmite profissionalismo. Combine com calça social ou saia para um visual completo e elegante de escritório.' },
    { q: 'Jaleco slim ou profissional para Secretária?', a: 'O slim é mais moderno e elegante para ambiente de escritório. O profissional é mais confortável para quem se.move bastante durante o dia.' },
  ],

  // ── CONJUNTO / DOLMÃ ────────────────────────────────────────────────────────
  'conjunto-advogado': [
    { q: 'Conjunto profissional para advogado: qual o melhor tecido?', a: 'Polyester + viscose + elastano: não amassa em audiências longas, fácil de lavar e o elastano garante conforto o dia todo. Visual impecável garantido.' },
    { q: 'Conjunto social para advogado precisa de elastano?', a: 'Sim. O elastano permite movimento sem restrictções quando você se levanta, senta e movimenta durante audiências e reuniões.' },
  ],
  'dolma-churrasqueiro': [
    { q: 'Dolmã para churrasqueiro: qual o melhor tecido?', a: 'Polyester 65% + viscose 30% + elastano 5%: resiste a gordura, não amassa na grelha e é fácil de lavar após serviços intenseivos.' },
    { q: 'Dolmã de churrasqueiro protege contra calor?', a: 'O tecido Jaleca é respirável mas não é isolante térmico. Para exposição direta ao calor da brasa, mantenha distância de segurança.' },
  ],
}

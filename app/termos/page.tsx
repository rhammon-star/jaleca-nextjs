import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso — Jaleca',
  description: 'Leia os Termos de Uso do site Jaleca. Condições para navegação, compras, conta de usuário e propriedade intelectual.',
  alternates: { canonical: 'https://jaleca.com.br/termos' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Termos de Uso — Jaleca',
    description: 'Leia os Termos de Uso do site Jaleca. Condições para navegação, compras e propriedade intelectual.',
    url: 'https://jaleca.com.br/termos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Termos de Uso — Jaleca',
    description: 'Leia os Termos de Uso do site Jaleca.',
  },
}

export default function TermosPage() {
  return (
    <main className="py-12 md:py-20">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Institucional
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground text-sm">
            Última atualização: março de 2026
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site <strong className="text-foreground font-semibold">jaleca.com.br</strong>, você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com alguma condição, pedimos que se abstenha de utilizar nossos serviços.
            </p>
            <p className="mt-3">
              Estes termos se aplicam a todos os visitantes, clientes e usuários do site. Reservamo-nos o direito de atualizar estes termos a qualquer momento, sendo a versão mais recente sempre disponibilizada nesta página.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Uso do Site</h2>
            <p className="mb-3">Ao utilizar o site Jaleca, você concorda em:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Usar o site somente para fins lícitos e de acordo com a legislação brasileira vigente;</li>
              <li>Não realizar ações que possam danificar, sobrecarregar ou comprometer o funcionamento do site;</li>
              <li>Não tentar acessar áreas restritas ou sistemas sem autorização;</li>
              <li>Não utilizar bots, scrapers ou ferramentas automatizadas para extrair dados do site sem autorização prévia e por escrito;</li>
              <li>Fornecer informações verdadeiras, completas e atualizadas ao realizar cadastros ou pedidos.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Conta de Usuário</h2>
            <p className="mb-3">
              Para acessar determinadas funcionalidades, como histórico de pedidos e lista de desejos, você pode criar uma conta em nosso site. Ao fazê-lo:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Você é responsável pela confidencialidade de sua senha e pelo acesso à sua conta;</li>
              <li>Você deve notificar imediatamente a Jaleca sobre qualquer uso não autorizado de sua conta;</li>
              <li>Você não deve compartilhar sua conta com terceiros;</li>
              <li>Você deve ser maior de 18 anos ou ter autorização dos responsáveis legais para criar uma conta;</li>
              <li>Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Compras e Pagamentos</h2>
            <p className="mb-3">
              Ao realizar uma compra em nosso site, você concorda com as seguintes condições:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Os preços exibidos estão em Reais (R$) e incluem os impostos aplicáveis, salvo indicação contrária;</li>
              <li>O frete é calculado no momento do checkout com base no CEP de entrega informado;</li>
              <li>O pedido é confirmado somente após a aprovação do pagamento pela operadora;</li>
              <li>Em caso de indisponibilidade de estoque após a confirmação do pedido, você será comunicado e poderá optar por substituição, crédito ou reembolso integral;</li>
              <li>Reservamo-nos o direito de recusar pedidos que apresentem indícios de fraude ou violação destes termos;</li>
              <li>Os prazos de entrega são estimados e podem variar conforme a região e a transportadora.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Propriedade Intelectual</h2>
            <p className="mb-3">
              Todo o conteúdo disponibilizado no site Jaleca — incluindo, mas não se limitando a textos, imagens, fotografias, logotipos, ícones, vídeos, layouts e código-fonte — é de propriedade exclusiva da Jaleca ou de seus licenciantes e está protegido pelas leis de propriedade intelectual brasileiras e internacionais.
            </p>
            <p>
              É expressamente proibido reproduzir, distribuir, modificar, criar obras derivadas, exibir publicamente ou utilizar qualquer conteúdo do site sem autorização prévia e por escrito da Jaleca.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Limitação de Responsabilidade</h2>
            <p className="mb-3">
              Na máxima extensão permitida pela lei, a Jaleca não se responsabiliza por:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Danos indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou incapacidade de uso do site;</li>
              <li>Interrupções temporárias no acesso ao site por manutenção, falhas técnicas ou força maior;</li>
              <li>Conteúdo de sites de terceiros para os quais possamos ter links;</li>
              <li>Uso indevido da conta por terceiros não autorizados pelo titular.</li>
            </ul>
            <p className="mt-3">
              Nada nestes termos exclui ou limita responsabilidades que não possam ser excluídas por lei, incluindo os direitos previstos no Código de Defesa do Consumidor (Lei nº 8.078/1990).
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Lei Aplicável e Foro</h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão submetidas ao foro da comarca de Belo Horizonte, Minas Gerais, com renúncia expressa a qualquer outro, por mais privilegiado que seja, salvo nos casos em que a legislação de defesa do consumidor determine foro diverso.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Contato</h2>
            <p className="mb-3">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <ul className="list-none space-y-1 pl-0">
              <li><strong className="text-foreground font-medium">E-mail:</strong>{' '}
                <a href="mailto:contato@jaleca.com.br" className="text-foreground underline underline-offset-2 hover:no-underline">
                  contato@jaleca.com.br
                </a>
              </li>
              <li><strong className="text-foreground font-medium">WhatsApp:</strong>{' '}
                <a href="https://wa.me/553133672467" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:no-underline">
                  (31) 3367-2467
                </a>
              </li>
            </ul>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-14 pt-8 border-t border-border">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </main>
  )
}

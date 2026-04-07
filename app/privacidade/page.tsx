import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Jaleca',
  description: 'Saiba como a Jaleca coleta, usa e protege seus dados pessoais, em conformidade com a LGPD — Lei Geral de Proteção de Dados.',
  alternates: { canonical: 'https://jaleca.com.br/privacidade' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Política de Privacidade — Jaleca',
    description: 'Saiba como a Jaleca coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
    url: 'https://jaleca.com.br/privacidade',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Política de Privacidade — Jaleca',
    description: 'Saiba como a Jaleca coleta, usa e protege seus dados pessoais.',
  },
}

export default function PrivacidadePage() {
  return (
    <main className="py-12 md:py-20">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Institucional
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground text-sm">
            Última atualização: março de 2026
          </p>
        </div>

        <div className="prose-jaleca space-y-10 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Introdução</h2>
            <p>
              A <strong className="text-foreground font-semibold">Jaleca</strong> respeita a sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas informações, em conformidade com a{' '}
              <strong className="text-foreground font-semibold">Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
            </p>
            <p className="mt-3">
              Ao acessar nosso site ou realizar uma compra, você concorda com os termos desta política. Caso não concorde, pedimos que não utilize nossos serviços.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Dados que Coletamos</h2>
            <p className="mb-3">Coletamos as seguintes categorias de dados pessoais:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Dados de identificação:</strong> nome completo, CPF (quando necessário para nota fiscal), data de nascimento.</li>
              <li><strong className="text-foreground font-medium">Dados de contato:</strong> endereço de e-mail, número de telefone/WhatsApp.</li>
              <li><strong className="text-foreground font-medium">Dados de entrega:</strong> endereço postal completo, CEP, cidade, estado.</li>
              <li><strong className="text-foreground font-medium">Dados de pagamento:</strong> informações de cartão de crédito ou débito são processadas diretamente pela operadora de pagamento (não armazenamos dados de cartão em nossos servidores).</li>
              <li><strong className="text-foreground font-medium">Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência, origem do acesso.</li>
              <li><strong className="text-foreground font-medium">Dados de comunicação:</strong> mensagens enviadas via e-mail, WhatsApp ou formulários de contato.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Como Usamos seus Dados</h2>
            <p className="mb-3">Utilizamos seus dados pessoais para as seguintes finalidades:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processar e entregar seus pedidos;</li>
              <li>Enviar atualizações sobre o status do seu pedido;</li>
              <li>Responder dúvidas e solicitações de suporte;</li>
              <li>Enviar comunicações de marketing e novidades (somente com seu consentimento);</li>
              <li>Melhorar nosso site, produtos e serviços com base em análises de uso;</li>
              <li>Cumprir obrigações legais e fiscais;</li>
              <li>Prevenir fraudes e garantir a segurança das transações.</li>
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Compartilhamento de Dados</h2>
            <p className="mb-3">
              Não vendemos seus dados pessoais. Podemos compartilhá-los com terceiros apenas nas seguintes situações:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Transportadoras e Correios:</strong> para fins de entrega do pedido.</li>
              <li><strong className="text-foreground font-medium">Operadoras de pagamento:</strong> para processar transações financeiras com segurança.</li>
              <li><strong className="text-foreground font-medium">Plataformas de e-mail marketing:</strong> para envio de newsletters, mediante seu consentimento.</li>
              <li><strong className="text-foreground font-medium">Ferramentas de análise:</strong> como Google Analytics, para entender o comportamento de navegação.</li>
              <li><strong className="text-foreground font-medium">Autoridades legais:</strong> quando exigido por lei ou ordem judicial.</li>
            </ul>
            <p className="mt-3">
              Todos os terceiros com quem compartilhamos dados são contratualmente obrigados a manter a confidencialidade e segurança das informações.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Seus Direitos (LGPD)</h2>
            <p className="mb-3">
              Nos termos da LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Confirmação e acesso:</strong> saber se tratamos seus dados e obter uma cópia deles.</li>
              <li><strong className="text-foreground font-medium">Correção:</strong> corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li><strong className="text-foreground font-medium">Eliminação:</strong> solicitar a exclusão dos seus dados, salvo quando a retenção for obrigatória por lei.</li>
              <li><strong className="text-foreground font-medium">Portabilidade:</strong> receber seus dados em formato estruturado para uso em outro serviço.</li>
              <li><strong className="text-foreground font-medium">Revogação do consentimento:</strong> cancelar sua inscrição em comunicações de marketing a qualquer momento.</li>
              <li><strong className="text-foreground font-medium">Oposição:</strong> opor-se a tratamentos de dados realizados sem o seu consentimento.</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail{' '}
              <a href="mailto:contato@jaleca.com.br" className="text-foreground underline underline-offset-2 hover:no-underline">
                contato@jaleca.com.br
              </a>.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Cookies e Tecnologias de Rastreamento</h2>
            <p className="mb-3">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, analisar o tráfego do site e personalizar conteúdo. Os tipos de cookies que usamos incluem:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground font-medium">Cookies essenciais:</strong> necessários para o funcionamento básico do site (ex: carrinho de compras, sessão de login).</li>
              <li><strong className="text-foreground font-medium">Cookies analíticos:</strong> nos ajudam a entender como os visitantes interagem com o site (ex: Google Analytics).</li>
              <li><strong className="text-foreground font-medium">Cookies de marketing:</strong> utilizados para exibir anúncios relevantes (ex: Meta Pixel, Google Ads).</li>
            </ul>
            <p className="mt-3">
              Você pode gerenciar suas preferências de cookies a qualquer momento através do banner de consentimento no rodapé do site ou nas configurações do seu navegador.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Retenção de Dados</h2>
            <p>
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, ou conforme exigido por lei. Dados de clientes são retidos por até 5 anos para fins fiscais e contábeis. Dados de marketing são removidos assim que você revogar o consentimento.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Segurança dos Dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais contra acesso não autorizado, perda, destruição ou divulgação indevida. Nosso site utiliza conexão segura via SSL/TLS (HTTPS) em todas as páginas.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças significativas por e-mail ou mediante aviso destacado em nosso site. Recomendamos que você revise esta página regularmente.
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">10. Contato e Encarregado de Dados (DPO)</h2>
            <p className="mb-3">
              Se tiver dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato:
            </p>
            <ul className="list-none space-y-1 pl-0">
              <li><strong className="text-foreground font-medium">E-mail:</strong>{' '}
                <a href="mailto:contato@jaleca.com.br" className="text-foreground underline underline-offset-2 hover:no-underline">
                  contato@jaleca.com.br
                </a>
              </li>
              <li><strong className="text-foreground font-medium">WhatsApp:</strong>{' '}
                <a href="https://wa.me/5531992901940?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:no-underline">
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

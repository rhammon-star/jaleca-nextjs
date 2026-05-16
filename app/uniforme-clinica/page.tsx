import type { Metadata } from 'next'
import Link from 'next/link'
import UGCSection from '@/components/UGCSection'

export const revalidate = 86400

const WA_NUMBER = '5531992901940'
const WA_TEXT = encodeURIComponent('Olá! Tenho uma clínica e gostaria de cotação para uniformes (jalecos) em volume. Quantidade aproximada: ')
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`

export const metadata: Metadata = {
  title: { absolute: 'Uniforme para Clínica: Cotação em Volume | Jaleca' },
  description: 'Uniforme para clínica com padronização visual, PP ao G3, 12 cores e atendimento dedicado para gestores. Cotação rápida pelo WhatsApp.',
  alternates: { canonical: 'https://jaleca.com.br/uniforme-clinica' },
  openGraph: {
    title: 'Uniforme para Clínica — Cotação em Volume | Jaleca',
    description: 'Padronize sua equipe com jalecos Jaleca. Cotação dedicada, prazo de entrega definido, PP ao G3, 12 cores.',
    url: 'https://jaleca.com.br/uniforme-clinica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'pt-BR',
  mainEntity: [
    { '@type': 'Question', name: 'Qual o pedido mínimo para clínica?', acceptedAnswer: { '@type': 'Answer', text: 'Não trabalhamos com pedido mínimo rígido. Cotações a partir de 5 peças já recebem condição diferenciada de atendimento e prazo. Quanto maior o volume, melhores as condições comerciais.' } },
    { '@type': 'Question', name: 'Qual o prazo de entrega para pedidos em volume?', acceptedAnswer: { '@type': 'Answer', text: 'Para itens em estoque: 3 a 7 dias úteis para Sudeste, 7 a 12 dias úteis para outras regiões. Para volumes acima de 30 peças ou cores específicas sob demanda, prazo combinado na cotação (geralmente 15 a 25 dias).' } },
    { '@type': 'Question', name: 'A Jaleca emite nota fiscal para PJ?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. Emitimos NF-e para CNPJ com todos os dados fiscais. Para cotações empresariais, basta informar o CNPJ no atendimento e a nota é emitida automaticamente.' } },
    { '@type': 'Question', name: 'A Jaleca faz bordado com o nome da clínica?', acceptedAnswer: { '@type': 'Answer', text: 'Não. A Jaleca não oferece serviço de bordado. As peças são entregues sem bordado e você contrata bordadeira local de confiança. Importante: após bordadas, as peças não podem mais ser trocadas, então recomendamos validar caimento antes.' } },
    { '@type': 'Question', name: 'Quais formas de pagamento para clínica?', acceptedAnswer: { '@type': 'Answer', text: 'PIX (com 5% de desconto sobre os itens), cartão de crédito em até 12x e boleto faturado para CNPJ com cadastro aprovado. Para pedidos recorrentes, condições especiais sob consulta.' } },
    { '@type': 'Question', name: 'Como funciona a troca em pedidos em volume?', acceptedAnswer: { '@type': 'Answer', text: 'Troca em até 7 dias após recebimento, peça sem uso e com etiqueta. Em pedidos em volume, recomendamos pedir uma peça-piloto antes para validar o tamanho de cada profissional da equipe.' } },
  ],
}

const schemaService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Fornecimento de uniformes profissionais para clínicas',
  provider: {
    '@type': 'Organization',
    name: 'Jaleca Uniformes Profissionais',
    url: 'https://jaleca.com.br',
  },
  areaServed: { '@type': 'Country', name: 'Brasil' },
  audience: { '@type': 'BusinessAudience', audienceType: 'Clínicas médicas, odontológicas, estéticas e veterinárias' },
  url: 'https://jaleca.com.br/uniforme-clinica',
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Uniforme para Clínica', item: 'https://jaleca.com.br/uniforme-clinica' },
  ],
}

export default function UniformeClinicaPage() {
  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      <nav aria-label="breadcrumb" className="max-w-6xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Uniforme para Clínica</span>
      </nav>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">Atendimento B2B</span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Uniforme para clínica com padronização real
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Jalecos Jaleca para padronizar sua equipe. PP ao G3 garantidos, 12 cores em linha, prazo definido por escrito e atendimento dedicado para gestores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition">
              Pedir cotação no WhatsApp
            </a>
            <a href="#beneficios" className="inline-flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-lg transition">
              Ver benefícios
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">Resposta em até 1 dia útil • Sem MOQ rígido • NF-e para CNPJ</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-100">
          <p className="text-sm font-semibold text-emerald-700 mb-2">Para gestores de:</p>
          <ul className="space-y-2 text-gray-800">
            <li>✓ Clínicas médicas e ambulatórios</li>
            <li>✓ Clínicas odontológicas</li>
            <li>✓ Clínicas de estética e dermatologia</li>
            <li>✓ Clínicas veterinárias</li>
            <li>✓ Laboratórios e centros diagnósticos</li>
            <li>✓ Equipes de home care</li>
          </ul>
        </div>
      </section>

      <section id="beneficios" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">Por que clínicas escolhem a Jaleca</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'PP ao G3 garantido', d: 'Toda a equipe vestida sem deixar profissional fora da grade. Sem custo extra para tamanhos especiais.' },
              { t: '12 cores em linha', d: 'Branco, preto, azul royal, verde água, cinza, vinho e mais. Padronize por setor ou especialidade.' },
              { t: 'Prazo por escrito', d: 'Cotação com data de entrega clara. Estoque para Sudeste em 3-7 dias úteis, demais regiões 7-12 dias.' },
              { t: 'Tecido com elastano', d: 'Gabardine com elastano bidirecional: liberdade de movimento real para plantão e atendimento.' },
              { t: 'NF-e para CNPJ', d: 'Nota fiscal automática, condições para PJ, boleto faturado mediante aprovação cadastral.' },
              { t: 'Troca facilitada', d: 'Peça-piloto antes do pedido grande. Troca em 7 dias para peças sem uso, com etiqueta.' },
            ].map((b) => (
              <div key={b.t} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">{b.t}</h3>
                <p className="text-sm text-gray-600">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Como funciona a cotação</h2>
        <ol className="space-y-4 text-gray-700">
          <li><strong className="text-emerald-700">1.</strong> Você manda mensagem no WhatsApp com quantidade aproximada, cores desejadas e prazo necessário.</li>
          <li><strong className="text-emerald-700">2.</strong> Em até 1 dia útil enviamos cotação por escrito com modelos sugeridos, preço unitário, prazo de entrega e formas de pagamento.</li>
          <li><strong className="text-emerald-700">3.</strong> Para volumes acima de 10 peças, sugerimos uma peça-piloto para validar tamanho e caimento de cada profissional da equipe.</li>
          <li><strong className="text-emerald-700">4.</strong> Pedido confirmado: emissão de NF-e, separação e despacho. Acompanhamento pelo time de atendimento até a entrega.</li>
        </ol>
        <div className="mt-8">
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition">
            Começar cotação agora
          </a>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Perguntas frequentes</h2>
          <div className="space-y-4">
            {schemaFaq.mainEntity.map((q) => (
              <details key={q.name} className="bg-white border border-gray-200 rounded-lg p-5 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center" itemProp="name">
                  {q.name}
                  <span className="text-emerald-600 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-gray-700 text-sm" itemProp="acceptedAnswer">{q.acceptedAnswer.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Pronto para padronizar sua clínica?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Atendimento B2B dedicado, cotação em 1 dia útil, prazo por escrito e nota fiscal para CNPJ.
        </p>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition text-lg">
          Falar com atendimento B2B
        </a>
      </section>

        <section className="py-4 px-4"><div className="container"><UGCSection /></div></section>
    </main>
  )
}

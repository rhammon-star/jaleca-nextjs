import type { Metadata } from 'next'
import { InstagramGallery } from '@/components/InstagramGallery'

export const metadata: Metadata = {
  title: 'Clientes Jaleca — Veja quem usa nossos jalecos',
  description:
    'Médicos, dentistas, enfermeiros, esteticistas e professores que confiam nos jalecos Jaleca. Veja fotos reais de quem usa no dia a dia.',
  alternates: { canonical: 'https://jaleca.com.br/clientes' },
}

export default function ClientesPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">Quem usa Jaleca</h1>
      <p className="text-[#6b6b6b] text-lg mb-12 max-w-2xl">
        Profissionais de saúde, estética e educação de todo o Brasil escolhem a Jaleca pelo
        conforto, elegância e qualidade no dia a dia.
      </p>

      <InstagramGallery maxItems={12} title="@jaleca.oficial no Instagram" />

      <section className="mt-20 bg-[#f9f7f4] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Aparece aqui também</h2>
        <p className="text-[#6b6b6b] mb-6">
          Marque <strong>@jaleca.oficial</strong> nas suas fotos com o jaleco e pode aparecer nesta
          galeria.
        </p>
        <a
          href="https://www.instagram.com/jaleca.oficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#1a1a1a] text-white px-8 py-3 rounded-full hover:bg-[#333] transition-colors"
        >
          Seguir no Instagram
        </a>
      </section>
    </main>
  )
}

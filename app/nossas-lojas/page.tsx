import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Instagram } from 'lucide-react'
import { franqueados } from '@/lib/franqueados'

export const metadata: Metadata = {
  title: 'Nossas Lojas',
  description: 'Encontre a loja Jaleca mais próxima de você. Temos unidades em Minas Gerais, Espírito Santo e Paraná.',
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

export default function NossasLojasPage() {
  // Agrupa por estado
  const porEstado = franqueados.reduce<Record<string, typeof franqueados>>((acc, f) => {
    if (!acc[f.estado]) acc[f.estado] = []
    acc[f.estado].push(f)
    return acc
  }, {})

  const estadoNomes: Record<string, string> = {
    MG: 'Minas Gerais',
    ES: 'Espírito Santo',
    PR: 'Paraná',
    SP: 'São Paulo',
    RJ: 'Rio de Janeiro',
  }

  const estados = Object.keys(porEstado).sort()

  return (
    <main>
      {/* Hero */}
      <section className="bg-secondary/30 border-b border-border py-16 md:py-20">
        <div className="container text-center">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground mb-3">
            Encontre a loja mais próxima
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Nossas Lojas
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Experimente pessoalmente a qualidade Jaleca. Nossas lojas estão presentes em {franqueados.length} cidades.
          </p>
        </div>
      </section>

      {/* Cards por estado */}
      <section className="container py-14 md:py-20">
        {estados.map(estado => (
          <div key={estado} className="mb-14 last:mb-0">
            {/* Estado label */}
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.3em] uppercase text-muted-foreground">
                <MapPin size={12} />
                {estadoNomes[estado] ?? estado}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Grid de lojas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {porEstado[estado].map(loja => {
                const waNumber = loja.whatsapp.replace(/\D/g, '')
                const waLink = `https://wa.me/${waNumber}?text=Olá!%20Vim%20pelo%20site%20da%20Jaleca%20e%20gostaria%20de%20mais%20informações%20sobre%20a%20loja%20de%20${encodeURIComponent(loja.cidade)}.`
                const igHandle = loja.instagram.replace('@', '')
                const igLink = `https://instagram.com/${igHandle}`

                return (
                  <div
                    key={loja.id}
                    className="group border border-border bg-background hover:border-foreground/20 hover:shadow-sm transition-all duration-300 p-6 flex flex-col"
                  >
                    {/* City + badge */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="font-display text-xl font-semibold text-foreground leading-tight">
                        {loja.cidade}
                      </h2>
                      <span className="text-[10px] font-semibold tracking-widest uppercase border border-border text-muted-foreground px-2 py-0.5 shrink-0">
                        {estado}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                      {loja.nome_loja}
                    </p>

                    {/* Address */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {loja.endereco}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs font-semibold tracking-wide uppercase py-2.5 px-4 hover:bg-[#1ebe5d] transition-colors duration-200"
                      >
                        <WhatsAppIcon />
                        Falar no WhatsApp
                      </a>
                      <a
                        href={igLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-border text-foreground text-xs font-semibold tracking-wide uppercase py-2.5 px-4 hover:bg-secondary/50 transition-colors duration-200"
                      >
                        <Instagram size={13} />
                        {loja.instagram}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Franquia */}
      <section className="border-t border-border bg-secondary/20 py-14 md:py-16">
        <div className="container text-center">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-muted-foreground mb-3">
            Quer ter sua própria loja?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Seja um franqueado Jaleca
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Faça parte da maior rede de uniformes premium para profissionais da saúde do Brasil.
          </p>
          <a
            href={`https://wa.me/5531992901940?text=Olá!%20Tenho%20interesse%20em%20ser%20um%20franqueado%20Jaleca.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-foreground text-background text-xs font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-foreground/90 transition-colors duration-200"
          >
            Quero ser uma revenda
          </a>
        </div>
      </section>
    </main>
  )
}

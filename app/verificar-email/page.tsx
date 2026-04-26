import Link from 'next/link'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

type Props = { searchParams: Promise<{ status?: string }> }

export default async function VerificarEmailPage({ searchParams }: Props) {
  const { status } = await searchParams

  const states = {
    success: {
      icon: <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />,
      title: 'E-mail confirmado!',
      message: 'Seu endereço de e-mail foi verificado com sucesso. Obrigada por confirmar!',
    },
    expired: {
      icon: <Clock size={48} className="text-amber-500 mx-auto mb-4" />,
      title: 'Link expirado',
      message: 'Este link de verificação expirou. Faça login na sua conta para solicitar um novo.',
    },
    invalid: {
      icon: <XCircle size={48} className="text-red-500 mx-auto mb-4" />,
      title: 'Link inválido',
      message: 'Este link de verificação é inválido ou já foi utilizado.',
    },
  }

  const state = states[status as keyof typeof states] ?? states.invalid

  return (
    <main className="py-20">
      <div className="container max-w-md text-center">
        {state.icon}
        <h1 className="font-display text-3xl font-semibold mb-3">{state.title}</h1>
        <p className="text-muted-foreground mb-8">{state.message}</p>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 bg-ink text-background px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all"
        >
          Ver Produtos
        </Link>
      </div>
    </main>
  )
}

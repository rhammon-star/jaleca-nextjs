'use client'

import { useEffect, useState, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Clock, XCircle, Copy, Check, Loader2, ExternalLink } from 'lucide-react'
import { trackPurchase } from '@/components/Analytics'

type PaymentData = {
  paymentMethod: 'pix' | 'boleto' | 'credit_card'
  wcOrderId: number
  pagarmeOrderId: string
  pagarmeStatus: string
  orderValue?: number
  orderItems?: Array<{ id: string; name: string; price: number; quantity: number }>
  customerEmail?: string
  // PIX
  pixQrCode?: string
  pixQrCodeUrl?: string
  pixExpiresAt?: string
  // Boleto
  boletoUrl?: string
  boletoPdf?: string
  boletoLine?: string
  boletoDueAt?: string
  // Card
  cardStatus?: string
  cardMessage?: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function PixView({ data }: { data: PaymentData }) {
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (!data.pixExpiresAt) return
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(data.pixExpiresAt!).getTime() - Date.now()) / 1000))
      setSecondsLeft(diff)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [data.pixExpiresAt])

  const hours = Math.floor(secondsLeft / 3600)
  const mins = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60

  async function copy() {
    if (!data.pixQrCode) return
    await navigator.clipboard.writeText(data.pixQrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 text-sm">
        <Clock size={16} />
        <span>Expira em: <strong>{hours}h {String(mins).padStart(2,'0')}m {String(secs).padStart(2,'0')}s</strong></span>
      </div>

      {data.pixQrCodeUrl && (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.pixQrCodeUrl} alt="QR Code PIX" className="w-52 h-52 border border-border" />
        </div>
      )}

      <div>
        <p className="text-sm text-muted-foreground mb-2">Ou copie o código PIX:</p>
        <div className="flex items-center gap-2 border border-border bg-secondary/20 px-3 py-2">
          <p className="text-xs font-mono break-all text-left flex-1 select-all">{data.pixQrCode}</p>
          <button
            onClick={copy}
            className="shrink-0 p-1.5 hover:bg-secondary transition-colors"
            title="Copiar"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          </button>
        </div>
        {copied && <p className="text-xs text-green-600 mt-1">Copiado!</p>}
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>1. Abra o app do seu banco</p>
        <p>2. Escolha pagar via PIX com QR Code ou Copia e Cola</p>
        <p>3. Confirme o pagamento</p>
      </div>
    </div>
  )
}

function BoletoView({ data }: { data: PaymentData }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!data.boletoLine) return
    await navigator.clipboard.writeText(data.boletoLine)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Vencimento: <strong>{data.boletoDueAt ? formatDate(data.boletoDueAt) : '3 dias úteis'}</strong>
        </p>
      </div>

      {data.boletoLine && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Linha digitável:</p>
          <div className="flex items-center gap-2 border border-border bg-secondary/20 px-3 py-2">
            <p className="text-xs font-mono break-all text-left flex-1 select-all">{data.boletoLine}</p>
            <button onClick={copy} className="shrink-0 p-1.5 hover:bg-secondary transition-colors">
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
          {copied && <p className="text-xs text-green-600 mt-1">Copiado!</p>}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {data.boletoUrl && (
          <a
            href={data.boletoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-ink text-background px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all"
          >
            <ExternalLink size={14} />
            Ver Boleto
          </a>
        )}
        {data.boletoPdf && (
          <a
            href={data.boletoPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-secondary/20 transition-all"
          >
            Baixar PDF
          </a>
        )}
      </div>
    </div>
  )
}

function CardView({ data }: { data: PaymentData }) {
  const approved = data.cardStatus === 'paid' || data.pagarmeStatus === 'paid'

  return (
    <div className="text-center space-y-4">
      {approved ? (
        <>
          <CheckCircle size={48} className="text-green-600 mx-auto" />
          <p className="text-muted-foreground">Seu pagamento foi aprovado!</p>
        </>
      ) : (
        <>
          <XCircle size={48} className="text-red-500 mx-auto" />
          <p className="text-muted-foreground">
            {data.cardMessage || 'Pagamento não autorizado. Tente outro cartão.'}
          </p>
          <Link
            href="/finalizar-compra"
            className="inline-flex items-center gap-2 bg-ink text-background px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all"
          >
            Tentar novamente
          </Link>
        </>
      )}
    </div>
  )
}

function PagamentoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<PaymentData | null>(null)
  const [paid, setPaid] = useState(false)
  const pollRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const trackFiredRef = useRef(false)

  const load = useCallback(() => {
    try {
      const raw = sessionStorage.getItem('jaleca-payment')
      if (!raw) { router.replace('/'); return }
      setData(JSON.parse(raw) as PaymentData)
    } catch {
      router.replace('/')
    }
  }, [router])

  useEffect(() => { load() }, [load])

  // Allow direct link with orderId param (for future use)
  useEffect(() => {
    const orderId = searchParams.get('orderId')
    if (orderId && !data) load()
  }, [searchParams, data, load])

  // Poll payment status for PIX and boleto
  useEffect(() => {
    if (!data?.pagarmeOrderId || data.paymentMethod === 'credit_card' || paid) return

    const poll = async () => {
      try {
        const res = await fetch(`/api/payment/status?id=${data.pagarmeOrderId}&wc=${data.wcOrderId}`)
        const json = await res.json()
        if (json.paid) {
          setPaid(true)
          sessionStorage.removeItem('jaleca-payment')
          return
        }
      } catch {}
      pollRef.current = setTimeout(poll, 5000)
    }

    pollRef.current = setTimeout(poll, 5000)
    return () => clearTimeout(pollRef.current)
  }, [data, paid])

  // Fire purchase tracking + Google Customer Reviews survey once when payment is confirmed
  useEffect(() => {
    if (trackFiredRef.current || !data) return
    const isCardApproved = data.paymentMethod === 'credit_card' &&
      (data.cardStatus === 'paid' || data.pagarmeStatus === 'paid')
    const isConfirmed = paid || isCardApproved
    if (!isConfirmed) return
    trackFiredRef.current = true
    trackPurchase(
      String(data.wcOrderId),
      data.orderValue ?? 0,
      data.orderItems ?? []
    )

    // Google Customer Reviews — Survey Opt-in
    if (data.customerEmail) {
      const deliveryDate = new Date()
      let businessDays = 0
      while (businessDays < 7) {
        deliveryDate.setDate(deliveryDate.getDate() + 1)
        const day = deliveryDate.getDay()
        if (day !== 0 && day !== 6) businessDays++
      }
      const estimatedDelivery = deliveryDate.toISOString().split('T')[0]

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).renderOptIn = function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).gapi.load('surveyoptin', function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(window as any).gapi.surveyoptin.render({
            merchant_id: 5759143798,
            order_id: String(data.wcOrderId),
            email: data.customerEmail,
            delivery_country: 'BR',
            estimated_delivery_date: estimatedDelivery,
          })
        })
      }

      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [data, paid])

  if (paid) {
    return (
      <main className="py-20">
        <div className="container max-w-md text-center">
          <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-semibold mb-3">Pagamento confirmado!</h1>
          <p className="text-muted-foreground mb-8">Seu pedido foi recebido e está sendo processado. Você receberá um e-mail de confirmação em breve.</p>
          <Link href="/produtos" className="inline-flex items-center gap-2 bg-ink text-background px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all">
            Continuar comprando
          </Link>
        </div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className="py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </main>
    )
  }

  const titles = {
    pix: 'Pague com PIX',
    boleto: 'Boleto Bancário',
    credit_card: 'Pagamento com Cartão',
  }

  const isPending = data.paymentMethod !== 'credit_card' ||
    (data.paymentMethod === 'credit_card' && data.cardStatus !== 'paid')

  return (
    <main className="py-12">
      <div className="container max-w-lg">
        <div className="text-center mb-8">
          {data.paymentMethod === 'credit_card' && (data.cardStatus === 'paid' || data.pagarmeStatus === 'paid') ? (
            <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
          ) : data.paymentMethod !== 'credit_card' ? (
            <Clock size={48} className="text-amber-500 mx-auto mb-3" />
          ) : (
            <XCircle size={48} className="text-red-500 mx-auto mb-3" />
          )}
          <h1 className="font-display text-3xl font-semibold mb-2">{titles[data.paymentMethod]}</h1>
          <p className="text-muted-foreground text-sm">Pedido #{data.wcOrderId}</p>
        </div>

        <div className="border border-border p-6 mb-6">
          {data.paymentMethod === 'pix' && <PixView data={data} />}
          {data.paymentMethod === 'boleto' && <BoletoView data={data} />}
          {data.paymentMethod === 'credit_card' && <CardView data={data} />}
        </div>

        {isPending && data.paymentMethod !== 'credit_card' && (
          <p className="text-center text-xs text-muted-foreground mb-6">
            Após o pagamento, você receberá um e-mail de confirmação em alguns minutos.
          </p>
        )}

        <div className="text-center">
          <Link
            href="/produtos"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<main className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-muted-foreground" /></main>}>
      <PagamentoContent />
    </Suspense>
  )
}

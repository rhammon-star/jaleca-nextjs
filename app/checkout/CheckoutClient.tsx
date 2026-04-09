'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Loader2, ChevronRight, Check, Plus, Eye, EyeOff } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import ShippingCalculator, { type ShippingOption } from '@/components/ShippingCalculator'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import { formatCPF, validateCPF, cleanCPF } from '@/lib/cpf'

type AddressForm = {
  first_name: string
  last_name: string
  email: string
  phone: string
  postcode: string
  address_1: string
  address_2: string
  neighborhood: string
  city: string
  state: string
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return digits
}

const emptyAddress: AddressForm = {
  first_name: '', last_name: '', email: '', phone: '',
  postcode: '', address_1: '', address_2: '', neighborhood: '', city: '', state: '',
}

type PaymentMethod = 'credit_card' | 'pix' | 'boleto'

export default function CheckoutClient() {
  const { items, clearCart, addItem, appliedCoupon } = useCart()
  const { user, isLoggedIn, login } = useAuth()
  const router = useRouter()

  const [guestEmail, setGuestEmail] = useState('')
  const [address, setAddress] = useState<AddressForm>(emptyAddress)
  const [calculatedCep, setCalculatedCep] = useState<string>('')
  const [cepLoading, setCepLoading] = useState(false)
  const [shipping, setShipping] = useState<ShippingOption | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [upsellProducts, setUpsellProducts] = useState<WooProduct[]>([])

  // Card fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [installments, setInstallments] = useState(1)

  // CPF flow
  const [cpf, setCpf] = useState('')
  const [cpfStatus, setCpfStatus] = useState<'idle' | 'checking' | 'found' | 'not_found'>('idle')
  const [cpfCustomer, setCpfCustomer] = useState<{ id: number } | null>(null)
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutPassword, setCheckoutPassword] = useState('')
  const [showCheckoutPassword, setShowCheckoutPassword] = useState(false)
  const [cpfLoginError, setCpfLoginError] = useState('')
  const [cpfLoggedIn, setCpfLoggedIn] = useState(false)
  const cpfTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Coupon
  const [couponInput, setCouponInput] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0)
  const shippingCost = shipping?.cost ?? 0
  const total = subtotal + shippingCost
  const pixDiscount = paymentMethod === 'pix' ? (subtotal - couponDiscount) * 0.05 : 0
  const finalTotal = subtotal - couponDiscount - pixDiscount + shippingCost

  // Prefill coupon from cart context
  useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon.code)
      const subtotalNow = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0)
      if (appliedCoupon.discount_type === 'percent') {
        setCouponDiscount(subtotalNow * (parseFloat(appliedCoupon.amount) / 100))
      } else {
        setCouponDiscount(parseFloat(appliedCoupon.amount) || 0)
      }
    }
  }, [appliedCoupon, items])

  // Prefill CEP from cart
  useEffect(() => {
    try {
      const cep = localStorage.getItem('jaleca-checkout-cep')
      if (cep && cep.length === 8) {
        setCalculatedCep(cep)
        setAddress(prev => ({ ...prev, postcode: formatCEP(cep) }))
        lookupCEP(cep)
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load upsell products
  useEffect(() => {
    graphqlClient
      .request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 6 })
      .then(data => {
        const cartIds = new Set(items.map(i => i.id))
        const suggestions = data.products.nodes.filter(p => !cartIds.has(p.id)).slice(0, 3)
        setUpsellProducts(suggestions)
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLoggedIn && user) {
      const [first, ...rest] = user.name.split(' ')
      setAddress(prev => ({
        ...prev,
        first_name: first || '',
        last_name: rest.join(' '),
        email: user.email,
      }))
    }
  }, [isLoggedIn, user])

  async function lookupCEP(cep: string) {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`/api/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: clean }),
      })
      const data = await res.json()
      if (data.address) {
        setAddress(prev => ({
          ...prev,
          city: data.address.city,
          state: data.address.state,
          neighborhood: data.address.neighborhood || prev.neighborhood,
          address_1: data.address.street || prev.address_1,
          address_2: '', // clear house number when CEP changes
        }))
      }
    } catch {}
    finally {
      setCepLoading(false)
    }
  }

  async function applyCoupon() {
    const code = couponInput.trim()
    if (!code) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Cupom inválido')
        setCouponCode('')
        setCouponDiscount(0)
        return
      }
      setCouponCode(data.code)
      // Calculate discount based on type
      if (data.discount_type === 'percent') {
        setCouponDiscount(subtotal * (parseFloat(data.amount) / 100))
      } else {
        setCouponDiscount(parseFloat(data.amount))
      }
    } catch {
      setCouponError('Erro ao validar cupom')
    } finally {
      setCouponLoading(false)
    }
  }

  function removeCoupon() {
    setCouponCode('')
    setCouponDiscount(0)
    setCouponInput('')
    setCouponError('')
  }

  function maskEmail(email: string) {
    const [user, domain] = email.split('@')
    return `${user.slice(0, 2)}***@${domain}`
  }

  function handleCPFChange(value: string) {
    const formatted = formatCPF(value)
    setCpf(formatted)
    setCpfStatus('idle')
    setCpfCustomer(null)
    setCpfLoginError('')
    const clean = cleanCPF(formatted)
    if (clean.length === 11 && validateCPF(clean)) {
      clearTimeout(cpfTimer.current)
      cpfTimer.current = setTimeout(() => doLookupCPF(clean), 600)
    }
  }

  async function doLookupCPF(clean: string) {
    setCpfStatus('checking')
    try {
      const res = await fetch(`/api/auth/cpf-lookup?cpf=${clean}`)
      const data = await res.json()
      if (data.found) {
        setCpfCustomer({ id: data.id })
        setCpfStatus('found')
      } else {
        setCpfStatus('not_found')
      }
    } catch {
      setCpfStatus('not_found')
    }
  }

  function handleCEPChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCEP(e.target.value)
    setAddress(prev => ({ ...prev, postcode: formatted }))
    const clean = formatted.replace(/\D/g, '')
    if (clean.length === 8) {
      setCalculatedCep(clean)
      lookupCEP(formatted)
    }
  }

  async function tokenizeCard(): Promise<string> {
    const [expMonth, expYear] = cardExpiry.split('/')
    const billingAddress = {
      line_1: address.address_1
        ? `${address.address_1}${address.address_2 ? ', ' + address.address_2 : ''}`.trim()
        : 'Endereço não informado',
      line_2: address.address_2 || '',
      zip_code: address.postcode.replace(/\D/g, ''),
      city: address.city,
      state: address.state,
      country: 'BR',
    }
    const res = await fetch(
      `https://api.pagar.me/core/v5/tokens?appId=${process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'card',
          card: {
            number: cardNumber.replace(/\D/g, ''),
            holder_name: cardName.trim().toUpperCase(),
            exp_month: parseInt(expMonth),
            exp_year: parseInt('20' + expYear.trim()),
            cvv: cardCvv,
            billing_address: billingAddress,
          },
        }),
      }
    )
    const data = await res.json()
    if (!res.ok || !data.id) throw new Error(data.message || 'Erro ao processar cartão')
    return data.id
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCpfLoginError('')

    if (!validateCPF(cpf) && !isLoggedIn) {
      setError('Informe um CPF válido para continuar')
      return
    }

    const email = isLoggedIn ? user!.email : guestEmail
    if (!address.first_name || !address.last_name || !email || !address.postcode || !address.address_1 || !address.address_2 || !address.city || !address.state) {
      setError('Preencha todos os campos obrigatórios')
      return
    }
    if (!shipping) {
      setError('Selecione uma opção de frete')
      return
    }

    setLoading(true)
    let resolvedCustomerId = isLoggedIn && user ? user.id : undefined

    try {
      // CPF found → login first to link order to existing account
      if (!isLoggedIn && cpfStatus === 'found' && cpfCustomer && !cpfLoggedIn) {
        if (!checkoutEmail || !checkoutPassword) {
          setCpfLoginError('Digite seu e-mail e senha para continuar')
          setLoading(false)
          return
        }
        try {
          await login(checkoutEmail, checkoutPassword)
          resolvedCustomerId = cpfCustomer.id
        } catch {
          setCpfLoginError('Senha incorreta. Tente novamente ou recupere sua senha.')
          setLoading(false)
          return
        }
      }

      // CPF not found → auto-create account so customer gets order history
      if (!isLoggedIn && cpfStatus === 'not_found' && email) {
        try {
          const tempPwd = Math.random().toString(36).slice(-10) + 'A1!'
          const regRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `${address.first_name} ${address.last_name}`.trim(),
              email,
              password: tempPwd,
              cpf: cleanCPF(cpf),
              phone: address.phone,
            }),
          })
          if (regRes.ok) {
            const regData = await regRes.json()
            resolvedCustomerId = regData.user?.id
            // "Define sua senha" email is sent server-side in /api/auth/register
          }
        } catch {
          // Continue without account — guest order
        }
      }

      const billingData = {
        first_name: address.first_name,
        last_name: address.last_name,
        address_1: `${address.address_1}, ${address.address_2}`.trim().replace(/,$/, ''),
        address_2: address.neighborhood,
        city: address.city,
        state: address.state,
        postcode: address.postcode.replace(/\D/g, ''),
        country: 'BR',
        email,
        phone: address.phone,
      }

      // Tokenize card if needed
      let cardToken: string | undefined
      if (paymentMethod === 'credit_card') {
        try {
          cardToken = await tokenizeCard()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erro ao processar cartão')
          setLoading(false)
          return
        }
      }

      const paymentData = {
        paymentMethod,
        cpf: cleanCPF(cpf),
        billing: billingData,
        items: items.map(item => ({
          product_id: item.databaseId,
          quantity: item.quantity,
          name: item.name,
          price: parsePrice(item.price),
        })),
        shipping: {
          method_id: shipping.id,
          method_title: shipping.label,
          cost: shipping.cost,
        },
        customer_id: resolvedCustomerId,
        cardToken,
        installments,
        couponCode: couponCode || undefined,
        totalDiscount: couponDiscount + pixDiscount,
      }

      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao processar pagamento')
        return
      }

      // For credit card, only clear cart if payment was approved
      if (paymentMethod === 'credit_card' && data.cardStatus !== 'paid' && data.pagarmeStatus !== 'paid') {
        setError(data.cardMessage || 'Pagamento não autorizado. Verifique os dados do cartão e tente novamente.')
        return
      }

      clearCart()
      sessionStorage.setItem('jaleca-payment', JSON.stringify(data))
      window.location.href = '/pagamento'
    } catch {
      setError('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="py-16">
        <div className="container max-w-md text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground/40" />
          <h1 className="font-display text-3xl font-semibold mb-3">Sacola vazia</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos antes de finalizar a compra.</p>
          <Link href="/produtos" className="inline-flex items-center gap-2 bg-ink text-background px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all">
            Ver Produtos
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="py-8 md:py-12">
      <div className="container">
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
            {/* Right column: Upsell + Order summary */}
            <aside className="space-y-6 lg:col-start-2 lg:row-start-1">
            {/* Upsell / cross-sell */}
            {upsellProducts.length > 0 && (
              <div className="border border-border p-5">
                <h2 className="font-display text-lg font-semibold mb-4">Você também pode gostar</h2>
                <div className="space-y-3">
                  {upsellProducts.map(product => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative w-14 h-16 flex-shrink-0 bg-secondary/20 overflow-hidden">
                        {product.image?.sourceUrl ? (
                          <Image
                            src={product.image.sourceUrl}
                            alt={product.image.altText || product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{product.name.replace(/ - Jaleca$/i, '')}</p>
                        <p className="text-xs text-muted-foreground">{product.price || product.regularPrice}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addItem({
                          id: product.id,
                          databaseId: product.databaseId,
                          slug: product.slug,
                          name: product.name.replace(/ - Jaleca$/i, ''),
                          image: product.image?.sourceUrl,
                          price: product.price || product.regularPrice || '0',
                        })}
                        className="flex-shrink-0 w-7 h-7 bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
                        aria-label={`Adicionar ${product.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className="border border-border p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-xl font-semibold mb-4">Resumo do Pedido</h2>
              <div className="space-y-4 divide-y divide-border">
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="relative w-14 h-16 flex-shrink-0 bg-secondary/20 overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {[item.color, item.size].filter(Boolean).join(' / ')}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[11px] text-muted-foreground">Qtd: {item.quantity}</span>
                          <span className="text-xs font-semibold">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Coupon field */}
                <div className="pt-4 border-t border-border">
                  {couponCode ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 text-sm">
                      <span className="text-green-800 font-mono font-semibold tracking-wider">{couponCode.toUpperCase()}</span>
                      <span className="text-green-700 font-medium">- {formatCurrency(couponDiscount)}</span>
                      <button type="button" onClick={removeCoupon} className="text-green-600 hover:text-green-900 text-xs ml-2 underline">remover</button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                          placeholder="Cupom de desconto"
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading || !couponInput.trim()}
                          className="px-4 py-2 text-xs font-semibold tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
                        >
                          {couponLoading ? '...' : 'Aplicar'}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Cupom ({couponCode.toUpperCase()})</span>
                      <span>- {formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>- {formatCurrency((subtotal - couponDiscount) * 0.05)}</span>
                    </div>
                  )}
                  {shipping && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>{shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>
                      {paymentMethod === 'pix'
                        ? formatCurrency((subtotal - couponDiscount) * 0.95 + shippingCost)
                        : formatCurrency(total - couponDiscount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </aside>

            {/* Left column */}
            <div className="space-y-8 lg:col-start-1 lg:row-start-1">
              {/* Section 1: Identification */}
              <section className="border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-ink text-background text-xs flex items-center justify-center font-bold">1</span>
                  Identificação
                </h2>

                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-secondary/20 px-4 py-3">
                      <Check size={16} className="text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    {/* CPF for logged-in user (needed for Pagar.me) */}
                    <div>
                      <label htmlFor="checkout-cpf-logged" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">CPF *</label>
                      <input
                        id="checkout-cpf-logged"
                        type="text"
                        value={cpf}
                        onChange={e => handleCPFChange(e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                        autoComplete="off"
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* CPF field — drives the entire identification flow */}
                    <div>
                      <label htmlFor="checkout-cpf" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                        CPF * {cpfStatus === 'checking' && <span className="text-muted-foreground font-normal normal-case">(verificando...)</span>}
                      </label>
                      <input
                        id="checkout-cpf"
                        type="text"
                        value={cpf}
                        onChange={e => handleCPFChange(e.target.value)}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        autoComplete="off"
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Seu CPF identifica sua conta e é necessário para emissão de nota fiscal.
                      </p>
                    </div>

                    {/* CPF found — show login prompt */}
                    {cpfStatus === 'found' && cpfCustomer && !cpfLoggedIn && (
                      <div className="border border-green-200 bg-green-50 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Check size={15} className="text-green-600" />
                          <p className="text-sm font-medium text-green-800">
                            Este CPF já possui cadastro. Faça login para continuar.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor="checkout-email" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                              E-mail *
                            </label>
                            <input
                              id="checkout-email"
                              type="email"
                              value={checkoutEmail}
                              onChange={e => setCheckoutEmail(e.target.value)}
                              placeholder="seu@email.com"
                              autoComplete="email"
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="checkout-password" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                              Senha *
                            </label>
                            <div className="relative">
                              <input
                                id="checkout-password"
                                type={showCheckoutPassword ? 'text' : 'password'}
                                value={checkoutPassword}
                                onChange={e => setCheckoutPassword(e.target.value)}
                                placeholder="Digite sua senha"
                                autoComplete="current-password"
                                className="w-full border border-border bg-background px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-foreground transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCheckoutPassword(v => !v)}
                                aria-label={showCheckoutPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showCheckoutPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                              </button>
                            </div>
                          </div>
                          {cpfLoginError && (
                            <p className="text-xs text-red-600">{cpfLoginError}</p>
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              if (!checkoutEmail || !checkoutPassword) {
                                setCpfLoginError('Preencha e-mail e senha')
                                return
                              }
                              setCpfLoginError('')
                              try {
                                await login(checkoutEmail, checkoutPassword)
                                setCpfLoggedIn(true)
                              } catch {
                                setCpfLoginError('E-mail ou senha incorretos.')
                              }
                            }}
                            className="w-full bg-foreground text-background py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-foreground/90 transition-colors"
                          >
                            Entrar e Continuar
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (checkoutEmail) {
                                await fetch('/api/auth/forgot-password', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ email: checkoutEmail }),
                                })
                              }
                              setCpfLoginError('Se o e-mail estiver correto, enviaremos um link de recuperação.')
                            }}
                            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground block"
                          >
                            Esqueci minha senha
                          </button>
                        </div>
                      </div>
                    )}
                    {cpfStatus === 'found' && cpfLoggedIn && (
                      <div className="flex items-center gap-2 border border-green-200 bg-green-50 p-3">
                        <Check size={15} className="text-green-600" />
                        <p className="text-sm text-green-800 font-medium">Login realizado com sucesso!</p>
                      </div>
                    )}

                    {/* CPF not found — new customer */}
                    {cpfStatus === 'not_found' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200">
                          <Check size={14} className="text-blue-600" />
                          <p className="text-xs text-blue-800">
                            Novo cliente — sua conta será criada automaticamente ao finalizar.
                          </p>
                        </div>
                        <div>
                          <label htmlFor="checkout-email-new" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Email *</label>
                          <input
                            id="checkout-email-new"
                            type="email"
                            value={guestEmail}
                            onChange={e => setGuestEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            autoComplete="email"
                            className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* CPF idle (not yet validated) — show email as fallback */}
                    {cpfStatus === 'idle' && (
                      <div>
                        <label htmlFor="checkout-email-idle" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Email *</label>
                        <input
                          id="checkout-email-idle"
                          type="email"
                          value={guestEmail}
                          onChange={e => setGuestEmail(e.target.value)}
                          placeholder="seu@email.com"
                          autoComplete="email"
                          className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                        />
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Section 2: Address */}
              <section className="border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-ink text-background text-xs flex items-center justify-center font-bold">2</span>
                  Endereço de Entrega
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="addr-first-name" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Nome *</label>
                    <input
                      id="addr-first-name"
                      type="text"
                      value={address.first_name}
                      onChange={e => setAddress(p => ({ ...p, first_name: e.target.value }))}
                      required
                      autoComplete="given-name"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-last-name" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Sobrenome *</label>
                    <input
                      id="addr-last-name"
                      type="text"
                      value={address.last_name}
                      onChange={e => setAddress(p => ({ ...p, last_name: e.target.value }))}
                      required
                      autoComplete="family-name"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-phone" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Telefone</label>
                    <input
                      id="addr-phone"
                      type="tel"
                      value={address.phone}
                      onChange={e => setAddress(p => ({ ...p, phone: e.target.value }))}
                      placeholder="(11) 99999-0000"
                      autoComplete="tel"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-postcode" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                      CEP *{cepLoading && <span className="ml-1 text-muted-foreground">(buscando...)</span>}
                    </label>
                    <input
                      id="addr-postcode"
                      type="text"
                      value={address.postcode}
                      onChange={handleCEPChange}
                      placeholder="00000-000"
                      maxLength={9}
                      required
                      autoComplete="postal-code"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="addr-address1" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Endereço *</label>
                    <input
                      id="addr-address1"
                      type="text"
                      value={address.address_1}
                      onChange={e => setAddress(p => ({ ...p, address_1: e.target.value }))}
                      required
                      placeholder="Rua, Av., etc."
                      autoComplete="address-line1"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-address2" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Número *</label>
                    <input
                      id="addr-address2"
                      type="text"
                      value={address.address_2}
                      onChange={e => setAddress(p => ({ ...p, address_2: e.target.value }))}
                      required
                      autoComplete="address-line2"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-neighborhood" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Bairro</label>
                    <input
                      id="addr-neighborhood"
                      type="text"
                      value={address.neighborhood}
                      onChange={e => setAddress(p => ({ ...p, neighborhood: e.target.value }))}
                      autoComplete="address-level3"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-city" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Cidade *</label>
                    <input
                      id="addr-city"
                      type="text"
                      value={address.city}
                      onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                      required
                      autoComplete="address-level2"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="addr-state" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Estado *</label>
                    <input
                      id="addr-state"
                      type="text"
                      value={address.state}
                      onChange={e => setAddress(p => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))}
                      required
                      maxLength={2}
                      placeholder="SP"
                      autoComplete="address-level1"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Shipping */}
              <section className="border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-ink text-background text-xs flex items-center justify-center font-bold">3</span>
                  Frete
                </h2>
                {calculatedCep ? (
                  <ShippingCalculator
                    key={calculatedCep}
                    onShippingSelected={setShipping}
                    selectedId={shipping?.id}
                    initialCep={calculatedCep}
                    subtotal={subtotal}
                    onCepCalculated={cep => {
                      // Frete mudou o CEP → atualiza o endereço (mantém nome/telefone)
                      setAddress(prev => ({ ...prev, postcode: formatCEP(cep) }))
                      lookupCEP(cep)
                    }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">Preencha o CEP no endereço acima para calcular o frete.</p>
                )}
              </section>

              {/* Section 4: Payment */}
              <section className="border border-border p-6">
                <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-ink text-background text-xs flex items-center justify-center font-bold">4</span>
                  Forma de Pagamento
                </h2>
                <div className="space-y-3">
                  {(['pix', 'boleto', 'credit_card'] as PaymentMethod[]).map(method => (
                    <div key={method}>
                      <label
                        className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${
                          paymentMethod === method ? 'border-foreground bg-secondary/20' : 'border-border hover:border-foreground/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method)}
                          className="accent-foreground"
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {method === 'pix' && 'PIX'}
                            {method === 'boleto' && 'Boleto Bancário'}
                            {method === 'credit_card' && 'Cartão de Crédito'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method === 'pix' && `Aprovação imediata${process.env.NEXT_PUBLIC_PIX_DISCOUNT ? ` · ${process.env.NEXT_PUBLIC_PIX_DISCOUNT}% de desconto` : ''}`}
                            {method === 'boleto' && 'Vencimento em 3 dias úteis'}
                            {method === 'credit_card' && 'Visa, Mastercard, Elo, Amex'}
                          </p>
                        </div>
                      </label>

                      {/* Card form */}
                      {method === 'credit_card' && paymentMethod === 'credit_card' && (
                        <div className="border border-t-0 border-foreground bg-secondary/10 p-4 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Número do Cartão *</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={e => {
                                const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                                setCardNumber(v.replace(/(.{4})/g, '$1 ').trim())
                              }}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              autoComplete="cc-number"
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Nome no Cartão *</label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={e => setCardName(e.target.value.toUpperCase())}
                              placeholder="NOME COMO NO CARTÃO"
                              autoComplete="cc-name"
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Validade *</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={e => {
                                  const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                                  setCardExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v)
                                }}
                                placeholder="MM/AA"
                                maxLength={5}
                                autoComplete="cc-exp"
                                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">CVV *</label>
                              <input
                                type="text"
                                value={cardCvv}
                                onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="000"
                                maxLength={4}
                                autoComplete="cc-csc"
                                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Parcelas *</label>
                            <select
                              value={installments}
                              onChange={e => setInstallments(Number(e.target.value))}
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                            >
                              {Array.from({ length: 3 }, (_, i) => i + 1).map(n => (
                                <option key={n} value={n}>
                                  {n}x de {formatCurrency(finalTotal / n)} {n === 1 ? '(sem juros)' : '(sem juros)'}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {error && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-background py-4 text-xs font-semibold tracking-widest uppercase transition-all hover:bg-ink/90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Processando...</>
                ) : (
                  <>{paymentMethod === 'credit_card' ? 'Ir para Pagamento Seguro' : 'Finalizar Pedido'} <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  )
}

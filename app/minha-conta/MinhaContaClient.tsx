'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Loader2, Eye, EyeOff, Star, ChevronDown, ChevronUp,
  Package, User, MapPin, Award, LogOut, Phone, Mail,
  ShoppingBag, CheckCircle, Clock, XCircle, AlertCircle,
  Edit2, Save, X, Heart, ShoppingCart, Repeat2, Truck,
  CreditCard, Box, RotateCcw, Trash2,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { getPointsDiscount } from '@/lib/loyalty-utils'
import { graphqlClient } from '@/lib/graphql'

type Tab = 'orders' | 'profile' | 'addresses' | 'points' | 'wishlist' | 'reviews'

type WCOrder = {
  id: number
  number: string
  status: string
  total: string
  date_created: string
  line_items: Array<{
    id: number
    product_id: number
    variation_id?: number
    name: string
    sku?: string
    quantity: number
    total: string
    image?: { src: string }
  }>
  shipping_lines: Array<{ method_title: string; total: string }>
  meta_data?: Array<{ key: string; value: string }>
}

type WCAddress = {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  city: string
  state: string
  postcode: string
  country: string
  phone?: string
  email?: string
}

type WCCustomer = {
  id: number
  email: string
  first_name: string
  last_name: string
  billing?: WCAddress
  shipping?: WCAddress
}

type WishProduct = {
  id: string
  databaseId: number
  name: string
  slug: string
  price?: string
  regularPrice?: string
  image?: { sourceUrl: string; altText: string }
}

const GET_PRODUCTS_BY_IDS = `
  query GetProductsByIds($ids: [ID!]) {
    products(where: { include: $ids }, first: 50) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct { price regularPrice image { sourceUrl altText } }
        ... on VariableProduct { price regularPrice image { sourceUrl altText } }
      }
    }
  }
`

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  pending:         { label: 'Aguardando pagamento', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock size={12} />, step: 1 },
  processing:      { label: 'Em processamento',     color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: <Package size={12} />, step: 2 },
  'on-hold':       { label: 'Aguardando',           color: 'bg-orange-50 text-orange-700 border-orange-200', icon: <AlertCircle size={12} />, step: 1 },
  'em-separacao':  { label: 'Em separação',         color: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Box size={12} />, step: 3 },
  enviado:         { label: 'Enviado',              color: 'bg-blue-50 text-blue-700 border-blue-200',       icon: <Truck size={12} />, step: 4 },
  completed:       { label: 'Concluído',            color: 'bg-green-50 text-green-700 border-green-200',    icon: <CheckCircle size={12} />, step: 5 },
  cancelled:       { label: 'Cancelado',            color: 'bg-red-50 text-red-700 border-red-200',          icon: <XCircle size={12} />, step: 0 },
  refunded:        { label: 'Reembolsado',          color: 'bg-gray-50 text-gray-600 border-gray-200',       icon: <RotateCcw size={12} />, step: 0 },
  failed:          { label: 'Falhou',               color: 'bg-red-50 text-red-700 border-red-200',          icon: <XCircle size={12} />, step: 0 },
}

const ORDER_STEPS = [
  { label: 'Pedido recebido', icon: <ShoppingBag size={14} /> },
  { label: 'Pagamento confirmado', icon: <CreditCard size={14} /> },
  { label: 'Em separação', icon: <Box size={14} /> },
  { label: 'A caminho', icon: <Truck size={14} /> },
  { label: 'Entregue', icon: <CheckCircle size={14} /> },
]

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-secondary text-foreground border-border', icon: null }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border ${cfg.color}`}>
      {cfg.icon}{cfg.label}
    </span>
  )
}

function OrderTimeline({ status, trackingStatus }: { status: string; trackingStatus?: string }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg || cfg.step === 0) return null
  const currentStep = (trackingStatus && TRACKING_STEP[trackingStatus])
    ? TRACKING_STEP[trackingStatus]
    : cfg.step

  return (
    <div className="py-3">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-border z-0" />
        <div
          className="absolute left-0 top-4 h-0.5 bg-ink z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (ORDER_STEPS.length - 1)) * 100}%` }}
        />
        {ORDER_STEPS.map((step, idx) => {
          const done = idx < currentStep
          const active = idx === currentStep - 1
          return (
            <div key={idx} className="flex flex-col items-center z-10 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                done ? 'bg-ink text-background border-ink' :
                active ? 'bg-ink text-background border-ink ring-2 ring-ink/20' :
                'bg-background text-muted-foreground border-border'
              }`}>
                {step.icon}
              </div>
              <p className={`text-[9px] font-semibold mt-1.5 text-center leading-tight max-w-[56px] ${
                done || active ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatCurrency(value: string | number) {
  return `R$ ${parseFloat(String(value)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

function formatCEP(cep: string) {
  const d = cep.replace(/\D/g, '')
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep
}

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const TRACKING_CONFIG: Record<string, { label: string; color: string }> = {
  posted:           { label: 'Postado',          color: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_transit:       { label: 'Em trânsito',      color: 'bg-blue-50 text-blue-700 border-blue-200' },
  out_for_delivery: { label: 'Saiu p/ entrega',  color: 'bg-orange-50 text-orange-700 border-orange-200' },
  delivered:        { label: 'Entregue',         color: 'bg-green-50 text-green-700 border-green-200' },
  undelivered:      { label: 'Tentativa falhou', color: 'bg-red-50 text-red-700 border-red-200' },
}

const TRACKING_STEP: Record<string, number> = {
  posted: 3, in_transit: 4, out_for_delivery: 4, delivered: 5,
}

function getOrderTracking(order: WCOrder) {
  const get = (key: string) => order.meta_data?.find(m => m.key === key)?.value ?? ''
  return {
    code:    get('jaleca_tracking_code'),
    carrier: get('jaleca_tracking_carrier'),
    status:  get('jaleca_tracking_status'),
    active:  get('jaleca_tracking_active') === '1',
  }
}

function trackingUrl(code: string, carrier: string): string {
  if (carrier.toLowerCase().includes('jadlog')) {
    return `https://www.jadlog.com.br/jadlog/tracking.jad?cte=${code}`
  }
  return `https://rastreamento.correios.com.br/app/resultado.php?objeto=${code}`
}

export default function MinhaContaClient() {
  const { user, isLoggedIn, isLoading, logout, updateProfile } = useAuth()
  const { items: wishlistIds, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tab = searchParams.get('tab')
    if (tab === 'reviews') return 'reviews'
    return 'orders'
  })

  // Orders
  const [orders, setOrders] = useState<WCOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  // Customer (for addresses)
  const [customer, setCustomer] = useState<WCCustomer | null>(null)
  const [customerLoading, setCustomerLoading] = useState(false)

  // Loyalty points
  const [loyaltyPoints, setLoyaltyPoints] = useState<number | null>(null)
  const [loyaltyLoading, setLoyaltyLoading] = useState(false)

  // Wishlist products
  const [wishProducts, setWishProducts] = useState<WishProduct[]>([])
  const [wishLoading, setWishLoading] = useState(false)

  // Profile form
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Address editing
  const [editingBilling, setEditingBilling] = useState(false)
  const [editingShipping, setEditingShipping] = useState(false)
  const [billingForm, setBillingForm] = useState<WCAddress>({ first_name: '', last_name: '', address_1: '', city: '', state: '', postcode: '', country: 'BR' })
  const [shippingForm, setShippingForm] = useState<WCAddress>({ first_name: '', last_name: '', address_1: '', city: '', state: '', postcode: '', country: 'BR' })
  const [addressSaving, setAddressSaving] = useState(false)
  const [addressSuccess, setAddressSuccess] = useState('')
  const [sameAsBilling, setSameAsBilling] = useState(false)

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/')
  }, [isLoggedIn, isLoading, router])

  useEffect(() => {
    if (user) {
      const [first, ...rest] = (user.name || '').split(' ')
      setFirstName(first || '')
      setLastName(rest.join(' '))
      setEmail(user.email)
    }
  }, [user])

  const fetchOrders = useCallback(() => {
    if (!user) return
    setOrdersLoading(true)
    fetch(`/api/orders?customerId=${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setOrders(data) })
      .catch(() => {})
      .finally(() => setOrdersLoading(false))
  }, [user])

  const fetchCustomer = useCallback(() => {
    if (!user) return
    setCustomerLoading(true)
    fetch(`/api/auth/profile?userId=${user.id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.customer) {
          setCustomer(data.customer)
          if (data.customer.billing) setBillingForm(data.customer.billing)
          if (data.customer.shipping) setShippingForm(data.customer.shipping)
          if (data.customer.billing?.phone) setPhone(data.customer.billing.phone)
        }
      })
      .catch(() => {})
      .finally(() => setCustomerLoading(false))
  }, [user])

  const fetchPoints = useCallback(() => {
    if (!user) return
    setLoyaltyLoading(true)
    fetch(`/api/loyalty?customerId=${user.id}`)
      .then(r => r.json())
      .then((data: { points?: number }) => {
        if (typeof data.points === 'number') setLoyaltyPoints(data.points)
      })
      .catch(() => {})
      .finally(() => setLoyaltyLoading(false))
  }, [user])

  const fetchWishlistProducts = useCallback(() => {
    if (wishlistIds.length === 0) { setWishProducts([]); return }
    setWishLoading(true)
    graphqlClient
      .request<{ products: { nodes: WishProduct[] } }>(GET_PRODUCTS_BY_IDS, { ids: wishlistIds })
      .then(data => setWishProducts(data.products.nodes))
      .catch(() => {})
      .finally(() => setWishLoading(false))
  }, [wishlistIds])

  useEffect(() => {
    if (!user) return
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'addresses') fetchCustomer()
    if (activeTab === 'points') fetchPoints()
    if (activeTab === 'profile') fetchCustomer()
    if (activeTab === 'wishlist') fetchWishlistProducts()
  }, [activeTab, user, fetchOrders, fetchCustomer, fetchPoints, fetchWishlistProducts])

  useEffect(() => {
    if (user) { fetchOrders(); fetchPoints() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  function handleReorderAll(order: WCOrder) {
    order.line_items?.forEach(item => {
      // Call addItem once per quantity unit (addItem always adds 1)
      const times = item.quantity || 1
      for (let i = 0; i < times; i++) {
        addItem({
          id: String(item.product_id || item.id),
          databaseId: item.product_id || item.id,
          slug: item.sku || '',
          name: item.name,
          image: item.image?.src,
          price: formatCurrency(parseFloat(item.total) / times),
        })
      }
    })
  }

  function handlePayNow(order: WCOrder) {
    order.line_items?.forEach(item => {
      const times = item.quantity || 1
      for (let i = 0; i < times; i++) {
        addItem({
          id: String(item.product_id || item.id),
          databaseId: item.product_id || item.id,
          slug: item.sku || '',
          name: item.name,
          image: item.image?.src,
          price: formatCurrency(parseFloat(item.total) / times),
        })
      }
    })
    router.push('/finalizar-compra')
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)
    setProfileLoading(true)
    try {
      const name = `${firstName} ${lastName}`.trim()
      const updates: Record<string, string> = {}
      if (name !== user?.name) updates.name = name
      if (email !== user?.email) updates.email = email
      if (password) updates.password = password
      if (phone) updates.phone = phone
      await updateProfile(updates)
      if (phone) {
        await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
          body: JSON.stringify({ userId: user?.id, phone }),
        })
      }
      setProfileSuccess(true)
      setPassword('')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setProfileLoading(false)
    }
  }

  async function handleSaveAddress(type: 'billing' | 'shipping') {
    setAddressSaving(true)
    setAddressSuccess('')
    try {
      const body: Record<string, unknown> = { userId: user?.id }
      if (type === 'shipping' && sameAsBilling) {
        body.shipping = billingForm
      } else {
        body[type] = type === 'billing' ? billingForm : shippingForm
      }
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(body),
      })
      setAddressSuccess(type)
      if (type === 'billing') setEditingBilling(false)
      else setEditingShipping(false)
      fetchCustomer()
    } catch {
      // ignore
    } finally {
      setAddressSaving(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <main className="py-16 flex justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </main>
    )
  }

  if (!isLoggedIn) return null

  const totalSpent = orders.reduce((acc, o) => acc + parseFloat(o.total || '0'), 0)
  const nextRewardAt = Math.ceil(((loyaltyPoints ?? 0) + 1) / 100) * 100
  const pointsProgress = loyaltyPoints !== null ? ((loyaltyPoints % 100) / 100) * 100 : 0

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'orders',    label: 'Pedidos',    icon: <Package size={16} /> },
    { id: 'wishlist',  label: 'Favoritos',  icon: <Heart size={16} /> },
    { id: 'reviews',   label: 'Avaliar',    icon: <Star size={16} /> },
    { id: 'profile',   label: 'Meus Dados', icon: <User size={16} /> },
    { id: 'addresses', label: 'Endereços',  icon: <MapPin size={16} /> },
    { id: 'points',    label: 'Pontos',     icon: <Award size={16} /> },
  ]

  return (
    <main className="py-8 md:py-12">
      <div className="container">

        {/* Welcome + Stats */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-ink text-background flex items-center justify-center text-xl font-bold flex-shrink-0 select-none">
            {getInitials(user?.name || '')}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Olá, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{user?.email}</p>
          </div>
          {/* Mini stats */}
          <div className="flex gap-3">
            <div className="border border-border px-4 py-3 text-center min-w-[72px]">
              <p className="text-xl font-bold tabular-nums">{orders.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Pedidos</p>
            </div>
            <div className="border border-border px-4 py-3 text-center min-w-[72px]">
              <p className="text-xl font-bold tabular-nums">
                {orders.length > 0 ? `R$${Math.round(totalSpent)}` : '—'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Total</p>
            </div>
            <div className="border border-border px-4 py-3 text-center min-w-[72px]">
              <p className="text-xl font-bold tabular-nums text-yellow-600">{loyaltyPoints ?? '—'}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">Pontos</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full md:w-52 flex-shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-ink text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                  }`}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-left text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <LogOut size={16} />Sair
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Meus Pedidos</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 border border-border">
                    <ShoppingBag size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground mb-4">Nenhum pedido encontrado.</p>
                    <Link href="/produtos" className="inline-flex items-center gap-2 bg-ink text-background px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-colors">
                      Ver Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => {
                      const isExpanded = expandedOrder === order.id
                      return (
                        <div key={order.id} className="border border-border">
                          {/* Order header */}
                          <button
                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                            className="w-full text-left p-4 hover:bg-secondary/10 transition-colors"
                            aria-expanded={isExpanded}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {/* Thumbnails */}
                                <div className="flex -space-x-2">
                                  {order.line_items?.slice(0, 3).map((item, idx) =>
                                    item.image?.src ? (
                                      <div key={idx} className="w-10 h-10 border-2 border-background bg-secondary overflow-hidden">
                                        <Image src={item.image.src} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                                      </div>
                                    ) : (
                                      <div key={idx} className="w-10 h-10 border-2 border-background bg-secondary flex items-center justify-center">
                                        <Package size={14} className="text-muted-foreground" />
                                      </div>
                                    )
                                  )}
                                  {order.line_items?.length > 3 && (
                                    <div className="w-10 h-10 border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                      +{order.line_items.length - 3}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">Pedido #{order.number}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(order.date_created)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="font-semibold text-sm">{formatCurrency(order.total)}</p>
                                  <StatusBadge status={order.status} />
                                </div>
                                {isExpanded ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
                              </div>
                            </div>
                          </button>

                          {/* Order detail */}
                          {isExpanded && (
                            <div className="border-t border-border p-4 bg-secondary/5 space-y-4">
                              {/* Timeline */}
                              {(() => {
                                const tr = getOrderTracking(order)
                                return (
                                  <>
                                    <OrderTimeline status={order.status} trackingStatus={tr.status || undefined} />
                                    {/* Tracking block */}
                                    {tr.code && (
                                      <div className={`border px-4 py-3 space-y-1.5 ${TRACKING_CONFIG[tr.status]?.color ?? 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <Truck size={14} />
                                            <span className="text-xs font-semibold">
                                              {TRACKING_CONFIG[tr.status]?.label ?? 'Em trânsito'} — {tr.carrier}
                                            </span>
                                          </div>
                                          <a
                                            href={trackingUrl(tr.code, tr.carrier)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs underline underline-offset-2 font-semibold whitespace-nowrap"
                                          >
                                            Rastrear
                                          </a>
                                        </div>
                                        <p className="text-xs font-mono opacity-80">{tr.code}</p>
                                      </div>
                                    )}
                                  </>
                                )
                              })()}

                              {/* Items */}
                              <div className="space-y-2">
                                {order.line_items?.map(item => (
                                  <div key={item.id} className="flex items-center gap-3">
                                    {item.image?.src ? (
                                      <div className="w-12 h-12 bg-secondary overflow-hidden flex-shrink-0">
                                        <Image src={item.image.src} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                                        <Package size={16} className="text-muted-foreground" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-medium flex-shrink-0">{formatCurrency(item.total)}</p>
                                  </div>
                                ))}
                              </div>

                              {order.shipping_lines?.length > 0 && (
                                <div className="flex justify-between text-sm pt-2 border-t border-border">
                                  <span className="text-muted-foreground flex items-center gap-1"><Truck size={12} />{order.shipping_lines[0].method_title}</span>
                                  <span>{formatCurrency(order.shipping_lines[0].total)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-semibold text-sm pt-2 border-t border-border">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                  <button
                                    onClick={() => handlePayNow(order)}
                                    className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase bg-ink text-background px-4 py-2 hover:bg-ink/90 transition-all"
                                  >
                                    Pagar agora
                                  </button>
                                )}
                                <button
                                  onClick={() => handleReorderAll(order)}
                                  className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase border border-border px-4 py-2 hover:bg-ink hover:text-background hover:border-ink transition-all"
                                >
                                  <Repeat2 size={13} />Comprar novamente
                                </button>
                                {order.status === 'completed' && (
                                  <button
                                    onClick={() => setActiveTab('reviews')}
                                    className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase border border-border px-4 py-2 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 transition-all"
                                  >
                                    <Star size={13} />Avaliar produtos
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Meus Favoritos</h2>
                {wishLoading ? (
                  <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
                ) : wishlistIds.length === 0 ? (
                  <div className="text-center py-16 border border-border">
                    <Heart size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground mb-4">Nenhum produto favoritado ainda.</p>
                    <Link href="/produtos" className="inline-flex items-center gap-2 bg-ink text-background px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-colors">
                      Ver Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishProducts.map(product => (
                      <div key={product.id} className="border border-border group relative">
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-background/80 hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label="Remover dos favoritos"
                        >
                          <Trash2 size={13} />
                        </button>
                        <Link href={`/produto/${product.slug}`} className="block">
                          <div className="aspect-square bg-secondary overflow-hidden">
                            {product.image?.sourceUrl ? (
                              <Image
                                src={product.image.sourceUrl}
                                alt={product.image.altText || product.name}
                                width={300}
                                height={300}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={32} className="text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium line-clamp-2 mb-1">{product.name}</p>
                            {product.price && (
                              <p className="text-sm font-semibold"
                                dangerouslySetInnerHTML={{ __html: product.price }}
                              />
                            )}
                          </div>
                        </Link>
                        <div className="px-3 pb-3">
                          <button
                            onClick={() => addItem({
                              id: String(product.databaseId),
                              databaseId: product.databaseId,
                              slug: product.slug,
                              name: product.name,
                              image: product.image?.sourceUrl,
                              price: product.price || '0',
                            })}
                            className="w-full flex items-center justify-center gap-1.5 bg-ink text-background py-2 text-[10px] font-semibold tracking-widest uppercase hover:bg-ink/90 transition-colors"
                          >
                            <ShoppingCart size={11} />Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Meus Dados</h2>
                {profileSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />Dados atualizados com sucesso!
                  </div>
                )}
                {profileError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{profileError}</div>
                )}
                <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="profile-first-name" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Nome</label>
                      <input id="profile-first-name" type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="profile-last-name" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Sobrenome</label>
                      <input id="profile-last-name" type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                      <Mail size={12} className="inline mr-1" aria-hidden="true" />Email
                    </label>
                    <input id="profile-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
                      <Phone size={12} className="inline mr-1" aria-hidden="true" />Telefone / WhatsApp
                    </label>
                    <input id="profile-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000"
                      autoComplete="tel"
                      className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="profile-password" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">Nova Senha</label>
                    <p className="text-xs text-muted-foreground mb-2">Deixe em branco para manter a senha atual</p>
                    <div className="relative">
                      <input id="profile-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        className="w-full border border-border bg-background px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-foreground transition-colors" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={profileLoading}
                    className="bg-ink text-background px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-all disabled:opacity-60 flex items-center gap-2">
                    {profileLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Salvar Alterações
                  </button>
                </form>
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Meus Endereços</h2>
                {addressSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />Endereço salvo com sucesso!
                  </div>
                )}
                {customerLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Billing */}
                      <AddressCard
                        title="Endereço de Cobrança"
                        address={customer?.billing}
                        isEditing={editingBilling}
                        form={billingForm}
                        onFormChange={setBillingForm}
                        onEdit={() => { setBillingForm(customer?.billing || billingForm); setEditingBilling(true) }}
                        onCancel={() => setEditingBilling(false)}
                        onSave={() => handleSaveAddress('billing')}
                        saving={addressSaving}
                        showPhone
                      />
                      {/* Shipping */}
                      <AddressCard
                        title="Endereço de Entrega"
                        address={customer?.shipping}
                        isEditing={editingShipping}
                        form={sameAsBilling ? billingForm : shippingForm}
                        onFormChange={setShippingForm}
                        onEdit={() => { setShippingForm(customer?.shipping || shippingForm); setEditingShipping(true) }}
                        onCancel={() => { setEditingShipping(false); setSameAsBilling(false) }}
                        onSave={() => handleSaveAddress('shipping')}
                        saving={addressSaving}
                        sameAsBilling={sameAsBilling}
                        onSameAsBillingChange={setSameAsBilling}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* POINTS */}
            {activeTab === 'points' && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Meus Pontos</h2>
                {loyaltyLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="space-y-6 max-w-md">
                    {/* Balance card */}
                    <div className="border border-border p-8 text-center">
                      <Star size={40} className="mx-auto mb-3 text-yellow-500 fill-yellow-400" />
                      <p className="text-5xl font-bold tabular-nums mb-1">{loyaltyPoints ?? 0}</p>
                      <p className="text-sm text-muted-foreground mb-4">pontos acumulados</p>
                      {(loyaltyPoints ?? 0) >= 100 && (
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 text-sm font-semibold">
                          <CheckCircle size={15} />
                          {formatCurrency(getPointsDiscount(loyaltyPoints ?? 0))} de desconto disponível
                        </div>
                      )}
                    </div>

                    {/* Progress to next reward */}
                    <div className="border border-border p-5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Próxima recompensa</span>
                        <span className="text-muted-foreground">{loyaltyPoints ?? 0} / {nextRewardAt} pts</span>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(pointsProgress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Faltam <strong>{Math.max(0, nextRewardAt - (loyaltyPoints ?? 0))} pontos</strong> para ganhar {formatCurrency(5)} de desconto
                      </p>
                    </div>

                    {/* How it works */}
                    <div className="border border-border p-5 space-y-3">
                      <h3 className="font-display text-lg font-semibold">Como funciona</h3>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {[
                          'A cada <strong>R$ 1,00</strong> gasto você ganha <strong>1 ponto</strong>',
                          '<strong>100 pontos</strong> = <strong>R$ 5,00</strong> de desconto na próxima compra',
                          'Pontos são creditados após a <strong>confirmação do pagamento</strong>',
                          'Para resgatar, use o campo de <strong>cupom no checkout</strong> ou fale pelo WhatsApp',
                        ].map((text, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: text }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'reviews' && (
              <div>
                <h2 className="font-display text-2xl font-semibold mb-6">Minhas Avaliações</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Aqui você pode avaliar os produtos que comprou. Sua opinião ajuda outras profissionais a escolherem o jaleco certo.
                </p>
                {ordersLoading ? (
                  <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
                ) : orders.filter(o => o.status === 'completed').length === 0 ? (
                  <div className="text-center py-16 border border-border">
                    <Star size={40} className="mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground mb-4">Nenhum pedido concluído para avaliar.</p>
                    <Link href="/produtos" className="inline-flex items-center gap-2 bg-ink text-background px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-colors">
                      Ver Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.filter(o => o.status === 'completed').map(order => (
                      <div key={order.id} className="border border-border p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold text-sm">Pedido #{order.number}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(order.date_created)}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border bg-green-50 text-green-700 border-green-200">
                            <CheckCircle size={12} />Entregue
                          </span>
                        </div>
                        <div className="space-y-3">
                          {order.line_items?.map(item => (
                            <ProductReviewForm
                              key={item.id}
                              item={item}
                              orderId={order.id}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

// Address card sub-component
type AddressCardProps = {
  title: string
  address?: WCAddress
  isEditing: boolean
  form: WCAddress
  onFormChange: (f: WCAddress) => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  saving: boolean
  showPhone?: boolean
  sameAsBilling?: boolean
  onSameAsBillingChange?: (v: boolean) => void
}

function AddressCard({ title, address, isEditing, form, onFormChange, onEdit, onCancel, onSave, saving, showPhone, sameAsBilling, onSameAsBillingChange }: AddressCardProps) {
  const hasAddress = address && address.address_1
  const [cepLoading, setCepLoading] = useState(false)

  async function handleCEPChange(cep: string) {
    const raw = cep.replace(/\D/g, '')
    onFormChange({ ...form, postcode: cep })
    if (raw.length === 8) {
      setCepLoading(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
        const data = await res.json()
        if (!data.erro) {
          onFormChange({
            ...form,
            postcode: cep,
            address_1: data.logradouro || form.address_1,
            address_2: data.bairro || form.address_2,
            city: data.localidade || form.city,
            state: data.uf || form.state,
          })
        }
      } catch { /* ignore */ } finally {
        setCepLoading(false)
      }
    }
  }

  return (
    <div className="border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {!isEditing && (
          <button onClick={onEdit} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Edit2 size={13} />{hasAddress ? 'Editar' : 'Adicionar'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          {/* Same as billing toggle (only for shipping) */}
          {onSameAsBillingChange && (
            <label className="flex items-center gap-2 text-sm cursor-pointer mb-1">
              <input
                type="checkbox"
                checked={sameAsBilling ?? false}
                onChange={e => onSameAsBillingChange(e.target.checked)}
                className="w-4 h-4"
              />
              Usar mesmo endereço de cobrança
            </label>
          )}

          {!sameAsBilling && (() => {
            const pfx = title.toLowerCase().replace(/\s+/g, '-')
            return (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${pfx}-first-name`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Nome</label>
                  <input id={`${pfx}-first-name`} value={form.first_name} onChange={e => onFormChange({ ...form, first_name: e.target.value })}
                    autoComplete="given-name"
                    className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label htmlFor={`${pfx}-last-name`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Sobrenome</label>
                  <input id={`${pfx}-last-name`} value={form.last_name} onChange={e => onFormChange({ ...form, last_name: e.target.value })}
                    autoComplete="family-name"
                    className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
              </div>
              <div className="relative">
                <label htmlFor={`${pfx}-postcode`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">CEP</label>
                <input
                  id={`${pfx}-postcode`}
                  value={form.postcode}
                  onChange={e => handleCEPChange(e.target.value)}
                  maxLength={9}
                  placeholder="00000-000"
                  autoComplete="postal-code"
                  className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors pr-8"
                />
                {cepLoading && <Loader2 size={12} className="animate-spin absolute right-2.5 top-8 text-muted-foreground" aria-hidden="true" />}
              </div>
              <div>
                <label htmlFor={`${pfx}-address1`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Endereço (Rua, nº)</label>
                <input id={`${pfx}-address1`} value={form.address_1} onChange={e => onFormChange({ ...form, address_1: e.target.value })}
                  placeholder="Ex: Rua das Flores, 123"
                  autoComplete="address-line1"
                  className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
              </div>
              <div>
                <label htmlFor={`${pfx}-address2`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Bairro / Complemento</label>
                <input id={`${pfx}-address2`} value={form.address_2 || ''} onChange={e => onFormChange({ ...form, address_2: e.target.value })}
                  placeholder="Bairro, apto, bloco..."
                  autoComplete="address-line2"
                  className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${pfx}-city`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Cidade</label>
                  <input id={`${pfx}-city`} value={form.city} onChange={e => onFormChange({ ...form, city: e.target.value })}
                    autoComplete="address-level2"
                    className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label htmlFor={`${pfx}-state`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Estado</label>
                  <input id={`${pfx}-state`} value={form.state} onChange={e => onFormChange({ ...form, state: e.target.value.toUpperCase().slice(0, 2) })} maxLength={2} placeholder="SP"
                    autoComplete="address-level1"
                    className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
              </div>
              {showPhone && (
                <div>
                  <label htmlFor={`${pfx}-phone`} className="block text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-1">Telefone</label>
                  <input id={`${pfx}-phone`} value={form.phone || ''} onChange={e => onFormChange({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000"
                    autoComplete="tel"
                    className="w-full border border-border bg-background px-2.5 py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
              )}
            </>
            )
          })()}

          <div className="flex gap-2 pt-1">
            <button onClick={onSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-ink text-background py-2 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}Salvar
            </button>
            <button onClick={onCancel}
              className="flex items-center gap-1 px-3 py-2 text-xs border border-border hover:bg-secondary/20 transition-colors" aria-label="Cancelar">
              <X size={13} />
            </button>
          </div>
        </div>
      ) : hasAddress ? (
        <div className="text-sm space-y-1 text-muted-foreground">
          <p className="text-foreground font-medium">{address.first_name} {address.last_name}</p>
          <p>{address.address_1}{address.address_2 ? `, ${address.address_2}` : ''}</p>
          <p>{address.city} — {address.state} — {formatCEP(address.postcode)}</p>
          {address.phone && <p className="flex items-center gap-1"><Phone size={12} />{address.phone}</p>}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado.</p>
      )}
    </div>
  )
}

// ProductReviewForm sub-component
type ProductReviewFormProps = {
  item: WCOrder['line_items'][0]
  orderId: number
}

function ProductReviewForm({ item, orderId }: ProductReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      setError('Selecione uma nota de 1 a 5 estrelas')
      return
    }
    if (review.trim().length < 10) {
      setError('Escreva um comentário com pelo menos 10 caracteres')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/reviews/${item.product_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          review: review.trim(),
          reviewer: 'Cliente Jaleca',
          reviewer_email: 'cliente@jaleca.com.br',
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar avaliação')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar avaliação')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200">
        <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-700">Avaliação enviada!</p>
          <p className="text-xs text-green-600">Obrigada pelo seu feedback. Sua avaliação ajuda outras profissionais.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border p-4">
      <div className="flex items-center gap-3 mb-4">
        {item.image?.src ? (
          <div className="w-12 h-12 bg-secondary overflow-hidden flex-shrink-0">
            <Image src={item.image.src} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
            <Package size={16} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <p className="text-xs text-muted-foreground">Pedido #{orderId}</p>
        </div>
      </div>

      {/* Star rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-colors hover:scale-110"
            aria-label={`Nota ${star} estrelas`}
          >
            <Star
              size={24}
              className={
                star <= (hoverRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          {rating === 0 ? 'Toque para avaliar' : `${rating}/5 estrelas`}
        </span>
      </div>

      {/* Review text */}
      <textarea
        value={review}
        onChange={e => setReview(e.target.value)}
        placeholder="Conte o que você achou do produto (qualidade, caimento, tamanho, etc.)"
        rows={3}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
      />

      {error && (
        <p className="text-red-600 text-xs mt-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 flex items-center gap-2 bg-ink text-background px-5 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
        Enviar Avaliação
      </button>
    </form>
  )
}

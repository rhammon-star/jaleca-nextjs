/**
 * Brevo helpers for cart recovery.
 * Stores abandoned cart data as contact attributes in a dedicated Brevo list.
 *
 * Attributes used (must exist in Brevo account — auto-created on first run):
 *   ABANDONOU_EM      — ISO timestamp of abandonment
 *   CARRINHO_ITENS    — JSON string of cart items
 *   RECUPERACAO_ETAPA — number: 0=captured, 1=1h sent, 2=24h sent, 3=72h sent
 */

export type CartItem = {
  id: string
  name: string
  price: string
  quantity: number
  image?: string
}

const BREVO_API = 'https://api.brevo.com/v3'
const LIST_NAME = 'Carrinho Abandonado'

function headers() {
  const key = process.env.BREVO_API_KEY
  if (!key) throw new Error('BREVO_API_KEY not set')
  return {
    'api-key': key,
    'Content-Type': 'application/json',
  }
}

// ─── List helpers ────────────────────────────────────────────────────────────

async function getOrCreateList(): Promise<number> {
  const res = await fetch(`${BREVO_API}/contacts/lists?limit=50`, { headers: headers() })
  if (!res.ok) throw new Error(`Brevo list fetch failed: ${res.status}`)
  const data = (await res.json()) as { lists: Array<{ id: number; name: string }> }
  const existing = data.lists.find(l => l.name === LIST_NAME)
  if (existing) return existing.id

  const create = await fetch(`${BREVO_API}/contacts/lists`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name: LIST_NAME, folderId: 1 }),
  })
  if (!create.ok) throw new Error(`Brevo list create failed: ${create.status}`)
  const created = (await create.json()) as { id: number }
  return created.id
}

// ─── Attribute helpers ────────────────────────────────────────────────────────

async function ensureAttributes() {
  const attrs = [
    { category: 'normal', name: 'ABANDONOU_EM',      type: 'text' },
    { category: 'normal', name: 'CARRINHO_ITENS',     type: 'text' },
    { category: 'normal', name: 'RECUPERACAO_ETAPA',  type: 'float' },
  ]
  for (const attr of attrs) {
    await fetch(`${BREVO_API}/contacts/attributes/${attr.category}/${attr.name}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ type: attr.type }),
    })
    // Ignore errors — attribute likely already exists
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Save abandoned cart to Brevo contact + add to recovery list */
export async function saveAbandonedCart(email: string, cartItems: CartItem[]): Promise<void> {
  await ensureAttributes()
  const listId = await getOrCreateList()

  await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      email,
      attributes: {
        ABANDONOU_EM: new Date().toISOString(),
        CARRINHO_ITENS: JSON.stringify(cartItems),
        RECUPERACAO_ETAPA: 0,
      },
      listIds: [listId],
      updateEnabled: true,
    }),
  })
}

/** Update recovery stage after sending an email (1, 2 or 3) */
export async function updateCartStage(email: string, stage: number): Promise<void> {
  await fetch(`${BREVO_API}/contacts/${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      attributes: { RECUPERACAO_ETAPA: stage },
    }),
  })
}

/** Remove contact from recovery list (called after purchase) */
export async function removeFromRecoveryList(email: string): Promise<void> {
  try {
    const listId = await getOrCreateList()
    await fetch(`${BREVO_API}/contacts/lists/${listId}/contacts/remove`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ emails: [email] }),
    })
  } catch {
    // Non-critical — don't break purchase flow
  }
}

/** Fetch all contacts in the recovery list with their attributes */
export async function getAbandonedContacts(): Promise<
  Array<{ email: string; abandonedAt: string; cartItems: CartItem[]; stage: number }>
> {
  const listId = await getOrCreateList()

  const res = await fetch(
    `${BREVO_API}/contacts/lists/${listId}/contacts?limit=100&modifiedSince=&sort=asc`,
    { headers: headers() }
  )
  if (!res.ok) return []

  const data = (await res.json()) as {
    contacts: Array<{
      email: string
      attributes: Record<string, string | number>
    }>
  }

  return (data.contacts ?? []).flatMap(c => {
    const abandonedAt = String(c.attributes?.ABANDONOU_EM ?? '')
    const raw = String(c.attributes?.CARRINHO_ITENS ?? '[]')
    const stage = Number(c.attributes?.RECUPERACAO_ETAPA ?? 0)
    if (!abandonedAt) return []
    try {
      const cartItems = JSON.parse(raw) as CartItem[]
      return [{ email: c.email, abandonedAt, cartItems, stage }]
    } catch {
      return []
    }
  })
}

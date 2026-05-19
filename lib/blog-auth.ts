import { createHmac } from 'crypto'
import { kv } from '@vercel/kv'

export type BlogUserRole = 'admin' | 'editor' | 'autor'

export type BlogUser = {
  id: string
  name: string
  email: string
  role: BlogUserRole
  wpUsername?: string
  wpAppPassword?: string
  passwordHash?: string
}

// ── User store (persistência: Vercel KV `blog:users`) ────────────────────────
// Antes era in-memory — perdia tudo a cada deploy. Agora é KV durável.
// Em ambientes sem KV (dev local sem .env), faz fallback in-memory automaticamente.

const KV_KEY = 'blog:users'

function hashPassword(password: string): string {
  const secret = process.env.BLOG_JWT_SECRET || 'jaleca-blog-secret-2024'
  return createHmac('sha256', secret).update(password).digest('hex')
}

const defaultAdmin = (): BlogUser => ({
  id: '1',
  name: 'Admin',
  email: 'admin@jaleca.com.br',
  role: 'admin',
  passwordHash: hashPassword('jaleca2024'),
})

const hasKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
let memoryUsers: BlogUser[] | null = null

async function loadUsers(): Promise<BlogUser[]> {
  if (hasKV) {
    try {
      const stored = await kv.get<BlogUser[]>(KV_KEY)
      if (stored && stored.length > 0) return stored
      // Primeiro acesso — seed do admin default
      const seed = [defaultAdmin()]
      await kv.set(KV_KEY, seed)
      return seed
    } catch (err) {
      console.error('[blog-auth] KV indisponível, usando memória:', err)
    }
  }
  if (!memoryUsers) memoryUsers = [defaultAdmin()]
  return memoryUsers
}

async function saveUsers(users: BlogUser[]): Promise<void> {
  if (hasKV) {
    try {
      await kv.set(KV_KEY, users)
      return
    } catch (err) {
      console.error('[blog-auth] KV save falhou:', err)
    }
  }
  memoryUsers = users
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function getUsers(): Promise<BlogUser[]> {
  const users = await loadUsers()
  return users.map(u => ({ ...u, passwordHash: undefined }))
}

export async function getUserByEmail(email: string): Promise<BlogUser | undefined> {
  const users = await loadUsers()
  return users.find(u => u.email === email)
}

export async function getUserById(id: string): Promise<BlogUser | undefined> {
  const users = await loadUsers()
  return users.find(u => u.id === id)
}

export async function addUser(
  user: Omit<BlogUser, 'id' | 'passwordHash'> & { password: string }
): Promise<BlogUser> {
  const users = await loadUsers()
  if (users.some(u => u.email === user.email)) {
    throw new Error('E-mail já cadastrado')
  }
  const newUser: BlogUser = {
    id: String(Date.now()),
    name: user.name,
    email: user.email,
    role: user.role,
    wpUsername: user.wpUsername,
    wpAppPassword: user.wpAppPassword,
    passwordHash: hashPassword(user.password),
  }
  await saveUsers([...users, newUser])
  return { ...newUser, passwordHash: undefined }
}

export async function removeUser(id: string): Promise<boolean> {
  const users = await loadUsers()
  const next = users.filter(u => u.id !== id)
  if (next.length === users.length) return false
  await saveUsers(next)
  return true
}

// Simple JWT using HMAC-SHA256
function base64url(str: string): string {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (str.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString()
}

export type BlogTokenPayload = {
  sub: string
  email: string
  name: string
  role: BlogUserRole
  iat: number
  exp: number
}

export function signBlogToken(user: BlogUser): string {
  const secret = process.env.BLOG_JWT_SECRET || 'jaleca-blog-secret-2024'
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + 60 * 60 * 24 * 7, // 7 days
    })
  )
  const signature = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  return `${header}.${payload}.${signature}`
}

export function verifyBlogToken(token: string): BlogTokenPayload | null {
  try {
    const secret = process.env.BLOG_JWT_SECRET || 'jaleca-blog-secret-2024'
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [header, payload, signature] = parts
    const expectedSig = createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    if (signature !== expectedSig) return null
    const data = JSON.parse(base64urlDecode(payload)) as BlogTokenPayload
    if (data.exp < Math.floor(Date.now() / 1000)) return null
    return data
  } catch {
    return null
  }
}

import Link from 'next/link'
import { getVariacoesStats } from '@/lib/admin-variacoes'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const stats = await getVariacoesStats()

  const alerts: { msg: string; href: string }[] = []
  if (stats.templatePending > 0) {
    alerts.push({
      msg: `${stats.templatePending} variação(ões) com SEO template pendente`,
      href: '/admin/variacoes',
    })
  }
  if (stats.outOfStockOver30d > 0) {
    alerts.push({
      msg: `${stats.outOfStockOver30d} variação(ões) sem estoque há mais de 30 dias`,
      href: '/admin/variacoes',
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((a, i) => (
            <Link
              key={i}
              href={a.href}
              className="block bg-yellow-50 border border-yellow-300 rounded p-3 hover:bg-yellow-100 text-sm"
            >
              ⚠️ {a.msg}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/variacoes" className="block border rounded p-4 hover:shadow">
          <h2 className="font-semibold mb-1">Variações</h2>
          <p className="text-sm text-stone-600">{stats.total} sincronizadas</p>
          <p className="text-xs text-stone-400 mt-1">
            {stats.byQuality.premium} premium · {stats.byQuality.gemini} gemini ·{' '}
            {stats.byQuality.template} template
          </p>
        </Link>
        <Link href="/blog/admin/posts" className="block border rounded p-4 hover:shadow">
          <h2 className="font-semibold mb-1">Blog</h2>
          <p className="text-sm text-stone-600">Posts e novo post</p>
        </Link>
      </div>
    </div>
  )
}

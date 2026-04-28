import { listAllVariations, getVariacoesStats } from '@/lib/admin-variacoes'
import VariacoesTable from './VariacoesTable'

export const dynamic = 'force-dynamic'

export default async function VariacoesPage() {
  const [entries, stats] = await Promise.all([listAllVariations(), getVariacoesStats()])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Variações</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Card label="Total" value={stats.total} />
        <Card label="Premium" value={stats.byQuality.premium} color="green" />
        <Card label="Gemini" value={stats.byQuality.gemini} color="blue" />
        <Card label="Template" value={stats.byQuality.template} color="yellow" />
        <Card label="Sem estoque" value={stats.outOfStock} color="red" />
        <Card label="Sem estoque +30d" value={stats.outOfStockOver30d} color="red" />
      </div>

      <VariacoesTable entries={entries} />
    </div>
  )
}

function Card({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color?: string
}) {
  const bg =
    color === 'green'
      ? 'bg-green-50 border-green-200'
      : color === 'blue'
        ? 'bg-blue-50 border-blue-200'
        : color === 'yellow'
          ? 'bg-yellow-50 border-yellow-200'
          : color === 'red'
            ? 'bg-red-50 border-red-200'
            : 'bg-stone-50 border-stone-200'
  return (
    <div className={`${bg} border rounded p-4`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-stone-600">{label}</div>
    </div>
  )
}

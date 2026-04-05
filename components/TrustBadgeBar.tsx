import { ShieldCheck, Truck, RotateCcw, Banknote, CreditCard } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, text: 'Compra 100% Segura' },
  { icon: Truck, text: 'Frete Grátis >R$599' },
  { icon: RotateCcw, text: 'Troca em 30 dias' },
  { icon: Banknote, text: 'PIX 5% de desconto' },
  { icon: CreditCard, text: '3x sem juros' },
]

export default function TrustBadgeBar() {
  return (
    <div className="bg-secondary/30 border-b border-border py-2.5">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
          {badges.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-1.5 whitespace-nowrap">
              <Icon size={13} className="text-[#c4a97d] flex-shrink-0" aria-hidden="true" />
              <span>{text}</span>
              {i < badges.length - 1 && (
                <span className="ml-3 text-border hidden sm:inline" aria-hidden="true">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

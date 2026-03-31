import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Crumb = { label: string; href?: string }

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://jaleca.com.br${crumb.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center gap-1 text-[11px] text-muted-foreground tracking-wide flex-wrap">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={11} className="text-muted-foreground/50" />}
            {crumb.href && i < crumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-foreground transition-colors duration-150">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
    </>
  )
}

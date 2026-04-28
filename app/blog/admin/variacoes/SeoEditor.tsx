import type { SeoEntry } from '@/lib/kv'
import { savePremium } from './actions'

export default function SeoEditor({ entry }: { entry: SeoEntry }) {
  const slug = entry.url.replace(/^\/produto\//, 'produto/')
  return (
    <form action={savePremium.bind(null, slug)} className="space-y-4 max-w-2xl">
      <Field name="h1" label="H1" defaultValue={entry.h1 ?? ''} />
      <Field name="h2" label="H2" defaultValue={entry.h2 ?? ''} />
      <Field name="title" label="Meta Title" defaultValue={entry.title ?? ''} />
      <TextArea name="metaDescription" label="Meta Description" defaultValue={entry.metaDescription ?? ''} />
      <TextArea name="colorPsychology" label="Color Psychology" defaultValue={entry.colorPsychology ?? ''} />
      <div className="flex items-center gap-3">
        <button type="submit" className="bg-stone-800 text-white px-4 py-2 rounded hover:bg-stone-700">
          Salvar como Premium
        </button>
        <span className="text-sm text-stone-500">
          Marca seoQuality=premium — Gemini não sobrescreverá
        </span>
      </div>
    </form>
  )
}

function Field({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input name={name} defaultValue={defaultValue} className="mt-1 w-full border rounded px-3 py-2" />
    </label>
  )
}

function TextArea({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={3} className="mt-1 w-full border rounded px-3 py-2" />
    </label>
  )
}

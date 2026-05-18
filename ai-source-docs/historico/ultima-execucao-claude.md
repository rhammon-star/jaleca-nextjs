Data: 2026-05-18
Tarefa: Padronização de metadata (title/description/OG/Twitter) em 60 LPs em 5 segmentos temáticos
Arquivos alterados: 60 app/jaleco-{slug}/page.tsx (somente bloco export const metadata)
O que foi feito:
- Removido estrela "⭐" e nº de avaliações das descrições (regra: "Nota X,X no Google" sem estrela e sem #)
- Trocado separador "|" por "—" (regra: pipe parece IA)
- 5 templates por segmento: Saúde Clínica (29) / Beleza (5) / Gastronomia (2) / Corporativo (9) / Genérico (15)
- Preservado: canonical, openGraph.url, twitter.images, siteName, locale, type
- Schemas JSON-LD (HowTo, Article, Product, Occupation, FAQ) intocados
Comandos rodados:
- python3 /tmp/apply_meta_jaleca.py --dry
- python3 /tmp/apply_meta_jaleca.py
- git diff --stat
Resultado: OK — 53 via script + 2 Seg 3 + 5 Seg 2 via subagent = 60 LPs
Riscos identificados:
- 2 LPs sem bloco twitter no metadata (plus-size, feminino-acinturado) — não é erro, só não tinham o campo
- Não rodei build/typecheck ainda — recomendar antes do deploy
Próximo passo: usuário decidir se quer (a) rodar npm run build (b) commitar + deploy preview/prod

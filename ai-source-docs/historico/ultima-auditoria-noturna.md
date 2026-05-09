# Última Auditoria Noturna
Data: 02/05/2026 19:53
Relatório: /Users/rhammon/sitejaleca/jaleca-nextjs/ai-source-docs/relatorios/noite_relatorio_20260502_1932.md

## Resumo executivo
Aqui está o diagnóstico completo e o plano de guerra para a Jaleca:

---

## 🚨 ALERTAS DO DIA

**1. Queda livre em keywords de cauda alta**
- `jaleco slim feminino`: caiu **14 posições** (2º → 16º)
- `como lavar um jaleco branco`: caiu **10 posições** (1º → 11º)
- `jaleco slim`: caiu **3.8 posições** (2.5 → 6.3)
- `jalecos femininos`: caiu **3.8 posições** (30.6 → 34.4)

**2. Páginas de produto quebradas indexáveis**
- 27 URLs de produtos (toucas, faixas, amarradores) retornam **status 200** com título **"Produto não encontrado"**, sem tag canonical e com H1 genérico. São páginas fantasmas que sugam crawl budget e transmitem sinal de baixa qualidade.

**3. Performance mobile zerada**
- Todas as URLs testadas (home, produtos, categorias) apresentam score **0 em Performance, SEO, Accessibility e Best Practices** no mobile. Isso indica bloqueio de renderização, erro no Lighthouse ou carregamento extremamente lento.

---

## 1. RESUMO EXECUTIVO

**Score SEO geral: 38/100**

**Por que a Jaleca não aparece para buscas genéricas:**
O site tem uma arquitetura excessivamente pulverizada em "landing pages de intenção genérica" (ex: `/jaleco-medico`, `/jaleco-dentista`) que competem entre si e com as páginas de categoria, além de não ter autoridade de domínio (0 backlinks detectados). Além disso, há um grave problema de **conteúdo duplicado/doorway** nas 65+ páginas de cidade (`/cidade/jaleco-sao-paulo` etc.), todas com a mesma estrutura de texto, trocando apenas o nome da cidade.

**Top 5 problemas críticos hoje:**
1. **Produtos fantasmas**: 27 páginas 200 com "Produto não encontrado" e sem canonical.
2. **Doorway pages cities**: Páginas de cidade são templates sem variação real de conteúdo (risco de penalização).
3. **Canonicals quebrados**: 25+ páginas sem canonical (praticamente todas de produtos de acessórios).
4. **Core Web Vitals zerados**: Indica experiência de página inaceitável em mobile.
5. **CTR zero em keywords de transação**: `jaleco de medico/de médico` têm 220+ impressões e 0 cliques por títulos genéricos.

**Top 5 oportunidades imediatas:**
1. Corrigir canonicals e devolver 404/410 nos produtos descontinuados.
2. Reescrever titles de páginas com posição 8–11 para furar para a primeira página.
3. Unificar ou enriquecer drasticamente as city pages com conteúdo local real.
4. Criar feed otimizado para Google Shopping (hoje a marca não aparece).
5. Explorar o gap de "scrub feminino" e "pijama cirúrgico feminino" com conteúdo comparativo e transacional.

---

## 2. SAÚDE TÉCNICA

| Problema | Quantidade | URLs de exemplo |
|---|---|---|
| **Páginas sem canonical** | 25 | `/produto/touca-de-elastico-jaleca`, `/produto/faixa-de-cabelo-jaleca-areia`, `/produto/touca-de-amarrar-jaleca` |
| **Redirect chains** | 5 | `/blog/como-lavar-jaleco-branco` → `/blog/como-lavar-jaleco-profissional-guia-completo`<br>`/blog/jaleco-branco-ou-colorido-o-que-usar-na-clinica` → `/jaleco-branco-ou-colorido-qual-o-melhor-para-sua-area`<br>`/blog/guia-jaleco-dentista-m

_[ver relatório completo acima]_

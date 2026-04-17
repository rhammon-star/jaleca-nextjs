# PRD — Reescrita de Páginas de Cidade e Dia das Mães

**Projeto:** Jaleca — Site E-commerce
**Data:** 14/04/2026
**Versão:** 1.0
**Status:** Aprovado — pendente execução
**Responsável pela revisão:** Kelver (detecção de IA em 14/04/2026)

---

## 1. Objetivo

Reescrever **100% das páginas de cidade e Dia das Mães** do site Jaleca para que soem como conteúdo feito por brasileiro real, não por IA generativa. O texto reescrito deve passar na análise do Kelver (detector de IA) e ser publishable sem risco de penalização de ranking ou percepção de baixa qualidade.

---

## 2. Arquivos afetados

| Arquivo | Páginas | Tipo |
|---------|---------|------|
| `app/cidade/[slug]/page.tsx` | 62 cidades | Páginas dinâmicas com generateStaticParams |
| `app/dia-das-maes/[slug]/page.tsx` | 7 nichos | Páginas dinâmicas com generateStaticParams |
| **Total** | **69 páginas** | **2 arquivos fonte** |

---

## 3. Problemas identificados

### 3.1 Páginas de Cidade (62 páginas)

**Problema 1 — Template único em todas as 62 cidades**
Estrutura mecânica do `conteudoLocal`:
```
"Em [cidade], [contexto] do [Hospital A] ao [Hospital B], 
[verbos] a Jaleca por jalecos que [adjetivos]."
```
Nenhuma cidade tem identidade própria. Todas no mesmo molde.

**Problema 2 — Badge "4.9 ★ — +500 avaliações" hardcoded em todas**
Dado não verificado e genérico. Aparece igual em BH e em Rio Branco. Verificar número real antes de manter — dados do Google Places mostram 4.9/57 ou 4.9/58 reviews, não "500+".

**Problema 3 — Conectivo "do X ao Y" em todas as 62**
Pattern de IA generativa que tenta parecer enciclopédico mas é mecânico.
- BH: "do Mater Dei à Santa Casa"
- Recife: "do HCFMUPE ao Real Hospital Português e Santa Joana"

**Problema 4 — Mesmos pares de adjetivos em todas**
Reaparecem em dezenas de cidades:
- "elegância e funcionalidade"
- "qualidade e estilo"
- "conforto e durabilidade"
- "tecido premium e corte moderno"
- "design elegante e entrega rápida"
- "elegância, durabilidade e conforto"

**Problema 5 — "profissionais de saúde exigentes" copiado**
Aparece em Vitória, Curitiba, Recife, Niterói — mesma fórmula sem variação.

**Problema 6 — Cidades sobrecarregadas com lista de hospitais**
Salvador, Recife, Fortaleza têm 4-5 hospitais na mesma frase — texto artificialmente longo e sobrecarregado.

**Problema 7 — Hospitals potencialmente inventados**
Alguns mencionados sem fonte verificável. Ex: "Hospital São Judas Tadeu" (Lagoa Santa), "FMT-HVD" (Manaus — real é FMT-AM), "Hospital Metropolitano" (Barbacena).

**Problema 8 — FAQ idêntico para todas as 62 cidades**
Template FAQ com as mesmas 4 perguntas e respostas genéricas.

---

### 3.2 Páginas de Dia das Mães (7 páginas)

**Problema 1 — "não é caneca, não é quadro motivacional"**
Repetido idêntico em veterinária, nutrição e TI — claramente copiado entre páginas. Kelver detectou IA em 14/04 именно por isso.

**Problema 2 — "de verdade" aparece em 6/7 páginas**
- Saúde: "ela vai usar todo dia. De verdade."
- Outros nichos similar

**Problema 3 — "Mais de 500 avaliações. Nota 4.9."**
Repetido textualmente em saúde, nutrição e laboratório. Dado duvidoso (Google Places mostra ~57-58).

**Problema 4 — Frase artificial "Que seja um bom" (farmácia)**
Construção completamente artificial — brasileiro nunca falaria isso.

**Problema 5 — Estrutura idêntica em todos os 7 nichos**
Cada nicho segue o mesmo template de 5 parágrafos:
1. Conexão emocional
2. Contexto profissional
3. Features do produto
4. Social proof
5. Garantias

**Problema 6 — Emojis nos títulos**
🩺💆🐾🥗💊🔬💻 — indicador clássico de conteúdo gerado por IA.

**Problema 7 — "Sai da caneca. Dá algo que ela vai usar de verdade." (TI)**
Título artificial que parece clickbait.

**Problema 8 — "chega no consultório, bota o jaleco e começa o dia" (nutrição)**
Tom estranho — brasileiro não fala assim.

**Problema 9 — "dólar" em vez de "dólmã" (TI)**
Vocabulario estranho, possivelmente erro de digitação IA.

**Problema 10 — FAQ genérico com estrutura igual para todos os nichos**
 mesmas 4 perguntas, só troca o nome da profissão.

---

## 4. Regras de conteúdo (obrigatórias)

### 4.1 Blacklist de palavras e expressões (NUNCA usar)

**Conectivos robóticos:**
- Primeiramente, Outrossim, Não obstante, Em síntese, No que diz respeito a
- No que tange, Sob tal perspectiva, À luz disso

**Verbos pomposos:**
- Potencializar, Maximizar, Otimizar, Ressignificar, Consolidar, Estruturar
- potencializar, maximizar, otimizar, robustecer, potencializar

**Substantivos abstratos:**
- Robustez, Paradigma, Ecosystem, Expertise, Know-how, Solidez
- Ecosystem, Stakeholders, Onboarding

**Locuções vazias:**
- "É importante ressaltar que"
- "Deixe-me explicar"
- "Podemos notar que"
- "Vale destacar que"
- "É válido salientar que"

**Frases iniciais robóticas:**
- "Bem-vindo a este artigo"
- "Você sabia que"
- "Neste artigo, vamos falar sobre"
- "O presente artigo"

**Expressões de Dia das Mães específicas:**
- "de verdade" (exceto se for contexto genuíno)
- "não é caneca, não é quadro motivacional"
- "Que seja um bom"
- "sai da caneca"
- "ela vai usar todo dia. De verdade."

### 4.2 Tom correto

- Brasileiro real, conversacional
- Brasileiro fala: "vc", "pra", "né", "tipo", "na verdade", "basicamente", "aí"
- Parágrafos curtos (2-3 frases máximo)
- Uma ideia por parágrafo
- Pular linha entre parágrafos
- Evitar encadeamento excessivo de frases

### 4.3 Regras específicas por página

**Cidades:**
1. Cada cidade deve ter pelo menos **um dado local verificável** (hospital real, referência geográfica real, característica local real)
2. No máximo **2 hospitais por frase** — se precisar listar mais, separar em frases diferentes
3. Usar **uma referência local que ninguém fora da cidade entenderia** (rua, bairro, monumento, prato típico) — dá autenticidade
4. Evitar "do X ao Y" — usar "no X, no Y" ou simplesmente listar um hospital por frase
5. Variar estrutura — algumas cidades podem ter 2 frases, outras podem ter 4, dependendo do que tem pra dizer
6. **Remover ou corrigir "4.9 ★ — +500 avaliações"** — usar "4.9 ★ no Google" ou buscar número real

**Dia das Mães:**
1. **Remover emojis** dos títulos dos nichos
2. Cada nicho deve ter **pelo menos uma história/contexto real** da profissão (ex: "no plantão de 12h", "na consulta que não acaba")
3. NUNCA copiar estrutura entre nichos — se saúde começa com situação, estética pode começar com benefício
4. FAQ deve ter **pelo menos uma resposta que use具体情况 específica** do nicho, não só a pergunta trocada
5. Remover "mais de 500 avaliações" — dado não verificado

---

## 5. Checklist de revisão (executar antes de commit)

- [ ] Nenhuma palavra da blacklist presente
- [ ] Nenhum emoji nos títulos
- [ ] Nenhum "não é caneca" ou similar
- [ ] Nenhum "Que seja um bom"
- [ ] Badge de avaliações verificado com número real
- [ ] Estrutura varia entre páginas (não same-template)
- [ ] Sem "de verdade" exceto em contexto genuíno
- [ ] "dólar" corrigido para "dólmã" (se aparecer)
- [ ] Máximo 2 hospitais por frase
- [ ] Revisão pelo Kelver antes de deploy

---

## 6. Critérios de aceite

1. Texto passa no `isAIContent()` de `lib/ai-content.ts` sem flagged
2. Kelver approve explicitamente antes de deploy
3. Nenhuma página tem estrutura idêntica a outra do mesmo grupo
4. Badge de avaliações mostra número real (não inventado)
5. Deploy em produção não causa queda de SEO (verificar GSC após deploy)
6. LCP e FCP da página não pioram mais que 0.3s vs. antes do deploy

---

## 7. Arquivos de referência

- **Blacklist completa:** `docs/PRD-BLOG-IA-HUMANIZADA.md`
- **Função validação:** `lib/ai-content.ts` → `isAIContent(text)`
- **Script humanização:** `lib/ai-content.ts` → `rewriteHumanized()`

---

## 8. Responsável pela execução

- **Conteúdo/Ads/SEO:** Gemini + GPT-4.1 (conforme `feedback_divisao_agentes.md`)
- **Revisão final:** Kelver (obrigatória antes de commit)
- **Deploy:** Claude (após aprovação do Kelver)

---

## 9. Prioridade

🔴 **URGENTE** — Kelver detectou IA em 14/04. Se essas páginas forem indexadas com conteúdo artificial, risco de penalização de ranking + reputação com o detector do Kelver.
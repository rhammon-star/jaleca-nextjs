# SEO Strategy Jaleca 2026 — Design Spec

**Data:** 2026-05-03  
**Objetivo principal (30 dias):** Aumentar tráfego orgânico  
**Objetivos secundários (60-90 dias):** Melhorar conversão + aparecer em AI Overviews  
**Fonte estratégica:** Google Search Central Live Toronto — Abril 2026  

---

## Contexto

O Google 2026 elevou a barreira de qualidade de indexação em resposta à proliferação de conteúdo gerado por IA. Os sinais mais relevantes para o Jaleca:

- **Presença binária em AI Overviews** — você existe ou não existe na resposta da IA
- **Conteúdo proprietário vence** — dados exclusivos + first-hand experience diferencia do conteúdo commoditizado
- **Busca agentic foca e-commerce** — Schema de produto completo é pré-requisito
- **Escala sem qualidade = filtro de indexação** — conteúdo mediocre não indexa mais
- **Structured Data** — novos casos de uso emergindo, especialmente e-commerce

**Diferencial defensável do Jaleca:**
- Premium com melhor custo-benefício
- Maior variedade do nicho
- Uniforme para clínica inteira (B2B)
- Loja física + franquias
- Múltiplas cores e os melhores tecidos
- Base de clientes em vários ramos profissionais
- UGC orgânico: clientes marcam o Jaleca no Instagram

---

## Frente 1 — Autoridade por Profissão 2.0

### Objetivo
Melhorar hubs existentes com dados proprietários reais que nenhum concorrente pode copiar.

### Conteúdo a criar (5 artigos prioritários)

| Artigo | Dado proprietário usado |
|---|---|
| "Os tecidos mais pedidos por médicos — o que aprendemos com nossos clientes" | Mix de tecidos por profissão |
| "Guia de tamanhos para jaleco — o que X mil pedidos nos ensinaram" | Distribuição de tamanhos reais |
| "Por que jalecos são devolvidos — e como escolher certo na primeira vez" | Dados de retorno por modelo/tecido |
| "Jaleco para dentista: modelos mais escolhidos e por quê" | Modelos mais vendidos por profissão |
| "Uniforme para clínica inteira: o que nossos clientes B2B pedem" | Cases reais de clientes clínica |

### Formato obrigatório de cada artigo
- Primeiro parágrafo = resposta completa à pergunta do título (para AI Overviews)
- Seção com dado proprietário destacado (tabela ou lista)
- FAQ com Schema ao final
- Link interno para página de produto relevante

---

## Frente 2 — UGC do Instagram no Site

### Objetivo
Trazer first-hand experience real de clientes para as páginas de produto e hubs, aumentando E-E-A-T e dwell time.

### Implementação técnica

**Fase 1 — Coleta (operação):**
- Identificar posts do Instagram onde clientes marcaram o Jaleca
- Solicitar permissão via DM para usar a foto no site
- Criar banco de UGC por profissão (médico, dentista, enfermeiro, estética, veterinário)

**Fase 2 — Exibição no site:**
- Seção "Quem usa Jaleca" nas páginas de produto top 10
- Página dedicada por profissão: "Jalecos para Dentistas — veja quem usa"
- Galeria na home com grid de fotos reais de clientes
- Componente Next.js reutilizável `<UGCGallery profession="dentista" />`

**Fase 3 — Schema:**
- `Review` em produtos com UGC coletado
- `AggregateRating` onde houver volume suficiente (mín. 5 reviews)
- `Person` + `LocalBusiness` para reforçar E-E-A-T

### Regra de qualidade
Toda foto UGC deve mostrar o produto em uso real, com profissional identificado (nome/profissão com permissão). Sem fotos genéricas ou encenadas.

---

## Frente 3 — AI Overviews do Zero

### Objetivo
Estruturar o site para ser citado como fonte nas AI Overviews do Google nos próximos 60-90 dias.

### Implementação

**Schema a implementar em toda página de produto:**
```json
{
  "@type": "Product",
  "name": "...",
  "description": "...",
  "brand": {"@type": "Brand", "name": "Jaleca"},
  "offers": {...},
  "aggregateRating": {...},
  "review": [...]
}
```

**FAQ Schema em hubs de profissão:**
- Mínimo 5 perguntas reais por página
- Respostas diretas (máx. 2 parágrafos)
- Baseadas em queries reais do GSC

**HowTo Schema em artigos de guia:**
- "Como escolher jaleco para médico" → steps numerados
- "Como medir tamanho de jaleco" → steps com imagem

**Monitoramento quinzenal:**
- Queries que já geram AIO onde Jaleca não aparece
- Queries onde Jaleca aparece mas perde clique para AIO
- Ação: criar conteúdo direto para essas queries

---

## Prioridade de Execução — 30 dias

### Semana 1-2 (impacto imediato em tráfego)
1. Revisão de qualidade dos 10 posts PAA existentes — evitar filtro de indexação
2. FAQ Schema nos 5 hubs de profissão existentes
3. Primeiro artigo com dados proprietários (tecidos por profissão)

### Semana 3-4 (consolidar)
4. UGC: coleta de permissões + implementar componente na home e top 3 páginas de produto
5. 4 artigos restantes com dados proprietários
6. Schema de produto completo nas 10 páginas de produto mais visitadas

### Métricas de sucesso — 30 dias
- Impressões no GSC: +20% vs. baseline
- Cliques orgânicos: +15%
- Páginas indexadas: sem queda (monitorar filtro de qualidade)
- Rich results ativos: +5 páginas com FAQ snippet

---

## O Que NÃO Fazer

- ❌ Criar conteúdo em escala sem dados proprietários — Google filtra
- ❌ Converter site para Markdown para "ajudar a IA" — sem benefício confirmado
- ❌ Criar llms.txt — sem benefício para SEO
- ❌ Bloquear Google-Extended — não impacta AI Overviews
- ❌ Focar em posição como métrica principal — volatilidade hora a hora torna isso inútil

---

## Consumo estimado por IA nesta sessão de design

| IA | Participação estimada | Papel |
|---|---:|---|
| Claude Code | 60% | Facilitação do party, design técnico, spec |
| Gemini | 25% | Contexto do projeto, histórico, backlog |
| GPT | 0% | MCP com erro — Claude simulou perspectiva estratégica |
| GSC | 15% | Baseline pos 7.9, contexto de rankings |

*Estimativa operacional — não medição financeira exata.*

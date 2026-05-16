# Resultado Completo — Jaleca (Ads + Custos + SEO)

Argumentos: `$ARGUMENTS` — data alvo no formato `YYYY-MM-DD`. Se vazio, usa **hoje** (com ontem como fechamento).

## Como interpretar a data

- **Sem argumento** → comportamento padrão: ONTEM (fechamento) + HOJE (parcial).
- **Com data `YYYY-MM-DD`** → trate essa data como "DIA ALVO" (fechamento) e o dia anterior como "DIA-1" (comparativo). Substitua todas as referências de "ONTEM"/"HOJE" pelas datas corretas em todas as queries (WooCommerce, Google Ads `segments.date = 'YYYY-MM-DD'`, Meta `time_range={'since':'YYYY-MM-DD','until':'YYYY-MM-DD'}`).

## Execução

Execute as duas rotinas em sequência, na ordem:

### Parte 1 — Ads + Custos operacionais
Rode integralmente o conteúdo de `.claude/commands/resultado-do-dia.md`, ajustando as datas conforme o argumento. Apresente o relatório completo no formato definido lá (BLOCO 1 + BLOCO 2 + GASTOS SEO + % IA).

### Parte 2 — SEO orgânico
Logo em seguida, rode integralmente o conteúdo de `.claude/commands/resultado-seo.md`, também ajustando datas para o DIA ALVO quando aplicável (GSC, GA4 orgânico, PageSpeed snapshot).

## Formato final

Apresente como **um único relatório consolidado** com cabeçalho único:

```
═══════════════════════════════════════════════════
📊 RESULTADO COMPLETO — JALECA — [DATA ALVO]
═══════════════════════════════════════════════════

[Parte 1: Ads + Custos — formato de /resultado-do-dia]

═══════════════════════════════════════════════════
🔎 SEO ORGÂNICO
═══════════════════════════════════════════════════

[Parte 2: SEO — formato de /resultado-seo]

═══════════════════════════════════════════════════
### Consumo estimado por IA nesta tarefa (consolidado)
| IA | % | Papel |
|----|--:|-------|
[uma única tabela cobrindo ambas as partes]
═══════════════════════════════════════════════════
```

## Regras

- Datas: se `$ARGUMENTS` vazio → padrão ontem/hoje. Se informado → DIA ALVO + DIA-1.
- Executar em paralelo o que for paralelizável dentro de cada parte (igual aos comandos originais).
- Tabela final de % IA é **uma só**, consolidando ambas as partes (não duplicar).
- Manter prefixos de agente (🤖 🔵 🟢 📊) em cada seção.
- Se alguma fonte falhar, indicar e seguir — nunca travar.

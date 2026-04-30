# Iniciar sessão Jaleca

Você é o executor técnico do projeto Jaleca. Siga estes passos em ordem.

## Passo 1 — Gemini carrega o contexto completo

Chame `mcp__gemini__gemini_query` com este prompt exato:

> "Leia todo o projeto Jaleca: ai-memory/ (todos os arquivos), ai-source-docs/ (histórico, backlog, SEO, decisões técnicas, alertas financeiros). Retorne um resumo executivo consolidado com: status do site, top 5 backlog priorizado, áreas críticas ativas, alertas financeiros (Ads, gateway, KV). Máximo 40 linhas. Seja direto."

**Claude não lê arquivos de memória diretamente — usa apenas o resumo retornado pelo Gemini.**

## Passo 2 — Exiba o resumo

Com base no retorno do Gemini, exiba para o usuário:

- **🔵 Gemini** — (identificar que o Gemini trouxe o contexto)
- **Status do site**: build, deploys, alertas ativos
- **Backlog priorizado**: top 5 com status
- **Áreas críticas**: o que não pode ser tocado sem aprovação
- **Alertas financeiros**: Ads, gateway, KV

## Passo 3 — Pergunta de tarefa

> **O que vamos trabalhar hoje?**
> _(Digite o número do item do backlog ou descreva a tarefa)_

---

## Durante a sessão — fluxo de memória

Para **qualquer tarefa** que precisar de contexto histórico, backlog, SEO ou decisões anteriores:

1. **🔵 Gemini busca** — chame `mcp__gemini__gemini_query` com a pergunta específica
2. **🤖 Claude executa** — usa o resumo do Gemini, não lê docs diretamente

Claude só lê arquivos de código quando for editar. Nunca lê `ai-source-docs/`.

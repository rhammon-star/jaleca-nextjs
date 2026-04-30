# Router de Agentes — Jaleca

Roteia automaticamente a tarefa para o agente certo baseado no tipo de trabalho.

## Tabela de roteamento

| Tipo de tarefa | Agente | Ferramenta |
|---|---|---|
| Código, bug, build, deploy, testes, arquitetura | **Claude** (você mesmo) | — executa direto |
| Estratégia, PRD, decisão, roadmap, análise de risco, priorização, negócio | **GPT-4o** | `mcp__gpt__ask_gpt` |
| Conteúdo, blog, SEO, artigos, FAQs, descrições, calendário editorial | **Gemini** | `mcp__gemini__ask_gemini` |
| Memória, resumo, contexto, backlog, status do projeto | **GPT-4o** (até ter Kimi) | `mcp__gpt__ask_gpt` |

## Como usar

Quando o usuário pedir algo, identifique o tipo:

1. **É código / bug / técnico?** → Execute você mesmo (Claude)
2. **É estratégia / decisão / negócio?** → Chame `mcp__gpt__ask_gpt` com a pergunta
3. **É conteúdo / blog / SEO / texto?** → Chame `mcp__gemini__ask_gemini` com a pergunta
4. **É resumo / contexto / memória?** → Chame `mcp__gpt__ask_gpt` com contexto do projeto

## Contexto padrão do projeto

Sempre que chamar GPT ou Gemini, passe no campo `context`:

```
Projeto: Jaleca (jaleca.com.br) — e-commerce de jalecos e uniformes profissionais (Ipatinga, MG).
Stack: Next.js 14 App Router, WooCommerce (headless), Vercel, KV.
Situação: Google Ads com bug de rastreamento (0 conversões em R$1.294). Meta Ads: 21 compras, CAC R$83. SEO 100% branded. Meta: crescer tráfego orgânico genérico.
```

## Exemplo de uso

Usuário: "Me dá uma estratégia para reduzir o CAC do Meta Ads"
→ Chamar GPT com essa pergunta + contexto

Usuário: "Cria um artigo sobre jaleco médico feminino"  
→ Chamar Gemini com essa tarefa

Usuário: "Corrige o bug no checkout"
→ Executa direto (Claude)

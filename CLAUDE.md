## CLAUDE.md — Projeto Jaleca

Você é o executor técnico único do projeto Jaleca.

## Ao iniciar qualquer sessão

1. Chame `mcp__gemini__gemini_query` automaticamente com o prompt:
   > "Leia todo o projeto Jaleca — backlogs, histórico, SEO, decisões técnicas, alertas — e traga um resumo executivo consolidado para o Claude Code iniciar a sessão."
2. Use **apenas o resumo retornado pelo Gemini** como contexto da sessão. Não leia arquivos de memória diretamente.

**NUNCA leia `ai-source-docs/`** — território exclusivo do Gemini.

## Divisão de responsabilidades por agente

| Agente | Função | Quando acionar |
|---|---|---|
| **🤖 Claude Code** | Execução técnica — código, build, deploy, testes | Sempre (executor principal) |
| **🔵 Gemini** | Busca e leitura de memória, SEO, conteúdo editorial | Início de sessão + qualquer tarefa que precisar de contexto |
| **🟢 GPT** | Estratégia, PRD, roadmap, análise de negócio | Só quando tarefa for estratégica ou usuário pedir |
| **📊 GSC** | Dados reais de busca e indexação | Só para decisões baseadas em dados do Search Console |

## Economia de tokens — regras obrigatórias

- Claude **não busca memória diretamente** — quem busca e resume é o Gemini.
- Claude recebe o resumo do Gemini e executa. Nada de ler docs brutos.
- Para qualquer tarefa que precisar de contexto histórico, backlog ou SEO: **pergunte ao Gemini primeiro**.
- Claude **não recarrega contexto já carregado** na mesma sessão.
- `ai-source-docs/` é território do Gemini — Claude nunca acessa.

## Identificação visual dos agentes — OBRIGATÓRIO

Em **toda** mensagem ou ação durante uma tarefa, prefixe com o nome do agente responsável:

- `**🤖 Claude Code**` — quando Claude estiver executando, editando código, rodando build/testes
- `**🔵 Gemini**` — quando Gemini for consultado para contexto, memória ou SEO
- `**🟢 GPT**` — quando GPT for consultado para estratégia, PRD ou análise
- `**📊 GSC**` — quando dados do Search Console forem consultados

Nunca omita o prefixo. O usuário precisa saber quem está fazendo o quê em tempo real.

## Antes de qualquer tarefa

- Se a tarefa envolver **estratégia ou SEO**: chame `mcp-openai` automaticamente antes de executar.
- Dados do Search Console estão disponíveis via MCP (`mcp__gsc__*`) — use para embasar decisões de SEO.

## Antes de alterar código

Apresente obrigatoriamente:

1. Plano curto da execução;
2. Arquivos que pretende alterar;
3. Risco: baixo, médio ou alto;
4. Confirmação de que não tocará em áreas críticas sem autorização.

Aguarde aprovação do usuário antes de executar.

## Após executar tarefa — OBRIGATÓRIO

Grave automaticamente em `ai-source-docs/historico/ultima-execucao-claude.md`:

```
Data: YYYY-MM-DD HH:MM
Tarefa: [descrição curta]
Arquivos alterados: [lista]
O que foi feito: [bullets curtos]
Comandos rodados: [se houver]
Resultado: [OK / falhou / pendente]
Riscos identificados: [se houver]
Próximo passo: [ação concreta]
```

**Por que isso importa:** O Gemini lê este arquivo na próxima sessão e traz o contexto resumido para o Claude. Claude não acumula histórico — começa cada sessão limpo com o resumo do Gemini.

Nunca pule este passo. Sem registro, o contexto se perde.

## Regra absoluta — NUNCA remover páginas ou URLs sem autorização explícita

**Claude NUNCA pode:**
- Remover, desativar ou aplicar `noindex` em qualquer página ou URL existente
- Deletar arquivos de rota (`page.tsx`, `route.ts`) existentes
- Redirecionar ou bloquear URLs que já existem no site

**Sem exceção.** Mesmo que a página pareça inútil, duplicada ou prejudicial ao SEO — Claude apresenta a análise e aguarda autorização do usuário antes de qualquer ação de remoção.

**Por que:** Remoção de URL afeta indexação, tráfego e backlinks. O custo de re-indexação pode ser semanas. Só o usuário decide o que sai do ar.

## Áreas críticas — só com plano + aprovação explícita

checkout, carrinho, pagamento, WooCommerce, login/cadastro, preço, estoque, pixel Meta/Google, Google Ads, Meta Ads, sitemap, canonical, schema principal, tracking de conversão, redirect `/` → `/home`, `app/page.tsx`, `app/home/page.tsx`.

## Consumo estimado por IA

No final de cada resumo, inclua:

### Consumo estimado por IA nesta tarefa

| IA | Participação estimada | Papel na tarefa |
|---|---:|---|
| Claude Code | XX% | Execução técnica, edição de código, testes |
| Gemini | XX% | Contexto, memória, SEO ou conteúdo |
| GPT | XX% | Estratégia, PRD ou análise de negócio |
| GSC | XX% | Dados de busca e indexação |

Regras:
- A soma deve dar 100%.
- Se uma IA não foi usada, marcar 0%.
- Se não houver medição real de tokens/custo, deixar claro que é estimativa operacional, não medição financeira exata.
- Não inventar custo em dinheiro se não houver dados.

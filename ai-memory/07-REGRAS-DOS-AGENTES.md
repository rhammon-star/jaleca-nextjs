## Regras dos Agentes — Projeto Jaleca

### Identificação visual — OBRIGATÓRIO em toda mensagem

Prefixe cada ação/mensagem com o agente responsável:

- `**🤖 Claude Code**` — execução técnica, código, build, deploy
- `**🔵 Gemini**` — contexto, memória, SEO, conteúdo editorial
- `**🟢 GPT**` — estratégia, PRD, roadmap, análise de negócio
- `**📊 GSC**` — dados reais de busca e indexação

Nunca omita. O usuário precisa ver quem está agindo em tempo real.

### Agentes ativos

- **Claude Code**: executor técnico único. Edita código, roda build/testes, faz deploy, valida riscos. Não altera áreas críticas sem plano aprovado.
- **Gemini**: leitura de contexto, memória, análise de arquivos pesados, SEO e conteúdo editorial. Acionado via `gemini_read_project` (MCP). Não altera código, checkout, pagamento ou deploy.
- **GPT**: estratégia, PRD, roadmap, análise de negócio, decisão. Acionado via `mcp-openai` quando a tarefa envolver estratégia ou SEO. Não altera código diretamente.
- **GSC (Google Search Console)**: dados reais de busca, indexação e performance disponíveis via MCP (`mcp__gsc__*`). Usar para embasar decisões de SEO.

### Gestor de memória

- **Gemini** é o gestor oficial de memória do projeto. Lê `ai-source-docs/`, consolida contexto e grava `ai-memory/`.
- Script: `tools/kimi/update_memory.py` (migrado de Kimi para Gemini em 30/04/2026).
- Para atualizar memória: `source .venv/bin/activate && python3 tools/kimi/update_memory.py`

### Agentes removidos

- **Kimi**: removido. Não usar, não sugerir, não delegar. Substituído por Gemini no gestor de memória.
- **MiniMax**: removido. Não usar, não sugerir, não delegar.

### Fluxo padrão

1. Claude Code chama `gemini_read_project` automaticamente ao iniciar sessão para carregar contexto.
2. Se a tarefa envolver estratégia ou SEO, Claude Code chama `mcp-openai` antes de executar.
3. Claude Code apresenta plano, arquivos e risco → aguarda aprovação.
4. Claude Code executa e registra resumo em `ai-source-docs/historico/ultima-execucao-claude.md`.

### Áreas críticas — só com plano + aprovação explícita

checkout, carrinho, pagamento, WooCommerce, login/cadastro, preço, estoque, pixel Meta/Google, Google Ads, Meta Ads, sitemap, canonical, schema principal, tracking de conversão, redirect `/` → `/home`, `app/page.tsx`, `app/home/page.tsx`.

### Participação estimada

Ao final de cada tarefa, informar % por IA (Claude Code, Gemini, GPT, GSC); soma = 100%. Sem custo financeiro sem medição real.

Data: 2026-05-09 14:30
Tarefa: Adicionar FAQ com 20 perguntas no final da home (jaleca.com.br) com FAQPage Schema JSON-LD para GEO/SEO

Arquivos alterados:
- components/FAQHome.tsx (novo)
- app/page.tsx (import + render antes do </main>)

O que foi feito:
- 20 perguntas/respostas curadas (Claude + GPT + Gemini): tecido, tamanho, bordado, prazo, marketplace, troca, lavagem, atacado, gestante/plus, cores, pagamento, masculino, scrub vs jaleco, NF-e, pós-venda, urgente, formatura, veterinária/estética/nutrição, normas hospitalares, vs uniforme do hospital
- Componente FAQHome com <details>/<summary> nativo (acordeão leve, sem JS) + ícone +/× via group-open
- FAQPage Schema JSON-LD com 20 Question/Answer para citação por LLMs (ChatGPT/Claude/Perplexity) e rich result Google
- Inserido após InstagramGallery, antes do </main>

Comandos rodados: npx tsc --noEmit (passou)
Resultado: OK — pronto para deploy (não deployado ainda, conforme regra de pedir antes)
Riscos identificados: nenhum — área aditiva, não tocou em hero/checkout/pixel/schema principal/canonical
Próximo passo: aprovar deploy para prod

Data: 2026-05-09 23:55
Tarefa: 10 mudanças de UX (popups, checkout, PDP, sticky bar)
Arquivos alterados:
- app/layout.tsx — removido FirstPurchasePopup (popup exit-intent email)
- components/UrgencyToast.tsx — toast movido bottom→top, duração 6s→4s
- app/produto/[slug]/ProductDetailClient.tsx — removido WhatsAppAbandonPopup; invertida ordem botões (Comprar Agora primeiro, Adicionar à Sacola depois); removida frase "Dúvidas sobre este produto?"; nova aba "Clientes" com UGCSection (UGC standalone removido); sticky bar enxuto (só com canAdd, mostra preço + botão Comprar pequeno + ícone sacola, sem "ESCOLHA COR/TAM")
- app/checkout/CheckoutClient.tsx — campos Nome+Sobrenome unificados em "Nome completo" (split no espaço internamente); telefone opcional (label sem `*`, validação removida, fallback "0000000000000" no billing e auto-register); pré-preenche CEP+endereço a partir de localStorage `jaleca-shipping-prefill` (TTL 24h)
- components/ShippingCalculator.tsx — salva CEP+endereço ViaCEP em localStorage após cálculo
O que foi feito:
- 10 itens de UX confirmados pelo usuário, todos aplicados em uma passada
- Áreas críticas (checkout — itens 2, 3, 6) executadas com aprovação explícita
Comandos rodados: npx tsc --noEmit (passou); npx eslint nos 5 arquivos (apenas warnings pré-existentes + 1 erro `any` em L912 pré-existente)
Resultado: OK — TypeScript limpo, mudanças isoladas
Riscos identificados:
- Item 6 (telefone vazio→"0000000000000"): se Asaas/gateway de pagamento validar formato, pode dar erro. Não testado em produção.
- Item 2 (split no primeiro espaço): se cliente digitar só primeiro nome, last_name fica vazio — Woo aceita
- Item 3 (localStorage prefill): só funciona se cliente calcular frete antes de ir ao checkout
Próximo passo: testar fluxo completo de checkout em staging (pedido com telefone vazio, pedido sem cálculo prévio, pedido com nome único). Se aprovado, deploy.

# PRD Final — Melhor Envio + Cadência de Emails Automáticos
**Versão:** 1.0 · **Data:** 05/04/2026 · **Status:** Aguardando token OAuth2

---

## Visão Geral

Sistema completo de frete + comunicação automática com o cliente, do momento da compra até a entrega.

| Item | Detalhe |
|------|---------|
| **Frete** | Calculado pelo Melhor Envio + R$ 3,50 de taxa operacional |
| **Etiqueta** | Gerada/impressa pelo plugin ME dentro do WP Admin |
| **Emails** | 10 automáticos cobrindo todo o ciclo do pedido |
| **Rastreamento** | Cron diário consulta ME → dispara emails por evento |
| **Custo mensal** | R$ 0 (exceto postagem — custo normal das etiquetas) |

---

## O Frete — Como Fica para o Cliente

### No checkout (calculado em tempo real)
O cliente digita o CEP → sistema consulta o Melhor Envio → retorna as opções com **+R$ 3,50** embutido:

```
Exemplo real:
  Melhor Envio retorna → PAC Correios: R$ 18,50
  Cliente vê no site  → PAC Correios: R$ 22,00

  Melhor Envio retorna → Jadlog .Package: R$ 24,00
  Cliente vê no site  → Jadlog .Package: R$ 27,50
```

Esse R$ 3,50 cobre: etiqueta + manuseio + margem operacional.
Frete grátis (>R$ 599, estados SP/RJ/ES/MG) permanece igual — R$ 3,50 absorvido por vocês.

### Arquivo a atualizar: `components/ShippingCalculator.tsx` + `lib/melhor-envio.ts`
Hoje o token é placeholder. Com o token real, só adicionar `+ 3.50` em cada opção retornada.

---

## Fluxo Completo — Do Pedido à Entrega

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ETAPA 1 — CLIENTE FAZ O PEDIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Cliente finaliza compra
      ↓
  Email de CONFIRMAÇÃO já enviado (sistema atual — ok)
      ↓
  Status do pedido: PENDENTE (aguardando pagamento)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ETAPA 2 — PAGAMENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  SE não pagar em 12 horas:
      → 📧 EMAIL #1 — "Seu pedido está esperando você"
         Assunto: "Você esqueceu? Seu pedido Jaleca aguarda pagamento 🕐"
         Conteúdo: resumo do pedido + botão "Finalizar Pagamento"
         Gatilho: CRON (a cada hora verifica pedidos pendentes +12h)

  SE pagar (PIX/Boleto/Cartão):
      → Pagar.me notifica → status muda para "Em análise"
      → 📧 EMAIL #2 — "Pagamento recebido, em análise"
         Assunto: "Pagamento em análise — Jaleca ✅"
         Conteúdo: confirmação + prazo de análise
         Gatilho: HOOK WooCommerce (imediato)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ETAPA 3 — VOCÊ (WP ADMIN) PROCESSA O PEDIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Você muda status → "Faturado"
      → 📧 EMAIL #3 — "Pedido faturado"
         Assunto: "Pedido #1234 confirmado e faturado ✅"
         Conteúdo: itens do pedido + prazo de envio estimado
         Gatilho: HOOK WooCommerce (imediato)

  Você muda status → "Em separação"
      → 📧 EMAIL #4 — "Separando seu pedido"
         Assunto: "Estamos preparando seu pedido! 📦"
         Conteúdo: mensagem de entusiasmo + itens sendo separados
         Gatilho: HOOK WooCommerce (imediato)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ETAPA 4 — VOCÊ IMPRIME A ETIQUETA (WP ADMIN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Você abre o pedido no WP Admin
  Clica no botão "Melhor Envio → Imprimir Etiqueta"
      ↓
  Plugin ME compra etiqueta + salva código de rastreio no pedido
      ↓ (automático via functions.php)
  Next.js recebe webhook com código + transportadora
      → 📧 EMAIL #5 — "Pedido enviado!"
         Assunto: "Seu pedido Jaleca foi enviado 🚚"
         Conteúdo:
           - Transportadora (ex: Correios / Jadlog)
           - Código de rastreio (ex: PU123456789BR)
           - Link direto para rastrear
           - Prazo estimado de entrega
         Gatilho: WEBHOOK (imediato ao salvar código)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ETAPA 5 — RASTREAMENTO AUTOMÁTICO (VOCÊ NÃO FAZ NADA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Todo dia às 9h da manhã (cron automático):
  Sistema consulta Melhor Envio para cada pedido com rastreio ativo

  SE detectar "Em trânsito":
      → 📧 EMAIL #6 — "Seu pedido está a caminho"
         Assunto: "Pedido #1234 em trânsito 📦"
         Conteúdo: localização atual + previsão de entrega
         Enviado: 1x apenas (não repete)

  SE detectar "Saiu para entrega":
      → 📧 EMAIL #7 — "Sai para entrega hoje"
         Assunto: "Seu pedido Jaleca sai para entrega hoje! 🚚"
         Conteúdo: aviso urgente + "fique em casa"
         Enviado: 1x apenas (não repete)

  SE detectar "Entregue":
      → 📧 EMAIL #8 — "Pedido entregue"
         Assunto: "Seu jaleco chegou! Como foi? 🏠"
         Conteúdo: confirmação de entrega + pedido de avaliação
         Enviado: 1x apenas (não repete)
         + STATUS DO PEDIDO → muda para "Concluído" automaticamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ETAPA 6 — SE HOUVER PROBLEMA (opcional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Você muda status → "Cancelado"
      → 📧 EMAIL #9 — "Pedido cancelado"
         Assunto: "Pedido #1234 cancelado — Jaleca"
         Conteúdo: motivo + contato para dúvidas

  Você muda status → "Reembolsado"
      → 📧 EMAIL #10 — "Reembolso processado"
         Assunto: "Seu reembolso foi processado — Jaleca"
         Conteúdo: valor + prazo para estorno no cartão/banco
```

---

## Cadência de Emails — Resumo Visual

```
DIA 0     Cliente compra
          └─ Email Confirmação (já existe ✅)

DIA 0+12h SE não pagou → Email #1 "Lembrete pagamento"

DIA 0     SE pagou → Email #2 "Em análise"

DIA 1     Você fatura → Email #3 "Faturado"
          Você separa → Email #4 "Em separação"
          Você imprime etiqueta → Email #5 "Enviado + código"

DIA 2-3   Cron detecta trânsito → Email #6 "A caminho"

DIA 4-5   Cron detecta saída → Email #7 "Sai hoje para entrega"

DIA 4-5   Cron detecta entrega → Email #8 "Entregue 🎉"
                                  + Pedido → Concluído (automático)
```

---

## Tabela Completa dos 10 Emails

| # | Gatilho | Quem dispara | Assunto | Timing |
|---|---------|-------------|---------|--------|
| 1 | Pedido pendente +12h sem pagar | CRON (a cada hora) | "Você esqueceu? Seu pedido aguarda 🕐" | Automático |
| 2 | Status → Em análise | HOOK WC | "Pagamento em análise ✅" | Imediato |
| 3 | Status → Faturado | HOOK WC | "Pedido #X faturado ✅" | Imediato |
| 4 | Status → Em separação | HOOK WC | "Estamos separando seu pedido! 📦" | Imediato |
| 5 | Etiqueta ME impressa | WEBHOOK | "Pedido enviado! Rastreie aqui 🚚" | Imediato |
| 6 | ME retorna "in_transit" | CRON (9h) | "Pedido #X a caminho 📦" | 1x por pedido |
| 7 | ME retorna "out_for_delivery" | CRON (9h) | "Sai para entrega hoje 🚚" | 1x por pedido |
| 8 | ME retorna "delivered" | CRON (9h) | "Chegou! Como foi? 🏠" | 1x por pedido |
| 9 | Status → Cancelado | HOOK WC | "Pedido #X cancelado" | Imediato |
| 10 | Status → Reembolsado | HOOK WC | "Reembolso processado — Jaleca" | Imediato |

---

## O Que Você Faz no Dia a Dia

```
✅ VOCÊ FAZ (2-3 min por pedido):
   1. Abre o pedido no WP Admin
   2. Muda status conforme processa (Faturado → Em separação)
   3. Clica "Imprimir Etiqueta" pelo plugin Melhor Envio
   4. Imprime e cola na caixa
   5. Pronto.

🤖 SISTEMA FAZ SOZINHO:
   • Todos os 10 emails
   • Rastreamento diário
   • Fechar pedido como Concluído quando entregue
```

---

## R$ 3,50 de Taxa Operacional no Frete

### Regra
- Toda opção de frete retornada pelo Melhor Envio recebe **+R$ 3,50**
- Aplicado no `ShippingCalculator` (checkout) e na exibição do carrinho
- Não aparece como taxa separada — já vem embutido no valor do frete

### Exceções
- Frete Grátis (>R$599 para SP/RJ/ES/MG): mantém R$0 para o cliente, R$3,50 absorvido internamente
- Retirada na loja (se existir): sem acréscimo

### Implementação
```ts
// lib/melhor-envio.ts
const options = await getMelhorEnvioRates(params)
return options.map(opt => ({
  ...opt,
  price: opt.price + 3.50,          // R$ 3,50 embutido
  custom_price: opt.price + 3.50,
}))
```

---

## Arquivos que Vamos Criar/Modificar

### Criar (novo)
| Arquivo | O que faz |
|---------|-----------|
| `app/api/tracking/register/route.ts` | Recebe webhook quando etiqueta ME é impressa → Email #5 |
| `app/api/tracking/check-all/route.ts` | Cron 9h → consulta ME → Emails #6 #7 #8 + auto-Concluído |
| `app/api/tracking/status/route.ts` | Consulta status de um pedido específico (interno) |
| `app/api/orders/notify/route.ts` | Recebe hook de status WC → Emails #2 #3 #4 #9 #10 |
| `app/api/orders/payment-reminder/route.ts` | Cron horário → Email #1 |

### Modificar (existente)
| Arquivo | O que muda |
|---------|-----------|
| `lib/melhor-envio.ts` | Token real + função de rastreamento + +R$3,50 |
| `lib/email.ts` | +10 funções de email |
| `vercel.json` | +2 crons |
| `functions.php` (WordPress) | +hook etiqueta impressa + hook status + hook reembolso |
| `components/ShippingCalculator.tsx` | +R$3,50 nas opções exibidas |

---

## Dependências — O Que Você Precisa Nos Dar

- [ ] **Token OAuth2 Melhor Envio**
  - Onde gerar: `melhore nvio.com.br → Configurações → Integrações → API → Gerar Token`
  - Permissões necessárias: Envios (leitura) + Rastreamento (leitura)
- [ ] **Plugin Melhor Envio instalado no WP**
  - Verificar em: `wp.jaleca.com.br/wp-admin → Plugins`
  - Se não estiver: instalar "Melhor Envio para WooCommerce" (gratuito no wordpress.org)
- [ ] **Confirmar os status customizados no WC**
  - Você usa "Faturado" e "Em separação" como status customizados?
  - Se sim, qual o slug deles? (ex: `wc-faturado`, `wc-em-separacao`)

---

## Plano de Implementação

| Fase | Tarefa | Horas |
|------|--------|-------|
| **1** | Token ME real no Vercel + `lib/melhor-envio.ts` (+R$3,50 + rastreamento) | 1.5h |
| **2** | `functions.php` WP — hook etiqueta + hook status + hook reembolso | 1.5h |
| **3** | `POST /api/tracking/register` — Email #5 enviado | 1h |
| **4** | `POST /api/orders/notify` — Emails #2 #3 #4 #9 #10 | 1h |
| **5** | `GET /api/tracking/check-all` — Cron + Emails #6 #7 #8 + auto-Concluído | 2h |
| **6** | `GET /api/orders/payment-reminder` — Cron + Email #1 | 1h |
| **7** | 10 templates de email em `lib/email.ts` | 2h |
| **8** | `ShippingCalculator.tsx` — +R$3,50 visível | 0.5h |
| **9** | `vercel.json` — 2 crons | 0.5h |
| **10** | Testes end-to-end + ajustes | 2h |
| | **Total** | **~13h** |

---

## Custo Total do Projeto

| Item | Custo |
|------|-------|
| Desenvolvimento | R$ 0 (feito internamente) |
| Plugin Melhor Envio WooCommerce | R$ 0 (gratuito) |
| API Melhor Envio — rastreamento | R$ 0 |
| Brevo — 10 templates de email | R$ 0 (já incluso no plano) |
| Vercel Cron — 2 jobs | R$ 0 (já incluso no Pro) |
| Postagem das etiquetas | Custo normal Melhor Envio (já era assim) |
| **Receita adicional** | **+R$3,50 por pedido enviado** |

---

*v1.0 — 05/04/2026 · Jaleca*

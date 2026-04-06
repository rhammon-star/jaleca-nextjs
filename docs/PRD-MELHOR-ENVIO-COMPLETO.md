# PRD — Integração Completa Melhor Envio + Comunicação Automática de Pedidos
**Versão:** 1.0 · **Data:** 05/04/2026 · **Status:** Aguardando aprovação

---

## Resumo Executivo

| Item | Detalhe |
|------|---------|
| **Objetivo** | Reativar frete Melhor Envio + automatizar 10 emails ao cliente por status de pedido |
| **Custo mensal** | R$ 0 (exceto postagem das etiquetas — já era custo existente) |
| **Esforço estimado** | ~12–15 horas de desenvolvimento |
| **Risco** | Baixo — plugin WC isolado + APIs independentes do checkout |
| **Dependência** | Token OAuth2 do Melhor Envio + plugin instalado no WP |

---

## O Que Muda na Sua Rotina

### Hoje (manual)
```
Pedido pago
→ Você entra no ME, cotou, comprou etiqueta, imprimiu
→ Você copia código de rastreio
→ Você envia mensagem manual pro cliente
→ Cliente pergunta "cadê meu pedido?" → você responde manualmente
→ Repete isso 5x por dia
```

### Depois (automático)
```
Pedido pago
→ Você abre o pedido no WP Admin
→ Clica "Imprimir Etiqueta" (botão do plugin Melhor Envio — já existe)
→ Imprime
→ Pronto. O sistema cuida do resto.

AUTOMÁTICO:
• Email imediato → "Pedido enviado! Rastreie aqui 🚚"
• Todo dia de manhã → consulta Melhor Envio
• "Em trânsito" detectado → email automático
• "Saiu para entrega" detectado → email automático
• "Entregue" detectado → email automático + pedido vai para Concluído
```

**Tempo economizado estimado: 30–45 min/dia**

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────┐
│                  WP ADMIN (você)                     │
│                                                      │
│  Pedido #1234                                        │
│  [✓ Melhor Envio — Imprimir Etiqueta]               │
│      ↓ plugin salva código no pedido                 │
│      ↓ functions.php detecta → webhook               │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/tracking/register
                       ↓
┌─────────────────────────────────────────────────────┐
│              NEXT.JS (Vercel)                        │
│                                                      │
│  /api/tracking/register  → Email #5 "Enviado"        │
│  /api/tracking/check-all → Cron 9h → Emails #6 #7 #8│
│  /api/orders/notify      → Emails #2 #3 #4 #9 #10   │
│  /api/orders/payment-reminder → Cron → Email #1     │
│                                                      │
│  lib/melhor-envio.ts     → Cliente API ME            │
│  lib/email.ts            → Templates Brevo           │
└──────────────────────┬──────────────────────────────┘
                       │ GET tracking
                       ↓
┌─────────────────────────────────────────────────────┐
│           MELHOR ENVIO API                           │
│  /api/v2/me/shipment/tracking                        │
│  Retorna: in_transit / out_for_delivery / delivered  │
└─────────────────────────────────────────────────────┘
```

---

## Parte 1 — Plugin Melhor Envio no WooCommerce

### O que o plugin faz (sem programar nada)
- Cotação de frete em tempo real no checkout
- Seleção de transportadora (Correios, Jadlog, Braspress, etc.)
- Compra e impressão de etiqueta dentro do WP Admin
- Salva automaticamente no pedido:
  - `_melhorenvio_tag` → ID interno do envio no ME
  - `_melhorenvio_tracking` → código de rastreio (ex: PU123456789BR)
  - `_melhorenvio_carrier` → nome da transportadora

### O que precisamos fazer (apenas configurar)
1. Instalar/reativar o plugin: `WP Admin → Plugins → Melhor Envio`
2. Configurar com token OAuth2 real
3. Testar uma cotação no checkout

### O que você precisa nos dar
- [ ] Token OAuth2 do Melhor Envio (Configurações → API → Tokens)
- Permissões necessárias no token: **Leitura de envios**, **Rastreamento**

---

## Parte 2 — functions.php (WordPress)

### Hook: detectar código de rastreio salvo

Quando você imprime a etiqueta, o plugin ME salva `_melhorenvio_tracking` no pedido. Vamos adicionar um hook em `functions.php` que detecta isso e notifica o Next.js:

```php
// Detecta quando Melhor Envio salva o código de rastreio
add_action('updated_post_meta', function($meta_id, $post_id, $meta_key, $meta_value) {
    if ($meta_key !== '_melhorenvio_tracking' || empty($meta_value)) return;
    
    $order = wc_get_order($post_id);
    if (!$order) return;
    
    // Busca transportadora
    $carrier = get_post_meta($post_id, '_melhorenvio_carrier', true);
    $me_tag  = get_post_meta($post_id, '_melhorenvio_tag', true);
    
    wp_remote_post(JALECA_NEXTJS_URL . '/api/tracking/register', [
        'body' => json_encode([
            'orderId'       => $order->get_id(),
            'orderKey'      => $order->get_order_key(),
            'trackingCode'  => $meta_value,
            'carrier'       => $carrier,
            'meTag'         => $me_tag,
            'customerEmail' => $order->get_billing_email(),
            'customerName'  => $order->get_billing_first_name(),
            'secret'        => JALECA_WEBHOOK_SECRET,
        ]),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 10,
    ]);
}, 10, 4);
```

### Hook: mudanças de status do pedido

Para os emails de "Em análise", "Faturado", "Em separação", "Cancelado", "Reembolsado":

```php
add_action('woocommerce_order_status_changed', function($order_id, $old_status, $new_status) {
    $statuses = ['on-hold', 'processing', 'wc-faturado', 'wc-em-separacao', 'cancelled', 'refunded'];
    if (!in_array($new_status, $statuses)) return;
    
    $order = wc_get_order($order_id);
    
    wp_remote_post(JALECA_NEXTJS_URL . '/api/orders/notify', [
        'body' => json_encode([
            'orderId'       => $order_id,
            'newStatus'     => $new_status,
            'customerEmail' => $order->get_billing_email(),
            'customerName'  => $order->get_billing_first_name(),
            'orderTotal'    => $order->get_total(),
            'secret'        => JALECA_WEBHOOK_SECRET,
        ]),
        'headers' => ['Content-Type' => 'application/json'],
        'timeout' => 10,
    ]);
}, 10, 3);
```

---

## Parte 3 — Next.js (o que vamos construir)

### 3.1 `lib/melhor-envio.ts` (atualizar)

O arquivo já existe com token placeholder. Vamos adicionar a função de rastreamento:

```ts
// Rastreia um ou mais envios pelo ID interno do Melhor Envio
export async function trackShipments(meTags: string[]): Promise<TrackingResult[]>

// Já existe — calcular frete (só precisa do token real)
export async function calculateShipping(params): Promise<ShippingOption[]>
```

**API usada:** `GET https://melhorenvio.com.br/api/v2/me/shipment/tracking`

**Eventos que a API retorna:**
| Evento ME | Nossa ação |
|---|---|
| `released` / `posted` | Enviado (já enviamos o email quando salvou código) |
| `in_transit` | Email #6 "A caminho" |
| `out_for_delivery` | Email #7 "Sai hoje para entrega" |
| `delivered` | Email #8 "Entregue" + status → Concluído |
| `undelivered` | (sem email — monitorar manualmente) |

---

### 3.2 `POST /api/tracking/register/route.ts`

Chamado pelo WP quando etiqueta é impressa.

```
Recebe: orderId, trackingCode, carrier, meTag, customerEmail, customerName
Faz:
  1. Valida secret
  2. Salva meta_data no WooCommerce (jaleca_tracking_*)
  3. Chama sendOrderShipped() → Email #5
  4. Retorna 200
```

---

### 3.3 `GET /api/tracking/check-all/route.ts`

Cron diário às 9h (horário de Brasília = 12h UTC).

```
Faz:
  1. Busca todos pedidos WC com status "completed" ou "shipped" com rastreio ativo
  2. Para cada pedido com meTag → chama Melhor Envio API
  3. Compara evento atual com último notificado
  4. Se novo evento → envia email correspondente
  5. Se "delivered" → muda status WC para "completed" via REST API
  6. Atualiza jaleca_tracking_status + jaleca_notified_statuses
```

---

### 3.4 `POST /api/orders/notify/route.ts`

Chamado pelo WP quando status do pedido muda.

```
Recebe: orderId, newStatus, customerEmail, customerName, orderTotal
Mapa de emails:
  "on-hold"          → Email #2 "Pagamento em análise"
  "processing"       → Email #3 "Pedido faturado"
  "wc-em-separacao"  → Email #4 "Separando seu pedido"
  "cancelled"        → Email #9 "Pedido cancelado"
  "refunded"         → Email #10 "Reembolso processado"
```

---

### 3.5 `GET /api/orders/payment-reminder/route.ts`

Cron a cada hora.

```
Faz:
  1. Busca pedidos WC com status "pending" criados há +12h
  2. Filtra os que NÃO têm jaleca_payment_reminder_sent = "1"
  3. Para cada um → envia Email #1 "Você esqueceu de pagar?"
  4. Salva jaleca_payment_reminder_sent = "1" para não repetir
```

---

## Parte 4 — Os 10 Emails (lib/email.ts)

| # | Função | Assunto |
|---|--------|---------|
| 1 | `sendPaymentReminder()` | "Seu pedido está esperando você 🕐" |
| 2 | `sendOrderUnderReview()` | "Pagamento em análise — Jaleca" |
| 3 | `sendOrderInvoiced()` | "Pedido #X faturado ✅" |
| 4 | `sendOrderPacking()` | "Estamos separando seu pedido! 📦" |
| 5 | `sendOrderShipped()` | "Pedido enviado! Rastreie aqui 🚚" |
| 6 | `sendOrderInTransit()` | "Seu pedido está a caminho 📦" |
| 7 | `sendOrderOutForDelivery()` | "Seu pedido sai para entrega hoje 🚚" |
| 8 | `sendOrderDelivered()` | "Pedido entregue! Como foi? 🏠" |
| 9 | `sendOrderCancelled()` | "Pedido #X cancelado" |
| 10 | `sendOrderRefunded()` | "Seu reembolso foi processado — Jaleca" |

Todos via **Brevo** (já configurado). Template simples com logo, cor e CTA.

---

## Parte 5 — Vercel Crons

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/tracking/check-all",
      "schedule": "0 12 * * *"
    },
    {
      "path": "/api/orders/payment-reminder",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## Parte 6 — Meta Data no WooCommerce

Campos salvos em cada pedido:

| Campo | Valor | Para que |
|---|---|---|
| `jaleca_tracking_code` | "PU123456789BR" | Exibir para cliente |
| `jaleca_me_tag` | "abc123" | Consultar ME API |
| `jaleca_tracking_carrier` | "correios" | Info no email |
| `jaleca_tracking_status` | "in_transit" | Evitar email duplicado |
| `jaleca_notified_statuses` | "shipped,in_transit" | Evitar email duplicado |
| `jaleca_tracking_active` | "1" | Ligar/desligar rastreio |
| `jaleca_payment_reminder_sent` | "1" | Evitar lembrete duplicado |

---

## Parte 7 — Plano de Implementação

| Fase | O que | Horas |
|------|-------|-------|
| **1** | Configurar plugin ME no WP + token OAuth2 | 0.5h |
| **2** | `functions.php` — hooks de status + webhook tracking | 1.5h |
| **3** | `lib/melhor-envio.ts` — adicionar função de rastreamento | 1.5h |
| **4** | `POST /api/tracking/register` — email enviado + salvar meta | 1h |
| **5** | `POST /api/orders/notify` — emails por status | 1h |
| **6** | `GET /api/tracking/check-all` — cron + auto-Concluído | 2h |
| **7** | `GET /api/orders/payment-reminder` — cron lembrete | 1h |
| **8** | 10 templates em `lib/email.ts` | 2h |
| **9** | `vercel.json` — configurar 2 crons | 0.5h |
| **10** | Testes end-to-end | 2h |
| | **Total estimado** | **~13h** |

---

## O Que Você Precisa Fazer

- [ ] **Gerar token OAuth2** no Melhor Envio (Configurações → API → Tokens)
  - Permissões: Envios (leitura) + Rastreamento (leitura)
- [ ] **Confirmar se o plugin está instalado** em `wp.jaleca.com.br/wp-admin → Plugins`
  - Se não estiver: instalar "Melhor Envio" (plugin oficial, gratuito)
- [ ] **Nos enviar o token** para configurar no Vercel e no código

---

## Fora do Escopo (Fase 2 futura)

- ❌ Página pública `/rastrear` no site
- ❌ Notificações WhatsApp automáticas
- ❌ Dashboard de rastreamentos no admin Next.js
- ❌ Compra de etiqueta via Next.js (fica no WP Admin)

---

## Custo Total

| Serviço | Custo |
|---------|-------|
| Plugin Melhor Envio WooCommerce | R$ 0 |
| Melhor Envio API rastreamento | R$ 0 |
| Brevo (10 templates) | R$ 0 (já incluso no plano atual) |
| Vercel Cron (2 jobs) | R$ 0 (já incluso no Pro) |
| **Postagem das etiquetas** | **Custo normal ME** (já era assim antes) |
| **Total de desenvolvimento** | **R$ 0/mês** |

---

*v1.0 — 05/04/2026*

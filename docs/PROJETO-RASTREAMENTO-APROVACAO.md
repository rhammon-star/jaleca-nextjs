# Projeto: Comunicação Automática de Pedidos — Jaleca
**Versão:** 3.0 · **Data:** 05/04/2026 · **Status:** ✅ Aprovado — Aguardando API Key Rastreador.dev

---

## Resumo Executivo

| Item | Detalhe |
|------|---------|
| **Objetivo** | Notificar clientes automaticamente em cada etapa do pedido + rastreamento de envio |
| **Custo mensal** | R$ 0 |
| **Esforço de desenvolvimento** | ~10–12 horas |
| **Risco** | Baixo — isolado do checkout existente |
| **Dependência crítica** | API Key Rastreador.dev (conta a criar) |

---

## Decisões Confirmadas (05/04/2026)

| Decisão | Escolha |
|---------|---------|
| Transportadoras com rastreio automático | Correios, Jadlog, Braspress |
| Outras transportadoras | Envia código + nome — cliente rastreia no site deles |
| Campo de rastreio + transportadora | Via `functions.php` (sem plugin) |
| "Em separação" envia email ao cliente? | ✅ Sim |
| Pagamento pendente sem pagar → email? | ✅ Sim — lembrete após **12 horas** |
| Entregue → muda status para Concluído? | ✅ Sim — automático pelo sistema |

---

## 1. Mapa Completo de Emails

Todo o ciclo de vida do pedido coberto:

| # | Gatilho | Assunto do Email | Quando |
|---|---------|-----------------|--------|
| 1 | Pagamento pendente sem pagar | "Você esqueceu de pagar? Seu pedido aguarda 🕐" | 12h após criação sem pagamento |
| 2 | Pagamento em análise | "Seu pagamento está em análise — Jaleca" | Imediato ao mudar status |
| 3 | Faturado | "Pedido #1234 faturado — preparando seu envio" | Imediato ao mudar status |
| 4 | Em separação | "Estamos separando seu pedido! 📦" | Imediato ao mudar status |
| 5 | Código de rastreio salvo | "Pedido #1234 enviado! Rastreie aqui 🚚" | Imediato ao salvar código |
| 6 | Em trânsito | "Seu pedido está a caminho! 📦" | Cron automático (tracking) |
| 7 | Saiu para entrega | "Seu pedido sai para entrega hoje 🚚" | Cron automático (tracking) |
| 8 | Entregue | "Pedido entregue! Como foi? 🏠" | Cron automático → **muda status para Concluído** |
| 9 | Cancelado | "Seu pedido #1234 foi cancelado" | Imediato ao mudar status |
| 10 | Reembolsado | "Seu reembolso foi processado — Jaleca" | Imediato ao mudar status |

**Total: 10 emails automáticos** — zero trabalho manual.

---

## 2. Fluxo do Seu Dia a Dia

```
CLIENTE FAZ PEDIDO
    ↓
[Pagamento PIX/Boleto]
    ↓ se não pagar em 12h → Email #1 "Você esqueceu de pagar?"
    ↓ se pagar → segue fluxo normal

PEDIDO PAGO
    ↓
Você muda status → "Pagamento em análise"  → Email #2 automático
    ↓
Você muda status → "Faturado"              → Email #3 automático
    ↓
Você muda status → "Em separação"          → Email #4 automático
    ↓
Você preenche:
  - Transportadora: [Correios ▼]
  - Código: [PU123456789BR]
  - Clica "Atualizar"                      → Email #5 automático

A PARTIR DAQUI VOCÊ NÃO FAZ MAIS NADA

Todo dia de manhã (automático):
    ↓ Em trânsito detectado               → Email #6 automático
    ↓ Saiu para entrega detectado         → Email #7 automático
    ↓ Entregue detectado                  → Email #8 automático
                                             + Status → Concluído (automático)

SE PROBLEMA:
Você muda status → "Cancelado"             → Email #9 automático
Você muda status → "Reembolsado"           → Email #10 automático
```

---

## 3. Transportadoras

| Transportadora | Rastreio Automático | Como |
|---|---|---|
| **Correios** | ✅ Sim | Rastreador.dev |
| **Jadlog** | ✅ Sim | Rastreador.dev → fallback API Jadlog |
| **Braspress** | ✅ Sim | Rastreador.dev → fallback API Braspress |
| **Outra** | ❌ Não | Email com código + nome da transportadora |

---

## 4. O Que Será Construído

### 4.1 Campos de Rastreio no WP Admin (functions.php)

Nova caixa **"Rastreamento de Envio"** na tela do pedido:

```
┌─────────────────────────────────────┐
│  Rastreamento de Envio              │
│                                     │
│  Transportadora:                    │
│  [ Selecionar ▼ ]                   │
│    • Correios                       │
│    • Jadlog                         │
│    • Braspress                      │
│    • Outra                          │
│                                     │
│  Código de Rastreio:                │
│  [                             ]    │
└─────────────────────────────────────┘
```

Ao salvar o pedido com esses campos preenchidos → webhook automático para `/api/tracking/register`.

---

### 4.2 Emails por Mudança de Status (functions.php)

Hooks no WooCommerce disparam chamadas à API do site quando o status muda:

```
woocommerce_order_status_changed → POST /api/orders/notify
  { order_id, new_status, customer_email, customer_name, ... }
```

Statuses cobertos: `on-hold` (análise), `faturado`, `wc-separacao`, `cancelled`, `refunded`.

---

### 4.3 Lembrete de Pagamento Pendente (cron)

Cron separado — roda a cada hora, verifica pedidos:
- Status = `pending`
- Criados há mais de 12 horas
- Lembrete ainda não enviado (`jaleca_payment_reminder_sent` não existe no meta)

```
vercel.json:
{ "path": "/api/orders/payment-reminder", "schedule": "0 * * * *" }
```

---

### 4.4 Endpoints API (Next.js — Vercel)

| Endpoint | Função |
|----------|--------|
| `POST /api/tracking/register` | Recebe código de rastreio do WooCommerce → email #5 |
| `GET /api/tracking/check-all` | Cron diário — verifica status tracking → emails #6 #7 #8 + auto-Concluído |
| `GET /api/tracking/status` | Consulta status de um código (uso interno) |
| `POST /api/orders/notify` | Recebe mudanças de status → emails #2 #3 #4 #9 #10 |
| `GET /api/orders/payment-reminder` | Cron horário — lembrete pagamento pendente → email #1 |

---

### 4.5 Automação: Entregue → Concluído

Quando o cron de rastreamento detecta status "entregue":
1. Envia Email #8 ao cliente
2. Chama `PATCH /wp-json/wc/v3/orders/{id}` com `{ "status": "completed" }`
3. Marca `jaleca_tracking_active = 0` (para de monitorar)

O pedido muda para "Concluído" no WooCommerce sem você precisar fazer nada.

---

### 4.6 Armazenamento (WooCommerce meta_data)

```
jaleca_tracking_code          → "PU123456789BR"
jaleca_tracking_carrier       → "correios" | "jadlog" | "braspress" | "outra"
jaleca_tracking_carrier_name  → "Braspress"
jaleca_tracking_status        → "in_transit" | "out_for_delivery" | "delivered"
jaleca_tracking_history       → "[{...}]" (JSON — histórico completo)
jaleca_notified_statuses      → "shipped,in_transit" (evita email duplicado)
jaleca_tracking_active        → "1" | "0"
jaleca_payment_reminder_sent  → "1" (evita lembrete duplicado)
```

---

## 5. Sequência de Implementação

| Fase | Tarefa | Horas |
|------|--------|-------|
| **1** | `functions.php` — campos rastreio + hooks de status + webhook | 1.5h |
| **2** | `lib/tracking.ts` — cliente Rastreador.dev + fallback Jadlog/Braspress | 2h |
| **3** | `POST /api/orders/notify` — emails por mudança de status (#2 #3 #4 #9 #10) | 1h |
| **4** | `POST /api/tracking/register` — email envio (#5) + salvar meta | 1h |
| **5** | `GET /api/tracking/check-all` — cron rastreamento + auto-Concluído (#6 #7 #8) | 1.5h |
| **6** | `GET /api/orders/payment-reminder` — cron lembrete 12h (#1) | 1h |
| **7** | Templates email Brevo (10 templates) em `lib/email.ts` | 2h |
| **8** | Testes end-to-end | 1.5h |
| | **Total** | **~11.5h** |

---

## 6. O Que Você Precisa Fazer

**Antes de começar:**
- [ ] Criar conta em **rastreador.dev** → copiar API Key
- [ ] Enviar a API Key (vai para Vercel como `RASTREADOR_DEV_API_KEY`)

**Durante os testes:**
- [ ] Fazer pedido de teste → confirmar email de lembrete após 12h
- [ ] Mudar status manualmente → confirmar emails de cada etapa
- [ ] Despachar pedido com código real → confirmar email de envio
- [ ] Aguardar cron → confirmar emails de rastreamento
- [ ] Confirmar que status vira "Concluído" automaticamente ao entregar

---

## 7. Fora do Escopo (Fase 2 futura)

- ❌ Página pública `/rastrear` no site (cliente digita o código)
- ❌ Notificações WhatsApp automáticas
- ❌ Dashboard admin de rastreamentos

---

## 8. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Rastreador.dev fora do ar | Baixa | Médio | Fallback APIs diretas Jadlog/Braspress |
| Código inválido | Média | Baixo | Tenta novamente em 24h |
| Limite 100 req/dia | Baixa | Médio | Monitorar só pedidos dos últimos 15 dias |
| Auto-Concluído errado | Muito baixa | Médio | Só muda status quando API confirma entrega com data |
| Email duplicado | Baixa | Baixo | `jaleca_notified_statuses` evita reenvio |

---

## 9. Arquivos

**Criados:**
```
app/api/
├── tracking/
│   ├── register/route.ts       ← webhook código de rastreio
│   ├── status/route.ts         ← consulta status (interno)
│   └── check-all/route.ts      ← cron diário tracking
└── orders/
    ├── notify/route.ts         ← emails por mudança de status
    └── payment-reminder/route.ts ← cron lembrete 12h

lib/tracking.ts                 ← cliente Rastreador.dev + fallback
```

**Modificados:**
```
lib/email.ts      ← +10 funções de email
vercel.json       ← +2 entradas cron
```

**WordPress:**
```
functions.php     ← campos rastreio + hooks status + webhooks
```

---

## 10. Custo Total

| Serviço | Custo |
|---------|-------|
| Rastreador.dev | R$ 0 (100 req/dia) |
| Jadlog API | R$ 0 |
| Braspress API | R$ 0 |
| Brevo (10 templates) | R$ 0 (já incluso) |
| Vercel Cron (2 jobs) | R$ 0 (já incluso no Pro) |
| **Total** | **R$ 0/mês** |

---

*Versão 3.0 — 05/04/2026 · Projeto completo aprovado · Aguardando API Key Rastreador.dev*

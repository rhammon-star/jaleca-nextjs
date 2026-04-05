# Projeto: Comunicação Automática de Pedidos — Jaleca
**Versão:** 4.0 · **Data:** 05/04/2026 · **Status:** ✅ Aprovado — Pendente: confirmar API de rastreamento

---

## Resumo Executivo

| Item | Detalhe |
|------|---------|
| **Objetivo** | Notificar clientes automaticamente em cada etapa do pedido + rastreamento de envio |
| **Custo mensal** | R$ 0 |
| **Esforço de desenvolvimento** | ~10–12 horas |
| **Risco** | Baixo — isolado do checkout existente |
| **Pendência** | Confirmar se etiquetas são geradas pelo Melhor Envio (define qual API de rastreamento usar) |

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
| rastreador.dev | ❌ Descontinuado — não usar |

---

## API de Rastreamento — Decisão Pendente

> ⚠️ **Confirmar antes de iniciar a implementação.**

### Opção A — Melhor Envio (recomendada se usar para etiquetas)
- **Condição:** só funciona para fretes **gerados dentro da plataforma Melhor Envio**
- **Custo:** R$ 0 (gratuito, ilimitado)
- **Transportadoras:** Correios, Jadlog, Braspress — todas em uma API só
- **Autenticação:** OAuth2 (já previsto no projeto — `lib/melhor-envio.ts`)
- **Como confirmar:** você emite etiquetas pelo Melhor Envio?

### Opção B — APIs diretas (se não usar Melhor Envio para etiquetas)

| Transportadora | API | Custo |
|---|---|---|
| Correios | SeuRastreio (seurastreio.com.br) | Grátis |
| Jadlog | API direta Jadlog | Grátis |
| Braspress | API direta Braspress | Grátis |

Mais integrações para manter, mas totalmente gratuito.

---

## 1. Mapa Completo de Emails (10 automáticos)

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

---

## 2. Fluxo do Dia a Dia

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

## 3. Campos no WP Admin (functions.php)

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

Ao salvar → webhook automático para `/api/tracking/register`.

---

## 4. Endpoints API (Next.js — Vercel)

| Endpoint | Função |
|----------|--------|
| `POST /api/tracking/register` | Recebe código do WooCommerce → email #5 |
| `GET /api/tracking/check-all` | Cron diário — verifica rastreamento → emails #6 #7 #8 + auto-Concluído |
| `GET /api/tracking/status` | Consulta status de um código (interno) |
| `POST /api/orders/notify` | Mudanças de status WC → emails #2 #3 #4 #9 #10 |
| `GET /api/orders/payment-reminder` | Cron horário — lembrete pagamento → email #1 |

---

## 5. Crons Vercel

```json
{ "path": "/api/tracking/check-all",        "schedule": "0 12 * * *"  }
{ "path": "/api/orders/payment-reminder",    "schedule": "0 * * * *"   }
```

---

## 6. Armazenamento (WooCommerce meta_data)

```
jaleca_tracking_code          → "PU123456789BR"
jaleca_tracking_carrier       → "correios" | "jadlog" | "braspress" | "outra"
jaleca_tracking_carrier_name  → "Braspress"
jaleca_tracking_status        → "in_transit" | "out_for_delivery" | "delivered"
jaleca_tracking_history       → "[{...}]" (JSON)
jaleca_notified_statuses      → "shipped,in_transit" (evita email duplicado)
jaleca_tracking_active        → "1" | "0"
jaleca_payment_reminder_sent  → "1" (evita lembrete duplicado)
```

---

## 7. Sequência de Implementação

| Fase | Tarefa | Horas |
|------|--------|-------|
| **1** | `functions.php` — campos rastreio + hooks de status + webhook | 1.5h |
| **2** | `lib/tracking.ts` — cliente API de rastreamento (Melhor Envio ou APIs diretas) | 2h |
| **3** | `POST /api/orders/notify` — emails por status (#2 #3 #4 #9 #10) | 1h |
| **4** | `POST /api/tracking/register` — email envio (#5) + salvar meta | 1h |
| **5** | `GET /api/tracking/check-all` — cron rastreamento + auto-Concluído (#6 #7 #8) | 1.5h |
| **6** | `GET /api/orders/payment-reminder` — cron lembrete 12h (#1) | 1h |
| **7** | Templates email Brevo (10 templates) em `lib/email.ts` | 2h |
| **8** | Testes end-to-end | 1.5h |
| | **Total** | **~11.5h** |

---

## 8. Você Precisa Fazer

- [ ] **Confirmar:** você emite etiquetas pelo Melhor Envio? (define qual API de rastreamento usar)
- [ ] Se Melhor Envio: configurar OAuth2 real (hoje está com token placeholder)
- [ ] Se não: confirmar que usará APIs diretas (Correios/Jadlog/Braspress)

---

## 9. Fora do Escopo (Fase 2)

- ❌ Página pública `/rastrear` no site
- ❌ Notificações WhatsApp automáticas
- ❌ Dashboard admin de rastreamentos

---

## 10. Arquivos

**Criados:**
```
app/api/tracking/register/route.ts
app/api/tracking/status/route.ts
app/api/tracking/check-all/route.ts
app/api/orders/notify/route.ts
app/api/orders/payment-reminder/route.ts
lib/tracking.ts
```

**Modificados:**
```
lib/email.ts      (+10 funções)
vercel.json       (+2 crons)
functions.php     (+campos rastreio + hooks status)
```

---

## 11. Custo Total

| Serviço | Custo |
|---------|-------|
| Melhor Envio rastreamento | R$ 0 |
| SeuRastreio (fallback Correios) | R$ 0 |
| Jadlog API | R$ 0 |
| Braspress API | R$ 0 |
| Brevo (10 templates) | R$ 0 (já incluso) |
| Vercel Cron (2 jobs) | R$ 0 (já incluso no Pro) |
| **Total** | **R$ 0/mês** |

---

*Versão 4.0 — 05/04/2026 · rastreador.dev descontinuado — substituído por Melhor Envio / APIs diretas*

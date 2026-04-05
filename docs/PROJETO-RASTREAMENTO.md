# Projeto: Sistema de Rastreamento de Pedidos — Jaleca

**Data:** 04/04/2026
**Status:** Proposta

---

## 1. Problema Atual

Hoje o fluxo de rastreamento da Jaleca é **100% manual**:

```
Pedido enviado
    ↓
Dono da loja envia mensagem manual no WhatsApp/email
    ↓
Cliente pergunta "onde está meu pedido?"
    ↓
Dono da loja consulta transportadora manualmente
    ↓
Dono da loja responde cliente manualmente
```

**Dores:**
- 5+ mensagens manuais por dia = ~30min perdidos
- Clientes ansiosos sem atualização
- Falha humana (esquece de avisar, código errado, etc)
- Não consegue consultar status automaticamente
- Layout de emails inconsistente

---

## 2. Objetivo

Criar um sistema automatizado que:

1. **Permita cadastrar código de rastreio** no WooCommerce (Hostinger)
2. **Consulte automaticamente** o status na transportadora (Rastreador.dev, Jadlog, Braspress)
3. **Envie emails automáticos** com layout Jaleca (via Brevo)
4. **Notifique o cliente** em cada mudança de status

---

## 3. Transportadoras e APIs

### 3.1 Rastreador.dev (Agregador — PRIORIDADE)
- **Website:** rastreador.dev
- **API:** REST JSON
- **Gratuito:** 100 consultas/dia (suficiente para ~5 pedidos/dia)
- **Transportadoras suportadas:** Correios, Jadlog, Braspress, Azamex, e outros
- **Documentação:** https://rastreador.dev/api

**Exemplo de uso:**
```
GET https://api.rastreador.dev/v1/track?code=XX123456789BR&carrier=correios

Response:
{
  "code": "XX123456789BR",
  "carrier": "correios",
  "status": "in_transit",
  "status_description": "Objeto em trânsito",
  "history": [
    { "date": "2026-04-05T10:00:00Z", "status": "shipped", "description": "Objeto postado" },
    { "date": "2026-04-06T14:00:00Z", "status": "in_transit", "description": "Objeto em trânsito" }
  ]
}
```

### 3.2 Jadlog
- **API própria:** https://www.jadlog.com.br/api
- **Gratuito:** Sim
- **Código de rastreio:** `JADLOG12345678`

### 3.3 Braspress
- **API própria:** https://www.braspress.com.br/api
- **Gratuito:** Sim
- **Código de rastreio:** `1234567890`

### 3.4 Correios (via Rastreador.dev)
- **Código de rastreio:** `PU123456789BR`
- **Serviço:** PAC, SEDEX, SEDEX 10

---

## 4. Arquitetura da Solução

```
┌──────────────────────────────────────────────────────────────────────┐
│                         ARQUITETURA COMPLETA                          │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   WooCommerce    │         │    Vercel        │         │    Brevo          │
│   (Hostinger)    │         │   (jaleca.com)   │         │   (Emails)        │
└────────┬────────┘         └────────┬─────┘         └────────┬────────┘
         │                           │                         │
         │ 1. Pedido enviado         │                         │
         │    + código rastreio      │                         │
         │─────────────────────────>│                         │
         │                           │                         │
         │                           │ 2. Salva tracking       │
         │                           │    em JSON local        │
         │                           │                         │
         │                           │ 3. Consulta API         │
         │                           │    Rastreador.dev      │
         │                           │    (Jadlog/Braspress)  │
         │                           │                         │
         │                           │ 4. Envia email         │
         │                           │    via Brevo           │
         │                           │────────────────────────>
         │                           │                         │
         │                           │ 5. Atualiza status     │
         │                           │    no pedido WC        │
         │                           │                         │
         │                           │ 6. Próxima consulta    │
         │                           │    (cron 1x/dia)       │
         │                           │                         │
         └───────────────────────────┴─────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         APIS ENVOLVIDAS                               │
└──────────────────────────────────────────────────────────────────────┘

1. POST /api/tracking/register
   - WooCommerce chama quando código é cadastrado
   - Salva tracking code + email + pedido

2. GET  /api/tracking/:code
   - Consulta status atual
   - Usa Rastreador.dev

3. Cron: /api/tracking/check-all
   - Roda 1x por dia
   - Verifica todos os pedidos pendentes
   - Compara status com anterior
   - Se mudou → email Brevo

4. POST /api/tracking/webhook
   - Backup: se WooCommerce tiver webhook nativo

┌──────────────────────────────────────────────────────────────────────┐
│                         ESTRUTURA DE DADOS                            │
└──────────────────────────────────────────────────────────────────────┘

/data/tracking.json
{
  "orders": {
    "1234": {
      "order_id": 1234,
      "tracking_code": "PU123456789BR",
      "carrier": "correios",
      "customer_email": "cliente@email.com",
      "customer_name": "Maria Silva",
      "wc_order_url": "https://wp.jaleca.com.br/wp-admin/order/1234",
      "created_at": "2026-04-05T10:00:00Z",
      "last_check": "2026-04-05T10:00:00Z",
      "current_status": "shipped",
      "status_history": [
        { "status": "shipped", "date": "2026-04-05T10:00:00Z", "description": "Objeto postado" }
      ],
      "notified": {
        "shipped": true,
        "in_transit": false,
        "out_for_delivery": false,
        "delivered": false,
        "failed": false
      }
    }
  }
}
```

---

## 5. Fluxo de Trabalho

### 5.1 Dono da loja envia pedido

```
1. Fatura o pedido no WooCommerce (muda status para "Completed")
2. Adiciona código de rastreio no campo do plugin
3. Cliente recebe email automático "Seu pedido foi enviado!"
4. Sistema começa a monitorar
```

### 5.2 Sistema monitora automaticamente

```
A cada 24h (cron job Vercel):
1. Busca todos os pedidos com tracking code pendente
2. Consulta status na API (Rastreador.dev / Jadlog / Braspress)
3. Compara com último status salvo
4. Se mudou:
   - Atualiza histórico local
   - Dispara email Brevo para cliente
   - Marca como notificado
```

### 5.3 Cliente recebe atualizações

```
Email 1: "Seu pedido foi enviado!" ✅ (quando cadastrado)
Email 2: "Objeto em trânsito"     📦 (quando muda status)
Email 3: "Saiu para entrega"       🚚 (quando sai pra entrega)
Email 4: "Pedido entregue!"         🏠 (quando delivered)
Email 5: "Tentativa de entrega"    ⚠️ (se falhar)
```

---

## 6. Layout dos Emails (Brevo)

Todos os emails seguem o padrão Jaleca:

```
┌────────────────────────────────────────┐
│           [JALECA]                     │
│                                        │
│   📦 Seu pedido está a caminho!        │
│                                        │
│   Código: PU123456789BR                │
│   Transportadora: Correios             │
│                                        │
│   ─────────────────────────────        │
│   Histórico:                          │
│   ✅ 05/04 - Objeto postado           │
│   📦 06/04 - Em trânsito              │
│   🚚 07/04 - Saiu para entrega        │
│   ─────────────────────────────        │
│                                        │
│   [Ver rastreio no site]              │
│                                        │
│   Qualquer dúvida:                    │
│   WhatsApp: (31) 3367-2467           │
│   Email: contato@jaleca.com.br       │
└────────────────────────────────────────┘
```

---

## 7. APIs a Implementar

### 7.1 /api/tracking/register (POST)

**Quando:** Quando código é cadastrado no WooCommerce

**Body:**
```json
{
  "order_id": 1234,
  "tracking_code": "PU123456789BR",
  "carrier": "correios",
  "customer_email": "cliente@email.com",
  "customer_name": "Maria Silva"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rastreamento registrado"
}
```

### 7.2 /api/tracking/track/:code (GET)

**Quando:** Para consultar status manualmente ou via cron

**Response:**
```json
{
  "code": "PU123456789BR",
  "carrier": "correios",
  "status": "in_transit",
  "description": "Objeto em trânsito",
  "last_update": "2026-04-06T14:00:00Z"
}
```

### 7.3 /api/tracking/check-all (GET - cron)

**Quando:** Chamado pelo Vercel Cron (1x por dia)

**Response:**
```json
{
  "checked": 5,
  "updated": 2,
  "notifications_sent": 2
}
```

---

## 8. Cronograma

| Fase | Descrição | Prioridade | Estimativa |
|------|-----------|------------|------------|
| **Fase 1** | API Rastreador.dev (correios, jadlog, braspress) | ALTA | 2-3h |
| **Fase 2** | Endpoint /register e /track | ALTA | 1h |
| **Fase 3** | Emails Brevo (shipped, in_transit, delivered) | ALTA | 2h |
| **Fase 4** | Cron job diario (check-all) | MÉDIA | 1h |
| **Fase 5** | Plugin WooCommerce (cadastro tracking code) | MÉDIA | 1h |
| **Fase 6** | Testes + ajustes | ALTA | 2h |

**Total:** ~8-10 horas

---

## 9. Pré-requisitos

### 9.1 Credenciais necessárias

- [ ] **Rastreador.dev API Key** (gratuito em rastreador.dev)
- [ ] **Jadlog API** (gratuito em jadlog.com.br)
- [ ] **Braspress API** (gratuito em braspress.com.br)
- [ ] **Brevo API Key** ✅ Já configurado

### 9.2 Plugin WooCommerce

Instalar um dos plugins para cadastrar tracking code:

**Opção 1:** "Tracking Number for WooCommerce" (gratuito)
**Opção 2:** "WooCommerce ShipStation" (pago)

### 9.3 Vercel Cron

Configurar no `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/tracking/check-all",
    "schedule": "0 9 * * *"
  }]
}
```

---

## 10. Tackling Matrix

| # | Tarefa | Responsável | Status | Dependência |
|---|--------|-------------|--------|-------------|
| 1 | Integrar Rastreador.dev API | Dev | 🔴 Pendente | Credencial |
| 2 | Integrar Jadlog API | Dev | 🔴 Pendente | Credencial |
| 3 | Integrar Braspress API | Dev | 🔴 Pendente | Credencial |
| 4 | Criar endpoint /register | Dev | 🔴 Pendente | - |
| 5 | Criar endpoint /track | Dev | 🔴 Pendente | #1, #2, #3 |
| 6 | Criar emails Brevo (tracking) | Dev | 🔴 Pendente | - |
| 7 | Implementar cron check-all | Dev | 🔴 Pendente | #4, #5, #6 |
| 8 | Configurar plugin WooCommerce | Dono | 🟡 Pendente | - |
| 9 | Testes end-to-end | Dev + Dono | 🔴 Pendente | Tudo acima |

---

## 11. Custo Operacional

| Serviço | Custo Mensal | Observação |
|---------|--------------|------------|
| Rastreador.dev | R$ 0 (free tier) | 100 req/dia (~3.000/mês) |
| Jadlog API | R$ 0 | Gratuito |
| Braspress API | R$ 0 | Gratuito |
| Brevo | R$ 0 (já pago) | Usado para envios |
| Vercel | R$ 0 (free tier) | Cron job incluso |
| Plugin WooCommerce | R$ 0 | Gratuito |

**Total:** R$ 0/mês

---

## 12. FAQ

**P: E se o Rastreador.dev sair do ar?**
R: Sistema tenta todas as APIs (Jadlog, Braspress) diretamente. Se todas falharem, marca como "erro" e não notifica cliente.

**P: E se o código de rastreio for inválido?**
R: API retorna erro. Sistema tenta novamente no próximo ciclo (24h). Não envia email até ter status válido.

**P: Cliente pode rastrear por conta própria?**
R: A ideia é notificar automaticamente. Mas podemos adicionar uma página "/rastrear" no site futuramente.

**P: E se o pedido for recusado ou voltar?**
R: Email específico: "Pedido não entregue — favor entrar em contato"

---

## 13. Status Atual

🔴 **AGUARDANDO INÍCIO**

**Pendências antes de começar:**
1. [ ] Solicitar credenciais Rastreador.dev
2. [ ] Solicitar credenciais Jadlog (se necessário)
3. [ ] Solicitar credenciais Braspress (se necessário)
4. [ ] Instalar plugin WooCommerce de rastreio

---

_Documento criado em 04/04/2026 para o Projeto Jaleca_

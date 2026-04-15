# 📄 PRD: PROTOCOLO DE OTIMIZAÇÃO DE PERFORMANCE - JALECA.COM.BR

**Criado:** 15/04/2026  
**Fonte:** Gemini SEO Expert (análise com dados reais Meta + Google Ads + GSC)  
**Status:** Ativo — implementar gradualmente  

---

## CONTEXTO

Gestão de tráfego pago e SEO para e-commerce de moda branca/saúde.  
**Estado atual:** Tracking GA4 (Purchase) corrigido em 15/04/2026. Histórico de 30 dias com ROAS negativo (0,68x) devido a falhas de rastreio e má alocação de verba.

**Correção técnica feita:**
- `send_to: 'AW-18072506944'` sem label removido (era código morto)
- 3 camadas de rastreamento implementadas em `components/Analytics.tsx`:
  1. GA4 `purchase` → importação Google Ads
  2. GA4 `manual_event_PURCHASE` → importação Google Ads  
  3. `conversion_event_purchase` → Google Ads direto (independente de GA4)

---

## 1. KPIs E VARIÁVEIS DE DECISÃO

| Métrica | Valor |
|---------|-------|
| Ticket Médio (AOV) | R$ 300,00 |
| ROAS Break-even | 2,0x |
| ROAS Alvo | > 3,0x |
| CPA Máximo | R$ 100,00 |
| Janela de Atribuição | 7 dias clique / 1 dia visualização |

---

## 2. GOOGLE ADS — DIRETRIZES

Com rastreio ativo, objetivo: capturar demanda qualificada que o SEO ainda não alcança.

- **Ação 01 — Monitoramento:** Analisar Search + Shopping nas próximas 72h após correção do tracking
- **Ação 02 — Mudança de lance:** Ao atingir >15 conversões nos últimos 30 dias → migrar de "Maximizar Cliques" para "Maximizar Conversões" ou tROAS 300%
- **Ação 03 — Filtro de termos:** Negativar termos informativos/curiosidade. Focar em termos transacionais: "comprar jaleco feminino", "jaleco luxo preço"

**Campanhas ativas:**
- Search "Jaleca - Search - Jalecos": R$70/dia
- Shopping "Jaleca - Shopping - Produtos": R$30/dia

---

## 3. META ADS — DIRETRIZES

Objetivo: parar de "comprar tráfego" e passar a "comprar vendas".

- **Ação 01 — Pausar Awareness (IMEDIATO):** ROAS 0,83x é proibitivo. Campanha "Awareness - Público Frio" deve ser pausada
- **Ação 02 — Reativar Remarketing:** Campanha "Remarketing - Carrinho Abandonado" (ROAS 4,9x) — reativar com R$20/dia + limite de frequência ≤ 3x/semana. Público: visitantes 30d / carrinho 14d
- **Ação 03 — Nova campanha Público Frio:** Objetivo Vendas/Conversão via Advantage+ Shopping ou interesse "Medicina/Saúde". Criativos: produto em uso, destaque R$300 (percepção de valor/luxo)

---

## 4. SEO — DIRETRIZES

Objetivo: diversificar tráfego além da Homepage (atualmente 79% dos cliques).

- **Ação 01 — Ranqueamento "Jalecos":** Termo genérico na posição 36,6 — prioridade máxima de otimização
- **Ação 02 — Link Building Interno:** Inserir links nas descrições de produtos e posts do blog apontando para categorias "Jaleco Feminino" e "Scrubs" com esses termos como âncora

---

## 5. GUARDRAILS — ALERTAS AUTOMÁTICOS

Disparar alerta se:

1. **Erro de rastreio:** Venda no backend mas GA4/Google Ads reporta 0 vendas por mais de 24h
2. **CPA crítico:** Custo por venda > R$150 (50% do ticket médio) em janela de 7 dias
3. **Fadiga de remarketing:** Frequência Meta Ads > 8,0

---

## ESTADO DAS AÇÕES (atualizar conforme execução)

| Ação | Status | Data |
|------|--------|------|
| Correção tag Google Ads | ✅ FEITO | 15/04/2026 |
| Pedido de teste para validar conversão | ✅ FEITO | 15/04/2026 |
| Verificar conversão no Google Ads | ⏳ Pendente | 16/04/2026 |
| Pausar Awareness Meta | ⏳ Pendente | — |
| Reativar Remarketing Meta | ⏳ Pendente | — |
| Criar campanha Vendas público frio | ⏳ Pendente | — |
| Atingir 15 conv. → mudar lance Google | ⏳ Pendente | — |

# 🎯 Recomendação Final — Estratégia Google Ads Jaleca
**Data:** 24/04/2026  
**Análise:** Claude + Gemini SEO + GPT-4.1 (Party Mode)

---

## ⚠️ CRÍTICO — AÇÃO IMEDIATA

### 1. CORRIGIR TAG DE CONVERSÃO (HOJE)
**Problema:** GA4 vê 8 compras, Google Ads vê 0 conversões.

**Solução:**
```typescript
// Analytics.tsx linha 94-99
window.gtag?.('event', 'conversion', {
  send_to: 'AW-18072506944/LABEL_DA_CONVERSAO', // ← Buscar no Google Ads
  transaction_id: orderId,
  value,
  currency: 'BRL',
})
```

**Como obter o Label:**
1. Google Ads → Metas → Conversões
2. Copiar `AW-18072506944/XXXXXXXXX` completo
3. Substituir no código
4. Deploy + teste com compra real

**Prioridade:** MÁXIMA  
**Bloqueio:** Toda otimização depende disso

---

## 💰 RESPOSTA À PERGUNTA PRINCIPAL

### Investir em palavras ALTAS ou BAIXAS?

**🎯 RESPOSTA: LONG-TAIL (palavras baixas)**

### Justificativa (consenso Gemini + GPT-4.1):

| Critério | Alto Volume (CPC R$2-4) | Long-Tail (CPC R$0.80-1.20) | Vencedor |
|----------|-------------------------|----------------------------|----------|
| **Budget R$150-200/dia** | 50-75 cliques/dia | 125-200 cliques/dia | 🟢 Long-tail |
| **Intenção de compra** | Genérica ("jaleco feminino") | Específica ("jaleco rosa estetica") | 🟢 Long-tail |
| **Competição** | Alta (grandes players) | Baixa (nichos descobertos) | 🟢 Long-tail |
| **Risco sem tracking** | Alto (R$100/dia sem saber retorno) | Baixo (R$30/dia por teste) | 🟢 Long-tail |
| **Dados em 30 dias** | ~1.500 cliques | ~3.000 cliques | 🟢 Long-tail |

**Projeção GPT-4.1:**  
R$100/dia em long-tail (CPC R$1) = **3.000 cliques/mês** → **~63 conversões** (CVR 2.1%)

---

## 🚀 TOP 5 KEYWORDS PARA COMEÇAR HOJE

### Consenso Gemini SEO:

1. **`[jaleco feminino personalizado com nome]`** (Exata)
   - CPC: R$0.80-1.20
   - Por que: Super específica, alto valor agregado, Jaleca tem esse produto

2. **`+comprar +jaleco +online`** (Frase)
   - CPC: R$1-2
   - Por que: Intenção de compra direta, "online" = e-commerce

3. **`[jaleco universitário feminino]`** (Exata)
   - CPC: R$0.80-1
   - Por que: Segmento claro, primeira compra = fidelização

4. **`[jaleco rosa feminino para estetica]`** (Exata)
   - CPC: R$1-1.50
   - Por que: Combina cor + gênero + profissão = altíssima intenção

5. **`+jaleco +com +zíper +feminino +barato`** (Frase)
   - CPC: R$0.80-1
   - Por que: Estilo + preço-consciente = final da jornada

**Budget sugerido:** R$7-10/dia por keyword = **R$35-50/dia total** (Phase 1)

---

## 🚫 EVITAR COMPLETAMENTE (por enquanto)

❌ **`jaleco feminino`** — CPC R$2-4, genérico demais  
❌ **`jaleco para dentista`** — CPC R$2-4, amplo  
❌ **`jaleco para médico`** — CPC R$2-4, drena budget

**Nota sobre `jaleco farmaceutico`:**  
Jaleca já é #9 orgânico → NÃO investir em Ads (aproveite o grátis)

---

## 📊 ESTRUTURA DOS PRIMEIROS 30 DIAS

### Phase 1: Teste e Dados (Dias 1-14)

**Budget:** R$150/dia  
**Split:** 70% Search (R$105) + 30% Shopping (R$45)

**Campanhas Search:**
1. **Jalecos Personalizados** (R$35/dia)
   - Keywords: personalizado com nome, jaleco com nome bordado
   
2. **Jalecos por Profissão** (R$35/dia)
   - Keywords: jaleco rosa estetica, jaleco universitário, jaleco fonoaudióloga
   
3. **Compra Online** (R$35/dia)
   - Keywords: comprar jaleco online, jaleco feminino sp comprar

**Lances:** Maximizar Cliques (CPC máx R$1.50)

**Meta:** Coletar 1.500+ cliques, identificar CTR > 3%

### Phase 2: Otimização (Dias 15-30)

**Ação:**
- Pausar keywords CTR < 2%
- Aumentar budget nas CTR > 5%
- Adicionar 5-7 long-tails novas da lista de 55
- Mudar para "Maximizar Conversões" (se tag corrigida)

**Budget:** R$180-200/dia (escalado 20%)

---

## 🎯 SPLIT RECOMENDADO (GPT-4.1)

### Budget R$150-200/dia:

| Canal | % | Valor/dia | Por que |
|-------|---|-----------|---------|
| **Search Long-tail** | 60-70% | R$90-140 | Intenção alta, CPC baixo, dados rápidos |
| **Shopping** | 30-40% | R$45-80 | Visual, genérico, cross-sell |

**Ajustar após 30 dias:** Se Shopping ROAS > Search, inverter proporção

---

## 📈 PROJEÇÕES 30 DIAS (GPT-4.1)

### Cenário Conservador:
- Budget: R$150/dia × 30 = R$4.500
- CPC médio: R$1.20
- Cliques: 3.750
- CVR: 2.1% (base WooCommerce)
- **Conversões: ~79 pedidos**
- Ticket: R$266
- **Receita: R$21.014**
- **ROAS: 4.67x**

### Cenário Otimista (long-tail converte melhor):
- CVR: 3.5%
- **Conversões: 131 pedidos**
- **Receita: R$34.846**
- **ROAS: 7.74x**

---

## ✅ CHECKLIST DE AÇÃO

### Hoje:
- [ ] Corrigir `send_to` com Label da conversão
- [ ] Criar 3 campanhas Search (estrutura acima)
- [ ] Adicionar Top 5 keywords (exata/frase)
- [ ] Negativar: "jaleco feminino", "jaleco médico", "jaleco dentista"
- [ ] Budget R$150/dia (R$105 Search, R$45 Shopping)

### Semana 1:
- [ ] Testar tag com compra real
- [ ] Monitorar CTR diário (meta > 3%)
- [ ] Adicionar 5-7 long-tails da lista

### Semana 2:
- [ ] Pausar keywords CTR < 2%
- [ ] Escalar budget nas CTR > 5%
- [ ] Relatório: CPC real vs projeção

### Dia 30:
- [ ] Análise completa: ROAS, CVR, termos de pesquisa
- [ ] Decisão: manter/escalar/pivotar
- [ ] Se ROAS > 4x → escalar para R$300/dia

---

## 🧠 INSIGHTS DOS AGENTES

### Gemini SEO:
> "Long-tail indica intenção de compra madura. 'jaleco feminino personalizado com nome' está a 1 clique da conversão."

### GPT-4.1:
> "CPC R$0.66 atual é oportunidade SE cliques forem qualificados. Após corrigir tag, audite termos de pesquisa."

### Claude:
> "Meta Ads ROAS 2.45x é sua prova de conceito. Google Ads deve replicar — mas só com tracking correto."

---

## 🔄 PRÓXIMOS PASSOS

1. **Implementar correção da tag** (prioridade máxima)
2. **Criar campanhas Search** com Top 5 keywords
3. **Monitorar 7 dias** (CTR, termos de pesquisa, qualidade)
4. **Ajustar Phase 2** baseado em dados reais
5. **Relatório dia 30** → decisão de escala

---

**Preparado por:** Claude (código) + Gemini SEO (estratégia) + GPT-4.1 (dados)  
**Para:** Jaleca — Google Ads Budget R$150-200/dia  
**Objetivo:** Maximizar conversões com long-tail, CPC < R$1.50

# DIA 1 — EXECUTAR CORTES (1h30)

⚠️ **CRÍTICO**: Só execute APÓS fazer o backup (screenshots salvos)

---

## GOOGLE ADS — Cortar R$ 55/dia

### 1. Acessar Google Ads
https://ads.google.com/aw/campaigns?ocid=607786298

---

### CORTE #1: PAUSAR "Core - Jalecos"

**Motivo**: 0 conversões rastreadas em 30 dias = queimando R$ 70/dia

**Ação**:
1. [ ] Encontrar campanha "Core - Jalecos" (ou nome similar com "Search" ou "Pesquisa")
2. [ ] Clicar no checkbox da campanha
3. [ ] Clicar em "Editar" → "Pausar"
4. [ ] Confirmar

**Economia**: R$ 70/dia = R$ 2.100/mês

---

### CORTE #2: REDUZIR "Shopping - Produtos"

**Motivo**: Sem Google Merchant Center ativo, competição brutal

**Ação**:
1. [ ] Encontrar campanha "Shopping" (ou "Jaleca - Shopping - Produtos")
2. [ ] Clicar no nome da campanha (abrir detalhes)
3. [ ] Ir em "Configurações"
4. [ ] Procurar "Orçamento"
5. [ ] Trocar de **R$ 30/dia** para **R$ 15/dia**
6. [ ] Salvar

**Economia**: R$ 15/dia = R$ 450/mês

---

### CORTE #3: PAUSAR "Remarketing Display"

**Motivo**: Campanha criada sem criativo (anúncio vazio, desperdiça budget)

**Ação**:
1. [ ] Encontrar campanha com "Display" ou "Rede de Display" no nome
2. [ ] Checkbox → Editar → Pausar
3. [ ] Confirmar

**Se não encontrar campanha Display**: pular (pode já estar pausada)

**Economia**: R$ 15/dia = R$ 450/mês (se existir)

---

### CORTE #4: MANTER "Marca"

**Ação**: **NÃO MEXER**

Campanha de marca (defesa do nome "Jaleca") deve continuar ativa.  
Budget: R$ 5/dia (baixo, mas necessário)

---

### OPCIONAL: CRIAR "Remarketing Search" (R$ 10/dia)

**Se tiver tempo**:
1. [ ] Criar nova campanha Search
2. [ ] Nome: "Remarketing Search - Jaleca"
3. [ ] Tipo: Pesquisa
4. [ ] Budget: R$ 10/dia
5. [ ] Público: visitantes últimos 30 dias (requer lista criada)
6. [ ] Keywords:
   - [jaleco] (exata)
   - [jaleca] (exata)
   - "jaleco feminino" (frase)

**Obs**: Se não conseguir criar a lista de remarketing agora, pular.  
Criar na semana que vem não faz diferença.

---

### ✅ VALIDAÇÃO GOOGLE ADS

Após os cortes, conferir:

**Budget total/dia (soma de todas as campanhas ATIVAS):**
- **Antes**: ~R$ 85/dia
- **Depois**: R$ 30/dia (R$ 15 Shopping + R$ 5 Marca + R$ 10 Remarketing se criou)

Anotar em `backups/google-ads-2026-04-23/NUMEROS-DEPOIS.txt`:

```
GOOGLE ADS - DEPOIS DOS CORTES (23/04):

Core - Jalecos: PAUSADA ✅
Shopping: R$ 15/dia ✅
Remarketing Display: PAUSADA ✅
Marca: R$ 5/dia (mantida) ✅
Remarketing Search: R$ 10/dia (criada) ✅

TOTAL BUDGET/DIA: R$ 30 (era R$ 85)
ECONOMIA: R$ 55/dia = R$ 1.650/mês
```

---

## META ADS — Cortar R$ 40/dia

### 1. Acessar Meta Ads Manager
https://business.facebook.com/adsmanager/manage/campaigns?act=2098470580937214

---

### CORTE #1: PAUSAR "Prospecção - Lookalike Vídeo"

**Motivo**: Campanha criada mas sem criativo de vídeo (não tem anúncio)

**Ação**:
1. [ ] Vista "Campanhas"
2. [ ] Encontrar campanha com "Lookalike" e "Vídeo" no nome
3. [ ] Clicar no switch (botão verde/cinza) para **DESATIVAR**
4. [ ] Se pedir confirmação, confirmar

---

### CORTE #2: PAUSAR "Prospecção - Saúde e Beleza Vídeo"

**Motivo**: Sem criativo de vídeo

**Ação**:
1. [ ] Encontrar campanha "Saúde e Beleza" com "Vídeo"
2. [ ] Desativar (switch para OFF/cinza)

---

### CORTE #3: PAUSAR "Novas Páginas"

**Motivo**: Teste rodando sem acompanhamento = desperdício

**Ação**:
1. [ ] Encontrar campanha "Novas Páginas" ou similar
2. [ ] Desativar

---

### CORTE #4: REDUZIR "Remarketing - Carrinho"

**Motivo**: ROAS 3.26x é bom, mas otimizar antes de escalar

**Ação**:
1. [ ] Encontrar "Remarketing - Carrinho Abandonado" (nome pode variar)
2. [ ] Clicar no nome (abrir detalhes da campanha)
3. [ ] Clicar no **Ad Set** (conjunto de anúncios)
4. [ ] Ir em "Orçamento e programação"
5. [ ] Trocar de **R$ 100/dia** para **R$ 70/dia**
6. [ ] Publicar alterações

**Economia**: R$ 30/dia = R$ 900/mês

---

### CORTE #5: MANTER "Remarketing Dinâmico"

**Ação**: **NÃO MEXER**

Campanha de catálogo dinâmico deve continuar.  
Budget estimado: R$ 10/dia

---

### ✅ VALIDAÇÃO META ADS

Após os cortes, conferir:

**Budget total/dia:**
- **Antes**: ~R$ 120/dia
- **Depois**: R$ 80/dia (R$ 70 Remarketing Carrinho + R$ 10 Dinâmico)

Anotar em `backups/meta-ads-2026-04-23/NUMEROS-DEPOIS.txt`:

```
META ADS - DEPOIS DOS CORTES (23/04):

Remarketing - Carrinho: R$ 70/dia (era R$ 100) ✅
Prospecção Lookalike Vídeo: PAUSADA ✅
Prospecção Saúde Vídeo: PAUSADA ✅
Novas Páginas: PAUSADA ✅
Remarketing Dinâmico: R$ 10/dia (mantido) ✅

TOTAL BUDGET/DIA: R$ 80 (era R$ 120)
ECONOMIA: R$ 40/dia = R$ 1.200/mês
```

---

## ✅ VALIDAÇÃO FINAL DIA 1

### Resumo Total:

```
ANTES:
Google Ads: R$ 85/dia
Meta Ads: R$ 120/dia
TOTAL: R$ 205/dia (R$ 6.150/mês)

DEPOIS:
Google Ads: R$ 30/dia
Meta Ads: R$ 80/dia
TOTAL: R$ 110/dia (R$ 3.300/mês)

ECONOMIA: R$ 95/dia = R$ 2.850/mês (-46%)
```

### Proteções (canais rentáveis mantidos):

✅ Meta Remarketing mantido (ROAS 3.26x)  
✅ Google Marca mantido (defesa)  
✅ Meta Dinâmico mantido (catálogo)

### Pausados (sangrias):

❌ Google Core Search (ROAS 0, sem rastreamento)  
❌ Google Display (sem criativo)  
❌ Meta Lookalike Vídeo (sem criativo)  
❌ Meta Saúde Vídeo (sem criativo)  
❌ Meta Novas Páginas (teste sem controle)

---

## 🎯 PRÓXIMOS PASSOS

### Hoje à noite:
- [ ] Não fazer mais nada
- [ ] Deixar estabilizar
- [ ] Dormir tranquilo (você acabou de economizar R$ 2.850/mês)

### Amanhã (Dia 2 - 24/04):
- [ ] Conferir se vendas continuaram normais
- [ ] Começar Dia 2: rastreamento Google Ads

---

## ⚠️ SE ALGO DER ERRADO

**Vendas caíram drasticamente?**  
→ Reativar campanhas pausadas (reverter mudanças)

**ROAS piorou muito?**  
→ Normal nos primeiros 2-3 dias (reajuste de algoritmo)  
→ Aguardar 7 dias antes de reverter

**Dúvidas?**  
→ Conferir `PLANO-EXECUCAO-URGENTE-2026.md`  
→ Ou WhatsApp suporte: *[seu número]*

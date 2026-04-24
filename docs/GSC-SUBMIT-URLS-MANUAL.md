# Google Search Console - Submissão Manual de URLs

## ⚠️ Importante

A Google Indexing API foi desativada em 2019 para URLs normais. **Não há mais API pública para submeter URLs**.

As únicas formas são:
1. ✅ **Sitemap** (já temos ativo em jaleca.com.br/sitemap.xml)
2. 📝 **Submissão manual** via Search Console UI

---

## 📋 30 URLs Prioritárias para Submeter

### 10 Cidades Top

```
https://jaleca.com.br/cidade/sao-paulo
https://jaleca.com.br/cidade/rio-de-janeiro
https://jaleca.com.br/cidade/belo-horizonte
https://jaleca.com.br/cidade/brasilia
https://jaleca.com.br/cidade/salvador
https://jaleca.com.br/cidade/fortaleza
https://jaleca.com.br/cidade/curitiba
https://jaleca.com.br/cidade/recife
https://jaleca.com.br/cidade/porto-alegre
https://jaleca.com.br/cidade/goiania
```

### 10 Cidades MG

```
https://jaleca.com.br/cidade/juiz-de-fora
https://jaleca.com.br/cidade/uberlandia
https://jaleca.com.br/cidade/betim
https://jaleca.com.br/cidade/montes-claros
https://jaleca.com.br/cidade/ribeirao-das-neves
https://jaleca.com.br/cidade/uberaba
https://jaleca.com.br/cidade/governador-valadares
https://jaleca.com.br/cidade/sete-lagoas
https://jaleca.com.br/cidade/divinopolis
https://jaleca.com.br/cidade/ipatinga
```

### 10 Hubs Profissão

```
https://jaleca.com.br/jaleco-para-dentista
https://jaleca.com.br/jaleco-para-medico
https://jaleca.com.br/jaleco-para-enfermeiro
https://jaleca.com.br/jaleco-para-veterinario
https://jaleca.com.br/jaleco-para-nutricionista
https://jaleca.com.br/jaleco-para-fisioterapeuta
https://jaleca.com.br/jaleco-para-biomedico
https://jaleca.com.br/jaleco-para-podologo
https://jaleca.com.br/jaleco-para-farmaceutico
https://jaleca.com.br/jaleco-para-esteticista
```

---

## 🔧 Como Submeter (Passo a Passo)

### Método 1: Inspeção de URL (Recomendado)

1. Acesse: https://search.google.com/search-console
2. Selecione propriedade: **jaleca.com.br**
3. No menu lateral esquerdo: **Inspeção de URL**
4. Cole uma URL da lista acima
5. Clique **Enter**
6. Aguarde análise (10-30s)
7. Clique **Solicitar indexação**
8. Aguarde confirmação (~1min)
9. Repetir para as próximas URLs

**Tempo estimado:** 1-2min por URL = **30-60min total**

---

### Método 2: Bulk via Sitemap (Automático)

✅ **Já está ativo!** Todas as URLs já estão no sitemap:
- https://jaleca.com.br/sitemap.xml

O Google rastreia automaticamente, mas pode demorar **7-30 dias**.

Para forçar re-rastreamento do sitemap:
1. Search Console → **Sitemaps**
2. Ver sitemap: `sitemap.xml`
3. Google já rastreia automaticamente

**Não é possível "forçar" re-rastreamento de sitemap.**

---

## 📊 Status de Indexação

Para verificar se uma URL já está indexada:

1. Search Console → **Inspeção de URL**
2. Cole a URL
3. Veja status:
   - ✅ **"URL está no Google"** → Indexada
   - ⏳ **"URL is known to Google"** → Conhecida mas não indexada
   - ❌ **"URL is not on Google"** → Não conhecida

---

## ⚡ Dicas para Acelerar Indexação

1. **Priorize por importância:**
   - Primeiro: Hubs profissão (alto volume de busca)
   - Segundo: Cidades top (São Paulo, Rio, BH)
   - Terceiro: Cidades MG

2. **Não submeta todas de uma vez:**
   - Google pode marcar como spam
   - Limite: 10 URLs por dia

3. **Verifique antes de submeter:**
   - Se já está indexada, não precisa submeter novamente

4. **Monitore após 48h:**
   - Search Console → Coverage → Ver URLs submetidas

---

## 📅 Cronograma Sugerido

| Dia | Quantidade | Categoria |
|-----|------------|-----------|
| **Dia 1** | 10 URLs | Hubs Profissão |
| **Dia 2** | 10 URLs | Cidades Top (SP, RJ, BH, etc) |
| **Dia 3** | 10 URLs | Cidades MG |

**Total:** 3 dias (~20-30min/dia)

---

## ❓ FAQ

**Q: Por que não usar API?**
A: Google desativou a Indexing API para URLs normais em 2019. Só funciona para JobPosting e BroadcastEvent.

**Q: O sitemap não é suficiente?**
A: É, mas pode demorar semanas. Submissão manual acelera para 24-48h.

**Q: Posso automatizar?**
A: Não. Google bloqueou todas as formas de automação para evitar spam.

**Q: Quanto tempo demora?**
A: URLs submetidas manualmente geralmente aparecem em 24-48h.

---

**Criado em:** 24/04/2026  
**Motivo:** Google Indexing API descontinuada

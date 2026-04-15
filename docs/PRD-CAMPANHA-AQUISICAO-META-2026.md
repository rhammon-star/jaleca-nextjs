# PRD: Campanha Aquisição Público Frio — Meta Ads

**Criado:** 15/04/2026  
**Fonte:** Gemini SEO Expert  
**Status:** ⏳ Aguardando criativos  

---

## Estrutura da Campanha

**Nome:** `[CONV] - Aquisição - Público Frio`  
**Objetivo:** Vendas / Conversões (evento Compra)  
**Tipo:** Campanha Manual ABO (teste de criativo)  
**Conta:** `act_2098470580937214`  

---

## Ad Set — Profissionais de Saúde

- **Idade:** 24–50 anos
- **Interesses:** Odontologia, Medicina, Estética, Harmonização Facial, Biomedicina
- **Exclusões:** remarketing (visitantes 30d) + compradores passados
- **Orçamento:** verba do Awareness pausado (~R$258/mês disponível)

---

## Criativos (criar os dois e deixar o algoritmo decidir)

### 🏆 Ad 1 — Vídeo Reels (9:16) — PRIORIDADE MÁXIMA

Para vestuário premium e público frio, vídeo é o campeão:
- **Mostra caimento e movimento** — foto não consegue
- **Gera identificação** — profissional real usando com estilo
- **Algoritmo prioriza vídeo** — maior retenção na plataforma

**Roteiro:**
| Tempo | Conteúdo |
|-------|----------|
| 0–3s | **Gancho:** "Cansada de jalecos sem estilo e desconfortáveis?" |
| 3–10s | **Produto:** detalhes do tecido, elástico no punho, gola padre, profissional se movendo |
| 10–15s | **CTA:** "Garanta seu Jaleca Premium no site" |

---

### 🥈 Ad 2 — Carrossel (1:1) — ALTERNATIVA SE NÃO TIVER VÍDEO

| Card | Conteúdo |
|------|----------|
| 1 | Profissional sorridente + jaleco impecável + título impactante |
| 2 | Close-up do tecido: "Tecido Premium que não amassa" |
| 3 | Costas ou punho: "Conforto e liberdade de movimentos" |
| 4 | Variação de cor ou modelo diferente |
| 5 | Logo Jaleca + "Clique para comprar no site" |

> ⚠️ Evitar foto única estática para público frio — funciona melhor no remarketing

---

## Guardrails Automáticos

| Condição | Ação |
|----------|------|
| Ad Set gasta > R$120 com 0 compras | Pausar Ad Set |
| > 3 compras em 7 dias mas ROAS < 1,5x | Reduzir orçamento 20% |
| ROAS > 3,0x por 3 dias consecutivos | Escalar orçamento +15%/24h |

---

## Checklist para criar via API

- [ ] Receber vídeo Reels (9:16) ou fotos do carrossel do Rhammon
- [ ] Criar campanha via Meta API
- [ ] Criar ad set com segmentação e exclusões
- [ ] Criar os 2 anúncios (vídeo + carrossel)
- [ ] Ativar e monitorar primeiras 48h

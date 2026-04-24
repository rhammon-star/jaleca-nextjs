# DIA 1 — BACKUP MANUAL (30min)

As credenciais estão no Vercel (não localmente). Vamos fazer backup manual via screenshots.

## GOOGLE ADS

### 1. Abrir Google Ads Manager
https://ads.google.com/aw/campaigns?ocid=607786298

### 2. Tirar screenshots

**Visão Geral (Overview)**
- [ ] Screenshot da página principal
- [ ] Mostrar: campanhas ativas, budget total, custo últimos 30 dias
- [ ] Salvar como: `backups/google-ads-2026-04-23/overview.png`

**Cada Campanha (4 campanhas)**

1. **Core - Jalecos**
   - [ ] Screenshot: nome, status, budget diário, custo 30d, conversões
   - [ ] Salvar: `core-jalecos.png`

2. **Shopping - Produtos**
   - [ ] Screenshot completo
   - [ ] Salvar: `shopping-produtos.png`

3. **Remarketing Display**
   - [ ] Screenshot completo
   - [ ] Salvar: `remarketing-display.png`

4. **Marca**
   - [ ] Screenshot completo
   - [ ] Salvar: `marca.png`

**Conversões**
- [ ] Google Ads → Ferramentas → Medição → Conversões
- [ ] Screenshot da lista de conversões
- [ ] Salvar: `conversions.png`

### 3. Anotar números

Criar arquivo `backups/google-ads-2026-04-23/NUMEROS-ANTES.txt`:

```
DATA: 23/04/2026

GOOGLE ADS - ANTES DOS CORTES:

Core - Jalecos:
  Budget: R$ ___/dia
  Status: ___
  Custo 30d: R$ ___
  Conversões 30d: ___

Shopping - Produtos:
  Budget: R$ ___/dia
  Status: ___
  Custo 30d: R$ ___

Remarketing Display:
  Budget: R$ ___/dia
  Status: ___
  Custo 30d: R$ ___

Marca:
  Budget: R$ ___/dia
  Status: ___

TOTAL GASTO/DIA (antes): R$ ___
TOTAL GASTO 30D: R$ ___
CONVERSÕES TOTAIS 30D: ___
```

---

## META ADS

### 1. Abrir Meta Ads Manager
https://business.facebook.com/adsmanager/manage/campaigns?act=2098470580937214

### 2. Tirar screenshots

**Visão Geral**
- [ ] Screenshot página Campanhas
- [ ] Mostrar: todas as campanhas, status, budget, resultados
- [ ] Salvar: `backups/meta-ads-2026-04-23/overview.png`

**Cada Campanha**

1. **Remarketing - Carrinho Abandonado**
   - [ ] Screenshot: nome, budget, ROAS, gastos
   - [ ] Salvar: `remarketing-carrinho.png`

2. **Prospecção - Lookalike Vídeo**
   - [ ] Screenshot completo
   - [ ] Salvar: `prospeccao-lookalike.png`

3. **Prospecção - Saúde e Beleza Vídeo**
   - [ ] Screenshot completo
   - [ ] Salvar: `prospeccao-saude.png`

4. **Novas Páginas**
   - [ ] Screenshot completo
   - [ ] Salvar: `novas-paginas.png`

5. **Remarketing Dinâmico**
   - [ ] Screenshot completo
   - [ ] Salvar: `remarketing-dinamico.png`

### 3. Anotar números

Criar arquivo `backups/meta-ads-2026-04-23/NUMEROS-ANTES.txt`:

```
DATA: 23/04/2026

META ADS - ANTES DOS CORTES:

Remarketing - Carrinho:
  Budget: R$ ___/dia
  Status: ___
  Gasto 30d: R$ ___
  ROAS: ___x

Prospecção - Lookalike Vídeo:
  Budget: R$ ___/dia
  Status: ___
  Gasto 30d: R$ ___

Prospecção - Saúde Vídeo:
  Budget: R$ ___/dia
  Status: ___

Novas Páginas:
  Budget: R$ ___/dia
  Status: ___

Remarketing Dinâmico:
  Budget: R$ ___/dia (estimado)
  Status: ___

TOTAL GASTO/DIA (antes): R$ ___
TOTAL GASTO 30D: R$ ___
ROAS GERAL 30D: ___x
```

---

## FEITO? ✅

Quando tiver todos os screenshots + arquivos NUMEROS-ANTES.txt:

```bash
ls -la ~/SiteJaleca/jaleca-nextjs/backups/google-ads-2026-04-23/
ls -la ~/SiteJaleca/jaleca-nextjs/backups/meta-ads-2026-04-23/
```

**Próximo passo:** Executar cortes (TARDE)

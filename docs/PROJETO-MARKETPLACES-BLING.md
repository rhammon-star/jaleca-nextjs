# Projeto: Marketplaces via Bling ERP

**Data de início:** 09/04/2026  
**Status:** Em andamento — WooCommerce conectado, Mercado Livre pendente

---

## Objetivo

Vender em múltiplos marketplaces (Mercado Livre, Shopee, Magalu, Amazon) com sincronização automática de estoque e produtos a partir do WooCommerce — sem exportar arquivos manualmente e sem cadastrar produtos duas vezes.

---

## Fluxo definido

```
Cadastra/atualiza no WooCommerce
        ↓
Bling ERP (sincroniza automaticamente)
        ↓
Mercado Livre / Shopee / Magalu / Amazon (estoque e preço automáticos)
```

**Pedidos de marketplace:** chegam no Bling (não no WooCommerce)  
**Estoque:** sincronizado em tempo real entre WooCommerce + todos os marketplaces  
**Etiquetas e NF-e:** geradas pelo Bling

---

## Ferramentas

- **Bling ERP** — plano Cobalto (já contratado)
- **Integração WooCommerce:** nativa via webhook (sem plugin externo)

---

## O que já foi feito (09/04/2026)

- [x] WooCommerce conectado ao Bling via webhook (SSL)
  - URL: `https://wp.jaleca.com.br`
  - Consumer Key + Secret gerados no WC Admin
- [x] Configurações de importação: imagens ativadas, peso em KG
- [x] Configurações de exportação: estoque ativado, imagens ativadas
- [x] Eventos ativados: Produto criado, Produto atualizado, Pedido criado, Pedido atualizado
- [x] 210 produtos importados do WooCommerce para o Bling

---

## Problemas identificados — SKUs duplicados (4 produtos, ~10 variações)

Variações com mesmo SKU do produto principal não foram importadas. Precisam de SKU único no WooCommerce.

| Produto | Variações afetadas |
|---|---|
| TESTE | Branco/G (pode deletar) |
| Jaleco Slim Princesa Laise Feminino | Marinho PP, P, M, G, GG |
| Macacão Paris Feminino | Marinho PP |
| Conjunto Executiva Feminino | Marinho Giz G, GG |

**Solução:** WooCommerce → cada produto → Variações → adicionar SKU único (ex: `princesa-marinho-PP`)

---

## Próximos passos

### ETAPA 2 — Conectar Mercado Livre
1. Bling → Preferências → Integrações → **Central de atendimento do Mercado Livre**
2. Fazer login com conta ML
3. Configurar conta vendedora

### ETAPA 3 — Publicar produtos no ML
1. No Bling → Produtos → selecionar produto → publicar no ML
2. Configurar categoria ML, atributos, frete (esta etapa é feita 1x por produto)
3. Após configuração inicial: atualizações são automáticas

### ETAPA 4 — Shopee (depois do ML estabilizar)
1. Bling → Preferências → Integrações → Shopee
2. Mesmo processo do ML

### ETAPA 5 — Magalu e Amazon (fase 3)
- Ativar após ML e Shopee rodando bem

---

## Benchmarks esperados

| Canal | Comissão ML | Ticket R$200 | Margem estimada |
|---|---|---|---|
| Mercado Livre Classic | 12% | R$24/venda | ~30% |
| Shopee | 14% | R$28/venda | ~28% |
| Magalu | 16% | R$32/venda | ~26% |

---

## Notas importantes

- Mercado Livre exige conta vendedora com CNPJ e conta bancária cadastrada
- Produtos precisam de EAN/GTIN para Amazon (pode usar código interno se não tiver)
- Fundo branco nas fotos é obrigatório no ML
- Frete: configurar Melhor Envio no Bling para gerar etiquetas automaticamente

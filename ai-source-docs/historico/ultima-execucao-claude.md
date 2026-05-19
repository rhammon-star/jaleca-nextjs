Data: 2026-05-18 (sessão dia inteiro — múltiplas frentes)

# SESSÃO PRINCIPAL — Plano "fix everything, then lock" + Mass Review

## Commits desta sessão (11 commits)
b956ad9 feat(og): variação branca og:image
69672e0 fix(tracking): cross-domain linker GA4+Ads (Shopping 0 conv fix)
5b66c89 seo+ieo(jaleco-feminino): resposta direta + Product schema + speakable
d5f6f93 seo(internal-links): /jaleco-feminino hub bidirecional
167118e seo+ux(jalecos-femininos): Opção B + categoria pra Ads
9e65544 + 955f701 tools(ads): script migração URL keywords
5a34898 seo(blog): CTR fix /melhores-tecidos-scrub-feminino
ac8077f tools(smoke): 3 guards anti-regressão (schema/sitemap/ads-lp)
32195ad + dc517b0 feat(reviews): CTA Google Places + destaque principal e-mail
c0f9d7d feat(reviews): script mass review + endpoint single
3d9729a fix(reviews): suporta pedidos antigos + marca todos pedidos do email

## Frentes concluídas
A1 GSC service account ✅
A2 PSI API key ✅ (AIzaSyA1SRRfalzpGsc7I-6sOCLsAJOkZ6aIqfo)
B1 Shopping tracking ✅ (linker.domains GA4+Ads)
B2 Lance Search Feminino ✅ — target CPA R$80 → R$120 (camp 23812704668)
B3 LP /jaleco-feminino conteúdo ✅
B4 Routing ad groups ✅
C1 Cart recovery ✅ (Brevo)
C2 KV variantes ✅
C3 Metadata 60 LPs ✅
SEO-1 LP /jaleco-feminino orgânico ✅
SEO-2a Canibalização (Opção B GPT+Gemini) ✅
SEO-2b CTR posts blog ✅
D smoke tracking + schema + sitemap + ads-lp + CI ✅
Migração Ads URL → categoria ✅ (4 keywords API + 1 ad manual)

## Frente B AggregateRating — coleta de reviews
Sistema existente auditado:
- vercel.json: cron diário 10h BRT que dispara /api/orders/review-request
- lib/email.ts:sendReviewRequest (template Brevo)
- Filtro 7-8d pós-completed, anti-duplicata via meta_data jaleca_review_request_sent

Ampliações desta sessão:
- E-mail: caixa preta dominante com botão dourado "DEIXAR MINHA AVALIAÇÃO"
  apontando para search.google.com/local/writereview?placeid=ChIJLSOL5LMBsAARDGN0kL6hzQE
- Botões por produto viraram seção secundária ("Ou avalie cada produto")
- Endpoint /api/orders/review-request-single criado (recebe orderId)
- Script scripts/mass-review-request.mjs com dry-run/--limit/--execute

Mass campaign executada hoje:
- 112 pedidos brutos (100 completed + 12 enviado)
- 104 clientes únicos após dedup por billing.email
- 35 já-enviados (skipped) — cron daily anterior + segunda passada deste script
- 69 novos e-mails enviados pra clientes únicos
- 1 falha
- Marcação multi-pedido: endpoint marca TODOS os pedidos com mesmo email como sent
  (anti-duplicata futuro com cron daily)
- Bug fix: pedidos antigos com produtos deletados (sem slug) agora recebem
  e-mail mesmo assim — só o CTA Google é mostrado (sem botões por produto)

## Bugs identificados e corrigidos
- IMMUTABLE_FIELD em ad.final_urls — script v2 só toca keywords, ad manual
- WP REST _fields=meta_data combinado com outros campos retorna meta vazio
  (script v2 delega filtro de "já enviado" ao endpoint single via /orders/{id})
- Yoast SEO meta não exposta via REST padrão → contornado via title+excerpt do
  post WP (efeito SERP equivalente)

## Resultado esperado
- Shopping começa a registrar conversões em 24-72h (linker funcionando)
- IS Rank Lost Search Feminino cai (target CPA + nova LP)
- Reviews Google Places sobem 61 → 100+ em 30d, 150+ em 60d
- CTR posts blog top-impression: 1,36% → 4-5% em 60d
- LP /jaleco-feminino + categoria capturando 2 intents (informacional+transacional)
- CI bloqueia regressões em tracking/schema/sitemap/ads-LP

## Frentes pendentes: nenhuma — backlog 100% concluído

---

# SESSÃO ANTERIOR (paralela) — Automação emails transacionais

Arquivos alterados:
- app/api/payment/webhook/route.ts — fix gate de duplicate email + chama sendInternalOrderNotification no PIX/boleto pago
- app/api/payment/create/route.ts — passa shipping.method_title para sendInternalOrderNotification
- app/api/tracking/check-all/route.ts — novo step: pedidos marcados "enviado" no WP sem rastreio ME disparam sendOrderShippedManual
- lib/melhor-envio.ts — log do status bruto do ME para diagnosticar por que in_transit/delivered não disparam
- lib/email.ts — (já tinha) shippingMethod + subjectPrefix em sendInternalOrderNotification + sendOrderShippedManual

WC webhook ativado via REST:
- id=10, order.updated → https://www.jaleca.com.br/api/orders/notify (active)
- Dispara emails automáticos para: on-hold, faturado, em-separacao, cancelled, refunded, completed

Resultado: parcial. Garantido após deploy:
- Pagamento PIX/boleto/cartão confirmado: cliente + admin recebem email com frete
- Mudança de status no WP: cliente recebe email
- Pedido marcado "enviado" no WP: cliente recebe email

Riscos: in_transit/out_for_delivery/delivered NÃO funcionam — Melhor Envio não retorna esses eventos (só "postado").

Próximo: integrar 17track ou Correios SRO + Jadlog API.

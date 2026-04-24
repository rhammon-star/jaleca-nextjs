# Resumo para o Próximo Agente — Jaleca

**Data:** 24/04/2026 09:00 BRT  
**Projeto:** Jaleca E-commerce (Next.js 16)  
**Status:** ✅ Site funcionando normalmente

---

## 🎯 CONTEXTO IMEDIATO

### **Problema Resolvido Hoje:**
Site `jaleca.com.br` estava com **redirect loop infinito** (ERR_TOO_MANY_REDIRECTS).

### **Solução Aplicada:**
- Redirect criado no **Vercel Dashboard** (não no código)
- `/` → `/home` (307 temporário)
- Configurado em: Settings → Redirects
- Site voltou ao ar e funciona 100%

### **Detalhes Técnicos:**
- Homepage real está em: `app/home/page.tsx`
- Redirect Vercel Edge intercepta ANTES do Next.js
- SEO preservado (canonical aponta para `/`)
- Sitemap OK (não precisa mudanças)

**📄 Documentação completa:** `SESSAO-REDIRECT-LOOP-24-04-2026.md`

---

## 📊 ESTADO DO PROJETO

### **Stack:**
- Next.js 16.2.0, React 19, TypeScript
- WooCommerce GraphQL + REST API
- Cielo Pagamentos (PIX + Cartão + Boleto)
- Vercel Pro hosting
- 238 páginas estáticas geradas

### **Integrações Ativas:**
- ✅ WooCommerce (produtos, pedidos, clientes)
- ✅ Cielo E-commerce 3.0 (pagamentos)
- ✅ Melhor Envio (frete PAC/SEDEX/Jadlog)
- ✅ Brevo (emails transacionais)
- ✅ Google Ads + Meta Ads (campanhas ativas)
- ✅ GA4 + Meta Pixel + CAPI
- ✅ ContentSquare (heatmaps/sessões)
- ✅ Sistema de rastreamento automático

### **URLs Importantes:**
- **Produção:** https://jaleca.com.br
- **Admin WordPress:** https://wp.jaleca.com.br/wp-admin
- **Dashboard Vercel:** https://vercel.com/jaleca/jaleca-nextjs
- **Blog Admin:** https://jaleca.com.br/blog/admin

---

## 📁 ARQUIVOS PRINCIPAIS

### **Configuração:**
- `AGENTS.md` — Documentação completa do projeto
- `next.config.ts` — Config Next.js (redirects, headers, CSP)
- `vercel.json` — Crons e build command
- `.env.production` — Variáveis de ambiente (Vercel)

### **Páginas Críticas:**
- `app/page.tsx` — Homepage "fantasma" (não renderiza)
- `app/home/page.tsx` — Homepage REAL (renderiza via redirect)
- `app/produto/[slug]/page.tsx` — Páginas de produto
- `app/checkout/` — Checkout e pagamento

### **APIs:**
- `app/api/payment/*` — Cielo integração
- `app/api/orders/*` — WooCommerce pedidos
- `app/api/shipping/*` — Melhor Envio frete
- `app/api/tracking/*` — Rastreamento automático

### **Bibliotecas:**
- `lib/graphql.ts` — WooCommerce GraphQL client
- `lib/pagarme.ts` — Cielo SDK (migrado de Pagar.me)
- `lib/melhor-envio.ts` — Frete e etiquetas
- `lib/email.ts` — Brevo emails

---

## ⚠️ PONTOS DE ATENÇÃO

### **1. Redirect Homepage (CRÍTICO)**
- **NUNCA** remover o redirect `/` → `/home` do Vercel Dashboard
- **NUNCA** deletar `app/home/page.tsx`
- Se precisar editar homepage, edite AMBOS arquivos (page.tsx e home/page.tsx)

### **2. WooCommerce GraphQL**
- API retornou 503 durante build recente
- Servidor pode estar sobrecarregado
- Fallbacks implementados em `app/produtos/page.tsx`

### **3. Variáveis de Ambiente**
- 62 variáveis configuradas no Vercel
- Backup em `.env.production.backup`
- Críticas: WC keys, Cielo merchant, Brevo API, Meta tokens

### **4. Melhor Envio**
- Token expira mensalmente
- Renovação automática via cron (`/api/melhor-envio/refresh`)
- IDs de serviço: PAC=1, SEDEX=2, Jadlog=7,8

### **5. Meta Ads Token**
- Expira: 13/06/2026
- Renovar via Graph API Explorer
- Salvo em: `META_ADS_TOKEN`

---

## 🚀 PRÓXIMAS TAREFAS SUGERIDAS

1. **Monitorar WooCommerce 503** — verificar se API continua estável
2. **Testar /test-emergency** — página de diagnóstico ainda ativa
3. **Projeto novo (jaleca-nextjs-v2)** — pode ser deletado (não usado)
4. **Limpar domínios satélite** — foram removidos do Vercel
5. **Atualizar Next.js** — quando bug da rota `/` for corrigido

---

## 📞 CONTATOS

- **Email financeiro:** financeiro@jaleca.com.br
- **Email geral:** contato@jaleca.com.br
- **WhatsApp loja:** +55 31 99290-1940
- **Dev responsável:** rhammon@objetivasolucao.com.br

---

## 📚 DOCUMENTAÇÃO COMPLETA

1. **AGENTS.md** — Histórico completo de correções e integrações
2. **SESSAO-REDIRECT-LOOP-24-04-2026.md** — Debug do redirect loop
3. **docs/** — PRDs de campanhas Meta/Google Ads

---

## ✅ CHECKLIST RÁPIDO

Antes de começar qualquer trabalho:

- [ ] Leu `AGENTS.md`?
- [ ] Verificou `SESSAO-REDIRECT-LOOP-24-04-2026.md`?
- [ ] Entendeu o redirect `/` → `/home`?
- [ ] Sabe que NÃO pode remover o redirect do Vercel?
- [ ] Testou `https://jaleca.com.br` para confirmar que funciona?

Se sim para todos, **está pronto para trabalhar!** 🚀

---

**Última atualização:** 24/04/2026 09:00 BRT  
**Último commit:** bbb64dd  
**Branch:** main

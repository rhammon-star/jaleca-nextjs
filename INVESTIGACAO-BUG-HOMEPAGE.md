# Investigação: Bug Redirect Loop Homepage — Para Análise Sonnet

**Data:** 24/04/2026  
**Urgência:** Alta (site em produção com workaround)  
**Status:** Resolvido com workaround, causa raiz não identificada

---

## 🔴 PROBLEMA

Homepage `jaleca.com.br` (rota `/`) retorna **redirect loop infinito** (ERR_TOO_MANY_REDIRECTS, HTTP 308).

Todas as outras rotas funcionam normalmente:
- ✅ `/home` — funciona
- ✅ `/test-emergency` — funciona
- ✅ `/produtos` — funciona
- ✅ `/categoria/*` — funciona
- ❌ `/` — redirect loop infinito

---

## 🎯 QUANDO COMEÇOU

O problema apareceu APÓS estas ações:

1. **Comprou ~20 domínios satélite** no Registro.br:
   - lojadejaleco.com.br
   - jalecopreto.com.br
   - jalecopremium.com.br
   - comprarjaleco.com.br
   - jalecouniversitario.com.br
   - jalecomedico.com.br
   - jalecomasculino.com.br
   - ... (mais 13 domínios)

2. **Configurou DNS** desses domínios:
   - Apontou A record → 216.198.79.1 (Vercel)
   - Todos no Registro.br

3. **Adicionou domínios no Vercel Dashboard:**
   - Projeto: jaleca-nextjs
   - Configurados como "Redirect" para jaleca.com.br

4. **Criou redirects no next.config.ts:**
   ```typescript
   { source: '/:path*', has: [{ type: 'host', value: 'lojadejaleco.com.br' }], 
     destination: 'https://jaleca.com.br/loja-jaleco', permanent: true },
   // ... mais 19 domínios
   ```

**APÓS essas mudanças:** `jaleca.com.br` parou de funcionar com redirect loop.

---

## ✅ O QUE FUNCIONA

- `https://jaleca.com.br/home` — ✅ renderiza homepage completa normalmente
- `https://jaleca.com.br/test-emergency` — ✅ página de teste simples
- `https://jaleca.com.br/produtos` — ✅ listagem de produtos
- **Todos os domínios satélite** — ✅ redirecionam corretamente para jaleca.com.br/[página]

---

## ❌ O QUE NÃO FUNCIONA

- `https://jaleca.com.br/` — ❌ redirect loop infinito
- `https://jaleca-nextjs-v2.vercel.app/` — ❌ redirect loop (projeto LIMPO, sem domínios!)

**Importante:** Mesmo em projeto NOVO sem nenhum domínio customizado, a rota `/` tem redirect loop.

---

## 🧪 TENTATIVAS DE CORREÇÃO (TODAS FALHARAM)

### 1. Remover domínios satélite
- ✅ Deletados TODOS os 20 domínios do Vercel Dashboard
- ❌ Problema persistiu

### 2. Remover redirects do next.config.ts
- ✅ Removidas linhas 138-149 (redirects `/` → `/home`)
- ❌ Problema persistiu

### 3. Substituir app/page.tsx
- ✅ Copiado `app/home/page.tsx` (que funciona) → `app/page.tsx`
- ✅ Arquivos idênticos confirmado
- ❌ Problema persistiu

### 4. Homepage ultra-minimalista
- ✅ Criada `app/page.tsx` com APENAS HTML puro:
  ```tsx
  export default function Home() {
    return <div>✅ FUNCIONANDO!</div>
  }
  ```
- ✅ Zero dependências (sem GraphQL, WooCommerce, Google, etc)
- ❌ Problema AINDA persistiu!

### 5. Projeto novo no Vercel
- ✅ Criado `jaleca-nextjs-v2` do zero
- ✅ Mesmo repositório Git
- ✅ Build completou com sucesso
- ❌ URL `.vercel.app` TAMBÉM tem redirect loop!

### 6. Purge cache Vercel Edge
- ✅ Purgado todo cache CDN/Edge
- ❌ Problema persistiu

### 7. DNS atualizado
- ✅ Mudado de 216.198.79.1 → 216.150.1.1
- ✅ Propagação confirmada
- ❌ Problema persistiu

---

## 🔍 EVIDÊNCIAS TÉCNICAS

### Build Logs (warm-cache.mjs)
```
[ERR] https://jaleca.com.br/ — fetch failed
[200] https://jaleca.com.br/produtos
[200] https://jaleca.com.br/categoria/jalecos-femininos
```

Homepage `/` falha mesmo durante build.

### Browser Inspector
```
Request URL: https://jaleca.com.br/
Status: 308 Permanent Redirect
Location: (loop detectado após 10+ redirects)
```

### WebFetch Test
```
Error: Too many redirects (exceeded 10)
```

### Arquivo Funcionando vs. Não Funcionando
- `app/page.tsx` — ❌ redirect loop
- `app/home/page.tsx` — ✅ funciona (CÓDIGO IDÊNTICO!)

---

## 💡 SOLUÇÃO TEMPORÁRIA (ATIVA EM PRODUÇÃO)

**Redirect no Vercel Dashboard** (não no código):
- Source: `/`
- Destination: `/home`
- Type: 307 Temporary
- Configurado em: Settings → Redirects

**Por que funciona:**
- Vercel Edge intercepta ANTES do Next.js processar
- Bypassa o bug da rota `/`
- SEO preservado (canonical em `/home` aponta para `/`)

---

## 🎯 PERGUNTAS PARA INVESTIGAÇÃO

1. **Por que APENAS a rota `/` tem redirect loop?**
   - `/home`, `/produtos`, `/test-emergency` funcionam
   - Código de `app/page.tsx` e `app/home/page.tsx` são IDÊNTICOS
   - Mesmo homepage minimalista falha

2. **Por que projeto NOVO tem o mesmo problema?**
   - `jaleca-nextjs-v2` é projeto limpo
   - Zero domínios customizados
   - URL `.vercel.app` TAMBÉM tem loop
   - Sugere problema no código, não no Vercel Edge

3. **Bug do Next.js 16.2.0?**
   - Comportamento específico da rota `/`
   - Não reproduzível em outras rotas
   - Pode ser regressão na versão 16.x

4. **Configuração fantasma no Vercel?**
   - Por que adicionar domínios satélite quebrou `/`?
   - Pode ter criado alguma config Edge persistente?
   - Mesmo deletando tudo, problema continua

5. **Diferença entre `/` e `/home`?**
   - Ambos são rotas válidas do Next.js App Router
   - `app/page.tsx` vs `app/home/page.tsx`
   - Por que uma funciona e outra não?

---

## 📁 ARQUIVOS RELEVANTES

### Código atual:
- `app/page.tsx` — homepage "fantasma" (não renderiza)
- `app/home/page.tsx` — homepage REAL (renderiza)
- `next.config.ts` — sem redirects de `/` → `/home` (removidos)
- `vercel.json` — apenas crons, sem redirects

### Configuração Vercel:
- **Dashboard → Settings → Redirects:**
  - `/` → `/home` (307)
- **Domains:**
  - jaleca.com.br (Production)
  - www.jaleca.com.br (Redirect → jaleca.com.br)

### Logs:
- Build completo em: `/private/tmp/.../tasks/bttp9wlc1.output`
- Erro específico: `[ERR] https://jaleca.com.br/ — fetch failed`

---

## 🚨 IMPACTO

- **SEO:** ✅ Preservado (canonical correto, redirect 307 transparente)
- **Usuários:** ✅ Site acessível normalmente
- **Performance:** ✅ Sem impacto (redirect Edge é instantâneo)
- **Manutenção:** ⚠️ Precisa manter 2 arquivos sincronizados (page.tsx + home/page.tsx)

---

## 🔧 PRÓXIMOS PASSOS SUGERIDOS

1. **Investigar Next.js 16.2.0:**
   - Verificar issues GitHub relacionadas a rota `/`
   - Testar downgrade para Next.js 15.x
   - Reproduzir problema em projeto mínimo

2. **Analisar Vercel Edge:**
   - Verificar se há configuração persistente relacionada a domínios satélite
   - Testar em outro projeto Vercel do zero
   - Contatar suporte Vercel com detalhes técnicos

3. **Comparar rotas:**
   - Debug detalhado: por que `/home` funciona e `/` não?
   - Verificar diferenças no routing do Next.js App Router
   - Analisar order de resolução de rotas

4. **Testes adicionais:**
   - Criar middleware.ts forçando logging de requests para `/`
   - Verificar se há algum componente global interceptando `/`
   - Testar com Next.js em modo dev local

---

## 📊 STACK TÉCNICO

- **Framework:** Next.js 16.2.0 (App Router)
- **Runtime:** Node.js 24 LTS
- **Hosting:** Vercel Pro
- **Deploy:** Automático via GitHub (branch main)
- **Build:** `next build && node scripts/warm-cache.mjs`

---

## 📞 CONTEXTO DO PROJETO

**Site:** E-commerce de uniformes médicos (jalecos)  
**Tráfego:** ~200 mil peças vendidas, milhares de visitas/dia  
**Crítico:** Site em produção, qualquer downtime impacta vendas  
**Workaround:** Funcional mas não ideal a longo prazo

---

**Por favor, analise e sugira:**
1. Causa raiz provável do bug
2. Testes adicionais para confirmar hipótese
3. Solução permanente (além do workaround atual)
4. Se é bug Next.js/Vercel ou erro de configuração nossa

---

**Documentação completa:** `SESSAO-REDIRECT-LOOP-24-04-2026.md`  
**Última atualização:** 24/04/2026 09:15 BRT

# Sessão Debugging Redirect Loop — 24/04/2026

## 🔴 PROBLEMA CRÍTICO

Site `jaleca.com.br` completamente inacessível com erro **ERR_TOO_MANY_REDIRECTS** (308 loop infinito).

---

## 📊 CRONOLOGIA DA SESSÃO

### 1. Situação Inicial (08:00)
- Usuário reportou que https://jaleca.com.br não abre mais
- Problema começou após configurar domínios satélite no Vercel
- Workaround temporário: `/home` funcionava, `/` não funcionava

### 2. Tentativa: Criar Projeto Novo no Vercel (08:01-08:10)
**Objetivo:** Eliminar configuração fantasma do Vercel Edge criando projeto limpo

**Passos executados:**
1. ✅ Criado projeto `jaleca-nextjs-v2` no Vercel
2. ✅ Build completou com sucesso (238 páginas geradas)
3. ❌ URL `.vercel.app` do projeto novo TAMBÉM tem redirect loop!

**Conclusão:** Problema NÃO é configuração do Vercel. É algo no código.

### 3. Tentativa: Remover Redirects next.config.ts (08:10-08:15)
**Encontrado:** Redirects condicionais de `/` → `/home` nas linhas 138-149 do `next.config.ts`

```typescript
// REMOVIDO (commit f568502):
{
  source: '/',
  has: [{ type: 'host', value: 'jaleca.com.br' }],
  destination: '/home',
  permanent: false
},
```

**Resultado:** ❌ Redirect loop PERSISTE mesmo após remoção

### 4. Tentativa: Substituir app/page.tsx por app/home/page.tsx (08:15-08:20)
**Raciocínio:** Se `/home` funciona e `/` não, talvez o arquivo `app/page.tsx` esteja corrompido

**Ação:** Movido `app/home/page.tsx` → `app/page.tsx` (commit 01f14e5)

**Resultado:** ❌ Redirect loop PERSISTE (arquivos eram idênticos)

### 5. Tentativa Atual: Homepage Minimalista (08:20)
**Ação:** Criada `app/page.tsx` ultra-minimalista (commit 997a9eb):
- Zero dependências externas
- Sem GraphQL, Google Places, componentes
- Apenas HTML puro

**Objetivo:** Isolar se problema é:
- ❓ Integração WooCommerce/WordPress (GraphQL 503 visto nos logs)
- ❓ Algum componente específico
- ❓ Bug Next.js/Vercel com rota `/` especificamente

**Status:** ⏳ Aguardando deployment para testar

---

## 🔍 DESCOBERTAS IMPORTANTES

### ✅ Confirmado: Problema NÃO é

- ❌ Configuração fantasma do Vercel (projeto limpo também falha)
- ❌ Domínios satélite (removidos, problema persiste)
- ❌ DNS (IP correto, propagação completa)
- ❌ Redirects do next.config.ts (removidos, problema persiste)
- ❌ Código específico de app/page.tsx (arquivos idênticos, só `/` falha)

### ❓ Suspeitas Remanescentes

1. **WooCommerce GraphQL 503**
   - Logs de build mostram: `GraphQL Error (Code: 503): Service Unavailable`
   - Homepage faz fetch de produtos via GraphQL
   - Se fetch falha durante SSR, pode causar loop?

2. **Vercel Edge Config Persistente**
   - Mesmo projeto limpo herda problema
   - Pode haver configuração Edge que persiste entre projetos do mesmo repo

3. **Bug Next.js 16.2.0 com rota `/`**
   - `/test-emergency` funciona
   - `/home` funciona
   - `/` (e só `/`) tem redirect loop
   - Comportamento muito específico sugere bug framework

---

## 📝 COMMITS DESTA SESSÃO

1. `f568502` — Remove redirects `/` → `/home` do next.config.ts
2. `01f14e5` — Move app/home/page.tsx → app/page.tsx (teste)
3. `997a9eb` — Homepage minimalista sem dependências (teste atual)

---

## 🎯 PRÓXIMOS PASSOS QUANDO VOLTAR

### Se Homepage Minimalista FUNCIONAR:
→ Problema está na integração WooCommerce ou componentes
→ Reintroduzir código gradualmente para isolar culpado
→ Verificar estado do servidor WooCommerce (503 errors)

### Se Homepage Minimalista FALHAR:
→ Problema é bug Next.js ou configuração Vercel Edge profunda
→ Opções:
  1. Criar middleware forçando redirect permanente `/` → `/inicio`
  2. Abrir ticket Vercel Support (Severity 1 já aberto anteriormente)
  3. Downgrade Next.js 16.2.0 → 15.x (breaking change)
  4. Usar `/home` como homepage oficial e esconder `/` do sitemap

---

## 🔗 URLs PARA TESTAR

- **Projeto NOVO (limpo):** `https://jaleca-nextjs-v2-gjmslfnz1-jaleca.vercel.app`
- **Projeto ANTIGO:** `https://jaleca.com.br` (domínio ainda configurado lá)
- **Página teste:** `https://jaleca-nextjs-v2-gjmslfnz1-jaleca.vercel.app/test-emergency`

---

## 📦 BACKUPS

- `app/page.tsx.broken` — homepage completa original (backup)
- `.env.production.backup` — 62 variáveis de ambiente do projeto antigo

---

## ⚠️ OBSERVAÇÕES CRÍTICAS

1. **Domínio jaleca.com.br** ainda está configurado no projeto ANTIGO
   - Se homepage minimalista funcionar, mover domínio para projeto NOVO

2. **warm-cache.mjs** hardcoded para `jaleca.com.br`
   - Linha 7: `const SITE_URL = 'https://jaleca.com.br'`
   - Mudar para variável de ambiente quando resolver

3. **WooCommerce instável**
   - Servidor wp.jaleca.com.br retornou 503 durante build
   - Pode estar sobrecarregado ou com problema

4. **Variáveis de ambiente**
   - Projeto NOVO foi deployado SEM as 62 env vars
   - APIs podem não funcionar mesmo se página carregar

---

**Gerado em:** 2026-04-24 08:25 BRT  
**Último commit:** 997a9eb (homepage minimalista)  
**Status:** Aguardando deployment do teste minimalista

# Spec: Navegação Mobile "Buscar por Profissão"

**Data:** 2026-04-26  
**Autor:** Claude (com input de GPT-4.1, Gemini Pro, Rhammon)  
**Status:** Aprovado para implementação  

---

## Problema

Atualmente, a funcionalidade "Buscar por Profissão" no mobile está escondida:
- Localização: Menu hambúrguer → scroll até o final → clicar "Buscar por Profissão"
- Exige **3 interações** do usuário (abrir menu + scroll + tap)
- 84% dos acessos são mobile

**Impacto nos negócios:**
- Queries Google com profissões: **1.935 cliques/mês** (top 10 queries = TODAS sobre profissões)
- Taxa de conversão via profissão: **2,3%**
- Taxa de conversão outros caminhos: **1,2%**
- **Perda estimada: 40-50% das vendas potenciais** por fricção de navegação

**Fonte dos dados:** GSC, GA4, análise GPT-4.1 (26/04/2026)

---

## Solução Aprovada: Híbrida

### Decisão
Mover "Profissões" para a **barra de navegação inferior fixa** (BottomNavBar), substituindo "Produtos". "Produtos" será movido para o topo do menu hambúrguer.

### Justificativa (Multi-Agent)

**📊 GPT-4.1 (Dados):**
- Conversão +92% via profissão vs. outros caminhos
- ROI claro: priorizar navegação qualificada sobre genérica

**🎯 Gemini Pro (CRO):**
- "Produtos" já é acessível via cards da homepage
- "Produtos" pode ficar no menu sem perda de usabilidade
- "Profissões" tem intenção de compra mais alta

**🏗️ Claude (Arquitetura):**
- Implementação: 20 minutos
- Impacto SEO: zero
- Mantém todos os fluxos existentes funcionais

---

## Arquitetura Técnica

### Componentes Afetados

#### 1. `components/BottomNavBar.tsx`
**Mudança:**
```diff
- Link href="/produtos" — LayoutGrid icon — label "Produtos"
+ Button onClick={openProfessionMenu} — Briefcase icon — label "Profissões"
```

**Comportamento:**
- Desktop: esconde BottomNavBar (já existe, `md:hidden`)
- Mobile: ao clicar "Profissões", dispara evento customizado `jaleca-open-profession-menu`
- ProfessionMenu escuta esse evento e abre drawer

**Ícone:** `<Briefcase>` (Lucide React, já instalado)

---

#### 2. `components/ProfessionMenu.tsx`
**Mudança:**
- Adicionar listener para evento `jaleca-open-profession-menu`
- Quando disparado no mobile, executar `setIsOpen(true)`
- Drawer já existe, apenas expor trigger externo

**Código novo:**
```typescript
useEffect(() => {
  function handleOpenFromBottomNav() {
    setIsOpen(true)
  }
  
  if (typeof window !== 'undefined') {
    window.addEventListener('jaleca-open-profession-menu', handleOpenFromBottomNav)
    return () => window.removeEventListener('jaleca-open-profession-menu', handleOpenFromBottomNav)
  }
}, [])
```

---

#### 3. `components/Header.tsx`
**Mudança no menu mobile:**
```diff
<div className="mobile-menu-drawer">
+  <Link href="/produtos" className="menu-item-top">
+    <LayoutGrid size={18} />
+    Produtos
+  </Link>
  
-  <ProfessionMenu /> {/* remover daqui */}
  
  {/* outros itens do menu */}
</div>
```

**Posição exata:**
- "Produtos" vira **primeiro item visível do menu hambúrguer**, antes de "Mais Vendidos", "Nossas Lojas", etc
- Remove componente `<ProfessionMenu>` do menu hambúrguer (sua interface mobile agora vem apenas da BottomNavBar)
- Desktop: ProfessionMenu continua no header como dropdown (não afetado)

---

### Data Flow

**Desktop (sem mudanças):**
1. Header → ProfessionMenu dropdown → lista de profissões

**Mobile (novo fluxo):**
1. Usuário clica "Profissões" na BottomNavBar
2. BottomNavBar dispara `window.dispatchEvent(new CustomEvent('jaleca-open-profession-menu'))`
3. ProfessionMenu escuta evento → `setIsOpen(true)`
4. Drawer fullscreen do ProfessionMenu abre (fundo branco/5, borda topo, busca + lista de profissões scrollável até 300px — componente já existe nas linhas 238-274 do arquivo atual)

**Mobile (produtos):**
1. Usuário clica menu hambúrguer
2. Vê "Produtos" como primeira opção
3. Clica → `/produtos` (página existente)

---

## Implementação

### Arquivos a Modificar
1. `components/BottomNavBar.tsx` — substituir link "Produtos" por botão "Profissões"
2. `components/ProfessionMenu.tsx` — adicionar event listener
3. `components/Header.tsx` — mover "Produtos" para topo do menu, remover `<ProfessionMenu>`

### Testes Manuais
- [ ] Mobile: clicar "Profissões" na barra inferior abre drawer
- [ ] Desktop: dropdown "Profissões" no header funciona normalmente
- [ ] Mobile: menu hambúrguer mostra "Produtos" no topo
- [ ] Ambos: busca de profissões funciona, links corretos
- [ ] Mobile: fechar drawer funciona (backdrop + X)

### Edge Cases
- **ProfessionMenu já aberto:** se usuário clicar "Profissões" na barra novamente, não faz nada (drawer já está `isOpen=true`)
- **Desktop clica "Profissões" na barra:** impossível, BottomNavBar tem `md:hidden`
- **Mobile clica "Produtos" no menu:** redireciona para `/produtos` (comportamento padrão de Link)

---

## Métricas de Sucesso

**KPIs (acompanhar via GA4 + ContentSquare):**
1. **Taxa de clique "Profissões"** (BottomNavBar) — baseline: n/a (novo)
2. **Conversão via profissão** — baseline: 2,3% → meta: 3,0%+ (esperado +30% de uso)
3. **Tempo até primeira interação** — baseline: 3 taps → meta: 1 tap
4. **Taxa de abandono no menu** — deve reduzir (menos scroll, menos fricção)

**Período de análise:** 14 dias pós-deploy

**Rollback:**
- Se conversão cair ou reclamações de UX aumentarem: reverter para versão anterior em < 5 minutos
- Commit antes/depois claramente marcados

---

## Impacto SEO

**Zero.** Mudanças são puramente de interface (client-side). URLs, conteúdo e estrutura HTML das páginas de profissão permanecem idênticos.

---

## Próximos Passos (Pós-Implementação)

1. Monitorar ContentSquare (gravações de sessão) — verificar se usuários encontram profissões facilmente
2. A/B test futuro (opcional): ícone "Profissões" com badge "Novo" nos primeiros 7 dias
3. Considerar: adicionar 3-4 profissões mais populares como **quick links na homepage** (card dedicado)

---

## Decisões Arquiteturais

### Por que Event-Driven (CustomEvent) em vez de Context/Props?
- **Desacoplamento:** BottomNavBar não precisa conhecer ProfessionMenu
- **Simplicidade:** mesmo padrão já usado para `jaleca-open-search` no SearchModal
- **Manutenibilidade:** componentes independentes, fácil reverter

### Por que não FAB (Floating Action Button)?
- Pode cobrir conteúdo importante (cards de produto)
- Usuários podem achar invasivo
- Barra inferior já existe e é familiar

### Por que não manter "Produtos" na barra E adicionar "Profissões"?
- Barra com 6 ícones fica visualmente poluída no mobile
- Ícones pequenos demais = acessibilidade ruim (< 44px WCAG)
- "Produtos" é navegação genérica, menos prioritária que profissão qualificada

---

## Assinaturas

**Aprovado por:** Rhammon (dono)  
**Data:** 2026-04-26  
**Implementador:** Claude  
**Revisores:** GPT-4.1 (dados), Gemini Pro (CRO)  

---

**Status:** ✅ Pronto para implementação

# PROJETO: OTIMIZAÇÃO COMPLETA JALECA 2026

**Criado:** 23/04/2026  
**Prazo:** 60 dias (23/04 - 22/06/2026)  
**Objetivo:** Reduzir custo de aquisição em 50% e aumentar conversão em 100%

---

## 📊 SITUAÇÃO ATUAL (Baseline)

### Métricas Iniciais (16-22/04/2026)
- **Gasto ADS:** R$ 6.150/mês (R$ 205/dia)
- **ROAS Google Ads:** 0 (sem rastreamento)
- **ROAS Meta Ads:** 3.26x
- **Vendas/semana:** 4 pagas (R$ 1.210)
- **Funil:** 2.160 views → 48 addToCart (2.2%) → 18 checkout (37.5%) → 8 compras (44%)
- **SEO:** 1 de 18 keywords no top 100 ("jalecos" pos 47)
- **Tráfego orgânico:** 143 cliques/semana

### Problemas Identificados
1. ❌ Zero visibilidade orgânica (17 keywords fora top 100)
2. ❌ Google Ads sem rastreamento de conversões
3. ❌ Funil quebrado (2.2% addToCart vs. 5-7% mercado)
4. ❌ Sem Google Merchant Center (concorrentes dominam Shopping)
5. ❌ Bounce rate alto: 77% Paid Shopping, 67.9% Paid Search
6. ❌ Sem segmentação por profissão (dentista, médica, enfermeira)
7. ❌ Sem blog/conteúdo educativo
8. ❌ Imagens sem alt text otimizado
9. ❌ Sem backlinks de autoridade

---

## 🎯 METAS DO PROJETO (60 dias)

| Métrica | Atual | Meta | Melhoria |
|---------|-------|------|----------|
| Gasto ADS/mês | R$ 6.150 | R$ 3.300 | -46% |
| ROAS Geral | 1.2x | 2.5x+ | +108% |
| AddToCart % | 2.2% | 4.5% | +104% |
| Vendas/semana | 4 | 12+ | +200% |
| Tráfego orgânico | 143/sem | 300/sem | +110% |
| Keywords top 100 | 1 | 8+ | +700% |
| Bounce Paid | 72% | 45% | -37% |

---

## 📅 CRONOGRAMA EXECUTIVO

### **FASE 1: PARAR SANGRAMENTO** (Dias 1-3)
**Objetivo:** Cortar gastos ineficientes e configurar rastreamento  
**Economia:** R$ 2.850/mês

### **FASE 2: CORRIGIR FUNIL** (Dias 4-14)
**Objetivo:** Dobrar taxa de conversão sem aumentar ADS  
**Impacto:** +100% vendas com mesmo tráfego

### **FASE 3: SEO BÁSICO** (Dias 15-30)
**Objetivo:** Começar a aparecer no orgânico  
**Impacto:** +157 cliques/semana gratuitos

### **FASE 4: ESCALAR** (Dias 31-60)
**Objetivo:** Reativar ADS com site otimizado  
**Impacto:** ROAS 2.5x+ sustentável

---

## 🔥 FASE 1: PARAR SANGRAMENTO (Dias 1-3)

### DIA 1 (23/04) — CORTE DE GASTOS

#### Google Ads — R$ 85 → R$ 30/dia
- [ ] **PAUSAR:** Core - Jalecos (R$ 70/dia)
  - Motivo: 0 conversões rastreadas
  - Economia: R$ 2.100/mês
- [ ] **REDUZIR:** Shopping R$ 30 → R$ 15/dia
  - Motivo: Sem Merchant Center, competição alta
  - Economia: R$ 450/mês
- [ ] **PAUSAR:** Remarketing Display (R$ 15/dia)
  - Motivo: Criado sem criativo
  - Economia: R$ 450/mês
- [ ] **MANTER:** Marca (R$ 5/dia) + Shopping reduzido (R$ 15/dia)
- [ ] **CRIAR:** Remarketing Search (R$ 10/dia)
  - Target: visitantes últimos 30 dias
  - Keywords: branded + genéricas de remarketing

**Total Google: R$ 30/dia (era R$ 85)**

#### Meta Ads — R$ 120 → R$ 80/dia
- [ ] **PAUSAR:** Prospecção Lookalike Vídeo
  - Motivo: Sem criativo de vídeo
- [ ] **PAUSAR:** Prospecção Saúde e Beleza Vídeo
  - Motivo: Sem criativo de vídeo
- [ ] **PAUSAR:** Novas Páginas (R$ 5/dia)
  - Motivo: Sem teste A/B
- [ ] **REDUZIR:** Remarketing Carrinho R$ 100 → R$ 70/dia
  - Motivo: Otimizar antes de escalar
- [ ] **MANTER:** Remarketing Dinâmico (R$ 10/dia estimado)

**Total Meta: R$ 80/dia (era R$ 120)**

#### Resultado Dia 1
- **Novo budget:** R$ 110/dia (R$ 3.300/mês)
- **Economia:** R$ 95/dia = R$ 2.850/mês
- **ROI estimado:** R$ 110/dia × 2.0 ROAS = R$ 6.600/mês (vs. atual R$ 3.640)

---

### DIA 2 (24/04) — RASTREAMENTO GOOGLE ADS

#### Diagnóstico
- [ ] Acessar Google Ads → Conversões
- [ ] Verificar se tag "Purchase" está instalada
- [ ] Checar última conversão registrada

#### Correção
- [ ] Abrir `app/pagamento/page.tsx`
- [ ] Verificar se `trackPurchase()` está sendo chamado
- [ ] Testar compra com cartão de teste
- [ ] Confirmar evento aparece no Google Ads (pode demorar até 24h)

#### Se tag NÃO estiver funcionando:
- [ ] Verificar Google Tag Manager
- [ ] Conferir evento `purchase` no GA4
- [ ] Integrar GA4 → Google Ads (importar conversões)
- [ ] Criar conversão manual se necessário

**Meta:** Tag funcionando + 1 conversão teste registrada

---

### DIA 3 (25/04) — MERCHANT CENTER

#### Setup Inicial
- [ ] Acessar https://merchants.google.com/
- [ ] Adicionar site jaleca.com.br
- [ ] Verificar propriedade via Google Search Console
- [ ] Aceitar termos do Google Merchant Center

#### Feed de Produtos
- [ ] Confirmar feed existe: `/api/feed/google-shopping`
- [ ] Testar feed manualmente: `curl https://jaleca.com.br/api/feed/google-shopping`
- [ ] Verificar campos obrigatórios: id, title, description, link, image_link, price, availability
- [ ] Corrigir erros se houver (tamanho de imagem, falta de atributos)

#### Submissão
- [ ] No Merchant Center → Produtos → Feeds
- [ ] Adicionar feed: `https://jaleca.com.br/api/feed/google-shopping`
- [ ] Agendar atualização diária (recomendado: 7h UTC)
- [ ] Aguardar processamento (pode levar 24-48h)

#### Validação
- [ ] Verificar "Problemas com produtos"
- [ ] Corrigir rejeições (preço, imagem, título)
- [ ] Habilitar "Listagens gratuitas" (Shopping tab)
- [ ] Aguardar aprovação (3-5 dias úteis)

**Meta:** Feed submetido + 0 erros críticos

---

## 🛠️ FASE 2: CORRIGIR FUNIL (Dias 4-14)

### SEMANA 1 (Dias 4-7) — PÁGINAS DE PRODUTO

#### Dia 4-5: Imagens de Alta Qualidade
- [ ] Listar 5 produtos mais vendidos
  1. Jaleco Slim Tradicional Feminino
  2. Jaleco Slim Princesa Feminino
  3. Jaleco Slim Moratty Feminino
  4. Jaleco Slim Masculino
  5. Jaleco Gold Feminino

- [ ] Para CADA produto, adicionar 5-7 fotos:
  - [ ] Modelo vestindo (frente)
  - [ ] Modelo vestindo (costas)
  - [ ] Modelo vestindo (lateral)
  - [ ] Close-up gola/botões
  - [ ] Close-up bolsos
  - [ ] Close-up tecido (textura)
  - [ ] Foto em cabide (estúdio, fundo branco)

- [ ] Otimizar imagens:
  - [ ] Comprimir com TinyPNG (< 200KB cada)
  - [ ] Formato WebP + fallback JPG
  - [ ] Dimensões: 1200×1600px

**Meta:** 5 produtos com 7 fotos cada = 35 imagens

#### Dia 6: Alt Texts e SEO de Imagens
- [ ] Criar script para adicionar alt text em massa
- [ ] Padrão: `"Jaleco {nome} {cor} {tamanho} - Jaleca | Vista {ângulo}"`
- [ ] Exemplo: `"Jaleco Slim Tradicional Feminino Branco P - Jaleca | Vista Frontal"`
- [ ] Aplicar em TODAS as imagens de produto (600+ imagens)

**Meta:** 100% das imagens com alt text otimizado

#### Dia 7: Calculadora de Frete na Página de Produto
- [ ] Mover componente `ShippingCalculator` para página de produto
- [ ] Posicionar abaixo do botão "Adicionar ao Carrinho"
- [ ] Pré-preencher com CEP salvo se existir
- [ ] Exibir opções: PAC, SEDEX, Jadlog com prazo/preço
- [ ] Destacar "Frete Grátis" se aplicável (Sudeste > R$499)

**Meta:** Calculadora funcionando em todas as páginas de produto

---

### SEMANA 2 (Dias 8-14) — UX E MOBILE

#### Dia 8-9: Botão "Adicionar ao Carrinho" Otimizado
- [ ] Aumentar tamanho do botão (desktop: 180px width, mobile: 100% width)
- [ ] Cor de contraste alto (testar verde #10b981 vs. laranja #f97316)
- [ ] Posição sticky no mobile (fixo no bottom com safe-area)
- [ ] Micro-feedback ao clicar (animação bounce + cor)
- [ ] Garantir "acima da dobra" em desktop

**Meta:** Botão 44×44px mínimo, sticky mobile, alta visibilidade

#### Dia 10: Guia de Medidas
- [ ] Criar modal `<MeasurementGuide>`
- [ ] Adicionar tabela de medidas (PP a G3) com busto/cintura/quadril
- [ ] Instruções visuais (como medir)
- [ ] Botão "Guia de Medidas" abaixo de seleção de tamanho
- [ ] Design: modal clean, fácil fechar, mobile-friendly

**Meta:** Guia implementado em todas as páginas de produto

#### Dia 11-12: Otimização Mobile
- [ ] Auditoria de elementos < 44×44px
- [ ] Corrigir touch targets pequenos
- [ ] Input fields: `font-size: 16px` (evitar zoom iOS)
- [ ] Testar formulário checkout em iPhone SE, iPhone 14, Android
- [ ] Navegação por gestos (swipe) em galeria de imagens

**Meta:** 100% elementos touch-friendly, sem zoom involuntário

#### Dia 13-14: Checkout Simplificado
- [ ] Remover campos desnecessários (deixar apenas obrigatórios)
- [ ] Guest checkout sem obrigar cadastro
- [ ] Barra de progresso visual (3 steps: Carrinho → Dados → Pagamento)
- [ ] Trust badges no checkout (compra segura, SSL, políticas)
- [ ] WhatsApp de suporte visível (botão flutuante no checkout)

**Meta:** Checkout em 3 steps, guest checkout ativo

---

## 🔍 FASE 3: SEO BÁSICO (Dias 15-30)

### SEMANA 3 (Dias 15-21) — ON-PAGE

#### Dia 15-16: Otimizar Páginas Principais
- [ ] **Home (`/`)**
  - Title: `"Jalecos Femininos e Masculinos Premium | Jaleca — Conforto e Elegância"`
  - H1: `"Jalecos Premium para Profissionais da Saúde"`
  - Conteúdo: 300 palavras (quem somos, diferenciais, profissionais atendidos)
  - Schema: Organization + WebSite (já existe, validar)

- [ ] **Categoria Jalecos Femininos (`/categoria/jalecos-femininos`)**
  - Title: `"Jalecos Femininos Modernos | Modelos Exclusivos para Médicas e Dentistas | Jaleca"`
  - H1: `"Jalecos Femininos — Elegância e Conforto Profissional"`
  - H2: `"Por que escolher nossos jalecos femininos"`
  - H2: `"Modelos disponíveis: Slim, Princesa, Acinturado, Bordado"`
  - Conteúdo: 400 palavras (tipos, tecidos, cores, para quem é indicado)
  - Schema: CollectionPage

- [ ] **Categoria Jalecos (`/categoria/jalecos`)**
  - Title: `"Jalecos Profissionais Brancos e Coloridos | Jaleca — Qualidade Premium"`
  - H1: `"Jalecos para Médicos, Dentistas e Profissionais da Saúde"`
  - Conteúdo: 350 palavras
  
- [ ] **Página Produtos (`/produtos`)**
  - Title: `"Todos os Jalecos e Uniformes Profissionais | Jaleca"`
  - H1: `"Uniformes Profissionais para Saúde"`
  - Conteúdo: 250 palavras

- [ ] **Produto Principal (Jaleco Slim Tradicional)**
  - Title: incluir "para médica", "branco", "moderno"
  - Description: 160 caracteres, CTA clara
  - H2: "Características", "Para quem é indicado", "Tecido e cuidados"
  - Schema: Product com aggregateRating (já existe, validar)

**Meta:** 5 páginas otimizadas com conteúdo denso

#### Dia 17-18: Links Internos
- [ ] Mapear estrutura de links:
  - Home → Categorias
  - Categorias → Produtos
  - Produtos relacionados (cross-sell)
  - Blog (quando existir) → Categorias/Produtos

- [ ] Implementar breadcrumbs em TODAS as páginas
- [ ] Adicionar seção "Produtos Relacionados" nas páginas de produto
- [ ] Footer: links para categorias principais

**Meta:** Estrutura de links hierárquica clara

---

### SEMANA 4 (Dias 22-30) — CONTEÚDO E PROFISSÕES

#### Dia 22-24: Páginas de Profissão
Criar 3 páginas hubs de profissão:

- [ ] **`/jaleco-dentista`**
  - Title: `"Jaleco para Dentista Feminino e Masculino | Conforto e Higiene | Jaleca"`
  - H1: `"Jalecos Profissionais para Dentistas"`
  - Conteúdo: 600 palavras
    - Por que dentistas precisam de jalecos específicos
    - Características ideais (tecido, manga, bolsos)
    - Modelos recomendados
    - Cuidados e higienização
  - CTA: "Ver jalecos para dentistas" → filtro categoria
  - Schema: Article

- [ ] **`/jaleco-para-medica`**
  - Title: `"Jaleco Feminino para Médica | Modelos Modernos e Confortáveis | Jaleca"`
  - H1: `"Jalecos Femininos para Médicas — Estilo e Profissionalismo"`
  - Conteúdo: 600 palavras
  - Incluir galeria de modelos (Slim, Princesa, Acinturado)

- [ ] **`/jaleco-para-enfermeira`**
  - Title: `"Jaleco para Enfermagem Feminino | Durabilidade e Conforto | Jaleca"`
  - H1: `"Jalecos para Enfermeiras — Resistência para Plantões Longos"`
  - Conteúdo: 600 palavras

**Meta:** 3 páginas profissão com 600 palavras cada

#### Dia 25-27: Blog — Posts Pilares
- [ ] **Post 1: "Como Escolher o Jaleco Ideal: Guia Completo 2026"**
  - 1.500 palavras
  - Seções: Tecido, Tamanho, Cor, Profissão, Cuidados
  - Keywords: "como escolher jaleco", "melhor jaleco"
  - 5 imagens internas
  - Schema: Article + HowTo

- [ ] **Post 2: "Melhores Tecidos para Jaleco: Gabardine vs Oxford vs Elastano"**
  - 1.200 palavras
  - Comparação detalhada de tecidos
  - Tabela comparativa
  - Keywords: "melhor tecido jaleco", "jaleco gabardine"

**Meta:** 2 posts blog SEO-otimizados

#### Dia 28-30: Outreach Inicial
- [ ] Listar 20 blogs/sites de saúde para outreach
  - Blogs de enfermagem
  - Portais de odontologia
  - Sites de moda profissional
  - Influenciadoras da saúde no Instagram

- [ ] Criar template de email para outreach
- [ ] Enviar 5 emails personalizados (testar resposta)

**Meta:** Lista de 20 prospects + 5 emails enviados

---

## 🚀 FASE 4: ESCALAR (Dias 31-60)

### SEMANA 5-6 (Dias 31-45) — RETOMAR ADS

#### Pré-requisitos antes de escalar:
- [ ] Tag Google Ads funcionando 100%
- [ ] Merchant Center aprovado
- [ ] AddToCart ≥ 4%
- [ ] Checkout completion ≥ 65%

#### Reativar Google Ads
- [ ] **Core - Jalecos:** R$ 30/dia (antes R$ 70)
  - Começar conservador
  - Monitorar ROAS por 3 dias
  - Se ROAS > 2x: aumentar R$ 10/dia a cada 3 dias

- [ ] **Shopping:** R$ 15 → R$ 30/dia
  - Com Merchant ativo, competir melhor
  - Testar Smart Shopping

- [ ] **Performance Max:** R$ 20/dia (NOVA)
  - Usar assets do site (imagens, logos)
  - Segmentação: Brasil todo
  - Conversion goal: Purchase

**Meta Google Ads:** ROAS 2x+ sustentável

#### Escalar Meta Ads
- [ ] **Remarketing Carrinho:** R$ 70 → R$ 100/dia
  - ROAS já é 3.26x, pode escalar
  - Testar aumentar R$ 10/dia a cada 2 dias

- [ ] **Lookalike 1%:** R$ 30/dia (REATIVAR)
  - Seed: compradores últimos 60 dias
  - Testar com criativo novo (não vídeo)

- [ ] **Prospecção Estática:** R$ 20/dia (NOVA)
  - Imagens de produto + copy forte
  - Target: Mulheres 25-50, interesse saúde

**Meta Meta Ads:** Manter ROAS > 3x

---

### SEMANA 7-8 (Dias 46-60) — OTIMIZAÇÃO CONTÍNUA

#### SEO Avançado
- [ ] Criar mais 5 páginas profissão:
  - /jaleco-para-veterinaria
  - /jaleco-esteticista
  - /jaleco-para-farmaceutica
  - /jaleco-nutricionista
  - /jaleco-para-biomedica

- [ ] Publicar mais 4 posts blog (total 6)
- [ ] Continuar outreach (15 emails/semana)
- [ ] Monitorar posições GSC semanalmente

#### CRO Contínuo
- [ ] Teste A/B #1: Cor do botão (verde vs. laranja)
- [ ] Teste A/B #2: Frete grátis threshold (R$ 499 vs. R$ 399)
- [ ] Teste A/B #3: Copy do botão ("Adicionar" vs. "Comprar Agora")
- [ ] Análise heatmap (Clarity/ContentSquare)

#### Backlinks
- [ ] Conseguir 5 backlinks de qualidade:
  - 2 de blogs de saúde
  - 1 de portal de notícias local
  - 1 de associação de classe
  - 1 de influenciadora (parceria)

---

## 📊 MÉTRICAS DE ACOMPANHAMENTO

### Dashboard Semanal (atualizar toda sexta)

```markdown
📅 SEMANA [X] — [DATA]

💰 FINANCEIRO:
• Gasto ADS: R$ ___ (meta: R$ 110/dia)
• Vendas: R$ ___ (meta: R$ 3.500/semana)
• ROAS Geral: ___x (meta: 2.5x+)
• Lucro: R$ ___

🎯 FUNIL:
• Views produto: ___
• AddToCart: ___ (___%) — meta: 4.5%
• Checkout: ___ (___%) — meta: 65%
• Compras: ___ (___%) — meta: 60%

🔍 SEO:
• Tráfego orgânico: ___ cliques (meta: 300/sem)
• Keywords top 100: ___ (meta: 8+)
• Posição "jalecos": ___ (meta: <30)
• Backlinks: ___ (meta: 10+)

📱 TECH:
• Google Ads conversões: ___ (meta: 100% rastreadas)
• Merchant Center: [ ] Aprovado
• Bounce rate: ___% (meta: <50%)
```

---

## 🚦 PONTOS DE DECISÃO GO/NO-GO

| Situação | Ação |
|----------|------|
| ROAS Google < 1.5x após 7 dias | ⏸️ PAUSAR, investigar |
| ROAS Meta < 2.5x por 3 dias | ⏸️ REDUZIR budget 30% |
| AddToCart < 3% após Fase 2 | 🔄 REFAZER UX de produto |
| Merchant rejeitado 2x | 🆘 CONTRATAR consultor GMC |
| SEO sem melhoria após 30 dias | 🔄 REVISAR estratégia keywords |
| Budget excedido 2 semanas | ⏸️ PAUSAR campanhas de teste |

---

## 📁 ARQUIVOS DO PROJETO

### Documentos
- `docs/PROJETO-OTIMIZACAO-COMPLETA-2026.md` — Este arquivo (master)
- `docs/ANALISE-CONCORRENTES-DATAFORSEO.md` — Análise SEO detalhada
- `docs/PLANO-CONTEUDO-BLOG.md` — Calendário editorial
- `docs/CHECKLIST-MERCHANT-CENTER.md` — Setup GMC passo a passo

### Scripts Úteis
- `scripts/dashboard.mjs` — Métricas diárias consolidadas
- `scripts/executar-google-final.js` — Ajustes Google Ads via API
- `scripts/executar-meta-final.js` — Ajustes Meta Ads via API

### Dados
- `data/seo-tracking/positions.json` — Rankings keywords (atualizado diariamente)

---

## ✅ CHECKLIST EXECUTIVO

### Fase 1: Parar Sangramento ⏱️ Dias 1-3
- [ ] Dia 1: Cortar gastos ADS (economia R$ 2.850/mês)
- [ ] Dia 2: Corrigir rastreamento Google Ads
- [ ] Dia 3: Configurar Google Merchant Center

### Fase 2: Corrigir Funil ⏱️ Dias 4-14
- [ ] Semana 1: Imagens + Alt texts + Calculadora frete
- [ ] Semana 2: Botão otimizado + Guia medidas + Mobile + Checkout

### Fase 3: SEO Básico ⏱️ Dias 15-30
- [ ] Semana 3: Otimizar 5 páginas + Links internos
- [ ] Semana 4: 3 páginas profissão + 2 posts blog + Outreach

### Fase 4: Escalar ⏱️ Dias 31-60
- [ ] Semana 5-6: Reativar Google Ads + Escalar Meta
- [ ] Semana 7-8: SEO avançado + CRO contínuo + Backlinks

---

## 🎯 SUCESSO DO PROJETO

**Considerado sucesso se ao final de 60 dias:**

✅ Gasto ADS reduzido para R$ 3.300/mês (de R$ 6.150)  
✅ ROAS geral ≥ 2.5x  
✅ AddToCart ≥ 4% (de 2.2%)  
✅ Vendas/semana ≥ 10 (de 4)  
✅ Tráfego orgânico ≥ 250 cliques/semana (de 143)  
✅ Keywords top 100 ≥ 6 (de 1)  
✅ Google Merchant Center aprovado e ativo

---

**Próxima revisão:** Sexta-feira 26/04/2026

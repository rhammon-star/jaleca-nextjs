# PLANO DE EXECUÇÃO URGENTE — JALECA 2026

**Data:** 23/04/2026  
**Status:** 🔴 CRÍTICO — Última chance de virada  
**Prazo:** 60 dias (até 22/06/2026)

---

## 🚨 DIAGNÓSTICO BRUTAL — POR QUE ESTAMOS AQUI

### Números que Doem
- **R$ 6.150/mês em ADS** gastando mais que faturando
- **ROAS Google Ads: 0** (literalmente queimando dinheiro)
- **2.2% addToCart** (mercado faz 5-7%) — site não converte
- **17 de 18 keywords fora do top 100** — invisível no Google
- **77% bounce em Paid Shopping** — tráfego pago fugindo
- **4 vendas/semana** com R$ 6k de investimento = **insustentável**

### A Verdade Dura
Você não tem um problema de tráfego. **Você tem um problema de conversão.**  
Jogar mais dinheiro em ADS agora é como encher um balde furado.

---

## ✅ O QUE JÁ FUNCIONA (não mexer)

- ✅ Meta Remarketing: **ROAS 3.26x** — único canal rentável
- ✅ Infra técnica: Cielo, ME, emails, rastreamento — tudo funcionando
- ✅ Produto: 30 SKUs, fotos ok, descrições premium
- ✅ Mobile: PWA, touch targets, sticky CTA — UX competitiva

**Regra de ouro:** PROTEGER o que funciona enquanto consertamos o resto.

---

## 🎯 ESTRATÉGIA DE SOBREVIVÊNCIA (60 dias)

### Fase 1 (Dias 1-3): PARAR A HEMORRAGIA
**Objetivo:** Cortar 46% dos gastos SEM perder vendas  
**Resultado esperado:** Economia R$ 2.850/mês

### Fase 2 (Dias 4-14): CONSERTAR O FUNIL
**Objetivo:** Dobrar conversão (2.2% → 4.5%) com ZERO gasto adicional  
**Resultado esperado:** Mesmas visitas = 2x vendas

### Fase 3 (Dias 15-30): PLANTAR ORGÂNICO
**Objetivo:** Começar a aparecer grátis no Google  
**Resultado esperado:** +157 cliques/semana (R$ 0 de custo)

### Fase 4 (Dias 31-60): ESCALAR COM FUNDAÇÃO
**Objetivo:** Reativar ADS com site que converte  
**Resultado esperado:** ROAS 2.5x sustentável

---

## 📋 PLANO DE AÇÃO DETALHADO

---

## 🔥 FASE 1: PARAR SANGRAMENTO (23-25/04) — 72h

### ⚠️ ATENÇÃO: Ordem de execução importa
Execute na sequência EXATA abaixo. Não pule etapas.

---

### **DIA 1 — QUARTA 23/04 (HOJE)**

#### **MANHÃ (9h-12h): Auditoria Pré-Corte**

**1. Backup completo Google Ads (30min)**
```bash
# Executar no terminal
node ~/SiteJaleca/jaleca-nextjs/scripts/backup-google-ads.js
```
- [ ] Screenshot de TODAS as campanhas (nome, budget, status)
- [ ] Exportar histórico últimos 30 dias (CSV)
- [ ] Salvar em `~/SiteJaleca/backups/google-ads-23-04-2026/`

**2. Backup completo Meta Ads (30min)**
```bash
node ~/SiteJaleca/jaleca-nextjs/scripts/backup-meta-ads.js
```
- [ ] Screenshot de todos os ad sets ativos
- [ ] Exportar métricas últimos 30 dias
- [ ] Salvar em `~/SiteJaleca/backups/meta-ads-23-04-2026/`

**3. Documentar estado atual (1h)**
- [ ] Abrir planilha `TRACKING-OTIMIZACAO-2026.xlsx`
- [ ] Registrar baseline: gasto/dia, ROAS, vendas/semana
- [ ] Tirar print do GA4 (sessões, conversões, bounce rate)
- [ ] Salvar estado WooCommerce (pedidos últimos 7 dias)

**POR QUE ISSO É CRÍTICO:**  
Se algo der errado, você volta ao estado anterior em 10min.  
Sem backup = sem rede de segurança.

---

#### **TARDE (14h-18h): Execução dos Cortes**

**4. Google Ads — Cortar R$ 55/dia (1h)**

Execute via script:
```bash
node ~/SiteJaleca/jaleca-nextjs/scripts/executar-google-cortes-dia1.js
```

O script vai:
- [ ] **PAUSAR:** Core - Jalecos (R$ 70/dia → R$ 0)
  - Motivo: 0 conversões rastreadas em 30 dias
  - Economia: R$ 2.100/mês
  
- [ ] **REDUZIR:** Shopping R$ 30 → R$ 15/dia
  - Motivo: Sem Merchant Center ativo, competição brutal
  - Economia: R$ 450/mês
  
- [ ] **PAUSAR:** Remarketing Display (R$ 15/dia → R$ 0)
  - Motivo: Criado sem criativo (campanha fantasma)
  - Economia: R$ 450/mês

- [ ] **CRIAR:** Remarketing Search (R$ 10/dia)
  - Target: visitantes últimos 30 dias
  - Keywords: [jaleco] + [marca] (exato)
  - Budget: R$ 10/dia

- [ ] **MANTER:** Marca (R$ 5/dia)
  - Não mexer — ROAS defensivo

**Novo budget Google:** R$ 30/dia (era R$ 85/dia)

**5. Meta Ads — Cortar R$ 40/dia (1h)**

Execute via script:
```bash
node ~/SiteJaleca/jaleca-nextjs/scripts/executar-meta-cortes-dia1.js
```

O script vai:
- [ ] **PAUSAR:** Prospecção Lookalike Vídeo
  - Motivo: Sem criativo de vídeo (anúncio vazio)
  
- [ ] **PAUSAR:** Prospecção Saúde e Beleza Vídeo
  - Motivo: Sem criativo de vídeo
  
- [ ] **PAUSAR:** Novas Páginas (R$ 5/dia)
  - Motivo: Teste sem acompanhamento = desperdício

- [ ] **REDUZIR:** Remarketing Carrinho R$ 100 → R$ 70/dia
  - Motivo: ROAS 3.26x é bom, mas otimizar antes de escalar
  
- [ ] **MANTER:** Remarketing Dinâmico (R$ 10/dia)
  - Não mexer — canal rentável

**Novo budget Meta:** R$ 80/dia (era R$ 120/dia)

**6. Validação dos cortes (30min)**
- [ ] Conferir no Google Ads Manager: campanhas pausadas/reduzidas
- [ ] Conferir no Meta Ads Manager: status correto
- [ ] Screenshot pós-execução (comparar com backup manhã)
- [ ] Atualizar planilha: novo budget R$ 110/dia

**RESULTADO DIA 1:**
- ✅ Budget: R$ 205/dia → R$ 110/dia (-46%)
- ✅ Economia: R$ 2.850/mês
- ✅ Proteção: remarketing mantido (canal que funciona)

---

### **DIA 2 — QUINTA 24/04**

#### **Missão do dia: Google Ads enxergar vendas**

**7. Diagnóstico rastreamento (1h)**

Executar:
```bash
# Ver últimas conversões Google Ads
node ~/SiteJaleca/jaleca-nextjs/scripts/check-google-conversions.js
```

- [ ] Acessar Google Ads → Ferramentas → Medição → Conversões
- [ ] Verificar ação "Purchase" (AW-18072506944/...)
- [ ] Checar última conversão registrada (data/hora)
- [ ] Ver status da tag (ativa/pausada/erro)

**Se última conversão > 7 dias:** tag quebrada ❌

**8. Teste de compra controlado (2h)**

- [ ] Abrir modo anônimo: https://jaleca.com.br
- [ ] Adicionar produto ao carrinho (qualquer jaleco)
- [ ] Ir até checkout, preencher dados
- [ ] **Método:** Cartão de teste Cielo
  - Número: `4024 0071 5376 3191` (teste Cielo)
  - CVV: qualquer
  - Validade: qualquer futura
  - Nome: SEU NOME
  
- [ ] Completar pagamento
- [ ] Anotar ID do pedido (ex: #12345)
- [ ] Aguardar 5min

**9. Validar disparo (1h)**

```bash
# Ver se conversão chegou
node ~/SiteJaleca/jaleca-nextjs/scripts/check-conversion-by-order.js 12345
```

- [ ] Abrir Google Ads → Conversões → Últimas 24h
- [ ] Procurar conversão com valor do teste
- [ ] Se APARECEU: ✅ tag funcionando
- [ ] Se NÃO APARECEU: ❌ seguir para correção

**10. Correção se necessário (2h)**

**Cenário A:** Tag instalada mas não dispara
```typescript
// Verificar app/pagamento/page.tsx
// Deve ter trackPurchase() sendo chamado

// Se não tem, adicionar:
useEffect(() => {
  if (paymentStatus === 'paid' && !trackFiredRef.current) {
    trackPurchase({
      transaction_id: orderId,
      value: orderValue,
      currency: 'BRL',
      items: orderItems
    });
    trackFiredRef.current = true;
  }
}, [paymentStatus]);
```

**Cenário B:** Tag não instalada
- [ ] Verificar `components/Analytics.tsx`
- [ ] Confirmar Google Tag Manager no `<head>`
- [ ] ID correto: `AW-18072506944`

**Cenário C:** Importação GA4 → Ads quebrada
- [ ] Google Ads → Ferramentas → Conversões
- [ ] Importar do Google Analytics 4
- [ ] Selecionar evento `purchase`
- [ ] Ativar importação automática

**RESULTADO DIA 2:**
- ✅ Tag Google Ads rastreando 100% das vendas
- ✅ Conversão teste registrada
- ✅ Baseline zerado: próximas vendas serão contabilizadas

---

### **DIA 3 — SEXTA 25/04**

#### **Missão do dia: Google Merchant Center funcionando**

**11. Setup inicial Merchant Center (1h)**

- [ ] Acessar: https://merchants.google.com/
- [ ] Clicar "Adicionar empresa" (se primeira vez)
- [ ] Inserir: `jaleca.com.br`
- [ ] Verificar propriedade via Google Search Console
  - Método: usar conta GSC já conectada
  - Verificação instantânea
- [ ] Aceitar Termos e Condições Merchant

**12. Testar feed de produtos (1h)**

```bash
# Testar feed localmente
curl -s https://jaleca.com.br/api/feed/google-shopping | head -100
```

Verificar se retorna XML com:
- [ ] Tag `<item>` para cada variação
- [ ] Campos obrigatórios:
  - `<g:id>` (SKU)
  - `<g:title>` (nome produto)
  - `<g:description>` (descrição)
  - `<g:link>` (URL produto)
  - `<g:image_link>` (foto)
  - `<g:price>` (preço com "BRL")
  - `<g:availability>` (in stock / out of stock)
  - `<g:condition>` (new)
  - `<g:brand>` (Jaleca)

**Se feed retornar erro 500:**
```bash
# Ver logs Vercel
vercel logs --app jaleca-nextjs --since 1h
```

**13. Corrigir erros comuns do feed (2h)**

**Erro comum #1:** Imagens > 8MB
```bash
# Listar imagens grandes
cd ~/SiteJaleca
find . -name "*.jpg" -size +8M

# Comprimir via TinyPNG ou:
mogrify -resize 1200x1600 -quality 85 *.jpg
```

**Erro comum #2:** Variações sem estoque (`stock_quantity=0`)
- [ ] WooCommerce → Produtos → Variações
- [ ] Filtrar: "Sem estoque"
- [ ] Mudar `stock_status` para `outofstock`
  - Isso remove do feed automaticamente

**Erro comum #3:** Falta de atributo cor/tamanho
```graphql
# Verificar query GET_PRODUCTS
# Deve incluir attributes { name, options }
```

**14. Submeter feed ao Merchant (1h)**

- [ ] Merchant Center → Produtos → Feeds
- [ ] Clicar "Adicionar feed"
- [ ] Tipo: Feed de dados de produtos
- [ ] País: Brasil
- [ ] Idioma: Português
- [ ] Nome: "Feed Jaleca Principal"
- [ ] Método: URL programada
- [ ] URL: `https://jaleca.com.br/api/feed/google-shopping`
- [ ] Frequência: Diária
- [ ] Horário: 07:00 UTC (04:00 BRT)
- [ ] Clicar "Criar feed"

**15. Aguardar processamento (30min-24h)**

- [ ] Merchant Center → Produtos → Diagnóstico
- [ ] Status esperado: "Processando..." (primeiros 30min)
- [ ] Depois: "X produtos aprovados" (pode levar 24h)

**Se aparecer erros:**
- [ ] Clicar no erro → ver produto específico
- [ ] Corrigir no WooCommerce
- [ ] Aguardar próxima atualização (7h UTC do dia seguinte)

**16. Habilitar Listagens Gratuitas (5min)**

- [ ] Merchant Center → Crescimento → Administrar programas
- [ ] Procurar "Listagens gratuitas"
- [ ] Clicar "Ativar"
- [ ] País: Brasil
- [ ] Aceitar termos

**O QUE ISSO FAZ:**  
Seus produtos aparecem na aba Shopping do Google **DE GRAÇA**.  
Não é anúncio, é resultado orgânico. Zero custo.

**RESULTADO DIA 3:**
- ✅ Feed submetido ao Merchant Center
- ✅ 0 erros críticos (ou corrigidos)
- ✅ Listagens gratuitas ativas
- ✅ Aguardando aprovação (3-5 dias úteis)

---

## ✅ CHECKPOINT FASE 1 (fim do Dia 3)

### Você deve ter:
- [x] Budget reduzido: R$ 205 → R$ 110/dia ✅
- [x] Google Ads rastreando vendas ✅
- [x] Merchant Center configurado ✅
- [x] Economia: R$ 2.850/mês ✅

### Próximos 3 dias (26-28/04):
**NÃO MEXER EM ADS.**  
Deixar estabilizar. Monitorar vendas diariamente.  
Começar Fase 2 apenas na segunda-feira 28/04.

---

## 🛠️ FASE 2: CONSERTAR FUNIL (28/04-08/05) — 11 dias

### **Meta da fase:**  
Converter 4.5% de visitantes (era 2.2%) **SEM gastar 1 real a mais**.

### Por que o funil está quebrado:

1. **Fotos ruins:** 1-2 fotos por produto (mercado usa 5-7)
2. **Sem calculadora de frete:** cliente não sabe quanto paga até checkout
3. **Botão invisível mobile:** 40% do tráfego é mobile, botão pequeno
4. **Sem guia de medidas:** cliente com dúvida = não compra
5. **Checkout complexo:** 8 campos vs. 5 necessários

### Plano de ataque:

---

### **SEMANA 1 FASE 2 (28/04-02/05): Página de Produto**

#### **Dia 4-5 (Seg-Ter): Sessão de Fotos Urgente**

**17. Selecionar 5 produtos campeões (30min)**

Produtos que mais vendem (verificar WooCommerce):
1. Jaleco Slim Tradicional Feminino
2. Jaleco Slim Princesa Feminino
3. Jaleco Slim Moratty Feminino
4. Jaleco Slim Masculino
5. Jaleco Gold Feminino

**18. Protocolo de fotos por produto (4h/produto)**

Para CADA produto acima, tirar 7 fotos:

**Setup necessário:**
- Celular bom (iPhone/Samsung recente) OU câmera
- Luz natural (perto de janela) ou softbox
- Modelo vestindo o produto
- Fundo neutro (parede branca ou cinza)

**Ângulos obrigatórios:**
- [ ] **Foto 1:** Modelo de frente (corpo inteiro)
  - Pose: natural, mãos ao lado ou nos bolsos
  
- [ ] **Foto 2:** Modelo de costas (corpo inteiro)
  - Mostrar caimento nas costas
  
- [ ] **Foto 3:** Modelo de lado (corpo inteiro)
  - Perfil, mostrar silhueta
  
- [ ] **Foto 4:** Close-up gola e botões
  - Distância: 30cm
  - Foco: detalhes da costura
  
- [ ] **Foto 5:** Close-up bolsos
  - Mostrar profundidade, acabamento
  
- [ ] **Foto 6:** Close-up tecido
  - Macro da textura (gabardine/oxford)
  
- [ ] **Foto 7:** Produto em cabide (estúdio)
  - Fundo branco puro
  - Sem modelo
  - Para Google Shopping

**19. Otimizar imagens (2h)**

```bash
# Instalar ImageMagick se não tem
brew install imagemagick

# Ou usar TinyPNG online: https://tinypng.com/

# Processar em lote:
cd ~/SiteJaleca/fotos-produtos-novas
for img in *.jpg; do
  convert "$img" -resize 1200x1600 -quality 85 "optimized-$img"
done
```

Checklist por imagem:
- [ ] Formato: WebP (principal) + JPG (fallback)
- [ ] Tamanho: < 200KB cada
- [ ] Dimensões: 1200×1600px (ou proporcional)
- [ ] Nome: descritivo (ex: `jaleco-slim-branco-frente.jpg`)

**20. Upload no WooCommerce (1h)**

- [ ] WP Admin → Produtos → [Produto]
- [ ] Galeria de imagens → Adicionar 7 fotos
- [ ] **ORDEM IMPORTA:**
  1. Frente (principal)
  2. Costas
  3. Lado
  4. Close gola
  5. Close bolsos
  6. Close tecido
  7. Cabide

**RESULTADO Dias 4-5:**
- ✅ 5 produtos × 7 fotos = 35 imagens novas
- ✅ Todas otimizadas < 200KB
- ✅ Upload completo no WooCommerce

---

#### **Dia 6 (Qua 30/04): Alt Texts em Massa**

**21. Gerar script de alt text (2h)**

Criar `scripts/add-alt-texts.js`:

```javascript
// Script para adicionar alt text em massa
// Usa WooCommerce REST API

const products = await fetch(`${WP_URL}/wp-json/wc/v3/products`);

for (const product of products) {
  for (const image of product.images) {
    const altText = `Jaleco ${product.name} ${image.position === 0 ? 'Frontal' : 'Detalhe'} - Jaleca`;
    
    await updateImageAlt(image.id, altText);
  }
}
```

**Padrão de alt text:**
```
"Jaleco {nome} {cor} {ângulo} - Jaleca"

Exemplos:
- "Jaleco Slim Tradicional Feminino Branco Frontal - Jaleca"
- "Jaleco Slim Princesa Azul Close-up Gola - Jaleca"
- "Jaleco Gold Masculino Preto Vista Lateral - Jaleca"
```

**22. Executar em todas as imagens (1h)**

```bash
node ~/SiteJaleca/jaleca-nextjs/scripts/add-alt-texts.js
```

- [ ] Confirmar: 600+ imagens processadas
- [ ] Verificar amostra no WP (5 produtos aleatórios)
- [ ] Checar alt text aparece no front-end (inspecionar elemento)

**RESULTADO Dia 6:**
- ✅ 100% das imagens com alt text SEO
- ✅ Google consegue "ler" as fotos
- ✅ Acessibilidade melhorada (leitores de tela)

---

#### **Dia 7 (Qui 01/05): Calculadora de Frete**

**23. Mover calculadora para produto (3h)**

Editar `app/produto/[slug]/ProductDetailClient.tsx`:

```typescript
// Importar componente
import ShippingCalculator from '@/components/ShippingCalculator';

// Adicionar abaixo do botão "Adicionar ao Carrinho"
<ShippingCalculator
  itemCount={1}
  subtotal={selectedVariation?.salePrice || selectedVariation?.regularPrice || 0}
/>
```

**Posicionamento:**
- Desktop: lado direito, abaixo do CTA
- Mobile: full-width, acima das tabs

**24. Pré-preencher CEP salvo (1h)**

```typescript
// No ShippingCalculator.tsx
const [cep, setCep] = useState('');

useEffect(() => {
  const savedCep = localStorage.getItem('jaleca-checkout-cep');
  if (savedCep) setCep(savedCep);
}, []);
```

**25. Destacar frete grátis (1h)**

```typescript
// Se estado for SP/RJ/MG/ES E subtotal >= 499
{isFreeShipping && (
  <div className="bg-green-50 border border-green-200 p-3 rounded">
    <p className="text-green-800 font-medium">
      🎉 Frete PAC GRÁTIS neste pedido!
    </p>
  </div>
)}
```

**RESULTADO Dia 7:**
- ✅ Calculadora em TODAS as páginas de produto
- ✅ CEP pré-preenchido (UX melhor)
- ✅ Frete grátis destacado quando aplicável
- ✅ Cliente sabe o custo ANTES do checkout

---

### **SEMANA 2 FASE 2 (05-08/05): UX e Mobile**

#### **Dia 8-9 (Seg-Ter): Botão CTA Visível**

**26. Aumentar botão desktop (1h)**

```typescript
// ProductDetailClient.tsx
<button className="
  w-full lg:w-[220px]  // era 180px
  h-[52px]             // era 44px
  bg-gradient-to-r from-green-600 to-green-700
  hover:from-green-700 hover:to-green-800
  text-white font-semibold text-lg
  rounded-lg
  shadow-lg hover:shadow-xl
  transform hover:scale-[1.02]
  transition-all duration-200
">
  Adicionar ao Carrinho
</button>
```

**27. Sticky mobile (2h)**

```typescript
// Já implementado em ProductDetailClient
// Verificar se está funcionando:
// - Botão aparece fixo ao rolar para baixo
// - Inclui nome + preço + CTA
// - Safe area no bottom (iPhone)

// Se não está funcionando, debugar IntersectionObserver
```

**28. Teste A/B de cor (2h)**

Criar variante laranja para testar:

```typescript
// Versão A (verde - atual)
bg-gradient-to-r from-green-600 to-green-700

// Versão B (laranja - testar)
bg-gradient-to-r from-orange-500 to-orange-600

// Usar PostHog ou Google Optimize
// Métrica: % de cliques no botão
// Vencedor: rodar por 7 dias, manter a cor com mais cliques
```

**RESULTADO Dias 8-9:**
- ✅ Botão 44% maior (desktop)
- ✅ Sticky mobile funcionando
- ✅ Teste A/B cor rodando

---

#### **Dia 10 (Qua 07/05): Guia de Medidas**

**29. Criar modal de medidas (3h)**

Novo componente `components/MeasurementGuide.tsx`:

```typescript
const sizes = {
  'PP': { busto: '86-90', cintura: '68-72', quadril: '92-96' },
  'P':  { busto: '90-94', cintura: '72-76', quadril: '96-100' },
  'M':  { busto: '94-98', cintura: '76-80', quadril: '100-104' },
  'G':  { busto: '98-104', cintura: '80-86', quadril: '104-110' },
  'GG': { busto: '104-110', cintura: '86-92', quadril: '110-116' },
  'G1': { busto: '110-116', cintura: '92-98', quadril: '116-122' },
  'G2': { busto: '116-122', cintura: '98-104', quadril: '122-128' },
  'G3': { busto: '122-130', cintura: '104-112', quadril: '128-136' },
};

// Tabela + instruções de como medir com fita métrica
// Ilustração (pode usar imagem ou SVG)
```

**30. Adicionar botão no produto (1h)**

```typescript
// Abaixo do seletor de tamanho
<button 
  onClick={() => setShowMeasurementGuide(true)}
  className="text-sm text-green-600 underline"
>
  📏 Guia de Medidas
</button>

<MeasurementGuide 
  isOpen={showMeasurementGuide}
  onClose={() => setShowMeasurementGuide(false)}
/>
```

**RESULTADO Dia 10:**
- ✅ Guia implementado em todos os produtos
- ✅ Modal clean, mobile-friendly
- ✅ Cliente escolhe tamanho certo = menos devoluções

---

#### **Dia 11-12 (Qui-Sex): Mobile Otimização**

**31. Auditoria touch targets (2h)**

```bash
# Usar Chrome DevTools
# Mobile emulation: iPhone SE (tela pequena)

# Elementos < 44×44px para corrigir:
- Botões de cor (seletor)
- Setas da galeria
- Links do footer
- Ícones de conta/carrinho
```

**Correção padrão:**
```typescript
// Adicionar classe em elementos pequenos
className="min-w-[44px] min-h-[44px] flex items-center justify-center"
```

**32. Input zoom fix (verificar) (30min)**

```css
/* globals.css - JÁ IMPLEMENTADO */
/* Verificar se está aplicado: */
input, select, textarea {
  font-size: 16px !important; /* Evita zoom iOS */
}
```

**33. Testar formulário checkout (2h)**

Dispositivos de teste:
- [ ] iPhone SE (tela pequena)
- [ ] iPhone 14 Pro (tela média)
- [ ] Samsung Galaxy S21 (Android)

Testar:
- [ ] Preencher todos os campos
- [ ] Não deve dar zoom involuntário
- [ ] Teclado não esconde campos
- [ ] Botão "Finalizar" sempre visível

**RESULTADO Dias 11-12:**
- ✅ 100% elementos touch-friendly (≥44px)
- ✅ Sem zoom involuntário no iOS
- ✅ Formulário funciona em 3 dispositivos

---

#### **Dia 13-14 (Sáb-Dom ou 12-13/05): Checkout Simplificado**

**34. Remover campos desnecessários (2h)**

**Campos obrigatórios APENAS:**
- Nome completo
- Email
- CPF
- Telefone
- CEP (autocomplete endereço)
- Número
- Bairro (se ViaCEP não preencher)

**Remover:**
- ❌ Complemento (opcional → remover)
- ❌ Empresa (B2C não precisa)
- ❌ "Criar conta" (fazer automático)

**35. Guest checkout (1h)**

```typescript
// CheckoutClient.tsx
// Remover checkbox "Criar conta"
// SEMPRE criar conta com senha temp (enviar email depois)

// Fluxo:
// 1. Cliente compra sem logar
// 2. Sistema cria conta automaticamente
// 3. Email: "Sua compra foi confirmada! Defina sua senha aqui"
```

**36. Barra de progresso (2h)**

```typescript
// components/CheckoutProgress.tsx
const steps = [
  { num: 1, label: 'Carrinho', done: true },
  { num: 2, label: 'Dados', done: currentStep >= 2 },
  { num: 3, label: 'Pagamento', done: currentStep === 3 },
];

// Visual: 3 círculos conectados com linha
// Ativo: verde, Futuro: cinza
```

**37. Trust badges (1h)**

```typescript
// Adicionar abaixo do botão "Finalizar Compra"
<div className="flex gap-4 justify-center mt-4 opacity-70">
  <span className="text-xs">🔒 Compra Segura SSL</span>
  <span className="text-xs">✅ Dados Protegidos</span>
  <span className="text-xs">💬 Suporte WhatsApp</span>
</div>
```

**38. WhatsApp flutuante (30min)**

```typescript
// Mostrar APENAS no /checkout e /finalizar-compra
{isCheckoutPage && (
  <a
    href="https://wa.me/5531992901940"
    className="fixed bottom-20 right-4 z-50
               bg-green-500 text-white p-4 rounded-full
               shadow-2xl hover:scale-110 transition"
  >
    💬 Ajuda
  </a>
)}
```

**RESULTADO Dias 13-14:**
- ✅ Checkout em 3 steps (era confuso antes)
- ✅ Apenas campos necessários
- ✅ Guest checkout automático
- ✅ WhatsApp visível para ajuda

---

## ✅ CHECKPOINT FASE 2 (fim do Dia 14)

### Você deve ter:
- [x] 5 produtos com 7 fotos cada (35 imagens)
- [x] Alt texts em todas as imagens (600+)
- [x] Calculadora de frete em produto
- [x] Botão CTA maior e sticky mobile
- [x] Guia de medidas implementado
- [x] Mobile 100% touch-friendly
- [x] Checkout simplificado (3 steps)

### Métricas para conferir (14/05):
```bash
# Rodar script de métricas
node scripts/dashboard.mjs
```

**Esperar ver:**
- AddToCart: 2.2% → **3.5-4.0%** (melhoria de 60%)
- Checkout completion: 37% → **50%+**
- Bounce rate Paid: 72% → **60%** (ainda alto, mas melhorando)

**Se não melhorou:** revisar implementação, testar UX com usuário real.

---

## 🔍 FASE 3: SEO BÁSICO (15/05-30/05) — 16 dias

### **Meta da fase:**  
Aparecer no Google organicamente. +157 cliques/semana GRÁTIS.

### Estado atual SEO (doloroso):
- 1 de 18 keywords no top 100
- "jalecos" posição 47 (página 5 — ninguém vê)
- Tráfego orgânico: 143 cliques/sem (migalhas)
- Blog: 6 posts genéricos sem estratégia

### Estratégia:

**NÃO vamos:**
- ❌ Criar 1000 posts
- ❌ Comprar backlinks duvidosos
- ❌ Fazer black hat

**VAMOS:**
- ✅ Otimizar 5 páginas principais (on-page perfeito)
- ✅ Criar 3 páginas profissão (alta intenção comercial)
- ✅ Publicar 2 posts pilares (featured snippet)
- ✅ Outreach honesto (15 emails)

---

### **SEMANA 3 FASE 3 (15-21/05): On-Page**

#### **Dia 15-16 (Qui-Sex): Otimizar Páginas Principais**

**39. Home (/) — 2h**

```typescript
// app/page.tsx - metadata
title: "Jalecos Femininos e Masculinos Premium | Jaleca — Conforto e Elegância"
description: "Jalecos profissionais para médicas, dentistas e enfermeiras. Modelos Slim, Princesa e Acinturado. Frete Grátis SP·RJ·MG·ES acima de R$499. 3x sem juros."

// Adicionar seção de conteúdo (300 palavras)
<section className="container mx-auto px-4 py-12">
  <h1>Jalecos Premium para Profissionais da Saúde</h1>
  <p>
    Há mais de [X anos], a Jaleca veste profissionais que sabem que 
    apresentação importa. Nossos jalecos combinam elegância, conforto 
    e durabilidade para médicas, dentistas, enfermeiras e todos os 
    profissionais da saúde que valorizam qualidade.
  </p>
  <h2>Por que escolher Jaleca</h2>
  <ul>
    <li>Tecidos premium: gabardine e oxford de alta gramatura</li>
    <li>Modelagem exclusiva: Slim, Princesa, Acinturado</li>
    <li>Conforto para plantões longos</li>
    <li>Frete grátis no Sudeste acima de R$499</li>
  </ul>
  <h2>Profissionais que atendemos</h2>
  <p>
    Médicas, dentistas, enfermeiras, veterinárias, esteticistas, 
    nutricionistas, farmacêuticas, biomédicas e todos os profissionais 
    da área da saúde.
  </p>
</section>

// Schema Organization (já existe, validar)
```

**40. Categoria Jalecos Femininos (/categoria/jalecos-femininos) — 3h**

```typescript
// app/categoria/[slug]/page.tsx
// Para slug === 'jalecos-femininos'

title: "Jalecos Femininos Modernos | Modelos Exclusivos para Médicas e Dentistas | Jaleca"
description: "Jalecos femininos Slim, Princesa e Acinturado. Tecido premium, modelagem exclusiva. Frete Grátis SP·RJ·MG·ES. Confira!"

// Conteúdo (400 palavras)
<div className="prose max-w-none mb-8">
  <h1>Jalecos Femininos — Elegância e Conforto Profissional</h1>
  
  <p className="lead">
    Descubra a linha completa de jalecos femininos Jaleca: modelos 
    que combinam elegância, conforto e praticidade para o dia a dia 
    de profissionais da saúde.
  </p>

  <h2>Por que escolher nossos jalecos femininos</h2>
  <p>
    Nossos jalecos são desenvolvidos pensando nas necessidades reais 
    de médicas, dentistas e enfermeiras. Tecidos que não amarrotam, 
    bolsos estratégicos, modelagem que valoriza sem apertar.
  </p>

  <h2>Modelos disponíveis</h2>
  <ul>
    <li><strong>Jaleco Slim:</strong> modelagem moderna, cintura marcada</li>
    <li><strong>Jaleco Princesa:</strong> recortes laterais, caimento perfeito</li>
    <li><strong>Jaleco Acinturado:</strong> elegância clássica com cinto</li>
    <li><strong>Jaleco Bordado:</strong> personalização com seu nome</li>
  </ul>

  <h2>Tecidos e cores</h2>
  <p>
    Trabalhamos com gabardine premium (não amarra, não desbota) e 
    oxford (respirável, ideal para clima quente). Cores disponíveis: 
    branco tradicional, azul, rosa, preto, cinza.
  </p>

  <h2>Para quem é indicado</h2>
  <p>
    Médicas, dentistas, enfermeiras, veterinárias, esteticistas, 
    nutricionistas e todas as profissionais da saúde que valorizam 
    apresentação impecável.
  </p>

  <h2>Frete grátis no Sudeste</h2>
  <p>
    Pedidos acima de R$499 têm frete PAC grátis para SP, RJ, MG e ES. 
    Entrega em até 7 dias úteis.
  </p>
</div>

// Schema CollectionPage
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Jalecos Femininos",
  "description": "...",
  "url": "https://jaleca.com.br/categoria/jalecos-femininos"
}
```

**41. Categoria Jalecos (/categoria/jalecos) — 2h**

```typescript
title: "Jalecos Profissionais Brancos e Coloridos | Jaleca — Qualidade Premium"
description: "Jalecos para médicos, dentistas e profissionais da saúde. Feminino e masculino. Tecidos premium. Frete Grátis no Sudeste. Confira!"

// Conteúdo (350 palavras)
// Estrutura similar à categoria feminina
// Incluir masculino + unissex
```

**42. Página Produtos (/produtos) — 1h**

```typescript
title: "Todos os Jalecos e Uniformes Profissionais | Jaleca"
description: "Catálogo completo Jaleca: jalecos femininos, masculinos, dólmãs, conjuntos scrub e pijamas cirúrgicos. Qualidade premium. Frete Grátis no Sudeste."

// Conteúdo (250 palavras)
<h1>Uniformes Profissionais para Saúde</h1>
<p>Explore nossa linha completa...</p>
```

**43. Produto Principal (Jaleco Slim Tradicional) — 1h**

```typescript
// Editar no WooCommerce:

// SEO Title:
"Jaleco Slim Tradicional Feminino Branco | Moderno e Confortável | Jaleca"

// Meta Description:
"Jaleco Slim Tradicional: modelagem moderna, tecido premium gabardine. Ideal para médicas e dentistas. Frete Grátis no Sudeste. 3x sem juros. Compre agora!"

// Adicionar H2s na descrição do produto:
- Características do Jaleco Slim Tradicional
- Para quem é indicado
- Tecido e cuidados
- Tabela de medidas
```

**RESULTADO Dias 15-16:**
- ✅ 5 páginas otimizadas (Home, 2 categorias, /produtos, 1 produto)
- ✅ 1.500+ palavras de conteúdo denso
- ✅ H1, H2, meta descriptions perfeitos
- ✅ Schema markup validado

---

#### **Dia 17-18 (Sáb-Dom ou 19-20/05): Links Internos**

**44. Mapear estrutura (2h)**

```
Home (/)
├─ Jalecos Femininos (/categoria/jalecos-femininos)
│  ├─ Slim Tradicional
│  ├─ Slim Princesa
│  └─ Slim Moratty
├─ Jalecos Masculinos (/categoria/jalecos-masculinos)
├─ Dólmãs (/categoria/dolmas)
└─ Conjuntos (/categoria/conjuntos)
```

**45. Implementar breadcrumbs (3h)**

```typescript
// components/Breadcrumbs.tsx
<nav aria-label="breadcrumb">
  <ol className="flex gap-2 text-sm">
    <li><Link href="/">Início</Link></li>
    <li>/</li>
    <li><Link href="/categoria/jalecos">Jalecos</Link></li>
    <li>/</li>
    <li>Slim Tradicional</li>
  </ol>
</nav>

// Adicionar em:
// - app/produto/[slug]/page.tsx
// - app/categoria/[slug]/page.tsx
// - app/produtos/page.tsx
```

**46. Produtos relacionados (2h)**

```typescript
// ProductDetailClient.tsx
// Já existe seção "Você também pode gostar"
// Verificar se está puxando produtos da mesma categoria

// Se não está, corrigir:
const relatedProducts = allProducts
  .filter(p => 
    p.categories.some(c => currentProduct.categories.includes(c)) &&
    p.id !== currentProduct.id
  )
  .slice(0, 4);
```

**47. Footer com links (1h)**

```typescript
// components/Footer.tsx
// Adicionar seção "Produtos"

<div>
  <h3>Produtos</h3>
  <ul>
    <li><Link href="/categoria/jalecos-femininos">Jalecos Femininos</Link></li>
    <li><Link href="/categoria/jalecos-masculinos">Jalecos Masculinos</Link></li>
    <li><Link href="/categoria/dolmas">Dólmãs</Link></li>
    <li><Link href="/categoria/conjuntos">Conjuntos Scrub</Link></li>
  </ul>
</div>
```

**RESULTADO Dias 17-18:**
- ✅ Breadcrumbs em todas as páginas
- ✅ Produtos relacionados funcionando
- ✅ Footer com links para categorias
- ✅ Estrutura hierárquica clara

---

### **SEMANA 4 FASE 3 (22-30/05): Conteúdo e Profissões**

#### **Dia 22-24 (Qui-Sáb): Páginas de Profissão**

**48. Criar /jaleco-dentista (4h)**

```typescript
// app/jaleco-dentista/page.tsx

export const metadata = {
  title: "Jaleco para Dentista Feminino e Masculino | Conforto e Higiene | Jaleca",
  description: "Jalecos profissionais para dentistas: tecido antimicrobiano, manga longa/curta, modelos modernos. Frete Grátis no Sudeste. Confira!"
};

// Conteúdo (600 palavras)
<article className="prose max-w-4xl mx-auto p-8">
  <h1>Jalecos Profissionais para Dentistas</h1>
  
  <p className="lead">
    O jaleco do dentista precisa aliar higiene impecável, conforto 
    durante procedimentos longos e uma apresentação que transmita 
    confiança. Descubra por que centenas de dentistas escolhem Jaleca.
  </p>

  <h2>Por que dentistas precisam de jalecos específicos</h2>
  <p>
    A rotina do consultório odontológico exige jalecos que:
  </p>
  <ul>
    <li>Resistam a múltiplas lavagens com produtos químicos</li>
    <li>Tenham tecido que não retenha odores</li>
    <li>Ofereçam bolsos para instrumentos pequenos</li>
    <li>Permitam movimento livre dos braços (exame bucal)</li>
    <li>Transmitam profissionalismo ao paciente</li>
  </ul>

  <h2>Características ideais do jaleco para dentista</h2>
  
  <h3>Tecido</h3>
  <p>
    Nossos jalecos usam gabardine premium (67% poliéster, 33% algodão) 
    ou oxford (100% algodão com tratamento). Ambos são:
  </p>
  <ul>
    <li>Resistentes a manchas de sangue e produtos químicos</li>
    <li>Fáceis de lavar (máquina, 60°C)</li>
    <li>Não desbotam mesmo com cloro diluído</li>
    <li>Secagem rápida</li>
  </ul>

  <h3>Manga</h3>
  <p>
    Oferecemos manga longa (proteção total) e manga 3/4 (mais fresca, 
    ideal para climas quentes). A manga curta NÃO é recomendada para 
    dentistas por questão de biossegurança.
  </p>

  <h3>Bolsos</h3>
  <p>
    2 bolsos frontais grandes (para luvas, máscaras) + 1 bolso interno 
    (para caneta, celular). Posicionamento estratégico para não atrapalhar 
    movimentos.
  </p>

  <h3>Gola</h3>
  <p>
    Gola padre (fechada até o pescoço) para proteção. Botões de pressão 
    ou zíper frontal para vestir/tirar rapidamente.
  </p>

  <h2>Modelos recomendados para dentistas</h2>
  
  <ProductGrid category="jalecos" highlighted={['slim-tradicional', 'oxford-manga-longa']} />
  
  <h3>Jaleco Slim Tradicional (Feminino)</h3>
  <p>
    Modelagem moderna sem perder funcionalidade. Cintura marcada, 
    mangas 3/4, 2 bolsos. Gabardine branca ou azul.
  </p>

  <h3>Jaleco Oxford Manga Longa (Masculino)</h3>
  <p>
    Corte reto, manga longa, 3 bolsos. Oxford respirável. Ideal para 
    profissionais que preferem proteção total.
  </p>

  <h2>Cuidados e higienização</h2>
  <ol>
    <li>Lavar após cada turno (manhã/tarde)</li>
    <li>Usar sabão neutro ou alvejante sem cloro</li>
    <li>Temperatura: até 60°C (mata bactérias)</li>
    <li>Secar à sombra (preserva cor)</li>
    <li>Passar com ferro médio (vincos profissionais)</li>
  </ol>

  <h2>Perguntas frequentes</h2>
  
  <h3>Posso usar jaleco colorido no consultório?</h3>
  <p>
    Sim. Jalecos azul, rosa ou cinza são aceitos. O branco ainda é 
    maioria por tradição, mas a escolha é sua.
  </p>

  <h3>Qual tamanho escolher?</h3>
  <p>
    Use nosso <a href="#guia-medidas">guia de medidas</a>. Dentistas 
    geralmente preferem um número acima para conforto ao estender braços.
  </p>

  <h3>Quanto tempo dura um jaleco Jaleca?</h3>
  <p>
    Com cuidados corretos, 12-18 meses de uso diário. Recomendamos ter 
    3 jalecos em rotação (lavar 1, usar 1, reserva 1).
  </p>

  <CTASection>
    <h2>Encontre o jaleco ideal para sua rotina</h2>
    <p>Frete grátis no Sudeste acima de R$499. 3x sem juros.</p>
    <Button href="/categoria/jalecos">Ver Jalecos para Dentistas</Button>
  </CTASection>
</article>

// Schema Article + FAQPage
```

**49. Criar /jaleco-para-medica (4h)**

Estrutura similar, adaptar para médicas:
- Enfoque: plantões longos, bolsos para estetoscópio
- Modelos: Slim Princesa, Acinturado, Bordado
- Keywords: "jaleco feminino para médica", "jaleco moderno medicina"

**50. Criar /jaleco-para-enfermeira (4h)**

Estrutura similar, adaptar para enfermeiras:
- Enfoque: durabilidade, resistência a fluidos, movimento constante
- Modelos: Slim Tradicional, Scrub (conjunto)
- Keywords: "jaleco enfermagem", "scrub enfermeira"

**RESULTADO Dias 22-24:**
- ✅ 3 páginas profissão com 600 palavras cada
- ✅ Schema Article + FAQPage
- ✅ Links internos para produtos
- ✅ SEO otimizado para long-tail (baixa concorrência)

---

#### **Dia 25-27 (Dom-Ter ou 25-27/05): Blog Posts Pilares**

**51. Post 1: "Como Escolher o Jaleco Ideal: Guia Completo 2026" (6h)**

```bash
# Acessar admin do blog
open https://jaleca.com.br/blog/admin/novo-post
```

**Estrutura:**
- Título: "Como Escolher o Jaleco Ideal: Guia Completo 2026"
- Slug: `como-escolher-jaleco-ideal-guia-2026`
- Keywords primária: "como escolher jaleco"
- Keywords secundárias: "melhor jaleco", "jaleco ideal"
- Palavras: 1.500+

**Outline:**
1. Introdução (100 palavras)
   - Por que o jaleco certo importa
   
2. Escolher por tipo de tecido (300 palavras)
   - Gabardine: características, prós, contras
   - Oxford: características, prós, contras
   - Elastano: quando usar
   - Tabela comparativa
   
3. Escolher por tamanho (250 palavras)
   - Como medir corretamente
   - Tabela de medidas
   - Dica: número acima ou justo?
   
4. Escolher por cor (200 palavras)
   - Branco: tradição, limpeza
   - Azul: modernidade, manchas menos visíveis
   - Preto/Cinza: elegância
   - Profissões e cores recomendadas
   
5. Escolher por profissão (300 palavras)
   - Médico: bolsos, manga longa
   - Dentista: resistência química
   - Enfermeira: durabilidade
   - Veterinária: impermeabilidade
   
6. Cuidados para durar mais (200 palavras)
   - Lavagem correta
   - Temperatura
   - Produtos recomendados
   
7. Conclusão + CTA (150 palavras)

**Usar gerador IA do blog:**
- Estilo: "especialista-pratico"
- Depois: Botão "Humanizar Texto"
- Adicionar 5 imagens (Unsplash: medical, doctor, nurse)
- Schema: Article + HowTo

**52. Post 2: "Melhores Tecidos para Jaleco: Gabardine vs Oxford vs Elastano" (6h)**

**Estrutura:**
- Título: "Gabardine, Oxford ou Elastano: Qual o Melhor Tecido para Jaleco?"
- Slug: `melhores-tecidos-jaleco-comparacao-2026`
- Keywords: "melhor tecido jaleco", "jaleco gabardine", "jaleco oxford"
- Palavras: 1.200+

**Outline:**
1. Intro (100 palavras)
2. Gabardine (300 palavras)
   - Composição, gramatura, vantagens
3. Oxford (300 palavras)
   - Composição, respirabilidade, casos de uso
4. Elastano (200 palavras)
   - Conforto, elasticidade, limitações
5. Tabela comparativa (150 palavras)
   - Durabilidade, preço, conforto, resistência
6. Qual escolher para sua profissão (250 palavras)
7. Conclusão + CTA (100 palavras)

**Adicionar:**
- Tabela HTML comparativa
- 3 imagens de close-up tecidos
- Schema: Article

**RESULTADO Dias 25-27:**
- ✅ 2 posts blog SEO-otimizados (2.700 palavras total)
- ✅ Schema Article + HowTo + FAQPage
- ✅ Imagens com alt text
- ✅ Links internos para produtos/categorias

---

#### **Dia 28-30 (Qua-Sex): Outreach Inicial**

**53. Listar prospects (3h)**

Criar planilha `OUTREACH-SEO-2026.xlsx`:

| # | Site | Tipo | Contato | Status |
|---|------|------|---------|--------|
| 1 | enfermagem.blog.br | Blog enfermagem | contato@ | - |
| 2 | odontobr.com | Portal odonto | redacao@ | - |
| ... | ... | ... | ... | ... |

**20 prospects (categorias):**
- 5 blogs de enfermagem
- 5 portais de odontologia
- 3 sites de moda profissional
- 4 influenciadoras Instagram (saúde)
- 3 associações de classe (CRO, COREN)

**Como encontrar:**
```bash
# Google:
"blog de enfermagem" + "contato"
"portal odontologia" + "parceria"
"influenciadora dentista" + "@gmail"
```

**54. Template de email (2h)**

**Versão A (Guest Post):**
```
Assunto: Parceria de conteúdo — Jaleca + [Nome do Site]

Olá [Nome],

Meu nome é [Seu Nome] e represento a Jaleca, e-commerce de 
uniformes profissionais para saúde.

Acompanho o [Nome do Site] há algum tempo e admiro muito o 
conteúdo de qualidade que vocês produzem sobre [tema].

Gostaríamos de propor uma parceria de conteúdo:

✅ Artigo exclusivo escrito por nós (700-1000 palavras)
✅ Tema: [Como Escolher Jaleco Ideal / Cuidados com Uniformes]
✅ Conteúdo educativo, NÃO promocional
✅ 1 link discreto para nossa loja (contexto natural)
✅ Imagens originais de alta qualidade

Em troca, poderíamos:
- Mencionar o [Nome do Site] em nossas redes sociais (X mil seguidores)
- OU oferecer cupom exclusivo para sua audiência (15% desconto)

Teria interesse em conversar sobre isso?

Abraço,
[Seu Nome]
Jaleca — Uniformes Profissionais
contato@jaleca.com.br
```

**Versão B (Backlink via Recurso):**
```
Assunto: Recurso útil para seu artigo sobre [tema]

Olá [Nome],

Estava lendo seu artigo "[Título do Artigo]" e achei excelente!

Notei que você menciona [tema relacionado a jalecos]. Criamos 
recentemente um guia completo sobre isso que pode ser útil para 
complementar seu conteúdo:

[Link para blog post pilar]

Se achar relevante, sinta-se à vontade para linkar como recurso 
adicional para seus leitores. Sem compromisso :)

Obrigado pelo conteúdo de qualidade!

[Seu Nome]
```

**55. Enviar primeiros 5 emails (2h)**

- [ ] Personalizar cada email (nome, site, artigo específico)
- [ ] Enviar de contato@jaleca.com.br
- [ ] Registrar na planilha (data, versão usada)
- [ ] Follow-up em 7 dias se não responder

**56. Preparar próximos 15 (1h)**

- [ ] Rascunhar emails no Gmail (salvar como rascunho)
- [ ] Enviar 5/semana nas próximas 3 semanas
- [ ] Meta: 3 respostas positivas de 20 (15% taxa)

**RESULTADO Dias 28-30:**
- ✅ 20 prospects mapeados
- ✅ 2 templates de email prontos
- ✅ 5 emails enviados (primeiros contatos)
- ✅ Sistema de follow-up organizado

---

## ✅ CHECKPOINT FASE 3 (fim do Dia 30 — 30/05)

### Você deve ter:
- [x] 5 páginas principais otimizadas (Home, categorias, produtos)
- [x] Breadcrumbs + links internos implementados
- [x] 3 páginas de profissão (dentista, médica, enfermeira) — 1.800 palavras
- [x] 2 posts blog pilares (como escolher, tecidos) — 2.700 palavras
- [x] 20 prospects mapeados + 5 emails enviados

### Métricas para conferir (01/06):
```bash
# Google Search Console
# Verificar últimos 28 dias vs. 28 dias anteriores

Cliques orgânicos: 143/sem → 180-200/sem (+30%)
Impressões: ??? → +50% (páginas novas sendo indexadas)
Keywords top 100: 1 → 3-4 (páginas profissão ranking)
```

**Se não melhorou:**  
SEO demora 2-4 semanas. Aguardar até 15/06 para reavaliar.

---

## 🚀 FASE 4: ESCALAR (01/06-22/06) — 22 dias

### **Meta da fase:**  
Reativar ADS com site que converte. ROAS 2.5x sustentável.

### Pré-requisitos antes de escalar:

**CHECKLIST GO/NO-GO:**
- [ ] Tag Google Ads: 100% conversões rastreadas (verificar últimos 7 dias)
- [ ] Merchant Center: aprovado (0 produtos rejeitados)
- [ ] AddToCart: ≥ 4% (conferir GA4)
- [ ] Checkout completion: ≥ 60% (funil não vaza mais)

**Se algum item acima falhou:**  
❌ NÃO ESCALAR. Voltar para Fase 2, corrigir.

**Se todos os itens passaram:**  
✅ PROSSEGUIR.

---

### **SEMANA 5-6 FASE 4 (01-15/06): Retomar ADS**

#### **Dia 31-33 (Dom-Ter ou 01-03/06): Google Ads Reativação Cautelosa**

**57. Baseline pré-escala (1h)**

```bash
# Rodar dashboard
node scripts/dashboard.mjs

# Anotar:
- ROAS Google atual (últimos 7 dias)
- Conversões/dia (média)
- CPC médio
- CTR
```

**58. Reativar Core - Jalecos com budget baixo (2h)**

```bash
# Via script
node scripts/reativar-google-core-conservador.js
```

Configuração:
- **Campaign:** Core - Jalecos
- **Status:** Ativo
- **Budget:** R$ 30/dia (começar baixo)
- **Bidding:** Maximizar cliques (por enquanto)
- **CPC máx:** R$ 2,50
- **Keywords:** manter as atuais (já negativadas)

**Monitoramento D+1, D+2, D+3:**
```bash
# Checar ROAS diariamente
node scripts/check-google-roas.js

# Se ROAS > 2.0 após 3 dias: aumentar R$ 10/dia
# Se ROAS < 1.5 após 3 dias: PAUSAR, investigar
```

**59. Aumentar Shopping (2h)**

```bash
node scripts/aumentar-google-shopping.js
```

- **Campaign:** Shopping - Produtos
- **Budget:** R$ 15 → R$ 30/dia
- **Motivo:** Merchant Center agora ativo (antes estava competindo sem feed)

**60. Criar Performance Max (NOVA) (4h)**

```bash
# Via Google Ads UI (API não suporta bem PMax ainda)
```

**Setup:**
- **Nome:** Performance Max - Jaleca Geral
- **Budget:** R$ 20/dia
- **Objetivo:** Vendas
- **Conversion goal:** Purchase
- **Segmentação:** Brasil todo
- **Assets:**
  - Logo: `/logo-cropped.jpg`
  - Imagens: 5 produtos mais vendidos (usar fotos novas)
  - Vídeos: (se tiver)
  - Headlines: 5 variações
    - "Jalecos Premium para Profissionais da Saúde"
    - "Frete Grátis no Sudeste Acima de R$499"
    - "3x Sem Juros em Todos os Jalecos"
    - "Jaleco Feminino Slim Moderno"
    - "Qualidade Jaleca Desde [Ano]"
  - Descrições: 3 variações (90 caracteres cada)
  - Call-to-action: "Compre agora"

**Aguardar 7 dias de aprendizado.**  
Não mexer no PMax nos primeiros 7 dias (Google otimiza sozinho).

**RESULTADO Dias 31-33:**
- ✅ Core reativado (R$ 30/dia)
- ✅ Shopping aumentado (R$ 30/dia)
- ✅ Performance Max criado (R$ 20/dia)
- ✅ Novo budget Google: R$ 85/dia (era R$ 30)

---

#### **Dia 34-37 (Qua-Sáb ou 04-07/06): Meta Ads Escalar Remarketing**

**61. Remarketing Carrinho: aumentar gradualmente (4 dias)**

**Dia 34:** R$ 70 → R$ 80/dia
```bash
node scripts/meta-aumentar-remarketing.js --budget 80
```

**Dia 35:** R$ 80 → R$ 90/dia  
**Dia 36:** R$ 90 → R$ 100/dia  
**Dia 37:** Manter R$ 100/dia se ROAS > 3.0

**Monitoramento diário:**
```bash
node scripts/check-meta-roas.js --campaign remarketing
```

**Se ROAS cair abaixo de 2.5:**  
Parar de escalar. Manter budget atual.

**62. Lookalike 1% (REATIVAR) (2h)**

```bash
node scripts/meta-reativar-lookalike.js
```

- **Campanha:** Prospecção - Lookalike 1%
- **Seed:** Compradores últimos 90 dias (atualizar)
- **Criativo:** Imagem estática (NÃO vídeo por enquanto)
  - Usar foto produto (Slim Tradicional) + copy forte
  - Copy: "Antes de você falar, sua imagem já foi avaliada. Vista o que você merece. 🩺"
- **Budget:** R$ 30/dia
- **Placement:** Feed + Stories (desligar Audience Network)

**Aguardar 5 dias.**  
Se ROAS > 2.0: manter.  
Se ROAS < 1.5: pausar novamente.

**63. Prospecção Estática (NOVA) (3h)**

Criar nova campanha:
- **Nome:** Prospecção - Interesse Saúde - Estática
- **Objetivo:** Vendas
- **Budget:** R$ 20/dia
- **Público:**
  - Mulheres, 25-50 anos
  - Brasil
  - Interesses: Saúde, Medicina, Odontologia, Enfermagem
- **Criativo:**
  - Imagem: carrossel 3 produtos (Slim Tradicional, Princesa, Moratty)
  - Copy principal: "Jalecos que médicas e dentistas amam. Modelagem exclusiva, tecido premium. Frete Grátis no Sudeste."
  - CTA: "Comprar agora"

**RESULTADO Dias 34-37:**
- ✅ Remarketing escalado para R$ 100/dia (ROAS mantido)
- ✅ Lookalike reativado (R$ 30/dia)
- ✅ Prospecção criada (R$ 20/dia)
- ✅ Novo budget Meta: R$ 150/dia (era R$ 80)

---

#### **Dia 38-45 (Dom-Dom ou 08-15/06): Otimização Contínua**

**64. Monitoramento diário (15min/dia)**

Criar rotina:
```bash
# Todo dia às 9h
node scripts/daily-ads-report.js

# Gera relatório:
# - ROAS geral
# - ROAS por campanha
# - Budget gasto/restante
# - Conversões
# - Alertas (ROAS < 2.0, budget excedido)
```

**65. Ajustes por performance (variável)**

**Regras automáticas:**

Google Ads:
- Se ROAS campanha > 3.0 por 3 dias: aumentar budget 15%
- Se ROAS campanha < 1.5 por 2 dias: pausar campanha
- Se CPC > R$ 3,50: reduzir lance máximo

Meta Ads:
- Se ROAS > 4.0 por 3 dias: aumentar budget 20%
- Se ROAS < 2.0 por 2 dias: pausar ad set
- Se CPM > R$ 50: revisar segmentação (muito específica)

**66. Teste A/B criativo (1/semana)**

**Semana 6 (08-15/06):**  
Testar 2 variações de copy no Lookalike:

- **Versão A (atual):**  
  "Antes de você falar, sua imagem já foi avaliada..."
  
- **Versão B (nova):**  
  "O jaleco certo faz toda a diferença. Modelagem exclusiva Jaleca. Frete Grátis no Sudeste. 🩺"

Rodar 50/50 por 7 dias. Vencedor: manter, pausar perdedor.

**RESULTADO Dias 38-45:**
- ✅ Sistema de monitoramento diário funcionando
- ✅ Regras automáticas configuradas
- ✅ Primeiro teste A/B rodando

---

### **SEMANA 7-8 FASE 4 (16-22/06): SEO Avançado + CRO**

#### **Dia 46-50 (Seg-Sex): Criar Mais Páginas Profissão**

**67. Criar 5 novas páginas (2h cada = 10h total)**

Seguir mesmo modelo de Dentista/Médica/Enfermeira:

- [ ] /jaleco-para-veterinaria
  - Keywords: "jaleco veterinária", "jaleco clínica veterinária"
  - Diferencial: resistência a pelos, fluidos, impermeabilidade
  
- [ ] /jaleco-esteticista
  - Keywords: "jaleco esteticista", "jaleco estética"
  - Diferencial: elegância, cores modernas, conforto
  
- [ ] /jaleco-para-farmaceutica
  - Keywords: "jaleco farmácia", "jaleco farmacêutica"
  - Diferencial: manga longa, bolsos, tradicional
  
- [ ] /jaleco-nutricionista
  - Keywords: "jaleco nutricionista", "jaleco consultório"
  - Diferencial: cores além do branco, moderno
  
- [ ] /jaleco-para-biomedica
  - Keywords: "jaleco biomedicina", "jaleco laboratório"
  - Diferencial: resistência química, manga longa

**68. Publicar 4 novos posts blog (3h cada = 12h total)**

Temas (escolher dos mais buscados no GSC):

- [ ] "Como Lavar Jaleco Branco: Guia Definitivo 2026"
- [ ] "Jaleco com Elastano Vale a Pena? Prós e Contras"
- [ ] "7 Erros Comuns ao Escolher Jaleco (e Como Evitar)"
- [ ] "Jaleco Masculino vs Feminino: Diferenças de Modelagem"

**RESULTADO Dias 46-50:**
- ✅ 5 páginas profissão (total: 8)
- ✅ 4 posts blog (total: 6)
- ✅ 5.000+ palavras de conteúdo novo

---

#### **Dia 51-54 (Sáb-Ter): Outreach Intensivo**

**69. Enviar mais 15 emails (3h)**

Usar os 15 prospects restantes da lista.  
Personalizar cada um.  
Meta: 2-3 backlinks confirmados.

**70. Follow-up dos 5 primeiros (1h)**

Se não responderam em 2 semanas, enviar:

```
Assunto: Re: Parceria de conteúdo — Jaleca + [Site]

Olá [Nome],

Enviei uma mensagem há algumas semanas sobre parceria de conteúdo.

Imagino que esteja ocupado(a), mas queria saber se ainda teria 
interesse em conversar sobre isso. Sem pressão :)

Caso não seja o momento, tudo bem! Agradeço de qualquer forma.

Abraço,
[Seu Nome]
```

**71. Fechar primeiros backlinks (variável)**

Se algum prospect aceitar:
- [ ] Escrever artigo guest post (700-1000 palavras)
- [ ] Revisar com Gemini (evitar palavras IA)
- [ ] Enviar para aprovação
- [ ] Divulgar nas redes sociais quando publicar

**RESULTADO Dias 51-54:**
- ✅ 15 emails enviados (total: 20)
- ✅ Follow-up dos primeiros 5
- ✅ Meta: 3 backlinks confirmados

---

#### **Dia 55-60 (Qua-Seg): CRO e Testes A/B**

**72. Teste A/B #1: Cor do botão (3 dias)**

```typescript
// ProductDetailClient.tsx
// Usar feature flag ou cookie

const buttonColor = getCookie('ab-button-color') || randomAB();

<button className={
  buttonColor === 'A' 
    ? 'bg-gradient-to-r from-green-600 to-green-700'
    : 'bg-gradient-to-r from-orange-500 to-orange-600'
}>
```

**Métricas:**
- A: verde (controle)
- B: laranja (teste)
- Rodar por 3 dias
- Métrica: % cliques no botão (GA4 event)
- Vencedor: cor com maior taxa de clique

**73. Teste A/B #2: Threshold frete grátis (3 dias)**

```typescript
// ShippingCalculator.tsx
const freeShippingMin = getABVariant() === 'A' ? 499 : 399;
```

**Métricas:**
- A: R$ 499 (controle)
- B: R$ 399 (teste — mais generoso)
- Rodar por 3 dias
- Métrica: ticket médio, conversão checkout
- Vencedor: variante com maior lucro (vendas × margem - frete)

**⚠️ ATENÇÃO:**  
Se B vencer mas margem cair muito, não vale a pena.  
Calcular: (ticket × margem) - custo frete = lucro real.

**74. Teste A/B #3: Copy do botão (3 dias)**

```typescript
const buttonText = getABVariant() === 'A' 
  ? 'Adicionar ao Carrinho'
  : 'Comprar Agora';
```

**Métricas:**
- A: "Adicionar ao Carrinho" (padrão)
- B: "Comprar Agora" (mais urgente)
- Métrica: taxa de clique
- Vencedor: copy com maior clique

**75. Análise heatmap (2h)**

```bash
# ContentSquare já instalado
# Acessar dashboard: https://app.contentsquare.com/
```

Verificar:
- [ ] Onde usuários clicam mais (homepage)
- [ ] Até onde rolam (produto)
- [ ] Elementos ignorados (remover se inúteis)
- [ ] Dead clicks (elementos que parecem clicáveis mas não são)

**Ações:**
- Mover elementos importantes "acima da dobra"
- Remover distrações (se houver)
- Aumentar CTAs que não estão sendo vistos

**76. Revisão final funil (2h)**

```bash
# GA4 → Exploração → Funil
# Configurar:
# 1. View Product
# 2. Add to Cart
# 3. Begin Checkout
# 4. Add Payment Info
# 5. Purchase

# Identificar maior vazamento
# Ex: se 60% saem entre Add to Cart e Begin Checkout
#     → problema no carrinho (frete alto? cupom não funciona?)
```

**RESULTADO Dias 55-60:**
- ✅ 3 testes A/B concluídos
- ✅ Vencedores implementados permanentemente
- ✅ Heatmap analisado
- ✅ Funil otimizado (vazamentos corrigidos)

---

## ✅ CHECKPOINT FINAL (22/06/2026)

### Você DEVE ter alcançado:

| Métrica | Inicial | Meta | Alcançado? |
|---------|---------|------|------------|
| Gasto ADS/mês | R$ 6.150 | R$ 3.300 | [ ] |
| ROAS Geral | 1.2x | 2.5x+ | [ ] |
| AddToCart % | 2.2% | 4.5% | [ ] |
| Vendas/semana | 4 | 12+ | [ ] |
| Tráfego orgânico | 143/sem | 300/sem | [ ] |
| Keywords top 100 | 1 | 8+ | [ ] |
| Bounce Paid | 72% | 45% | [ ] |

---

## 📊 DASHBOARD SEMANAL

**Usar este template TODA SEXTA:**

```markdown
📅 SEMANA [X] — [DATA INÍCIO] a [DATA FIM]

💰 FINANCEIRO:
• Gasto ADS: R$ ___ (meta: R$ 110/dia = R$ 770/sem)
• Vendas brutas: R$ ___ (meta: R$ 3.500/sem)
• ROAS Google: ___x (meta: 2.0x+)
• ROAS Meta: ___x (meta: 3.0x+)
• ROAS Geral: ___x (meta: 2.5x+)
• Lucro: R$ ___ (vendas - custo produto - ADS - frete)

🎯 FUNIL:
• Sessões: ___
• Views produto: ___
• AddToCart: ___ (___%) — meta: 4.5%
• Checkout iniciado: ___ (___% do addToCart) — meta: 65%
• Compras: ___ (___% do checkout) — meta: 60%

🔍 SEO:
• Cliques orgânicos: ___ (meta: 300/sem)
• Impressões: ___
• CTR médio: ___%
• Keywords top 100: ___ (meta: 8+)
• Posição "jalecos": ___ (meta: <30)
• Backlinks: ___ (meta: 10+)

📱 TECH:
• Google Ads conversões rastreadas: ___% (meta: 100%)
• Merchant Center status: [ ] Aprovado / [ ] Pendente / [ ] Rejeitado
• Bounce rate Paid Shopping: ___% (meta: <50%)
• Bounce rate Paid Search: ___% (meta: <50%)

📝 AÇÕES DA SEMANA:
- [ ] Ação 1
- [ ] Ação 2
- [ ] Ação 3

⚠️ PROBLEMAS ENCONTRADOS:
- Problema 1: [descrição] → Solução: [o que vai fazer]
- Problema 2: ...

✅ VITÓRIAS DA SEMANA:
- Vitória 1: [ex: ROAS Google passou de 1.8x para 2.3x]
- Vitória 2: ...

🎯 FOCO SEMANA SEGUINTE:
- [ ] Objetivo 1
- [ ] Objetivo 2
- [ ] Objetivo 3
```

Salvar em: `~/SiteJaleca/relatorios-semanais/semana-[X].md`

---

## 🚦 REGRAS GO/NO-GO (Pontos de Decisão)

### Durante execução:

| Situação | Limite | Ação |
|----------|--------|------|
| ROAS Google < 1.5x | 7 dias consecutivos | ⏸️ PAUSAR campanha, investigar (keywords? landing page?) |
| ROAS Meta < 2.5x | 3 dias consecutivos | ⏸️ REDUZIR budget 30%, revisar público/criativo |
| AddToCart < 3% | Após Fase 2 completa | 🔄 REFAZER UX (botão, fotos, frete) |
| Merchant rejeitado | 2 tentativas | 🆘 CONTRATAR consultor GMC (upwork) |
| SEO sem melhoria | 30 dias após Fase 3 | 🔄 REVISAR keywords (usar ferramentas pagas: Ahrefs trial) |
| Budget excedido | 2 semanas seguidas | ⏸️ PAUSAR campanhas teste (Lookalike, PMax), manter só Remarketing |
| Vendas < 6/semana | Após 45 dias de projeto | 🆘 REUNIÃO URGENTE: revisar tudo, considerar consultoria externa |

---

## 📁 ARQUIVOS E SCRIPTS

### Scripts a criar:

1. **`scripts/backup-google-ads.js`** — backup completo Google Ads (Dia 1)
2. **`scripts/backup-meta-ads.js`** — backup completo Meta Ads (Dia 1)
3. **`scripts/executar-google-cortes-dia1.js`** — pausar/reduzir campanhas (Dia 1)
4. **`scripts/executar-meta-cortes-dia1.js`** — pausar/reduzir ad sets (Dia 1)
5. **`scripts/check-google-conversions.js`** — ver últimas conversões (Dia 2)
6. **`scripts/check-conversion-by-order.js`** — verificar se pedido específico virou conversão (Dia 2)
7. **`scripts/add-alt-texts.js`** — adicionar alt text em massa (Dia 6)
8. **`scripts/reativar-google-core-conservador.js`** — reativar Core com R$ 30/dia (Dia 31)
9. **`scripts/aumentar-google-shopping.js`** — aumentar Shopping para R$ 30/dia (Dia 31)
10. **`scripts/meta-aumentar-remarketing.js`** — aumentar budget Remarketing (Dia 34)
11. **`scripts/meta-reativar-lookalike.js`** — reativar Lookalike (Dia 34)
12. **`scripts/check-google-roas.js`** — ver ROAS Google diário (uso contínuo)
13. **`scripts/check-meta-roas.js`** — ver ROAS Meta por campanha (uso contínuo)
14. **`scripts/daily-ads-report.js`** — relatório automático diário (Dia 38+)
15. **`scripts/dashboard.mjs`** — dashboard geral (JÁ EXISTE, usar semanal)

### Planilhas a criar:

1. **`TRACKING-OTIMIZACAO-2026.xlsx`** — tracking principal do projeto
   - Aba 1: Métricas semanais
   - Aba 2: Budget diário ADS
   - Aba 3: Conversões por campanha
   - Aba 4: SEO (rankings)
   - Aba 5: Problemas/Soluções

2. **`OUTREACH-SEO-2026.xlsx`** — tracking outreach
   - Colunas: Site, Tipo, Contato, Email enviado (data), Resposta, Status

### Backups (Dia 1):

```
~/SiteJaleca/backups/
├─ google-ads-23-04-2026/
│  ├─ campaigns.csv
│  ├─ keywords.csv
│  ├─ screenshots/
│  │  ├─ overview.png
│  │  ├─ core-jalecos.png
│  │  └─ shopping.png
│
├─ meta-ads-23-04-2026/
   ├─ campaigns.json
   ├─ adsets.json
   ├─ screenshots/
      ├─ overview.png
      ├─ remarketing.png
      └─ prospeccao.png
```

---

## 🎯 COMO SABER SE ESTÁ DANDO CERTO

### Sinais positivos (primeiros 30 dias):

✅ **Budget reduzido MAS vendas iguais** (eficiência melhorou)  
✅ **ROAS Google > 1.5x** (antes era 0)  
✅ **AddToCart > 3.5%** (antes 2.2%)  
✅ **Bounce Paid < 65%** (antes 72%)  
✅ **Merchant Center aprovado** (produtos aparecendo grátis)  
✅ **3+ keywords entraram no top 100** (SEO funcionando)

### Sinais negativos (reavaliar):

❌ **ROAS Google ainda < 1.0 após Dia 10** (tag não rastreia ou keywords ruins)  
❌ **AddToCart não melhorou após Fase 2** (UX não resolveu, problema é outro)  
❌ **Merchant rejeitado 2x** (feed quebrado, precisa ajuda técnica)  
❌ **Vendas caíram após cortes** (cortamos campanha que funcionava)  
❌ **SEO sem movimento após 30 dias** (conteúdo não ranqueou, keywords erradas)

---

## 💬 MENSAGEM FINAL

**Este não é um plano teórico.**  
Cada linha foi pensada para ser EXECUTÁVEL.

**Você tem 60 dias.**  
Não é muito tempo, mas é suficiente se seguir a sequência.

**Vai dar trabalho.**  
Algumas semanas vão ser intensas (Fase 2 é pesada).

**Mas é sua última chance.**  
Então não tem espaço para "depois eu faço" ou "vou pular essa parte".

**A diferença entre sobreviver e fechar está na execução.**

---

### Próximos passos AGORA (hoje, 23/04):

1. **Ler este plano completo** (30min)
2. **Criar pasta de backups** (5min)
3. **Executar Dia 1 Manhã** (backup ADS) (2h)
4. **Almoçar** (pare, respire)
5. **Executar Dia 1 Tarde** (cortes ADS) (2h)
6. **Conferir resultados** (30min)
7. **Atualizar planilha tracking** (15min)
8. **Dormir** (amanhã tem Dia 2)

Você não precisa fazer tudo de uma vez.  
**Você só precisa fazer o Dia 1 hoje.**

O resto vem depois.

Vamos nessa? 💪

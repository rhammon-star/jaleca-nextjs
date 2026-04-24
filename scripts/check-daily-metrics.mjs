#!/usr/bin/env node

/**
 * DASHBOARD DIÁRIO
 * Executar todo dia para monitorar progresso
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

const TODAY = new Date().toISOString().split('T')[0];

console.log('\n🎯 DASHBOARD JALECA — ' + TODAY);
console.log('='.repeat(60) + '\n');

// ============================================
// GOOGLE ANALYTICS 4
// ============================================
console.log('📊 GOOGLE ANALYTICS (últimas 24h)');
console.log('   → Acesse: https://analytics.google.com/analytics/web/#/p530831994/reports/intelligenthome');
console.log('   → Anote:');
console.log('     • Sessões: ___');
console.log('     • Usuários: ___');
console.log('     • Views produto: ___');
console.log('     • Add to Cart: ___');
console.log('     • Begin Checkout: ___');
console.log('     • Compras: ___');
console.log('');

// ============================================
// WOOCOMMERCE
// ============================================
console.log('🛒 WOOCOMMERCE (últimas 24h)');
console.log('   → Acesse: https://wp.jaleca.com.br/wp-admin/edit.php?post_type=shop_order');
console.log('   → Filtrar por: "Hoje"');
console.log('   → Anote:');
console.log('     • Pedidos novos: ___');
console.log('     • Valor total vendas: R$ ___');
console.log('     • Ticket médio: R$ ___');
console.log('');

// ============================================
// GOOGLE ADS
// ============================================
console.log('💰 GOOGLE ADS (últimas 24h)');
console.log('   → Acesse: https://ads.google.com/aw/campaigns');
console.log('   → Período: "Ontem"');
console.log('   → Anote:');
console.log('     • Gasto: R$ ___');
console.log('     • Conversões: ___');
console.log('     • ROAS: ___x');
console.log('     • CPC médio: R$ ___');
console.log('');

// ============================================
// META ADS
// ============================================
console.log('📱 META ADS (últimas 24h)');
console.log('   → Acesse: https://business.facebook.com/adsmanager');
console.log('   → Período: "Ontem"');
console.log('   → Anote:');
console.log('     • Gasto: R$ ___');
console.log('     • Compras: ___');
console.log('     • ROAS: ___x');
console.log('     • CPC: R$ ___');
console.log('');

// ============================================
// GOOGLE SEARCH CONSOLE
// ============================================
console.log('🔍 GOOGLE SEARCH CONSOLE (últimos 7 dias)');
console.log('   → Acesse: https://search.google.com/search-console?resource_id=sc-domain:jaleca.com.br');
console.log('   → Período: "Últimos 7 dias"');
console.log('   → Anote:');
console.log('     • Cliques: ___');
console.log('     • Impressões: ___');
console.log('     • CTR: ___%');
console.log('     • Posição média: ___');
console.log('');

// ============================================
// TAXAS DE CONVERSÃO
// ============================================
console.log('📈 TAXAS DE CONVERSÃO (calcular)');
console.log('');
console.log('   AddToCart %:');
console.log('   = (Add to Cart / Views produto) × 100');
console.log('   = (___ / ___) × 100 = ___%');
console.log('   Meta: 4.5%');
console.log('');
console.log('   Checkout %:');
console.log('   = (Begin Checkout / Add to Cart) × 100');
console.log('   = (___ / ___) × 100 = ___%');
console.log('   Meta: 65%');
console.log('');
console.log('   Compra %:');
console.log('   = (Compras / Begin Checkout) × 100');
console.log('   = (___ / ___) × 100 = ___%');
console.log('   Meta: 60%');
console.log('');

// ============================================
// ROAS GERAL
// ============================================
console.log('💎 ROAS GERAL');
console.log('');
console.log('   Gasto total ADS:');
console.log('   = Google + Meta');
console.log('   = R$ ___ + R$ ___ = R$ ___');
console.log('');
console.log('   Valor vendas:');
console.log('   = R$ ___ (WooCommerce)');
console.log('');
console.log('   ROAS:');
console.log('   = Vendas / Gasto ADS');
console.log('   = R$ ___ / R$ ___ = ___x');
console.log('   Meta: 2.5x');
console.log('');

// ============================================
// ALERTAS
// ============================================
console.log('⚠️  ALERTAS');
console.log('');
console.log('   [ ] ROAS < 2.0 por 2+ dias → Pausar campanhas teste');
console.log('   [ ] AddToCart < 3% → Revisar UX produto');
console.log('   [ ] Gasto/dia > R$ 130 → Budget excedido');
console.log('   [ ] 0 conversões Google Ads → Tag quebrada');
console.log('   [ ] Vendas < 3/semana → Reavaliar estratégia');
console.log('');

// ============================================
// SALVAR SNAPSHOT
// ============================================
console.log('💾 SALVAR DADOS');
console.log('');
console.log('   Criar arquivo: tracking/' + TODAY + '.txt');
console.log('   Com os números anotados acima.');
console.log('');

const trackingDir = join(process.cwd(), 'tracking');
if (!existsSync(trackingDir)) {
  const { mkdirSync } = await import('fs');
  mkdirSync(trackingDir, { recursive: true });
}

const template = `
DATA: ${TODAY}

GOOGLE ANALYTICS:
• Sessões: ___
• Views produto: ___
• Add to Cart: ___ (___%)
• Begin Checkout: ___ (___%)
• Compras: ___ (___%)

WOOCOMMERCE:
• Pedidos: ___
• Valor total: R$ ___
• Ticket médio: R$ ___

GOOGLE ADS:
• Gasto: R$ ___
• Conversões: ___
• ROAS: ___x

META ADS:
• Gasto: R$ ___
• Compras: ___
• ROAS: ___x

SEO (7 dias):
• Cliques: ___
• Impressões: ___
• CTR: ___%

ROAS GERAL: ___x
GASTO TOTAL: R$ ___

ALERTAS:
-

AÇÕES TOMADAS:
-
`;

const filepath = join(trackingDir, TODAY + '.txt');
if (!existsSync(filepath)) {
  writeFileSync(filepath, template.trim());
  console.log('   ✅ Template criado: tracking/' + TODAY + '.txt');
  console.log('   → Preencha os números e salve.');
} else {
  console.log('   ℹ️  Arquivo já existe: tracking/' + TODAY + '.txt');
}

console.log('\n' + '='.repeat(60));
console.log('✅ Dashboard concluído\n');

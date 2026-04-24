#!/usr/bin/env node

/**
 * DIA 1 COMPLETO - AUTOMÁTICO
 * Backup + Cortes Google Ads e Meta Ads
 */

import { config } from 'dotenv';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const BACKUP_DATE = '2026-04-23';
const BACKUP_PATH = join(process.cwd(), 'backups');

// ============================================
// UTILIDADES
// ============================================

function log(emoji, msg) {
  console.log(`${emoji} ${msg}`);
}

function saveJSON(path, data) {
  mkdirSync(path.split('/').slice(0, -1).join('/'), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

// ============================================
// META ADS API
// ============================================

async function fetchMetaAPI(endpoint, method = 'GET', body = null) {
  const token = process.env.META_ADS_TOKEN;
  const url = `https://graph.facebook.com/v21.0/${endpoint}`;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Meta API ${method} ${endpoint}: ${response.status} - ${error}`);
  }

  return response.json();
}

async function backupMetaAds() {
  log('📱', 'Iniciando backup Meta Ads...');

  const accountId = process.env.META_ADS_ACCOUNT_ID;
  const backupDir = join(BACKUP_PATH, `meta-ads-${BACKUP_DATE}`);

  // 1. Buscar campanhas
  const campaignsData = await fetchMetaAPI(
    `${accountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,insights.date_preset(last_30d){spend,impressions,clicks,actions,action_values}`
  );

  const campaigns = (campaignsData.data || []).map(c => {
    const insights = c.insights?.data?.[0];
    const purchases = insights?.actions?.find(a => a.action_type === 'purchase')?.value || 0;
    const purchaseValue = insights?.action_values?.find(a => a.action_type === 'purchase')?.value || 0;
    const spend = parseFloat(insights?.spend || 0);

    return {
      id: c.id,
      name: c.name,
      status: c.status,
      objective: c.objective,
      daily_budget: c.daily_budget ? (parseFloat(c.daily_budget) / 100).toFixed(2) : null,
      spend_30d: spend.toFixed(2),
      purchases_30d: purchases,
      revenue_30d: parseFloat(purchaseValue).toFixed(2),
      roas_30d: spend > 0 ? (parseFloat(purchaseValue) / spend).toFixed(2) : '0',
    };
  });

  saveJSON(join(backupDir, 'campaigns.json'), campaigns);

  log('✅', `${campaigns.length} campanhas Meta salvas`);

  campaigns.forEach(c => {
    log('  ', `${c.name}: R$ ${c.daily_budget}/dia | ROAS ${c.roas_30d}x | ${c.status}`);
  });

  return campaigns;
}

async function executarCortesMetaAds(campaigns) {
  log('✂️', 'Executando cortes Meta Ads...');

  const accountId = process.env.META_ADS_ACCOUNT_ID;
  const mudancas = [];

  for (const campaign of campaigns) {
    const name = campaign.name.toLowerCase();

    // PAUSAR: Lookalike Vídeo
    if (name.includes('lookalike') && name.includes('vídeo')) {
      if (campaign.status === 'ACTIVE') {
        await fetchMetaAPI(`${campaign.id}`, 'POST', { status: 'PAUSED' });
        mudancas.push(`❌ PAUSADA: ${campaign.name}`);
      }
    }

    // PAUSAR: Saúde e Beleza Vídeo
    if (name.includes('saúde') && name.includes('vídeo')) {
      if (campaign.status === 'ACTIVE') {
        await fetchMetaAPI(`${campaign.id}`, 'POST', { status: 'PAUSED' });
        mudancas.push(`❌ PAUSADA: ${campaign.name}`);
      }
    }

    // PAUSAR: Novas Páginas
    if (name.includes('novas páginas') || name.includes('novas paginas')) {
      if (campaign.status === 'ACTIVE') {
        await fetchMetaAPI(`${campaign.id}`, 'POST', { status: 'PAUSED' });
        mudancas.push(`❌ PAUSADA: ${campaign.name}`);
      }
    }

    // REDUZIR: Remarketing Carrinho R$ 100 → R$ 70
    if (name.includes('remarketing') && name.includes('carrinho')) {
      const currentBudget = parseFloat(campaign.daily_budget);
      if (currentBudget >= 90) { // Se está acima de R$ 90
        const newBudget = 7000; // R$ 70 em centavos

        // Alterar budget da CAMPANHA (não ad set)
        await fetchMetaAPI(`${campaign.id}`, 'POST', { daily_budget: newBudget });

        mudancas.push(`📉 REDUZIDO: ${campaign.name} | R$ ${currentBudget} → R$ 70/dia`);
      }
    }
  }

  mudancas.forEach(m => log('  ', m));

  return mudancas;
}

// ============================================
// GOOGLE ADS API
// ============================================

async function getGoogleAdsAccessToken() {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Google OAuth error: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

async function queryGoogleAds(query) {
  const accessToken = await getGoogleAdsAccessToken();
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, '');
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '');

  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': loginCustomerId || customerId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Ads API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function mutateCampaign(campaignId, status) {
  const accessToken = await getGoogleAdsAccessToken();
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID.replace(/-/g, '');
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '');

  const url = `https://googleads.googleapis.com/v17/customers/${customerId}/campaigns:mutate`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': loginCustomerId || customerId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operations: [{
        update: {
          resourceName: `customers/${customerId}/campaigns/${campaignId}`,
          status: status, // 'PAUSED' ou 'ENABLED'
        },
        updateMask: 'status',
      }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Ads mutate error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function backupGoogleAds() {
  log('💰', 'Iniciando backup Google Ads...');

  const backupDir = join(BACKUP_PATH, `google-ads-${BACKUP_DATE}`);

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
  `;

  const result = await queryGoogleAds(query);

  const campaigns = (result.results || []).map(row => {
    const cost = (row.metrics?.costMicros || 0) / 1000000;
    const convValue = row.metrics?.conversionsValue || 0;

    return {
      id: row.campaign?.id,
      name: row.campaign?.name,
      status: row.campaign?.status,
      type: row.campaign?.advertisingChannelType,
      budget_daily: row.campaignBudget?.amountMicros
        ? (row.campaignBudget.amountMicros / 1000000).toFixed(2)
        : null,
      cost_30d: cost.toFixed(2),
      conversions_30d: row.metrics?.conversions || 0,
      conv_value_30d: convValue.toFixed(2),
      roas_30d: cost > 0 ? (convValue / cost).toFixed(2) : '0',
    };
  });

  saveJSON(join(backupDir, 'campaigns.json'), campaigns);

  log('✅', `${campaigns.length} campanhas Google salvas`);

  campaigns.forEach(c => {
    log('  ', `${c.name}: R$ ${c.budget_daily}/dia | ROAS ${c.roas_30d}x | ${c.status}`);
  });

  return campaigns;
}

async function executarCortesGoogleAds(campaigns) {
  log('✂️', 'Executando cortes Google Ads...');

  const mudancas = [];

  for (const campaign of campaigns) {
    const name = campaign.name.toLowerCase();

    // PAUSAR: Core - Jalecos
    if ((name.includes('core') || name.includes('search')) && name.includes('jaleco')) {
      if (campaign.status === 'ENABLED') {
        await mutateCampaign(campaign.id, 'PAUSED');
        mudancas.push(`❌ PAUSADA: ${campaign.name} (economia R$ 70/dia)`);
      }
    }

    // PAUSAR: Remarketing Display
    if (name.includes('display') && name.includes('remarketing')) {
      if (campaign.status === 'ENABLED') {
        await mutateCampaign(campaign.id, 'PAUSED');
        mudancas.push(`❌ PAUSADA: ${campaign.name} (economia R$ 15/dia)`);
      }
    }

    // TODO: REDUZIR Shopping R$ 30 → R$ 15
    // (requer atualizar campaign_budget, mais complexo)
    if (name.includes('shopping')) {
      mudancas.push(`⚠️  ${campaign.name}: REDUZIR MANUALMENTE de R$ 30 → R$ 15/dia`);
    }
  }

  mudancas.forEach(m => log('  ', m));

  return mudancas;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n🚀 DIA 1 - EXECUÇÃO AUTOMÁTICA\n');
  console.log('='.repeat(60) + '\n');

  try {
    // BACKUP META ADS
    const metaCampaigns = await backupMetaAds();
    console.log('');

    // CORTES META ADS
    const metaMudancas = await executarCortesMetaAds(metaCampaigns);
    console.log('');

    // BACKUP GOOGLE ADS
    const googleCampaigns = await backupGoogleAds();
    console.log('');

    // CORTES GOOGLE ADS
    const googleMudancas = await executarCortesGoogleAds(googleCampaigns);
    console.log('');

    // RESUMO
    console.log('='.repeat(60));
    console.log('\n✅ DIA 1 CONCLUÍDO!\n');

    console.log('📊 RESUMO:');
    console.log(`  Meta Ads: ${metaMudancas.length} mudanças`);
    console.log(`  Google Ads: ${googleMudancas.length} mudanças`);
    console.log('');
    console.log('💰 ECONOMIA ESTIMADA:');
    console.log('  R$ 95/dia = R$ 2.850/mês');
    console.log('');
    console.log('📁 Backups salvos em:');
    console.log(`  ${BACKUP_PATH}/meta-ads-${BACKUP_DATE}/`);
    console.log(`  ${BACKUP_PATH}/google-ads-${BACKUP_DATE}/`);
    console.log('');
    console.log('⏭️  PRÓXIMO PASSO: Dia 2 (rastreamento Google Ads)');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\nDetalhes:', error.stack);
    process.exit(1);
  }
}

main();

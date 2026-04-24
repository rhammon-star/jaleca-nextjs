/**
 * BACKUP COMPLETO META ADS
 * Dia 1 - Antes de fazer qualquer corte
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const META_ADS_TOKEN = process.env.META_ADS_TOKEN;
const META_ADS_ACCOUNT_ID = process.env.META_ADS_ACCOUNT_ID;

async function fetchMetaAPI(endpoint) {
  const url = `https://graph.facebook.com/v21.0/${endpoint}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${META_ADS_TOKEN}` },
  });

  if (!response.ok) {
    throw new Error(`Meta API error: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function backupMetaAds() {
  const backupDate = new Date().toISOString().split('T')[0];
  const backupPath = path.join(__dirname, '..', 'backups', `meta-ads-${backupDate}`);

  console.log('🔄 Iniciando backup Meta Ads...');
  console.log(`📁 Salvando em: ${backupPath}\n`);

  // Criar diretório de backup
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  try {
    // 1. Backup de campanhas
    console.log('📊 Buscando campanhas...');

    const campaignsResponse = await fetchMetaAPI(
      `${META_ADS_ACCOUNT_ID}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,insights.date_preset(last_30d){spend,impressions,clicks,actions,action_values}&limit=100`
    );

    const campaigns = campaignsResponse.data || [];

    const campaignsData = campaigns.map(c => {
      const insights = c.insights?.data?.[0];
      const purchases = insights?.actions?.find(a => a.action_type === 'purchase')?.value || 0;
      const purchaseValue = insights?.action_values?.find(a => a.action_type === 'purchase')?.value || 0;
      const spend = parseFloat(insights?.spend || 0);

      return {
        id: c.id,
        name: c.name,
        status: c.status,
        objective: c.objective,
        daily_budget_brl: c.daily_budget ? (parseFloat(c.daily_budget) / 100).toFixed(2) : 'N/A',
        lifetime_budget_brl: c.lifetime_budget ? (parseFloat(c.lifetime_budget) / 100).toFixed(2) : 'N/A',
        last_30d: {
          spend_brl: spend.toFixed(2),
          impressions: insights?.impressions || 0,
          clicks: insights?.clicks || 0,
          purchases: purchases,
          purchase_value_brl: parseFloat(purchaseValue).toFixed(2),
          roas: spend > 0 ? (parseFloat(purchaseValue) / spend).toFixed(2) : '0',
        },
      };
    });

    fs.writeFileSync(
      `${backupPath}/campaigns.json`,
      JSON.stringify(campaignsData, null, 2)
    );

    console.log(`✅ ${campaignsData.length} campanhas salvas`);
    console.log('\n📋 Resumo das campanhas:');
    campaignsData.forEach(c => {
      console.log(`  • ${c.name}`);
      console.log(`    Status: ${c.status} | Budget diário: R$ ${c.daily_budget_brl}`);
      console.log(`    Gasto 30d: R$ ${c.last_30d.spend_brl} | ROAS: ${c.last_30d.roas}x`);
    });

    // 2. Backup de ad sets
    console.log('\n📱 Buscando ad sets...');

    const adSetsResponse = await fetchMetaAPI(
      `${META_ADS_ACCOUNT_ID}/adsets?fields=id,name,status,campaign_id,daily_budget,lifetime_budget,targeting,insights.date_preset(last_30d){spend,impressions,clicks,actions}&limit=200`
    );

    const adSets = adSetsResponse.data || [];

    const adSetsData = adSets.map(as => {
      const insights = as.insights?.data?.[0];
      const spend = parseFloat(insights?.spend || 0);

      return {
        id: as.id,
        name: as.name,
        status: as.status,
        campaign_id: as.campaign_id,
        daily_budget_brl: as.daily_budget ? (parseFloat(as.daily_budget) / 100).toFixed(2) : 'N/A',
        targeting: {
          genders: as.targeting?.genders || [],
          age_min: as.targeting?.age_min || null,
          age_max: as.targeting?.age_max || null,
          geo_locations: as.targeting?.geo_locations || {},
        },
        last_30d: {
          spend_brl: spend.toFixed(2),
          impressions: insights?.impressions || 0,
          clicks: insights?.clicks || 0,
        },
      };
    });

    fs.writeFileSync(
      `${backupPath}/adsets.json`,
      JSON.stringify(adSetsData, null, 2)
    );

    console.log(`✅ ${adSetsData.length} ad sets salvos`);

    // 3. Backup de anúncios ativos
    console.log('\n🎨 Buscando anúncios...');

    const adsResponse = await fetchMetaAPI(
      `${META_ADS_ACCOUNT_ID}/ads?fields=id,name,status,adset_id,creative{title,body,image_url,video_id}&limit=200`
    );

    const ads = adsResponse.data || [];

    const adsData = ads.map(ad => ({
      id: ad.id,
      name: ad.name,
      status: ad.status,
      adset_id: ad.adset_id,
      creative: {
        title: ad.creative?.title || null,
        body: ad.creative?.body || null,
        has_image: !!ad.creative?.image_url,
        has_video: !!ad.creative?.video_id,
      },
    }));

    fs.writeFileSync(
      `${backupPath}/ads.json`,
      JSON.stringify(adsData, null, 2)
    );

    console.log(`✅ ${adsData.length} anúncios salvos`);

    // 4. Salvar resumo geral
    const totalSpend = campaignsData.reduce((sum, c) => sum + parseFloat(c.last_30d.spend_brl), 0);
    const totalPurchases = campaignsData.reduce((sum, c) => sum + parseFloat(c.last_30d.purchases), 0);
    const totalValue = campaignsData.reduce((sum, c) => sum + parseFloat(c.last_30d.purchase_value_brl), 0);

    const summary = {
      backup_date: backupDate,
      campaigns_total: campaignsData.length,
      campaigns_active: campaignsData.filter(c => c.status === 'ACTIVE').length,
      adsets_total: adSetsData.length,
      adsets_active: adSetsData.filter(as => as.status === 'ACTIVE').length,
      ads_total: adsData.length,
      ads_active: adsData.filter(a => a.status === 'ACTIVE').length,
      last_30_days: {
        spend_brl: totalSpend.toFixed(2),
        purchases: totalPurchases,
        purchase_value_brl: totalValue.toFixed(2),
        roas: totalSpend > 0 ? (totalValue / totalSpend).toFixed(2) : '0',
      },
    };

    fs.writeFileSync(
      `${backupPath}/summary.json`,
      JSON.stringify(summary, null, 2)
    );

    console.log('\n📊 RESUMO GERAL:');
    console.log(`  Total gasto (30d): R$ ${summary.last_30_days.spend_brl}`);
    console.log(`  Total compras: ${summary.last_30_days.purchases}`);
    console.log(`  Valor compras: R$ ${summary.last_30_days.purchase_value_brl}`);
    console.log(`  ROAS geral: ${summary.last_30_days.roas}x`);

    console.log(`\n✅ Backup completo salvo em: ${backupPath}`);
    console.log('\n⚠️  IMPORTANTE: Tire screenshots das campanhas no Meta Ads Manager');
    console.log('   Salve em: backups/meta-ads-' + backupDate + '/screenshots/\n');

    return summary;

  } catch (error) {
    console.error('❌ Erro ao fazer backup:', error.message);
    throw error;
  }
}

// Executar
backupMetaAds()
  .then(() => {
    console.log('🎉 Backup Meta Ads concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Falha no backup:', error);
    process.exit(1);
  });

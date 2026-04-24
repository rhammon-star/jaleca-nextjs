/**
 * BACKUP COMPLETO GOOGLE ADS
 * Dia 1 - Antes de fazer qualquer corte
 */

import { GoogleAdsApi } from 'google-ads-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
});

async function backupGoogleAds() {
  const backupDate = new Date().toISOString().split('T')[0];
  const backupPath = path.join(__dirname, '..', 'backups', `google-ads-${backupDate}`);

  console.log('🔄 Iniciando backup Google Ads...');
  console.log(`📁 Salvando em: ${backupPath}\n`);

  // Criar diretório de backup
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }

  try {
    // 1. Backup de campanhas
    console.log('📊 Buscando campanhas...');
    const campaigns = await customer.query(`
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
    `);

    const campaignsData = campaigns.map(row => ({
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
      type: row.campaign.advertising_channel_type,
      budget_daily_brl: row.campaign_budget?.amount_micros
        ? (row.campaign_budget.amount_micros / 1000000).toFixed(2)
        : '0',
      cost_last_30d_brl: (row.metrics.cost_micros / 1000000).toFixed(2),
      impressions: row.metrics.impressions,
      clicks: row.metrics.clicks,
      conversions: row.metrics.conversions,
      conversions_value: row.metrics.conversions_value,
      roas: row.metrics.cost_micros > 0
        ? (row.metrics.conversions_value / (row.metrics.cost_micros / 1000000)).toFixed(2)
        : '0',
    }));

    fs.writeFileSync(
      `${backupPath}/campaigns.json`,
      JSON.stringify(campaignsData, null, 2)
    );

    console.log(`✅ ${campaignsData.length} campanhas salvas`);
    console.log('\n📋 Resumo das campanhas:');
    campaignsData.forEach(c => {
      console.log(`  • ${c.name}`);
      console.log(`    Status: ${c.status} | Budget: R$ ${c.budget_daily_brl}/dia`);
      console.log(`    Custo 30d: R$ ${c.cost_last_30d_brl} | ROAS: ${c.roas}x`);
    });

    // 2. Backup de keywords
    console.log('\n🔑 Buscando keywords...');
    const keywords = await customer.query(`
      SELECT
        ad_group.id,
        ad_group.name,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
      FROM keyword_view
      WHERE segments.date DURING LAST_30_DAYS
        AND ad_group_criterion.status = 'ENABLED'
    `);

    const keywordsData = keywords.map(row => ({
      ad_group: row.ad_group.name,
      keyword: row.ad_group_criterion.keyword.text,
      match_type: row.ad_group_criterion.keyword.match_type,
      status: row.ad_group_criterion.status,
      impressions: row.metrics.impressions,
      clicks: row.metrics.clicks,
      cost_brl: (row.metrics.cost_micros / 1000000).toFixed(2),
    }));

    fs.writeFileSync(
      `${backupPath}/keywords.json`,
      JSON.stringify(keywordsData, null, 2)
    );

    console.log(`✅ ${keywordsData.length} keywords salvas`);

    // 3. Backup de conversões
    console.log('\n🎯 Buscando conversões...');
    const conversions = await customer.query(`
      SELECT
        segments.conversion_action_name,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
    `);

    const conversionsData = conversions.reduce((acc, row) => {
      const name = row.segments.conversion_action_name;
      if (!acc[name]) {
        acc[name] = {
          action: name,
          total_conversions: 0,
          total_value: 0,
        };
      }
      acc[name].total_conversions += row.metrics.conversions;
      acc[name].total_value += row.metrics.conversions_value;
      return acc;
    }, {});

    fs.writeFileSync(
      `${backupPath}/conversions.json`,
      JSON.stringify(Object.values(conversionsData), null, 2)
    );

    console.log(`✅ ${Object.keys(conversionsData).length} ações de conversão salvas`);

    // 4. Salvar resumo geral
    const totalCost = campaignsData.reduce((sum, c) => sum + parseFloat(c.cost_last_30d_brl), 0);
    const totalConversions = campaignsData.reduce((sum, c) => sum + c.conversions, 0);
    const totalValue = campaignsData.reduce((sum, c) => sum + c.conversions_value, 0);

    const summary = {
      backup_date: backupDate,
      campaigns_total: campaignsData.length,
      campaigns_active: campaignsData.filter(c => c.status === 'ENABLED').length,
      keywords_total: keywordsData.length,
      last_30_days: {
        cost_brl: totalCost.toFixed(2),
        conversions: totalConversions,
        conversion_value_brl: totalValue.toFixed(2),
        roas: totalCost > 0 ? (totalValue / totalCost).toFixed(2) : '0',
      },
    };

    fs.writeFileSync(
      `${backupPath}/summary.json`,
      JSON.stringify(summary, null, 2)
    );

    console.log('\n📊 RESUMO GERAL:');
    console.log(`  Total gasto (30d): R$ ${summary.last_30_days.cost_brl}`);
    console.log(`  Total conversões: ${summary.last_30_days.conversions}`);
    console.log(`  ROAS geral: ${summary.last_30_days.roas}x`);

    console.log(`\n✅ Backup completo salvo em: ${backupPath}`);
    console.log('\n⚠️  IMPORTANTE: Tire screenshots das campanhas no Google Ads Manager');
    console.log('   Salve em: backups/google-ads-' + backupDate + '/screenshots/\n');

    return summary;

  } catch (error) {
    console.error('❌ Erro ao fazer backup:', error.message);
    throw error;
  }
}

// Executar
backupGoogleAds()
  .then(() => {
    console.log('🎉 Backup Google Ads concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Falha no backup:', error);
    process.exit(1);
  });

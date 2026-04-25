import dotenv from 'dotenv';
import { GoogleAdsApi } from 'google-ads-api';

// Load both env files
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.google-ads' });

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

const conversions = await customer.query(`
  SELECT
    segments.conversion_action_name,
    segments.date,
    metrics.all_conversions,
    metrics.all_conversions_value
  FROM customer
  WHERE segments.date DURING LAST_7_DAYS
  AND metrics.all_conversions > 0
  ORDER BY segments.date DESC
`);

console.log('📊 CONVERSÕES GOOGLE ADS (últimos 7 dias):\n');
let total = 0;
let totalValue = 0;

for (const row of conversions) {
  const convs = parseFloat(row.metrics.all_conversions);
  const value = parseFloat(row.metrics.all_conversions_value);
  total += convs;
  totalValue += value;
  console.log(`${row.segments.date} | ${row.segments.conversion_action_name.padEnd(40)} | ${convs} conv | R$${value.toFixed(2)}`);
}

console.log(`\n✅ TOTAL: ${total} conversões | R$${totalValue.toFixed(2)}`);

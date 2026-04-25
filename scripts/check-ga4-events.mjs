import dotenv from 'dotenv';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

dotenv.config({ path: '.env.local' });

const propertyId = process.env.GA4_PROPERTY_ID;

// Parse service account JSON
const serviceAccountJson = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON);

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: serviceAccountJson.client_email,
    private_key: serviceAccountJson.private_key,
  },
});

// Query purchase events last 7 days
const [response] = await analyticsDataClient.runReport({
  property: `properties/${propertyId}`,
  dateRanges: [
    {
      startDate: '7daysAgo',
      endDate: 'today',
    },
  ],
  dimensions: [
    { name: 'date' },
    { name: 'eventName' },
  ],
  metrics: [
    { name: 'eventCount' },
  ],
  dimensionFilter: {
    filter: {
      fieldName: 'eventName',
      stringFilter: {
        matchType: 'EXACT',
        value: 'purchase',
      },
    },
  },
  orderBys: [
    {
      dimension: {
        dimensionName: 'date',
      },
      desc: true,
    },
  ],
});

console.log('📊 EVENTOS "purchase" NO GA4 (últimos 7 dias):\n');

if (!response.rows || response.rows.length === 0) {
  console.log('❌ NENHUM evento "purchase" encontrado!');
} else {
  let total = 0;
  for (const row of response.rows) {
    const date = row.dimensionValues[0].value;
    const eventName = row.dimensionValues[1].value;
    const count = parseInt(row.metricValues[0].value);
    total += count;

    const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    console.log(`${formattedDate} | ${eventName.padEnd(20)} | ${count} eventos`);
  }
  console.log(`\n✅ TOTAL: ${total} eventos "purchase"`);
}

// Also check conversion_event_purchase
const [response2] = await analyticsDataClient.runReport({
  property: `properties/${propertyId}`,
  dateRanges: [
    {
      startDate: '7daysAgo',
      endDate: 'today',
    },
  ],
  dimensions: [
    { name: 'date' },
    { name: 'eventName' },
  ],
  metrics: [
    { name: 'eventCount' },
  ],
  dimensionFilter: {
    filter: {
      fieldName: 'eventName',
      stringFilter: {
        matchType: 'EXACT',
        value: 'conversion_event_purchase',
      },
    },
  },
  orderBys: [
    {
      dimension: {
        dimensionName: 'date',
      },
      desc: true,
    },
  ],
});

console.log('\n📊 EVENTOS "conversion_event_purchase" NO GA4 (últimos 7 dias):\n');

if (!response2.rows || response2.rows.length === 0) {
  console.log('❌ NENHUM evento "conversion_event_purchase" encontrado!');
} else {
  let total = 0;
  for (const row of response2.rows) {
    const date = row.dimensionValues[0].value;
    const eventName = row.dimensionValues[1].value;
    const count = parseInt(row.metricValues[0].value);
    total += count;

    const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    console.log(`${formattedDate} | ${eventName.padEnd(30)} | ${count} eventos`);
  }
  console.log(`\n✅ TOTAL: ${total} eventos "conversion_event_purchase"`);
}

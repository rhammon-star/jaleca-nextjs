import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const WC_API = process.env.WOOCOMMERCE_API_URL;
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET;

const auth = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64');

// Buscar pedidos dos últimos 7 dias
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
const afterDate = sevenDaysAgo.toISOString();

const response = await fetch(
  `${WC_API}/orders?per_page=100&status=processing,completed&after=${afterDate}&orderby=date&order=desc`,
  {
    headers: { Authorization: `Basic ${auth}` }
  }
);

const orders = await response.json();

if (orders.code) {
  console.error('Erro WooCommerce:', orders.message);
  process.exit(1);
}

console.log(`📦 PEDIDOS WOOCOMMERCE (últimos 7 dias): ${orders.length} pedidos\n`);

const byMethod = {};
const byDate = {};

for (const order of orders) {
  const method = order.payment_method_title || order.payment_method || 'Desconhecido';
  const date = order.date_created.split('T')[0];
  const value = parseFloat(order.total);

  if (!byMethod[method]) byMethod[method] = { count: 0, value: 0 };
  byMethod[method].count++;
  byMethod[method].value += value;

  if (!byDate[date]) byDate[date] = { count: 0, value: 0 };
  byDate[date].count++;
  byDate[date].value += value;

  console.log(`#${order.id} | ${date} | ${method.padEnd(20)} | ${order.status.padEnd(12)} | R$${value.toFixed(2)}`);
}

console.log('\n📊 RESUMO POR MÉTODO:');
for (const [method, data] of Object.entries(byMethod).sort((a, b) => b[1].count - a[1].count)) {
  console.log(`  ${method.padEnd(25)} | ${data.count} pedidos | R$${data.value.toFixed(2)}`);
}

console.log('\n📅 RESUMO POR DIA:');
for (const [date, data] of Object.entries(byDate).sort().reverse()) {
  console.log(`  ${date} | ${data.count} pedidos | R$${data.value.toFixed(2)}`);
}

const totalOrders = orders.length;
const totalValue = orders.reduce((sum, o) => sum + parseFloat(o.total), 0);
console.log(`\n✅ TOTAL: ${totalOrders} pedidos | R$${totalValue.toFixed(2)}`);

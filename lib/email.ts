/**
 * Email sending utilities for Jaleca.
 * Uses Nodemailer if available, otherwise simulates (logs) the email.
 */

type OrderItem = {
  name: string
  quantity: number
  total: string
}

type Order = {
  id: number | string
  number?: string
  total?: string
  billing?: { first_name?: string; email?: string }
  line_items?: OrderItem[]
  shipping_lines?: Array<{ method_title: string; total: string }>
}

type CartItem = {
  name: string
  price: string
  quantity: number
}

// ── Template helpers ──────────────────────────────────────────────────────────

function wrapHtml(content: string, title: string): string {
  const siteUrl = 'https://jaleca.com.br'
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;max-width:600px;width:100%;">
        <!-- Header com logo -->
        <tr>
          <td style="background:#ffffff !important;padding:28px 32px;text-align:center;border-bottom:1px solid #e5e5e5;">
            <img src="${siteUrl}/logo-email.png" alt="Jaleca" width="220" style="display:inline-block;height:auto;background:#ffffff;border-radius:4px;" />
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px 32px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f5f0;padding:16px 32px;text-align:center;font-size:12px;color:#888;">
            <p style="margin:0;">Jaleca — Jalecos e Mimos · Ipatinga, MG</p>
            <p style="margin:4px 0 0;">Dúvidas? <a href="mailto:contato@jaleca.com.br" style="color:#1a1a1a;">contato@jaleca.com.br</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function btn(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:12px 28px;text-decoration:none;font-size:13px;letter-spacing:2px;font-family:Arial,sans-serif;margin-top:16px;">${text.toUpperCase()}</a>`
}

// ── Transporter ───────────────────────────────────────────────────────────────

interface MailOptions {
  to: string
  subject: string
  html: string
}

async function sendMail(opts: MailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY

  if (!apiKey || apiKey === 'PLACEHOLDER') {
    console.log('[Email] BREVO_API_KEY not configured — simulating send:')
    console.log(`  To: ${opts.to}`)
    console.log(`  Subject: ${opts.subject}`)
    return
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'Jaleca', email: 'contato@jaleca.com.br' },
        to: [{ email: opts.to }],
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('[Email] Brevo error:', res.status, text)
    }
  } catch (err) {
    console.error('[Email] Send failed:', err)
    // Don't throw — email failure should not break order creation
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function sendOrderConfirmation(order: Order, customerEmail: string): Promise<void> {
  const orderNumber = order.number || String(order.id)
  const firstName = order.billing?.first_name || 'Cliente'

  function brl(value: string | number): string {
    return `R$&nbsp;${parseFloat(String(value)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  const itemsRows =
    order.line_items
      ?.map(
        i => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1a1a1a;">${i.name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">${i.quantity}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#1a1a1a;text-align:right;">${brl(i.total)}</td>
        </tr>`
      )
      .join('') || ''

  const shipping = order.shipping_lines?.[0]
  const shippingRow = shipping
    ? `<tr><td colspan="2" style="padding:6px 0;font-size:13px;color:#666;">Entrega (${shipping.method_title})</td><td style="padding:6px 0;font-size:13px;color:#666;text-align:right;">${brl(shipping.total)}</td></tr>`
    : ''

  const billing = order.billing as Record<string, string> | undefined
  const billingAddress = billing
    ? `${billing.address_1}${billing.address_2 ? ', ' + billing.address_2 : ''}, ${billing.city} — ${billing.state}, ${billing.postcode}`
    : ''

  const paymentMethod = (order as Record<string, unknown>).payment_method_title as string | undefined

  const content = `
    <h2 style="font-size:22px;margin:0 0 6px;font-family:Georgia,serif;">Pedido confirmado!</h2>
    <p style="color:#666;margin:0 0 24px;font-size:15px;">Olá, ${firstName}! Seu pedido <strong>#${orderNumber}</strong> foi recebido e está sendo processado.</p>

    ${itemsRows ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
      <thead>
        <tr style="border-bottom:2px solid #1a1a1a;">
          <th style="padding:8px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:left;font-family:Arial,sans-serif;">Produto</th>
          <th style="padding:8px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:center;font-family:Arial,sans-serif;">Qtd</th>
          <th style="padding:8px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-align:right;font-family:Arial,sans-serif;">Preço</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
      <tfoot>
        ${shippingRow}
        ${order.total ? `<tr><td colspan="2" style="padding:10px 0 4px;font-size:15px;font-weight:bold;">Total</td><td style="padding:10px 0 4px;font-size:15px;font-weight:bold;text-align:right;">${brl(order.total)}</td></tr>` : ''}
      </tfoot>
    </table>` : ''}

    ${paymentMethod ? `
    <p style="font-size:13px;color:#888;margin:12px 0 0;">Pagamento: <strong style="color:#1a1a1a;">${paymentMethod}</strong></p>` : ''}

    ${billingAddress ? `
    <div style="margin-top:24px;padding:16px;background:#f9f9f7;border-left:3px solid #c4a97d;">
      <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;margin:0 0 6px;font-family:Arial,sans-serif;">Endereço de entrega</p>
      <p style="font-size:13px;color:#1a1a1a;margin:0;">${billing?.first_name} ${billing?.last_name}</p>
      <p style="font-size:13px;color:#555;margin:4px 0 0;">${billingAddress}</p>
    </div>` : ''}

    <p style="color:#888;font-size:13px;margin:24px 0 16px;">Você receberá um e-mail assim que seu pedido for enviado com o código de rastreio.</p>
    ${btn('Ver meu pedido', `https://jaleca.com.br/pedido-confirmado/${order.id}`)}
  `

  await sendMail({
    to: customerEmail,
    subject: `Pedido #${orderNumber} confirmado — Jaleca`,
    html: wrapHtml(content, `Pedido #${orderNumber} confirmado`),
  })
}

export async function sendOrderShipped(
  order: Order,
  trackingCode: string,
  customerEmail: string
): Promise<void> {
  const orderNumber = order.number || String(order.id)
  const firstName = order.billing?.first_name || 'Cliente'

  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seu pedido foi enviado!</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! O pedido <strong>#${orderNumber}</strong> saiu para entrega.</p>
    <p style="margin:0 0 8px;"><strong>Código de rastreio:</strong></p>
    <p style="font-family:monospace;font-size:18px;background:#f5f5f0;padding:12px 16px;letter-spacing:2px;margin:0 0 24px;">${trackingCode}</p>
    ${btn('Rastrear pedido', `https://www.linkcorretos.com.br/?P_COD_UNI=${trackingCode}`)}
  `

  await sendMail({
    to: customerEmail,
    subject: `Pedido #${orderNumber} enviado — Jaleca`,
    html: wrapHtml(content, `Pedido enviado`),
  })
}

export async function sendWelcome(customerName: string, customerEmail: string): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'

  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Bem-vindo à Jaleca!</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! Sua conta foi criada com sucesso. Explore nossa coleção de jalecos e uniformes premium.</p>
    ${btn('Ver produtos', `https://jaleca.com.br/produtos`)}
  `

  await sendMail({
    to: customerEmail,
    subject: 'Bem-vindo à Jaleca!',
    html: wrapHtml(content, 'Bem-vindo à Jaleca'),
  })
}

export async function sendEmailVerification(verifyLink: string, customerEmail: string): Promise<void> {
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Confirme seu e-mail</h2>
    <p style="color:#666;margin:0 0 16px;">Obrigada por comprar na Jaleca! Clique no botão abaixo para confirmar seu endereço de e-mail.</p>
    <p style="color:#888;font-size:13px;margin:0 0 16px;">Se você não realizou uma compra conosco, ignore este e-mail.</p>
    ${btn('Confirmar e-mail', verifyLink)}
    <p style="color:#aaa;font-size:12px;margin-top:16px;">Este link expira em 48 horas.</p>
  `
  await sendMail({
    to: customerEmail,
    subject: 'Confirme seu e-mail — Jaleca',
    html: wrapHtml(content, 'Confirme seu e-mail'),
  })
}

export async function sendPasswordReset(resetLink: string, customerEmail: string): Promise<void> {
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Redefinição de senha</h2>
    <p style="color:#666;margin:0 0 16px;">Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.</p>
    <p style="color:#888;font-size:13px;margin:0 0 16px;">Se você não fez essa solicitação, ignore este e-mail.</p>
    ${btn('Redefinir senha', resetLink)}
    <p style="color:#aaa;font-size:12px;margin-top:16px;">Este link expira em 1 hora.</p>
  `

  await sendMail({
    to: customerEmail,
    subject: 'Redefinição de senha — Jaleca',
    html: wrapHtml(content, 'Redefinição de senha'),
  })
}

function cartItemsHtml(cartItems: CartItem[]): string {
  return cartItems
    .map(
      i =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid #f0f0f0;">${i.name} × ${i.quantity}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${i.price}</td></tr>`
    )
    .join('')
}

/** 1h — gentle reminder */
export async function sendCartRecovery1h(cartItems: CartItem[], customerEmail: string): Promise<void> {
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Você esqueceu alguma coisa! 🛍️</h2>
    <p style="color:#666;margin:0 0 16px;">Estes itens ainda estão esperando por você no carrinho:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>${cartItemsHtml(cartItems)}</tbody>
    </table>
    ${btn('Finalizar compra', 'https://jaleca.com.br/finalizar-compra')}
  `
  await sendMail({
    to: customerEmail,
    subject: 'Você deixou algo no carrinho — Jaleca',
    html: wrapHtml(content, 'Carrinho abandonado'),
  })
}

/** 24h — urgency */
export async function sendCartRecovery24h(cartItems: CartItem[], customerEmail: string): Promise<void> {
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seus itens podem esgotar 😟</h2>
    <p style="color:#666;margin:0 0 16px;">Trabalho com estoque limitado — não queremos que você perca:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>${cartItemsHtml(cartItems)}</tbody>
    </table>
    <p style="color:#666;margin:0 0 20px;">Garanta o seu agora antes que acabe.</p>
    ${btn('Garantir meu jaleco', 'https://jaleca.com.br/finalizar-compra')}
  `
  await sendMail({
    to: customerEmail,
    subject: 'Seus itens podem esgotar — Jaleca',
    html: wrapHtml(content, 'Estoque limitado'),
  })
}

/** 72h — PIX discount incentive */
export async function sendCartRecovery72h(cartItems: CartItem[], customerEmail: string): Promise<void> {
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Última chance + 5% no PIX 💛</h2>
    <p style="color:#666;margin:0 0 16px;">Seu carrinho ainda está salvo. Pague com PIX e ganhe 5% de desconto:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tbody>${cartItemsHtml(cartItems)}</tbody>
    </table>
    <p style="background:#f9f5ef;border-left:3px solid #c9a96e;padding:12px 16px;color:#555;margin:0 0 20px;font-size:14px;">
      <strong>Use PIX no checkout</strong> e pague 5% a menos. Aprovação imediata.
    </p>
    ${btn('Aproveitar desconto PIX', 'https://jaleca.com.br/finalizar-compra')}
  `
  await sendMail({
    to: customerEmail,
    subject: '5% de desconto PIX esperando por você — Jaleca',
    html: wrapHtml(content, 'Oferta especial'),
  })
}

/** @deprecated Use sendCartRecovery1h instead */
export async function sendCartRecovery(cartItems: CartItem[], customerEmail: string): Promise<void> {
  return sendCartRecovery1h(cartItems, customerEmail)
}

// ── PIX — código enviado por email ────────────────────────────────────────────

export async function sendPixPaymentEmail(params: {
  firstName: string
  customerEmail: string
  orderNumber: string
  total: string
  pixQrCode: string
  pixQrCodeUrl?: string
  expiresAt?: string
}): Promise<void> {
  const { firstName, customerEmail, orderNumber, total, pixQrCode, pixQrCodeUrl, expiresAt } = params

  let expiresLine = ''
  if (expiresAt) {
    const d = new Date(expiresAt)
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    expiresLine = `<p style="font-size:13px;color:#b45309;margin:8px 0 0;">⏱ Código válido até ${time} — 15 minutos</p>`
  }

  const content = `
    <h2 style="font-size:22px;margin:0 0 6px;font-family:Georgia,serif;">Seu código PIX chegou!</h2>
    <p style="color:#666;margin:0 0 20px;font-size:15px;">Olá, ${firstName}! Seu pedido <strong>#${orderNumber}</strong> está aguardando pagamento de <strong>${total}</strong>.</p>

    <p style="font-size:13px;font-weight:bold;color:#1a1a1a;margin:0 0 8px;letter-spacing:1px;text-transform:uppercase;">Copiar código PIX (Copia e Cola):</p>
    <div style="background:#f3f4f6;border:1px solid #d1d5db;padding:14px;border-radius:2px;word-break:break-all;">
      <code style="font-size:12px;color:#1a1a1a;font-family:monospace;">${pixQrCode}</code>
    </div>
    ${expiresLine}

    <div style="margin:24px 0;padding:16px;background:#fffbeb;border-left:3px solid #f59e0b;">
      <p style="font-size:13px;color:#92400e;margin:0 0 6px;font-weight:bold;">Como pagar:</p>
      <ol style="font-size:13px;color:#92400e;margin:0;padding-left:18px;">
        <li>Abra o app do seu banco</li>
        <li>Vá em PIX → Pagar → Copia e Cola (ou escaneie o QR Code)</li>
        <li>Cole o código acima e confirme o pagamento</li>
      </ol>
    </div>

    <p style="color:#888;font-size:12px;margin:16px 0 0;">Após o pagamento, você receberá a confirmação por e-mail. Pedidos não pagos em 15 minutos são cancelados automaticamente.</p>
  `

  await sendMail({
    to: customerEmail,
    subject: `Código PIX — Pedido #${orderNumber} Jaleca`,
    html: wrapHtml(content, `Código PIX — Pedido #${orderNumber}`),
  })
}

// ── Cadência automática de pedidos ────────────────────────────────────────────

/** Email #1 — Lembrete pagamento pendente (+12h sem pagar) */
export async function sendPaymentReminder(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  orderTotal: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seu pedido está esperando! 🕐</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! Notamos que o pedido <strong>#${orderId}</strong> ainda está aguardando pagamento.</p>
    <div style="background:#f9f5ef;border-left:3px solid #c4a97d;padding:16px;margin:0 0 24px;">
      <p style="margin:0;font-size:14px;color:#555;">Total do pedido: <strong style="color:#1a1a1a;">${orderTotal}</strong></p>
      <p style="margin:6px 0 0;font-size:13px;color:#888;">Pague com PIX e ganhe 5% de desconto imediato.</p>
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 20px;">Se já realizou o pagamento, pode ignorar este e-mail — processamos em breve.</p>
    ${btn('Ver meu pedido', `https://jaleca.com.br/minha-conta`)}
  `
  await sendMail({ to: customerEmail, subject: `Seu pedido Jaleca aguarda pagamento 🕐`, html: wrapHtml(content, 'Pedido aguardando pagamento') })
}

/** Email #2 — Pagamento em análise */
export async function sendOrderUnderReview(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Pagamento em análise ✅</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! Recebemos o pagamento do pedido <strong>#${orderId}</strong> e estamos analisando.</p>
    <p style="color:#666;margin:0 0 24px;">Em breve confirmaremos e iniciaremos a preparação do seu pedido. Você receberá um novo e-mail a cada etapa.</p>
    ${btn('Acompanhar pedido', `https://jaleca.com.br/minha-conta`)}
  `
  await sendMail({ to: customerEmail, subject: `Pagamento em análise — Pedido #${orderId}`, html: wrapHtml(content, 'Pagamento em análise') })
}

/** Email #3 — Pedido faturado */
export async function sendOrderInvoiced(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Pedido confirmado e faturado ✅</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! Ótima notícia — o pagamento do pedido <strong>#${orderId}</strong> foi aprovado e o pedido está faturado.</p>
    <p style="color:#666;margin:0 0 24px;">Nossa equipe já iniciou o processo de preparação. Em breve avisaremos quando estiver sendo separado.</p>
    ${btn('Ver meu pedido', `https://jaleca.com.br/minha-conta`)}
  `
  await sendMail({ to: customerEmail, subject: `Pedido #${orderId} faturado ✅ — Jaleca`, html: wrapHtml(content, 'Pedido faturado') })
}

/** Email #4 — Em separação */
export async function sendOrderPacking(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Estamos preparando seu pedido! 📦</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! Seu pedido <strong>#${orderId}</strong> entrou em separação — nossa equipe está cuidando de tudo com atenção.</p>
    <p style="color:#666;margin:0 0 24px;">Em breve você receberá o código de rastreio por e-mail. Fique de olho! 👀</p>
    ${btn('Ver meu pedido', `https://jaleca.com.br/minha-conta`)}
  `
  await sendMail({ to: customerEmail, subject: `Separando seu pedido #${orderId} 📦 — Jaleca`, html: wrapHtml(content, 'Pedido em separação') })
}

/** Email #5 — Enviado com código de rastreio (substitui a versão antiga) */
export async function sendOrderShippedWithTracking(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  trackingCode: string,
  carrier: string,
  estimatedDays?: number,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const trackUrl = `https://www.linkcorretos.com.br/?P_COD_UNI=${trackingCode}`
  const eta = estimatedDays ? `<p style="color:#888;font-size:13px;margin:0 0 24px;">Previsão de entrega: <strong>${estimatedDays} dias úteis</strong> a partir de hoje.</p>` : ''
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seu pedido foi enviado! 🚚</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! O pedido <strong>#${orderId}</strong> saiu do nosso estoque.</p>
    <div style="background:#f9f5ef;border-left:3px solid #c4a97d;padding:16px;margin:0 0 20px;">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;">Transportadora</p>
      <p style="margin:0 0 12px;font-size:15px;color:#1a1a1a;font-weight:bold;">${carrier}</p>
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;font-family:Arial,sans-serif;">Código de rastreio</p>
      <p style="margin:0;font-family:monospace;font-size:18px;letter-spacing:3px;color:#1a1a1a;">${trackingCode}</p>
    </div>
    ${eta}
    ${btn('Rastrear meu pedido', trackUrl)}
    <p style="color:#aaa;font-size:12px;margin-top:16px;">O rastreio pode levar até 24h para ser atualizado pela transportadora.</p>
  `
  await sendMail({ to: customerEmail, subject: `Pedido #${orderId} enviado! Rastreie aqui 🚚`, html: wrapHtml(content, 'Pedido enviado') })
}

/** Email #6 — Em trânsito */
export async function sendOrderInTransit(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  trackingCode: string,
  carrier: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const trackUrl = `https://www.linkcorretos.com.br/?P_COD_UNI=${trackingCode}`
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seu pedido está a caminho! 📦</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! O pedido <strong>#${orderId}</strong> foi atualizado — está em trânsito com a ${carrier}.</p>
    <p style="color:#666;margin:0 0 8px;">Rastreio: <strong style="font-family:monospace;">${trackingCode}</strong></p>
    ${btn('Rastrear pedido', trackUrl)}
  `
  await sendMail({ to: customerEmail, subject: `Pedido #${orderId} em trânsito 📦 — Jaleca`, html: wrapHtml(content, 'Pedido em trânsito') })
}

/** Email #7 — Saiu para entrega */
export async function sendOrderOutForDelivery(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  trackingCode: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const trackUrl = `https://www.linkcorretos.com.br/?P_COD_UNI=${trackingCode}`
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seu pedido sai para entrega hoje! 🚚</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! O pedido <strong>#${orderId}</strong> saiu para entrega — fique de olho, ele chega hoje!</p>
    <p style="color:#888;font-size:13px;margin:0 0 24px;">Certifique-se de que há alguém no endereço para receber. Caso não haja, a transportadora tentará novamente.</p>
    ${btn('Rastrear pedido', trackUrl)}
  `
  await sendMail({ to: customerEmail, subject: `🚚 Seu pedido Jaleca sai para entrega hoje!`, html: wrapHtml(content, 'Saiu para entrega') })
}

/** Email #8 — Entregue */
export async function sendOrderDelivered(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Seu jaleco chegou! 🎉</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! O pedido <strong>#${orderId}</strong> foi entregue com sucesso.</p>
    <p style="color:#666;margin:0 0 24px;">Esperamos que você ame! Se tiver qualquer dúvida ou precisar de troca, estamos aqui.</p>
    <div style="background:#f9f5ef;border-left:3px solid #c4a97d;padding:16px;margin:0 0 24px;">
      <p style="margin:0;font-size:14px;color:#555;">Gostou? Deixe uma avaliação e ajude outros profissionais de saúde a escolherem o jaleco certo. 💛</p>
    </div>
    ${btn('Avaliar meu pedido', `https://jaleca.com.br/minha-conta`)}
  `
  await sendMail({ to: customerEmail, subject: `Pedido #${orderId} entregue! Como foi? 🏠`, html: wrapHtml(content, 'Pedido entregue') })
}

/** Email #9 — Cancelado */
export async function sendOrderCancelled(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Pedido cancelado</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}. O pedido <strong>#${orderId}</strong> foi cancelado.</p>
    <p style="color:#666;margin:0 0 24px;">Se o cancelamento foi um engano ou você tiver alguma dúvida, entre em contato — teremos prazer em ajudar.</p>
    ${btn('Falar com a Jaleca', `https://jaleca.com.br/contato`)}
  `
  await sendMail({ to: customerEmail, subject: `Pedido #${orderId} cancelado — Jaleca`, html: wrapHtml(content, 'Pedido cancelado') })
}

/** Email #10 — Reembolsado */
export async function sendOrderRefunded(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  orderTotal: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Reembolso processado ✅</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}. O reembolso do pedido <strong>#${orderId}</strong> no valor de <strong>${orderTotal}</strong> foi processado.</p>
    <p style="color:#666;margin:0 0 8px;">O prazo para o valor aparecer em sua conta varia conforme o método de pagamento:</p>
    <ul style="color:#666;font-size:14px;margin:0 0 24px;padding-left:20px;">
      <li>PIX: até 1 dia útil</li>
      <li>Boleto: até 5 dias úteis</li>
      <li>Cartão de crédito: até 2 faturas seguintes</li>
    </ul>
    <p style="color:#888;font-size:13px;margin:0 0 20px;">Dúvidas? Estamos à disposição.</p>
    ${btn('Falar com a Jaleca', `https://jaleca.com.br/contato`)}
  `
  await sendMail({ to: customerEmail, subject: `Reembolso processado — Pedido #${orderId}`, html: wrapHtml(content, 'Reembolso processado') })
}

/** Email — Observação do pedido para o cliente */
export async function sendOrderNote(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  note: string,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'
  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Atualização do seu pedido</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}. Temos uma atualização sobre o seu pedido <strong>#${orderId}</strong>:</p>
    <div style="background:#f9f7f5;border-left:4px solid #c4a97d;padding:16px 20px;margin:0 0 24px;border-radius:4px;">
      <p style="color:#333;margin:0;font-size:15px;line-height:1.6;">${note}</p>
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 20px;">Dúvidas? Estamos à disposição.</p>
    ${btn('Ver meu pedido', `https://jaleca.com.br/minha-conta`)}
  `
  await sendMail({ to: customerEmail, subject: `Atualização do Pedido #${orderId} — Jaleca`, html: wrapHtml(content, 'Atualização do pedido') })
}

export async function sendReviewRequest(
  orderId: number | string,
  customerName: string,
  customerEmail: string,
  products: Array<{ name: string; slug: string }>,
): Promise<void> {
  const firstName = customerName.split(' ')[0] || 'Cliente'

  const productButtons = products.map(p => {
    const displayName = p.name.replace(/ - Jaleca$/i, '')
    return `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;color:#1a1a1a;">${displayName}</td>
              <td align="right">
                <a href="https://jaleca.com.br/produto/${p.slug}#reviews"
                   style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:6px 16px;text-decoration:none;font-size:11px;letter-spacing:2px;font-family:Arial,sans-serif;">
                  AVALIAR
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
  }).join('')

  const content = `
    <h2 style="font-size:22px;margin:0 0 8px;">Como foi sua experiência? ⭐</h2>
    <p style="color:#666;margin:0 0 24px;">Olá, ${firstName}! Seu pedido <strong>#${orderId}</strong> foi entregue. Sua opinião é muito importante para nós e ajuda outras profissionais a escolherem melhor.</p>
    <p style="color:#1a1a1a;font-weight:bold;margin:0 0 12px;font-size:14px;">Avalie seus produtos:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${productButtons}
    </table>
    <p style="color:#888;font-size:12px;margin:0;">Leva menos de 1 minuto e faz toda a diferença. Obrigada!</p>
  `
  await sendMail({
    to: customerEmail,
    subject: `Como foi sua experiência, ${firstName}? Deixe sua avaliação ⭐`,
    html: wrapHtml(content, 'Avalie sua compra')
  })
}

export async function sendInternalOrderNotification(
  orderId: number,
  orderNumber: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  customerAddress: string,
  total: string,
  paymentMethod: string,
  items: Array<{ name: string; quantity: number; color?: string; size?: string }>,
  customerCpf?: string,
): Promise<void> {
  const itemsList = items.map(i => {
    const variant = [i.color, i.size].filter(Boolean).join(' / ')
    return `<li style="margin:6px 0;">${i.quantity}× <strong>${i.name}</strong>${variant ? ` <span style="color:#666;">(${variant})</span>` : ''}</li>`
  }).join('')
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><title>Novo pedido #${orderNumber}</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e5e5;max-width:560px;width:100%;">
        <tr><td style="background:#1a1a1a;padding:18px 28px;">
          <p style="margin:0;color:#c4a97d;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Jaleca — Novo Pedido</p>
        </td></tr>
        <tr><td style="padding:28px;">
          <h2 style="margin:0 0 20px;font-size:20px;">Pedido #${orderNumber}</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
            <tr><td style="padding:5px 0;color:#666;width:110px;">Cliente</td><td style="padding:5px 0;"><strong>${customerName}</strong></td></tr>
            <tr><td style="padding:5px 0;color:#666;">Email</td><td style="padding:5px 0;">${customerEmail}</td></tr>
            <tr><td style="padding:5px 0;color:#666;">Telefone</td><td style="padding:5px 0;">${customerPhone}</td></tr>
            ${customerCpf ? `<tr><td style="padding:5px 0;color:#666;">CPF</td><td style="padding:5px 0;">${customerCpf}</td></tr>` : ''}
            <tr><td style="padding:5px 0;color:#666;vertical-align:top;">Endereço</td><td style="padding:5px 0;">${customerAddress}</td></tr>
            <tr><td style="padding:5px 0;color:#666;">Pagamento</td><td style="padding:5px 0;"><strong>${paymentMethod}</strong></td></tr>
            <tr><td style="padding:5px 0;color:#666;">Total</td><td style="padding:5px 0;"><strong style="font-size:16px;">${total}</strong></td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;color:#666;">Itens:</p>
          <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;">${itemsList}</ul>
          <a href="https://wp.jaleca.com.br/wp-admin/post.php?post=${orderId}&action=edit"
             style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;">
            VER PEDIDO NO PAINEL
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const internalRecipients = [
    'financeiro@jaleca.com.br',
    'contato@jaleca.com.br',
    'rhammon@objetivasolucao.com.br',
  ]
  await Promise.all(
    internalRecipients.map(to => sendMail({ to, subject: `Nova venda — Pedido #${orderNumber} (${total})`, html }))
  )
}

// ── Email de definição de senha (novo cliente ou redefinição) ─────────────────
// Gera token, salva no WC meta e envia o email via Brevo.
// Usado tanto no /register (novo cliente via checkout) quanto no /forgot-password.
export async function sendSetPasswordEmail(
  customerId: number,
  email: string,
  isNewCustomer: boolean,
  customerName?: string,
): Promise<void> {
  const WC_API = process.env.WOOCOMMERCE_API_URL
  const CK     = process.env.WOOCOMMERCE_CONSUMER_KEY
  const CS     = process.env.WOOCOMMERCE_CONSUMER_SECRET
  const siteUrl = 'https://jaleca.com.br'

  const WP_URL  = process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
  const PLUGIN_SECRET = process.env.JALECA_PLUGIN_SECRET || 'jaleca-register-secret-2026'

  const crypto = await import('crypto')
  const token   = crypto.randomBytes(32).toString('hex')
  const expires = String(Date.now() + 72 * 60 * 60 * 1000) // 72h

  console.log(`[sendSetPasswordEmail] Called: customerId=${customerId}, email=${email}, isNewCustomer=${isNewCustomer}`)

  // ── Save via Jaleca Plugin (uses WordPress user_meta — works for all WP users) ──
  let saved = false
  try {
    const res = await fetch(`${WP_URL}/wp-json/jaleca/v1/save-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: PLUGIN_SECRET, customer_id: customerId, token, expires }),
    })
    if (res.ok) {
      console.log(`[sendSetPasswordEmail] Plugin save OK for customer ${customerId}`)
      saved = true
    } else {
      const text = await res.text()
      console.error(`[sendSetPasswordEmail] Plugin save failed: ${res.status} — ${text}`)
    }
  } catch (err) {
    console.error(`[sendSetPasswordEmail] Plugin save error:`, err)
  }

  // ── Fallback: WooCommerce REST API (for WC-native customers) ───────────────
  if (!saved && WC_API && CK && CS) {
    const wcAuth = 'Basic ' + Buffer.from(`${CK}:${CS}`).toString('base64')
    try {
      const saveRes = await fetch(`${WC_API}/customers/${customerId}`, {
        method: 'PUT',
        headers: { Authorization: wcAuth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ meta_data: [
          { key: 'email_verify_token', value: token },
          { key: 'email_verify_expires', value: expires },
        ]}),
      })
      if (saveRes.ok) {
        console.log(`[sendSetPasswordEmail] WC API save OK for customer ${customerId}`)
        saved = true
      } else {
        console.error(`[sendSetPasswordEmail] WC API save failed: ${saveRes.status} for customer ${customerId}`)
      }
    } catch (err) {
      console.error(`[sendSetPasswordEmail] WC API error:`, err)
    }
  }

  if (!saved) {
    throw new Error(`Failed to save reset token for customer ${customerId}`)
  }

  const resetLink = `${siteUrl}/redefinir-senha?key=${token}&login=${encodeURIComponent(email)}&id=${customerId}`
  console.log(`[sendSetPasswordEmail] Token saved for customer ${customerId}, expires ${new Date(parseInt(expires)).toISOString()}, link: ${resetLink}`)

  const firstName = customerName ? customerName.split(' ')[0] : ''
  const greeting = firstName ? `Olá, ${firstName}! ` : ''

  const subject = isNewCustomer
    ? 'Sua conta Jaleca foi criada — defina sua senha'
    : 'Redefinição de senha — Jaleca'
  const heading = isNewCustomer ? 'Bem-vindo à Jaleca!' : 'Redefinição de senha'
  const body    = isNewCustomer
    ? `${greeting}Sua conta foi criada com sucesso. Clique no botão abaixo para definir sua senha e acessar seus pedidos. O link é válido por 72 horas.`
    : `${greeting}Clique no botão abaixo para criar uma nova senha. O link é válido por 72 horas.`
  const btnText = isNewCustomer ? 'DEFINIR MINHA SENHA' : 'REDEFINIR SENHA'

  const content = `
    <h2 style="font-size:26px;margin:0 0 16px;font-family:Georgia,serif;font-weight:400;">${heading}</h2>
    <p style="color:#666;margin:0 0 24px;font-size:15px;line-height:1.6;">${body}</p>
    ${btn(btnText, resetLink)}
    <p style="font-size:12px;color:#aaa;margin-top:24px;">Se você não solicitou isso, ignore este e-mail.</p>
  `

  await sendMail({ to: email, subject, html: wrapHtml(content, subject) })
}

// ── Boleto — link enviado por email ──────────────────────────────────────────

export async function sendBoletoEmail(params: {
  firstName: string
  customerEmail: string
  orderNumber: string
  total: string
  boletoUrl: string
  boletoLine?: string
  boletoDueAt?: string
}): Promise<void> {
  const { firstName, customerEmail, orderNumber, total, boletoUrl, boletoLine, boletoDueAt } = params

  let dueLine = ''
  if (boletoDueAt) {
    const d = new Date(boletoDueAt)
    const formatted = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    dueLine = `<p style="font-size:13px;color:#b45309;margin:8px 0 0;">📅 Vencimento: <strong>${formatted}</strong></p>`
  }

  const lineSection = boletoLine
    ? `
    <p style="font-size:13px;font-weight:bold;color:#1a1a1a;margin:20px 0 8px;letter-spacing:1px;text-transform:uppercase;">Linha digitável (copiar e colar no banco):</p>
    <div style="background:#f3f4f6;border:1px solid #d1d5db;padding:14px;border-radius:2px;word-break:break-all;">
      <code style="font-size:12px;color:#1a1a1a;font-family:monospace;">${boletoLine}</code>
    </div>`
    : ''

  const content = `
    <h2 style="font-size:22px;margin:0 0 6px;font-family:Georgia,serif;">Seu boleto chegou!</h2>
    <p style="color:#666;margin:0 0 20px;font-size:15px;">Olá, ${firstName}! Seu pedido <strong>#${orderNumber}</strong> aguarda pagamento de <strong>${total}</strong>.</p>

    <div style="background:#fffbeb;border-left:3px solid #f59e0b;padding:16px;margin:0 0 20px;">
      <p style="font-size:13px;color:#92400e;margin:0 0 6px;font-weight:bold;">Como pagar:</p>
      <ol style="font-size:13px;color:#92400e;margin:0;padding-left:18px;line-height:1.8;">
        <li>Clique no botão abaixo para abrir o boleto</li>
        <li>Pague pelo seu banco ou lotérica</li>
        <li>Você também pode usar o app do banco com a câmera (código de barras) ou colar a linha digitável</li>
      </ol>
    </div>

    ${lineSection}
    ${dueLine}

    <div style="margin:24px 0;">
      ${btn('ABRIR BOLETO', boletoUrl)}
    </div>

    <p style="color:#888;font-size:12px;margin:16px 0 0;">Após o pagamento, pode levar até 3 dias úteis para ser confirmado. Você receberá um e-mail quando o pagamento for aprovado.</p>
    <p style="color:#888;font-size:12px;margin:8px 0 0;">⚠️ Pedidos não pagos até o vencimento serão cancelados automaticamente.</p>
  `

  await sendMail({
    to: customerEmail,
    subject: `Boleto — Pedido #${orderNumber} Jaleca`,
    html: wrapHtml(content, `Boleto — Pedido #${orderNumber}`),
  })
}

export async function sendPaymentFailed(
  customerName: string,
  customerEmail: string,
  orderNumber: string | number,
  amount: string,
): Promise<void> {
  const subject = 'Problema no pagamento do seu pedido — Jaleca'
  const siteUrl = 'https://jaleca.com.br'

  const content = `
    <h2 style="font-size:26px;margin:0 0 16px;font-family:Georgia,serif;font-weight:400;">Olá, ${customerName}!</h2>
    <p style="color:#666;margin:0 0 16px;font-size:15px;line-height:1.6;">
      Identificamos que o pagamento do seu pedido <strong>#${orderNumber}</strong> no valor de <strong>${amount}</strong> não foi concluído — o sistema de segurança do nosso processador de pagamentos bloqueou a transação automaticamente.
    </p>
    <p style="color:#666;margin:0 0 24px;font-size:15px;line-height:1.6;">
      Isso não significa nenhum problema com o seu cartão. É uma análise automática de risco que pode ocorrer por diversos fatores. Se o valor apareceu no extrato do seu cartão, fique tranquilo: é apenas uma reserva temporária que será estornada em até <strong>7 dias úteis</strong> sem que você precise fazer nada.
    </p>
    <p style="color:#1a1a1a;margin:0 0 8px;font-size:15px;font-weight:600;">Para finalizar sua compra, tente uma destas opções:</p>
    <ul style="color:#666;font-size:15px;line-height:1.8;margin:0 0 24px;padding-left:20px;">
      <li><strong>PIX</strong> — aprovação imediata, sem análise de segurança</li>
      <li><strong>Boleto bancário</strong> — também sem restrições</li>
      <li>Tentar novamente com o cartão (uma segunda tentativa costuma passar)</li>
    </ul>
    ${btn('VER MINHA CONTA', siteUrl + '/minha-conta')}
    <p style="font-size:13px;color:#aaa;margin-top:24px;line-height:1.6;">
      Precisa de ajuda? Fale conosco pelo WhatsApp ou em <a href="mailto:contato@jaleca.com.br" style="color:#1a1a1a;">contato@jaleca.com.br</a>.
    </p>
  `

  await sendMail({ to: customerEmail, subject, html: wrapHtml(content, subject) })
}

// ── Alerta interno — falha de pagamento ──────────────────────────────────────
// Pagamento capturado mas WooCommerce está fora — admin precisa criar pedido manual
export async function sendWcCaptureFailureAlert(params: {
  tempOrderId: string
  createdAt?: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone?: string
  customerCpf?: string
  customerId?: number
  customerIp?: string
  paymentMethod: string
  paymentStatus: string
  cieloPaymentId: string
  cardBrand?: string
  cardLast4?: string
  installments?: number
  amount: string
  itemsSubtotal: number
  totalDiscount?: number
  pixDiscount?: number
  couponCode?: string
  items: Array<{ name: string; quantity: number; price: number; color?: string; size?: string; product_id: number; variation_id?: number }>
  shipping: { method_id: string; method_title: string; cost: number }
  billing: { address_1: string; address_2?: string; neighborhood?: string; city: string; state: string; postcode: string; country?: string }
  failureReason: string
}): Promise<void> {
  const { tempOrderId, createdAt, customerFirstName, customerLastName, customerEmail, customerPhone, customerCpf, customerId, customerIp, paymentMethod, paymentStatus, cieloPaymentId, cardBrand, cardLast4, installments, amount, itemsSubtotal, totalDiscount, pixDiscount, couponCode, items, shipping, billing, failureReason } = params

  const customerName = `${customerFirstName} ${customerLastName}`.trim()
  const waLink = customerPhone ? `https://wa.me/55${customerPhone.replace(/\D/g, '')}` : ''
  const dateStr = createdAt || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const brl = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`

  const itemsRows = items.map(i => `<tr>
    <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;font-size:13px;vertical-align:top;">
      <strong>${i.name}</strong>${i.color ? ` — ${i.color}` : ''}${i.size ? ` (${i.size})` : ''}<br/>
      <span style="color:#999;font-size:11px;font-family:monospace;">product_id: ${i.product_id}${i.variation_id ? ` &nbsp;|&nbsp; variation_id: ${i.variation_id}` : ''}</span>
    </td>
    <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:center;vertical-align:top;">${i.quantity}</td>
    <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;vertical-align:top;">${brl(i.price)}</td>
    <td style="padding:8px 4px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:right;vertical-align:top;"><strong>${brl(i.price * i.quantity)}</strong></td>
  </tr>`).join('')

  const cardInfo = (cardBrand || cardLast4 || installments)
    ? `<tr><td style="padding:4px 0;color:#666;">Cartão</td><td style="padding:4px 0;">${cardBrand || ''}${cardLast4 ? ` •••• ${cardLast4}` : ''}${installments && installments > 1 ? ` — ${installments}x` : ' — à vista'}</td></tr>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><title>Pedido sem WooCommerce — ${tempOrderId}</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;"><tr><td align="center">
    <table width="680" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e5e5;max-width:680px;width:100%;">
      <tr><td style="background:#d97706;padding:18px 28px;">
        <p style="margin:0;color:#fff;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Jaleca — Pedido recebido sem integração WC</p>
      </td></tr>
      <tr><td style="padding:28px;">
        <h2 style="margin:0 0 8px;font-size:20px;">💰 Pagamento ${paymentStatus} — ${tempOrderId}</h2>
        <p style="margin:0 0 20px;font-size:13px;color:#b45309;background:#fef3c7;padding:12px;border-left:3px solid #d97706;">
          <strong>O pedido foi feito e o pagamento foi capturado no Cielo, mas o WooCommerce estava fora — o pedido NÃO foi criado no WP.</strong><br/>
          Crie o pedido manualmente com os dados abaixo, baixe o estoque e marque com o status correto. NF deve ser emitida manualmente.<br/>
          <span style="font-size:11px;color:#92400e;display:block;margin-top:6px;">Erro técnico: ${failureReason}</span>
        </p>

        <h3 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#666;border-bottom:1px solid #eee;padding-bottom:6px;">Pedido</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:16px;">
          <tr><td style="padding:4px 0;color:#666;width:140px;">ID temporário</td><td style="padding:4px 0;font-family:monospace;"><strong>${tempOrderId}</strong></td></tr>
          <tr><td style="padding:4px 0;color:#666;">Data/hora</td><td style="padding:4px 0;">${dateStr}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Cielo PaymentId</td><td style="padding:4px 0;font-family:monospace;font-size:12px;">${cieloPaymentId}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Status pagamento</td><td style="padding:4px 0;"><strong>${paymentStatus}</strong></td></tr>
        </table>

        <h3 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#666;border-bottom:1px solid #eee;padding-bottom:6px;">Cliente</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:16px;">
          <tr><td style="padding:4px 0;color:#666;width:140px;">Nome</td><td style="padding:4px 0;"><strong>${customerFirstName}</strong></td></tr>
          <tr><td style="padding:4px 0;color:#666;">Sobrenome</td><td style="padding:4px 0;"><strong>${customerLastName}</strong></td></tr>
          <tr><td style="padding:4px 0;color:#666;">Email</td><td style="padding:4px 0;"><a href="mailto:${customerEmail}" style="color:#1a1a1a;">${customerEmail}</a></td></tr>
          ${customerPhone ? `<tr><td style="padding:4px 0;color:#666;">Telefone</td><td style="padding:4px 0;"><a href="${waLink}" style="color:#1a1a1a;">${customerPhone}</a></td></tr>` : ''}
          ${customerCpf ? `<tr><td style="padding:4px 0;color:#666;">CPF</td><td style="padding:4px 0;font-family:monospace;">${customerCpf}</td></tr>` : ''}
          ${customerId ? `<tr><td style="padding:4px 0;color:#666;">customer_id WP</td><td style="padding:4px 0;font-family:monospace;">${customerId}</td></tr>` : '<tr><td style="padding:4px 0;color:#666;">Cliente WP</td><td style="padding:4px 0;color:#999;">Guest (sem cadastro)</td></tr>'}
          ${customerIp ? `<tr><td style="padding:4px 0;color:#666;">IP</td><td style="padding:4px 0;font-family:monospace;font-size:12px;">${customerIp}</td></tr>` : ''}
        </table>

        <h3 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#666;border-bottom:1px solid #eee;padding-bottom:6px;">Endereço de entrega</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:16px;">
          <tr><td style="padding:4px 0;color:#666;width:140px;">Logradouro</td><td style="padding:4px 0;">${billing.address_1}</td></tr>
          ${billing.address_2 ? `<tr><td style="padding:4px 0;color:#666;">Complemento/nº</td><td style="padding:4px 0;">${billing.address_2}</td></tr>` : ''}
          ${billing.neighborhood ? `<tr><td style="padding:4px 0;color:#666;">Bairro</td><td style="padding:4px 0;">${billing.neighborhood}</td></tr>` : ''}
          <tr><td style="padding:4px 0;color:#666;">Cidade</td><td style="padding:4px 0;">${billing.city}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Estado</td><td style="padding:4px 0;">${billing.state}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">CEP</td><td style="padding:4px 0;font-family:monospace;">${billing.postcode}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">País</td><td style="padding:4px 0;">${billing.country || 'BR'}</td></tr>
        </table>

        <h3 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#666;border-bottom:1px solid #eee;padding-bottom:6px;">Itens (${items.reduce((s, i) => s + i.quantity, 0)})</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;border-collapse:collapse;">
          <thead><tr style="background:#f5f5f0;">
            <td style="padding:8px 4px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#666;">Produto</td>
            <td style="padding:8px 4px;text-align:center;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#666;">Qtd</td>
            <td style="padding:8px 4px;text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#666;">Unit.</td>
            <td style="padding:8px 4px;text-align:right;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#666;">Total</td>
          </tr></thead>
          <tbody>${itemsRows}</tbody>
        </table>

        <h3 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#666;border-bottom:1px solid #eee;padding-bottom:6px;">Pagamento &amp; totais</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
          <tr><td style="padding:4px 0;color:#666;width:140px;">Método</td><td style="padding:4px 0;"><strong>${paymentMethod}</strong></td></tr>
          ${cardInfo}
          <tr><td style="padding:4px 0;color:#666;">Subtotal itens</td><td style="padding:4px 0;text-align:right;">${brl(itemsSubtotal)}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Frete (${shipping.method_title})</td><td style="padding:4px 0;text-align:right;">${brl(shipping.cost)}</td></tr>
          <tr><td style="padding:4px 0;color:#666;">Método de envio (ID)</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:12px;">${shipping.method_id}</td></tr>
          ${couponCode ? `<tr><td style="padding:4px 0;color:#666;">Cupom</td><td style="padding:4px 0;text-align:right;font-family:monospace;">${couponCode}</td></tr>` : ''}
          ${totalDiscount && totalDiscount > 0 ? `<tr><td style="padding:4px 0;color:#666;">Desconto cupom</td><td style="padding:4px 0;text-align:right;color:#c0392b;">-${brl(totalDiscount)}</td></tr>` : ''}
          ${pixDiscount && pixDiscount > 0 ? `<tr><td style="padding:4px 0;color:#666;">Desconto PIX</td><td style="padding:4px 0;text-align:right;color:#c0392b;">-${brl(pixDiscount)}</td></tr>` : ''}
          <tr style="border-top:2px solid #1a1a1a;"><td style="padding:10px 0 4px;font-size:16px;"><strong>Total cobrado</strong></td><td style="padding:10px 0 4px;text-align:right;font-size:18px;"><strong>${amount}</strong></td></tr>
        </table>

        <a href="https://wp.jaleca.com.br/wp-admin/post-new.php?post_type=shop_order" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;margin-right:12px;">CRIAR PEDIDO NO WP</a>
        ${customerPhone ? `<a href="${waLink}" style="display:inline-block;background:#25d366;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;">WHATSAPP CLIENTE</a>` : ''}
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`

  const internalRecipients = ['financeiro@jaleca.com.br', 'contato@jaleca.com.br', 'rhammon@objetivasolucao.com.br']
  await Promise.all(
    internalRecipients.map(to => sendMail({ to, subject: `Pedido feito e recebido porém não foi integrado ao WooCommerce — ${tempOrderId} (${amount}) — ${customerName}`, html }))
  )
}

export async function sendInternalPaymentFailureAlert(params: {
  orderId: number | string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  paymentMethod: string
  failureReason: string
  amount: string
  pagarmeOrderId?: string
}): Promise<void> {
  const { orderId, orderNumber, customerName, customerEmail, customerPhone, paymentMethod, failureReason, amount, pagarmeOrderId } = params

  const waLink = `https://wa.me/55${customerPhone?.replace(/\D/g, '')}`
  const wcAdminLink = `https://wp.jaleca.com.br/wp-admin/post.php?post=${orderId}&action=edit`

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><title>Falha de pagamento #${orderNumber}</title></head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:Arial,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e5e5e5;max-width:560px;width:100%;">
        <tr><td style="background:#c0392b;padding:18px 28px;">
          <p style="margin:0;color:#fff;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Jaleca — Falha de Pagamento</p>
        </td></tr>
        <tr><td style="padding:28px;">
          <h2 style="margin:0 0 20px;font-size:20px;">⚠️ Pedido #${orderNumber} — pagamento recusado</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:20px;">
            <tr><td style="padding:5px 0;color:#666;width:120px;">Cliente</td><td style="padding:5px 0;"><strong>${customerName}</strong></td></tr>
            <tr><td style="padding:5px 0;color:#666;">Email</td><td style="padding:5px 0;">${customerEmail}</td></tr>
            ${customerPhone ? `<tr><td style="padding:5px 0;color:#666;">Telefone</td><td style="padding:5px 0;"><a href="${waLink}" style="color:#1a1a1a;">${customerPhone}</a></td></tr>` : ''}
            <tr><td style="padding:5px 0;color:#666;">Pagamento</td><td style="padding:5px 0;">${paymentMethod}</td></tr>
            <tr><td style="padding:5px 0;color:#666;">Valor</td><td style="padding:5px 0;"><strong>${amount}</strong></td></tr>
            <tr><td style="padding:5px 0;color:#666;">Motivo</td><td style="padding:5px 0;color:#c0392b;"><strong>${failureReason}</strong></td></tr>
            ${pagarmeOrderId ? `<tr><td style="padding:5px 0;color:#666;">Pagar.me ID</td><td style="padding:5px 0;font-size:12px;color:#999;">${pagarmeOrderId}</td></tr>` : ''}
          </table>
          <a href="${wcAdminLink}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;margin-right:12px;">
            VER PEDIDO
          </a>
          ${customerPhone ? `<a href="${waLink}" style="display:inline-block;background:#25d366;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;">CONTATAR CLIENTE</a>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const internalRecipients = ['financeiro@jaleca.com.br', 'contato@jaleca.com.br', 'rhammon@objetivasolucao.com.br']
  await Promise.all(
    internalRecipients.map(to => sendMail({ to, subject: `⚠️ Falha pagamento — Pedido #${orderNumber} (${amount}) — ${customerName}`, html }))
  )
}

export async function sendSeoDropAlert(
  drops: Array<{ keyword: string; before: number; after: number }>
): Promise<void> {
  const rows = drops
    .map(
      (d) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;">${d.keyword}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${d.before}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;color:#c0392b;font-weight:bold;">${d.after}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;color:#c0392b;">-${d.after - d.before}</td>
        </tr>`
    )
    .join('')

  const html = `
<html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
  <table style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;">
    <tr><td style="background:#1a1a1a;padding:20px;text-align:center;">
      <span style="color:#fff;font-size:16px;letter-spacing:3px;">JALECA SEO ALERT</span>
    </td></tr>
    <tr><td style="padding:24px;">
      <p style="margin:0 0 16px;color:#333;">As seguintes keywords caíram <strong>3+ posições</strong> nas últimas 24h:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th style="padding:8px 12px;text-align:left;">Keyword</th>
            <th style="padding:8px 12px;">Antes</th>
            <th style="padding:8px 12px;">Agora</th>
            <th style="padding:8px 12px;">Queda</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:20px 0 0;font-size:12px;color:#999;">
        Monitorado diariamente via DataForSEO — jaleca.com.br
      </p>
    </td></tr>
  </table>
</body></html>`

  await sendMail({
    to: 'rhammon@objetivasolucao.com.br',
    subject: `⚠️ SEO Jaleca — ${drops.length} keyword(s) caíram hoje`,
    html,
  })
}

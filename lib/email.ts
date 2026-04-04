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
        <!-- Header -->
        <tr>
          <td style="background:#1a1a1a;padding:24px 32px;text-align:center;">
            <span style="color:#ffffff;font-size:24px;letter-spacing:6px;font-family:Georgia,serif;font-weight:400;">JALECA</span>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px;">${content}</td></tr>
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
    <div style="text-align:center;margin-bottom:28px;">
      <img src="https://jaleca.com.br/logo-full.jpg" alt="Jaleca" style="max-width:260px;height:auto;" />
    </div>

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
    ${btn('Ver meu pedido', `https://jaleca.com.br/minha-conta`)}
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
    <h2 style="font-size:22px;margin:0 0 8px;">Bem-vinda à Jaleca!</h2>
    <p style="color:#666;margin:0 0 16px;">Olá, ${firstName}! Sua conta foi criada com sucesso. Explore nossa coleção de jalecos e uniformes premium.</p>
    ${btn('Ver produtos', `https://jaleca.com.br/produtos`)}
  `

  await sendMail({
    to: customerEmail,
    subject: 'Bem-vinda à Jaleca!',
    html: wrapHtml(content, 'Bem-vinda à Jaleca'),
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

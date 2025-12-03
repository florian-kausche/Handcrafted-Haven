// Import nodemailer dynamically and treat as `any` to avoid requiring type defs in the project.
const nodemailer: any = require('nodemailer')

type OrderLike = any

/**
 * Send an order receipt email. If SMTP config is not provided via environment,
 * this function falls back to logging the email to the server console for
 * local/dev environments.
 *
 * It will attach a simple invoice text file when `attachInvoice` is true.
 */
export async function sendOrderReceipt(order: OrderLike, to?: string, attachInvoice = true) {
  const recipient = to || order?.guest_email || order?.email
  if (!recipient) {
    console.warn('No recipient to send receipt to for order', order?._id)
    return { ok: false, reason: 'no-recipient' }
  }

  const subject = `Your Handcrafted Haven order ${order._id} confirmation`

  // Build a simple HTML body if product titles exist (populated), otherwise plain text
  const items = (order.items || []).map((it: any) => {
    const title = it.title || (it.product && it.product.title) || it.productData?.title || String(it.product || '')
    const price = (it.price || 0)
    return { title, quantity: it.quantity, price }
  })

  const bodyLines = items.map((it: any) => `- ${it.title} x ${it.quantity} — $${(it.price || 0).toFixed(2)}`).join('\n')
  const body = `Thank you for your order. Order ID: ${order._id}\nTotal: $${(order.total_amount || 0).toFixed(2)}\n\nItems:\n${bodyLines}\n\nThis is an automated receipt from Handcrafted Haven.`

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>Thank you for your order</h2>
      <p>Order ID: <strong>${order._id}</strong></p>
      <p>Total: <strong>$${(order.total_amount || 0).toFixed(2)}</strong></p>
      <h3>Items</h3>
      <ul>
        ${items.map((it: any) => `<li>${escapeHtml(it.title)} x ${it.quantity} — $${(it.price || 0).toFixed(2)}</li>`).join('')}
      </ul>
      <p style="color:#666">This is an automated receipt from Handcrafted Haven.</p>
    </div>
  `

  // If SMTP env provided, try to send real email using nodemailer
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass },
      })

      const mailOptions: any = {
        from: process.env.SMTP_FROM || 'no-reply@handcraftedhaven.com',
        to: recipient,
        subject,
        text: body,
        html: htmlBody,
      }

      // Attach a simple invoice text file if requested
      if (attachInvoice) {
        const invoiceText = `Invoice - Order ${order._id}\n\n${body}`
        mailOptions.attachments = [
          { filename: `invoice-${order._id}.txt`, content: invoiceText },
        ]
      }

      const info = await transporter.sendMail(mailOptions)

      console.info('Receipt email sent:', info.messageId)
      return { ok: true, info }
    } catch (err) {
      console.error('Failed to send receipt email:', err)
      return { ok: false, reason: 'send-failed', error: err }
    }
  }

  // Fallback for local/dev: log the message and return success; include simple invoice attachment info
  console.info('Receipt (simulated) sent to', recipient)
  console.info('--- Receipt start ---')
  console.info('To:', recipient)
  console.info('Subject:', subject)
  console.info(body)
  if (attachInvoice) console.info(`Attached invoice: invoice-${order._id}.txt`)
  console.info('--- Receipt end ---')
  return { ok: true, simulated: true }
}

export default sendOrderReceipt

// small helper to escape HTML in titles
function escapeHtml(str: string) {
  return String(str || '').replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]
  })
}

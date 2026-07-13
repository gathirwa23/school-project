const nodemailer = require('nodemailer')

/**
 * Sends a signup confirmation email.
 *
 * Expects these env vars to be present:
 *  - SMTP_HOST
 *  - SMTP_PORT
 *  - SMTP_USER
 *  - SMTP_PASS
 *  - SMTP_FROM (e.g. "My App <no-reply@myapp.com>")
 *
 * If env vars are missing, it will resolve without sending (so signup won't fail).
 */
async function sendSignupConfirmationEmail({ toEmail, toName }) {
  if (!toEmail) return

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
  } = process.env

  const missing = []
  if (!SMTP_HOST) missing.push('SMTP_HOST')
  if (!SMTP_PORT) missing.push('SMTP_PORT')
  if (!SMTP_USER) missing.push('SMTP_USER')
  if (!SMTP_PASS) missing.push('SMTP_PASS')
  if (!SMTP_FROM) missing.push('SMTP_FROM')

  // Do not block signup if email can't be configured.
  if (missing.length) {
    console.warn(
      'Signup email not sent (missing SMTP env vars):',
      missing.join(', '),
    )

    // Helpful debug: show which SMTP vars are currently present (no secrets).
    console.warn('Signup email env debug:', {
      SMTP_HOST: Boolean(SMTP_HOST),
      SMTP_PORT: Boolean(SMTP_PORT),
      SMTP_USER: Boolean(SMTP_USER),
      SMTP_PASS: Boolean(SMTP_PASS),
      SMTP_FROM: Boolean(SMTP_FROM),
    })

    return
  }


  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // common convention
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  const namePart = toName ? `, ${toName}` : ''

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.4;">
      <h2 style="margin: 0 0 12px 0;">Welcome${namePart}!</h2>
      <p style="margin: 0 0 12px 0;">
        Your account has been created successfully. You can now log in and start using the app.
      </p>
      <p style="margin: 0; color: #666; font-size: 12px;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `

  await transporter.sendMail({
    from: SMTP_FROM,
    to: toEmail,
    subject: 'Your account was created',
    text: `Welcome${namePart}! Your account has been created successfully. You can now log in and start using the app.`,
    html,
  })
}

module.exports = { sendSignupConfirmationEmail }


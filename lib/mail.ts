import nodemailer from "nodemailer"
import { escapeHtml } from "@/utils/strings"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailPayload {
  name: string
  email: string
  whatsapp: string
  subject: string
  message: string
}

export async function sendContactNotificationEmail({
  name,
  email,
  whatsapp,
  subject,
  message,
}: EmailPayload) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeWhatsapp = escapeHtml(whatsapp)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>")

  // wa.me needs digits only, in international form. Assume Brazil (55) when the
  // sender didn't include a country code.
  const waDigits = whatsapp.replace(/\D/g, "")
  const waIntl = waDigits.startsWith("55") ? waDigits : `55${waDigits}`

  try {
    await transporter.sendMail({
      from: `"${safeName}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL_DESTINATION,
      subject: `[IRB] Nova Mensagem: ${safeSubject}`,
      text: `Nome: ${name}\nE-mail: ${email}\nWhatsApp: ${whatsapp} (https://wa.me/${waIntl})\nAssunto: ${subject}\n\nMensagem:\n${message}`,
      html: `
        <div style="font-family: serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #002347;">Nova mensagem de contato — IRB</h2>
          <p><strong>Remetente:</strong> ${safeName}</p>
          <p><strong>E-mail:</strong> ${safeEmail}</p>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/${waIntl}" style="color: #C5A059;">${safeWhatsapp}</a></p>
          <p><strong>Assunto:</strong> ${safeSubject}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f7; border-left: 4px solid #C5A059;">
            ${safeMessage}
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error("Erro no SMTP:", error)
    return { success: false }
  }
}

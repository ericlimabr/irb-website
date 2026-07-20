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
  subject: string
  message: string
}

export async function sendContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: EmailPayload) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>")

  try {
    await transporter.sendMail({
      from: `"${safeName}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL_DESTINATION,
      subject: `[IRB] Nova Mensagem: ${safeSubject}`,
      text: `Nome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\nMensagem:\n${message}`,
      html: `
        <div style="font-family: serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #002347;">Nova mensagem de contato — IRB</h2>
          <p><strong>Remetente:</strong> ${safeName}</p>
          <p><strong>E-mail:</strong> ${safeEmail}</p>
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

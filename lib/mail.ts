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

/**
 * Confirmação da inscrição na conferência, com o Pix para pagar.
 *
 * Três decisões de formato, todas por causa de cliente de e-mail:
 * tabela e estilo inline (nada de classe CSS), QR embutido por cid (o Gmail
 * descarta `src="data:..."`), e o BR Code também em texto, porque ler QR na
 * própria tela onde o e-mail está aberto é impossível.
 *
 * Nada aqui promete o que a igreja ainda não confirmou: não diz que dá para
 * pagar no dia, nem que há limite de vagas. Ver docs/conferencia-inscricoes.md.
 */
interface InscricaoEmailPayload {
  nome: string
  email: string
  /** Rótulo pronto dos dias escolhidos, ex. "Sábado e domingo". */
  dias: string
  /** Linha das pessoas, ex. "2 adultos a R$ 20, e 1 criança que não paga". */
  pessoas: string
  /** Valor total em centavos. */
  valor: number
  /** O "copia e cola" do Pix. */
  brCode: string
  /** PNG do QR, embutido por cid. */
  qr: Buffer
  /** Link absoluto de adicionar à agenda. */
  agendaUrl: string
  /** Link absoluto da rota no Maps. */
  mapsUrl: string
}

const CONF_RESUMO = [
  ["Sáb 16h30", "Credenciamento e abertura"],
  ["Sáb 17h15", "Palestra 1, com o Dr. Hamilton Barbosa"],
  ["Sáb 18h40", "Palestra 2, com o Dr. Hamilton Barbosa"],
  ["Sáb 19h40", "Mesa redonda, perguntas do público"],
  ["Dom 09h00", "Culto com a pregação do Pr. Jônatas Cunha"],
]

export async function sendInscricaoConfirmationEmail({
  nome,
  email,
  dias,
  pessoas,
  valor,
  brCode,
  qr,
  agendaUrl,
  mapsUrl,
}: InscricaoEmailPayload) {
  const safeNome = escapeHtml(nome)
  const primeiroNome = escapeHtml(nome.trim().split(/\s+/)[0] ?? nome)
  const total = `R$ ${(valor / 100).toFixed(2).replace(".", ",")}`
  const centavos = valor % 100

  const rot =
    "font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5c5c5c"
  const val =
    "font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#1a1a1a"
  const borda = "border-bottom:1px solid #e6e3dc;padding:10px 0"

  const linha = (rotulo: string, valorTexto: string, destaque = false) => `
        <tr>
          <td style="${borda};${rot}">${rotulo}</td>
          <td align="right" style="${borda};${
            destaque
              ? "font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#00172e;font-weight:bold"
              : val
          }">${valorTexto}</td>
        </tr>`

  const resumo = CONF_RESUMO.map(
    ([quando, oque]) => `
        <tr>
          <td width="92" valign="top" style="padding:7px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#c9a227">${quando}</td>
          <td valign="top" style="padding:7px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1a1a1a">${oque}</td>
        </tr>`,
  ).join("")

  const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e7e2;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff">

  <tr><td style="background:#00172e;padding:32px 36px 28px" align="center">
    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#d9b45f">2ª Conferência Reformada</p>
    <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;color:#ffffff">O Livro da Criação</p>
    <p style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:16px;color:rgba(255,255,255,.8)">7 e 8 de novembro de 2026, em Taguatinga</p>
  </td></tr>

  <tr><td style="padding:36px 36px 0">
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:#00172e">Inscrição recebida, ${primeiroNome}.</p>
    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#5c5c5c">
      Guardamos o seu lugar. Falta só o Pix abaixo para a inscrição ficar completa.
    </p>
  </td></tr>

  <tr><td style="padding:28px 36px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${linha("Em nome de", safeNome)}${linha("Dias", escapeHtml(dias))}${linha("Pessoas", escapeHtml(pessoas))}${linha("A pagar", total, true)}
    </table>
  </td></tr>

  <tr><td style="padding:28px 36px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;border:1px solid #e6e3dc">
      <tr><td style="padding:28px 28px 8px" align="center">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5c5c5c">Pagamento por Pix</p>
        <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;color:#00172e">${total}</p>
        <p style="margin:6px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c">
          O valor termina em ${centavos} centavos, que marcam que este Pix é da conferência. Eles entram uma vez só, não por adulto. Pague o valor exato, sem arredondar: é pelo valor e pelo nome de quem paga que encontramos a sua inscrição no extrato.
        </p>
      </td></tr>
      <tr><td align="center" style="padding:18px 28px 0">
        <img src="cid:pix-qr" width="200" alt="QR Code do Pix" style="display:block;border:8px solid #ffffff;background:#ffffff">
      </td></tr>
      <tr><td style="padding:18px 28px 28px">
        <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#5c5c5c">Ou copie e cole no seu banco</p>
        <p style="margin:0;padding:14px;background:#ffffff;border:1px solid #e6e3dc;font-family:'Courier New',monospace;font-size:11px;line-height:1.5;color:#1a1a1a;word-break:break-all">${escapeHtml(brCode)}</p>
        <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c">
          Não precisa mandar comprovante. Conferimos pelo nome do pagador e pelo valor. Se o Pix sair da conta de outra pessoa, responda este e-mail dizendo o nome dela.
        </p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:28px 36px 0" align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" align="center">
      <tr>
        <td style="background:#c9a227">
          <a href="${agendaUrl}" style="display:inline-block;padding:15px 26px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#00172e;text-decoration:none">Adicionar à minha agenda</a>
        </td>
        <td width="10"></td>
        <td style="border:1px solid #00172e">
          <a href="${mapsUrl}" style="display:inline-block;padding:14px 26px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#00172e;text-decoration:none">Como chegar</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:34px 36px 0">
    <p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5c5c5c">Os dois dias, em resumo</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${resumo}
    </table>
    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#5c5c5c">Horário de Brasília. A programação completa está na página da conferência.</p>
  </td></tr>

  <tr><td style="padding:30px 36px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e3dc">
      <tr><td style="padding-top:24px">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5c5c5c">Onde é</p>
        <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.4;color:#00172e">Igreja Reformada de Brasília<br>St. Hoteleiro Projeção I, s/nº, Taguatinga</p>
        <p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5c5c5c">Estacionamento na rua, ali em volta. Não há código de vestimenta.</p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:34px 36px 40px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e3dc">
      <tr><td style="padding-top:22px">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#8a8a8a">
          Você recebeu este e-mail porque se inscreveu na 2ª Conferência Reformada. Guardamos o seu nome, o contato e o número de pessoas só para organizar o evento, e apagamos tudo depois que ele terminar.
        </p>
        <p style="margin:12px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#8a8a8a">
          Precisa trocar alguma coisa ou cancelar? Responda este e-mail. &nbsp;·&nbsp; contato@irbrasilia.org
        </p>
      </td></tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>`

  const text = [
    `Inscrição recebida, ${nome.trim().split(/\s+/)[0]}.`,
    "",
    "Guardamos o seu lugar. Falta só o Pix para a inscrição ficar completa.",
    "",
    `Em nome de: ${nome}`,
    `Dias: ${dias}`,
    `Pessoas: ${pessoas}`,
    `A pagar: ${total}`,
    "",
    `O valor termina em ${centavos} centavos, que marcam que este Pix é da conferência. Pague o valor exato, sem arredondar.`,
    "",
    "Pix copia e cola:",
    brCode,
    "",
    `Adicionar à agenda: ${agendaUrl}`,
    `Como chegar: ${mapsUrl}`,
    "",
    "2ª Conferência Reformada · 7 e 8 de novembro de 2026",
    "Igreja Reformada de Brasília · St. Hoteleiro Projeção I, s/nº, Taguatinga",
  ].join("\n")

  try {
    await transporter.sendMail({
      from: `"Igreja Reformada de Brasília" <${process.env.SMTP_USER}>`,
      replyTo: process.env.CONTACT_EMAIL_DESTINATION,
      to: email,
      bcc: process.env.CONTACT_EMAIL_DESTINATION,
      subject: `Inscrição recebida · 2ª Conferência Reformada (${total} por Pix)`,
      text,
      html,
      attachments: [
        {
          filename: "pix-conferencia.png",
          content: qr,
          cid: "pix-qr",
          contentType: "image/png",
        },
      ],
    })
    return { success: true }
  } catch (error) {
    console.error("Erro no SMTP (inscrição da conferência):", error)
    return { success: false }
  }
}

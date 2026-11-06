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
 * Confirmação da inscrição na conferência. NÃO cobra nada.
 *
 * Em 05/11/2026 ele decidiu que a conferência não é cobrada, e este e-mail era
 * o último lugar que ainda cobrava: saíram o valor do assunto, a frase do
 * "falta só o Pix", a linha "A pagar", o bloco do Pix com o QR e o anexo
 * `pix-conferencia.png`.
 *
 * Ele também decidiu que o e-mail NÃO anuncia que é de graça: *"Não precisa
 * dizer que é gratuito, lembra? Basta não cobrar nada"*. Por isso nenhuma
 * linha aqui fala de dinheiro, nem para dizer que não há. O que a pessoa lê é
 * que o lugar está guardado e que basta chegar.
 *
 * O formato continua sendo tabela com estilo inline, nada de classe CSS,
 * porque cliente de e-mail não lê folha de estilo.
 *
 * Nada aqui promete o que a igreja ainda não confirmou: não diz que há limite
 * de vagas. Ver docs/conferencia-inscricoes.md.
 */
interface InscricaoEmailPayload {
  nome: string
  email: string
  /** Rótulo pronto dos dias escolhidos, ex. "Sábado e domingo". */
  dias: string
  /** Linha das pessoas, ex. "2 adultos e 1 criança". */
  pessoas: string
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
  agendaUrl,
  mapsUrl,
}: InscricaoEmailPayload) {
  const safeNome = escapeHtml(nome)
  const primeiroNome = escapeHtml(nome.trim().split(/\s+/)[0] ?? nome)

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
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:#00172e">Inscrição confirmada, ${primeiroNome}.</p>
    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#5c5c5c">
      O seu lugar está guardado. Basta chegar no sábado e dizer o seu nome no credenciamento.
    </p>
  </td></tr>

  <tr><td style="padding:28px 36px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${linha("Em nome de", safeNome)}${linha("Dias", escapeHtml(dias))}${linha("Pessoas", escapeHtml(pessoas))}
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
    `Inscrição confirmada, ${nome.trim().split(/\s+/)[0]}.`,
    "",
    "O seu lugar está guardado. Basta chegar no sábado e dizer o seu nome no",
    "credenciamento.",
    "",
    `Em nome de: ${nome}`,
    `Dias: ${dias}`,
    `Pessoas: ${pessoas}`,
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
      subject: "Inscrição confirmada · 2ª Conferência Reformada",
      text,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Erro no SMTP (inscrição da conferência):", error)
    return { success: false }
  }
}

/**
 * Convite para o painel da igreja.
 *
 * Por que o e-mail sai por aqui e não pelo Supabase: o Supabase tem um
 * disparador próprio de convite, mas o embutido dele é limitado a poucas
 * mensagens por hora e o texto só se edita no painel dele, em inglês por
 * padrão. O SMTP da igreja já entrega o contato e a inscrição da conferência,
 * então o convite anda pelo mesmo caminho que já funciona.
 *
 * NENHUMA SENHA VIAJA NESTE E-MAIL. O link leva a pessoa a criar a dela, e é
 * de uso único: depois de usado não serve mais nem para ela nem para quem
 * tiver acesso à caixa depois.
 */
interface ConviteEmailPayload {
  /** Para quem o convite vai. */
  email: string
  /** Como a pessoa foi chamada no convite, se foi informado. */
  nome?: string | null
  /** Link de uso único que abre a criação de senha. */
  link: string
}

export async function sendConviteAdminEmail({
  email,
  nome,
  link,
}: ConviteEmailPayload) {
  const tratamento = nome?.trim()
    ? escapeHtml(nome.trim().split(/\s+/)[0])
    : null

  const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e7e2;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff">

  <tr><td style="background:#00172e;padding:30px 36px" align="center">
    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#d9b45f">Igreja Reformada de Brasília</p>
    <p style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:#ffffff">Painel da igreja</p>
  </td></tr>

  <tr><td style="padding:36px 36px 0">
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.35;color:#00172e">${
      tratamento ? `${tratamento}, você` : "Você"
    } recebeu acesso ao painel.</p>
    <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#5c5c5c">
      O painel é a área administrativa do site da igreja. O seu acesso ainda não tem senha: o botão abaixo abre a tela onde você cria a sua.
    </p>
  </td></tr>

  <tr><td style="padding:28px 36px 0" align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" align="center">
      <tr><td style="background:#c9a227">
        <a href="${link}" style="display:inline-block;padding:16px 30px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#00172e;text-decoration:none">Criar a minha senha</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 36px 0">
    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.65;color:#5c5c5c">
      Se o botão não abrir, copie este endereço e cole no navegador:
    </p>
    <p style="margin:10px 0 0;padding:12px;background:#f7f6f3;border:1px solid #e6e3dc;font-family:'Courier New',monospace;font-size:11px;line-height:1.5;color:#1a1a1a;word-break:break-all">${escapeHtml(link)}</p>
  </td></tr>

  <tr><td style="padding:28px 36px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;border-left:4px solid #c9a227">
      <tr><td style="padding:18px 20px">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.7;color:#5c5c5c">
          O link é de uso único e vale para o endereço <strong>${escapeHtml(email)}</strong>. Depois de criar a senha, é por ela que você entra. Ninguém da igreja sabe a sua senha, nem precisa saber.
        </p>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:32px 36px 40px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e6e3dc">
      <tr><td style="padding-top:22px">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#8a8a8a">
          Não esperava este convite? Então ele não é para você: ignore este e-mail e nada acontece. Se quiser avisar, responda esta mensagem.
        </p>
      </td></tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>`

  const text = [
    tratamento
      ? `${tratamento}, você recebeu acesso ao painel da igreja.`
      : "Você recebeu acesso ao painel da igreja.",
    "",
    "O painel é a área administrativa do site. O seu acesso ainda não tem senha; o link abaixo abre a tela onde você cria a sua.",
    "",
    link,
    "",
    `O link é de uso único e vale para o endereço ${email}.`,
    "Ninguém da igreja sabe a sua senha, nem precisa saber.",
    "",
    "Não esperava este convite? Ignore este e-mail e nada acontece.",
    "",
    "Igreja Reformada de Brasília",
  ].join("\n")

  try {
    await transporter.sendMail({
      from: `"Igreja Reformada de Brasília" <${process.env.SMTP_USER}>`,
      replyTo: process.env.CONTACT_EMAIL_DESTINATION,
      to: email,
      subject: "Seu acesso ao painel da Igreja Reformada de Brasília",
      text,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Erro no SMTP (convite do painel):", error)
    return { success: false }
  }
}

/**
 * A lista de inscritos em PDF, anexada, para quem cuida da conferência.
 *
 * Quem monta a folha é lib/inscricoes-pdf.ts, o MESMO gerador do botão do
 * admin: esta função só põe o arquivo no envelope. Ela não lê o banco nem
 * decide colunas, de propósito.
 *
 * O anexo tem nome, e-mail e WhatsApp de quem se inscreveu. Por isso o corpo
 * da mensagem repete isso em uma linha: quem recebe precisa saber o que está
 * encaminhando antes de encaminhar.
 */
interface ListaInscritosPayload {
  /** Para quem a folha vai. */
  para: string
  /** O PDF pronto. */
  arquivo: Buffer
  nomeDoArquivo: string
  /** Quantas inscrições e quantas pessoas a folha lista. */
  inscricoes: number
  pessoas: number
  /** O instante que o PDF cita no rodapé, escrito por extenso. */
  quando: string
}

export async function sendListaInscritosEmail({
  para,
  arquivo,
  nomeDoArquivo,
  inscricoes,
  pessoas,
  quando,
}: ListaInscritosPayload) {
  const texto = [
    "Lista de inscritos da 2ª Conferência Reformada, em anexo.",
    "",
    `Inscrições: ${inscricoes}`,
    `Pessoas esperadas: ${pessoas}`,
    `Gerada em ${quando}.`,
    "",
    "A folha saiu do banco no instante em que foi gerada, pelo mesmo gerador",
    "do botão do painel. Ela tem nome, e-mail e WhatsApp de quem se inscreveu:",
    "é documento de uso interno da igreja.",
  ].join("\n")

  const html = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e7e2;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff">

  <tr><td style="background:#00172e;padding:26px 32px">
    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#d9b45f">2ª Conferência Reformada</p>
    <p style="margin:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#ffffff">Lista de inscritos</p>
  </td></tr>

  <tr><td style="padding:30px 32px 0">
    <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#5c5c5c">
      A folha vai anexada, em PDF, pronta para imprimir.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
      <tr>
        <td style="border-bottom:1px solid #e6e3dc;padding:10px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5c5c5c">Inscrições</td>
        <td align="right" style="border-bottom:1px solid #e6e3dc;padding:10px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#00172e">${inscricoes}</td>
      </tr>
      <tr>
        <td style="border-bottom:1px solid #e6e3dc;padding:10px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5c5c5c">Pessoas esperadas</td>
        <td align="right" style="border-bottom:1px solid #e6e3dc;padding:10px 0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#00172e">${pessoas}</td>
      </tr>
      <tr>
        <td style="border-bottom:1px solid #e6e3dc;padding:10px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5c5c5c">Gerada em</td>
        <td align="right" style="border-bottom:1px solid #e6e3dc;padding:10px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#1a1a1a">${escapeHtml(quando)}</td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 32px 36px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;border-left:4px solid #c9a227">
      <tr><td style="padding:16px 18px">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.7;color:#5c5c5c">
          O anexo tem nome, e-mail e WhatsApp de quem se inscreveu. É documento de uso interno da igreja.
        </p>
      </td></tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>`

  try {
    await transporter.sendMail({
      from: `"Igreja Reformada de Brasília" <${process.env.SMTP_USER}>`,
      to: para,
      subject: `Lista de inscritos · ${inscricoes} inscrições, ${pessoas} pessoas`,
      text: texto,
      html,
      attachments: [
        {
          filename: nomeDoArquivo,
          content: arquivo,
          contentType: "application/pdf",
        },
      ],
    })
    return { success: true }
  } catch (error) {
    console.error("Erro no SMTP (lista de inscritos):", error)
    return { success: false }
  }
}

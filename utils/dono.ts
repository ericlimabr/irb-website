import "server-only"

/**
 * Quem é o dono do painel.
 *
 * O painel da igreja não tem papéis: quem entra, entra inteiro. A única
 * exceção é a tela de usuários, que convida gente nova e por isso só pode
 * existir para uma conta. Esse endereço é essa conta.
 *
 * Por que o e-mail e não o id do Supabase: o id é um UUID que ninguém
 * reconhece ao ler o código, e se a conta for recriada no Supabase o id muda
 * e o painel ficaria sem dono sem ninguém entender por quê. O endereço é
 * estável e legível.
 *
 * ADMIN_OWNER_EMAIL existe para trocar o dono sem mexer no código (por
 * exemplo, se a igreja migrar para contato@irbrasilia.org). Vazia, vale o
 * endereço abaixo.
 *
 * VAZIA QUER DIZER AUSENTE, e é por isso que o teste não é `??`: uma variável
 * declarada sem valor (`ADMIN_OWNER_EMAIL=` no .env) chega como string vazia,
 * que `??` aceita como valor bom. O dono viraria string vazia, `ehDono` daria
 * falso para todo mundo, e o painel ficaria sem dono: foi exatamente o que
 * aconteceu em 02/11/2026, e some tela de usuário e de manutenção sem erro
 * nenhum no caminho.
 */
const DO_AMBIENTE = process.env.ADMIN_OWNER_EMAIL?.trim()

export const EMAIL_DO_DONO = (
  DO_AMBIENTE && DO_AMBIENTE.length > 0
    ? DO_AMBIENTE
    : "igrejareformadabrasilia@gmail.com"
).toLowerCase()

/** Verdadeiro só para o endereço acima. Comparação sem caixa nem espaço. */
export function ehDono(email?: string | null): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === EMAIL_DO_DONO
}

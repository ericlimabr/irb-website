/**
 * A isca de robô dos formulários públicos.
 *
 * Isca de robô é um campo escondido que pessoa nenhuma vê: se vier preenchido,
 * quem enviou provavelmente foi um programa.
 *
 * Esta isca JÁ NÃO RECUSA NADA, e é importante saber por quê, porque a
 * tentação de voltar a recusar é grande.
 *
 * Ela se chamava `website` e era um campo de texto escondido fora da tela. Esse
 * nome é reconhecido por gerenciador de senha e por autofill, que o preenchiam
 * sozinhos, e quem apanhava era gente de verdade: a pessoa era tratada como
 * robô e não conseguia se inscrever de jeito nenhum, sempre com o mesmo erro.
 *
 * Em 20/10/2026 trocamos o nome por um que nenhum desses programas conhece e
 * pusemos todos os atributos de opt-out que cada gerenciador documenta. No
 * mesmo dia, duas pessoas foram barradas outra vez, as duas pelo celular: o
 * preenchimento automático do telefone achou o campo de novo, pelo formato e
 * pela posição, sem precisar do nome.
 *
 * A lição é que esse palpite não pode ficar entre uma pessoa e a inscrição
 * dela. Então a isca virou SINAL, não parede: se vier marcada, o envio segue
 * normalmente e fica uma linha de aviso no log. Quem defende de robô agora é o
 * limite por e-mail, que conta linhas no banco e não chuta.
 *
 * Duas mudanças tornam o preenchimento automático improvável, e elas são
 * independentes de propósito:
 *
 * 1. O campo é uma CAIXA DE MARCAR. Gerenciador de senha e autofill escrevem
 *    texto; nenhum deles marca caixa.
 * 2. O campo é escondido com `display: none`, e não deslocado para fora da
 *    tela. Campo que não é desenhado não entra no preenchimento automático,
 *    enquanto campo fora da tela continua sendo um campo de verdade.
 *
 * Se as duas falharem, ninguém fica de fora: o pior que acontece é uma linha
 * de aviso no log pedindo para a igreja conferir se aquela inscrição é de
 * gente.
 */
export const ISCA_CAMPO = "confirmacao_de_envio"

/** Atributos que pedem aos gerenciadores de senha para passar longe. */
export const ISCA_ATRIBUTOS = {
  tabIndex: -1,
  autoComplete: "off",
  "aria-hidden": true,
  "data-1p-ignore": "",
  "data-lpignore": "true",
  "data-bwignore": "",
  "data-form-type": "other",
} as const

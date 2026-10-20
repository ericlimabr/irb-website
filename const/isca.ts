/**
 * O nome do campo-isca dos formulários públicos.
 *
 * Isca de robô é um campo escondido que pessoa nenhuma vê: se vier
 * preenchido, quem enviou foi um programa, e o servidor recusa.
 *
 * Ele se chamava `website` até 20/10/2026, e esse nome era o defeito:
 * gerenciador de senha, autofill do navegador e serviço de preenchimento do
 * celular reconhecem `website`, `url` e `site` e preenchem o campo sozinhos,
 * mesmo escondido e mesmo com `autocomplete="off"`. Quando isso acontece com
 * uma pessoa de verdade, ela é tratada como robô e não consegue se inscrever
 * por mais que tente, sempre com o mesmo erro.
 *
 * O nome novo não lembra nada que esses programas saibam preencher. Junto com
 * ele, o campo leva os atributos que cada gerenciador documenta para ser
 * ignorado (`data-1p-ignore`, `data-lpignore`, `data-bwignore` e
 * `data-form-type="other"`), em ISCA_ATRIBUTOS.
 *
 * Trocar o nome não basta por si: a partir de agora, isca preenchida também
 * vira linha no log de erro e aviso no WhatsApp, para a igreja descobrir no
 * mesmo minuto se isso voltar a acontecer com alguém.
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

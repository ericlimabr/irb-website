/**
 * Liga o gancho de resolução do scripts/resolve-ts.mjs.
 *
 * Vai na linha de comando como `--import ./scripts/ts.mjs`, antes do script
 * que se quer rodar. O arquivo é só isto: o gancho roda em outra linha de
 * execução, e quem registra não pode ser o próprio gancho.
 */

import { register } from "node:module"

register("./resolve-ts.mjs", import.meta.url)

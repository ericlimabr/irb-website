"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/primitives/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteInscricao } from "@/app/actions/inscricao"
import { brl } from "@/utils/inscricao"

/**
 * A lixeira de uma linha da lista de inscrições.
 *
 * Apagar não tem volta, então o clique abre um modal que diz de quem é a
 * inscrição antes de perguntar. O botão fica numa ilha de cliente: a lista
 * segue sendo página de servidor.
 */

interface Props {
  id: string
  numero: number
  nome: string
  valor: number
  paga: boolean
}

export default function BotaoApagarInscricao({
  id,
  numero,
  nome,
  valor,
  paga,
}: Props) {
  const [aberto, setAberto] = useState(false)
  const [apagando, iniciar] = useTransition()
  const { toast } = useToast()

  function confirma() {
    iniciar(async () => {
      const r = await deleteInscricao(id)
      if (r?.error) {
        toast({
          title: "Não deu",
          description: r.error,
          variant: "destructive",
        })
        return
      }
      toast({ title: `Inscrição ${String(numero).padStart(4, "0")} apagada` })
      setAberto(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        title={`Apagar a inscrição de ${nome}`}
        aria-label={`Apagar a inscrição de ${nome}`}
        className="shrink-0 border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <AlertDialog open={aberto} onOpenChange={setAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apagar a inscrição {String(numero).padStart(4, "0")}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              É a inscrição de <b>{nome}</b>, de {brl(valor)}
              {paga ? ", já marcada como paga" : ", ainda aguardando pagamento"}
              . Apagar não tem volta: a linha sai do banco, o número não é
              reaproveitado e ela desaparece da exportação em Excel. Se já houve
              pagamento, apagar não devolve dinheiro nenhum.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={apagando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // O modal fecharia sozinho antes de o servidor responder, e
                // o erro não teria onde aparecer.
                e.preventDefault()
                confirma()
              }}
              disabled={apagando}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {apagando ? "Apagando…" : "Apagar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

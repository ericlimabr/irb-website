"use client"

import { useState, useTransition } from "react"
import { Lock, LockOpen } from "lucide-react"
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
import { setInscricoesEncerradas } from "@/app/actions/inscricao"
import { CONFERENCE_PATH } from "@/const"

/**
 * O botão que encerra e reabre as inscrições da conferência.
 *
 * Um clique aqui muda a página pública, então ele pergunta antes, como a
 * lixeira da lista. O modal diz o que a visitante vai ver depois do clique,
 * porque "encerrar" sozinho não deixa claro o que acontece na tela dela.
 *
 * Tem volta: reabrir é o mesmo botão no sentido contrário, e nenhuma inscrição
 * já gravada é tocada por nenhum dos dois.
 */
export default function BotaoEncerrarInscricoes({
  encerrada,
}: {
  encerrada: boolean
}) {
  const [aberto, setAberto] = useState(false)
  const [mudando, iniciar] = useTransition()
  const { toast } = useToast()

  function confirma() {
    iniciar(async () => {
      const r = await setInscricoesEncerradas(!encerrada)
      if (r?.error) {
        toast({
          title: "Não deu",
          description: r.error,
          variant: "destructive",
        })
        return
      }
      toast({
        title: encerrada ? "Inscrições reabertas" : "Inscrições encerradas",
        description: encerrada
          ? "A página voltou a mostrar o formulário."
          : `A página ${CONFERENCE_PATH} passou a dizer que as inscrições estão encerradas.`,
      })
      setAberto(false)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className={`flex items-center gap-2 border px-4 py-2 font-mono text-2xs uppercase tracking-[0.1em] transition-colors ${
          encerrada
            ? "border-gold-500 bg-gold-500 text-navy-900 hover:bg-gold-500/90"
            : "border-border text-muted-foreground hover:border-gold-500 hover:text-foreground"
        }`}
      >
        {encerrada ? (
          <Lock className="h-3.5 w-3.5" />
        ) : (
          <LockOpen className="h-3.5 w-3.5" />
        )}
        {encerrada ? "Inscrições encerradas" : "Encerrar inscrições"}
      </button>

      <AlertDialog open={aberto} onOpenChange={setAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {encerrada ? "Reabrir as inscrições?" : "Encerrar as inscrições?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {encerrada ? (
                <>
                  A página <b>{CONFERENCE_PATH}</b> volta a mostrar o
                  formulário, e quem chegar nela consegue se inscrever de novo.
                </>
              ) : (
                <>
                  A página <b>{CONFERENCE_PATH}</b> deixa de mostrar o
                  formulário e passa a dizer que as inscrições estão encerradas.
                  Quem já tinha a página aberta também não consegue mais enviar.
                  As inscrições já gravadas não mudam, e você pode reabrir
                  depois com o mesmo botão.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mudando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                // O modal fecharia sozinho antes de o servidor responder, e o
                // erro não teria onde aparecer.
                e.preventDefault()
                confirma()
              }}
              disabled={mudando}
            >
              {mudando ? "Mudando…" : encerrada ? "Reabrir" : "Encerrar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

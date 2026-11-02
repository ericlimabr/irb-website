"use client"

import { useState, useTransition } from "react"
import { Power, PowerOff } from "lucide-react"
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
import { setSiteEmManutencao } from "@/app/actions/manutencao"

/**
 * O botão que tira o site do ar e o devolve.
 *
 * Pergunta antes, como o de encerrar inscrições, e o modal diz o que o
 * visitante vai ver depois do clique: "tirar do ar" sozinho não deixa claro
 * se o endereço cai ou se mostra alguma coisa.
 *
 * Tem volta, e é o mesmo botão no sentido contrário. Nada do site é apagado:
 * o que muda é uma coluna no banco.
 */
export default function BotaoManutencao({
  manutencao,
}: {
  manutencao: boolean
}) {
  const [aberto, setAberto] = useState(false)
  const [mudando, iniciar] = useTransition()
  const { toast } = useToast()

  function confirma() {
    iniciar(async () => {
      const r = await setSiteEmManutencao(!manutencao)
      if (r?.error) {
        toast({
          title: "Não deu",
          description: r.error,
          variant: "destructive",
        })
        return
      }
      toast({
        title: manutencao ? "Site de volta ao ar" : "Site fora do ar",
        description: manutencao
          ? "As páginas voltaram a abrir normalmente."
          : "Quem abrir o site agora vê a tela de manutenção.",
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
          manutencao
            ? "border-amber-600 bg-amber-600 text-white hover:bg-amber-600/90"
            : "border-border text-muted-foreground hover:border-gold-500 hover:text-foreground"
        }`}
      >
        {manutencao ? (
          <PowerOff className="h-3.5 w-3.5" />
        ) : (
          <Power className="h-3.5 w-3.5" />
        )}
        {manutencao ? "Site fora do ar" : "Tirar o site do ar"}
      </button>

      <AlertDialog open={aberto} onOpenChange={setAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {manutencao ? "Devolver o site ao ar?" : "Tirar o site do ar?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {manutencao ? (
                <>
                  Todas as páginas voltam a abrir normalmente, inclusive a da
                  conferência e a de links, do jeito que estavam.
                </>
              ) : (
                <>
                  Quem abrir qualquer página do site passa a ver uma tela
                  dizendo que a igreja está em manutenção. Isso vale também para
                  a página da conferência, a de links e a das campanhas de
                  anúncio. Este painel continua funcionando, e é por aqui que
                  você devolve o site ao ar.
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
              {mudando
                ? "Mudando…"
                : manutencao
                  ? "Devolver ao ar"
                  : "Tirar do ar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

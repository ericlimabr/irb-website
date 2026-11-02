"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { usePathname } from "next/navigation"

/**
 * O estado da gaveta do menu no celular.
 *
 * Mora em contexto porque quem abre e quem é aberto são irmãos na árvore: o
 * botão está no cabeçalho (components/layout/admin/AdminHeader.tsx) e a gaveta
 * é a barra lateral (AdminSidebar.tsx). Passar por props exigiria subir os dois
 * para o mesmo componente, e a barra é montada pelo servidor para já vir com a
 * contagem de mensagens e com o `ehDono`.
 *
 * No computador (lg em diante) este estado não é usado: a barra está sempre
 * visível, e o botão nem é desenhado.
 */

type Menu = {
  aberto: boolean
  abrir: () => void
  fechar: () => void
  alternar: () => void
}

const Contexto = createContext<Menu | null>(null)

export function MenuDoPainelProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const caminho = usePathname()

  /*
    O estado guardado não é "aberta", e sim EM QUAL TELA ela foi aberta. Assim
    trocar de tela fecha a gaveta sozinho, por derivação: o caminho muda, deixa
    de bater, e `aberto` vira falso no mesmo render. A versão com um booleano
    precisaria de um efeito chamando setState a cada navegação, que é o que o
    react-hooks/set-state-in-effect proíbe, e com razão: renderiza duas vezes e
    a gaveta chega a piscar por cima da tela nova.
  */
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const aberto = abertoEm !== null && abertoEm === caminho

  const fechar = useCallback(() => setAbertoEm(null), [])

  // Esc fecha, como todo painel que cobre a tela.
  useEffect(() => {
    if (!aberto) return
    const naTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbertoEm(null)
    }
    window.addEventListener("keydown", naTecla)
    return () => window.removeEventListener("keydown", naTecla)
  }, [aberto])

  // Trava a rolagem do fundo enquanto a gaveta está aberta: sem isso o dedo
  // rola a lista atrás do menu, que é o jeito mais rápido de se perder.
  useEffect(() => {
    if (!aberto) return
    const antes = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = antes
    }
  }, [aberto])

  const valor = useMemo(
    () => ({
      aberto,
      abrir: () => setAbertoEm(caminho),
      fechar,
      alternar: () => setAbertoEm((v) => (v === caminho ? null : caminho)),
    }),
    [aberto, caminho, fechar],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

/**
 * Fora do provedor devolve um menu que não faz nada, em vez de quebrar: assim
 * a barra e o cabeçalho continuam renderizáveis isolados (num teste, por
 * exemplo) sem precisar montar o painel inteiro.
 */
export function useMenuDoPainel(): Menu {
  return (
    useContext(Contexto) ?? {
      aberto: false,
      abrir: () => {},
      fechar: () => {},
      alternar: () => {},
    }
  )
}

"use client"

import { ExternalLink, Bell, ChevronRight, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/primitives/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/primitives/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives/dropdown-menu"
import { useRouter } from "next/navigation"
import { cn } from "@/utils/styling"
import { useToast } from "@/hooks/use-toast"
import { createBrowserClient } from "@supabase/ssr"
import { useMenuDoPainel } from "./MenuContexto"

interface AdminHeaderProps {
  breadcrumbs?: { label: string; href?: string }[]
}

export default function AdminHeader({
  breadcrumbs = [{ label: "Painel" }, { label: "Visão Geral" }],
}: AdminHeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const menu = useMenuDoPainel()

  const handleLogout = async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      // Auth isn't configured yet — nothing to sign out of. Bounce to /login.
      router.push("/login")
      return
    }

    const supabase = createBrowserClient(url, key)
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível encerrar sua sessão.",
      })
      return
    }

    toast({
      title: "Sessão encerrada",
      description: "Você saiu do painel administrativo.",
    })

    router.refresh()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-admin-nav-border bg-admin-nav-bg">
      <div className="flex h-full items-center justify-between gap-2 px-4 lg:px-6">
        {/* Abre a gaveta do menu. Só no celular. */}
        <button
          type="button"
          onClick={menu.abrir}
          aria-label="Abrir menu"
          aria-expanded={menu.aberto}
          className="-ml-2 shrink-0 p-2 text-admin-nav-text transition-colors hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/*
          Breadcrumbs. No celular aparece só o último degrau: "Painel >
          Inscrições" em tela de 360px empurraria os botões da direita para
          fora.
        */}
        <nav className="flex min-w-0 items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1",
                index < breadcrumbs.length - 1 && "hidden sm:flex",
              )}
            >
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-admin-nav-text/50" />
              )}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "font-medium text-white"
                    : "text-admin-nav-text hover:text-white cursor-pointer transition-colors"
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-admin-nav-border bg-transparent text-admin-nav-text hover:bg-admin-nav-border hover:text-white"
            onClick={() => window.open("/", "_blank")}
          >
            <ExternalLink className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Ver Site</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-admin-nav-text hover:bg-admin-nav-border hover:text-white"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full ring-2 ring-admin-nav-border hover:ring-primary transition-all"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt="Administrador" />
                  <AvatarFallback className="bg-admin-nav-active text-white font-semibold text-xs">
                    IRB
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-card border-border"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Administrador
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Igreja Cristã Reformada
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

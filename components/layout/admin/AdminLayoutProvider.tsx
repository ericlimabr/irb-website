"use client"

import { useState } from "react"
import { Toaster } from "@/components/ui/primitives/toaster"
import { Toaster as Sonner } from "@/components/ui/primitives/sonner"
import { TooltipProvider } from "@/components/ui/primitives/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function AdminLayoutProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
}

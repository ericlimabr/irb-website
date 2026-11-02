import { redirect } from "next/navigation"
import AdminLayoutProvider from "@/components/layout/admin/AdminLayoutProvider"
import ServersideAdminSidebar from "@/components/layout/admin/ServersideAdminSidebar"
import AdminHeader from "@/components/layout/admin/AdminHeader"
import { getUser } from "@/utils/getUser"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware already guards this, but re-check on the server as defence in
  // depth. Skipped when Supabase isn't configured so the shell can be built.
  const configured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  if (configured && !(await getUser())) {
    redirect("/login")
  }

  return (
    <AdminLayoutProvider>
      <div className="painel-escala min-h-screen bg-background">
        <ServersideAdminSidebar />
        {/*
          A margem da barra lateral só existe de lg (1024px) em diante, que é
          onde a barra ocupa lugar de verdade. Antes disso ela é uma gaveta que
          desliza por cima, e `pl-64` cravado deixava o conteúdo espremido numa
          faixa estreita no celular.
        */}
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="p-4 sm:p-5 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminLayoutProvider>
  )
}

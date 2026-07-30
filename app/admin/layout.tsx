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
      <div className="min-h-screen bg-background">
        <ServersideAdminSidebar />
        <div className="pl-64">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </AdminLayoutProvider>
  )
}

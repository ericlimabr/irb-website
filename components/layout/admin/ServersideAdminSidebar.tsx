import { countUnreadMessages } from "@/app/actions/contact"
import { getUser } from "@/utils/getUser"
import AdminSidebar from "./AdminSidebar"

export default async function ServersideAdminSidebar() {
  const totalUnreadMessages = await countUnreadMessages()
  const user = await getUser()
  return (
    <AdminSidebar
      countUnreadMessages={totalUnreadMessages}
      ehDono={!!user?.ehDono}
    />
  )
}

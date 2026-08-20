import Analytics from "@/components/analytics/Analytics"
import BackBar from "@/components/layout/BackBar"
import Footer from "@/components/layout/Footer"
import Navigation from "@/components/layout/Navigation"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import { ReactNode } from "react"

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Analytics />
      <Navigation />
      <BackBar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  )
}

import Footer from "@/components/layout/Footer"
import Navigation from "@/components/layout/Navigation"
import { ReactNode } from "react"

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}

"use client"

import { AuditContainer } from "@/components/audit/audit-container"
import { Header } from "@/components/layout/header"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-muted/30">
      <Header />
      <AuditContainer />
    </main>
  )
}

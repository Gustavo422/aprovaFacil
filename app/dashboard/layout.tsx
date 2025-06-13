import type React from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Simulados",
    href: "/dashboard/simulados",
    icon: "FileText",
  },
  {
    title: "Questões Semanais",
    href: "/dashboard/questoes-semanais",
    icon: "ListChecks",
  },
  {
    title: "Plano de Estudos",
    href: "/dashboard/plano-estudos",
    icon: "Calendar",
  },
  {
    title: "Mapa de Assuntos",
    href: "/dashboard/mapa-assuntos",
    icon: "Map",
  },
  {
    title: "Flashcards",
    href: "/dashboard/flashcards",
    icon: "Layers",
  },
  {
    title: "Apostilas",
    href: "/dashboard/apostilas",
    icon: "BookOpen",
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: "Settings",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Concursos Study App</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <SidebarNav items={sidebarNavItems} className="p-4" />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>
    </div>
  )
}

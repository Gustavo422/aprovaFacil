"use client"

import type React from "react"
import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, LayoutDashboard, FileText, ListChecks, Calendar, Map, Layers, BookOpen, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-card border-r border-border">
          <div className="flex items-center flex-shrink-0 px-6">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/aprova_facil_logo.png"
                alt="AprovaFácil Logo"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
              <span className="text-xl font-bold text-foreground">AprovaFácil</span>
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-4">
            <SidebarNav items={sidebarNavItems} />
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 py-5 border-b border-border">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/aprova_facil_logo.png"
                  alt="AprovaFácil Logo"
                  width={32}
                  height={32}
                  priority
                  className="object-contain"
                />
                <span className="text-lg font-bold">AprovaFácil</span>
              </Link>
            </div>
            <nav className="flex-1 px-4 py-6">
              <SidebarNav items={sidebarNavItems} />
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
            
            <div className="flex items-center space-x-4 ml-auto">
              <UserNav />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 container-padding py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
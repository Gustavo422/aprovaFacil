"use client"

import type React from "react"
import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, LayoutDashboard, FileText, ListChecks, Calendar, Map } from "lucide-react"
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

// Map for bottom navigation icons
const bottomNavIconMap = {
  LayoutDashboard,
  FileText,
  ListChecks,
  Calendar,
  Map,
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center px-6 py-4">
          {/* Hamburger on far left */}
          <div className="flex items-center">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden [&_svg]:!h-8 [&_svg]:!w-8">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-lg font-bold">Menu</h1>
                </div>
                <SidebarNav items={sidebarNavItems} className="flex-col space-y-1" />
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo in the center */}
          <div className="flex-grow flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/aprova_facil_logo.png"
                alt="AprovaFácil Logo"
                width={72}
                height={72}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* UserNav on far right */}
          <div className="flex items-center">
            <UserNav />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container flex-1 items-start">
        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden py-6">{children}</main>
      </div>

      
    </div>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  Calendar,
  Map,
  Layers,
  BookOpen,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

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

const featureItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    description: "Visão geral do seu progresso e atividades.",
  },
  {
    title: "Simulados",
    href: "/dashboard/simulados",
    icon: "FileText",
    description: "Teste seus conhecimentos com simulados personalizados.",
  },
  {
    title: "Questões Semanais",
    href: "/dashboard/questoes-semanais",
    icon: "ListChecks",
    description: "Pratique com questões selecionadas semanalmente.",
  },
  {
    title: "Plano de Estudos",
    href: "/dashboard/plano-estudos",
    icon: "Calendar",
    description: "Organize sua rotina de estudos de forma eficiente.",
  },
  {
    title: "Mapa de Assuntos",
    href: "/dashboard/mapa-assuntos",
    icon: "Map",
    description: "Visualize e domine os tópicos importantes.",
  },
  {
    title: "Flashcards",
    href: "/dashboard/flashcards",
    icon: "Layers",
    description: "Memorize conteúdo de forma rápida e eficaz.",
  },
  {
    title: "Apostilas",
    href: "/dashboard/apostilas",
    icon: "BookOpen",
    description: "Acesse materiais de estudo completos e atualizados.",
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: "Settings",
    description: "Ajuste as preferências do seu aplicativo.",
  },
]

const iconMap = {
  LayoutDashboard,
  FileText,
  ListChecks,
  Calendar,
  Map,
  Layers,
  BookOpen,
  Settings,
}

export default function HomePage() {
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
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo ao AprovaFácil!</h1>
          <p className="text-lg text-muted-foreground">Sua plataforma completa para estudos e aprovação.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {featureItems.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap]
            return (
              <Link href={item.href} key={item.title}>
                <Card className="h-full flex flex-col items-center text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    {IconComponent && <IconComponent className="h-12 w-12 text-primary" />}
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-center items-center">
                    <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

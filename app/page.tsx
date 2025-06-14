"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  ArrowRight,
} from "lucide-react"
import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { UserNav } from "@/components/user-nav"
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
    icon: LayoutDashboard,
    description: "Visão geral do seu progresso e atividades.",
  },
  {
    title: "Simulados",
    href: "/dashboard/simulados",
    icon: FileText,
    description: "Teste seus conhecimentos com simulados personalizados.",
  },
  {
    title: "Questões Semanais",
    href: "/dashboard/questoes-semanais",
    icon: ListChecks,
    description: "Pratique com questões selecionadas semanalmente.",
  },
  {
    title: "Plano de Estudos",
    href: "/dashboard/plano-estudos",
    icon: Calendar,
    description: "Organize sua rotina de estudos de forma eficiente.",
  },
  {
    title: "Mapa de Assuntos",
    href: "/dashboard/mapa-assuntos",
    icon: Map,
    description: "Visualize e domine os tópicos importantes.",
  },
  {
    title: "Flashcards",
    href: "/dashboard/flashcards",
    icon: Layers,
    description: "Memorize conteúdo de forma rápida e eficaz.",
  },
  {
    title: "Apostilas",
    href: "/dashboard/apostilas",
    icon: BookOpen,
    description: "Acesse materiais de estudo completos e atualizados.",
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
    description: "Ajuste as preferências do seu aplicativo.",
  },
]

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container-padding flex h-16 items-center">
          {/* Mobile Menu */}
          <div className="flex items-center lg:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
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
          </div>

          {/* Logo */}
          <div className="flex-grow flex justify-center lg:justify-start lg:flex-grow-0">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/aprova_facil_logo.png"
                alt="AprovaFácil Logo"
                width={40}
                height={40}
                priority
                className="object-contain"
              />
              <span className="text-xl font-bold hidden sm:block">AprovaFácil</span>
            </Link>
          </div>

          {/* User Nav */}
          <div className="flex items-center">
            <UserNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-padding py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Bem-vindo ao{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                AprovaFácil
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sua plataforma completa para estudos e aprovação em concursos públicos.
              Organize, pratique e conquiste seus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Acessar Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Recursos Disponíveis</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore todas as ferramentas disponíveis para otimizar seus estudos
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featureItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link href={item.href} key={item.title}>
                    <Card className="card-hover cursor-pointer group h-full">
                      <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ClipboardList,
  ListChecks,
  CalendarDays,
  Map,
  BookMarked,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { UserNav } from '@/components/user-nav';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const sidebarNavItems = [
  {
    title: 'Guru da Aprovação',
    href: '/dashboard',
    icon: 'GraduationCap',
  },
  {
    title: 'Simulados Personalizados',
    href: '/dashboard/simulados-personalizados',
    icon: 'ClipboardList',
  },
  {
    title: 'Questões Semanais',
    href: '/dashboard/100-questoes',
    icon: 'ListChecks',
  },
  {
    title: 'Plano de Estudos',
    href: '/dashboard/plano-estudos-inteligente',
    icon: 'CalendarDays',
  },
  {
    title: 'Mapa de Assuntos',
    href: '/dashboard/mapa-materias',
    icon: 'Map',
  },
  {
    title: 'Cartões de Estudo',
    href: '/dashboard/cartoes-memorizacao',
    icon: 'BookMarked',
  },
  {
    title: 'Apostilas',
    href: '/dashboard/apostila-inteligente',
    icon: 'BookOpen',
  },
];

const featureItems = [
  {
    title: 'Guru da Aprovação',
    href: '/dashboard',
    icon: GraduationCap,
    description: 'Visão geral do seu progresso e atividades.',
  },
  {
    title: 'Simulados Personalizados',
    href: '/dashboard/simulados-personalizados',
    icon: ClipboardList,
    description: 'Teste seus conhecimentos com simulados personalizados e acompanhe seu desempenho.',
  },
  {
    title: 'Questões Semanais',
    href: '/dashboard/100-questoes',
    icon: ListChecks,
    description: 'Pratique com 100 questões selecionadas semanalmente para fixação do conteúdo.',
  },
  {
    title: 'Plano de Estudos',
    href: '/dashboard/plano-estudos-inteligente',
    icon: CalendarDays,
    description: 'Plano de estudos inteligente personalizado para otimizar seu aprendizado.',
  },
  {
    title: 'Mapa de Matérias',
    href: '/dashboard/mapa-materias',
    icon: Map,
    description: 'Visualize e domine as matérias e tópicos importantes para sua aprovação.',
  },
  {
    title: 'Cartões de Estudo',
    href: '/dashboard/cartoes-memorizacao',
    icon: BookMarked,
    description: 'Cartões de memorização para fixação de conceitos-chave de forma eficiente.',
  },
  {
    title: 'Apostilas',
    href: '/dashboard/apostila-inteligente',
    icon: BookOpen,
    description: 'Apostila inteligente com conteúdo completo e atualizado para seus estudos.',
  },

];

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const memoizedFeatureItems = useMemo(() => featureItems, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0"
          onOpenAutoFocus={event => event.preventDefault()}
        >
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <div className="flex flex-col h-full">
            <nav className="flex-1 px-4 py-12">
              <SidebarNav items={sidebarNavItems} />
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                size="icon"
                className="bg-accent text-accent-foreground"
                onClick={handleSidebarToggle}
              >
                <Menu className="h-full w-full" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </div>

            {/* Logo Centralizada */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/aprova_facil_logo.png"
                  alt="AprovaFácil Logo"
                  width={40}
                  height={40}
                  priority
                  className="object-contain"
                />
                <span className="text-xl font-black text-[#1e40af] hidden sm:block">
                  AprovaFácil
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container-padding py-16">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Bem-vindo ao{' '}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  AprovaFácil
                </span>
              </h1>
            </div>

            {/* Features Grid */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Recursos Disponíveis</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore todas as ferramentas disponíveis para otimizar seus
                  estudos
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {memoizedFeatureItems.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <Link href={item.href} key={item.title}>
                      <Card className="card-hover cursor-pointer group h-full">
                        <CardHeader className="text-center space-y-4">
                          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <CardTitle className="text-lg">
                              {item.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

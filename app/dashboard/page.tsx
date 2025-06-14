import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, CheckCircle, Clock, FileText, ListChecks, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Bem-vindo ao seu dashboard de estudos para concursos.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="overview" className="text-xs md:text-sm">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs md:text-sm">Análise</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs md:text-sm">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards - Mobile optimized */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-3 md:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-xs md:text-sm font-medium">Simulados Realizados</CardTitle>
                <FileText className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="text-lg md:text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 desde a semana passada</p>
              </CardContent>
            </Card>
            <Card className="p-3 md:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-xs md:text-sm font-medium">Questões Respondidas</CardTitle>
                <ListChecks className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="text-lg md:text-2xl font-bold">583</div>
                <p className="text-xs text-muted-foreground">+89 desde a semana passada</p>
              </CardContent>
            </Card>
            <Card className="p-3 md:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-xs md:text-sm font-medium">Tempo de Estudo</CardTitle>
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="text-lg md:text-2xl font-bold">32h</div>
                <p className="text-xs text-muted-foreground">+4h desde a semana passada</p>
              </CardContent>
            </Card>
            <Card className="p-3 md:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-xs md:text-sm font-medium">Taxa de Acerto</CardTitle>
                <Target className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0 pt-2">
                <div className="text-lg md:text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">+2% desde a semana passada</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content grid - Mobile optimized */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Plano de Estudos</CardTitle>
                <CardDescription className="text-sm">Seu progresso no plano de estudos atual</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 pr-2 md:pl-6 md:pr-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-medium">Direito Constitucional</span>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-medium">Direito Administrativo</span>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-medium">Português</span>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                        <span className="text-xs md:text-sm font-medium">Raciocínio Lógico</span>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Atividades Recentes</CardTitle>
                <CardDescription className="text-sm">Suas últimas atividades na plataforma</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 pr-2 md:pl-6 md:pr-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-4 w-4 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium leading-none">Simulado concluído</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">Simulado de Direito Constitucional</p>
                      <p className="text-xs text-muted-foreground">Hoje às 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="mt-1 h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium leading-none">Apostila acessada</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">Apostila de Direito Administrativo</p>
                      <p className="text-xs text-muted-foreground">Ontem às 15:45</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ListChecks className="mt-1 h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium leading-none">Questões semanais</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">20 questões respondidas</p>
                      <p className="text-xs text-muted-foreground">Ontem às 09:15</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Desempenho por Disciplina</CardTitle>
                <CardDescription className="text-sm">Seu desempenho nas principais disciplinas</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 pr-2 md:pl-6 md:pr-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">Direito Constitucional</span>
                      <span className="text-xs md:text-sm text-muted-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">Direito Administrativo</span>
                      <span className="text-xs md:text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">Português</span>
                      <span className="text-xs md:text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">Raciocínio Lógico</span>
                      <span className="text-xs md:text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium">Informática</span>
                      <span className="text-xs md:text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg md:text-xl">Pontos Fracos</CardTitle>
                <CardDescription className="text-sm">Temas que precisam de mais atenção</CardDescription>
              </CardHeader>
              <CardContent className="pl-2 pr-2 md:pl-6 md:pr-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div>
                      <p className="text-xs md:text-sm font-medium">Direito Processual Civil</p>
                      <p className="text-xs text-muted-foreground">45% de acerto</p>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-red-600">45%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <div>
                      <p className="text-xs md:text-sm font-medium">Direito Tributário</p>
                      <p className="text-xs text-muted-foreground">52% de acerto</p>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-yellow-600">52%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div>
                      <p className="text-xs md:text-sm font-medium">Direito do Trabalho</p>
                      <p className="text-xs text-muted-foreground">58% de acerto</p>
                    </div>
                    <span className="text-xs md:text-sm font-bold text-orange-600">58%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Relatórios de Desempenho</CardTitle>
              <CardDescription className="text-sm">Acompanhe seu progresso detalhado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85%</div>
                    <p className="text-xs md:text-sm text-muted-foreground">Taxa de Aprovação</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <p className="text-xs md:text-sm text-muted-foreground">Simulados Realizados</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">32h</div>
                    <p className="text-xs md:text-sm text-muted-foreground">Tempo Total de Estudo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <h2 className="mt-4 text-2xl font-bold tracking-tight">Acesso Rápido</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/simulados">
          <Card className="h-full transition-all hover:border-primary hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Simulados
              </CardTitle>
              <CardDescription>Pratique com simulados completos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Acesse simulados personalizados com timer e correção automática.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/questoes-semanais">
          <Card className="h-full transition-all hover:border-primary hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Questões Semanais
              </CardTitle>
              <CardDescription>100 questões selecionadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Pratique com 100 questões selecionadas semanalmente.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/plano-estudos">
          <Card className="h-full transition-all hover:border-primary hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Plano de Estudos
              </CardTitle>
              <CardDescription>Seu cronograma personalizado</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Acesse seu plano de estudos inteligente baseado no seu tempo disponível.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/flashcards">
          <Card className="h-full transition-all hover:border-primary hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Flashcards
              </CardTitle>
              <CardDescription>Memorize conceitos importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Pratique com flashcards dinâmicos baseados nos seus pontos fracos.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

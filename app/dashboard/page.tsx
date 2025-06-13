import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, CheckCircle, Clock, FileText, ListChecks, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Bem-vindo ao seu dashboard de estudos para concursos.</p>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Simulados Realizados</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 desde a semana passada</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questões Respondidas</CardTitle>
                <ListChecks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">583</div>
                <p className="text-xs text-muted-foreground">+89 desde a semana passada</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo de Estudo</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32h</div>
                <p className="text-xs text-muted-foreground">+4h desde a semana passada</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">+2% desde a semana passada</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Plano de Estudos</CardTitle>
                <CardDescription>Seu progresso no plano de estudos atual</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Direito Constitucional</span>
                      </div>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Direito Administrativo</span>
                      </div>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Português</span>
                      </div>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Raciocínio Lógico</span>
                      </div>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
                <CardDescription>Suas últimas atividades na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Simulado concluído</p>
                      <p className="text-sm text-muted-foreground">Simulado de Direito Constitucional</p>
                      <p className="text-xs text-muted-foreground">Hoje às 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BookOpen className="mt-1 h-5 w-5 text-blue-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Apostila acessada</p>
                      <p className="text-sm text-muted-foreground">Apostila de Direito Administrativo</p>
                      <p className="text-xs text-muted-foreground">Ontem às 15:45</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ListChecks className="mt-1 h-5 w-5 text-purple-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Questões semanais</p>
                      <p className="text-sm text-muted-foreground">20 questões respondidas</p>
                      <p className="text-xs text-muted-foreground">Ontem às 09:15</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Desempenho por Disciplina</CardTitle>
                <CardDescription>Seu desempenho nas principais disciplinas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Direito Constitucional</span>
                      <span className="text-sm text-muted-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Direito Administrativo</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Português</span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Raciocínio Lógico</span>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Informática</span>
                      <span className="text-sm text-muted-foreground">90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Pontos Fracos</CardTitle>
                <CardDescription>Temas que precisam de mais atenção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-red-50 p-3 dark:bg-red-950">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Controle de Constitucionalidade</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-red-50 p-3 dark:bg-red-950">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Licitações e Contratos</span>
                      <span className="text-sm text-muted-foreground">52%</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-red-50 p-3 dark:bg-red-950">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Crase</span>
                      <span className="text-sm text-muted-foreground">48%</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Regência Verbal</span>
                      <span className="text-sm text-muted-foreground">58%</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Análise Combinatória</span>
                      <span className="text-sm text-muted-foreground">55%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Semanal</CardTitle>
                <CardDescription>Resumo da semana atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo de estudo</span>
                    <span className="text-sm font-medium">12h 30min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questões respondidas</span>
                    <span className="text-sm font-medium">145</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de acerto</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Simulados realizados</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Flashcards revisados</span>
                    <span className="text-sm font-medium">78</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Relatório Mensal</CardTitle>
                <CardDescription>Resumo do mês atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tempo de estudo</span>
                    <span className="text-sm font-medium">48h 15min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Questões respondidas</span>
                    <span className="text-sm font-medium">583</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de acerto</span>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Simulados realizados</span>
                    <span className="text-sm font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Flashcards revisados</span>
                    <span className="text-sm font-medium">312</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Metas</CardTitle>
                <CardDescription>Progresso das suas metas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estudar 10h por semana</span>
                      <span className="text-sm text-muted-foreground">12.5/10h</span>
                    </div>
                    <Progress value={125} max={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Responder 100 questões por semana</span>
                      <span className="text-sm text-muted-foreground">145/100</span>
                    </div>
                    <Progress value={145} max={100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Atingir 80% de acertos</span>
                      <span className="text-sm text-muted-foreground">76/80%</span>
                    </div>
                    <Progress value={76} max={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, CheckCircle, Clock, FileText, ListChecks, Target, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Dados mockados para teste
  const performanceStats = {
    totalSimulados: 0,
    totalQuestoes: 0,
    totalStudyTime: 0,
    averageScore: 0,
    accuracyRate: 0,
    weeklyProgress: {
      simulados: 0,
      questoes: 0,
      studyTime: 0,
      scoreImprovement: 0
    },
    disciplineStats: []
  }
  
  const recentActivities = []

  // Formatar tempo de estudo
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
  }

  // Formatar taxa de acerto
  const formatAccuracy = (rate: number) => `${Math.round(rate)}%`

  // Formatar melhoria de pontuação
  const formatScoreImprovement = (improvement: number) => {
    const sign = improvement >= 0 ? '+' : ''
    return `${sign}${Math.round(improvement)}%`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de estudos. Acompanhe seu progresso e continue sua jornada.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Simulados Realizados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalSimulados}</div>
            <p className="text-xs text-muted-foreground">
              {formatScoreImprovement(performanceStats.weeklyProgress.simulados)} esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questões Respondidas</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalQuestoes}</div>
            <p className="text-xs text-muted-foreground">
              {formatScoreImprovement(performanceStats.weeklyProgress.questoes)} esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Estudo</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatStudyTime(performanceStats.totalStudyTime)}</div>
            <p className="text-xs text-muted-foreground">
              {formatStudyTime(performanceStats.weeklyProgress.studyTime)} esta semana
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAccuracy(performanceStats.accuracyRate)}</div>
            <p className="text-xs text-muted-foreground">
              {formatScoreImprovement(performanceStats.weeklyProgress.scoreImprovement)} esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Progress Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Progresso por Disciplina</CardTitle>
            <CardDescription>Seu desempenho nas principais matérias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum dado de disciplina disponível ainda.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete simulados e questões para ver seu progresso por disciplina.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Suas últimas atividades na plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma atividade recente.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Comece a estudar para ver suas atividades aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/simulados">
          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Simulados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Pratique com simulados completos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/questoes-semanais">
          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questões Semanais</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Questões selecionadas para esta semana</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/apostilas">
          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Apostilas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Material de estudo organizado</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/plano-estudos">
          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plano de Estudos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Organize sua rotina de estudos</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
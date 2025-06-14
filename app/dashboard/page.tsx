'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  ListChecks,
  Clock,
  Target,
  BookOpen,
  Calendar,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

interface PerformanceStats {
  totalSimulados: number;
  totalQuestoes: number;
  totalStudyTime: number;
  averageScore: number;
  accuracyRate: number;
  weeklyProgress: {
    simulados: number;
    questoes: number;
    studyTime: number;
    scoreImprovement: number;
  };
  disciplineStats: Array<{
    disciplina: string;
    total_questions: number;
    correct_answers: number;
    accuracy_rate: number;
  }>;
}

interface RecentActivity {
  id: string;
  type: 'simulado' | 'questao' | 'flashcard';
  title: string;
  description: string;
  time: string;
  created_at: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    totalSimulados: 0,
    totalQuestoes: 0,
    totalStudyTime: 0,
    averageScore: 0,
    accuracyRate: 0,
    weeklyProgress: {
      simulados: 0,
      questoes: 0,
      studyTime: 0,
      scoreImprovement: 0,
    },
    disciplineStats: [],
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas de performance
        const statsResponse = await fetch('/api/dashboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setPerformanceStats(statsData);
        }
        
        // Buscar atividades recentes
        const activitiesResponse = await fetch('/api/dashboard/activities');
        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setRecentActivities(activitiesData);
        }

      } catch (error) {
        logger.error('Erro ao buscar dados do dashboard:', {
          error: error instanceof Error ? error.message : String(error),
        });
        setError('Erro ao carregar dados do dashboard. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formatar tempo de estudo
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  // Formatar taxa de acerto
  const formatAccuracy = (rate: number) => `${Math.round(rate)}%`;

  // Formatar melhoria de pontuação
  const formatScoreImprovement = (improvement: number) => {
    const sign = improvement >= 0 ? '+' : '';
    return `${sign}${Math.round(improvement)}%`;
  };

  // Formatar tempo relativo
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d atrás`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-xl font-semibold">Erro ao carregar dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de estudos. Acompanhe seu progresso e continue
          sua jornada.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Simulados Realizados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceStats.totalSimulados}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatScoreImprovement(
                performanceStats.weeklyProgress.simulados
              )}{' '}
              esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questões Respondidas
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceStats.totalQuestoes}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatScoreImprovement(performanceStats.weeklyProgress.questoes)}{' '}
              esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo de Estudo
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatStudyTime(performanceStats.totalStudyTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatStudyTime(performanceStats.weeklyProgress.studyTime)} esta
              semana
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Acerto
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAccuracy(performanceStats.accuracyRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatScoreImprovement(
                performanceStats.weeklyProgress.scoreImprovement
              )}{' '}
              esta semana
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
            <CardDescription>
              Seu desempenho nas principais matérias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {performanceStats.disciplineStats.length > 0 ? (
              <div className="space-y-4">
                {performanceStats.disciplineStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stat.disciplina}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatAccuracy(stat.accuracy_rate)}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stat.accuracy_rate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{stat.correct_answers} acertos</span>
                        <span>{stat.total_questions} questões</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum dado de disciplina disponível ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete simulados e questões para ver seu progresso por
                  disciplina.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas atividades na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.type === 'simulado' && <FileText className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'questao' && <ListChecks className="h-4 w-4 text-green-500" />}
                    {activity.type === 'flashcard' && <BookOpen className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhuma atividade recente.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Comece a estudar para ver suas atividades aqui.
                </p>
              </div>
            )}
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
              <p className="text-xs text-muted-foreground">
                Pratique com simulados completos
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/questoes-semanais">
          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Questões Semanais
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Questões selecionadas semanalmente
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/flashcards">
          <Card className="card-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Revisão com flashcards dinâmicos
              </p>
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
              <p className="text-xs text-muted-foreground">
                Material de estudo organizado
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

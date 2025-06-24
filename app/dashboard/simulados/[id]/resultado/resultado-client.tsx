'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Simulado {
  id: string;
  title: string;
  description: string | null;
}

interface SimuladoQuestion {
  id: string;
  question_text: string;
  alternatives: Record<string, string>;
  correct_answer: string;
  explanation?: string;
}

interface UserProgress {
  answers: Record<number, string>;
  time_taken_minutes: number;
}

interface ResultadoSimuladoClientProps {
  id: string;
  simulado: Simulado;
  questoes: SimuladoQuestion[];
  progress: UserProgress;
}

export default function ResultadoSimuladoClient({
  id,
  simulado,
  questoes,
  progress,
}: ResultadoSimuladoClientProps) {
  // Calcular estatísticas baseadas nos dados reais
  const totalQuestions = questoes.length;
  const correctAnswers = questoes.filter(
    (q, index) => progress.answers[index] === q.correct_answer
  ).length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Formatar o tempo
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Resultado do Simulado
        </h1>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            {formatTime(progress.time_taken_minutes)}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{simulado.title}</CardTitle>
          <CardDescription>{simulado.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pontuação</span>
                <span className="text-sm font-medium">{score.toFixed(1)}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-lg border p-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <span className="mt-2 text-2xl font-bold">
                  {correctAnswers}
                </span>
                <span className="text-sm text-muted-foreground">Acertos</span>
              </div>
              <div className="flex flex-col items-center rounded-lg border p-4">
                <XCircle className="h-8 w-8 text-red-500" />
                <span className="mt-2 text-2xl font-bold">{wrongAnswers}</span>
                <span className="text-sm text-muted-foreground">Erros</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col rounded-lg border p-4">
                <span className="text-sm text-muted-foreground">
                  Tempo Total
                </span>
                <span className="text-lg font-medium">
                  {formatTime(progress.time_taken_minutes)}
                </span>
              </div>
              <div className="flex flex-col rounded-lg border p-4">
                <span className="text-sm text-muted-foreground">
                  Tempo Médio por Questão
                </span>
                <span className="text-lg font-medium">
                  {totalQuestions > 0
                    ? formatTime(progress.time_taken_minutes / totalQuestions)
                    : '0min'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/simulados">
            <Button variant="outline">Voltar para Simulados</Button>
          </Link>
          <Link href={`/dashboard/simulados/${id}`}>
            <Button>Refazer Simulado</Button>
          </Link>
        </CardFooter>
      </Card>

      <h2 className="mt-4 text-xl font-bold tracking-tight">
        Revisão das Questões
      </h2>

      <Tabs defaultValue="todas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="corretas">Corretas</TabsTrigger>
          <TabsTrigger value="incorretas">Incorretas</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="space-y-4">
          {questoes.map((question, index) => {
            const userAnswer = progress.answers[index];
            const isCorrect = userAnswer === question.correct_answer;

            return (
              <Card
                key={question.id}
                className={isCorrect ? 'border-green-200' : 'border-red-200'}
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    )}
                    <span>{question.question_text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(question.alternatives).map(
                      ([key, text]) => {
                        const isUserAnswer = userAnswer === key;
                        const isCorrectAnswer = question.correct_answer === key;
                        let textColor = 'text-gray-800';
                        if (isCorrectAnswer) {
                          textColor = 'text-green-600 font-bold';
                        } else if (isUserAnswer) {
                          textColor = 'text-red-600 font-bold';
                        }

                        return (
                          <div
                            key={key}
                            className={`flex items-center gap-2 rounded-md p-2 ${
                              isCorrectAnswer
                                ? 'bg-green-50'
                                : isUserAnswer
                                ? 'bg-red-50'
                                : ''
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full border text-sm font-semibold ${
                                isCorrectAnswer || isUserAnswer
                                  ? 'border-transparent'
                                  : 'border-gray-300'
                              } ${
                                isCorrectAnswer
                                  ? 'bg-green-500 text-white'
                                  : isUserAnswer
                                  ? 'bg-red-500 text-white'
                                  : ''
                              }`}
                            >
                              {key}
                            </span>
                            <span className={textColor}>{text}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
                {question.explanation && (
                  <CardFooter className="flex flex-col items-start gap-2 pt-4">
                    <h4 className="font-semibold">Justificativa:</h4>
                    <p className="text-sm text-gray-600">
                      {question.explanation}
                    </p>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </TabsContent>
        
        <TabsContent value="corretas" className="space-y-4">
          {questoes
            .filter((q, i) => progress.answers[i] === q.correct_answer)
            .map((question, _index) => (
              <Card key={question.id} className="border-green-200">
                 <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>{question.question_text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* ... conteúdo da questão ... */}
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="incorretas" className="space-y-4">
          {questoes
            .filter((q, i) => progress.answers[i] !== q.correct_answer)
            .map((question, _index) => (
              <Card key={question.id} className="border-red-200">
                 <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                     <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <span>{question.question_text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* ... conteúdo da questão ... */}
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
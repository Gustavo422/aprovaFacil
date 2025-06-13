"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionPlayer } from "@/components/question-player"
import { Calendar, CheckCircle, Clock } from "lucide-react"

// Dados de exemplo
const questoesSemanaisExemplo = {
  id: 1,
  title: "100 Questões Semanais - Semana 23",
  description: "Questões selecionadas para a semana 23 de 2025",
  weekNumber: 23,
  year: 2025,
  questions: Array.from({ length: 10 }).map((_, index) => ({
    id: index + 1,
    text: `Questão de exemplo ${index + 1} para a semana 23 de 2025`,
    options: [
      { id: "a", text: `Opção A da questão ${index + 1}` },
      { id: "b", text: `Opção B da questão ${index + 1}` },
      { id: "c", text: `Opção C da questão ${index + 1}` },
      { id: "d", text: `Opção D da questão ${index + 1}` },
      { id: "e", text: `Opção E da questão ${index + 1}` },
    ],
    correctAnswer: ["a", "b", "c", "d", "e"][Math.floor(Math.random() * 5)],
  })),
}

// Histórico de exemplo
const historicoExemplo = [
  {
    id: 1,
    title: "100 Questões Semanais - Semana 22",
    description: "Questões selecionadas para a semana 22 de 2025",
    weekNumber: 22,
    year: 2025,
    score: 78,
    totalQuestions: 100,
    completedAt: "2025-06-01T15:30:00Z",
  },
  {
    id: 2,
    title: "100 Questões Semanais - Semana 21",
    description: "Questões selecionadas para a semana 21 de 2025",
    weekNumber: 21,
    year: 2025,
    score: 82,
    totalQuestions: 100,
    completedAt: "2025-05-25T14:45:00Z",
  },
]

export default function QuestoesSemanaisPage() {
  const [activeTab, setActiveTab] = useState("atual")
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<{
    answers: Record<number, string>
    score: number
    timeSpent: number
  } | null>(null)

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleComplete = (answers: Record<number, string>, timeSpent: number) => {
    // Calcular pontuação
    const score = questoesSemanaisExemplo.questions.filter((q, index) => answers[index] === q.correctAnswer).length

    setResults({
      answers,
      score,
      timeSpent,
    })

    setIsCompleted(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Questões Semanais</h1>
      <p className="text-muted-foreground">Pratique com 100 questões selecionadas semanalmente.</p>

      <Tabs defaultValue="atual" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="atual">Semana Atual</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="atual" className="space-y-4">
          {!isStarted ? (
            <Card>
              <CardHeader>
                <CardTitle>{questoesSemanaisExemplo.title}</CardTitle>
                <CardDescription>{questoesSemanaisExemplo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      Semana {questoesSemanaisExemplo.weekNumber} de {questoesSemanaisExemplo.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <span>{questoesSemanaisExemplo.questions.length} questões</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>Tempo estimado: {Math.ceil(questoesSemanaisExemplo.questions.length * 1.5)} minutos</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleStart}>
                  Iniciar Questões Semanais
                </Button>
              </CardFooter>
            </Card>
          ) : isCompleted ? (
            <Card>
              <CardHeader>
                <CardTitle>Resultado - {questoesSemanaisExemplo.title}</CardTitle>
                <CardDescription>{questoesSemanaisExemplo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pontuação</span>
                      <span className="text-sm font-medium">
                        {results?.score} de {questoesSemanaisExemplo.questions.length} (
                        {Math.round(((results?.score || 0) / questoesSemanaisExemplo.questions.length) * 100)}%)
                      </span>
                    </div>
                    <Progress
                      value={((results?.score || 0) / questoesSemanaisExemplo.questions.length) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <span className="mt-2 text-2xl font-bold">{results?.score}</span>
                      <span className="text-sm text-muted-foreground">Acertos</span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg border p-4">
                      <Clock className="h-8 w-8 text-blue-500" />
                      <span className="mt-2 text-2xl font-bold">{results?.timeSpent} min</span>
                      <span className="text-sm text-muted-foreground">Tempo</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <QuestionPlayer questions={questoesSemanaisExemplo.questions} onComplete={handleComplete} />
          )}
        </TabsContent>

        <TabsContent value="historico">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {historicoExemplo.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Semana {item.weekNumber} de {item.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {item.score}/{item.totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Concluído em {formatDate(item.completedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Clock, Flag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Simulado de exemplo
const simuladoExemplo = {
  id: 1,
  title: "Simulado Completo - Direito Constitucional",
  description: "Simulado com 40 questões sobre Direito Constitucional",
  questions: [
    {
      id: 1,
      text: "De acordo com a Constituição Federal de 1988, são Poderes da União, independentes e harmônicos entre si:",
      options: [
        { id: "a", text: "O Legislativo, o Executivo, o Judiciário e o Ministério Público." },
        { id: "b", text: "O Legislativo, o Executivo e o Judiciário." },
        { id: "c", text: "O Legislativo, o Executivo, o Judiciário e o Tribunal de Contas." },
        { id: "d", text: "O Legislativo, o Executivo, o Judiciário e a Defensoria Pública." },
        { id: "e", text: "O Legislativo, o Executivo, o Judiciário e a Advocacia Pública." },
      ],
      correctAnswer: "b",
    },
    {
      id: 2,
      text: "Sobre os direitos e garantias fundamentais previstos na Constituição Federal, é correto afirmar que:",
      options: [
        { id: "a", text: "São garantidos apenas aos brasileiros natos." },
        { id: "b", text: "Não podem ser objeto de emenda constitucional." },
        { id: "c", text: "Podem ser suspensos durante o estado de sítio." },
        { id: "d", text: "Não se aplicam às relações privadas." },
        { id: "e", text: "São taxativamente enumerados na Constituição." },
      ],
      correctAnswer: "c",
    },
    {
      id: 3,
      text: "A respeito do controle de constitucionalidade no Brasil, é correto afirmar que:",
      options: [
        { id: "a", text: "O controle difuso só pode ser exercido pelo Supremo Tribunal Federal." },
        { id: "b", text: "O controle concentrado pode ser exercido por qualquer juiz ou tribunal." },
        { id: "c", text: "A decisão no controle difuso tem efeito erga omnes." },
        { id: "d", text: "A Ação Direta de Inconstitucionalidade pode ser proposta por qualquer cidadão." },
        { id: "e", text: "O Supremo Tribunal Federal exerce tanto o controle concentrado quanto o difuso." },
      ],
      correctAnswer: "e",
    },
    {
      id: 4,
      text: "Sobre o processo legislativo previsto na Constituição Federal, é correto afirmar que:",
      options: [
        { id: "a", text: "As medidas provisórias podem versar sobre qualquer matéria." },
        {
          id: "b",
          text: "A iniciativa popular de lei exige a subscrição de, no mínimo, um por cento do eleitorado nacional.",
        },
        { id: "c", text: "As emendas constitucionais podem ser propostas por qualquer membro do Congresso Nacional." },
        {
          id: "d",
          text: "O veto presidencial pode ser derrubado por maioria absoluta dos membros do Congresso Nacional.",
        },
        { id: "e", text: "As leis complementares são aprovadas por maioria simples." },
      ],
      correctAnswer: "d",
    },
    {
      id: 5,
      text: "Sobre a organização político-administrativa do Estado brasileiro, é correto afirmar que:",
      options: [
        { id: "a", text: "Os Municípios não são considerados entes federativos." },
        { id: "b", text: "O Distrito Federal possui competências legislativas reservadas aos Estados e Municípios." },
        { id: "c", text: "Os Territórios Federais integram a União como autarquias territoriais." },
        { id: "d", text: "Os Estados podem incorporar-se entre si mediante aprovação do Congresso Nacional." },
        { id: "e", text: "A criação de novos Municípios depende de lei federal." },
      ],
      correctAnswer: "b",
    },
  ],
  time: 15, // 15 minutos para o simulado de exemplo (reduzido para fins de demonstração)
}

export default function SimuladoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(simuladoExemplo.time * 60) // em segundos
  const [isFinished, setIsFinished] = useState(false)

  // Formatar o tempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Efeito para o timer
  useEffect(() => {
    if (isFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishSimulado()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isFinished])

  // Navegar para a próxima questão
  const nextQuestion = () => {
    if (currentQuestion < simuladoExemplo.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  // Navegar para a questão anterior
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Salvar resposta
  const saveAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value })
  }

  // Finalizar simulado
  const finishSimulado = () => {
    setIsFinished(true)

    // Calcular pontuação
    const totalQuestions = simuladoExemplo.questions.length
    const correctAnswers = simuladoExemplo.questions.filter((q, index) => answers[index] === q.correctAnswer).length

    toast({
      title: "Simulado finalizado!",
      description: `Você acertou ${correctAnswers} de ${totalQuestions} questões.`,
    })

    // Redirecionar para a página de resultados
    router.push(`/dashboard/simulados/${params.id}/resultado`)
  }

  // Calcular progresso
  const progress = ((currentQuestion + 1) / simuladoExemplo.questions.length) * 100

  // Questão atual
  const question = simuladoExemplo.questions[currentQuestion]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{simuladoExemplo.title}</h1>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Questão {currentQuestion + 1} de {simuladoExemplo.questions.length}
          </span>
          <Button variant="outline" size="sm" onClick={finishSimulado}>
            <Flag className="mr-2 h-4 w-4" />
            Finalizar
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-start gap-2">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {currentQuestion + 1}
            </span>
            <span>{question.text}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={answers[currentQuestion] || ""} onValueChange={saveAnswer} className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-start space-x-2 rounded-md border p-3 hover:bg-muted">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <label
                  htmlFor={`option-${option.id}`}
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.text}
                </label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          {currentQuestion < simuladoExemplo.questions.length - 1 ? (
            <Button onClick={nextQuestion}>
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finishSimulado}>
              Finalizar
              <Flag className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-4 grid grid-cols-10 gap-2">
        {simuladoExemplo.questions.map((_, index) => (
          <Button
            key={index}
            variant={currentQuestion === index ? "default" : answers[index] ? "outline" : "ghost"}
            className={`h-10 w-10 ${answers[index] ? "border-primary" : ""}`}
            onClick={() => setCurrentQuestion(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Clock, Flag } from "lucide-react"

export interface Question {
  id: number | string
  text: string
  options: {
    id: string
    text: string
  }[]
  correctAnswer?: string
}

interface QuestionPlayerProps {
  questions: Question[]
  title: string
  description?: string
  timeLimit?: number // em minutos
  onComplete?: (answers: Record<number, string>, timeSpent: number) => void
  showCorrectAnswers?: boolean
}

export function QuestionPlayer({
  questions,
  title,
  description,
  timeLimit,
  onComplete,
  showCorrectAnswers = false,
}: QuestionPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(timeLimit ? timeLimit * 60 : 0) // em segundos
  const [isFinished, setIsFinished] = useState(false)
  const [startTime] = useState(Date.now())

  // Formatar o tempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Efeito para o timer
  useEffect(() => {
    if (!timeLimit || isFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          finishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit, isFinished])

  // Navegar para a próxima questão
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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

  // Finalizar quiz
  const finishQuiz = () => {
    setIsFinished(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60) // em minutos
    if (onComplete) {
      onComplete(answers, timeSpent)
    }
  }

  // Calcular progresso
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Questão atual
  const question = questions[currentQuestion]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {timeLimit && (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {description && <p className="text-muted-foreground">{description}</p>}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Questão {currentQuestion + 1} de {questions.length}
          </span>
          <Button variant="outline" size="sm" onClick={finishQuiz}>
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
              <div
                key={option.id}
                className={`flex items-start space-x-2 rounded-md border p-3 hover:bg-muted ${
                  showCorrectAnswers && question.correctAnswer === option.id
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : showCorrectAnswers &&
                        answers[currentQuestion] === option.id &&
                        answers[currentQuestion] !== question.correctAnswer
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : ""
                }`}
              >
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
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={nextQuestion}>
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finishQuiz}>
              Finalizar
              <Flag className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="mt-4 grid grid-cols-10 gap-2">
        {questions.map((_, index) => (
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

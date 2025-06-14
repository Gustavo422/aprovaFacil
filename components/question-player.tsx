"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle, XCircle } from "lucide-react"

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
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
          {timeLimit && (
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 md:h-5 md:w-5" />
              <span className="font-medium text-sm md:text-base">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        {description && <p className="text-sm md:text-base text-muted-foreground">{description}</p>}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            Questão {currentQuestion + 1} de {questions.length}
          </span>
          <Button variant="outline" size="sm" onClick={finishQuiz} className="w-full sm:w-auto">
            <Flag className="mr-2 h-4 w-4" />
            Finalizar
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-start gap-3 text-base md:text-lg">
            <span className="mt-0.5 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
              {currentQuestion + 1}
            </span>
            <span className="leading-relaxed">{question.text}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <RadioGroup value={answers[currentQuestion] || ""} onValueChange={saveAnswer} className="space-y-3">
            {question.options.map((option) => {
              const isSelected = answers[currentQuestion] === option.id
              const isCorrect = showCorrectAnswers && question.correctAnswer === option.id
              const isWrong = showCorrectAnswers && isSelected && answers[currentQuestion] !== question.correctAnswer
              
              return (
                <div
                  key={option.id}
                  className={`flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted transition-colors cursor-pointer ${
                    isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : isWrong
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => saveAnswer(option.id)}
                >
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`option-${option.id}`}
                      className="text-sm md:text-base font-medium leading-relaxed cursor-pointer block"
                    >
                      {option.text}
                    </label>
                    {showCorrectAnswers && (
                      <div className="flex items-center gap-2 mt-2">
                        {isCorrect && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Resposta correta</span>
                          </div>
                        )}
                        {isWrong && (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Resposta incorreta</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-0">
          <Button 
            variant="outline" 
            onClick={prevQuestion} 
            disabled={currentQuestion === 0}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          {currentQuestion < questions.length - 1 ? (
            <Button onClick={nextQuestion} className="w-full sm:w-auto">
              Próxima
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finishQuiz} className="w-full sm:w-auto">
              Finalizar
              <Flag className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Question Navigation */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Navegação Rápida</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((_, index) => (
            <Button
              key={index}
              variant={currentQuestion === index ? "default" : answers[index] ? "outline" : "ghost"}
              className={`h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm ${
                answers[index] ? "border-primary" : ""
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

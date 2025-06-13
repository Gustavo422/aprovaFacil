"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, HelpCircle, XCircle } from "lucide-react"

export interface FlashcardData {
  id: string | number
  front: string
  back: string
  disciplina?: string
  tema?: string
  subtema?: string
}

interface FlashcardProps {
  flashcard: FlashcardData
  onNext?: () => void
  onPrev?: () => void
  onRate?: (id: string | number, rating: "easy" | "medium" | "hard") => void
  showNavigation?: boolean
}

export function Flashcard({ flashcard, onNext, onPrev, onRate, showNavigation = true }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isRated, setIsRated] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleRate = (rating: "easy" | "medium" | "hard") => {
    if (onRate) {
      onRate(flashcard.id, rating)
    }
    setIsRated(true)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setIsRated(false)
    if (onNext) {
      onNext()
    }
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setIsRated(false)
    if (onPrev) {
      onPrev()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className={`min-h-[300px] transition-all duration-300 ${isFlipped ? "bg-muted/50" : ""}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{flashcard.disciplina || "Flashcard"}</span>
            {flashcard.tema && (
              <span className="text-sm font-normal text-muted-foreground">
                {flashcard.tema} {flashcard.subtema ? `- ${flashcard.subtema}` : ""}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="w-full cursor-pointer rounded-lg p-4 text-center" onClick={handleFlip}>
            <p className="text-lg">{isFlipped ? flashcard.back : flashcard.front}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" onClick={handleFlip}>
            {isFlipped ? "Mostrar Pergunta" : "Mostrar Resposta"}
          </Button>

          {isFlipped && !isRated && onRate && (
            <div className="flex w-full justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                onClick={() => handleRate("hard")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Difícil
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-50 hover:text-yellow-600 dark:hover:bg-yellow-950"
                onClick={() => handleRate("medium")}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Médio
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                onClick={() => handleRate("easy")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Fácil
              </Button>
            </div>
          )}

          {showNavigation && (
            <div className="flex w-full justify-between gap-2">
              {onPrev && (
                <Button variant="ghost" onClick={handlePrev} className="flex-1">
                  Anterior
                </Button>
              )}
              {onNext && (
                <Button variant={isRated ? "default" : "ghost"} onClick={handleNext} className="flex-1">
                  Próximo
                </Button>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

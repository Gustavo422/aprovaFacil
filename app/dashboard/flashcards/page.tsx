"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flashcard, type FlashcardData } from "@/components/flashcard"
import { BookOpen, Plus } from "lucide-react"

// Dados de exemplo
const flashcardsExemplo: FlashcardData[] = [
  {
    id: 1,
    front: "O que são os Princípios Fundamentais da Constituição Federal?",
    back: "São os princípios que fundamentam e orientam o Estado brasileiro, previstos nos artigos 1º a 4º da Constituição Federal. Incluem a soberania, a cidadania, a dignidade da pessoa humana, os valores sociais do trabalho e da livre iniciativa, e o pluralismo político.",
    disciplina: "Direito Constitucional",
    tema: "Princípios Fundamentais",
  },
  {
    id: 2,
    front: "O que é o Controle de Constitucionalidade?",
    back: "É o mecanismo de verificação da compatibilidade das leis e atos normativos com a Constituição Federal. Pode ser preventivo (antes da promulgação da lei) ou repressivo (após a promulgação). Quanto ao órgão que exerce, pode ser difuso (qualquer juiz ou tribunal) ou concentrado (STF).",
    disciplina: "Direito Constitucional",
    tema: "Controle de Constitucionalidade",
  },
  {
    id: 3,
    front: "O que é a Nova Lei de Licitações (Lei 14.133/2021)?",
    back: "É a nova lei que estabelece normas gerais de licitação e contratação para as Administrações Públicas diretas, autárquicas e fundacionais. Substituirá integralmente a Lei 8.666/93, a Lei do Pregão (10.520/2002) e o RDC (Lei 12.462/2011) após o período de transição.",
    disciplina: "Direito Administrativo",
    tema: "Licitações e Contratos",
    subtema: "Lei 14.133/2021",
  },
  {
    id: 4,
    front: "Quando se usa a crase?",
    back: 'A crase é utilizada para indicar a fusão da preposição "a" com o artigo feminino "a" ou com os pronomes demonstrativos "aquele(s)", "aquela(s)" e "aquilo". Ocorre em casos como: 1) Antes de palavras femininas: "Fui à escola"; 2) Nas locuções adverbiais femininas: "à noite"; 3) Nas locuções prepositivas: "à frente de"; entre outros casos.',
    disciplina: "Português",
    tema: "Emprego do Sinal Indicativo de Crase",
  },
  {
    id: 5,
    front: "O que é Análise Combinatória?",
    back: "É o ramo da matemática que estuda as diferentes maneiras de agrupar e ordenar elementos de um conjunto, sem necessariamente utilizar todos os elementos. Os principais tipos são: arranjos (importa a ordem), combinações (não importa a ordem) e permutações (todos os elementos são utilizados).",
    disciplina: "Raciocínio Lógico",
    tema: "Análise Combinatória",
  },
]

// Pontos fracos de exemplo
const pontosFracosExemplo = [
  { disciplina: "Direito Constitucional", tema: "Controle de Constitucionalidade" },
  { disciplina: "Direito Administrativo", tema: "Licitações e Contratos" },
  { disciplina: "Português", tema: "Crase" },
]

export default function FlashcardsPage() {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
  const [selectedDisciplina, setSelectedDisciplina] = useState<string | null>(null)
  const [selectedTema, setSelectedTema] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("estudar")

  // Filtrar flashcards com base na disciplina e tema selecionados
  const filteredFlashcards = flashcardsExemplo.filter((flashcard) => {
    if (selectedDisciplina && flashcard.disciplina !== selectedDisciplina) {
      return false
    }
    if (selectedTema && flashcard.tema !== selectedTema) {
      return false
    }
    return true
  })

  const currentFlashcard = filteredFlashcards[currentFlashcardIndex]

  // Obter disciplinas únicas
  const disciplinas = Array.from(new Set(flashcardsExemplo.map((f) => f.disciplina)))

  // Obter temas únicos para a disciplina selecionada
  const temas = Array.from(
    new Set(
      flashcardsExemplo.filter((f) => !selectedDisciplina || f.disciplina === selectedDisciplina).map((f) => f.tema),
    ),
  )

  const handleNext = () => {
    if (currentFlashcardIndex < filteredFlashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1)
    } else {
      setCurrentFlashcardIndex(0) // Voltar ao início
    }
  }

  const handlePrev = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1)
    } else {
      setCurrentFlashcardIndex(filteredFlashcards.length - 1) // Ir para o último
    }
  }

  const handleRate = (id: string | number, rating: "easy" | "medium" | "hard") => {
    console.log(`Flashcard ${id} rated as ${rating}`)
    // Em um cenário real, aqui você enviaria a avaliação para o backend
  }

  const handleDisciplinaChange = (value: string) => {
    setSelectedDisciplina(value)
    setSelectedTema(null) // Resetar o tema quando a disciplina mudar
    setCurrentFlashcardIndex(0) // Voltar ao primeiro flashcard
  }

  const handleTemaChange = (value: string) => {
    setSelectedTema(value)
    setCurrentFlashcardIndex(0) // Voltar ao primeiro flashcard
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
      <p className="text-muted-foreground">Pratique com flashcards dinâmicos baseados nos seus pontos fracos.</p>

      <Tabs defaultValue="estudar" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="estudar">Estudar</TabsTrigger>
          <TabsTrigger value="pontos-fracos">Pontos Fracos</TabsTrigger>
        </TabsList>

        <TabsContent value="estudar" className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <Select value={selectedDisciplina || ""} onValueChange={handleDisciplinaChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  {disciplinas.map((disciplina) => (
                    <SelectItem key={disciplina} value={disciplina}>
                      {disciplina}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTema || ""} onValueChange={handleTemaChange} disabled={!selectedDisciplina}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os temas</SelectItem>
                  {temas.map((tema) => (
                    <SelectItem key={tema} value={tema}>
                      {tema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Flashcard
            </Button>
          </div>

          {filteredFlashcards.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Flashcard {currentFlashcardIndex + 1} de {filteredFlashcards.length}
              </div>

              <Flashcard flashcard={currentFlashcard} onNext={handleNext} onPrev={handlePrev} onRate={handleRate} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">Nenhum flashcard encontrado</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Não há flashcards disponíveis para os filtros selecionados.
              </p>
              <Button
                onClick={() => {
                  setSelectedDisciplina(null)
                  setSelectedTema(null)
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pontos-fracos" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pontosFracosExemplo.map((pontoFraco, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{pontoFraco.disciplina}</CardTitle>
                  <CardDescription>{pontoFraco.tema}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Este é um dos seus pontos fracos identificados com base no seu desempenho em simulados e questões.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedDisciplina(pontoFraco.disciplina)
                      setSelectedTema(pontoFraco.tema)
                      setActiveTab("estudar")
                    }}
                  >
                    Estudar Flashcards
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

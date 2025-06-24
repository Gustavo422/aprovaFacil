'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Flashcard } from '@/components/flashcard';
import { BookOpen, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import type { Flashcard as FlashcardType } from '@/src/core/database/types';

interface WeakPoint {
  discipline: string;
  tema: string;
  error_count: number;
  total_questions: number;
  error_rate: number;
}

interface FlashcardsClientProps {
  flashcards: FlashcardType[];
}

export default function FlashcardsClient({ flashcards: initialFlashcards }: FlashcardsClientProps) {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardType[]>(initialFlashcards);
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar flashcards com base na disciplina e tema selecionados
  const filteredFlashcards = flashcards.filter(flashcard => {
    if (selectedDiscipline && flashcard.discipline !== selectedDiscipline) {
      return false;
    }
    if (selectedTema && flashcard.tema !== selectedTema) {
      return false;
    }
    return true;
  });

  const currentFlashcard = filteredFlashcards[currentFlashcardIndex];

  // Obter disciplinas únicas
  const disciplines = Array.from(
    new Set(flashcards.map(f => f.discipline).filter(Boolean))
  );

  // Obter temas únicos para a disciplina selecionada
  const temas = Array.from(
    new Set(
      flashcards
        .filter(f => !selectedDiscipline || f.discipline === selectedDiscipline)
        .map(f => f.tema)
        .filter(Boolean)
    )
  );

  const handleNext = () => {
    if (currentFlashcardIndex < filteredFlashcards.length - 1) {
      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
    } else {
      setCurrentFlashcardIndex(0); // Voltar ao início
    }
  };

  const handlePrev = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
    } else {
      setCurrentFlashcardIndex(filteredFlashcards.length - 1); // Ir para o último
    }
  };

  const handleRate = (
    id: string | number,
    rating: 'easy' | 'medium' | 'hard'
  ) => {
    // TODO: Implementar envio da avaliação para o backend
    logger.info(`Flashcard ${id} rated as ${rating}`);
  };

  const handleDisciplineChange = (value: string | null) => {
    setSelectedDiscipline(value === 'all' ? null : value);
    setSelectedTema(null); // Resetar tema ao mudar disciplina
  };

  const handleTemaChange = (value: string | null) => {
    setSelectedTema(value === 'all' ? null : value);
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
        <h2 className="text-xl font-semibold">Erro ao carregar flashcards</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => {
          setSelectedDiscipline(null);
          setSelectedTema(null);
        }}>
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
      <p className="text-muted-foreground">
        Pratique com flashcards dinâmicos baseados nos seus pontos fracos.
      </p>

      <Tabs defaultValue="estudar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="estudar">Estudar</TabsTrigger>
          <TabsTrigger value="pontos-fracos">Pontos Fracos</TabsTrigger>
        </TabsList>

        <TabsContent value="estudar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estudar Flashcards</CardTitle>
              <CardDescription>
                Filtre por disciplina e tema para focar seus estudos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Select
                  onValueChange={handleDisciplineChange}
                  value={selectedDiscipline || 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por disciplina..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Disciplinas</SelectItem>
                    {disciplines.map(discipline => (
                      <SelectItem key={discipline} value={discipline}>
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={handleTemaChange}
                  value={selectedTema || 'all'}
                  disabled={!selectedDiscipline}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tema..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Temas</SelectItem>
                    {temas.map(tema => (
                      <SelectItem key={tema} value={tema}>
                        {tema}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredFlashcards.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Flashcard {currentFlashcardIndex + 1} de{' '}
                    {filteredFlashcards.length}
                  </div>

                  <Flashcard
                    flashcard={currentFlashcard}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onRate={handleRate}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">
                    Nenhum flashcard encontrado
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {flashcards.length === 0 
                      ? 'Não há flashcards disponíveis no sistema.'
                      : 'Não há flashcards disponíveis para os filtros selecionados.'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pontos-fracos" className="space-y-4">
          {weakPoints.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weakPoints.map((pontoFraco, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{pontoFraco.discipline}</CardTitle>
                    <CardDescription>{pontoFraco.tema}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Taxa de erro: {pontoFraco.error_rate.toFixed(1)}% ({pontoFraco.error_count} de {pontoFraco.total_questions} questões)
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedDiscipline(pontoFraco.discipline);
                        setSelectedTema(pontoFraco.tema);
                      }}
                    >
                      Estudar Flashcards
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">
                Nenhum ponto fraco identificado
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Complete alguns simulados para que possamos identificar seus pontos fracos.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

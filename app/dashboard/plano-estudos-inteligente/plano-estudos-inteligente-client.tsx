'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, Clock, Target } from 'lucide-react';

interface StudyPlan {
  days: number;
  hoursPerDay: number;
  subjects: string[];
}

export function PlanoEstudosInteligenteClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);

  const generateStudyPlan = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudyPlan({
        days: 30,
        hoursPerDay: 2,
        subjects: ['Português', 'Matemática', 'Direito Constitucional', 'Informática']
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Plano de Estudos Inteligente</h1>
        <p className="text-muted-foreground">
          Um plano de estudos personalizado baseado no seu desempenho e objetivos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <CardTitle>Meu Plano de Estudos</CardTitle>
          </div>
          <CardDescription>
            Seu plano de estudos personalizado será gerado com base no seu desempenho.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!studyPlan ? (
            <Button onClick={generateStudyPlan} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Plano...
                </>
              ) : (
                'Gerar Plano de Estudos'
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Duração: {studyPlan.days} dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{studyPlan.hoursPerDay} horas por dia</span>
              </div>
              <div>
                <h3 className="font-medium mb-2">Matérias do Plano:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {studyPlan.subjects.map((subject: string, index: number) => (
                    <li key={index}>{subject}</li>
                  ))}
                </ul>
              </div>
              <Button variant="outline" className="mt-4">
                Exportar Plano
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


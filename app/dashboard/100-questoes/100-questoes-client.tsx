'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function QuestoesClient() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">100 Questões</h1>
        <p className="text-muted-foreground">
          Resolva 100 questões semanais para testar seus conhecimentos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questões da Semana</CardTitle>
          <CardDescription>
            Questões selecionadas especialmente para você com base no seu desempenho.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled={isLoading} onClick={() => setIsLoading(true)}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              'Iniciar Questões da Semana'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


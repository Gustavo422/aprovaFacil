'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen } from 'lucide-react';

export function ApostilaInteligenteClient() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Apostila Inteligente</h1>
        <p className="text-muted-foreground">
          Estude com nossa apostila inteligente que se adapta ao seu aprendizado.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Conteúdo Personalizado</CardTitle>
          </div>
          <CardDescription>
            Acesse materiais de estudo personalizados com base no seu desempenho.
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
              'Acessar Apostila'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApostilaInteligenteClient;

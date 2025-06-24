'use client';
import { logger } from '@/lib/logger';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useAuthRetry } from '@/features/auth/hooks/use-auth-retry';
import { useToast } from '@/src/features/shared/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function RateLimitTest() {
  const [isLoading, setIsLoading] = useState(false);
  // const { retryWithBackoff, getRateLimitMessage, isRetrying } = useAuthRetry();
  const { toast } = useToast();

  const testRateLimitHandling = async () => {
    setIsLoading(true);
    try {
      // const result = await retryWithBackoff(
      //   async () => {
      //     return await simulateRateLimitError();
      //   },
      //   {
      //     onRetry: (attempt: number, delay: number) => {
      //       toast({
      //         title: 'Teste de Rate Limit',
      //         description: `Tentativa ${attempt}: Aguardando ${Math.round(delay / 1000)}s...`,
      //       });
      //     },
      //   }
      // );

      // if (result.error) {
      //   toast({
      //     variant: 'destructive',
      //     title: 'Erro simulado',
      //     description: result.error.message,
      //   });
      // }
    } catch (error: unknown) {
      logger.error('Erro no teste:', error as Record<string, unknown>);
      toast({
        variant: 'destructive',
        title: 'Erro no teste',
        description: 'Erro no teste',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Teste de Rate Limit</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Este componente testa o tratamento de rate limits. Clique no botão
          para simular um erro de rate limit.
        </p>
        <Button
          onClick={testRateLimitHandling}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading
            ? 'Testando...'
            : 'Testar Rate Limit'}
        </Button>
      </CardContent>
    </Card>
  );
}

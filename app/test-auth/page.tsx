'use client';

import { useAuth } from '@/hooks/use-auth';
import { AuthStatus } from '@/components/auth-status';
import { Button } from '@/components/ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestAuthPage() {
  const { user, loading } = useAuth();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      if (error) {
        alert('Erro no login: ' + error.message + '\n\nVocê pode precisar criar uma conta primeiro em /register');
      } else {
        alert('Login realizado com sucesso!');
        router.refresh();
      }
    } catch (error) {
      alert('Erro: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      alert('Logout realizado com sucesso!');
      router.refresh();
    } catch (error) {
      alert('Erro: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Teste de Autenticação</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Status Atual</h2>
          <AuthStatus />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ações</h2>
          
          <div className="space-y-2">
            <Button 
              onClick={handleLogin} 
              disabled={isLoading || !!user}
              className="w-full"
            >
              {isLoading ? 'Fazendo login...' : 'Fazer Login (test@example.com)'}
            </Button>
            
            <Button 
              onClick={handleLogout} 
              disabled={isLoading || !user}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Fazendo logout...' : 'Fazer Logout'}
            </Button>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Informações de Debug:</h3>
            <pre className="text-sm">
              {JSON.stringify({
                loading,
                user: user ? {
                  id: user.id,
                  email: user.email,
                  name: user.user_metadata?.name,
                  created_at: user.created_at,
                  last_sign_in_at: user.last_sign_in_at
                } : null
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Instruções:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Primeiro:</strong> Crie uma conta em <a href="/register" className="underline">/register</a> com email: test@example.com</li>
          <li>• <strong>Depois:</strong> Faça login usando o botão abaixo</li>
          <li>• <strong>Após o login:</strong> Tente salvar o progresso do simulado novamente</li>
          <li>• <strong>Status:</strong> O status de autenticação será atualizado automaticamente</li>
          <li>• <strong>Debug:</strong> Use <a href="/api/debug/session" className="underline" target="_blank">/api/debug/session</a> para verificar a sessão</li>
        </ul>
      </div>
    </div>
  );
} 
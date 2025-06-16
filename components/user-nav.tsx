'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
      router.push('/login');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer logout',
        description: 'Tente novamente.',
      });
    }
  };

  // Se ainda está carregando, mostrar um placeholder
  if (loading) {
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            ...
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // Se não há usuário logado, não mostrar o componente
  if (!user) {
    return null;
  }

  // Obter as iniciais do nome do usuário
  const getUserInitials = () => {
    const name = user.user_metadata?.name || user.email?.split('@')[0] || 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => {
    return user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário';
  };

  const getUserEmail = () => {
    return user.email || 'Email não disponível';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url || undefined} alt={getUserName()} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {getUserEmail()}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <Shield className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Autenticado</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/configuracoes')}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/configuracoes')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

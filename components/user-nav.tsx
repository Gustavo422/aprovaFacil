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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function UserNav() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
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
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
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

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SimuladosRepository } from '@/src/core/database/repositories/simulados-repository';
import { SimuladosService } from '@/src/features/simulados/services/simulados-service';

export async function GET(_request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log('Usuário não autenticado');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    console.log('Usuário autenticado:', session.user.id);

    // Usar o serviço refatorado
    const repository = new SimuladosRepository(supabase);
    const simuladosService = new SimuladosService(repository);
    const result = await simuladosService.getSimulados(1, 10);

    console.log('Simulados encontrados:', result.data?.length || 0);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
} 
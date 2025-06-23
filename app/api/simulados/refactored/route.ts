import { createRouteHandlerClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { SimuladosRepository } from '@/src/core/database/repositories/simulados-repository';
import { SimuladosService } from '@/src/features/simulados/services/simulados-service';

export async function GET(_request: Request) {
  try {
    const supabase = await createRouteHandlerClient();

    // Verificar se o usuário está autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Usar o serviço refatorado
    const repository = new SimuladosRepository(supabase);
    const simuladosService = new SimuladosService(repository);
    const result = await simuladosService.getSimulados(1, 10);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
} 
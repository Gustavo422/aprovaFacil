import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar progresso recente em simulados
    const { data: progress, error: progressError } = await supabase
      .from('user_simulado_progress')
      .select(`
        *,
        simulados!inner(
          id,
          title
        )
      `)
      .eq('user_id', session.user.id)
      .order('completed_at', { ascending: false })
      .limit(10);

    if (progressError) {
      console.error('Erro ao buscar progresso:', progressError.message);
      return NextResponse.json(
        { error: 'Erro ao buscar progresso' },
        { status: 500 }
      );
    }

    // Converter para formato de atividades
    const activities = (progress || []).map(p => ({
      id: p.id,
      type: 'simulado' as const,
      title: p.simulados?.title || 'Simulado',
      description: `Concluído com ${Math.round(p.score || 0)}% de acerto`,
      time: p.completed_at,
      created_at: p.completed_at,
    }));

    // TODO: Adicionar outras atividades como questões semanais e flashcards
    // Por enquanto, retornamos apenas atividades de simulados

    return NextResponse.json(activities);

  } catch (error) {
    console.error('Erro inesperado ao buscar atividades:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
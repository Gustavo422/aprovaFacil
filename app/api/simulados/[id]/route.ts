import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await params;

    console.log('Buscando simulado ID:', id);

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log('Usuário não autenticado');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    console.log('Usuário autenticado:', session.user.id);

    // Buscar detalhes do simulado
    const { data: simulado, error: simuladoError } = await supabase
      .from('simulados')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (simuladoError) {
      console.error('Erro ao buscar simulado:', simuladoError.message);
      return NextResponse.json(
        { error: 'Simulado não encontrado', details: simuladoError.message },
        { status: 404 }
      );
    }

    console.log('Simulado encontrado:', simulado.title);

    // Buscar as questões do simulado
    const { data: questoes, error: questoesError } = await supabase
      .from('simulado_questions')
      .select('*')
      .eq('simulado_id', id)
      .is('deleted_at', null)
      .order('question_number', { ascending: true });

    if (questoesError) {
      console.error('Erro ao buscar questões:', questoesError.message);
      return NextResponse.json(
        { error: 'Erro ao buscar questões', details: questoesError.message },
        { status: 500 }
      );
    }

    console.log('Questões encontradas:', questoes?.length || 0);

    // Verificar se o usuário já realizou este simulado
    const { data: progress, error: progressError } = await supabase
      .from('user_simulado_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('simulado_id', id)
      .maybeSingle();

    if (progressError) {
      console.error('Erro ao verificar progresso:', progressError.message);
    }

    return NextResponse.json({
      simulado,
      questoes: questoes || [],
      alreadyCompleted: !!progress,
      progress,
    });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await params;

    console.log('Salvando progresso para simulado ID:', id);

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log('Usuário não autenticado ao tentar salvar progresso');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    console.log('Usuário autenticado:', session.user.id);

    // Obter os dados do corpo da requisição
    const body = await request.json();
    const { answers, score, timeTaken } = body;

    console.log('Dados recebidos:', { answers: !!answers, score, timeTaken });

    // Validar os dados
    if (!answers || Object.keys(answers).length === 0) {
      console.error('Validação falhou: answers está ausente ou vazio');
      return NextResponse.json({ error: 'Dados incompletos: answers é obrigatório' }, { status: 400 });
    }

    if (typeof score !== 'number' || isNaN(score)) {
      console.error('Validação falhou: score não é número válido');
      return NextResponse.json({ error: 'Dados inválidos: score deve ser um número' }, { status: 400 });
    }

    if (typeof timeTaken !== 'number' || isNaN(timeTaken)) {
      console.error('Validação falhou: timeTaken não é número válido');
      return NextResponse.json({ error: 'Dados inválidos: timeTaken deve ser um número' }, { status: 400 });
    }

    // Verificar se o usuário tem perfil na tabela users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Erro ao verificar perfil do usuário:', profileError.message);
      return NextResponse.json(
        { error: 'Erro ao verificar perfil do usuário' },
        { status: 500 }
      );
    }

    // Se o usuário não tem perfil, criar automaticamente
    if (!userProfile) {
      console.log('Criando perfil do usuário automaticamente');
      
      const { error: createProfileError } = await supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          created_at: new Date().toISOString(),
        });

      if (createProfileError) {
        console.error('Erro ao criar perfil do usuário:', createProfileError.message);
        return NextResponse.json(
          { error: 'Erro ao criar perfil do usuário' },
          { status: 500 }
        );
      }
    }

    // Salvar o progresso
    const { error: saveError } = await supabase
      .from('user_simulado_progress')
      .insert({
        user_id: session.user.id,
        simulado_id: id,
        score: score,
        time_taken_minutes: Math.round(timeTaken / 60), // Converter segundos para minutos
        answers: answers,
        completed_at: new Date().toISOString(),
      });

    if (saveError) {
      console.error('Erro ao salvar progresso:', saveError.message);
      return NextResponse.json(
        { error: 'Erro ao salvar progresso', details: saveError.message },
        { status: 500 }
      );
    }

    console.log('Progresso salvo com sucesso');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
}

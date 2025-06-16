import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Buscar flashcards do banco
    const { data: flashcards, error: _error } = await supabase
      .from('flashcards')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (_error) {
      return NextResponse.json(
        { error: 'Erro ao buscar flashcards' },
        { status: 500 }
      );
    }

    return NextResponse.json(flashcards || []);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(_request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Obter os dados do corpo da requisição
    const body = await _request.json();
    const { front, back, disciplina, tema, subtema, concurso_id } = body;

    // Validar os dados obrigatórios
    if (!front || !back || !disciplina || !tema) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    // Criar o flashcard
    const { data: flashcard, error: _error } = await supabase
      .from('flashcards')
      .insert({
        front,
        back,
        disciplina,
        tema,
        subtema,
        concurso_id,
      })
      .select()
      .single();

    if (_error) {
      return NextResponse.json(
        { error: 'Erro ao criar flashcard' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Flashcard criado com sucesso',
      flashcard,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

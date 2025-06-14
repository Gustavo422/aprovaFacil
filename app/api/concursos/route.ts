import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { logger } from '@/lib/logger';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  const { searchParams } = new URL(_request.url);
  const categoria = searchParams.get('categoria');
  const ano = searchParams.get('ano');
  const banca = searchParams.get('banca');
  const isActive = searchParams.get('is_active');

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

    // Construir a query base
    let query = supabase.from('concursos').select('*');

    // Aplicar filtros se fornecidos
    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    if (ano) {
      query = query.eq('ano', parseInt(ano));
    }

    if (banca) {
      query = query.eq('banca', banca);
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    // Executar a query
    const { data: concursos, error } = await query;

    if (error) {
      logger.error('Erro ao buscar concursos:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      concursos,
    });
  } catch (error) {
    logger.error('Erro ao processar requisição:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
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
    const { nome, descricao, categoria, ano, banca, is_active } = body;

    // Validar os dados obrigatórios
    if (!nome || !categoria) {
      return NextResponse.json(
        { error: 'Nome e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar o concurso
    const { data: concurso, error } = await supabase
      .from('concursos')
      .insert({
        nome,
        descricao,
        categoria,
        ano: ano ? parseInt(ano) : null,
        banca,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      logger.error('Erro ao criar concurso:', {
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Concurso criado com sucesso',
      concurso,
    });
  } catch (error) {
    logger.error('Erro ao processar requisição:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

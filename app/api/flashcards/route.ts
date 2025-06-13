import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const disciplina = searchParams.get("disciplina")
  const tema = searchParams.get("tema")

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Buscar os pontos fracos do usuário
    // Em um cenário real, isso seria baseado no desempenho do usuário em simulados e questões
    // Aqui estamos simulando uma busca de pontos fracos
    const pontosFracos = [
      { disciplina: "Direito Constitucional", tema: "Controle de Constitucionalidade" },
      { disciplina: "Direito Administrativo", tema: "Licitações e Contratos" },
      { disciplina: "Português", tema: "Crase" },
    ]

    // Construir a query para buscar flashcards baseados nos pontos fracos
    let query = supabase.from("flashcards").select("*")

    // Se disciplina e tema foram especificados, usar esses filtros
    if (disciplina && tema) {
      query = query.eq("disciplina", disciplina).eq("tema", tema)
    } else {
      // Caso contrário, usar os pontos fracos
      const disciplinas = pontosFracos.map((pf) => pf.disciplina)
      const temas = pontosFracos.map((pf) => pf.tema)

      if (disciplinas.length > 0) {
        query = query.in("disciplina", disciplinas)
      }

      if (temas.length > 0) {
        query = query.in("tema", temas)
      }
    }

    // Limitar o número de flashcards
    query = query.limit(limit)

    // Executar a query
    const { data: flashcards, error } = await query

    if (error) {
      console.error("Erro ao buscar flashcards:", error)
      return NextResponse.json({ error: "Erro ao buscar flashcards" }, { status: 500 })
    }

    // Buscar o progresso do usuário para esses flashcards
    const flashcardIds = flashcards.map((f) => f.id)

    const { data: progressos, error: progressosError } = await supabase
      .from("user_flashcard_progress")
      .select("*")
      .eq("user_id", session.user.id)
      .in("flashcard_id", flashcardIds)

    if (progressosError) {
      console.error("Erro ao buscar progressos:", progressosError)
      return NextResponse.json({ error: "Erro ao buscar progressos" }, { status: 500 })
    }

    // Mapear os progressos para os flashcards
    const flashcardsComProgresso = flashcards.map((flashcard) => {
      const progresso = progressos?.find((p) => p.flashcard_id === flashcard.id)
      return {
        ...flashcard,
        status: progresso?.status || "novo",
        nextReview: progresso?.next_review || null,
        reviewCount: progresso?.review_count || 0,
      }
    })

    return NextResponse.json({
      flashcards: flashcardsComProgresso,
      pontosFracos,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

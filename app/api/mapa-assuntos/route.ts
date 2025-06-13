import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const concursoId = searchParams.get("concurso_id")
  const disciplina = searchParams.get("disciplina")

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

    // Construir a query base
    let query = supabase.from("mapa_assuntos").select("*")

    // Aplicar filtros se fornecidos
    if (concursoId) {
      query = query.eq("concurso_id", concursoId)
    }

    if (disciplina) {
      query = query.eq("disciplina", disciplina)
    }

    // Executar a query
    const { data: assuntos, error } = await query

    if (error) {
      console.error("Erro ao buscar mapa de assuntos:", error)
      return NextResponse.json({ error: "Erro ao buscar mapa de assuntos" }, { status: 500 })
    }

    // Buscar o status dos assuntos para o usuário
    const { data: statusAssuntos, error: statusError } = await supabase
      .from("user_mapa_assuntos_status")
      .select("*")
      .eq("user_id", session.user.id)

    if (statusError) {
      console.error("Erro ao buscar status dos assuntos:", statusError)
      return NextResponse.json({ error: "Erro ao buscar status dos assuntos" }, { status: 500 })
    }

    // Mapear os status para os assuntos
    const assuntosComStatus = assuntos.map((assunto) => {
      const status = statusAssuntos?.find((s) => s.mapa_assunto_id === assunto.id)
      return {
        ...assunto,
        status: status?.status || "nao_estudado",
      }
    })

    // Agrupar por disciplina
    const assuntosPorDisciplina: Record<string, any[]> = {}

    assuntosComStatus.forEach((assunto) => {
      if (!assuntosPorDisciplina[assunto.disciplina]) {
        assuntosPorDisciplina[assunto.disciplina] = []
      }
      assuntosPorDisciplina[assunto.disciplina].push(assunto)
    })

    return NextResponse.json({
      assuntosPorDisciplina,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

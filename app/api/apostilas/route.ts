import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const concursoId = searchParams.get("concurso_id")

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
    let query = supabase.from("apostilas").select("*")

    // Aplicar filtro por concurso se fornecido
    if (concursoId) {
      query = query.eq("concurso_id", concursoId)
    }

    // Executar a query
    const { data: apostilas, error } = await query

    if (error) {
      console.error("Erro ao buscar apostilas:", error)
      return NextResponse.json({ error: "Erro ao buscar apostilas" }, { status: 500 })
    }

    return NextResponse.json({
      apostilas,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

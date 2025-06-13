import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const filter = searchParams.get("filter") || "all"

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

    // Buscar simulados com paginação
    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase.from("simulados").select("*", { count: "exact" }).range(start, end)

    // Aplicar filtros se necessário
    if (filter === "completed") {
      const { data: completedIds } = await supabase
        .from("user_simulado_progress")
        .select("simulado_id")
        .eq("user_id", session.user.id)

      if (completedIds && completedIds.length > 0) {
        const ids = completedIds.map((item) => item.simulado_id)
        query = query.in("id", ids)
      } else {
        // Se não houver simulados completados, retornar array vazio
        return NextResponse.json({
          data: [],
          count: 0,
          page,
          limit,
        })
      }
    } else if (filter === "pending") {
      const { data: completedIds } = await supabase
        .from("user_simulado_progress")
        .select("simulado_id")
        .eq("user_id", session.user.id)

      if (completedIds && completedIds.length > 0) {
        const ids = completedIds.map((item) => item.simulado_id)
        query = query.not("id", "in", ids)
      }
    }

    const { data, count, error } = await query

    if (error) {
      console.error("Erro ao buscar simulados:", error)
      return NextResponse.json({ error: "Erro ao buscar simulados" }, { status: 500 })
    }

    return NextResponse.json({
      data,
      count,
      page,
      limit,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

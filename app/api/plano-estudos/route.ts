import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
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

    // Buscar o plano de estudos ativo do usuário
    const { data: planoEstudo, error } = await supabase
      .from("planos_estudo")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Erro ao buscar plano de estudos:", error)
      return NextResponse.json({ error: "Erro ao buscar plano de estudos" }, { status: 500 })
    }

    if (!planoEstudo) {
      return NextResponse.json({
        message: "Nenhum plano de estudos encontrado",
        hasActivePlan: false,
      })
    }

    return NextResponse.json({
      planoEstudo,
      hasActivePlan: true,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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

    // Obter os dados do corpo da requisição
    const body = await request.json()
    const { concursoId, startDate, endDate, hoursPerDay } = body

    // Validar os dados
    if (!startDate || !endDate || !hoursPerDay) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Buscar os assuntos do mapa de assuntos para o concurso
    let query = supabase.from("mapa_assuntos").select("*")
    if (concursoId) {
      query = query.eq("concurso_id", concursoId)
    }

    const { data: assuntos, error: assuntosError } = await query

    if (assuntosError) {
      console.error("Erro ao buscar assuntos:", assuntosError)
      return NextResponse.json({ error: "Erro ao buscar assuntos" }, { status: 500 })
    }

    // Gerar um cronograma de estudos baseado nos assuntos e no tempo disponível
    // Este é um exemplo simplificado; em um cenário real, você teria um algoritmo mais complexo
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Distribuir os assuntos pelos dias disponíveis
    const schedule: Record<string, any> = {}

    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(currentDate.getDate() + i)
      const dateString = currentDate.toISOString().split("T")[0]

      // Distribuir assuntos para este dia
      const assuntosPerDay = Math.ceil(assuntos.length / diffDays)
      const startIndex = i * assuntosPerDay
      const endIndex = Math.min(startIndex + assuntosPerDay, assuntos.length)
      const assuntosDodia = assuntos.slice(startIndex, endIndex)

      schedule[dateString] = {
        assuntos: assuntosDodia.map((a) => ({
          id: a.id,
          disciplina: a.disciplina,
          tema: a.tema,
          subtema: a.subtema,
          horasEstudo: Math.round((hoursPerDay / assuntosDodia.length) * 10) / 10,
        })),
        totalHoras: hoursPerDay,
      }
    }

    // Salvar o plano de estudos
    const { data: planoEstudo, error } = await supabase
      .from("planos_estudo")
      .insert({
        user_id: session.user.id,
        concurso_id: concursoId || null,
        start_date: startDate,
        end_date: endDate,
        schedule,
      })
      .select()

    if (error) {
      console.error("Erro ao salvar plano de estudos:", error)
      return NextResponse.json({ error: "Erro ao salvar plano de estudos" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Plano de estudos criado com sucesso",
      planoEstudo,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

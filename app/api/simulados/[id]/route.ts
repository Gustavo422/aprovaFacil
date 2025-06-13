import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Buscar detalhes do simulado
    const { data: simulado, error: simuladoError } = await supabase
      .from("simulados")
      .select("*")
      .eq("id", params.id)
      .single()

    if (simuladoError) {
      console.error("Erro ao buscar simulado:", simuladoError)
      return NextResponse.json({ error: "Simulado não encontrado" }, { status: 404 })
    }

    // Buscar as questões do simulado (em um cenário real, isso poderia ser um JSON externo)
    // Aqui estamos simulando a busca de questões
    const questoes = [
      {
        id: 1,
        text: "De acordo com a Constituição Federal de 1988, são Poderes da União, independentes e harmônicos entre si:",
        options: [
          { id: "a", text: "O Legislativo, o Executivo, o Judiciário e o Ministério Público." },
          { id: "b", text: "O Legislativo, o Executivo e o Judiciário." },
          { id: "c", text: "O Legislativo, o Executivo, o Judiciário e o Tribunal de Contas." },
          { id: "d", text: "O Legislativo, o Executivo, o Judiciário e a Defensoria Pública." },
          { id: "e", text: "O Legislativo, o Executivo, o Judiciário e a Advocacia Pública." },
        ],
        correctAnswer: "b",
      },
      // Adicionar mais questões conforme necessário
    ]

    // Verificar se o usuário já realizou este simulado
    const { data: progress, error: progressError } = await supabase
      .from("user_simulado_progress")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("simulado_id", params.id)
      .maybeSingle()

    return NextResponse.json({
      simulado,
      questoes,
      alreadyCompleted: !!progress,
      progress,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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
    const { answers, score, timeTaken } = body

    // Validar os dados
    if (!answers || score === undefined || !timeTaken) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Salvar o progresso do simulado
    const { data, error } = await supabase
      .from("user_simulado_progress")
      .upsert({
        user_id: session.user.id,
        simulado_id: params.id,
        score,
        time_taken_minutes: timeTaken,
        answers,
        completed_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Erro ao salvar progresso:", error)
      return NextResponse.json({ error: "Erro ao salvar progresso" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Progresso salvo com sucesso",
      data,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

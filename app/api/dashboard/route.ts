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

    // Buscar estatísticas de simulados
    const { data: simuladosStats, error: simuladosError } = await supabase
      .from("user_simulado_progress")
      .select("*")
      .eq("user_id", session.user.id)

    if (simuladosError) {
      console.error("Erro ao buscar estatísticas de simulados:", simuladosError)
      return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
    }

    // Calcular estatísticas
    const totalSimulados = simuladosStats?.length || 0
    const totalQuestoes =
      simuladosStats?.reduce((acc, curr) => {
        const answers = curr.answers as Record<string, string>
        return acc + Object.keys(answers).length
      }, 0) || 0

    const totalAcertos =
      simuladosStats?.reduce((acc, curr) => {
        return acc + curr.score
      }, 0) || 0

    const taxaAcerto = totalQuestoes > 0 ? (totalAcertos / totalQuestoes) * 100 : 0

    const tempoEstudo =
      simuladosStats?.reduce((acc, curr) => {
        return acc + curr.time_taken_minutes
      }, 0) || 0

    // Buscar plano de estudos ativo
    const { data: planoEstudo, error: planoError } = await supabase
      .from("planos_estudo")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (planoError) {
      console.error("Erro ao buscar plano de estudos:", planoError)
      return NextResponse.json({ error: "Erro ao buscar plano de estudos" }, { status: 500 })
    }

    // Buscar atividades recentes
    const { data: atividadesRecentes, error: atividadesError } = await supabase
      .from("user_simulado_progress")
      .select("*, simulados(*)")
      .eq("user_id", session.user.id)
      .order("completed_at", { ascending: false })
      .limit(5)

    if (atividadesError) {
      console.error("Erro ao buscar atividades recentes:", atividadesError)
      return NextResponse.json({ error: "Erro ao buscar atividades recentes" }, { status: 500 })
    }

    // Buscar desempenho por disciplina
    // Em um cenário real, isso seria calculado com base nos resultados dos simulados
    // Aqui estamos simulando dados de desempenho
    const desempenhoPorDisciplina = [
      { disciplina: "Direito Constitucional", acertos: 82 },
      { disciplina: "Direito Administrativo", acertos: 75 },
      { disciplina: "Português", acertos: 68 },
      { disciplina: "Raciocínio Lógico", acertos: 60 },
      { disciplina: "Informática", acertos: 90 },
    ]

    // Buscar pontos fracos
    // Em um cenário real, isso seria calculado com base nos resultados dos simulados
    // Aqui estamos simulando dados de pontos fracos
    const pontosFracos = [
      { tema: "Controle de Constitucionalidade", acertos: 45 },
      { tema: "Licitações e Contratos", acertos: 52 },
      { tema: "Crase", acertos: 48 },
      { tema: "Regência Verbal", acertos: 58 },
      { tema: "Análise Combinatória", acertos: 55 },
    ]

    return NextResponse.json({
      estatisticas: {
        totalSimulados,
        totalQuestoes,
        totalAcertos,
        taxaAcerto,
        tempoEstudo,
      },
      planoEstudo,
      atividadesRecentes,
      desempenhoPorDisciplina,
      pontosFracos,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

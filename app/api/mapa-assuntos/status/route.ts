import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
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
    const { assuntoId, status } = body

    // Validar os dados
    if (!assuntoId || !status) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Validar o status
    const statusValidos = ["estudado", "a_revisar", "nao_sei_nada", "nao_estudado"]
    if (!statusValidos.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    // Atualizar o status do assunto
    const { data, error } = await supabase
      .from("user_mapa_assuntos_status")
      .upsert({
        user_id: session.user.id,
        mapa_assunto_id: assuntoId,
        status,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error("Erro ao atualizar status:", error)
      return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Status atualizado com sucesso",
      data,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

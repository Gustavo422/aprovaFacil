import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
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

    // Buscar os módulos da apostila
    const { data: modulos, error } = await supabase
      .from("apostila_content")
      .select("*")
      .eq("apostila_id", params.id)
      .order("module_number", { ascending: true })

    if (error) {
      console.error("Erro ao buscar módulos:", error)
      return NextResponse.json({ error: "Erro ao buscar módulos" }, { status: 500 })
    }

    // Buscar o progresso do usuário para esses módulos
    const moduloIds = modulos.map((m) => m.id)

    const { data: progressos, error: progressosError } = await supabase
      .from("user_apostila_progress")
      .select("*")
      .eq("user_id", session.user.id)
      .in("apostila_content_id", moduloIds)

    if (progressosError) {
      console.error("Erro ao buscar progressos:", progressosError)
      return NextResponse.json({ error: "Erro ao buscar progressos" }, { status: 500 })
    }

    // Mapear os progressos para os módulos
    const modulosComProgresso = modulos.map((modulo) => {
      const progresso = progressos?.find((p) => p.apostila_content_id === modulo.id)
      return {
        ...modulo,
        completed: progresso?.completed || false,
        progress_percentage: progresso?.progress_percentage || 0,
      }
    })

    return NextResponse.json({
      modulos: modulosComProgresso,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

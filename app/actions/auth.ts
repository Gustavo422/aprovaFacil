"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  const supabase = createServerActionClient({ cookies })
  const serverClient = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Criar perfil do usuário usando o cliente do servidor
  if (data.user) {
    await serverClient.from("users").insert([
      {
        id: data.user.id,
        email,
        name,
        created_at: new Date().toISOString(),
      },
    ])
  }

  return { success: true }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createServerActionClient({ cookies })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function signOut() {
  const supabase = createServerActionClient({ cookies })
  await supabase.auth.signOut()
  redirect("/login")
}

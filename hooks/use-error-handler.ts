"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface ErrorHandlerOptions {
  showToast?: boolean
  toastTitle?: string
  onError?: (error: Error) => void
  fallbackMessage?: string
}

interface ErrorHandlerResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  execute: (...args: any[]) => Promise<T | null>
  reset: () => void
}

export function useErrorHandler<T = any>(options: ErrorHandlerOptions = {}): ErrorHandlerResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    showToast = true,
    toastTitle = "Erro",
    onError,
    fallbackMessage = "Ocorreu um erro inesperado. Tente novamente."
  } = options

  const getErrorMessage = useCallback((error: any): string => {
    // Erros do Supabase
    if (error?.message?.includes('rate limit')) {
      return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente."
    }
    
    if (error?.message?.includes('Invalid login credentials')) {
      return "Email ou senha incorretos. Verifique suas credenciais."
    }
    
    if (error?.message?.includes('Email not confirmed')) {
      return "Email não confirmado. Verifique sua caixa de entrada."
    }
    
    if (error?.message?.includes('User already registered')) {
      return "Este email já está cadastrado. Tente fazer login."
    }
    
    // Erros de rede
    if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
      return "Erro de conexão. Verifique sua internet e tente novamente."
    }
    
    // Erros de timeout
    if (error?.message?.includes('timeout')) {
      return "A operação demorou muito. Tente novamente."
    }
    
    // Erros de validação
    if (error?.message?.includes('validation')) {
      return "Dados inválidos. Verifique as informações fornecidas."
    }
    
    // Erros de permissão
    if (error?.message?.includes('permission') || error?.message?.includes('unauthorized')) {
      return "Você não tem permissão para realizar esta ação."
    }
    
    // Erros de servidor
    if (error?.status >= 500) {
      return "Erro interno do servidor. Tente novamente mais tarde."
    }
    
    // Erros de cliente
    if (error?.status >= 400 && error?.status < 500) {
      return error.message || "Dados inválidos ou não encontrados."
    }
    
    // Erro padrão
    return error?.message || fallbackMessage
  }, [fallbackMessage])

  const execute = useCallback(async (fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fn(...args)
      setData(result)
      return result
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      const errorObj = new Error(errorMessage)
      
      setError(errorObj)
      
      if (showToast) {
        toast({
          variant: "destructive",
          title: toastTitle,
          description: errorMessage,
        })
      }
      
      if (onError) {
        onError(errorObj)
      }
      
      console.error("Erro capturado pelo useErrorHandler:", err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [getErrorMessage, showToast, toastTitle, toast, onError])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    error,
    isLoading,
    execute,
    reset
  }
}

// Hook especializado para operações de autenticação
export function useAuthErrorHandler() {
  return useErrorHandler({
    showToast: true,
    toastTitle: "Erro de Autenticação",
    fallbackMessage: "Erro ao autenticar. Verifique suas credenciais e tente novamente."
  })
}

// Hook especializado para operações de dados
export function useDataErrorHandler() {
  return useErrorHandler({
    showToast: true,
    toastTitle: "Erro de Dados",
    fallbackMessage: "Erro ao carregar dados. Tente novamente."
  })
}

// Hook especializado para operações de formulário
export function useFormErrorHandler() {
  return useErrorHandler({
    showToast: true,
    toastTitle: "Erro de Formulário",
    fallbackMessage: "Erro ao processar formulário. Verifique os dados e tente novamente."
  })
} 
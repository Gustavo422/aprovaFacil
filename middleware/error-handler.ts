import { NextRequest, NextResponse } from 'next/server'
import { 
  createError, 
  getErrorMessage, 
  logError, 
  isOperationalError,
  AppError 
} from '@/lib/error-utils'

// Middleware para tratamento de erros em APIs
export function withApiErrorHandler<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse<any>>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse<any>> => {
    try {
      return await handler(request, ...args)
    } catch (error: any) {
      // Log do erro
      logError(error, {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
      })

      // Se já é um AppError, usar diretamente
      if (error instanceof AppError) {
        return NextResponse.json(
          { 
            error: error.message,
            code: error.code,
            status: error.status 
          },
          { status: error.status }
        )
      }

      // Se é um erro operacional, retornar mensagem amigável
      if (isOperationalError(error)) {
        const message = getErrorMessage(error)
        const status = error.status || 400
        
        return NextResponse.json(
          { error: message },
          { status }
        )
      }

      // Para erros não operacionais, retornar erro genérico
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      )
    }
  }
}

// Middleware para validação de autenticação
export function withAuthValidation<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse<any>>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse<any>> => {
    try {
      // Verificar se o usuário está autenticado
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError(
          'Token de autenticação não fornecido',
          'INVALID_CREDENTIALS',
          401
        )
      }

      // Aqui você pode adicionar validação adicional do token
      // Por exemplo, verificar se o token é válido no Supabase

      return await handler(request, ...args)
    } catch (error: any) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        )
      }
      
      throw error
    }
  }
}

// Middleware para validação de rate limit
export function withRateLimit<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse<any>>,
  options: {
    maxRequests?: number
    windowMs?: number
  } = {}
) {
  const { maxRequests = 100, windowMs = 15 * 60 * 1000 } = options // 15 minutos por padrão
  
  // Cache simples em memória (em produção, use Redis ou similar)
  const requestCounts = new Map<string, { count: number; resetTime: number }>()

  return async (request: NextRequest, ...args: T): Promise<NextResponse<any>> => {
    try {
      const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'
      
      const now = Date.now()
      const userRequests = requestCounts.get(ip)

      if (!userRequests || now > userRequests.resetTime) {
        // Reset ou primeira requisição
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs })
      } else if (userRequests.count >= maxRequests) {
        // Rate limit excedido
        throw createError(
          'Muitas requisições. Tente novamente mais tarde.',
          'RATE_LIMIT_EXCEEDED',
          429
        )
      } else {
        // Incrementar contador
        userRequests.count++
      }

      return await handler(request, ...args)
    } catch (error: any) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        )
      }
      
      throw error
    }
  }
}

// Middleware para validação de entrada
export function withInputValidation<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse<any>>,
  validator?: (data: any) => { isValid: boolean; errors?: string[] }
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse<any>> => {
    try {
      // Validar corpo da requisição se for POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const contentType = request.headers.get('content-type')
        
        if (contentType?.includes('application/json')) {
          const body = await request.json()
          
          if (validator) {
            const validation = validator(body)
            if (!validation.isValid) {
              throw createError(
                `Dados inválidos: ${validation.errors?.join(', ')}`,
                'INVALID_INPUT',
                400
              )
            }
          }
        }
      }

      return await handler(request, ...args)
    } catch (error: any) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status }
        )
      }
      
      throw error
    }
  }
}

// Middleware composto que combina múltiplos middlewares
export function composeMiddleware<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse<any>>,
  middlewares: Array<(handler: any) => any> = []
) {
  return middlewares.reduceRight((acc, middleware) => middleware(acc), handler)
}

// Exemplo de uso:
// export const GET = composeMiddleware(
//   async (request: NextRequest) => {
//     // Sua lógica aqui
//     return NextResponse.json({ data: 'success' })
//   },
//   [
//     withApiErrorHandler,
//     withAuthValidation,
//     withRateLimit,
//     withInputValidation
//   ]
// ) 
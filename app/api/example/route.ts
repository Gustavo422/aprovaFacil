import { NextRequest, NextResponse } from 'next/server'
import { 
  composeMiddleware, 
  withApiErrorHandler, 
  withAuthValidation, 
  withRateLimit, 
  withInputValidation 
} from '@/middleware/error-handler'
import { 
  createError, 
  createValidationError, 
  createNotFoundError,
  withErrorHandling 
} from '@/lib/error-utils'

// Exemplo de validador
function validateUserData(data: any) {
  const errors: string[] = []
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres')
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Email deve ser válido')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Handler principal da API
async function handleGet(request: NextRequest) {
  return await withErrorHandling(async () => {
    // Simular busca de dados
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      throw createValidationError('ID é obrigatório', 'id')
    }
    
    // Simular erro de recurso não encontrado
    if (id === '999') {
      throw createNotFoundError('Usuário')
    }
    
    // Simular dados de sucesso
    return NextResponse.json({
      id,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      createdAt: new Date().toISOString()
    })
  }, { operation: 'getUser' })
}

async function handlePost(request: NextRequest) {
  return await withErrorHandling(async () => {
    const body = await request.json()
    
    // Validação manual adicional
    if (!body.name) {
      throw createValidationError('Nome é obrigatório', 'name')
    }
    
    // Simular criação de usuário
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json(newUser, { status: 201 })
  }, { operation: 'createUser' })
}

// Exportar handlers com middlewares aplicados
export const GET = composeMiddleware(
  handleGet,
  [
    withApiErrorHandler,
    (handler) => withRateLimit(handler, { maxRequests: 50, windowMs: 5 * 60 * 1000 }) // 50 requests por 5 minutos
  ]
)

export const POST = composeMiddleware(
  handlePost,
  [
    withApiErrorHandler,
    withAuthValidation,
    (handler) => withRateLimit(handler, { maxRequests: 10, windowMs: 5 * 60 * 1000 }), // 10 requests por 5 minutos
    (handler) => withInputValidation(handler, validateUserData)
  ]
) 
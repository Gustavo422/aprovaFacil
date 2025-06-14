import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandling, 
  validateRequest, 
  AppError, 
  ErrorCodes,
  captureRequestContext 
} from '../index';

// Exemplo 1: API de usuários com validação
export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');
  const includeProfile = searchParams.get('includeProfile') === 'true';

  // Validação de parâmetros
  if (!userId) {
    throw AppError.validation('id', 'ID do usuário é obrigatório');
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    throw AppError.validation('id', 'ID do usuário deve ser um UUID válido');
  }

  try {
    // Simular busca no banco de dados
    const user = await getUserFromDatabase(userId);
    
    if (!user) {
      throw AppError.create(
        ErrorCodes.USER_NOT_FOUND,
        `Usuário com ID ${userId} não encontrado`,
        'business',
        'medium',
        false,
        true
      );
    }

    // Incluir perfil se solicitado
    if (includeProfile) {
      const profile = await getUserProfile(userId);
      user.profile = profile;
    }

    return NextResponse.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Se já é um AppError, apenas rethrow
    if (error instanceof AppError) {
      throw error;
    }

    // Converter erro de banco para AppError
    if (error.message?.includes('connection')) {
      throw AppError.database('Erro de conexão com o banco de dados', true);
    }

    // Erro genérico
    throw AppError.system('Erro interno do servidor', false);
  }
});

// Exemplo 2: API de criação de usuário
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  // Validação do corpo da requisição
  const validationResult = validateUserData(body);
  if (!validationResult.isValid) {
    throw AppError.validation(
      validationResult.field,
      validationResult.message,
      validationResult.value
    );
  }

  try {
    // Verificar se usuário já existe
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      throw AppError.create(
        ErrorCodes.DATABASE_DUPLICATE_ENTRY,
        'Usuário com este email já existe',
        'business',
        'medium',
        false,
        true
      );
    }

    // Criar usuário
    const newUser = await createUser(body);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Usuário criado com sucesso'
    }, { status: 201 });

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Tratar erros específicos do banco
    if (error.code === '23505') { // PostgreSQL unique constraint
      throw AppError.create(
        ErrorCodes.DATABASE_DUPLICATE_ENTRY,
        'Dados duplicados',
        'database',
        'medium',
        false,
        true
      );
    }

    throw AppError.system('Erro ao criar usuário', false);
  }
});

// Exemplo 3: API de atualização com autorização
export const PUT = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');
  const body = await req.json();

  // Validação básica
  if (!userId) {
    throw AppError.validation('id', 'ID do usuário é obrigatório');
  }

  // Verificar autorização
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    throw AppError.authentication('Token de autorização é obrigatório');
  }

  const token = authHeader.replace('Bearer ', '');
  const user = await validateToken(token);
  
  if (!user) {
    throw AppError.authentication('Token inválido ou expirado');
  }

  // Verificar permissões
  if (user.id !== userId && user.role !== 'admin') {
    throw AppError.authorization('Você não tem permissão para editar este usuário');
  }

  try {
    const updatedUser = await updateUser(userId, body);
    
    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Usuário atualizado com sucesso'
    });

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw AppError.system('Erro ao atualizar usuário', false);
  }
});

// Exemplo 4: API de exclusão com confirmação
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('id');
  const confirm = searchParams.get('confirm');

  if (!userId) {
    throw AppError.validation('id', 'ID do usuário é obrigatório');
  }

  if (confirm !== 'true') {
    throw AppError.validation('confirm', 'Confirmação é obrigatória para exclusão');
  }

  // Verificar se usuário existe
  const existingUser = await getUserFromDatabase(userId);
  if (!existingUser) {
    throw AppError.create(
      ErrorCodes.USER_NOT_FOUND,
      'Usuário não encontrado',
      'business',
      'medium',
      false,
      true
    );
  }

  try {
    await deleteUser(userId);
    
    return NextResponse.json({
      success: true,
      message: 'Usuário excluído com sucesso'
    });

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    // Verificar se há dependências
    if (error.message?.includes('foreign key')) {
      throw AppError.create(
        ErrorCodes.BUSINESS_CONFLICT,
        'Não é possível excluir usuário com dados relacionados',
        'business',
        'medium',
        false,
        true
      );
    }

    throw AppError.system('Erro ao excluir usuário', false);
  }
});

// Funções auxiliares (simuladas)
async function getUserFromDatabase(userId: string) {
  // Simulação de busca no banco
  if (userId === '123e4567-e89b-12d3-a456-426614174000') {
    return {
      id: userId,
      name: 'João Silva',
      email: 'joao@example.com',
      createdAt: new Date().toISOString()
    };
  }
  return null;
}

async function getUserProfile(userId: string) {
  return {
    bio: 'Desenvolvedor Full Stack',
    avatar: 'https://example.com/avatar.jpg',
    preferences: {
      theme: 'dark',
      language: 'pt-BR'
    }
  };
}

async function getUserByEmail(email: string) {
  // Simulação
  return null;
}

async function createUser(userData: any) {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    ...userData,
    createdAt: new Date().toISOString()
  };
}

async function updateUser(userId: string, userData: any) {
  return {
    id: userId,
    ...userData,
    updatedAt: new Date().toISOString()
  };
}

async function deleteUser(userId: string) {
  // Simulação
  return true;
}

async function validateToken(token: string) {
  // Simulação de validação de token
  if (token === 'valid-token') {
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      role: 'user'
    };
  }
  return null;
}

function validateUserData(data: any) {
  if (!data.name || data.name.length < 2) {
    return {
      isValid: false,
      field: 'name',
      message: 'Nome deve ter pelo menos 2 caracteres',
      value: data.name
    };
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return {
      isValid: false,
      field: 'email',
      message: 'Email deve ser válido',
      value: data.email
    };
  }

  if (!data.password || data.password.length < 8) {
    return {
      isValid: false,
      field: 'password',
      message: 'Senha deve ter pelo menos 8 caracteres',
      value: undefined
    };
  }

  return { isValid: true };
} 
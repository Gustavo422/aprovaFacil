import React, { useState, useEffect } from 'react';
import { 
  useErrorHandler, 
  useErrorToast, 
  useNetworkStatus, 
  useErrorRecovery,
  ErrorBoundary,
  DefaultErrorFallback,
  NetworkErrorFallback,
  AuthErrorFallback,
  PermissionErrorFallback,
  AppError,
  ErrorCodes,
  withRetry
} from '../index';

// Exemplo 1: Componente com tratamento de erro básico
export function UserProfile({ userId }: { userId: string }) {
  const { error, isLoading, executeSafely, clearError, retryCount } = useErrorHandler({
    showUserFriendly: true,
    logErrors: true,
    onError: (error) => {
      console.log('Erro capturado:', error.metadata.code);
    }
  });

  const [user, setUser] = useState<any>(null);
  const { showError } = useErrorToast();

  const loadUser = async () => {
    const userData = await executeSafely(async () => {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw AppError.create(
          errorData.error?.code || ErrorCodes.API_ERROR,
          errorData.error?.message || 'Falha ao carregar usuário',
          'network',
          'medium',
          true,
          true
        );
      }
      
      return response.json();
    });

    if (userData) {
      setUser(userData.data);
    }
  };

  const handleRetry = () => {
    clearError();
    loadUser();
  };

  useEffect(() => {
    loadUser();
  }, [userId]);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h3>Erro ao carregar perfil</h3>
          <p>{error.toUserFriendly()}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">
              Tentar novamente ({retryCount}/3)
            </button>
            <button onClick={() => window.location.reload()} className="reload-button">
              Recarregar página
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Detalhes técnicos</summary>
              <pre>{error.message}</pre>
              <pre>{JSON.stringify(error.metadata, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="loading">Carregando perfil...</div>;
  }

  if (!user) {
    return <div className="no-data">Nenhum usuário encontrado</div>;
  }

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Membro desde: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

// Exemplo 2: Componente com retry automático
export function DataFetcher({ endpoint }: { endpoint: string }) {
  const { error, isLoading, executeWithRetry, clearError } = useErrorHandler();
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    const result = await executeWithRetry(
      async () => {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
      },
      3, // maxRetries
      1000 // delay inicial
    );

    if (result) {
      setData(result);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const handleRetry = () => {
    clearError();
    fetchData();
  };

  if (error) {
    return (
      <div className="error-state">
        <p>Erro: {error.toUserFriendly()}</p>
        <button onClick={handleRetry}>Tentar novamente</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="data-display">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Exemplo 3: Componente com recuperação de erro
export function CriticalComponent() {
  const { error, isLoading, executeSafely } = useErrorHandler();
  const { 
    recoveryAttempts, 
    attemptRecovery, 
    canAttemptRecovery,
    resetRecoveryAttempts 
  } = useErrorRecovery();
  const [data, setData] = useState<any>(null);

  const performCriticalOperation = async () => {
    const result = await executeSafely(async () => {
      // Simular operação crítica que pode falhar
      const response = await fetch('/api/critical-operation');
      
      if (!response.ok) {
        throw AppError.system('Operação crítica falhou', true);
      }
      
      return response.json();
    });

    if (result) {
      setData(result);
      resetRecoveryAttempts();
    }
  };

  const handleRecovery = async () => {
    const success = await attemptRecovery(async () => {
      // Lógica de recuperação
      await performCriticalOperation();
    });

    if (success) {
      console.log('Recuperação bem-sucedida!');
    } else {
      console.log('Falha na recuperação');
    }
  };

  useEffect(() => {
    performCriticalOperation();
  }, []);

  if (error) {
    return (
      <div className="critical-error">
        <h3>Erro Crítico</h3>
        <p>{error.toUserFriendly()}</p>
        
        {canAttemptRecovery && (
          <button onClick={handleRecovery}>
            Tentar recuperar ({recoveryAttempts}/3)
          </button>
        )}
        
        {!canAttemptRecovery && (
          <div className="recovery-exhausted">
            <p>Tentativas de recuperação esgotadas</p>
            <button onClick={() => window.location.reload()}>
              Recarregar aplicação
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <div>Executando operação crítica...</div>;
  }

  return (
    <div className="critical-success">
      <h3>Operação Concluída</h3>
      <p>Dados: {JSON.stringify(data)}</p>
    </div>
  );
}

// Exemplo 4: Componente com monitoramento de rede
export function NetworkAwareComponent() {
  const { isOnline, isOffline } = useNetworkStatus();
  const { error, executeSafely } = useErrorHandler();
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    if (isOffline) {
      throw AppError.network('Sem conexão com a internet', true);
    }

    const result = await executeSafely(async () => {
      const response = await fetch('/api/data');
      return response.json();
    });

    if (result) {
      setData(result);
    }
  };

  useEffect(() => {
    if (isOnline) {
      fetchData();
    }
  }, [isOnline]);

  if (isOffline) {
    return (
      <NetworkErrorFallback 
        onRetry={() => {
          if (isOnline) {
            fetchData();
          }
        }} 
      />
    );
  }

  if (error) {
    return (
      <div className="network-error">
        <p>{error.toUserFriendly()}</p>
        <button onClick={fetchData}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="network-success">
      <p>Conectado: {isOnline ? 'Sim' : 'Não'}</p>
      <p>Dados: {JSON.stringify(data)}</p>
    </div>
  );
}

// Exemplo 5: Componente com diferentes tipos de erro
export function MultiErrorComponent() {
  const { error, executeSafely } = useErrorHandler();
  const [action, setAction] = useState<string>('');

  const performAction = async (actionType: string) => {
    setAction(actionType);
    
    await executeSafely(async () => {
      switch (actionType) {
        case 'auth':
          throw AppError.authentication('Sessão expirada');
        case 'permission':
          throw AppError.authorization('Acesso negado');
        case 'validation':
          throw AppError.validation('email', 'Email inválido');
        case 'network':
          throw AppError.network('Timeout na conexão', true);
        case 'database':
          throw AppError.database('Erro de conexão', true);
        case 'business':
          throw AppError.business('Saldo insuficiente');
        case 'system':
          throw AppError.system('Erro interno do servidor');
        default:
          throw new Error('Ação desconhecida');
      }
    });
  };

  const renderErrorFallback = () => {
    if (!error) return null;

    switch (error.metadata.category) {
      case 'authentication':
        return (
          <AuthErrorFallback 
            onLogin={() => window.location.href = '/login'} 
          />
        );
      case 'authorization':
        return (
          <PermissionErrorFallback 
            onGoBack={() => window.history.back()} 
          />
        );
      case 'network':
        return (
          <NetworkErrorFallback 
            onRetry={() => performAction(action)} 
          />
        );
      default:
        return (
          <DefaultErrorFallback
            error={error}
            errorInfo={{ componentStack: '' }}
            onReset={() => window.location.reload()}
          />
        );
    }
  };

  return (
    <div className="multi-error-component">
      <h3>Teste de Diferentes Erros</h3>
      
      <div className="action-buttons">
        <button onClick={() => performAction('auth')}>Erro de Auth</button>
        <button onClick={() => performAction('permission')}>Erro de Permissão</button>
        <button onClick={() => performAction('validation')}>Erro de Validação</button>
        <button onClick={() => performAction('network')}>Erro de Rede</button>
        <button onClick={() => performAction('database')}>Erro de Banco</button>
        <button onClick={() => performAction('business')}>Erro de Negócio</button>
        <button onClick={() => performAction('system')}>Erro do Sistema</button>
      </div>

      {error && renderErrorFallback()}
    </div>
  );
}

// Exemplo 6: Componente com Error Boundary
export function AppWithErrorBoundary() {
  return (
    <ErrorBoundary
      fallback={(error: Error, errorInfo: any) => (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          onReset={() => window.location.reload()}
        />
      )}
      onError={(error, errorInfo) => {
        console.error('Erro capturado pelo boundary:', error);
        console.error('Info do erro:', errorInfo);
      }}
    >
      <div className="app-content">
        <h1>Minha Aplicação</h1>
        <UserProfile userId="123" />
        <DataFetcher endpoint="/api/data" />
        <CriticalComponent />
        <NetworkAwareComponent />
        <MultiErrorComponent />
      </div>
    </ErrorBoundary>
  );
}

// Exemplo 7: Hook customizado com tratamento de erro
export function useApiCall<T>(endpoint: string) {
  const { error, isLoading, executeSafely } = useErrorHandler();
  const [data, setData] = useState<T | null>(null);

  const fetchData = async () => {
    const result = await executeSafely(async () => {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw AppError.create(
          ErrorCodes.API_ERROR,
          `Falha na requisição: ${response.status}`,
          'network',
          'medium',
          true,
          true
        );
      }
      
      return response.json();
    });

    if (result) {
      setData(result);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return {
    data,
    error,
    isLoading,
    refetch
  };
}

// Exemplo de uso do hook customizado
export function UserList() {
  const { data: users, error, isLoading, refetch } = useApiCall<any[]>('/api/users');

  if (error) {
    return (
      <div className="error-state">
        <p>{error.toUserFriendly()}</p>
        <button onClick={refetch}>Tentar novamente</button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <div className="user-list">
      <h2>Usuários</h2>
      {users?.map(user => (
        <div key={user.id} className="user-item">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
} 
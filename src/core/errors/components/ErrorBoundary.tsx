import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError } from '../AppError';
import { errorHandler } from '../ErrorHandler';
import { captureBrowserContext } from '../ErrorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo: _errorInfo,
    });

    // Log do erro
    this.logError(error, _errorInfo);

    // Callback personalizado
    if (this.props.onError) {
      this.props.onError(error, _errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset do erro quando resetKeys mudar
    if (
      this.state.hasError &&
      prevProps.resetKeys !== this.props.resetKeys
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  private async logError(error: Error, errorInfo: ErrorInfo) {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else {
      appError = AppError.fromError(error, {
        code: 'REACT_ERROR_BOUNDARY',
        category: 'system',
        severity: 'high',
        retryable: false,
        userFriendly: true,
      });
    }

    // Adicionar contexto do navegador
    appError.addContext(captureBrowserContext());

    await errorHandler.handle(appError);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;
      const { error, errorInfo } = this.state;

      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback(error!, errorInfo!);
        }
        return fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Algo deu errado</h2>
            <p>
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="error-details">
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre>{error.toString()}</pre>
                {errorInfo && (
                  <pre>{errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <button onClick={this.handleReset} className="error-reset-button">
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar dentro de componentes funcionais
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError,
    hasError: error !== null,
  };
}

// Componente de fallback padrão
export function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  onReset 
}: { 
  error: Error; 
  errorInfo: ErrorInfo; 
  onReset: () => void;
}) {
  return (
    <div className="error-fallback">
      <div className="error-fallback-content">
        <div className="error-icon">⚠️</div>
        <h2>Ops! Algo deu errado</h2>
        <p>
          Encontramos um problema inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
        </p>
        
        <div className="error-actions">
          <button onClick={onReset} className="retry-button">
            Tentar novamente
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="reload-button"
          >
            Recarregar página
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Detalhes técnicos (desenvolvimento)</summary>
            <div className="error-stack">
              <h4>Erro:</h4>
              <pre>{error.toString()}</pre>
              {errorInfo && (
                <>
                  <h4>Stack do componente:</h4>
                  <pre>{errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Componente para erros de rede
export function NetworkErrorFallback({ 
  onRetry 
}: { 
  onRetry: () => void;
}) {
  return (
    <div className="network-error-fallback">
      <div className="network-error-content">
        <div className="network-icon">📡</div>
        <h2>Sem conexão</h2>
        <p>
          Parece que você está offline. Verifique sua conexão com a internet e tente novamente.
        </p>
        <button onClick={onRetry} className="retry-button">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

// Componente para erros de autenticação
export function AuthErrorFallback({ 
  onLogin 
}: { 
  onLogin: () => void;
}) {
  return (
    <div className="auth-error-fallback">
      <div className="auth-error-content">
        <div className="auth-icon">🔐</div>
        <h2>Sessão expirada</h2>
        <p>
          Sua sessão expirou. Faça login novamente para continuar.
        </p>
        <button onClick={onLogin} className="login-button">
          Fazer login
        </button>
      </div>
    </div>
  );
}

// Componente para erros de permissão
export function PermissionErrorFallback({ 
  onGoBack 
}: { 
  onGoBack: () => void;
}) {
  return (
    <div className="permission-error-fallback">
      <div className="permission-error-content">
        <div className="permission-icon">🚫</div>
        <h2>Acesso negado</h2>
        <p>
          Você não tem permissão para acessar este recurso.
        </p>
        <button onClick={onGoBack} className="back-button">
          Voltar
        </button>
      </div>
    </div>
  );
} 
import React from 'react';
import * as Sentry from '@sentry/nextjs';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Atualiza o state para que a próxima renderização mostre a UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Registra o erro no Sentry
    Sentry.captureException(error, { extra: { errorInfo } });
    
    // Você também pode registrar o erro em um serviço de log
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI alternativa
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Oops! Algo deu errado.
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Encontramos um problema ao carregar esta página. Nossa equipe foi notificada e está trabalhando para resolver o mais rápido possível.
              </p>
              <div className="mt-6">
                <button
                  onClick={this.handleReset}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Tentar novamente
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <p>Se o problema persistir, entre em contato com o suporte.</p>
                <p className="mt-1">Código do erro: {this.state.error?.message?.substring(0, 50)}...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

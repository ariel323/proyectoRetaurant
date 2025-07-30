import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Componente ErrorBoundary para capturar errores de React
 * Proporciona una interfaz de recuperación elegante
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary capturó un error:", error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="error-boundary__title">Oops! Algo salió mal</h2>

            <p className="error-boundary__message">
              Lo sentimos, ocurrió un error inesperado. Nuestro equipo ha sido
              notificado.
            </p>

            <div className="error-boundary__actions">
              <button
                onClick={() => window.location.reload()}
                className="error-boundary__button error-boundary__button--primary"
              >
                Recargar Página
              </button>

              <button
                onClick={() => window.history.back()}
                className="error-boundary__button error-boundary__button--secondary"
              >
                Volver Atrás
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-boundary__details">
                <summary>Detalles del Error (Solo en Desarrollo)</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '../../components/ui';

interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetErrorBoundary }) => {
  const routeError = useRouteError();
  
  // Determine the error to display
  const displayError = error || routeError;
  
  let errorMessage = 'Ha ocurrido un error inesperado';
  let errorStatus = '500';
  let errorTitle = 'Error del Servidor';
  
  if (isRouteErrorResponse(displayError)) {
    errorStatus = displayError.status.toString();
    errorTitle = displayError.statusText || 'Error';
    
    switch (displayError.status) {
      case 404:
        errorTitle = 'Página No Encontrada';
        errorMessage = 'Lo sentimos, la página que buscas no existe.';
        break;
      case 401:
        errorTitle = 'No Autorizado';
        errorMessage = 'No tienes permisos para acceder a esta página.';
        break;
      case 403:
        errorTitle = 'Acceso Prohibido';
        errorMessage = 'No tienes permisos para acceder a este recurso.';
        break;
      case 500:
        errorTitle = 'Error del Servidor';
        errorMessage = 'Ha ocurrido un error interno del servidor. Por favor, intenta nuevamente.';
        break;
      default:
        errorMessage = displayError.data?.message || displayError.statusText || errorMessage;
    }
  } else if (displayError instanceof Error) {
    errorMessage = displayError.message;
    errorTitle = 'Error de la Aplicación';
  }

  const handleRefresh = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const getErrorIcon = () => {
    switch (errorStatus) {
      case '404':
        return (
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case '401':
      case '403':
        return (
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          {getErrorIcon()}
        </div>
        
        {/* Error Status */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {errorStatus}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {errorTitle}
          </h2>
          <p className="text-gray-600 text-lg">
            {errorMessage}
          </p>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleRefresh}
              size="lg"
            >
              Intentar nuevamente
            </Button>
            
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
          
          {errorStatus === '404' && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ¿Qué puedes hacer?
              </h3>
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                <Link 
                  to="/menu"
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ver Menú</h4>
                    <p className="text-sm text-gray-600">Explora nuestros platos</p>
                  </div>
                </Link>
                
                <Link 
                  to="/cart"
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mi Carrito</h4>
                    <p className="text-sm text-gray-600">Revisa tu pedido</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Contact Support */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm mb-4">
            ¿Necesitas ayuda? Contáctanos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a 
              href="tel:+1234567890"
              className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (555) 123-4567
            </a>
            
            <a 
              href="mailto:soporte@restaurante.com"
              className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              soporte@restaurante.com
            </a>
          </div>
        </div>
        
        {/* Development Info (only in development) */}
        {process.env.NODE_ENV === 'development' && displayError instanceof Error && (
          <details className="mt-8 text-left bg-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Detalles del Error (Solo en Desarrollo)
            </summary>
            <pre className="text-xs text-gray-600 overflow-auto">
              {displayError.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;

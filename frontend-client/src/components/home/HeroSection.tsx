import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface HeroSectionProps {
  /**
   * Título principal del hero
   */
  title?: string;
  
  /**
   * Subtítulo o descripción
   */
  subtitle?: string;
  
  /**
   * Imagen de fondo
   */
  backgroundImage?: string;
  
  /**
   * Mostrar botones de acción
   */
  showButtons?: boolean;
  
  /**
   * Texto del botón principal
   */
  primaryButtonText?: string;
  
  /**
   * URL del botón principal
   */
  primaryButtonUrl?: string;
  
  /**
   * Texto del botón secundario
   */
  secondaryButtonText?: string;
  
  /**
   * URL del botón secundario
   */
  secondaryButtonUrl?: string;
  
  /**
   * Mostrar highlights/características
   */
  showHighlights?: boolean;
  
  /**
   * Lista de características destacadas
   */
  highlights?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  
  /**
   * Altura de la sección
   */
  height?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente HeroSection - Sección principal de bienvenida
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Bienvenido a Nuestro Restaurante",
  subtitle = "Disfruta de los mejores sabores con ingredientes frescos y de la más alta calidad",
  backgroundImage = "/assets/images/hero-bg.jpg",
  showButtons = true,
  primaryButtonText = "Ver Menú",
  primaryButtonUrl = "/menu",
  secondaryButtonText = "Reservar Mesa",
  secondaryButtonUrl = "/reservas",
  showHighlights = true,
  highlights = [
    {
      icon: "🍽️",
      title: "Ingredientes Frescos",
      description: "Productos seleccionados diariamente"
    },
    {
      icon: "👨‍🍳",
      title: "Chefs Expertos",
      description: "Más de 15 años de experiencia"
    },
    {
      icon: "⭐",
      title: "Excelente Servicio",
      description: "Atención personalizada garantizada"
    }
  ],
  height = 'lg',
  className,
}) => {
  const getHeightClasses = () => {
    switch (height) {
      case 'sm': return 'h-96';
      case 'md': return 'h-[32rem]';
      case 'lg': return 'h-[40rem]';
      case 'xl': return 'h-[48rem]';
      case 'full': return 'h-screen';
      default: return 'h-[40rem]';
    }
  };

  return (
    <section 
      className={cn(
        'relative overflow-hidden bg-gray-900',
        getHeightClasses(),
        className
      )}
      aria-label="Sección principal"
    >
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Overlay para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Botones de acción */}
          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to={primaryButtonUrl}
                className={cn(
                  'inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg',
                  'bg-orange-500 text-white hover:bg-orange-600',
                  'transform hover:scale-105 transition-all duration-200',
                  'shadow-lg hover:shadow-xl',
                  'focus:outline-none focus:ring-4 focus:ring-orange-300'
                )}
              >
                <span>{primaryButtonText}</span>
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </Link>

              <Link
                to={secondaryButtonUrl}
                className={cn(
                  'inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg',
                  'bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-900',
                  'transform hover:scale-105 transition-all duration-200',
                  'shadow-lg hover:shadow-xl',
                  'focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50'
                )}
              >
                <span>{secondaryButtonText}</span>
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </Link>
            </div>
          )}

          {/* Características destacadas */}
          {showHighlights && highlights && highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className={cn(
                    'bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6',
                    'border border-white border-opacity-20',
                    'transform hover:scale-105 transition-all duration-200',
                    'hover:bg-opacity-20'
                  )}
                >
                  <div className="text-4xl mb-3">{highlight.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white opacity-70" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
import React from 'react';
import { cn } from '../../utils/cn';

export interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  external?: boolean;
  onClick?: () => void;
}

export type CTAVariant = 'default' | 'minimal' | 'centered';

export interface CallToActionProps {
  /**
   * Título principal
   */
  title?: string;
  
  /**
   * Subtítulo o descripción
   */
  subtitle?: string;
  
  /**
   * Variante del diseño
   */
  variant?: CTAVariant;
  
  /**
   * Botones de acción
   */
  buttons?: CTAButton[];
  
  /**
   * Imagen de fondo
   */
  backgroundImage?: string;
  
  /**
   * Color de fondo como fallback
   */
  backgroundColor?: string;
  
  /**
   * Lista de características destacadas
   */
  features?: string[];
  
  /**
   * Mostrar overlay oscuro sobre la imagen
   */
  showOverlay?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente CallToAction - Sección de llamada a la acción para conversiones
 */
export const CallToAction: React.FC<CallToActionProps> = ({
  title = "¿Listo para una experiencia única?",
  subtitle = "Reserva tu mesa ahora y descubre por qué somos el restaurante favorito de la ciudad",
  variant = "default",
  buttons = [
    {
      text: "Hacer Reserva",
      href: "/reservas",
      variant: "primary"
    },
    {
      text: "Ver Menú",
      href: "/menu",
      variant: "secondary"
    }
  ],
  backgroundImage,
  backgroundColor = "bg-orange-500",
  features = [],
  showOverlay = true,
  className,
}) => {
  const handleButtonClick = (button: CTAButton) => {
    if (button.onClick) {
      button.onClick();
    } else if (button.external) {
      window.open(button.href, '_blank');
    } else {
      window.location.href = button.href;
    }
  };

  const renderButton = (button: CTAButton, index: number) => {
    const baseClasses = "px-8 py-4 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variantClasses = {
      primary: "bg-white text-orange-600 hover:bg-gray-100 focus:ring-white",
      secondary: "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 border-2 border-orange-600",
      outline: "border-2 border-white text-white hover:bg-white hover:text-orange-600 focus:ring-white"
    };

    return (
      <button
        key={index}
        onClick={() => handleButtonClick(button)}
        className={cn(baseClasses, variantClasses[button.variant])}
      >
        {button.text}
      </button>
    );
  };

  const renderVariantDefault = () => (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title}
      </h2>
      <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
        {subtitle}
      </p>
      
      {features.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-white/80">
              <div className="text-sm md:text-base">✓ {feature}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {buttons.map((button, index) => renderButton(button, index))}
      </div>
    </div>
  );

  const renderVariantMinimal = () => (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        {title}
      </h2>
      <p className="text-white/90 mb-6 max-w-2xl mx-auto">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {buttons.slice(0, 2).map((button, index) => renderButton(button, index))}
      </div>
    </div>
  );

  const renderVariantCentered = () => (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
        {title}
      </h2>
      <p className="text-lg text-white/90 mb-8">
        {subtitle}
      </p>
      
      {features.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-center text-white/90">
              <span className="text-green-400 mr-3 text-xl">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        {buttons.map((button, index) => renderButton(button, index))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'minimal':
        return renderVariantMinimal();
      case 'centered':
        return renderVariantCentered();
      default:
        return renderVariantDefault();
    }
  };

  return (
    <section 
      className={cn(
        'relative py-16 md:py-24',
        !backgroundImage && backgroundColor,
        className
      )}
      style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
    >
      {/* Overlay */}
      {(backgroundImage && showOverlay) && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>

      {/* Decorative elements for default variant */}
      {variant === 'default' && (
        <>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
        </>
      )}
    </section>
  );
};

export default CallToAction;
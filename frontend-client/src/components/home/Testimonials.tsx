import React, { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  location?: string;
  verified?: boolean;
  source?: 'google' | 'facebook' | 'tripadvisor' | 'internal';
}

interface TestimonialsProps {
  /**
   * Título de la sección
   */
  title?: string;
  
  /**
   * Subtítulo de la sección
   */
  subtitle?: string;
  
  /**
   * Lista de testimonios
   */
  testimonials?: Testimonial[];
  
  /**
   * Número máximo de testimonios a mostrar
   */
  maxTestimonials?: number;
  
  /**
   * Autoplay del carousel
   */
  autoplay?: boolean;
  
  /**
   * Duración del autoplay en segundos
   */
  autoplayDuration?: number;
  
  /**
   * Layout de los testimonios
   */
  layout?: 'carousel' | 'grid' | 'masonry';
  
  /**
   * Mostrar controles de navegación
   */
  showNavigation?: boolean;
  
  /**
   * Mostrar indicadores
   */
  showDots?: boolean;
  
  /**
   * Mostrar fuente del testimonio
   */
  showSource?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente para mostrar un testimonio individual
 */
const TestimonialCard: React.FC<{ 
  testimonial: Testimonial; 
  showSource: boolean;
  compact?: boolean;
}> = ({ testimonial, showSource, compact = false }) => {
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={cn(
          'text-lg',
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        )}
      >
        ⭐
      </span>
    ));
  };

  const getSourceIcon = (source?: string) => {
    const icons = {
      google: '🔍',
      facebook: '📘',
      tripadvisor: '🦉',
      internal: '🏪'
    };
    return icons[source as keyof typeof icons] || '💬';
  };

  const getSourceColor = (source?: string) => {
    const colors = {
      google: 'bg-blue-100 text-blue-800',
      facebook: 'bg-blue-100 text-blue-800',
      tripadvisor: 'bg-green-100 text-green-800',
      internal: 'bg-gray-100 text-gray-800'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md p-6 h-full flex flex-col',
      'hover:shadow-lg transition-shadow duration-300',
      compact && 'p-4'
    )}>
      {/* Header con avatar y nombre */}
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 mr-3">
          {!imageError && testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className={cn(
                'rounded-full object-cover',
                compact ? 'w-10 h-10' : 'w-12 h-12'
              )}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={cn(
              'rounded-full bg-gray-300 flex items-center justify-center text-gray-600',
              compact ? 'w-10 h-10' : 'w-12 h-12'
            )}>
              <span className={compact ? 'text-sm' : 'text-lg'}>
                {testimonial.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn(
              'font-semibold text-gray-900 truncate',
              compact ? 'text-sm' : 'text-base'
            )}>
              {testimonial.name}
              {testimonial.verified && (
                <span className="ml-1 text-blue-500">✓</span>
              )}
            </h4>
            {showSource && testimonial.source && (
              <span className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                getSourceColor(testimonial.source)
              )}>
                {getSourceIcon(testimonial.source)}
              </span>
            )}
          </div>
          
          <div className="flex items-center mt-1">
            <div className="flex">
              {renderStars(testimonial.rating)}
            </div>
            <span className={cn(
              'ml-2 text-gray-500',
              compact ? 'text-xs' : 'text-sm'
            )}>
              {testimonial.rating}/5
            </span>
          </div>
          
          {testimonial.location && (
            <p className={cn(
              'text-gray-500 truncate',
              compact ? 'text-xs' : 'text-sm'
            )}>
              📍 {testimonial.location}
            </p>
          )}
        </div>
      </div>

      {/* Comentario */}
      <div className="flex-1">
        <blockquote className={cn(
          'text-gray-700 italic leading-relaxed',
          compact ? 'text-sm' : 'text-base'
        )}>
          "{testimonial.comment}"
        </blockquote>
      </div>

      {/* Fecha */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <time className={cn(
          'text-gray-500',
          compact ? 'text-xs' : 'text-sm'
        )}>
          {new Date(testimonial.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
      </div>
    </div>
  );
};

/**
 * Componente Testimonials - Muestra testimonios y reseñas de clientes
 */
export const Testimonials: React.FC<TestimonialsProps> = ({
  title = "Lo que Dicen Nuestros Clientes",
  subtitle = "Experiencias reales de personas que han disfrutado nuestros servicios",
  testimonials = [
    {
      id: '1',
      name: 'María García',
      rating: 5,
      comment: 'Excelente comida y servicio. El ambiente es muy acogedor y el personal súper atento. Definitivamente volveremos.',
      date: '2024-01-15',
      location: 'Ciudad de México',
      verified: true,
      source: 'google'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      rating: 5,
      comment: 'La mejor paella que he probado fuera de España. Los ingredientes frescos y la preparación impecable. ¡Muy recomendado!',
      date: '2024-01-10',
      location: 'Guadalajara',
      verified: true,
      source: 'tripadvisor'
    },
    {
      id: '3',
      name: 'Ana López',
      rating: 5,
      comment: 'Celebramos nuestro aniversario aquí y fue perfecto. La atención personalizada y los postres artesanales son increíbles.',
      date: '2024-01-08',
      location: 'Monterrey',
      verified: true,
      source: 'facebook'
    },
    {
      id: '4',
      name: 'Roberto Silva',
      rating: 4,
      comment: 'Muy buena experiencia gastronómica. Los precios son justos para la calidad que ofrecen. El ambiente familiar es lo que más me gustó.',
      date: '2024-01-05',
      location: 'Puebla',
      verified: false,
      source: 'internal'
    },
    {
      id: '5',
      name: 'Isabel Torres',
      rating: 5,
      comment: 'Lugar perfecto para una cena romántica. La iluminación, la música y por supuesto, la comida, todo de primera calidad.',
      date: '2024-01-03',
      location: 'Tijuana',
      verified: true,
      source: 'google'
    },
    {
      id: '6',
      name: 'Miguel Hernández',
      rating: 5,
      comment: 'Como chef, puedo decir que la preparación y presentación de los platos es excepcional. Técnica y sabor en cada bocado.',
      date: '2024-01-01',
      location: 'Mérida',
      verified: true,
      source: 'tripadvisor'
    }
  ],
  maxTestimonials = 6,
  autoplay = true,
  autoplayDuration = 5,
  layout = 'carousel',
  showNavigation = true,
  showDots = true,
  showSource = true,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayActive, setIsAutoplayActive] = useState(autoplay);

  const displayTestimonials = testimonials.slice(0, maxTestimonials);
  const totalSlides = layout === 'carousel' ? Math.ceil(displayTestimonials.length / 3) : 0;

  // Autoplay effect
  useEffect(() => {
    if (!isAutoplayActive || layout !== 'carousel') return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, autoplayDuration * 1000);

    return () => clearInterval(interval);
  }, [isAutoplayActive, totalSlides, autoplayDuration, layout]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setIsAutoplayActive(false);
  };

  const handleMouseLeave = () => {
    setIsAutoplayActive(autoplay);
  };

  const getVisibleTestimonials = () => {
    if (layout !== 'carousel') return displayTestimonials;
    
    const itemsPerSlide = 3;
    const start = currentIndex * itemsPerSlide;
    return displayTestimonials.slice(start, start + itemsPerSlide);
  };

  const averageRating = displayTestimonials.reduce((acc, t) => acc + t.rating, 0) / displayTestimonials.length;

  return (
    <section className={cn('py-16 bg-gray-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {subtitle}
          </p>
          
          {/* Estadísticas de reseñas */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">⭐</span>
              <span className="font-semibold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="ml-1">de 5</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                {displayTestimonials.length}
              </span>
              <span className="ml-1">reseñas</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">
                {displayTestimonials.filter(t => t.verified).length}
              </span>
              <span className="ml-1">verificadas</span>
            </div>
          </div>
        </div>

        {/* Contenido de testimonios */}
        {layout === 'carousel' ? (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getVisibleTestimonials().map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    showSource={showSource}
                  />
                ))}
              </div>
            </div>

            {/* Controles de navegación */}
            {showNavigation && totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Testimonio anterior"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Siguiente testimonio"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Indicadores */}
            {showDots && totalSlides > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={cn(
                      'w-3 h-3 rounded-full transition-colors duration-200',
                      currentIndex === i
                        ? 'bg-orange-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Ir al slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                showSource={showSource}
              />
            ))}
          </div>
        ) : (
          // Masonry layout
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="break-inside-avoid">
                <TestimonialCard
                  testimonial={testimonial}
                  showSource={showSource}
                  compact
                />
              </div>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ¿Ya probaste nuestros servicios?
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            <span>Deja tu Reseña</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
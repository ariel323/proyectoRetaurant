import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { RatingStars } from './RatingStars';

interface ReviewUser {
  id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
}

interface ReviewData {
  id: string;
  user: ReviewUser;
  rating: number;
  title?: string;
  content: string;
  date: Date | string;
  images?: string[];
  likes?: number;
  dislikes?: number;
  isHelpful?: boolean;
  isReported?: boolean;
  response?: {
    content: string;
    date: Date | string;
    author: string;
  };
  tags?: string[];
  verified?: boolean;
}

interface ReviewCardProps {
  /**
   * Datos de la reseña
   */
  review: ReviewData;
  
  /**
   * Función que se ejecuta al hacer like
   */
  onLike?: (reviewId: string) => void;
  
  /**
   * Función que se ejecuta al hacer dislike
   */
  onDislike?: (reviewId: string) => void;
  
  /**
   * Función que se ejecuta al reportar
   */
  onReport?: (reviewId: string) => void;
  
  /**
   * Función que se ejecuta al responder
   */
  onReply?: (reviewId: string) => void;
  
  /**
   * Función que se ejecuta al hacer clic en una imagen
   */
  onImageClick?: (imageUrl: string, images: string[]) => void;
  
  /**
   * Función que se ejecuta al hacer clic en el usuario
   */
  onUserClick?: (userId: string) => void;
  
  /**
   * Mostrar acciones (like, dislike, etc.)
   */
  showActions?: boolean;
  
  /**
   * Mostrar respuesta del establecimiento
   */
  showResponse?: boolean;
  
  /**
   * Mostrar imágenes
   */
  showImages?: boolean;
  
  /**
   * Mostrar tags
   */
  showTags?: boolean;
  
  /**
   * Mostrar fecha relativa
   */
  showRelativeDate?: boolean;
  
  /**
   * Variante del diseño
   */
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  
  /**
   * Tamaño de la tarjeta
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Deshabilitar interacciones
   */
  disabled?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

/**
 * Componente ReviewCard - Tarjeta para mostrar reseñas de usuarios
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onLike,
  onDislike,
  onReport,
  onReply,
  onImageClick,
  onUserClick,
  showActions = true,
  showResponse = true,
  showImages = true,
  showTags = true,
  showRelativeDate = true,
  variant = 'default',
  size = 'md',
  disabled = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (showRelativeDate) {
      const now = new Date();
      const diffInMs = now.getTime() - dateObj.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Hoy';
      if (diffInDays === 1) return 'Ayer';
      if (diffInDays < 7) return `Hace ${diffInDays} días`;
      if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
      if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
      return `Hace ${Math.floor(diffInDays / 365)} años`;
    }
    
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'p-3 text-sm';
      case 'md': return 'p-4 text-base';
      case 'lg': return 'p-6 text-lg';
      default: return 'p-4 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'border-l-4 border-l-blue-500 bg-gray-50 rounded-r-lg';
      case 'detailed':
        return 'border border-gray-200 rounded-xl shadow-lg bg-white';
      case 'minimal':
        return 'border-b border-gray-100 pb-4';
      case 'default':
      default:
        return 'border border-gray-200 rounded-lg bg-white shadow-sm';
    }
  };

  const handleImageClick = (imageUrl: string) => {
    onImageClick?.(imageUrl, review.images || []);
  };

  const shouldTruncateContent = variant === 'compact' && review.content.length > 150;
  const displayContent = shouldTruncateContent && !isExpanded 
    ? `${review.content.substring(0, 150)}...`
    : review.content;

  return (
    <article 
      className={cn(
        'transition-all duration-200',
        getSizeClasses(),
        getVariantClasses(),
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      aria-label={`Reseña de ${review.user.name}`}
    >
      {/* Header */}
      <header className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar del usuario */}
          <button
            onClick={() => onUserClick?.(review.user.id)}
            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            disabled={disabled}
          >
            {review.user.avatar ? (
              <img
                src={review.user.avatar}
                alt={`Avatar de ${review.user.name}`}
                className={cn(
                  'rounded-full object-cover',
                  size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'
                )}
              />
            ) : (
              <div 
                className={cn(
                  'rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium',
                  size === 'sm' ? 'w-8 h-8 text-sm' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-10 h-10'
                )}
              >
                {review.user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          {/* Información del usuario */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 truncate">
                {review.user.name}
              </h3>
              {review.user.isVerified && (
                <span className="inline-flex items-center text-blue-500" title="Usuario verificado">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </span>
              )}
              {review.verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Compra verificada
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <RatingStars
                value={review.rating}
                readOnly
                size={size === 'sm' ? 'xs' : 'sm'}
                color="yellow"
              />
              <span className="text-sm text-gray-500">
                {formatDate(review.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones del header */}
        {showActions && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onReport?.(review.id)}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              title="Reportar reseña"
              disabled={disabled}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </button>
          </div>
        )}
      </header>

      {/* Título de la reseña */}
      {review.title && variant !== 'minimal' && (
        <h4 className="font-medium text-gray-900 mb-2">
          {review.title}
        </h4>
      )}

      {/* Contenido de la reseña */}
      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        
        {shouldTruncateContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-1 focus:outline-none focus:underline"
            disabled={disabled}
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* Imágenes */}
      {showImages && review.images && review.images.length > 0 && (
        <div className="mb-3">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {review.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(image)}
                className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg overflow-hidden"
                disabled={disabled}
              >
                <img
                  src={image}
                  alt={`Imagen ${index + 1} de la reseña`}
                  className="w-16 h-16 object-cover hover:scale-105 transition-transform duration-200"
                />
                {index === 3 && review.images && review.images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs font-medium">
                    +{review.images.length - 4}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {showTags && review.tags && review.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {review.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Acciones principales */}
      {showActions && (
        <footer className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* Like/Dislike */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLike?.(review.id)}
                className={cn(
                  'flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  review.isHelpful 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'
                )}
                disabled={disabled}
                title="Marcar como útil"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
                <span>{review.likes || 0}</span>
              </button>

              <button
                onClick={() => onDislike?.(review.id)}
                className={cn(
                  'flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  'text-gray-500 hover:bg-gray-100 hover:text-red-600'
                )}
                disabled={disabled}
                title="No útil"
              >
                <svg className="w-4 h-4 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
                <span>{review.dislikes || 0}</span>
              </button>
            </div>
          </div>

          {/* Responder */}
          <button
            onClick={() => onReply?.(review.id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            disabled={disabled}
          >
            Responder
          </button>
        </footer>
      )}

      {/* Respuesta del establecimiento */}
      {showResponse && review.response && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <span className="font-medium text-blue-900">
              Respuesta de {review.response.author}
            </span>
            <span className="text-sm text-blue-700">
              {formatDate(review.response.date)}
            </span>
          </div>
          <p className="text-blue-800 leading-relaxed">
            {review.response.content}
          </p>
        </div>
      )}
    </article>
  );
};

export default ReviewCard;

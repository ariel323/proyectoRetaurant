// Feedback Components
export { FeedbackButton } from './FeedbackButton';
export { RatingStars } from './RatingStars';
export { ReviewCard } from './ReviewCard';
export { ReviewForm } from './ReviewForm';
export { ReviewsList } from './ReviewsList';

// Hooks
export { useFeedbackButton } from './FeedbackButton';
export { useRatingStars } from './RatingStars';

// Note: Type definitions are available within each component file
// Import the components directly to access their prop types

// Utility functions for feedback components
export const feedbackUtils = {
  /**
   * Formatea una calificación numérica
   */
  formatRating: (rating: number, decimals: number = 1): string => {
    return rating.toFixed(decimals);
  },

  /**
   * Convierte una calificación a porcentaje
   */
  ratingToPercentage: (rating: number, maxRating: number = 5): number => {
    return Math.min(100, Math.max(0, (rating / maxRating) * 100));
  },

  /**
   * Obtiene una descripción textual de la calificación
   */
  getRatingDescription: (rating: number): string => {
    if (rating >= 4.5) return 'Excelente';
    if (rating >= 3.5) return 'Muy bueno';
    if (rating >= 2.5) return 'Bueno';
    if (rating >= 1.5) return 'Regular';
    if (rating >= 0.5) return 'Malo';
    return 'Sin calificación';
  },

  /**
   * Calcula el promedio de calificaciones
   */
  calculateAverageRating: (ratings: number[]): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return sum / ratings.length;
  },

  /**
   * Obtiene la distribución de calificaciones
   */
  getRatingDistribution: (ratings: number[], maxRating: number = 5) => {
    const distribution = Array.from({ length: maxRating }, (_, i) => ({
      rating: maxRating - i,
      count: 0,
      percentage: 0,
    }));

    ratings.forEach(rating => {
      const index = maxRating - Math.ceil(rating);
      if (index >= 0 && index < distribution.length) {
        distribution[index].count++;
      }
    });

    const total = ratings.length;
    distribution.forEach(item => {
      item.percentage = total > 0 ? (item.count / total) * 100 : 0;
    });

    return distribution;
  },

  /**
   * Valida una calificación
   */
  validateRating: (rating: number, minRating: number = 1, maxRating: number = 5): boolean => {
    return rating >= minRating && rating <= maxRating && Number.isFinite(rating);
  },

  /**
   * Formatea una fecha de reseña
   */
  formatReviewDate: (date: Date | string, options?: {
    relative?: boolean;
    locale?: string;
  }): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const { relative = true, locale = 'es-ES' } = options || {};

    if (relative) {
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
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Trunca el contenido de una reseña
   */
  truncateReviewContent: (content: string, maxLength: number = 150): {
    text: string;
    isTruncated: boolean;
  } => {
    if (content.length <= maxLength) {
      return { text: content, isTruncated: false };
    }
    
    const truncated = content.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    const finalText = lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) : truncated;
    
    return { text: `${finalText}...`, isTruncated: true };
  },

  /**
   * Genera colores para tags de reseñas
   */
  getTagColor: (tag: string): { bg: string; text: string } => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800' },
      { bg: 'bg-green-100', text: 'text-green-800' },
      { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      { bg: 'bg-purple-100', text: 'text-purple-800' },
      { bg: 'bg-pink-100', text: 'text-pink-800' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      { bg: 'bg-red-100', text: 'text-red-800' },
      { bg: 'bg-orange-100', text: 'text-orange-800' },
    ];
    
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  },

  /**
   * Valida un archivo de imagen
   */
  validateImageFile: (file: File, options?: {
    maxSize?: number; // En MB
    allowedTypes?: string[];
  }): { isValid: boolean; error?: string } => {
    const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options || {};
    
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(', ')}`
      };
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `El archivo es demasiado grande. Máximo ${maxSize}MB`
      };
    }
    
    return { isValid: true };
  },

  /**
   * Genera un resumen de estadísticas de reseñas
   */
  generateReviewStats: (reviews: { rating: number; likes?: number; date: Date | string }[]) => {
    const total = reviews.length;
    const averageRating = total > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total 
      : 0;
    
    const totalLikes = reviews.reduce((sum, review) => sum + (review.likes || 0), 0);
    
    const recentReviews = reviews.filter(review => {
      const reviewDate = typeof review.date === 'string' ? new Date(review.date) : review.date;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reviewDate >= thirtyDaysAgo;
    }).length;

    const distribution = feedbackUtils.getRatingDistribution(reviews.map(r => r.rating));

    return {
      totalReviews: total,
      averageRating: Math.round(averageRating * 10) / 10,
      totalLikes,
      recentReviews,
      distribution,
      hasReviews: total > 0,
    };
  },
};

// Constants
export const FEEDBACK_CONSTANTS = {
  RATING: {
    MIN: 1,
    MAX: 5,
    DEFAULT: 0,
  },
  CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
    TRUNCATE_LENGTH: 150,
  },
  IMAGES: {
    MAX_COUNT: 5,
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
  TAGS: {
    MAX_LENGTH: 30,
    MAX_COUNT: 10,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
} as const;

// Common feedback-related types
export interface FeedbackConfig {
  enableLikes: boolean;
  enableDislikes: boolean;
  enableComments: boolean;
  enableRatings: boolean;
  enableImages: boolean;
  enableTags: boolean;
  enableAnonymous: boolean;
  requireLogin: boolean;
  moderationEnabled: boolean;
}

export interface FeedbackMetrics {
  totalFeedback: number;
  averageRating: number;
  totalLikes: number;
  totalDislikes: number;
  responseRate: number;
  satisfactionScore: number;
}

// Default configurations
export const defaultFeedbackConfig: FeedbackConfig = {
  enableLikes: true,
  enableDislikes: true,
  enableComments: true,
  enableRatings: true,
  enableImages: true,
  enableTags: true,
  enableAnonymous: false,
  requireLogin: true,
  moderationEnabled: true,
};

// Note: All components and utilities are available as named exports
// Example usage: import { FeedbackButton, feedbackUtils } from './components/feedback';

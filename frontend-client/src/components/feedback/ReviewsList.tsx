import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { ReviewCard } from './ReviewCard';
import { RatingStars } from './RatingStars';

interface ReviewData {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
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

interface ReviewsListProps {
  /**
   * Lista de reseñas
   */
  reviews: ReviewData[];
  
  /**
   * Estado de carga
   */
  loading?: boolean;
  
  /**
   * Función para cargar más reseñas
   */
  onLoadMore?: () => void;
  
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
   * Mostrar filtros
   */
  showFilters?: boolean;
  
  /**
   * Mostrar estadísticas
   */
  showStats?: boolean;
  
  /**
   * Mostrar paginación
   */
  showPagination?: boolean;
  
  /**
   * Permitir filtro por calificación
   */
  allowRatingFilter?: boolean;
  
  /**
   * Permitir ordenamiento
   */
  allowSorting?: boolean;
  
  /**
   * Permitir búsqueda
   */
  allowSearch?: boolean;
  
  /**
   * Número de reseñas por página
   */
  pageSize?: number;
  
  /**
   * Página actual
   */
  currentPage?: number;
  
  /**
   * Total de páginas
   */
  totalPages?: number;
  
  /**
   * Función para cambiar página
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Variante del diseño
   */
  variant?: 'default' | 'compact' | 'detailed';
  
  /**
   * Texto cuando no hay reseñas
   */
  emptyText?: string;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1';

/**
 * Componente ReviewsList - Lista de reseñas con filtros y paginación
 */
export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  loading = false,
  onLoadMore,
  onLike,
  onDislike,
  onReport,
  onReply,
  onImageClick,
  onUserClick,
  showFilters = true,
  showStats = true,
  showPagination = true,
  allowRatingFilter = true,
  allowSorting = true,
  allowSearch = true,
  pageSize = 10,
  currentPage = 1,
  totalPages,
  onPageChange,
  variant = 'default',
  emptyText = 'No hay reseñas disponibles',
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
    
    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(review => review.rating === rating).length,
      percentage: totalReviews > 0 
        ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 
        : 0
    }));

    return {
      totalReviews,
      averageRating,
      ratingDistribution
    };
  }, [reviews]);

  // Filtrar y ordenar reseñas
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(review => 
        review.content.toLowerCase().includes(term) ||
        review.title?.toLowerCase().includes(term) ||
        review.user.name.toLowerCase().includes(term) ||
        review.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filtrar por calificación
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Ordenar
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [reviews, searchTerm, ratingFilter, sortBy]);

  // Paginación
  const paginatedReviews = useMemo(() => {
    if (!showPagination) return filteredAndSortedReviews;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedReviews.slice(startIndex, endIndex);
  }, [filteredAndSortedReviews, currentPage, pageSize, showPagination]);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, []);

  const handleRatingFilterChange = useCallback((newFilter: RatingFilter) => {
    setRatingFilter(newFilter);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const getSortOptions = () => [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'highest', label: 'Mayor calificación' },
    { value: 'lowest', label: 'Menor calificación' },
    { value: 'helpful', label: 'Más útiles' },
  ];

  const getRatingFilterOptions = () => [
    { value: 'all', label: 'Todas las calificaciones' },
    { value: '5', label: '5 estrellas' },
    { value: '4', label: '4 estrellas' },
    { value: '3', label: '3 estrellas' },
    { value: '2', label: '2 estrellas' },
    { value: '1', label: '1 estrella' },
  ];

  if (loading && reviews.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Estadísticas */}
      {showStats && stats.totalReviews > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calificación promedio */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </div>
                <RatingStars
                  value={Math.round(stats.averageRating)}
                  readOnly
                  size="sm"
                  color="yellow"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {stats.totalReviews} reseña{stats.totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Distribución de calificaciones */}
            <div className="space-y-2">
              {stats.ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm font-medium w-8">{rating}</span>
                  <RatingStars
                    value={1}
                    maxRating={1}
                    readOnly
                    size="xs"
                    color="yellow"
                  />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtros y controles */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            {allowSearch && (
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Buscar en reseñas..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Filtro por calificación */}
            {allowRatingFilter && (
              <div>
                <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Calificación
                </label>
                <select
                  id="rating-filter"
                  value={ratingFilter}
                  onChange={(e) => handleRatingFilterChange(e.target.value as RatingFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getRatingFilterOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ordenamiento */}
            {allowSorting && (
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getSortOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Resumen de filtros */}
          {(searchTerm || ratingFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Mostrando {filteredAndSortedReviews.length} de {reviews.length} reseñas
                </span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRatingFilter('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {paginatedReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {emptyText}
            </h3>
            <p className="text-gray-500">
              {searchTerm || ratingFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Sé el primero en escribir una reseña'
              }
            </p>
          </div>
        ) : (
          paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onLike={onLike}
              onDislike={onDislike}
              onReport={onReport}
              onReply={onReply}
              onImageClick={onImageClick}
              onUserClick={onUserClick}
              variant={variant}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      {showPagination && totalPages && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{' '}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * pageSize + 1, filteredAndSortedReviews.length)}
                </span>{' '}
                a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredAndSortedReviews.length)}
                </span>{' '}
                de{' '}
                <span className="font-medium">{filteredAndSortedReviews.length}</span>{' '}
                resultados
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Números de página */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange?.(page)}
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Cargar más */}
      {onLoadMore && !showPagination && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cargando...
              </>
            ) : (
              'Cargar más reseñas'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;

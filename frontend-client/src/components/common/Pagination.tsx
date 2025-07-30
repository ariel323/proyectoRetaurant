import React from 'react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  /**
   * Página actual (1-indexed)
   */
  currentPage: number;
  
  /**
   * Total de páginas
   */
  totalPages: number;
  
  /**
   * Función que se ejecuta al cambiar página
   */
  onPageChange: (page: number) => void;
  
  /**
   * Elementos por página
   */
  itemsPerPage?: number;
  
  /**
   * Total de elementos
   */
  totalItems?: number;
  
  /**
   * Número máximo de páginas visibles
   */
  maxVisiblePages?: number;
  
  /**
   * Mostrar controles de navegación (anterior/siguiente)
   */
  showNavigation?: boolean;
  
  /**
   * Mostrar información de elementos
   */
  showItemsInfo?: boolean;
  
  /**
   * Mostrar selector de elementos por página
   */
  showPageSizeSelector?: boolean;
  
  /**
   * Opciones para elementos por página
   */
  pageSizeOptions?: number[];
  
  /**
   * Función para cambiar elementos por página
   */
  onPageSizeChange?: (pageSize: number) => void;
  
  /**
   * Tamaño de los botones
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'minimal' | 'rounded' | 'outlined';
  
  /**
   * Posición de los controles
   */
  alignment?: 'left' | 'center' | 'right';
  
  /**
   * Deshabilitar toda la paginación
   */
  disabled?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Texto personalizado para los botones
   */
  labels?: {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    of?: string;
    items?: string;
    itemsPerPage?: string;
  };
}

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  size?: PaginationProps['size'];
  variant?: PaginationProps['variant'];
  className?: string;
}

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  labels?: PaginationProps['labels'];
  className?: string;
}

interface PaginationSelectorProps {
  pageSize: number;
  options: number[];
  onPageSizeChange: (size: number) => void;
  labels?: PaginationProps['labels'];
  disabled?: boolean;
  className?: string;
}

/**
 * Botón de paginación reutilizable
 */
const PaginationButton: React.FC<PaginationButtonProps> = ({
  children,
  onClick,
  isActive = false,
  disabled = false,
  size = 'md',
  variant = 'default',
  className,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs min-w-[32px] h-8';
      case 'md': return 'px-3 py-2 text-sm min-w-[40px] h-10';
      case 'lg': return 'px-4 py-2 text-base min-w-[48px] h-12';
      default: return 'px-3 py-2 text-sm min-w-[40px] h-10';
    }
  };

  const getVariantClasses = () => {
    if (isActive) {
      switch (variant) {
        case 'minimal':
          return 'bg-blue-600 text-white';
        case 'rounded':
          return 'bg-blue-600 text-white rounded-full';
        case 'outlined':
          return 'bg-blue-600 text-white border-blue-600';
        default:
          return 'bg-blue-600 text-white';
      }
    }

    switch (variant) {
      case 'minimal':
        return 'text-gray-700 hover:bg-gray-100';
      case 'rounded':
        return 'text-gray-700 hover:bg-gray-100 rounded-full';
      case 'outlined':
        return 'text-gray-700 border border-gray-300 hover:bg-gray-50';
      default:
        return 'text-gray-700 hover:bg-gray-100 border border-gray-300';
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        variant !== 'rounded' && 'rounded-md',
        getSizeClasses(),
        getVariantClasses(),
        className
      )}
    >
      {children}
    </button>
  );
};

/**
 * Información de paginación
 */
const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  labels = {},
  className,
}) => {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('text-sm text-gray-700', className)}>
      Mostrando {startItem} - {endItem} {labels.of || 'de'} {totalItems} {labels.items || 'elementos'}
    </div>
  );
};

/**
 * Selector de elementos por página
 */
const PaginationSelector: React.FC<PaginationSelectorProps> = ({
  pageSize,
  options,
  onPageSizeChange,
  labels = {},
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <label htmlFor="page-size" className="text-sm text-gray-700">
        {labels.itemsPerPage || 'Elementos por página:'}
      </label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        disabled={disabled}
        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Componente Pagination - Navegación por páginas con controles completos
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  maxVisiblePages = 7,
  showNavigation = true,
  showItemsInfo = true,
  showPageSizeSelector = false,
  pageSizeOptions = [5, 10, 20, 50, 100],
  onPageSizeChange,
  size = 'md',
  variant = 'default',
  alignment = 'center',
  disabled = false,
  className,
  labels = {},
}) => {
  // Validaciones
  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));

  // Calcular páginas visibles
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (safeTotalPages <= maxVisiblePages) {
      // Mostrar todas las páginas
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con elipsis
      const sidePages = Math.floor((maxVisiblePages - 3) / 2); // -3 para primera, última y elipsis
      
      if (safeCurrentPage <= sidePages + 2) {
        // Cerca del inicio
        for (let i = 1; i <= maxVisiblePages - 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      } else if (safeCurrentPage >= safeTotalPages - sidePages - 1) {
        // Cerca del final
        pages.push(1);
        pages.push('...');
        for (let i = safeTotalPages - maxVisiblePages + 3; i <= safeTotalPages; i++) {
          pages.push(i);
        }
      } else {
        // En el medio
        pages.push(1);
        pages.push('...');
        for (let i = safeCurrentPage - sidePages; i <= safeCurrentPage + sidePages; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(safeTotalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageChange = (page: number) => {
    if (page !== safeCurrentPage && page >= 1 && page <= safeTotalPages && !disabled) {
      onPageChange(page);
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      case 'center': return 'justify-center';
      default: return 'justify-center';
    }
  };

  if (safeTotalPages <= 1 && !showItemsInfo && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      {/* Información superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        {showItemsInfo && totalItems > 0 && (
          <PaginationInfo
            currentPage={safeCurrentPage}
            totalPages={safeTotalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            labels={labels}
          />
        )}
        
        {showPageSizeSelector && onPageSizeChange && (
          <PaginationSelector
            pageSize={itemsPerPage}
            options={pageSizeOptions}
            onPageSizeChange={onPageSizeChange}
            labels={labels}
            disabled={disabled}
          />
        )}
      </div>

      {/* Controles de paginación */}
      {safeTotalPages > 1 && (
        <div className={cn('flex items-center space-x-1', getAlignmentClasses())}>
          {/* Botón Primera página */}
          {showNavigation && (
            <PaginationButton
              onClick={() => handlePageChange(1)}
              disabled={disabled || safeCurrentPage === 1}
              size={size}
              variant={variant}
              className="mr-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
              <span className="sr-only">{labels.first || 'Primera página'}</span>
            </PaginationButton>
          )}

          {/* Botón Anterior */}
          {showNavigation && (
            <PaginationButton
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={disabled || safeCurrentPage === 1}
              size={size}
              variant={variant}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">{labels.previous || 'Página anterior'}</span>
            </PaginationButton>
          )}

          {/* Números de página */}
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === 'number' ? (
                <PaginationButton
                  onClick={() => handlePageChange(page)}
                  isActive={page === safeCurrentPage}
                  disabled={disabled}
                  size={size}
                  variant={variant}
                >
                  {page}
                </PaginationButton>
              ) : (
                <span className="px-2 py-2 text-gray-500">
                  {page}
                </span>
              )}
            </React.Fragment>
          ))}

          {/* Botón Siguiente */}
          {showNavigation && (
            <PaginationButton
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={disabled || safeCurrentPage === safeTotalPages}
              size={size}
              variant={variant}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="sr-only">{labels.next || 'Página siguiente'}</span>
            </PaginationButton>
          )}

          {/* Botón Última página */}
          {showNavigation && (
            <PaginationButton
              onClick={() => handlePageChange(safeTotalPages)}
              disabled={disabled || safeCurrentPage === safeTotalPages}
              size={size}
              variant={variant}
              className="ml-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span className="sr-only">{labels.last || 'Última página'}</span>
            </PaginationButton>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Hook para gestionar paginación
 */
export const usePagination = (
  totalItems: number,
  initialItemsPerPage: number = 10,
  initialPage: number = 1
) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = React.useState(initialItemsPerPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const handlePageSizeChange = React.useCallback((newPageSize: number) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handlePageSizeChange,
    setCurrentPage,
    setItemsPerPage,
  };
};

export default Pagination;
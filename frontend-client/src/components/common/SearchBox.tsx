import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface SearchBoxProps {
  /**
   * Valor del campo de búsqueda
   */
  value?: string;
  
  /**
   * Función que se ejecuta al cambiar el valor
   */
  onChange?: (value: string) => void;
  
  /**
   * Función que se ejecuta al enviar la búsqueda
   */
  onSearch?: (value: string) => void;
  
  /**
   * Función que se ejecuta al limpiar la búsqueda
   */
  onClear?: () => void;
  
  /**
   * Placeholder del input
   */
  placeholder?: string;
  
  /**
   * Tamaño del campo de búsqueda
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variante de estilo
   */
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  
  /**
   * Mostrar botón de búsqueda
   */
  showSearchButton?: boolean;
  
  /**
   * Mostrar botón de limpiar
   */
  showClearButton?: boolean;
  
  /**
   * Icono personalizado de búsqueda
   */
  searchIcon?: React.ReactNode;
  
  /**
   * Búsqueda automática mientras se escribe
   */
  autoSearch?: boolean;
  
  /**
   * Delay para la búsqueda automática (ms)
   */
  searchDelay?: number;
  
  /**
   * Longitud mínima para activar búsqueda automática
   */
  minSearchLength?: number;
  
  /**
   * Sugerencias de búsqueda
   */
  suggestions?: string[];
  
  /**
   * Mostrar sugerencias
   */
  showSuggestions?: boolean;
  
  /**
   * Función para filtrar sugerencias
   */
  filterSuggestions?: (suggestions: string[], query: string) => string[];
  
  /**
   * Función que se ejecuta al seleccionar una sugerencia
   */
  onSuggestionSelect?: (suggestion: string) => void;
  
  /**
   * Deshabilitar el campo
   */
  disabled?: boolean;
  
  /**
   * Estado de carga
   */
  loading?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
  
  /**
   * Clases CSS para el input
   */
  inputClassName?: string;
  
  /**
   * Props adicionales para el input
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

interface SearchSuggestionsProps {
  suggestions: string[];
  query: string;
  onSelect: (suggestion: string) => void;
  highlightQuery?: boolean;
  className?: string;
}

/**
 * Componente para mostrar sugerencias de búsqueda
 */
const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  query,
  onSelect,
  highlightQuery = true,
  className,
}) => {
  if (suggestions.length === 0) return null;

  const highlightText = (text: string, highlight: string) => {
    if (!highlightQuery || !highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => (
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    ));
  };

  return (
    <div className={cn(
      'absolute top-full left-0 right-0 z-50 mt-1',
      'bg-white border border-gray-300 rounded-md shadow-lg',
      'max-h-60 overflow-y-auto',
      className
    )}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(suggestion)}
          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-md last:rounded-b-md"
        >
          {highlightText(suggestion, query)}
        </button>
      ))}
    </div>
  );
};

/**
 * Componente SearchBox - Campo de búsqueda con funcionalidades avanzadas
 */
export const SearchBox: React.FC<SearchBoxProps> = ({
  value = '',
  onChange,
  onSearch,
  onClear,
  placeholder = 'Buscar...',
  size = 'md',
  variant = 'default',
  showSearchButton = false,
  showClearButton = true,
  searchIcon,
  autoSearch = false,
  searchDelay = 300,
  minSearchLength = 2,
  suggestions = [],
  showSuggestions = false,
  filterSuggestions,
  onSuggestionSelect,
  disabled = false,
  loading = false,
  className,
  inputClassName,
  inputProps,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar valor interno con prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Manejar búsqueda automática
  useEffect(() => {
    if (autoSearch && internalValue.length >= minSearchLength) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        onSearch?.(internalValue);
      }, searchDelay);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [internalValue, autoSearch, minSearchLength, searchDelay, onSearch]);

  // Filtrar sugerencias
  useEffect(() => {
    if (showSuggestions && internalValue) {
      const filtered = filterSuggestions
        ? filterSuggestions(suggestions, internalValue)
        : suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(internalValue.toLowerCase())
          );
      setFilteredSuggestions(filtered);
      setShowSuggestionsDropdown(filtered.length > 0);
    } else {
      setShowSuggestionsDropdown(false);
    }
  }, [internalValue, suggestions, showSuggestions, filterSuggestions]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestionsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 text-sm';
      case 'md': return 'h-10 text-sm';
      case 'lg': return 'h-12 text-base';
      default: return 'h-10 text-sm';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'border-2 border-gray-300 bg-transparent focus:border-blue-500';
      case 'filled':
        return 'border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500';
      case 'minimal':
        return 'border-0 border-b-2 border-gray-300 bg-transparent rounded-none focus:border-blue-500';
      default:
        return 'border border-gray-300 bg-white focus:border-blue-500';
    }
  };

  const getPaddingClasses = () => {
    const hasLeftIcon = searchIcon || !showSearchButton;
    const hasRightIcon = showClearButton || showSearchButton || loading;
    
    let leftPadding = '';
    let rightPadding = '';

    if (size === 'sm') {
      leftPadding = hasLeftIcon ? 'pl-8' : 'pl-3';
      rightPadding = hasRightIcon ? 'pr-8' : 'pr-3';
    } else if (size === 'lg') {
      leftPadding = hasLeftIcon ? 'pl-12' : 'pl-4';
      rightPadding = hasRightIcon ? 'pr-12' : 'pr-4';
    } else {
      leftPadding = hasLeftIcon ? 'pl-10' : 'pl-3';
      rightPadding = hasRightIcon ? 'pr-10' : 'pr-3';
    }

    return `${leftPadding} ${rightPadding}`;
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-6 h-6';
      default: return 'w-5 h-5';
    }
  };

  const getIconPosition = () => {
    switch (size) {
      case 'sm': return { left: '8px', right: '8px' };
      case 'lg': return { left: '12px', right: '12px' };
      default: return { left: '10px', right: '10px' };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleSearch = () => {
    onSearch?.(internalValue);
    setShowSuggestionsDropdown(false);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onClear?.();
    setShowSuggestionsDropdown(false);
    inputRef.current?.focus();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInternalValue(suggestion);
    onChange?.(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestionsDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestionsDropdown(false);
      inputRef.current?.blur();
    }
  };

  const iconPosition = getIconPosition();

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        {/* Input field */}
        <input
          {...inputProps}
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => showSuggestions && setShowSuggestionsDropdown(filteredSuggestions.length > 0)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full rounded-md transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            getSizeClasses(),
            getVariantClasses(),
            getPaddingClasses(),
            inputClassName
          )}
        />

        {/* Search icon (left) */}
        {(searchIcon || !showSearchButton) && (
          <div 
            className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
            style={{ left: iconPosition.left }}
          >
            {searchIcon || (
              <svg className={cn('text-gray-400', getIconSize())} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        )}

        {/* Right side icons */}
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1" style={{ right: iconPosition.right }}>
          {/* Loading spinner */}
          {loading && (
            <div className={cn('animate-spin text-gray-400', getIconSize())}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          )}

          {/* Clear button */}
          {showClearButton && internalValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50"
            >
              <svg className={getIconSize()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Search button */}
          {showSearchButton && (
            <button
              type="button"
              onClick={handleSearch}
              disabled={disabled || loading}
              className="text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50"
            >
              <svg className={getIconSize()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestionsDropdown && (
        <SearchSuggestions
          suggestions={filteredSuggestions}
          query={internalValue}
          onSelect={handleSuggestionSelect}
        />
      )}
    </div>
  );
};

/**
 * Hook para gestionar búsqueda con debounce
 */
export const useSearchBox = (
  initialValue: string = '',
  onSearch?: (value: string) => void,
  delay: number = 300
) => {
  const [value, setValue] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback((searchValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsSearching(true);
    timeoutRef.current = setTimeout(() => {
      onSearch?.(searchValue);
      setIsSearching(false);
    }, delay);
  }, [onSearch, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue.trim()) {
      debouncedSearch(newValue.trim());
    } else {
      setIsSearching(false);
      onSearch?.('');
    }
  };

  const clear = () => {
    setValue('');
    setIsSearching(false);
    onSearch?.('');
  };

  return {
    value,
    setValue,
    handleChange,
    clear,
    isSearching,
  };
};

export default SearchBox;

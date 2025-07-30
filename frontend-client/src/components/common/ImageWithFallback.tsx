import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  fallback?: string | React.ReactNode;
  className?: string;
  fallbackClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  showLoadingSpinner?: boolean;
  width?: number;
  height?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallback = '🖼️',
  className,
  fallbackClassName,
  onLoad,
  onError,
  loading = 'lazy',
  objectFit = 'cover',
  showLoadingSpinner = false,
  width,
  height,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Update src when prop changes
  useEffect(() => {
    if (src !== imageSrc) {
      setImageSrc(src);
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, imageSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  // Show fallback if no src provided, error occurred, or still loading with spinner disabled
  const shouldShowFallback = !imageSrc || hasError || (isLoading && !showLoadingSpinner);

  if (shouldShowFallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className,
          fallbackClassName
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        {typeof fallback === 'string' ? (
          <span className="text-2xl">{fallback}</span>
        ) : (
          fallback
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      {/* Loading spinner */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-200',
          objectFitClasses[objectFit],
          isLoading && showLoadingSpinner ? 'opacity-0' : 'opacity-100',
          className
        )}
        style={{ width, height }}
      />
    </div>
  );
};

export default ImageWithFallback;
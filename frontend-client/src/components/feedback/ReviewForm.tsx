import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { RatingStars } from './RatingStars';

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  images: File[];
  tags: string[];
  anonymous: boolean;
}

interface ReviewFormProps {
  /**
   * Función que se ejecuta al enviar la reseña
   */
  onSubmit?: (data: ReviewFormData) => void | Promise<void>;
  
  /**
   * Función que se ejecuta al cancelar
   */
  onCancel?: () => void;
  
  /**
   * Datos iniciales del formulario
   */
  initialData?: Partial<ReviewFormData>;
  
  /**
   * Calificación mínima requerida
   */
  minRating?: number;
  
  /**
   * Longitud mínima del contenido
   */
  minContentLength?: number;
  
  /**
   * Longitud máxima del contenido
   */
  maxContentLength?: number;
  
  /**
   * Máximo número de imágenes
   */
  maxImages?: number;
  
  /**
   * Tamaño máximo de archivo en MB
   */
  maxFileSize?: number;
  
  /**
   * Tipos de archivo permitidos
   */
  allowedFileTypes?: string[];
  
  /**
   * Tags predefinidos disponibles
   */
  availableTags?: string[];
  
  /**
   * Permitir tags personalizados
   */
  allowCustomTags?: boolean;
  
  /**
   * Mostrar opción de anonimato
   */
  showAnonymousOption?: boolean;
  
  /**
   * Mostrar subida de imágenes
   */
  showImageUpload?: boolean;
  
  /**
   * Mostrar selector de tags
   */
  showTags?: boolean;
  
  /**
   * Texto del botón de envío
   */
  submitText?: string;
  
  /**
   * Texto del botón de cancelar
   */
  cancelText?: string;
  
  /**
   * Estado de carga
   */
  isLoading?: boolean;
  
  /**
   * Deshabilitar formulario
   */
  disabled?: boolean;
  
  /**
   * Clases CSS adicionales
   */
  className?: string;
}

interface FormErrors {
  rating?: string;
  title?: string;
  content?: string;
  images?: string;
  tags?: string;
}

/**
 * Componente ReviewForm - Formulario para crear reseñas
 */
export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  minRating = 1,
  minContentLength = 10,
  maxContentLength = 1000,
  maxImages = 5,
  maxFileSize = 5,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  availableTags = [],
  allowCustomTags = true,
  showAnonymousOption = true,
  showImageUpload = true,
  showTags = true,
  submitText = 'Enviar Reseña',
  cancelText = 'Cancelar',
  isLoading = false,
  disabled = false,
  className,
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: initialData?.rating || 0,
    title: initialData?.title || '',
    content: initialData?.content || '',
    images: initialData?.images || [],
    tags: initialData?.tags || [],
    anonymous: initialData?.anonymous || false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [customTag, setCustomTag] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (formData.rating < minRating) {
      newErrors.rating = `La calificación debe ser al menos ${minRating} estrella${minRating > 1 ? 's' : ''}`;
    }

    if (formData.content.length < minContentLength) {
      newErrors.content = `El comentario debe tener al menos ${minContentLength} caracteres`;
    }

    if (formData.content.length > maxContentLength) {
      newErrors.content = `El comentario no puede exceder ${maxContentLength} caracteres`;
    }

    if (formData.images.length > maxImages) {
      newErrors.images = `No puedes subir más de ${maxImages} imágenes`;
    }

    return newErrors;
  }, [formData, minRating, minContentLength, maxContentLength, maxImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      await onSubmit?.(formData);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    files.forEach(file => {
      if (!allowedFileTypes.includes(file.type)) {
        return;
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        return;
      }

      if (formData.images.length + validFiles.length < maxImages) {
        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCustomTagAdd = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag('');
    }
  };

  const getRatingLabel = (rating: number) => {
    const labels = [
      'Terrible',
      'Malo',
      'Regular',
      'Bueno',
      'Excelente'
    ];
    return labels[rating - 1] || '';
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        'space-y-6 bg-white p-6 rounded-lg border border-gray-200',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Título */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Escribir Reseña
        </h2>
        <p className="text-gray-600">
          Comparte tu experiencia para ayudar a otros usuarios
        </p>
      </div>

      {/* Calificación */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Calificación *
        </label>
        <div className="flex items-center space-x-4">
          <RatingStars
            value={formData.rating}
            onChange={handleRatingChange}
            size="lg"
            showTooltips
            disabled={disabled || isLoading}
          />
          {formData.rating > 0 && (
            <span className="text-sm font-medium text-gray-700">
              {getRatingLabel(formData.rating)}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Título de la reseña */}
      <div className="space-y-2">
        <label htmlFor="review-title" className="block text-sm font-medium text-gray-700">
          Título (opcional)
        </label>
        <input
          id="review-title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Resumen de tu experiencia"
          maxLength={100}
          disabled={disabled || isLoading}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-50 disabled:text-gray-500'
          )}
        />
      </div>

      {/* Contenido de la reseña */}
      <div className="space-y-2">
        <label htmlFor="review-content" className="block text-sm font-medium text-gray-700">
          Tu opinión *
        </label>
        <textarea
          id="review-content"
          value={formData.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Cuéntanos sobre tu experiencia..."
          rows={6}
          maxLength={maxContentLength}
          disabled={disabled || isLoading}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-50 disabled:text-gray-500',
            'resize-vertical'
          )}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Mínimo {minContentLength} caracteres</span>
          <span>{formData.content.length}/{maxContentLength}</span>
        </div>
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      {/* Subida de imágenes */}
      {showImageUpload && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Imágenes (opcional)
          </label>
          
          {/* Vista previa de imágenes */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    disabled={disabled || isLoading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input de archivos */}
          {formData.images.length < maxImages && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept={allowedFileTypes.join(',')}
                onChange={handleImageUpload}
                disabled={disabled || isLoading}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  Haz clic para subir imágenes
                </span>
                <span className="text-xs text-gray-500">
                  Máximo {maxImages} imágenes, {maxFileSize}MB cada una
                </span>
              </label>
            </div>
          )}
          
          {errors.images && (
            <p className="text-sm text-red-600">{errors.images}</p>
          )}
        </div>
      )}

      {/* Tags */}
      {showTags && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Etiquetas (opcional)
          </label>
          
          {/* Tags seleccionados */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 w-4 h-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 flex items-center justify-center text-xs"
                    disabled={disabled || isLoading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tags predefinidos */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Etiquetas sugeridas:</span>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !formData.tags.includes(tag))
                  .map((tag, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 rounded-full text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={disabled || isLoading}
                    >
                      {tag}
                    </button>
                  ))
                }
              </div>
            </div>
          )}

          {/* Tag personalizado */}
          {allowCustomTags && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomTagAdd())}
                placeholder="Agregar etiqueta personalizada"
                disabled={disabled || isLoading}
                className={cn(
                  'flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  'disabled:bg-gray-50 disabled:text-gray-500'
                )}
              />
              <button
                type="button"
                onClick={handleCustomTagAdd}
                disabled={!customTag.trim() || disabled || isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Agregar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Opción de anonimato */}
      {showAnonymousOption && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.anonymous}
            onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
            disabled={disabled || isLoading}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Publicar como anónimo
          </label>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled || isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
        )}
        
        <button
          type="submit"
          disabled={disabled || isLoading || formData.rating === 0}
          className={cn(
            'px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
            'flex items-center space-x-2'
          )}
        >
          {isLoading && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          <span>{submitText}</span>
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;

import React, { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../../types';
import { cn } from '../../utils/cn';

export interface CustomerFormProps {
  /**
   * Datos iniciales del cliente
   */
  initialData?: Partial<Cliente>;
  
  /**
   * Función callback cuando cambian los datos
   */
  onChange?: (cliente: Cliente) => void;
  
  /**
   * Función de validación personalizada
   */
  onValidate?: (cliente: Cliente) => boolean;
  
  /**
   * Si el formulario es requerido
   */
  required?: boolean;
  
  /**
   * Campos requeridos específicos
   */
  requiredFields?: (keyof Cliente)[];
  
  /**
   * Variante del formulario
   */
  variant?: 'default' | 'compact' | 'inline' | 'modal';
  
  /**
   * Mostrar campos opcionales
   */
  showOptionalFields?: boolean;
  
  /**
   * Autocompletado habilitado
   */
  enableAutocomplete?: boolean;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Errores de validación
   */
  errors?: Partial<Record<keyof Cliente, string>>;
  
  /**
   * Estado de carga
   */
  loading?: boolean;
  
  /**
   * Datos guardados previamente
   */
  savedCustomers?: Cliente[];
  
  /**
   * Permitir seleccionar cliente guardado
   */
  allowSelectSaved?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onChange,
  onValidate,
  required = true,
  requiredFields = ['nombre'],
  variant = 'default',
  showOptionalFields = true,
  enableAutocomplete = true,
  className,
  errors,
  loading = false,
  savedCustomers = [],
  allowSelectSaved = false,
}) => {
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    telefono: '',
    email: '',
    notas: '',
    ...initialData,
  });

  const [internalErrors, setInternalErrors] = useState<Partial<Record<keyof Cliente, string>>>({});
  const [showSavedCustomers, setShowSavedCustomers] = useState(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const getFieldLabel = (field: keyof Cliente): string => {
    const labels = {
      nombre: 'Nombre',
      telefono: 'Teléfono',
      email: 'Email',
      notas: 'Notas',
    };
    return labels[field];
  };

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof Cliente, string>> = {};

    // Validar campos requeridos
    requiredFields.forEach(field => {
      if (!cliente[field] || cliente[field]?.trim() === '') {
        newErrors[field] = `${getFieldLabel(field)} es requerido`;
      }
    });

    // Validaciones específicas
    if (cliente.email && !isValidEmail(cliente.email)) {
      newErrors.email = 'Email no válido';
    }

    if (cliente.telefono && !isValidPhone(cliente.telefono)) {
      newErrors.telefono = 'Teléfono no válido';
    }

    setInternalErrors(newErrors);

    // Usar validación personalizada si está disponible
    if (onValidate) {
      return onValidate(cliente);
    }

    return Object.keys(newErrors).length === 0;
  }, [cliente, requiredFields, onValidate]);

  useEffect(() => {
    if (initialData) {
      setCliente(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    onChange?.(cliente);
    validateForm();
  }, [cliente, onChange, validateForm]);

  const handleInputChange = (field: keyof Cliente, value: string) => {
    setCliente(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectSavedCustomer = (savedCustomer: Cliente) => {
    setCliente(savedCustomer);
    setShowSavedCustomers(false);
  };

  const getFieldError = (field: keyof Cliente): string | undefined => {
    return errors?.[field] || internalErrors[field];
  };

  const isFieldRequired = (field: keyof Cliente): boolean => {
    return requiredFields.includes(field);
  };

  const getInputClasses = (field: keyof Cliente) => {
    const hasError = !!getFieldError(field);
    const baseClasses = cn(
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors',
      variant === 'compact' && 'py-1.5 text-sm',
      hasError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    );
    return baseClasses;
  };

  const renderField = (
    field: keyof Cliente,
    type: 'text' | 'email' | 'tel' | 'textarea' = 'text',
    placeholder?: string
  ) => {
    const fieldError = getFieldError(field);
    const fieldRequired = isFieldRequired(field);
    const fieldId = `customer-${field}`;

    return (
      <div className={cn(
        variant === 'inline' ? 'flex-1' : 'space-y-1'
      )}>
        <label
          htmlFor={fieldId}
          className={cn(
            'block font-medium text-gray-700',
            variant === 'compact' ? 'text-sm' : 'text-sm',
            variant === 'inline' && 'sr-only'
          )}
        >
          {getFieldLabel(field)}
          {fieldRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            id={fieldId}
            value={cliente[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder || `Ingresa ${getFieldLabel(field).toLowerCase()}`}
            className={cn(getInputClasses(field), 'resize-none')}
            rows={variant === 'compact' ? 2 : 3}
            disabled={loading}
            autoComplete={enableAutocomplete ? 'on' : 'off'}
          />
        ) : (
          <input
            id={fieldId}
            type={type}
            value={cliente[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder || `Ingresa ${getFieldLabel(field).toLowerCase()}`}
            className={getInputClasses(field)}
            disabled={loading}
            autoComplete={enableAutocomplete ? 'on' : 'off'}
          />
        )}

        {fieldError && (
          <p className="text-red-600 text-xs mt-1">{fieldError}</p>
        )}
      </div>
    );
  };

  const renderSavedCustomers = () => {
    if (!allowSelectSaved || savedCustomers.length === 0) return null;

    return (
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowSavedCustomers(!showSavedCustomers)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showSavedCustomers ? 'Ocultar' : 'Seleccionar'} clientes guardados
        </button>

        {showSavedCustomers && (
          <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
            {savedCustomers.map((customer, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSavedCustomer(customer)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{customer.nombre}</div>
                {customer.telefono && (
                  <div className="text-sm text-gray-600">{customer.telefono}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const isCompact = variant === 'compact';
  const isInline = variant === 'inline';

  return (
    <div className={cn(
      'space-y-4',
      variant === 'modal' && 'max-w-md',
      isCompact && 'space-y-3',
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className={cn(
          'font-semibold text-gray-900',
          isCompact ? 'text-base' : 'text-lg'
        )}>
          Información del Cliente
        </h3>
        {required && (
          <span className="text-xs text-gray-500">* Campos requeridos</span>
        )}
      </div>

      {renderSavedCustomers()}

      <div className={cn(
        isInline ? 'flex space-x-3' : 'space-y-4',
        isCompact && !isInline && 'space-y-3'
      )}>
        {renderField('nombre', 'text', 'Tu nombre completo')}
        
        {(showOptionalFields || requiredFields.includes('telefono')) && 
          renderField('telefono', 'tel', '+1234567890')
        }
      </div>

      {(showOptionalFields || requiredFields.includes('email')) && (
        <div className={isInline ? 'flex space-x-3' : undefined}>
          {renderField('email', 'email', 'tu@email.com')}
        </div>
      )}

      {(showOptionalFields || requiredFields.includes('notas')) && (
        <div>
          {renderField('notas', 'textarea', 'Instrucciones especiales, alergias, preferencias...')}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          <span className="ml-2 text-sm text-gray-600">Guardando información...</span>
        </div>
      )}
    </div>
  );
};

// Hook para gestionar datos del cliente
export const useCustomerForm = (initialData?: Partial<Cliente>) => {
  const [cliente, setCliente] = useState<Cliente>({
    nombre: '',
    telefono: '',
    email: '',
    notas: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Cliente, string>>>({});
  const [isValid, setIsValid] = useState(false);

  const updateCliente = (updates: Partial<Cliente>) => {
    setCliente(prev => ({ ...prev, ...updates }));
  };

  const validateCliente = (requiredFields: (keyof Cliente)[] = ['nombre']) => {
    const newErrors: Partial<Record<keyof Cliente, string>> = {};

    requiredFields.forEach(field => {
      if (!cliente[field] || cliente[field]?.trim() === '') {
        newErrors[field] = `${field} es requerido`;
      }
    });

    if (cliente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      newErrors.email = 'Email no válido';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsValid(valid);
    return valid;
  };

  const resetCliente = () => {
    setCliente({
      nombre: '',
      telefono: '',
      email: '',
      notas: '',
      ...initialData,
    });
    setErrors({});
    setIsValid(false);
  };

  return {
    cliente,
    errors,
    isValid,
    updateCliente,
    validateCliente,
    resetCliente,
    setCliente,
  };
};

export default CustomerForm;

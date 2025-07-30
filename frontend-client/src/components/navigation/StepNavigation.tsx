import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface Step {
  /**
   * ID único del paso
   */
  id: string;
  
  /**
   * Título del paso
   */
  title: string;
  
  /**
   * Descripción opcional del paso
   */
  description?: string;
  
  /**
   * Icono del paso
   */
  icon?: string | React.ReactNode;
  
  /**
   * Contenido del paso
   */
  content?: React.ReactNode;
  
  /**
   * Estado del paso
   */
  status?: 'pending' | 'current' | 'completed' | 'error' | 'skipped';
  
  /**
   * Si el paso es opcional
   */
  optional?: boolean;
  
  /**
   * Si el paso está deshabilitado
   */
  disabled?: boolean;
  
  /**
   * Función de validación del paso
   */
  validate?: () => boolean | Promise<boolean>;
  
  /**
   * Función que se ejecuta al entrar al paso
   */
  onEnter?: () => void | Promise<void>;
  
  /**
   * Función que se ejecuta al salir del paso
   */
  onExit?: () => void | Promise<void>;
}

export interface StepNavigationProps {
  /**
   * Lista de pasos
   */
  steps: Step[];
  
  /**
   * Paso actual
   */
  currentStep?: number;
  
  /**
   * Orientación del navegador
   */
  orientation?: 'horizontal' | 'vertical';
  
  /**
   * Variante del estilo
   */
  variant?: 'default' | 'dots' | 'arrows' | 'progress' | 'minimal';
  
  /**
   * Tamaño del componente
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Permitir navegación clickeando en los pasos
   */
  clickable?: boolean;
  
  /**
   * Mostrar números en los pasos
   */
  showNumbers?: boolean;
  
  /**
   * Mostrar descripción de los pasos
   */
  showDescriptions?: boolean;
  
  /**
   * Animar transiciones
   */
  animated?: boolean;
  
  /**
   * Validar pasos automáticamente
   */
  autoValidate?: boolean;
  
  /**
   * Función callback cuando cambia el paso
   */
  onStepChange?: (stepIndex: number, step: Step) => void;
  
  /**
   * Función callback cuando se completa todos los pasos
   */
  onComplete?: () => void;
  
  /**
   * Función callback cuando ocurre un error
   */
  onError?: (stepIndex: number, error: any) => void;
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Mostrar controles de navegación
   */
  showControls?: boolean;
  
  /**
   * Etiquetas personalizadas para botones
   */
  labels?: {
    previous?: string;
    next?: string;
    finish?: string;
    skip?: string;
  };
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep: controlledCurrentStep,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  clickable = true,
  showNumbers = true,
  showDescriptions = true,
  animated = true,
  autoValidate = true,
  onStepChange,
  onComplete,
  onError,
  className,
  showControls = true,
  labels = {
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Finalizar',
    skip: 'Omitir',
  },
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStep = controlledCurrentStep ?? internalCurrentStep;
  const currentStepData = steps[currentStep];

  const updateStepStatus = (stepIndex: number, status: Step['status']) => {
    steps[stepIndex].status = status;
  };

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const step = steps[stepIndex];
    if (!step.validate) return true;

    try {
      const result = await step.validate();
      if (result) {
        updateStepStatus(stepIndex, 'completed');
        setCompletedSteps(prev => new Set(Array.from(prev).concat(stepIndex)));
      } else {
        updateStepStatus(stepIndex, 'error');
      }
      return result;
    } catch (error) {
      updateStepStatus(stepIndex, 'error');
      onError?.(stepIndex, error);
      return false;
    }
  };

  const goToStep = useCallback(async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    if (steps[stepIndex].disabled) return;

    setIsTransitioning(true);

    try {
      // Validar paso actual si es necesario
      if (autoValidate && stepIndex > currentStep) {
        const isValid = await validateStep(currentStep);
        if (!isValid) {
          setIsTransitioning(false);
          return;
        }
      }

      // Ejecutar onExit del paso actual
      if (currentStepData?.onExit) {
        await currentStepData.onExit();
      }

      // Actualizar paso actual
      if (controlledCurrentStep === undefined) {
        setInternalCurrentStep(stepIndex);
      }

      // Actualizar estados
      updateStepStatus(currentStep, 'completed');
      updateStepStatus(stepIndex, 'current');

      // Ejecutar onEnter del nuevo paso
      if (steps[stepIndex].onEnter) {
        await steps[stepIndex].onEnter!();
      }

      onStepChange?.(stepIndex, steps[stepIndex]);
    } finally {
      setIsTransitioning(false);
    }
  }, [currentStep, currentStepData, steps, autoValidate, controlledCurrentStep, onStepChange]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (currentStepData?.optional) {
      updateStepStatus(currentStep, 'skipped');
      nextStep();
    }
  };

  const getStepStatus = (stepIndex: number): Step['status'] => {
    if (stepIndex === currentStep) return 'current';
    if (completedSteps.has(stepIndex)) return 'completed';
    if (steps[stepIndex].status) return steps[stepIndex].status;
    return 'pending';
  };

  const getStepClasses = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    const isClickable = clickable && !steps[stepIndex].disabled;
    
    const baseClasses = 'relative flex items-center transition-all duration-200';
    
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    const statusClasses = {
      pending: 'text-gray-400',
      current: 'text-blue-600 font-medium',
      completed: 'text-green-600',
      error: 'text-red-600',
      skipped: 'text-gray-400 line-through',
    };

    const clickableClasses = isClickable
      ? 'cursor-pointer hover:text-blue-700'
      : 'cursor-default';

    return cn(
      baseClasses,
      sizeClasses[size],
      status ? statusClasses[status] : statusClasses.pending,
      clickableClasses
    );
  };

  const getStepCircleClasses = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    
    const baseClasses = 'flex items-center justify-center rounded-full font-medium transition-all duration-200';
    
    const sizeClasses = {
      sm: 'w-6 h-6 text-xs',
      md: 'w-8 h-8 text-sm',
      lg: 'w-10 h-10 text-base',
    };

    const statusClasses = {
      pending: 'bg-gray-200 text-gray-600',
      current: 'bg-blue-600 text-white ring-4 ring-blue-100',
      completed: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      skipped: 'bg-gray-300 text-gray-500',
    };

    return cn(
      baseClasses,
      sizeClasses[size],
      status ? statusClasses[status] : statusClasses.pending
    );
  };

  const renderStepIcon = (step: Step, stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    
    if (step.icon) {
      if (typeof step.icon === 'string') {
        return <span>{step.icon}</span>;
      }
      return step.icon;
    }

    if (status === 'completed') {
      return <span>✓</span>;
    }

    if (status === 'error') {
      return <span>✗</span>;
    }

    if (status === 'skipped') {
      return <span>⊘</span>;
    }

    if (showNumbers) {
      return <span>{stepIndex + 1}</span>;
    }

    return null;
  };

  const renderConnector = (stepIndex: number) => {
    if (stepIndex === steps.length - 1) return null;

    const isCompleted = getStepStatus(stepIndex) === 'completed';
    const connectorClasses = cn(
      'transition-all duration-200',
      orientation === 'horizontal'
        ? 'h-0.5 flex-1 mx-4'
        : 'w-0.5 h-8 mx-auto',
      isCompleted ? 'bg-green-600' : 'bg-gray-300'
    );

    return <div className={connectorClasses} />;
  };

  const renderStep = (step: Step, stepIndex: number) => {
    
    return (
      <div
        key={step.id}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-col items-center' : 'items-center space-x-3'
        )}
      >
        <div
          onClick={() => clickable && !step.disabled && goToStep(stepIndex)}
          className={getStepClasses(stepIndex)}
        >
          <div className={getStepCircleClasses(stepIndex)}>
            {renderStepIcon(step, stepIndex)}
          </div>
          
          {(orientation === 'vertical' || showDescriptions) && (
            <div className={cn(
              orientation === 'horizontal' ? 'mt-2 text-center' : 'ml-3'
            )}>
              <div className="font-medium">{step.title}</div>
              {showDescriptions && step.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              )}
              {step.optional && (
                <div className="text-xs text-gray-400 mt-1">
                  (Opcional)
                </div>
              )}
            </div>
          )}
        </div>
        
        {orientation === 'horizontal' && renderConnector(stepIndex)}
      </div>
    );
  };

  const renderStepContent = () => {
    if (!currentStepData?.content) return null;

    return (
      <div className={cn(
        'mt-8 transition-all duration-200',
        animated && isTransitioning && 'opacity-50',
        className
      )}>
        {currentStepData.content}
      </div>
    );
  };

  const renderControls = () => {
    if (!showControls) return null;

    const canGoPrevious = currentStep > 0;
    const isLastStep = currentStep === steps.length - 1;
    const canSkip = currentStepData?.optional;

    return (
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={previousStep}
          disabled={!canGoPrevious || isTransitioning}
          className={cn(
            'px-4 py-2 rounded-md transition-colors',
            canGoPrevious
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          )}
        >
          {labels.previous}
        </button>

        <div className="flex space-x-3">
          {canSkip && (
            <button
              onClick={skipStep}
              disabled={isTransitioning}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {labels.skip}
            </button>
          )}

          <button
            onClick={nextStep}
            disabled={isTransitioning}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
          >
            {isLastStep ? labels.finish : labels.next}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'flex',
        orientation === 'horizontal' ? 'items-start justify-center' : 'flex-col space-y-4'
      )}>
        {steps.map(renderStep)}
      </div>

      {renderStepContent()}
      {renderControls()}
    </div>
  );
};

// Hook para gestionar pasos
export const useStepNavigation = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStep)));
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetSteps = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const completeStep = (step?: number) => {
    const stepToComplete = step ?? currentStep;
    setCompletedSteps(prev => new Set(Array.from(prev).concat(stepToComplete)));
  };

  return {
    currentStep,
    completedSteps,
    goToStep,
    nextStep,
    previousStep,
    resetSteps,
    completeStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
};

export default StepNavigation;

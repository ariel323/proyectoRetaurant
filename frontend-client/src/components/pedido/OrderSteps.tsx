import React from 'react';

interface Step {
  id: string;
  label: string;
  description: string;
}

interface OrderStepsProps {
  steps: Step[];
  currentStep: number;
  variant?: 'default' | 'compact' | 'vertical';
  className?: string;
}

const OrderSteps: React.FC<OrderStepsProps> = ({
  steps,
  currentStep,
  variant = 'default',
  className = ''
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`
              w-3 h-3 rounded-full transition-colors
              ${index <= currentStep
                ? 'bg-blue-600'
                : 'bg-gray-300'
              }
            `}
          />
        ))}
        <span className="ml-4 text-sm text-gray-600">
          Paso {currentStep + 1} de {steps.length}
        </span>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step.id} className="flex items-start">
              {/* Step indicator */}
              <div className="flex-shrink-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isCompleted
                    ? 'bg-green-600 border-green-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`
                    w-0.5 h-8 mx-auto mt-2 transition-colors
                    ${index < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>

              {/* Step content */}
              <div className="ml-4 min-w-0 flex-1">
                <h3 className={`
                  text-sm font-medium transition-colors
                  ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                `}>
                  {step.label}
                </h3>
                <p className={`
                  text-sm mt-1 transition-colors
                  ${isCurrent ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default horizontal variant
  return (
    <nav className={`${className}`} aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className={`
              relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}
            `}>
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className={`
                    h-0.5 w-full transition-colors
                    ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}
                  `} />
                </div>
              )}

              {/* Step */}
              <div className="relative flex items-center justify-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors bg-white
                  ${isCompleted
                    ? 'border-blue-600 bg-blue-600'
                    : isCurrent
                    ? 'border-blue-600'
                    : 'border-gray-300'
                  }
                `}>
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className={`
                      text-sm font-medium
                      ${isCurrent ? 'text-blue-600' : 'text-gray-500'}
                    `}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Step labels */}
                <div className="absolute top-10 w-32 text-center">
                  <span className={`
                    text-xs font-medium transition-colors
                    ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-600' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                  <p className={`
                    text-xs mt-1 transition-colors
                    ${isCurrent ? 'text-gray-900' : 'text-gray-500'}
                  `}>
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default OrderSteps;

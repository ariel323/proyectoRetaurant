import React from "react";
import { Pedido } from "../../types";
import OrderStatus from "./OrderStatus";
import OrderTimer from "./OrderTimer";

interface TrackingStep {
  id: string;
  status: Pedido["estado"];
  label: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isActive: boolean;
  estimatedTime?: string;
}

interface OrderTrackingProps {
  pedido: Pedido;
  variant?: "default" | "compact" | "detailed" | "timeline";
  showTimer?: boolean;
  showEstimatedTimes?: boolean;
  className?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  pedido,
  variant = "default",
  showTimer = true,
  showEstimatedTimes = true,
  className = "",
}) => {
  // Helper function to map new enum to legacy enum for compatibility
  const mapStatusToLegacy = (estado: Pedido["estado"]) => {
    switch (estado) {
      case "EN_PREPARACION":
        return "PREPARANDO";
      default:
        return estado as any; // Cast other values
    }
  };

  const getTrackingSteps = (): TrackingStep[] => {
    const currentStatus = pedido.estado;
    const statusOrder: Pedido["estado"][] = [
      "PENDIENTE",
      "EN_PREPARACION",
      "LISTO",
      "ENTREGADO",
    ];

    if (currentStatus === "CANCELADO") {
      return [
        {
          id: "cancelado",
          status: "CANCELADO",
          label: "Pedido Cancelado",
          description: "El pedido ha sido cancelado",
          isCompleted: true,
          isActive: false,
          timestamp: pedido.fecha_creacion,
        },
      ];
    }

    const currentIndex = statusOrder.indexOf(currentStatus);

    return statusOrder.map((status, index) => {
      const isCompleted = index < currentIndex;
      const isActive = index === currentIndex;

      const stepConfig = {
        PENDIENTE: {
          label: "Pedido Recibido",
          description: "Hemos recibido tu pedido",
          estimatedTime: "2-5 min",
        },
        CONFIRMADO: {
          label: "Pedido Confirmado",
          description: "Tu pedido ha sido confirmado",
          estimatedTime: "1-2 min",
        },
        EN_PREPARACION: {
          label: "En Preparación",
          description: "Estamos preparando tu pedido",
          estimatedTime: "15-20 min",
        },
        PREPARANDO: {
          label: "En Preparación",
          description: "Estamos preparando tu pedido",
          estimatedTime: "15-20 min",
        },
        LISTO: {
          label: "Listo para Entregar",
          description: "Tu pedido está listo",
          estimatedTime: "0 min",
        },
        ENTREGADO: {
          label: "Entregado",
          description: "Pedido entregado exitosamente",
          estimatedTime: "0 min",
        },
        CANCELADO: {
          label: "Cancelado",
          description: "Pedido cancelado",
          estimatedTime: "0 min",
        },
      };

      return {
        id: status.toLowerCase(),
        status,
        label: stepConfig[status].label,
        description: stepConfig[status].description,
        estimatedTime: stepConfig[status].estimatedTime,
        isCompleted,
        isActive,
        timestamp: isCompleted || isActive ? pedido.fecha_creacion : undefined,
      };
    });
  };

  const trackingSteps = getTrackingSteps();
  const currentStep = trackingSteps.find((step) => step.isActive);

  const getStepIcon = (step: TrackingStep) => {
    if (step.isCompleted) {
      return (
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
      );
    }

    const icons = {
      PENDIENTE: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      CONFIRMADO: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      EN_PREPARACION: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657A8 8 0 716.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0720 13a7.975 7.975 0 01-2.343 5.657z"
          />
        </svg>
      ),
      PREPARANDO: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
          />
        </svg>
      ),
      LISTO: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      ENTREGADO: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      CANCELADO: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    };

    return icons[step.status];
  };

  if (variant === "compact") {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Current Status */}
        <OrderStatus
          estado={pedido.estado}
          variant="compact"
          showEstimatedTime={showEstimatedTimes}
        />

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{
              width: `${
                (trackingSteps.filter((s) => s.isCompleted).length /
                  trackingSteps.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* Timer */}
        {showTimer && currentStep && (
          <OrderTimer
            status={mapStatusToLegacy(pedido.estado)}
            startTime={pedido.fecha_creacion}
            estimatedTime={20}
            variant="compact"
          />
        )}
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="relative">
          {trackingSteps.map((step, index) => (
            <div key={step.id} className="relative flex items-start pb-8">
              {/* Timeline Line */}
              {index < trackingSteps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-16 ${
                    step.isCompleted ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2
                ${
                  step.isCompleted
                    ? "bg-green-500 border-green-500"
                    : step.isActive
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }
              `}
              >
                <div
                  className={`${
                    step.isCompleted
                      ? "text-white"
                      : step.isActive
                      ? "text-white"
                      : "text-gray-400"
                  }`}
                >
                  {getStepIcon(step)}
                </div>
              </div>

              {/* Step Content */}
              <div className="ml-4 flex-1">
                <h4
                  className={`font-medium ${
                    step.isActive
                      ? "text-blue-600"
                      : step.isCompleted
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                {showEstimatedTimes &&
                  step.estimatedTime &&
                  !step.isCompleted && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tiempo estimado: {step.estimatedTime}
                    </p>
                  )}
                {step.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(step.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">
            Seguimiento del Pedido #{pedido.id}
          </h2>
          <p className="text-gray-600 mt-1">
            Mantente al tanto del progreso de tu pedido
          </p>
        </div>

        {/* Current Status Card */}
        <OrderStatus
          pedido={pedido}
          variant="detailed"
          showEstimatedTime={showEstimatedTimes}
        />

        {/* Timer */}
        {showTimer && currentStep && pedido.estado === "EN_PREPARACION" && (
          <OrderTimer
            status={mapStatusToLegacy(pedido.estado)}
            startTime={pedido.fecha_creacion}
            estimatedTime={20}
            variant="large"
          />
        )}

        {/* Timeline */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Progreso del Pedido
          </h3>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-full
                  ${
                    step.isCompleted
                      ? "bg-green-500 text-white"
                      : step.isActive
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }
                `}
                >
                  {getStepIcon(step)}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      step.isActive
                        ? "text-blue-600"
                        : step.isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {showEstimatedTimes &&
                  step.estimatedTime &&
                  !step.isCompleted && (
                    <div className="text-right text-sm text-gray-500">
                      {step.estimatedTime}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Detalles del Pedido
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Mesa:</span>
              <span className="ml-2 font-medium">#{pedido.mesa_id}</span>
            </div>
            <div>
              <span className="text-gray-600">Total:</span>
              <span className="ml-2 font-medium">
                ${pedido.total.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Items:</span>
              <span className="ml-2 font-medium">{pedido.items.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Fecha:</span>
              <span className="ml-2 font-medium">
                {pedido.fecha_creacion &&
                  new Date(pedido.fecha_creacion).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Status */}
      <OrderStatus
        estado={pedido.estado}
        showEstimatedTime={showEstimatedTimes}
      />

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {trackingSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center border-2
              ${
                step.isCompleted
                  ? "bg-green-500 border-green-500 text-white"
                  : step.isActive
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }
            `}
            >
              {getStepIcon(step)}
            </div>
            <div className="text-center mt-2">
              <div
                className={`text-xs font-medium ${
                  step.isActive
                    ? "text-blue-600"
                    : step.isCompleted
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </div>
              {showEstimatedTimes &&
                step.estimatedTime &&
                !step.isCompleted && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.estimatedTime}
                  </div>
                )}
            </div>
            {/* Connector line */}
            {index < trackingSteps.length - 1 && (
              <div
                className={`
                absolute h-0.5 top-4 left-8 right-8
                ${step.isCompleted ? "bg-green-500" : "bg-gray-300"}
              `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Timer */}
      {showTimer && currentStep && (
        <OrderTimer
          status={mapStatusToLegacy(pedido.estado)}
          startTime={pedido.fecha_creacion}
          estimatedTime={20}
        />
      )}
    </div>
  );
};

export default OrderTracking;

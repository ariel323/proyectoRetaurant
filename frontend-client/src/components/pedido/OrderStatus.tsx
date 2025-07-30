import React from "react";
import { Pedido } from "../../types";

interface OrderStatusProps {
  pedido?: Pedido;
  estado?: Pedido["estado"];
  showEstimatedTime?: boolean;
  variant?: "default" | "compact" | "detailed" | "badge";
  className?: string;
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  pedido,
  estado: propEstado,
  showEstimatedTime = true,
  variant = "default",
  className = "",
}) => {
  const estado = propEstado || pedido?.estado || "PENDIENTE";

  const statusConfig = {
    PENDIENTE: {
      label: "Pendiente",
      description: "Esperando confirmación",
      color: "yellow",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
      icon: (
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
    },
    CONFIRMADO: {
      label: "Confirmado",
      description: "Pedido confirmado y en cola",
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-300",
      icon: (
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
    },
    EN_PREPARACION: {
      label: "En Preparación",
      description: "Tu pedido se está preparando",
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      borderColor: "border-orange-300",
      icon: (
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    PREPARANDO: {
      label: "En Preparación",
      description: "Tu pedido se está preparando",
      color: "orange",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      borderColor: "border-orange-300",
      icon: (
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
    },
    LISTO: {
      label: "Listo",
      description: "Tu pedido está listo para entregar",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
      icon: (
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
    },
    ENTREGADO: {
      label: "Entregado",
      description: "Pedido entregado exitosamente",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-300",
      icon: (
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
    },
    CANCELADO: {
      label: "Cancelado",
      description: "Pedido cancelado",
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-300",
      icon: (
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
    },
  };

  const config = statusConfig[estado];

  // Estimated times based on status
  const getEstimatedTime = () => {
    if (!showEstimatedTime) return null;

    switch (estado) {
      case "PENDIENTE":
        return "5-10 min para confirmación";
      case "EN_PREPARACION":
        return "10-15 min restantes";
      case "LISTO":
        return "Recoger ahora";
      case "ENTREGADO":
        return "Completado";
      case "CANCELADO":
        return null;
      default:
        return null;
    }
  };

  if (variant === "badge") {
    return (
      <span
        className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${config.bgColor} ${config.textColor} ${className}
      `}
      >
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div
          className={`p-1 rounded-full ${config.bgColor} ${config.textColor}`}
        >
          {config.icon}
        </div>
        <div>
          <span className={`font-medium ${config.textColor}`}>
            {config.label}
          </span>
          {showEstimatedTime && getEstimatedTime() && (
            <span className="text-sm text-gray-500 ml-2">
              • {getEstimatedTime()}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div
        className={`border rounded-lg p-6 ${config.borderColor} ${config.bgColor} ${className}`}
      >
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full bg-white ${config.textColor}`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${config.textColor}`}>
              {config.label}
            </h3>
            <p className={`text-sm mt-1 ${config.textColor} opacity-80`}>
              {config.description}
            </p>
            {showEstimatedTime && getEstimatedTime() && (
              <p className={`text-sm mt-2 font-medium ${config.textColor}`}>
                <svg
                  className="w-4 h-4 inline mr-1"
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
                {getEstimatedTime()}
              </p>
            )}
            {pedido && (
              <div className={`text-xs mt-3 ${config.textColor} opacity-70`}>
                Pedido #{pedido.id} •{" "}
                {pedido.fecha_creacion &&
                  new Date(pedido.fecha_creacion).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Progress steps for active states */}
        {estado === "EN_PREPARACION" && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Progreso</span>
              <span>75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-1000 bg-orange-500 w-3/4" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg border ${config.borderColor} ${config.bgColor} ${className}`}
    >
      <div className={`p-2 rounded-full bg-white ${config.textColor}`}>
        {config.icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-medium ${config.textColor}`}>{config.label}</h4>
          {pedido && (
            <span className={`text-sm ${config.textColor} opacity-70`}>
              #{pedido.id}
            </span>
          )}
        </div>
        <p className={`text-sm ${config.textColor} opacity-80`}>
          {config.description}
        </p>
        {showEstimatedTime && getEstimatedTime() && (
          <p className={`text-sm mt-1 ${config.textColor} font-medium`}>
            <svg
              className="w-4 h-4 inline mr-1"
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
            {getEstimatedTime()}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;

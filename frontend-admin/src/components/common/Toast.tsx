import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: "bg-green-500",
      icon: "✅",
      title: "Éxito",
    },
    error: {
      bg: "bg-red-500",
      icon: "❌",
      title: "Error",
    },
    warning: {
      bg: "bg-yellow-500",
      icon: "⚠️",
      title: "Advertencia",
    },
    info: {
      bg: "bg-blue-500",
      icon: "ℹ️",
      title: "Información",
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
      fixed top-4 right-4 z-50 transform transition-all duration-300
      ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
    `}
    >
      <div
        className={`
        ${config.bg} text-white px-6 py-4 rounded-lg shadow-lg max-w-sm
        flex items-start space-x-3
      `}
      >
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1">
          <div className="font-semibold">{config.title}</div>
          <div className="text-sm opacity-90">{message}</div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-200 transition-colors"
        >
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
        </button>
      </div>
    </div>
  );
};

export default Toast;

import React from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  isLoading?: boolean;
  className?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isLoading = false,
  className,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const getVariantConfig = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '⚠️',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmVariant: 'danger' as const,
        };
      case 'warning':
        return {
          icon: '⚠️',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmVariant: 'secondary' as const,
        };
      default:
        return {
          icon: '❓',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmVariant: 'primary' as const,
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      className={className}
    >
      <div className="text-center sm:text-left">
        {/* Icon */}
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 mb-4">
          <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-2xl', config.iconBg)}>
            <span className={config.iconColor}>{config.icon}</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {cancelText}
        </Button>
        <Button
          variant={config.confirmVariant}
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
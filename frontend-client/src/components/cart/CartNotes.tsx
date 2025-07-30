import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

export interface CartNotesProps {
  value: string;
  onSave: (notes: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const CartNotes: React.FC<CartNotesProps> = ({
  value,
  onSave,
  onCancel,
  placeholder = 'Agregar notas especiales...',
  maxLength = 100,
  className,
}) => {
  const [notes, setNotes] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-focus when component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(notes.length, notes.length);
    }
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(notes.trim());
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  const remainingChars = maxLength - notes.length;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={2}
          className={cn(
            'w-full text-sm border border-gray-300 rounded-md px-3 py-2',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'resize-none transition-colors',
            remainingChars < 10 && 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
          )}
        />
        
        {/* Character counter */}
        <div className={cn(
          'absolute bottom-1 right-2 text-xs',
          remainingChars < 10 ? 'text-yellow-600' : 'text-gray-400'
        )}>
          {remainingChars}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Ctrl+Enter para guardar, Esc para cancelar
        </div>
        
        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
              className="text-xs"
            >
              Cancelar
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || notes.trim() === value.trim()}
            isLoading={isSaving}
            className="text-xs"
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartNotes;
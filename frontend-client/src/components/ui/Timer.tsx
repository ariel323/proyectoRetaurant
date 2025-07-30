import React from 'react';
import { cn } from '../../utils/cn';

export interface TimerProps {
  duration: number; // Duration in seconds
  variant?: 'default' | 'circle' | 'bar' | 'text';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  autoStart?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  format?: 'mm:ss' | 'hh:mm:ss' | 'seconds';
  onComplete?: () => void;
  onTick?: (remainingTime: number) => void;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  variant = 'default',
  size = 'md',
  color = 'primary',
  autoStart = false,
  showControls = true,
  showProgress = true,
  format = 'mm:ss',
  onComplete,
  onTick,
  onStart,
  onPause,
  onReset,
  className,
}) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isRunning, setIsRunning] = React.useState(autoStart);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTick, onComplete]);

  const start = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsCompleted(false);
      onStart?.();
    }
  };

  const pause = () => {
    setIsRunning(false);
    onPause?.();
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setIsCompleted(false);
    onReset?.();
  };

  const formatTime = (seconds: number): string => {
    if (format === 'seconds') {
      return seconds.toString();
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (format === 'hh:mm:ss') {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const sizes = {
    sm: {
      text: 'text-lg',
      circle: 'w-16 h-16',
      bar: 'h-2',
      button: 'p-1 text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      text: 'text-2xl',
      circle: 'w-24 h-24',
      bar: 'h-3',
      button: 'p-2 text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      text: 'text-4xl',
      circle: 'w-32 h-32',
      bar: 'h-4',
      button: 'p-3 text-base',
      icon: 'w-5 h-5',
    },
  };

  const colors = {
    primary: {
      text: 'text-blue-600',
      bg: 'bg-blue-600',
      light: 'bg-blue-100',
      border: 'border-blue-600',
    },
    success: {
      text: 'text-green-600',
      bg: 'bg-green-600',
      light: 'bg-green-100',
      border: 'border-green-600',
    },
    warning: {
      text: 'text-yellow-600',
      bg: 'bg-yellow-600',
      light: 'bg-yellow-100',
      border: 'border-yellow-600',
    },
    danger: {
      text: 'text-red-600',
      bg: 'bg-red-600',
      light: 'bg-red-100',
      border: 'border-red-600',
    },
  };

  const PlayIcon = () => (
    <svg className={sizes[size].icon} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg className={sizes[size].icon} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );

  const ResetIcon = () => (
    <svg className={sizes[size].icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const renderTimer = () => {
    const timeDisplay = (
      <span className={cn(
        'font-mono font-bold',
        sizes[size].text,
        isCompleted ? colors.danger.text : colors[color].text
      )}>
        {formatTime(timeLeft)}
      </span>
    );

    switch (variant) {
      case 'circle': {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (progress / 100) * circumference;

        return (
          <div className={cn('relative flex items-center justify-center', sizes[size].circle)}>
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className={colors[color].light}
              />
              {showProgress && (
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={cn(
                    'transition-all duration-1000 ease-linear',
                    colors[color].text
                  )}
                />
              )}
            </svg>
            <div className="relative z-10 text-center">
              {timeDisplay}
            </div>
          </div>
        );
      }

      case 'bar':
        return (
          <div className="w-full">
            <div className="flex justify-center mb-2">
              {timeDisplay}
            </div>
            {showProgress && (
              <div className={cn(
                'w-full rounded-full overflow-hidden',
                sizes[size].bar,
                colors[color].light
              )}>
                <div
                  className={cn(
                    'h-full transition-all duration-1000 ease-linear',
                    colors[color].bg
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        );

      case 'text':
        return timeDisplay;

      default:
        return (
          <div className="text-center">
            {timeDisplay}
            {showProgress && (
              <div className={cn(
                'w-full mt-2 rounded-full overflow-hidden',
                sizes[size].bar,
                colors[color].light
              )}>
                <div
                  className={cn(
                    'h-full transition-all duration-1000 ease-linear',
                    colors[color].bg
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      {renderTimer()}
      
      {showControls && (
        <div className="flex items-center space-x-2">
          <button
            onClick={isRunning ? pause : start}
            disabled={isCompleted && timeLeft === 0}
            className={cn(
              'flex items-center justify-center rounded-full transition-colors',
              'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizes[size].button,
              colors[color].text,
              `focus:ring-${color}-500`
            )}
            aria-label={isRunning ? 'Pause timer' : 'Start timer'}
          >
            {isRunning ? <PauseIcon /> : <PlayIcon />}
          </button>
          
          <button
            onClick={reset}
            className={cn(
              'flex items-center justify-center rounded-full transition-colors',
              'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
              sizes[size].button,
              'text-gray-600 focus:ring-gray-500'
            )}
            aria-label="Reset timer"
          >
            <ResetIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default Timer;

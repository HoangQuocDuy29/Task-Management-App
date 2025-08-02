// client/src/components/user/shared/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title,
  type = 'error',
  onRetry,
  onDismiss,
  className = ''
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-900'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          titleColor: 'text-blue-900'
        };
      default:
        return {
          icon: '❌',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          titleColor: 'text-red-900'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`rounded-lg border p-4 ${styles.bgColor} ${styles.borderColor} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-xl" aria-hidden="true">{styles.icon}</span>
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${styles.textColor}`}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="ml-4 flex space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`text-sm font-medium ${styles.textColor} hover:opacity-75 transition-opacity`}
              aria-label="Retry action"
            >
              🔄 Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`text-sm font-medium ${styles.textColor} hover:opacity-75 transition-opacity`}
              aria-label="Dismiss message"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Preset variants
export const ErrorAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="error" />
);

export const WarningAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="warning" />
);

export const InfoAlert: React.FC<Omit<ErrorMessageProps, 'type'>> = (props) => (
  <ErrorMessage {...props} type="info" />
);

export default ErrorMessage;

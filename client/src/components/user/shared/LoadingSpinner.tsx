// client/src/components/user/shared/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'gray' | 'white';
  text?: string;
  centered?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'blue',
  text,
  centered = false,
  className = ''
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4';
      case 'large':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'gray':
        return 'border-gray-300 border-t-gray-600';
      case 'white':
        return 'border-white/30 border-t-white';
      default:
        return 'border-gray-200 border-t-blue-600';
    }
  };

  const spinner = (
    <div className={`inline-block animate-spin rounded-full border-2 ${getSizeStyles()} ${getColorStyles()}`} />
  );

  const content = (
    <div className={`flex items-center space-x-2 ${className}`}>
      {spinner}
      {text && (
        <span className={`text-sm text-gray-600 ${size === 'small' ? 'text-xs' : ''}`}>
          {text}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};

// Preset variants
export const SmallSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner {...props} size="small" />
);

export const LargeSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner {...props} size="large" />
);

export const CenteredSpinner: React.FC<Omit<LoadingSpinnerProps, 'centered'>> = (props) => (
  <LoadingSpinner {...props} centered={true} />
);

export const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="large" text={text} />
  </div>
);

export default LoadingSpinner;

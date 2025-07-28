import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'default' | 'dots' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${sizeClasses[size]} bg-gradient-to-r from-linkedin-600 to-blue-600 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-linkedin-600 to-blue-600 rounded-full animate-pulse`} />
        {text && (
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-linkedin-600`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-linkedin-600 to-blue-600 rounded-full opacity-20 animate-ping`} />
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          <span className="loading-dots">{text}</span>
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 
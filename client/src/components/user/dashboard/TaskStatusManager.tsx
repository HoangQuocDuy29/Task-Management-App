// client/src/components/user/dashboard/TaskStatusManager.tsx
import React, { useState } from 'react';
import { api } from '../../../utils/api';

interface TaskStatusManagerProps {
  taskId: number;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

const statusOptions = [
  { 
    value: 'todo', 
    label: 'To Do', 
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
    icon: '📋',
    description: 'Task not started yet'
  },
  { 
    value: 'in_progress', 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
    icon: '🔄',
    description: 'Currently working on this task'
  },
  { 
    value: 'done', 
    label: 'Done', 
    color: 'bg-green-100 text-green-800 hover:bg-green-200', 
    icon: '✅',
    description: 'Task completed'
  }
];

export const TaskStatusManager: React.FC<TaskStatusManagerProps> = ({
  taskId,
  currentStatus,
  onStatusUpdate,
  disabled = false,
  size = 'medium',
  showIcon = true
}) => {
  const [updating, setUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTaskStatus = async (newStatus: string) => {
    if (newStatus === currentStatus || updating || disabled) return;

    try {
      setUpdating(true);
      setError(null);
      
      // API call to update task status
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      
      // Success callback
      onStatusUpdate(newStatus);
      setShowDropdown(false);
      
    } catch (error: any) {
      console.error('Failed to update task status:', error);
      setError(error.response?.data?.message || 'Failed to update status');
      
      // Auto-hide error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const currentStatusData = statusOptions.find(s => s.value === currentStatus) || statusOptions[0];

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getDropdownSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'min-w-[120px]';
      case 'large':
        return 'min-w-[160px]';
      default:
        return 'min-w-[140px]';
    }
  };

  return (
    <div className="relative">
      {/* Current Status Button */}
      <button
        onClick={() => !disabled && !updating && setShowDropdown(!showDropdown)}
        disabled={disabled || updating}
        className={`
          inline-flex items-center rounded-full font-medium transition-all duration-200
          ${currentStatusData.color}
          ${getSizeClasses()}
          ${disabled || updating 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:shadow-sm cursor-pointer active:scale-95'
          }
          ${error ? 'ring-2 ring-red-300' : ''}
        `}
        title={error || currentStatusData.description}
      >
        {showIcon && (
          <span className="mr-1">{currentStatusData.icon}</span>
        )}
        
        {updating ? (
          <>
            <span className="animate-spin mr-1">⏳</span>
            Updating...
          </>
        ) : (
          <>
            {currentStatusData.label}
            {!disabled && !updating && (
              <span className="ml-1 opacity-60">▼</span>
            )}
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 mt-1 bg-red-100 border border-red-300 text-red-700 px-2 py-1 rounded text-xs z-30">
          {error}
        </div>
      )}

      {/* Dropdown Menu */}
      {showDropdown && !disabled && !updating && (
        <>
          {/* Click outside overlay */}
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown content */}
          <div className={`
            absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30
            ${getDropdownSizeClasses()}
          `}>
            {statusOptions.map((status, index) => (
              <button
                key={status.value}
                onClick={() => updateTaskStatus(status.value)}
                disabled={status.value === currentStatus}
                className={`
                  w-full text-left px-3 py-2 text-sm transition-colors
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === statusOptions.length - 1 ? 'rounded-b-lg' : ''}
                  ${status.value === currentStatus 
                    ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                    : 'hover:bg-gray-50 cursor-pointer'
                  }
                `}
                title={status.description}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {showIcon && (
                      <span className="mr-2">{status.icon}</span>
                    )}
                    <span>{status.label}</span>
                  </div>
                  
                  {status.value === currentStatus && (
                    <span className="text-blue-600 font-medium">✓</span>
                  )}
                </div>
                
                {size === 'large' && (
                  <div className="text-xs text-gray-500 mt-1 ml-6">
                    {status.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Preset variants for common use cases
export const SmallTaskStatusManager: React.FC<Omit<TaskStatusManagerProps, 'size'>> = (props) => {
  return <TaskStatusManager {...props} size="small" />;
};

export const LargeTaskStatusManager: React.FC<Omit<TaskStatusManagerProps, 'size'>> = (props) => {
  return <TaskStatusManager {...props} size="large" />;
};

// Status-only display component (no editing)
export const TaskStatusDisplay: React.FC<{
  status: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}> = ({ status, size = 'medium', showIcon = true }) => {
  const statusData = statusOptions.find(s => s.value === status) || statusOptions[0];
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1 text-xs';
      case 'large':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${statusData.color.replace('hover:', '')}
      ${getSizeClasses()}
    `}>
      {showIcon && (
        <span className="mr-1">{statusData.icon}</span>
      )}
      {statusData.label}
    </span>
  );
};

export default TaskStatusManager;

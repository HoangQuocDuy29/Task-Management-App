// client/src/components/user/tasks/TaskStatusManager.tsx
import React, { useState } from 'react';
import { api } from '../../../utils/api';

interface TaskStatusManagerProps {
  taskId: number;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const statusOptions = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-800', icon: '📋' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: '🔄' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800', icon: '✅' }
];

const TaskStatusManager: React.FC<TaskStatusManagerProps> = ({
  taskId,
  currentStatus,
  onStatusUpdate,
  disabled = false,
  size = 'medium'
}) => {
  const [updating, setUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const updateTaskStatus = async (newStatus: string) => {
    if (newStatus === currentStatus || updating || disabled) return;

    try {
      setUpdating(true);
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      onStatusUpdate(newStatus);
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const currentStatusData = statusOptions.find(s => s.value === currentStatus) || statusOptions[0];

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'px-2 py-1 text-xs';
      case 'large': return 'px-4 py-2 text-sm';
      default: return 'px-3 py-1 text-sm';
    }
  };

  return (
    <div className="relative">
      {/* Current Status Button */}
      <button
        onClick={() => !disabled && !updating && setShowDropdown(!showDropdown)}
        disabled={disabled || updating}
        className={`
          inline-flex items-center rounded-full font-medium transition-colors
          ${currentStatusData.color}
          ${getSizeClasses()}
          ${disabled || updating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}
        `}
        aria-label={`Change status from ${currentStatusData.label}`}
      >
        <span className="mr-1" aria-hidden="true">{currentStatusData.icon}</span>
        {updating ? 'Updating...' : currentStatusData.label}
        {!disabled && !updating && <span className="ml-1 opacity-60">▼</span>}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && !disabled && !updating && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setShowDropdown(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[140px]">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => updateTaskStatus(status.value)}
                disabled={status.value === currentStatus}
                className={`
                  w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg
                  ${status.value === currentStatus 
                    ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                    : 'hover:bg-gray-50 cursor-pointer'
                  }
                `}
                aria-label={`Change status to ${status.label}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2" aria-hidden="true">{status.icon}</span>
                    <span>{status.label}</span>
                  </div>
                  {status.value === currentStatus && (
                    <span className="text-blue-600 font-medium">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Preset size variants
export const SmallTaskStatusManager: React.FC<Omit<TaskStatusManagerProps, 'size'>> = (props) => (
  <TaskStatusManager {...props} size="small" />
);

export const LargeTaskStatusManager: React.FC<Omit<TaskStatusManagerProps, 'size'>> = (props) => (
  <TaskStatusManager {...props} size="large" />
);

export default TaskStatusManager;

// client/src/components/user/tasks/TaskStatusBadge.tsx
import React from 'react';

interface TaskStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  todo: {
    label: 'To Do',
    icon: '📋',
    color: 'bg-gray-100 text-gray-800'
  },
  in_progress: {
    label: 'In Progress', 
    icon: '🔄',
    color: 'bg-blue-100 text-blue-800'
  },
  done: {
    label: 'Done',
    icon: '✅', 
    color: 'bg-green-100 text-green-800'
  },
  overdue: {
    label: 'Overdue',
    icon: '🚨',
    color: 'bg-red-100 text-red-800'
  }
};

const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  size = 'medium',
  showIcon = true,
  className = ''
}) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.todo;
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'large':
        return 'px-3 py-2 text-sm';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${config.color}
      ${getSizeClasses()}
      ${className}
    `}>
      {showIcon && (
        <span className="mr-1" aria-hidden="true">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
};

// Priority Badge variant
export const PriorityBadge: React.FC<Omit<TaskStatusBadgeProps, 'status'> & { priority: string }> = ({
  priority,
  size = 'medium',
  showIcon = true,
  className = ''
}) => {
  const priorityConfig = {
    high: { label: 'High', icon: '🔴', color: 'bg-red-100 text-red-800' },
    medium: { label: 'Medium', icon: '🟡', color: 'bg-yellow-100 text-yellow-800' },
    low: { label: 'Low', icon: '🟢', color: 'bg-green-100 text-green-800' }
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
  
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'large':
        return 'px-3 py-2 text-sm';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium border
      ${config.color}
      ${getSizeClasses()}
      ${className}
    `}>
      {showIcon && (
        <span className="mr-1" aria-hidden="true">{config.icon}</span>
      )}
      {config.label}
    </span>
  );
};

export default TaskStatusBadge;

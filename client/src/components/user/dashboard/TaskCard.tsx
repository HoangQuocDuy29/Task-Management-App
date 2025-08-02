// client/src/components/user/dashboard/TaskCard.tsx
import React, { useState } from 'react';

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline?: string;
    createdAt?: string;
    project?: {
      id: number;
      name: string;
    };
    assignedTo?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
  onTaskClick?: (task: any) => void;
  onStatusUpdate?: (taskId: number, newStatus: string) => void;
  onEdit?: (task: any) => void;
  onDelete?: (taskId: number) => void;
  showActions?: boolean;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskClick,
  onStatusUpdate,
  onEdit,
  onDelete,
  showActions = true,
  compact = false
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return '✅';
      case 'in_progress':
        return '🔄';
      case 'todo':
        return '📋';
      default:
        return '📋';
    }
  };

  const isOverdue = () => {
    if (!task.deadline || task.status === 'done') return false;
    return new Date(task.deadline) < new Date();
  };

  const getDaysUntilDeadline = () => {
    if (!task.deadline) return null;
    const deadline = new Date(task.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const daysUntilDeadline = getDaysUntilDeadline();
  const overdue = isOverdue();

  return (
    <div className={`
      bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
      border border-gray-200 hover:border-gray-300
      ${compact ? 'p-4' : 'p-6'}
      ${overdue ? 'border-l-4 border-l-red-500' : ''}
      relative group
    `}>
      {/* Priority Indicator */}
      <div className="absolute top-2 right-2">
        <span className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
          ${getPriorityColor(task.priority)}
        `}>
          {task.priority}
        </span>
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute top-2 right-16 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Open task actions menu"
            title="More actions"
          >
            ⋮
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-1 z-20 min-w-[140px] border">
                <button 
                  onClick={() => {
                    onTaskClick?.(task);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  aria-label="View task details"
                >
                  📋 View Details
                </button>
                {onEdit && (
                  <button 
                    onClick={() => {
                      onEdit(task);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    aria-label="Edit task"
                  >
                    ✏️ Edit Task
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    aria-label="Delete task"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Task Header */}
      <div className="mb-3">
        <h3 
          className={`
            font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors
            ${compact ? 'text-base' : 'text-lg'}
            pr-20
          `}
          onClick={() => onTaskClick?.(task)}
          title={task.title}
        >
          {compact ? truncateText(task.title, 50) : task.title}
        </h3>
        
        {/* Project Badge */}
        {task.project && (
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
              📁 {task.project.name}
            </span>
          </div>
        )}
      </div>

      {/* Task Description */}
      <p className={`
        text-gray-600 mb-4 leading-relaxed
        ${compact ? 'text-sm line-clamp-2' : 'text-sm line-clamp-3'}
      `}>
        {compact ? truncateText(task.description, 100) : task.description}
      </p>

      {/* Status and Deadline Row */}
      <div className="flex justify-between items-center mb-4">
        {/* Status Badge */}
        <span className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${getStatusColor(task.status)}
        `}>
          <span className="mr-1" aria-hidden="true">{getStatusIcon(task.status)}</span>
          {task.status.replace('_', ' ')}
        </span>
        
        {/* Deadline */}
        {task.deadline && (
          <div className={`
            text-xs px-2 py-1 rounded
            ${overdue 
              ? 'bg-red-100 text-red-800 font-medium' 
              : daysUntilDeadline !== null && daysUntilDeadline <= 3
                ? 'bg-yellow-100 text-yellow-800 font-medium'
                : 'bg-gray-100 text-gray-600'
            }
          `}>
            {overdue ? (
              <>🚨 Overdue</>
            ) : daysUntilDeadline !== null && daysUntilDeadline <= 3 ? (
              <>⏰ {daysUntilDeadline} days left</>
            ) : (
              <>📅 {formatDate(task.deadline)}</>
            )}
          </div>
        )}
      </div>

      {/* Task Metadata */}
      {!compact && (
        <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {task.assignedTo && (
              <span title={`Assigned to ${task.assignedTo.firstName} ${task.assignedTo.lastName}`}>
                👤 {task.assignedTo.firstName} {task.assignedTo.lastName}
              </span>
            )}
            {task.createdAt && (
              <span title={`Created on ${formatDate(task.createdAt)}`}>
                📅 Created {formatDate(task.createdAt)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions (Bottom) */}
      {showActions && !compact && (
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onTaskClick?.(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            aria-label="View task details"
          >
            View Details →
          </button>
          
          <div className="flex space-x-2">
            {task.status !== 'done' && onStatusUpdate && (
              <button
                onClick={() => onStatusUpdate(task.id, 'done')}
                className="text-green-600 hover:text-green-800 text-sm transition-colors"
                aria-label="Mark task as done"
              >
                ✅ Mark Done
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                aria-label="Edit task"
              >
                ✏️ Edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overdue Warning */}
      {overdue && (
        <div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
          title="This task is overdue"
        ></div>
      )}
    </div>
  );
};

// Compact variant for list views
export const CompactTaskCard: React.FC<TaskCardProps> = (props) => {
  return <TaskCard {...props} compact={true} />;
};

export default TaskCard;

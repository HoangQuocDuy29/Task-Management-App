// client/src/components/user/tasks/TaskDetailModal.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import TaskStatusManager from './TaskStatusManager';
import { ErrorMessage } from '../shared/ErrorMessage';

interface TaskDetailModalProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline?: string;
    createdAt: string;
    project?: {
      id: number;
      name: string;
    };
    assignedTo?: {
      id: number;
      firstName: string;
      lastName: string;
    };
    createdBy?: {
      id: number;
      firstName: string;
      lastName: string;
    };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate: (updatedTask: any) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onTaskUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // ✅ Initialize form data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/tasks/${task.id}`, formData);
      const updatedTask = response.data.data;
      
      onTaskUpdate(updatedTask);
      setEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    const updatedTask = { ...task, status: newStatus };
    onTaskUpdate(updatedTask);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      {/* ✅ Click outside to close */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* ✅ Enhanced modal content */}
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="flex-1 mr-4">
            {editing ? (
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-bold text-gray-900 w-full border-0 focus:ring-0 p-0 bg-transparent"
                placeholder="Task title..."
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
            )}
            
            {/* Task metadata */}
            <div className="flex items-center space-x-4 mt-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
              
              <TaskStatusManager
                taskId={task.id}
                currentStatus={task.status}
                onStatusUpdate={handleStatusUpdate}
                size="small"
              />
              
              {task.deadline && (
                <span className="text-xs text-gray-500">
                  Due: {new Date(task.deadline).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? '⏳' : '💾'} Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
              >
                ✏️ Edit
              </button>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* ✅ Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            {/* Error display */}
            {error && (
              <ErrorMessage 
                message={error} 
                type="error" 
                onDismiss={() => setError(null)}
                className="mb-4"
              />
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              {editing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Task description..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              )}
            </div>
            
            {/* Task details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium capitalize">
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Deadline:</span>
                      <span className="font-medium">
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment</h3>
                <div className="space-y-3 text-sm">
                  {task.project && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Project:</span>
                      <span className="font-medium">{task.project.name}</span>
                    </div>
                  )}
                  {task.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned to:</span>
                      <span className="font-medium">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </span>
                    </div>
                  )}
                  {task.createdBy && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created by:</span>
                      <span className="font-medium">
                        {task.createdBy.firstName} {task.createdBy.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd> to close
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

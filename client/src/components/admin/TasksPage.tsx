// ============================================
// 📁 FILE: client/src/components/tasks/TasksPage.tsx
// 🎯 PURPOSE: Tasks management page - CRUD operations only
// ✏️ ACTION: CẬP NHẬT - Tách form và filter ra ngoài
// ============================================

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, User as UserIcon, Folder, AlertCircle } from 'lucide-react';
import { useTask } from '../../hooks/useTask';
import { useUser } from '../../hooks/useUser';
import { TaskFilter } from '../filters/index';
import TaskForm from '../forms/TaskForm';
import Pagination from '../shared/Pagination';
import ConfirmDialog from '../shared/ConfirmDialog';
import { 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  SUCCESS_MESSAGES,
  CONFIRM_MESSAGES 
} from '../../utils/constants';
import type { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  User 
} from '../../types';


const TasksPage: React.FC = () => {
  const {
    tasks,
    loading,
    creating,
    updating,
    deleting,
    error,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  } = useTask();

  // Get users for task assignment and filter
  const { users } = useUser();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Handle create task
  const handleCreateTask = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    const result = await createTask(data as CreateTaskRequest);
    if (result) {
      setShowCreateModal(false);
    }
  };

  // Handle update task
  const handleUpdateTask = async (data: CreateTaskRequest | UpdateTaskRequest) => {
    if (!editingTask) return;
    
    const result = await updateTask(editingTask.id, data as UpdateTaskRequest);
    if (result) {
      setEditingTask(null);
    }
  };

  // Handle delete task
  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    
    const success = await deleteTask(deletingTask.id);
    if (success) {
      setDeletingTask(null);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add search logic here
  };

  // Handle filter
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    // Add filter logic here
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
    // Add clear logic here
  };

  // Format deadline display
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return 'No deadline';
    
    const date = new Date(deadline);
    const now = new Date();
    const isOverdue = date < now;
    const isToday = date.toDateString() === now.toDateString();
    
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    
    if (isOverdue) {
      return <span className="text-red-600 font-medium">{formatted} (Overdue)</span>;
    } else if (isToday) {
      return <span className="text-orange-600 font-medium">{formatted} (Today)</span>;
    }
    
    return formatted;
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage tasks for your team
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Search and Filters */}
      <TaskFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClear={handleClearFilters}
        users={users}
      />

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading tasks...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task: Task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-sm text-gray-500 truncate mt-1">
                              {task.description}
                            </div>
                          )}
                          {task.project && (
                            <div className="flex items-center mt-1">
                              <Folder className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {task.project.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {task.assignedTo?.firstName?.charAt(0)}
                              {task.assignedTo?.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {task.assignedTo?.firstName} {task.assignedTo?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.assignedTo?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[task.status as keyof typeof STATUS_COLORS]}`}>
                        {task.status === 'todo' ? 'To Do' : 
                         task.status === 'in_progress' ? 'In Progress' : 'Done'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDeadline(task.deadline)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTask(task)}
                          disabled={updating}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Edit task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTask(task)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && tasks.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || Object.keys(filters).length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating a new task.'}
              </p>
              {(!searchQuery && Object.keys(filters).length === 0) && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
                <p className="text-sm text-gray-500">Add a new task to the system.</p>
              </div>
              
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateModal(false)}
                loading={creating}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setEditingTask(null)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
                <p className="text-sm text-gray-500">Update task information.</p>
              </div>
              
              <TaskForm
                task={editingTask}
                onSubmit={handleUpdateTask}
                onCancel={() => setEditingTask(null)}
                loading={updating}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This will also affect related tickets and work logs.`}
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default TasksPage;

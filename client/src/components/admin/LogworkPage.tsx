// ============================================
// 📁 FILE: client/src/components/logwork/LogworkPage.tsx
// 🎯 PURPOSE: Logwork management page - CRUD operations only
// 🆕 ACTION: TẠO MỚI trong client/src/components/logwork/
// ============================================

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock, User as UserIcon, Calendar, AlertCircle } from 'lucide-react';
import { useLogwork } from '../../hooks/useLogwork';
import { useUser } from '../../hooks/useUser';
import { useTask } from '../../hooks/useTask';
import { LogworkFilter } from '../filters/index';
import LogworkForm from '../forms/LogworkForm';
import Pagination from '../shared/Pagination';
import ConfirmDialog from '../shared/ConfirmDialog';
import { SUCCESS_MESSAGES, CONFIRM_MESSAGES } from '../../utils/constants';
import type { 
  Logwork, 
  CreateLogworkRequest, 
  UpdateLogworkRequest,
  User,
  Task 
} from '../../types';

const LogworkPage: React.FC = () => {
  const {
    logwork,
    loading,
    creating,
    updating,
    deleting,
    error,
    createLogwork,
    updateLogwork,
    deleteLogwork,
    clearError,
  } = useLogwork();

  // Get users and tasks for logwork form and filter
  const { users } = useUser();
  const { tasks } = useTask();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLogwork, setEditingLogwork] = useState<Logwork | null>(null);
  const [deletingLogwork, setDeletingLogwork] = useState<Logwork | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Handle create logwork
  const handleCreateLogwork = async (data: CreateLogworkRequest | UpdateLogworkRequest) => {
    const result = await createLogwork(data as CreateLogworkRequest);
    if (result) {
      setShowCreateModal(false);
    }
  };

  // Handle update logwork
  const handleUpdateLogwork = async (data: CreateLogworkRequest | UpdateLogworkRequest) => {
    if (!editingLogwork) return;
    
    const result = await updateLogwork(editingLogwork.id, data as UpdateLogworkRequest);
    if (result) {
      setEditingLogwork(null);
    }
  };

  // Handle delete logwork
  const handleDeleteLogwork = async () => {
    if (!deletingLogwork) return;
    
    const success = await deleteLogwork(deletingLogwork.id);
    if (success) {
      setDeletingLogwork(null);
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

  // Format hours display
  const formatHours = (hours: number): string => {
    if (hours === 1) return '1 hour';
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    return `${hours} hours`;
  };

  // Format work date display
  const formatWorkDate = (workDate: string) => {
    const date = new Date(workDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return <span className="text-indigo-600 font-medium">Today</span>;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return <span className="text-orange-600 font-medium">Yesterday</span>;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Calculate total hours for current view
  const totalHours = logwork.reduce((sum, entry) => sum + entry.hoursWorked, 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Work Log Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage time worked on tasks
          </p>
          {logwork.length > 0 && (
            <div className="mt-2 flex items-center text-sm text-indigo-600">
              <Clock className="w-4 h-4 mr-1" />
              Total: {formatHours(totalHours)}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Work
        </button>
      </div>

      {/* Search and Filters */}
      <LogworkFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClear={handleClearFilters}
        users={users}
        tasks={tasks}
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

      {/* Logwork Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2 text-gray-600">Loading work logs...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logwork.map((entry: Logwork) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {entry.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {entry.task?.title || `Task #${entry.taskId}`}
                      </div>
                      {entry.task?.project && (
                        <div className="text-sm text-gray-500">
                          Project: {entry.task.project.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {entry.user?.firstName?.charAt(0)}
                              {entry.user?.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.user?.firstName} {entry.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {entry.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-indigo-600">
                          {formatHours(entry.hoursWorked)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatWorkDate(entry.workDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingLogwork(entry)}
                          disabled={updating}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          title="Edit work log"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingLogwork(entry)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete work log"
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

          {!loading && logwork.length === 0 && (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No work logs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || Object.keys(filters).length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by logging your first work entry.'}
              </p>
              {(!searchQuery && Object.keys(filters).length === 0) && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Work
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Logwork Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Log Work</h3>
                <p className="text-sm text-gray-500">Record time spent on a task.</p>
              </div>
              
              <LogworkForm
                onSubmit={handleCreateLogwork}
                onCancel={() => setShowCreateModal(false)}
                loading={creating}
                tasks={tasks}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Logwork Modal */}
      {editingLogwork && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setEditingLogwork(null)} />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Work Log</h3>
                <p className="text-sm text-gray-500">Update work log information.</p>
              </div>
              
              <LogworkForm
                logwork={editingLogwork}
                onSubmit={handleUpdateLogwork}
                onCancel={() => setEditingLogwork(null)}
                loading={updating}
                tasks={tasks}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingLogwork}
        onClose={() => setDeletingLogwork(null)}
        onConfirm={handleDeleteLogwork}
        title="Delete Work Log"
        message={`Are you sure you want to delete this work log entry (${deletingLogwork ? formatHours(deletingLogwork.hoursWorked) : ''})? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default LogworkPage;

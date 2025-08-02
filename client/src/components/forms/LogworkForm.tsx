// ============================================
// 📁 FILE: client/src/components/forms/LogworkForm.tsx
// 🎯 PURPOSE: Simple logwork form component - CODE NGẮN
// 🆕 ACTION: TẠO MỚI trong client/src/components/forms/
// ============================================

import React, { useState } from 'react';
import type { 
  Logwork, 
  CreateLogworkRequest, 
  UpdateLogworkRequest, 
  Task 
} from '../../types';

interface LogworkFormProps {
  logwork?: Logwork;
  onSubmit: (data: CreateLogworkRequest | UpdateLogworkRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  tasks: Task[];
}

const LogworkForm: React.FC<LogworkFormProps> = ({ 
  logwork, 
  onSubmit, 
  onCancel, 
  loading = false,
  tasks 
}) => {
  const [formData, setFormData] = useState({
    description: logwork?.description || '',
    hoursWorked: logwork?.hoursWorked?.toString() || '',
    workDate: logwork?.workDate ? logwork.workDate.split('T')[0] : new Date().toISOString().split('T')[0],
    taskId: logwork?.taskId?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      description: formData.description,
      hoursWorked: Number(formData.hoursWorked),
      workDate: formData.workDate,
      taskId: Number(formData.taskId),
    };

    await onSubmit(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="What work was done..."
        />
      </div>

      {/* Hours & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hours *
          </label>
          <input
            type="number"
            name="hoursWorked"
            value={formData.hoursWorked}
            onChange={handleChange}
            required
            min="0.1"
            max="24"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="8.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            name="workDate"
            value={formData.workDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={'a'}
          />
        </div>
      </div>

      {/* Task Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task *
        </label>
        <select
          name="taskId"
          value={formData.taskId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={'a'}
        >
          <option value="">Select task...</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (logwork ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default LogworkForm;
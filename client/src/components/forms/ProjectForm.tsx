// ============================================
// 📁 FILE: client/src/components/forms/ProjectForm.tsx
// 🎯 PURPOSE: Simple project form component - CODE NGẮN
// 🆕 ACTION: TẠO MỚI trong client/src/components/forms/
// ============================================

import React, { useState } from 'react';
import type { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  User
} from '../../types';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  users: User[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  project, 
  onSubmit, 
  onCancel, 
  loading = false,
  users
}) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    assignedUserIds: project?.assignedUserIds || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      name: formData.name,
      description: formData.description,
      assignedUserIds: formData.assignedUserIds,
    };

    await onSubmit(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserSelection = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.includes(userId)
        ? prev.assignedUserIds.filter(id => id !== userId)
        : [...prev.assignedUserIds, userId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Project name..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Project description..."
        />
      </div>

      {/* Assigned Users */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned Users
        </label>
        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
          {users.map((user) => (
            <label key={user.id} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.assignedUserIds.includes(user.id)}
                onChange={() => handleUserSelection(user.id)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {user.firstName} {user.lastName} ({user.email})
              </span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formData.assignedUserIds.length} user(s) selected
        </p>
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
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (project ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
// ============================================
// 📁 FILE: client/src/components/projects/ProjectsPage.tsx
// 🎯 PURPOSE: Projects management page - CRUD operations only
// 🆕 ACTION: TẠO MỚI trong client/src/components/projects/
// ============================================

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Folder, AlertCircle } from 'lucide-react';
import { useProject } from '../../hooks/useProject';
import { useUser } from '../../hooks/useUser';
import { ProjectFilter } from '../filters/index';
import ProjectForm from '../forms/ProjectForm';
import Pagination from '../shared/Pagination';
import ConfirmDialog from '../shared/ConfirmDialog';
import { SUCCESS_MESSAGES, CONFIRM_MESSAGES } from '../../utils/constants';
import type { 
  Project, 
  CreateProjectRequest, 
  UpdateProjectRequest,
  User 
} from '../../types';

const ProjectsPage: React.FC = () => {
  const {
    projects,
    loading,
    creating,
    updating,
    deleting,
    error,
    createProject,
    updateProject,
    deleteProject,
    clearError,
  } = useProject();

  // Get users for project assignment and filter
  const { users } = useUser();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Handle create project
  const handleCreateProject = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    const result = await createProject(data as CreateProjectRequest);
    if (result) {
      setShowCreateModal(false);
    }
  };

  // Handle update project
  const handleUpdateProject = async (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (!editingProject) return;
    
    const result = await updateProject(editingProject.id, data as UpdateProjectRequest);
    if (result) {
      setEditingProject(null);
    }
  };

  // Handle delete project
  const handleDeleteProject = async () => {
    if (!deletingProject) return;
    
    const success = await deleteProject(deletingProject.id);
    if (success) {
      setDeletingProject(null);
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

  // Format assigned users display
  const formatAssignedUsers = (assignedUsers: User[]) => {
    if (!assignedUsers || assignedUsers.length === 0) {
      return <span className="text-gray-400">No users assigned</span>;
    }
    
    if (assignedUsers.length <= 3) {
      return (
        <div className="flex items-center space-x-1">
          {assignedUsers.map((user, index) => (
            <div
              key={user.id}
              className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center"
              title={`${user.firstName} ${user.lastName}`}
            >
              <span className="text-xs font-medium text-white">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        {assignedUsers.slice(0, 2).map((user) => (
          <div
            key={user.id}
            className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center"
            title={`${user.firstName} ${user.lastName}`}
          >
            <span className="text-xs font-medium text-white">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
        ))}
        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center">
          <span className="text-xs font-medium text-white">
            +{assignedUsers.length - 2}
          </span>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage projects for your organization
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </button>
      </div>

      {/* Search and Filters */}
      <ProjectFilter
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

      {/* Projects Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Loading projects...</span>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project: Project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Folder className="w-5 h-5 text-purple-500 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {project.name}
                          </div>
                          {project.description && (
                            <div className="text-sm text-gray-500 truncate mt-1">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        {formatAssignedUsers(project.assignedUsers || [])}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {project.createdBy?.firstName?.charAt(0)}
                              {project.createdBy?.lastName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {project.createdBy?.firstName} {project.createdBy?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {project.createdBy?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProject(project)}
                          disabled={updating}
                          className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete project"
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

          {!loading && projects.length === 0 && (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || Object.keys(filters).length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating a new project.'}
              </p>
              {(!searchQuery && Object.keys(filters).length === 0) && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Project</h3>
                <p className="text-sm text-gray-500">Add a new project to the system.</p>
              </div>
              
              <ProjectForm
                onSubmit={handleCreateProject}
                onCancel={() => setShowCreateModal(false)}
                loading={creating}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setEditingProject(null)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Project</h3>
                <p className="text-sm text-gray-500">Update project information.</p>
              </div>
              
              <ProjectForm
                project={editingProject}
                onSubmit={handleUpdateProject}
                onCancel={() => setEditingProject(null)}
                loading={updating}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete project "${deletingProject?.name}"? This will also affect related tasks and work logs.`}
        confirmText="Delete"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default ProjectsPage;

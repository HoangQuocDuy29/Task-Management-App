// client/src/components/user/tasks/TaskFilter.tsx
import React, { useState } from 'react';

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilters) => void;
  taskCounts?: {
    all: number;
    todo: number;
    in_progress: number;
    done: number;
    overdue: number;
  };
  availableProjects?: Array<{
    id: number;
    name: string;
  }>;
}

export interface TaskFilters {
  status: 'all' | 'todo' | 'in_progress' | 'done' | 'overdue';
  priority: 'all' | 'low' | 'medium' | 'high';
  projectId: number | null;
  search: string;
  sortBy: 'title' | 'priority' | 'deadline' | 'created';
  sortOrder: 'asc' | 'desc';
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  onFilterChange,
  taskCounts = { all: 0, todo: 0, in_progress: 0, done: 0, overdue: 0 },
  availableProjects = []
}) => {
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    projectId: null,
    search: '',
    sortBy: 'created',
    sortOrder: 'desc'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof TaskFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: TaskFilters = {
      status: 'all',
      priority: 'all',
      projectId: null,
      search: '',
      sortBy: 'created',
      sortOrder: 'desc'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.projectId !== null ||
    filters.search !== '' ||
    filters.sortBy !== 'created' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search tasks"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Tasks', count: taskCounts.all, color: 'bg-gray-100 text-gray-800' },
          { key: 'todo', label: 'To Do', count: taskCounts.todo, color: 'bg-gray-100 text-gray-700' },
          { key: 'in_progress', label: 'In Progress', count: taskCounts.in_progress, color: 'bg-blue-100 text-blue-800' },
          { key: 'done', label: 'Done', count: taskCounts.done, color: 'bg-green-100 text-green-800' },
          { key: 'overdue', label: 'Overdue', count: taskCounts.overdue, color: 'bg-red-100 text-red-800' }
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => updateFilter('status', status.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filters.status === status.key
                ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                : `${status.color} hover:opacity-80`
            }`}
            aria-label={`Filter by ${status.label}`}
          >
            {status.label}
            <span className="ml-1 text-xs opacity-75">({status.count})</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Toggle advanced filters"
        >
          <svg 
            className={`h-4 w-4 mr-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced Filters
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Clear all filters"
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              value={filters.projectId || ''}
              onChange={(e) => updateFilter('projectId', e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Filter by project"
            >
              <option value="">All Projects</option>
              {availableProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  📁 {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                aria-label="Sort by field"
              >
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="deadline">Deadline</option>
                <option value="created">Created Date</option>
              </select>
              <button
                onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className={`px-3 py-2 border border-gray-300 rounded-md text-sm transition-colors ${
                  filters.sortOrder === 'asc' 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                aria-label={`Sort ${filters.sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                title={`Currently sorting ${filters.sortOrder === 'asc' ? 'ascending' : 'descending'}`}
              >
                {filters.sortOrder === 'asc' ? '📈' : '📉'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500 self-center">Active filters:</span>
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              Status: {filters.status.replace('_', ' ')}
              <button
                onClick={() => updateFilter('status', 'all')}
                className="ml-1 text-blue-600 hover:text-blue-800"
                aria-label="Remove status filter"
              >
                ×
              </button>
            </span>
          )}

          {filters.priority !== 'all' && (
            <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
              Priority: {filters.priority}
              <button
                onClick={() => updateFilter('priority', 'all')}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
                aria-label="Remove priority filter"
              >
                ×
              </button>
            </span>
          )}

          {filters.projectId && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
              Project: {availableProjects.find(p => p.id === filters.projectId)?.name}
              <button
                onClick={() => updateFilter('projectId', null)}
                className="ml-1 text-purple-600 hover:text-purple-800"
                aria-label="Remove project filter"
              >
                ×
              </button>
            </span>
          )}

          {filters.search && (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
              Search: "{filters.search}"
              <button
                onClick={() => updateFilter('search', '')}
                className="ml-1 text-green-600 hover:text-green-800"
                aria-label="Remove search filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilter;

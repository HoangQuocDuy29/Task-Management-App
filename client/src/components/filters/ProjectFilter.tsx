// ============================================
// 📁 FILE: client/src/components/filters/ProjectFilter.tsx
// 🎯 PURPOSE: Simple filter component for projects - CODE NGẮN
// 🆕 ACTION: TẠO MỚI trong client/src/components/filters/
// ============================================

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { User } from '../../types';

interface ProjectFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  onClear: () => void;
  users?: User[]; // For created by filter
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ onSearch, onFilter, onClear, users = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCreatedByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const createdBy = e.target.value;
    setCreatedByFilter(createdBy);
    
    const filters: Record<string, any> = {};
    if (createdBy) filters.createdById = Number(createdBy);
    
    onFilter(filters);
  };

  const handleClear = () => {
    setSearchQuery('');
    setCreatedByFilter('');
    setShowFilters(false);
    onClear();
  };

  const hasActiveFilters = searchQuery || createdByFilter;

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search projects by name or description..."
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={'a'}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Toggle & Clear */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                1
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created By
              </label>
              <select
                value={createdByFilter}
                onChange={handleCreatedByChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={'a'}
              >
                <option value="">All Creators</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilter;
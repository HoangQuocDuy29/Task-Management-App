// ============================================
// 📁 FILE: client/src/components/filters/LogworkFilter.tsx
// 🎯 PURPOSE: Simple filter component for logwork - CODE NGẮN
// 🆕 ACTION: TẠO MỚI trong client/src/components/filters/
// ============================================

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { User, Task } from '../../types';

interface LogworkFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  onClear: () => void;
  users?: User[]; // For user filter
  tasks?: Task[]; // For task filter
}

const LogworkFilter: React.FC<LogworkFilterProps> = ({ 
  onSearch, 
  onFilter, 
  onClear, 
  users = [], 
  tasks = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [taskFilter, setTaskFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = () => {
    const filters: Record<string, any> = {};
    
    if (userFilter) filters.userId = Number(userFilter);
    if (taskFilter) filters.taskId = Number(taskFilter);
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    
    onFilter(filters);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserFilter(e.target.value);
    setTimeout(handleFilterChange, 0);
  };

  const handleTaskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaskFilter(e.target.value);
    setTimeout(handleFilterChange, 0);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setTimeout(handleFilterChange, 0);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setTimeout(handleFilterChange, 0);
  };

  const handleClear = () => {
    setSearchQuery('');
    setUserFilter('');
    setTaskFilter('');
    setStartDate('');
    setEndDate('');
    setShowFilters(false);
    onClear();
  };

  const activeFiltersCount = [userFilter, taskFilter, startDate, endDate].filter(Boolean).length;
  const hasActiveFilters = searchQuery || activeFiltersCount > 0;

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
            placeholder="Search work descriptions..."
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
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <select
                value={userFilter}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={'a'}
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task
              </label>
              <select
                value={taskFilter}
                onChange={handleTaskChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={'a'}
              >
                <option value="">All Tasks</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={'a'}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={'a'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogworkFilter;
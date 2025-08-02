// ============================================
// 📁 FILE: client/src/components/shared/SearchFilter.tsx
// 🎯 PURPOSE: Reusable search and filter component
// 🆕 ACTION: TẠO MỚI
// ============================================

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { UI } from '../../utils/constants';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'text' | 'date';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Record<string, any>) => void;
  onClear: () => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  showFilters?: boolean;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilter,
  onClear,
  searchPlaceholder = 'Search...',
  filterOptions = [],
  showFilters = true,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, UI.DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  // Update active filters count
  useEffect(() => {
    const count = Object.values(filters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null && value !== undefined;
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setFilters({});
    setActiveFiltersCount(0);
    onClear();
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.key] || '';

    switch (option.type) {
      case 'select':
        return (
          <select
            key={option.key}
            value={value}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={'a'}
          >
            <option value="">All {option.label}</option>
            {option.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div key={option.key} className="relative">
            <select
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                handleFilterChange(option.key, selectedValues);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={'a'}
              size={Math.min(4, option.options?.length || 4)}
            >
              {option.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'date':
        return (
          <input
            key={option.key}
            type="date"
            value={value}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={option.placeholder}
          />
        );

      case 'text':
      default:
        return (
          <input
            key={option.key}
            type="text"
            value={value}
            onChange={(e) => handleFilterChange(option.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={option.placeholder || `Filter by ${option.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Search Bar */}
      <div className="p-4">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={searchPlaceholder}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={'a'}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Filter Toggle & Clear */}
          <div className="flex gap-2">
            {showFilters && filterOptions.length > 0 && (
              <button
                onClick={toggleFilterPanel}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  showFilterPanel || activeFiltersCount > 0
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
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
              </button>
            )}

            {(searchQuery || activeFiltersCount > 0) && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && filterOptions.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filterOptions.map((option) => (
                <div key={option.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                  {renderFilterInput(option)}
                </div>
              ))}
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    
                    const option = filterOptions.find(opt => opt.key === key);
                    if (!option) return null;

                    const displayValue = Array.isArray(value) 
                      ? value.length > 1 
                        ? `${value.length} selected`
                        : value[0]
                      : value;

                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {option.label}: {displayValue}
                        <button
                          onClick={() => handleFilterChange(key, Array.isArray(value) ? [] : '')}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          aria-label={'a'}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
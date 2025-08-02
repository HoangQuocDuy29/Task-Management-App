// ============================================
// 📁 FILE: client/src/utils/constants.ts
// 🎯 PURPOSE: Constants matching Backend Entity Schema
// 🆕 ACTION: TẠO MỚI trong client/src/utils/
// ============================================

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    CHANGE_ROLE: (id: number) => `/users/${id}/role`,
  },
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: number) => `/tasks/${id}`,
    BY_USER: (userId: number) => `/tasks/user/${userId}`,
  },
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id: number) => `/projects/${id}`,
    ASSIGN_USER: (id: number) => `/projects/${id}/assign-user`,
  },
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id: number) => `/tickets/${id}`,
  },
  LOGWORK: {
    BASE: '/logwork',
    BY_ID: (id: number) => `/logwork/${id}`,
  },
} as const;

// Entity Enums (matching Backend exactly)
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  USER: 'user' as const,
};

export const TASK_STATUS = {
  TODO: 'todo' as const,
  IN_PROGRESS: 'in_progress' as const,
  DONE: 'done' as const, // Note: BE uses 'done', not 'completed'
};

export const TASK_PRIORITY = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
};

export const TICKET_TYPES = {
  BUG: 'bug' as const,
  FEATURE: 'feature' as const,
  IMPROVEMENT: 'improvement' as const,
};

export const TICKET_STATUS = {
  OPEN: 'open' as const,
  IN_PROGRESS: 'in_progress' as const,
  RESOLVED: 'resolved' as const,
  CLOSED: 'closed' as const,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5,
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  HOURS_MIN: 0.1,
  HOURS_MAX: 24,
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
} as const;

// Status Colors (matching exact enum values)
export const STATUS_COLORS = {
  // Task Status
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800', // 'done' not 'completed'
  
  // Ticket Status  
  open: 'bg-red-100 text-red-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
} as const;

// Role Colors
export const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800',
  user: 'bg-green-100 text-green-800',
} as const;

// Type Colors (Ticket Types)
export const TYPE_COLORS = {
  bug: 'bg-red-100 text-red-800',
  feature: 'bg-blue-100 text-blue-800',
  improvement: 'bg-green-100 text-green-800',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'task_management_token',
  USER: 'task_management_user',
  PREFERENCES: 'task_management_preferences',
  THEME: 'task_management_theme',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully!',
  USER_UPDATED: 'User updated successfully!',
  USER_DELETED: 'User deleted successfully!',
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  PROJECT_CREATED: 'Project created successfully!',
  PROJECT_UPDATED: 'Project updated successfully!',
  PROJECT_DELETED: 'Project deleted successfully!',
  TICKET_CREATED: 'Ticket created successfully!',
  TICKET_UPDATED: 'Ticket updated successfully!',
  TICKET_DELETED: 'Ticket deleted successfully!',
  LOGWORK_CREATED: 'Work logged successfully!',
  LOGWORK_UPDATED: 'Work log updated successfully!',
  LOGWORK_DELETED: 'Work log deleted successfully!',
  LOGIN: 'Login successful!',
  LOGOUT: 'Logout successful!',
} as const;

// Confirmation Messages
export const CONFIRM_MESSAGES = {
  DELETE_USER: 'Are you sure you want to delete this user? This action cannot be undone.',
  DELETE_TASK: 'Are you sure you want to delete this task? This will also affect related tickets and work logs.',
  DELETE_PROJECT: 'Are you sure you want to delete this project? All associated tasks will be affected.',
  DELETE_TICKET: 'Are you sure you want to delete this ticket?',
  DELETE_LOGWORK: 'Are you sure you want to delete this work log entry?',
  CHANGE_ROLE: 'Are you sure you want to change this user\'s role?',
  LOGOUT: 'Are you sure you want to logout?',
} as const;

// Menu Items for Sidebar
export const MENU_ITEMS = [
  {
    id: 'users',
    label: 'Users',
    icon: 'Users',
    path: '/admin/users',
    permission: 'admin',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'CheckSquare',
    path: '/admin/tasks',
    permission: 'admin',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'Folder',
    path: '/admin/projects',
    permission: 'admin',
  },
  {
    id: 'tickets',
    label: 'Tickets',
    icon: 'Ticket',
    path: '/admin/tickets',
    permission: 'admin',
  },
  {
    id: 'logwork',
    label: 'Logwork',
    icon: 'Clock',
    path: '/admin/logwork',
    permission: 'admin',
  },
] as const;

// Filter Options (matching BE enums)
export const FILTER_OPTIONS = {
  TASK_PRIORITY: [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ],
  TASK_STATUS: [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }, // Matching BE enum
  ],
  TICKET_STATUS: [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ],
  TICKET_TYPES: [
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'improvement', label: 'Improvement' },
  ],
  USER_ROLES: [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ],
} as const;

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_SORT: {
    field: 'createdAt',
    direction: 'desc' as const,
  },
  ACTIONS_WIDTH: '120px',
  CHECKBOX_WIDTH: '48px',
} as const;

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  TOAST: 3000,
  MODAL: 200,
  DROPDOWN: 150,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Business Logic Constants
export const BUSINESS_RULES = {
  // Task Rules
  TASK_REQUIRES_PROJECT: false, // Tasks can exist without projects (project is optional)
  TASK_REQUIRES_ASSIGNEE: true, // Tasks must have assignedTo user
  
  // Project Rules
  PROJECT_REQUIRES_USERS: false, // Projects can exist without assigned users
  
  // Ticket Rules
  TICKET_REQUIRES_TASK: true, // Tickets must belong to a task
  
  // Logwork Rules
  LOGWORK_REQUIRES_TASK: true, // Logwork must belong to a task
  LOGWORK_REQUIRES_USER: true, // Logwork must belong to a user
  
  // Role Permissions
  ADMIN_CAN_CRUD_ALL: true,
  USER_CAN_VIEW_OWN_ONLY: true,
} as const;

// Display Labels
export const LABELS = {
  TASK_STATUS: {
    todo: 'To Do',
    in_progress: 'In Progress', 
    done: 'Done',
  },
  TASK_PRIORITY: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
  TICKET_STATUS: {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved', 
    closed: 'Closed',
  },
  TICKET_TYPES: {
    bug: 'Bug',
    feature: 'Feature',
    improvement: 'Improvement',
  },
  USER_ROLES: {
    admin: 'Administrator',
    user: 'User',
  },
} as const;
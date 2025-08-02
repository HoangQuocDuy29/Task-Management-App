// client/src/components/user/layout/UserSidebar.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  onLogout: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  description: string;
  badge?: string | number;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/user',
    icon: '📊',
    description: 'Overview of your tasks and progress'
  },
  {
    name: 'My Tasks',
    href: '/user/tasks',
    icon: '📋',
    description: 'View and manage your assigned tasks'
  },
  {
    name: 'Time Tracking',
    href: '/user/timetracking',
    icon: '⏱️',
    description: 'Log work hours and track time'
  },
  {
    name: 'My Reports',
    href: '/user/reports',
    icon: '📈',
    description: 'View your productivity reports'
  },
  {
    name: 'Calendar',
    href: '/user/calendar',
    icon: '📅',
    description: 'View deadlines and schedule'
  },
  {
    name: 'Messages',
    href: '/user/messages',
    icon: '💬',
    description: 'Team communications',
    badge: '3'
  }
];

const settingsItems: NavigationItem[] = [
  {
    name: 'Profile',
    href: '/user/profile',
    icon: '👤',
    description: 'Manage your profile information'
  },
  {
    name: 'Settings',
    href: '/user/settings',
    icon: '⚙️',
    description: 'App preferences and notifications'
  },
  {
    name: 'Help & Support',
    href: '/user/help',
    icon: '❓',
    description: 'Get help and support'
  }
];

export const UserSidebar: React.FC<UserSidebarProps> = ({
  isOpen,
  onClose,
  user,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isActiveRoute = (href: string) => {
    if (href === '/user') {
      return location.pathname === '/user' || location.pathname === '/user/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const NavItem: React.FC<{ item: NavigationItem }> = ({ item }) => {
    const isActive = isActiveRoute(item.href);
    
    return (
      <button
        onClick={() => handleNavigation(item.href)}
        className={`
          w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group
          ${isActive 
            ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-600' 
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
        style={{ display: 'flex', alignItems: 'center' }} // ✅ FORCE INLINE STYLES
        aria-label={`Navigate to ${item.name}: ${item.description}`}
        title={item.description}
      >
        {/* ✅ CRITICAL FIX: Force icon alignment with absolute positioning */}
        <div 
          className="flex-shrink-0 mr-3"
          style={{ 
            width: '24px', 
            height: '24px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <span className="text-xl" aria-hidden="true">{item.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0" style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">
              {item.name}
            </span>
            {item.badge && (
              <span 
                className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                style={{ flexShrink: 0 }}
              >
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate mt-1">
            {item.description}
          </p>
        </div>
        
        {isActive && (
          <div 
            className="bg-blue-600 rounded-full ml-2"
            style={{ width: '4px', height: '24px', flexShrink: 0 }}
            aria-hidden="true" 
          />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header with proper flex constraints */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">TM</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  Task Manager
                </h2>
                <p className="text-xs text-gray-500">User Dashboard</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 flex-shrink-0"
              aria-label="Close navigation menu"
              title="Close menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info with proper flex constraints */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1" aria-hidden="true"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation with proper scrolling */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {/* Main Navigation */}
            <div className="space-y-2">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </h3>
              {navigationItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>

            {/* Settings Section */}
            <div className="pt-6 space-y-2">
              <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
              {settingsItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          </nav>

          {/* Footer with proper flex constraints */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            {/* Quick Stats */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">Today's Progress</span>
                <span className="text-blue-800 font-semibold">75%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-blue-600 mt-1">3 of 4 tasks completed</p>
            </div>

            {/* Logout Button with consistent icon alignment */}
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              style={{ display: 'flex', alignItems: 'center' }}
              aria-label="Sign out of your account"
              title="Sign out"
            >
              <div 
                className="flex-shrink-0 mr-3"
                style={{ 
                  width: '24px', 
                  height: '24px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span className="text-xl" aria-hidden="true">🚪</span>
              </div>
              <div>
                <span className="text-sm font-medium">Sign Out</span>
                <p className="text-xs text-red-500">End your session</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal with proper z-index */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-red-600 text-xl" aria-hidden="true">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out? Any unsaved changes may be lost.
            </p>
            
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                aria-label="Cancel logout"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                aria-label="Confirm logout"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSidebar;

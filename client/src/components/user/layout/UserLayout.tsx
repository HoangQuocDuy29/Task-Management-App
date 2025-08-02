// client/src/components/user/dashboard/UserLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserSidebar } from '../layout/UserSidebar';

interface UserLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      
      // Ensure user is not admin (admin should use admin layout)
      if (parsedUser.role === 'admin') {
        navigate('/admin');
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/user':
      case '/user/dashboard':
        return 'My Dashboard';
      case '/user/tasks':
        return 'My Tasks';
      case '/user/profile':
        return 'My Profile';
      case '/user/settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    const breadcrumbs = [
      { label: 'Home', path: '/user' }
    ];

    if (segments.length > 1) {
      segments.slice(1).forEach((segment, index) => {
        const path = '/' + segments.slice(0, index + 2).join('/');
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ label, path });
      });
    }

    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <UserSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content area with proper left padding */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 flex-shrink-0"
                aria-label="Open navigation menu"
                title="Open navigation menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page title and breadcrumbs */}
              <div className="flex-1 min-w-0 ml-4 lg:ml-0">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                    {getPageTitle()}
                  </h1>
                </div>
                
                {/* Breadcrumbs */}
                <nav className="flex mt-1" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    {getBreadcrumbs().map((crumb, index) => (
                      <li key={crumb.path} className="flex items-center">
                        {index > 0 && (
                          <svg className="h-4 w-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        <button
                          onClick={() => navigate(crumb.path)}
                          className="hover:text-gray-700 transition-colors"
                        >
                          {crumb.label}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                {/* Notifications button */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full flex-shrink-0"
                  aria-label="View notifications"
                  title="View notifications"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.003 7.003 0 00-14 0v5h5l-5 5-5-5h5V7a9 9 0 0118 0v10z" />
                  </svg>
                </button>

                {/* User avatar and info */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-white">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ✅ CRITICAL FIX: Page content - Let child components handle their own width */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                © 2025 Task Management App. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <button 
                  className="hover:text-gray-700 transition-colors"
                  aria-label="Get help"
                >
                  Help
                </button>
                <button 
                  className="hover:text-gray-700 transition-colors"
                  aria-label="View privacy policy"
                >
                  Privacy
                </button>
                <button 
                  className="hover:text-gray-700 transition-colors"
                  aria-label="View terms of service"
                >
                  Terms
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Quick Actions FAB */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative group">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
            aria-label="Quick actions"
            title="Quick actions"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {/* Quick action tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
              Quick Actions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;

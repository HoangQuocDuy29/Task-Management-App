import { useAuth } from '../../hooks/useAuth';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Task Management - {user?.role === 'admin' ? 'Admin Panel' : 'My Tasks'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={() => {
                    logout();
                    window.location.href = '/'; // Force reload để về login page
                }}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                Logout
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
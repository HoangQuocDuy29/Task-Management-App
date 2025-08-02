// ============================================
// 📁 FILE: client/src/components/admin/AdminDashboard.tsx
// 🎯 PURPOSE: Simple admin dashboard layout - CODE NGẮN
// ✏️ ACTION: CẬP NHẬT - Integrate với các page components đã tách
// ============================================

import React, { useState } from 'react';
import { Users, CheckSquare, Folder, Ticket, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Import các pages từ đúng locations
import UsersPage from './UsersPage';        // ✅ Default import
import TicketsPage from './TicketsPage';    // ✅ Default import
import TasksPage from './TasksPage';        // ✅ Default import  
import ProjectsPage from './ProjectsPage';  // ✅ Default import
import LogworkPage from './LogworkPage';    // ✅ Default import

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'logwork', label: 'Logwork', icon: Clock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users': return <UsersPage />;
      case 'tasks': return <TasksPage />;
      case 'projects': return <ProjectsPage />;
      case 'tickets': return <TicketsPage />;
      case 'logwork': return <LogworkPage />;
      default: return <UsersPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Task Management</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        {/* Menu */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {menuItems.find(item => item.id === activeTab)?.label}
          </h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

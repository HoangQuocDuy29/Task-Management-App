// client/src/components/user/dashboard/UserInfo.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

interface UserInfoProps {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
  };
  onUserUpdate?: (updatedUser: any) => void;
  editable?: boolean;
  compact?: boolean;
}

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  activeProjects: number;
  completionRate: number;
  joinDate: string;
  lastActive: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({
  user,
  onUserUpdate,
  editable = false,
  compact = false
}) => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalHours: 0,
    activeProjects: 0,
    completionRate: 0,
    joinDate: '',
    lastActive: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Get user from localStorage if not provided via props
  const currentUser = user || (() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (currentUser) {
      fetchUserStats();
      setEditForm({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
    }
  }, [currentUser]);

  const fetchUserStats = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Fetch user's tasks
      const tasksResponse = await api.get('/tasks');
      const tasks = tasksResponse.data.data || [];
      
      // Fetch user's logwork
      const logworkResponse = await api.get('/logwork');
      const logwork = logworkResponse.data.data || [];
      
      // Fetch user's projects
      const projectsResponse = await api.get('/projects');
      const projects = projectsResponse.data.data || [];

      // Calculate stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
      const totalHours = logwork.reduce((sum: number, log: any) => sum + log.hoursWorked, 0);
      const activeProjects = projects.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      setUserStats({
        totalTasks,
        completedTasks,
        totalHours: Math.round(totalHours * 10) / 10,
        activeProjects,
        completionRate,
        joinDate: currentUser.createdAt || '',
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const response = await api.put(`/users/${currentUser.id}`, editForm);
      const updatedUser = response.data.data;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Notify parent component
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      setEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setEditForm({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
    }
    setEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 ring-red-600/20';
      case 'manager':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      default:
        return 'bg-blue-100 text-blue-800 ring-blue-600/20';
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>No user information available</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Please log in
          </button>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser.email}
            </p>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRoleColor(currentUser.role)}`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </span>
            </div>
            <div className="text-white">
              {editing ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-2 py-1 text-lg font-bold"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-2 py-1 text-lg font-bold"
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-2 py-1 text-sm w-full"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {currentUser.email}
                  </p>
                </>
              )}
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRoleColor(currentUser.role)} bg-white/20 text-white ring-white/30`}>
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </span>
                <div className="ml-3 flex items-center text-sm text-blue-100">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  aria-label="Save changes"
                >
                  {loading ? '⏳' : '💾'} Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  aria-label="Cancel editing"
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              editable && (
                <button
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  aria-label="Edit profile"
                >
                  ✏️ Edit
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Overview</h3>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{userStats.totalTasks}</div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userStats.completedTasks}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userStats.totalHours}h</div>
              <div className="text-sm text-gray-500">Hours Logged</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{userStats.completionRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">📋 Account Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Member Since:</span>
                <span className="font-medium">{formatDate(userStats.joinDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Active:</span>
                <span className="font-medium">Just now</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">User ID:</span>
                <span className="font-medium">#{currentUser.id}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Active Projects:</span>
                <span className="font-medium">{userStats.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Status:</span>
                <span className="inline-flex items-center text-green-600 font-medium">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Role:</span>
                <span className="font-medium capitalize">{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">⚡ Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button 
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => window.location.href = '/user/tasks'}
              aria-label="View my tasks"
            >
              📋 View Tasks
            </button>
            <button 
              className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => window.location.href = '/user/timetracking'}
              aria-label="Track time"
            >
              ⏱️ Track Time
            </button>
            <button 
              className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => window.location.href = '/user/reports'}
              aria-label="View reports"
            >
              📈 Reports
            </button>
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              onClick={() => window.location.href = '/user/settings'}
              aria-label="Open settings"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for sidebars
export const CompactUserInfo: React.FC<UserInfoProps> = (props) => {
  return <UserInfo {...props} compact={true} />;
};

export default UserInfo;

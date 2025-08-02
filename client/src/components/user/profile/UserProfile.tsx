// client/src/components/user/dashboard/userProfile/UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
;
import { UserInfo } from './UserInfo';

interface UserProfileProps {
  onUserUpdate?: (updatedUser: any) => void;
}

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  department?: string;
  bio?: string;
  notifications: {
    email: boolean;
    taskAssigned: boolean;
    taskDue: boolean;
  };
  preferences: {
    theme: 'light' | 'dark';
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
}

export const UserProfile: React.FC<UserProfileProps> = ({ onUserUpdate }) => {
  const [profile, setProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Set defaults
      const fullProfile: UserData = {
        ...user,
        phone: user.phone || '',
        department: user.department || '',
        bio: user.bio || '',
        notifications: {
          email: true,
          taskAssigned: true,
          taskDue: true,
          ...user.notifications
        },
        preferences: {
          theme: 'light',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
          ...user.preferences
        }
      };

      setProfile(fullProfile);
      setFormData(fullProfile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      const response = await api.put(`/users/${profile.id}`, formData);
      const updatedProfile = response.data.data;
      
      setProfile(updatedProfile);
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      
      if (onUserUpdate) {
        onUserUpdate(updatedProfile);
      }
      
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  };

  if (loading || !profile) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* User Info Card */}
      <UserInfo user={profile} onUserUpdate={onUserUpdate} editable={true} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['profile', 'security', 'preferences'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border rounded"
                      aria-label='Enter your phone number'
                    />
                  ) : (
                    <p>{profile.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.department || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border rounded"
                      aria-label='Enter your department'
                    />
                  ) : (
                    <p>{profile.department || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                {editing ? (
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                    aria-label='Enter your bio'
                  />
                ) : (
                  <p>{profile.bio || 'No bio provided'}</p>
                )}
              </div>

              {editing && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              
              <div className="space-y-4 max-w-md">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                />
                <button
                  onClick={handlePasswordChange}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
            {activeTab === 'preferences' && (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">App Preferences</h3>
    
    <div className="grid grid-cols-2 gap-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Theme</label>
        <select
          value={formData.preferences?.theme || 'light'}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { 
              dateFormat: 'MM/DD/YYYY',
              timeFormat: '12h',
              ...prev.preferences,
              theme: e.target.value as 'light' | 'dark'
            }
          }))}
          className="w-full px-3 py-2 border rounded"
            aria-label='Select theme'
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Time Format</label>
        <select
          value={formData.preferences?.timeFormat || '12h'}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            preferences: { 
              dateFormat: 'MM/DD/YYYY',
              theme: 'light',
              ...prev.preferences,
              timeFormat: e.target.value as '12h' | '24h'
            }
          }))}
          className="w-full px-3 py-2 border rounded"
          aria-label='Select time format'
        >
          <option value="12h">12-hour</option>
          <option value="24h">24-hour</option>
        </select>
      </div>
    </div>

    <button
      onClick={handleSave}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Save Preferences
    </button>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

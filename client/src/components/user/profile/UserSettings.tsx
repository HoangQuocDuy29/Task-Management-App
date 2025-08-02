// client/src/components/user/profile/UserSettings.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

interface UserSettingsProps {
  onSettingsUpdate?: (settings: any) => void;
}

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  mobile: boolean;
  taskAssigned: boolean;
  taskDue: boolean;
  taskCompleted: boolean;
  teamUpdates: boolean;
  weeklyReport: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'vi' | 'es' | 'fr';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  timezone: string;
  startPage: string;
  itemsPerPage: number;
  autoSave: boolean;
  showCompletedTasks: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  activityTracking: boolean;
  dataCollection: boolean;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ onSettingsUpdate }) => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    browser: true,
    mobile: false,
    taskAssigned: true,
    taskDue: true,
    taskCompleted: false,
    teamUpdates: true,
    weeklyReport: true
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'UTC',
    startPage: '/user/dashboard',
    itemsPerPage: 10,
    autoSave: true,
    showCompletedTasks: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'team',
    showEmail: false,
    showPhone: false,
    activityTracking: true,
    dataCollection: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'notifications' | 'appearance' | 'privacy'>('notifications');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/settings');
      const settings = response.data.data || {};
      
      if (settings.notifications) setNotifications(settings.notifications);
      if (settings.appSettings) setAppSettings(settings.appSettings);
      if (settings.privacy) setPrivacy(settings.privacy);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const settings = { notifications, appSettings, privacy };
      
      await api.put('/users/settings', settings);
      
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
      
      // Apply theme immediately
      if (appSettings.theme !== 'auto') {
        document.body.className = appSettings.theme === 'dark' ? 'dark' : '';
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setNotifications({
        email: true,
        browser: true,
        mobile: false,
        taskAssigned: true,
        taskDue: true,
        taskCompleted: false,
        teamUpdates: true,
        weeklyReport: true
      });
      
      setAppSettings({
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h',
        timezone: 'UTC',
        startPage: '/user/dashboard',
        itemsPerPage: 10,
        autoSave: true,
        showCompletedTasks: true
      });
      
      setPrivacy({
        profileVisibility: 'team',
        showEmail: false,
        showPhone: false,
        activityTracking: true,
        dataCollection: true
      });
    }
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="flex space-x-3">
          <button
            onClick={resetToDefaults}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm transition-colors"
            aria-label="Reset all settings to default"
          >
            🔄 Reset to Defaults
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
            aria-label="Save all settings"
          >
            {saving ? '⏳ Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Section Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Settings sections">
            {[
              { key: 'notifications', label: 'Notifications', icon: '🔔' },
              { key: 'appearance', label: 'Appearance', icon: '🎨' },
              { key: 'privacy', label: 'Privacy', icon: '🔒' }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                aria-label={`Switch to ${section.label} settings`}
              >
                <span className="mr-2" aria-hidden="true">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        <div className="p-6">
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Email Notifications</h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    checked={notifications.email}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                    label="Email Notifications"
                    description="Receive notifications via email"
                  />
                  <ToggleSwitch
                    checked={notifications.taskAssigned}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, taskAssigned: checked }))}
                    label="Task Assignments"
                    description="When a new task is assigned to you"
                  />
                  <ToggleSwitch
                    checked={notifications.taskDue}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, taskDue: checked }))}
                    label="Task Due Reminders"
                    description="When your tasks are due soon"
                  />
                  <ToggleSwitch
                    checked={notifications.taskCompleted}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, taskCompleted: checked }))}
                    label="Task Completions"
                    description="When team members complete tasks"
                  />
                  <ToggleSwitch
                    checked={notifications.weeklyReport}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
                    label="Weekly Reports"
                    description="Summary of your week's activities"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🖥️ Browser Notifications</h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    checked={notifications.browser}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, browser: checked }))}
                    label="Browser Notifications"
                    description="Show desktop notifications"
                  />
                  <ToggleSwitch
                    checked={notifications.teamUpdates}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, teamUpdates: checked }))}
                    label="Team Updates"
                    description="Updates from your team members"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Mobile Notifications</h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    checked={notifications.mobile}
                    onChange={(checked) => setNotifications(prev => ({ ...prev, mobile: checked }))}
                    label="Push Notifications"
                    description="Send notifications to your mobile device"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Section */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🌙 Theme</label>
                  <select
                    value={appSettings.theme}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, theme: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label='Select your preferred theme'
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🌍 Language</label>
                  <select
                    value={appSettings.language}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, language: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label=' Select your preferred language'
                  >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📅 Date Format</label>
                  <select
                    value={appSettings.dateFormat}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, dateFormat: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label='Select your preferred date format'
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🕐 Time Format</label>
                  <select
                    value={appSettings.timeFormat}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, timeFormat: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label='Select your preferred time format'
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🌐 Timezone</label>
                  <select
                    value={appSettings.timezone}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label='Select your timezone'
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Asia/Ho_Chi_Minh">Ho Chi Minh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🏠 Start Page</label>
                  <select
                    value={appSettings.startPage}
                    onChange={(e) => setAppSettings(prev => ({ ...prev, startPage: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label='Select your start page'
                  >
                    <option value="/user/dashboard">Dashboard</option>
                    <option value="/user/tasks">My Tasks</option>
                    <option value="/user/calendar">Calendar</option>
                    <option value="/user/reports">Reports</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ App Behavior</h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    checked={appSettings.autoSave}
                    onChange={(checked) => setAppSettings(prev => ({ ...prev, autoSave: checked }))}
                    label="Auto-save"
                    description="Automatically save changes as you type"
                  />
                  <ToggleSwitch
                    checked={appSettings.showCompletedTasks}
                    onChange={(checked) => setAppSettings(prev => ({ ...prev, showCompletedTasks: checked }))}
                    label="Show Completed Tasks"
                    description="Display completed tasks in lists"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👁️ Profile Visibility</h3>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: 'Public', description: 'Visible to everyone' },
                    { value: 'team', label: 'Team Only', description: 'Visible to your team members' },
                    { value: 'private', label: 'Private', description: 'Only visible to you' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        value={option.value}
                        checked={privacy.profileVisibility === option.value}
                        onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value as any }))}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Contact Information</h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    checked={privacy.showEmail}
                    onChange={(checked) => setPrivacy(prev => ({ ...prev, showEmail: checked }))}
                    label="Show Email Address"
                    description="Display your email in your profile"
                  />
                  <ToggleSwitch
                    checked={privacy.showPhone}
                    onChange={(checked) => setPrivacy(prev => ({ ...prev, showPhone: checked }))}
                    label="Show Phone Number"
                    description="Display your phone number in your profile"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Data & Analytics</h3>
                <div className="space-y-1">
                  <ToggleSwitch
                    checked={privacy.activityTracking}
                    onChange={(checked) => setPrivacy(prev => ({ ...prev, activityTracking: checked }))}
                    label="Activity Tracking"
                    description="Track your activity for productivity insights"
                  />
                  <ToggleSwitch
                    checked={privacy.dataCollection}
                    onChange={(checked) => setPrivacy(prev => ({ ...prev, dataCollection: checked }))}
                    label="Usage Analytics"
                    description="Help improve the app by sharing usage data"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          <span>💡 Tip: Settings are automatically saved to your account</span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchSettings}
            className="text-gray-600 hover:text-gray-800 text-sm"
            aria-label="Reload settings from server"
          >
            🔄 Reload
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm transition-colors disabled:opacity-50"
          >
            {saving ? '⏳ Saving...' : '💾 Save All'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

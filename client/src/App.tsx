import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/layout/Login';
import { Layout } from './components/layout/Layout';
import { UserLayout } from './components/user/layout/UserLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import { MyTasks } from './components/user/dashboard/MyTasks';
import { TaskList } from './components/user/tasks/TaskList';
import { UserProfile } from './components/user/profile/UserProfile';
import { UserSettings } from './components/user/profile/UserSettings';
import { LoadingSpinner } from './components/user/shared/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Initializing application..." />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        {user.role === 'admin' && (
          <Route path="/admin/*" element={
            <Layout>
              <AdminDashboard />
            </Layout>
          } />
        )}

        {/* User Routes */}
        <Route path="/user" element={
          <UserLayout>
            <MyTasks />
          </UserLayout>
        } />
        
        <Route path="/user/dashboard" element={
        <UserLayout>
            <MyTasks />
          </UserLayout>
        } />
        
        <Route path="/user/tasks" element={
          <UserLayout>
            <TaskList />
          </UserLayout>
        } />
        
        <Route path="/user/profile" element={
          <UserLayout>
            <UserProfile />
          </UserLayout>
        } />
        
        <Route path="/user/settings" element={
          <UserLayout>
            <UserSettings />
          </UserLayout>
        } />

        {/* Default Redirects */}
        <Route path="/" element={
          <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
        } />
        
        {/* Catch all redirect */}
        <Route path="*" element={
          <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;

import { useAuth } from './hooks/useAuth';
import { Login } from './components/layout/Login';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/Dashboard';
import { MyTasks } from './components/MyTasks';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      {user.role === 'admin' ? <Dashboard /> : <MyTasks />}
    </Layout>
  );
}

export default App;
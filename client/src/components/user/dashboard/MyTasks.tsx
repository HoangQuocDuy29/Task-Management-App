// client/src/components/user/dashboard/MyTasks.tsx
import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import TaskStatusManager from '../tasks/TaskStatusManager';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import { DashboardStats } from './DashboardStats';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline?: string;
  createdAt: string;
  updatedAt?: string;
  project?: {
    id: number;
    name: string;
  };
}

export const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (taskId: number, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(updatedTask);
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-600">Loading your tasks...</div>
      </div>
    );
  }

  return (
    // ✅ CRITICAL FIX: Remove w-full wrapper that causes sidebar conflicts
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <DashboardStats tasks={tasks} onRefresh={fetchTasks} />

      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'todo', 'in_progress', 'done'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase()}
              {status !== 'all' && ` (${tasks.filter(t => t.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {filter === 'all' ? 'No tasks assigned to you yet.' : `No ${filter.replace('_', ' ')} tasks.`}
        </div>
      ) : (
        // ✅ FIXED: Consistent grid with better spacing
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 
                    className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex-1 mr-3 line-clamp-2"
                    onClick={() => openTaskDetail(task)}
                  >
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {task.description}
                </p>
                
                {/* Status & Project */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex-shrink-0">
                    <TaskStatusManager
                      taskId={task.id}
                      currentStatus={task.status}
                      onStatusUpdate={(newStatus) => handleStatusUpdate(task.id, newStatus)}
                    />
                  </div>
                  
                  {task.project && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0 truncate max-w-[120px]">
                      {task.project.name}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openTaskDetail(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    View Details →
                  </button>
                  
                  {task.deadline && (
                    <div className="text-xs text-gray-500 flex-shrink-0">
                      <span className="font-medium">Due:</span> {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default MyTasks;

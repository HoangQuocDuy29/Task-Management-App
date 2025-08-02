// client/src/components/user/tasks/TaskList.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { TaskFilter, TaskFilters } from './TaskFilter';
import TaskCard from '../dashboard/TaskCard';
import { TaskDetailModal } from './TaskDetailModal';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorMessage } from '../shared/ErrorMessage';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline?: string;
  createdAt: string;
  project?: {
    id: number;
    name: string;
  };
}

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      
      setTasks(tasksRes.data.data || []);
      setFilteredTasks(tasksRes.data.data || []);
      setProjects(projectsRes.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: TaskFilters) => {
    let filtered = [...tasks];
    
    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'overdue') {
        filtered = filtered.filter(task => 
          task.deadline && new Date(task.deadline) < new Date() && task.status !== 'done'
        );
      } else {
        filtered = filtered.filter(task => task.status === filters.status);
      }
    }
    
    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    // Project filter
    if (filters.projectId) {
      filtered = filtered.filter(task => task.project?.id === filters.projectId);
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'deadline':
          aValue = new Date(a.deadline || '9999-12-31').getTime();
          bValue = new Date(b.deadline || '9999-12-31').getTime();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }
      
      return filters.sortOrder === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
    
    setFilteredTasks(filtered);
  };

  const handleStatusUpdate = (taskId: number, newStatus: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    
    // Re-apply current filters
    const currentFilters = document.querySelector('[data-task-filter]') as any;
    if (currentFilters?.getFilters) {
      handleFilterChange(currentFilters.getFilters());
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setSelectedTask(updatedTask);
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => 
      t.deadline && new Date(t.deadline) < new Date() && t.status !== 'done'
    ).length
  };

  if (loading) {
    return <LoadingSpinner text="Loading tasks..." centered />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
        <div className="text-sm text-gray-500">
          {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Filter Component */}
      <TaskFilter
        onFilterChange={handleFilterChange}
        taskCounts={taskCounts}
        availableProjects={projects}
      />

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {tasks.length === 0 ? 'No tasks found.' : 'No tasks match your filters.'}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={openTaskDetail}
              onStatusUpdate={handleStatusUpdate}
            />
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

export default TaskList;

// client/src/components/user/dashboard/DashboardStats.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
  deadline?: string;
  createdAt: string;
}

interface Logwork {
  id: number;
  hoursWorked: number;
  workDate: string;
}

interface DashboardStatsProps {
  tasks?: Task[];
  onRefresh?: () => void;
}

interface Statistics {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalHoursLogged: number;
  completedThisWeek: number;
  completedThisMonth: number;
  avgCompletionRate: number;
  priorityBreakdown: {
    high: number;
    medium: number;
    low: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  tasks = [], 
  onRefresh 
}) => {
  const [statistics, setStatistics] = useState<Statistics>({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalHoursLogged: 0,
    completedThisWeek: 0,
    completedThisMonth: 0,
    avgCompletionRate: 0,
    priorityBreakdown: { high: 0, medium: 0, low: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [logwork, setLogwork] = useState<Logwork[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      calculateStatistics();
      fetchLogwork();
    }
  }, [tasks]);

  const fetchLogwork = async () => {
    try {
      const response = await api.get('/logwork');
      setLogwork(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch logwork:', error);
      setLogwork([]);
    }
  };

  const calculateStatistics = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Basic task counts
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;

    // Overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (!task.deadline || task.status === 'done') return false;
      return new Date(task.deadline) < new Date();
    }).length;

    // Completed this week/month
    const completedThisWeek = tasks.filter(task => {
      if (task.status !== 'done') return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= startOfWeek;
    }).length;

    const completedThisMonth = tasks.filter(task => {
      if (task.status !== 'done') return false;
      const taskDate = new Date(task.createdAt);
      return taskDate >= startOfMonth;
    }).length;

    // Priority breakdown
    const priorityBreakdown = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    };

    // Total hours from logwork
    const totalHoursLogged = logwork.reduce((total, log) => total + log.hoursWorked, 0);

    // Completion rate (completed vs total)
    const avgCompletionRate = tasks.length > 0 
      ? Math.round((completedTasks / tasks.length) * 100) 
      : 0;

    setStatistics({
      totalTasks: tasks.length,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
      totalHoursLogged: Math.round(totalHoursLogged * 10) / 10,
      completedThisWeek,
      completedThisMonth,
      avgCompletionRate,
      priorityBreakdown
    });
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          {trend === 'up' && <span className="text-green-500">↗️ Trending up</span>}
          {trend === 'down' && <span className="text-red-500">↘️ Needs attention</span>}
          {trend === 'neutral' && <span className="text-gray-500">→ Stable</span>}
        </div>
      )}
    </div>
  );

  const ProgressBar: React.FC<{
    label: string;
    value: number;
    max: number;
    color: string;
  }> = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium">{value} / {max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    // ✅ CRITICAL FIX: Consistent spacing throughout all sections
    <div className="space-y-6">
      {/* ✅ FIXED: Main Statistics Cards - Consistent grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={statistics.totalTasks}
          icon="📋"
          color="text-gray-900"
          trend="neutral"
        />
        
        <StatCard
          title="To Do"
          value={statistics.todoTasks}
          icon="⏳"
          color="text-gray-600"
          subtitle={`${Math.round((statistics.todoTasks / statistics.totalTasks) * 100) || 0}% of total`}
          trend={statistics.todoTasks > statistics.totalTasks * 0.5 ? 'down' : 'neutral'}
        />
        
        <StatCard
          title="In Progress"
          value={statistics.inProgressTasks}
          icon="🔄"
          color="text-blue-600"
          subtitle={`${Math.round((statistics.inProgressTasks / statistics.totalTasks) * 100) || 0}% of total`}
          trend="up"
        />
        
        <StatCard
          title="Completed"
          value={statistics.completedTasks}
          icon="✅"
          color="text-green-600"
          subtitle={`${statistics.avgCompletionRate}% completion rate`}
          trend="up"
        />
      </div>

      {/* ✅ FIXED: Secondary Statistics - Consistent grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Hours Logged"
          value={`${statistics.totalHoursLogged}h`}
          icon="⏱️"
          color="text-purple-600"
          subtitle="Total work hours"
        />
        
        <StatCard
          title="Overdue Tasks"
          value={statistics.overdueTasks}
          icon="🚨"
          color="text-red-600"
          trend={statistics.overdueTasks > 0 ? 'down' : 'up'}
          subtitle={statistics.overdueTasks > 0 ? 'Need attention' : 'All on track'}
        />
        
        <StatCard
          title="This Week"
          value={statistics.completedThisWeek}
          icon="📅"
          color="text-indigo-600"
          subtitle="Tasks completed"
        />
      </div>

      {/* ✅ FIXED: Progress Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Task Breakdown</h3>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              🔄 Refresh
            </button>
          )}
        </div>
        
        {/* ✅ FIXED: Single responsive grid for breakdown */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Status Progress */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">By Status</h4>
            <ProgressBar
              label="To Do"
              value={statistics.todoTasks}
              max={statistics.totalTasks}
              color="bg-gray-400"
            />
            <ProgressBar
              label="In Progress"
              value={statistics.inProgressTasks}
              max={statistics.totalTasks}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Completed"
              value={statistics.completedTasks}
              max={statistics.totalTasks}
              color="bg-green-500"
            />
          </div>

          {/* Priority Progress */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">By Priority</h4>
            <ProgressBar
              label="High Priority"
              value={statistics.priorityBreakdown.high}
              max={statistics.totalTasks}
              color="bg-red-500"
            />
            <ProgressBar
              label="Medium Priority"
              value={statistics.priorityBreakdown.medium}
              max={statistics.totalTasks}
              color="bg-yellow-500"
            />
            <ProgressBar
              label="Low Priority"
              value={statistics.priorityBreakdown.low}
              max={statistics.totalTasks}
              color="bg-green-500"
            />
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Quick Insights - Simplified grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Quick Insights</h3>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Completion Rate:</span>
              <span className="font-semibold">{statistics.avgCompletionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Completed This Month:</span>
              <span className="font-semibold">{statistics.completedThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Hours/Task:</span>
              <span className="font-semibold">
                {statistics.completedTasks > 0 
                  ? Math.round((statistics.totalHoursLogged / statistics.completedTasks) * 10) / 10 
                  : 0}h
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Most Common Priority:</span>
              <span className="font-semibold">
                {statistics.priorityBreakdown.high >= statistics.priorityBreakdown.medium && 
                 statistics.priorityBreakdown.high >= statistics.priorityBreakdown.low ? 'High' :
                 statistics.priorityBreakdown.medium >= statistics.priorityBreakdown.low ? 'Medium' : 'Low'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tasks Needing Attention:</span>
              <span className={`font-semibold ${statistics.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {statistics.overdueTasks > 0 ? `${statistics.overdueTasks} overdue` : 'All on track'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Work Distribution:</span>
              <span className="font-semibold">
                {statistics.inProgressTasks > statistics.todoTasks ? 'Active' : 'Planning'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

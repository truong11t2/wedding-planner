'use client';

import { useAuth } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import Toast from '@/components/common/Toast';
import { CircleCheckBig, Plus, X, Edit2, Trash2 } from 'lucide-react';

interface ChecklistItem {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  editTask?: ChecklistItem | null;
}

function AddTaskModal({ isOpen, onClose, onSave, editTask }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    task: '',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const categories = [
    'Planning', 'Venue', 'Guests', 'Photography', 'Catering', 
    'Attire', 'Music', 'Flowers', 'Invitations', 'Transportation', 
    'Honeymoon', 'Legal', 'Other'
  ];

  useEffect(() => {
    if (editTask) {
      setFormData({
        task: editTask.task,
        category: editTask.category,
        priority: editTask.priority
      });
    } else {
      setFormData({
        task: '',
        category: categories[0],
        priority: 'medium'
      });
    }
  }, [editTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.task.trim() && formData.category) {
      onSave({
        task: formData.task.trim(),
        category: formData.category,
        priority: formData.priority
      });
      onClose();
      setFormData({ task: '', category: categories[0], priority: 'medium' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editTask ? 'Edit Task' : 'Add New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Description *
              </label>
              <input
                type="text"
                required
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter task description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                {editTask ? 'Update' : 'Add'} Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const initialTasks: ChecklistItem[] = [
  { id: 1, task: 'Set wedding date', category: 'Planning', completed: false, priority: 'high' },
  { id: 2, task: 'Create guest list', category: 'Guests', completed: false, priority: 'high' },
  { id: 3, task: 'Book ceremony venue', category: 'Venue', completed: false, priority: 'high' },
  { id: 4, task: 'Choose photographer', category: 'Photography', completed: false, priority: 'medium' },
  { id: 5, task: 'Select catering menu', category: 'Catering', completed: false, priority: 'medium' },
  { id: 6, task: 'Order wedding invitations', category: 'Invitations', completed: false, priority: 'medium' },
  { id: 7, task: 'Shop for wedding dress', category: 'Attire', completed: false, priority: 'low' },
  { id: 8, task: 'Plan honeymoon destination', category: 'Honeymoon', completed: false, priority: 'low' },
];

export default function ChecklistPage() {
  const { user, isLoggedIn } = useAuth();
  const [tasks, setTasks] = useState<ChecklistItem[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ChecklistItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Access your wedding checklist by logging in.</p>
        </div>
      </div>
    );
  }

  const toggleTask = (taskId: number) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      
      const task = updatedTasks.find(t => t.id === taskId);
      if (task) {
        showToast(
          task.completed ? `"${task.task}" marked as completed!` : `"${task.task}" marked as pending`,
          'success'
        );
      }
      
      return updatedTasks;
    });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ChecklistItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<ChecklistItem, 'id' | 'completed'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, ...taskData }
            : task
        )
      );
      showToast(`Task "${taskData.task}" updated successfully`, 'success');
    } else {
      // Add new task
      const newTask: ChecklistItem = {
        ...taskData,
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        completed: false
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      showToast(`Task "${taskData.task}" added successfully`, 'success');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && window.confirm(`Are you sure you want to delete "${task.task}"?`)) {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      showToast(`Task "${task.task}" deleted successfully`, 'success');
    }
  };

  // Filter tasks based on completion status and category
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filter === 'all' || 
                       (filter === 'completed' && task.completed) ||
                       (filter === 'pending' && !task.completed);
    
    const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;
    
    return statusMatch && categoryMatch;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];
  
  const getTaskStats = () => {
    const high = tasks.filter(t => t.priority === 'high').length;
    const medium = tasks.filter(t => t.priority === 'medium').length;
    const low = tasks.filter(t => t.priority === 'low').length;
    
    return { high, medium, low };
  };

  const taskStats = getTaskStats();

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Checklist</h1>
          <p className="text-gray-600">
            Stay on track with your wedding planning tasks.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.high}</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{progressPercent}%</div>
            <div className="text-sm text-gray-500">Progress</div>
          </div>
        </div>

        {/* Progress section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
            <span className="text-sm text-gray-600">
              {completedCount} of {tasks.length} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{progressPercent}% complete</p>
        </div>

        {/* Filters and Add Task */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleAddTask}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Tasks ({filteredTasks.length})
            </h2>
          </div>
          
          {filteredTasks.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`
                        flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-all
                        ${task.completed 
                          ? 'bg-pink-500 border-pink-500 text-white' 
                          : 'border-gray-300 hover:border-pink-500'
                        }
                      `}
                    >
                      {task.completed && <CircleCheckBig className="h-3 w-3" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`
                        text-sm font-medium transition-all
                        ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
                      `}>
                        {task.task}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {task.category}
                        </span>
                        <span className={`
                          inline-flex px-2 py-1 text-xs font-medium rounded-full
                          ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        `}>
                          {task.priority} priority
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CircleCheckBig className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' ? 'Start by adding your first task' : `No ${filter} tasks in ${categoryFilter === 'all' ? 'any category' : categoryFilter}`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={handleAddTask}
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Task
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Task Modal */}
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTask}
          editTask={editingTask}
        />
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}
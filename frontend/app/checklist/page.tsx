// filepath: /home/truong/project/wp1/wedding-planner/frontend/app/checklist/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { CircleCheckBig, Plus } from 'lucide-react';

interface ChecklistItem {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
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
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Checklist</h1>
        <p className="text-gray-600">
          Stay on track with your wedding planning tasks.
        </p>
      </div>

      {/* Progress section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
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

      {/* Task list */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <button className="inline-flex items-center px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-lg hover:bg-pink-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
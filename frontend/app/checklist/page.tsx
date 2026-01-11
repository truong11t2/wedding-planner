'use client';

import { useAuth } from '@/context/AuthContext';
import React, { useState, useEffect } from 'react';
import Toast from '@/components/common/Toast';
import { CircleCheckBig, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { 
  getChecklist, 
  saveChecklist, 
  addChecklistItem as apiAddItem,
  updateChecklistItem as apiUpdateItem,
  deleteChecklistItem as apiDeleteItem,
  toggleChecklistItem as apiToggleItem,
  ChecklistItem 
} from '@/api/checklist';

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
    priority: 'trung bình' as 'cao' | 'trung bình' | 'thấp'
  });

  const categories = [
    'Kế hoạch', 'Địa điểm', 'Khách mời', 'Chụp hình', 'Ẩm thực', 
    'Trang phục', 'Âm nhạc', 'Hoa', 'Thiệp mời', 'Đi lại', 
    'Tuần trăng mật', 'Pháp lý', 'Khác'
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
        priority: 'trung bình'
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
      setFormData({ task: '', category: categories[0], priority: 'trung bình' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editTask ? 'Chỉnh Sửa Nhiệm Vụ' : 'Thêm Nhiệm Vụ Mới'}
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
                Mô Tả Nhiệm Vụ *
              </label>
              <input
                type="text"
                required
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Mô tả việc bạn muốn làm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh Mục
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
                Độ Ưu Tiên
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'cao' | 'trung bình' | 'thấp' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="cao">Cao</option>
                <option value="trung bình">Trung Bình</option>
                <option value="thấp">Thấp</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                {editTask ? 'Cập Nhật' : 'Thêm'} Nhiệm Vụ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChecklistPage() {
  const { user, isLoggedIn } = useAuth();
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Load checklist from backend when component mounts
  useEffect(() => {
    const loadChecklistData = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          const response = await getChecklist();
          if (response.success && response.data) {
            setTasks(response.data);
          } else {
            // If no checklist exists, initialize with default tasks
            const initialTasks: ChecklistItem[] = [
              { id: 1, task: 'Chọn ngày cưới', category: 'Kế Hoạch', completed: false, priority: 'cao' },
              { id: 2, task: 'Tạo danh sách khách mời', category: 'Khách Mời', completed: false, priority: 'cao' },
              { id: 3, task: 'Đặt địa điểm tổ chức', category: 'Địa Điểm', completed: false, priority: 'cao' },
              { id: 4, task: 'Chọn nhiếp ảnh gia', category: 'Chụp Hình', completed: false, priority: 'trung bình' },
              { id: 5, task: 'Chọn thực đơn tiệc', category: 'Ẩm Thực', completed: false, priority: 'trung bình' },
              { id: 6, task: 'Đặt thiệp mời', category: 'Thiệp Mời', completed: false, priority: 'trung bình' },
              { id: 7, task: 'Mua váy cưới', category: 'Trang Phục', completed: false, priority: 'thấp' },
              { id: 8, task: 'Lên kế hoạch tuần trăng mật', category: 'Tuần Trăng Mật', completed: false, priority: 'thấp' },
            ];
            setTasks(initialTasks);
            // Save initial tasks to backend
            await saveChecklist(initialTasks);
          }
        } catch (error) {
          showToast('Lỗi khi tải danh sách nhiệm vụ', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    loadChecklistData();
  }, [isLoggedIn]);

  // Auto-save checklist whenever tasks change (debounced)
  useEffect(() => {
    if (tasks.length > 0 && isLoggedIn && !loading) {
      const timeoutId = setTimeout(async () => {
        try {
          await saveChecklist(tasks);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 1000); // Debounce auto-save by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [tasks, isLoggedIn, loading]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vui Lòng Đăng Nhập</h1>
          <p className="text-gray-600">Truy cập danh sách nhiệm vụ của bạn bằng cách đăng nhập.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Đang tải danh sách nhiệm vụ của bạn...</h2>
        </div>
      </div>
    );
  }

  const toggleTask = async (taskId: number) => {
    try {
      const response = await apiToggleItem(taskId);
      if (response.success && response.data) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? response.data! : task
          )
        );
        
        const task = response.data;
        showToast(
          task.completed ? `"${task.task}" đã được đánh dấu hoàn thành!` : `"${task.task}" đã được đánh dấu chưa hoàn thành`,
          'success'
        );
      } else {
        showToast(response.message || 'Lỗi khi cập nhật nhiệm vụ', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi cập nhật nhiệm vụ', 'error');
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: ChecklistItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<ChecklistItem, 'id' | 'completed'>) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await apiUpdateItem(editingTask.id, taskData);
        if (response.success && response.data) {
          setTasks(prevTasks => 
            prevTasks.map(task => 
              task.id === editingTask.id ? response.data! : task
            )
          );
          showToast(`Nhiệm vụ "${taskData.task}" đã được cập nhật thành công`, 'success');
        } else {
          showToast(response.message || 'Lỗi khi cập nhật nhiệm vụ', 'error');
        }
      } else {
        // Add new task
        const response = await apiAddItem(taskData);
        if (response.success && response.data) {
          setTasks(prevTasks => [...prevTasks, response.data!]);
          showToast(`Nhiệm vụ "${taskData.task}" đã được thêm thành công`, 'success');
        } else {
          showToast(response.message || 'Lỗi khi thêm nhiệm vụ', 'error');
        }
      }
    } catch (error) {
      showToast('Lỗi khi lưu nhiệm vụ', 'error');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && window.confirm(`Bạn có chắc chắn muốn xóa nhiệm vụ "${task.task}" không?`)) {
      try {
        const response = await apiDeleteItem(taskId);
        if (response.success) {
          setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
          showToast(`Nhiệm vụ "${task.task}" đã được xóa thành công`, 'success');
        } else {
          showToast(response.message || 'Lỗi khi xóa nhiệm vụ', 'error');
        }
      } catch (error) {
        showToast('Lỗi khi xóa nhiệm vụ', 'error');
      }
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
    const high = tasks.filter(t => t.priority === 'cao').length;
    const medium = tasks.filter(t => t.priority === 'trung bình').length;
    const low = tasks.filter(t => t.priority === 'thấp').length;
    
    return { high, medium, low };
  };

  const taskStats = getTaskStats();

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nhiệm Vụ Cần Làm</h1>
          <p className="text-gray-600">
            Giữ tiến độ với các việc cần làm cho đám cưới.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-500">Tổng số nhiệm vụ</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-500">Đã hoàn thành</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.high}</div>
            <div className="text-sm text-gray-500">Ưu tiên cao</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{progressPercent}%</div>
            <div className="text-sm text-gray-500">Tiến độ</div>
          </div>
        </div>

        {/* Progress section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tiến độ chung</h2>
            <span className="text-sm text-gray-600">
              {completedCount} trong số {tasks.length} nhiệm vụ đã hoàn thành
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{progressPercent}% hoàn thành</p>
        </div>

        {/* Filters and Add Task */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'completed' | 'pending')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chưa hoàn thành</option>
                  <option value="completed">Đã hoàn thành</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Tất cả' : category}
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
              Thêm nhiệm vụ
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Nhiệm vụ ({filteredTasks.length})
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
                          ? 'bg-green-500 border-green-500 text-white' 
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
                          ${task.priority === 'cao' ? 'bg-red-100 text-red-800' :
                            task.priority === 'trung bình' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        `}>
                          ưu tiên {task.priority}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhiệm vụ nào</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' ? 'Bắt đầu bằng cách thêm nhiệm vụ đầu tiên của bạn' : `Không có nhiệm vụ ${filter} trong ${categoryFilter === 'all' ? 'bất kỳ danh mục nào' : categoryFilter}`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={handleAddTask}
                  className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nhiệm vụ đầu tiên
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
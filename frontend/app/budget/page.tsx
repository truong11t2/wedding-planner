'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/common/Toast';
import { 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Target,
  Calculator,
  BookOpen,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  BudgetCategory,
  getBudgetData,
  saveBudgetData,
  updateTotalBudget as apiUpdateTotalBudget,
  addBudgetCategory as apiAddCategory,
  updateBudgetCategory as apiUpdateCategory,
  deleteBudgetCategory as apiDeleteCategory
} from '@/api/budget';


interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<BudgetCategory, 'id'>) => void;
  editCategory?: BudgetCategory | null;
}

interface UpdateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: number) => void;
  currentBudget: number;
}

function UpdateBudgetModal({ isOpen, onClose, onSave, currentBudget }: UpdateBudgetModalProps) {
  const [formData, setFormData] = useState({
    totalBudget: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        totalBudget: currentBudget.toString(),
        notes: ''
      });
    }
  }, [isOpen, currentBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budget = parseFloat(formData.totalBudget);
    if (!isNaN(budget) && budget >= 0) {
      onSave(budget);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Update Wedding Budget
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="25000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your total wedding budget in dollars
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any notes about your budget planning..."
                rows={3}
              />
            </div>

            {/* Budget Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Budget Planning Tips:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Average wedding cost: $20,000 - $35,000</li>
                <li>• Add 10-20% buffer for unexpected expenses</li>
                <li>• Consider seasonal and location factors</li>
                <li>• Prioritize your most important elements</li>
              </ul>
            </div>

            {/* Current vs New Budget Comparison */}
            {parseFloat(formData.totalBudget) > 0 && parseFloat(formData.totalBudget) !== currentBudget && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Budget Comparison:</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Budget:</span>
                  <span className="font-medium text-gray-900">${currentBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Budget:</span>
                  <span className="font-medium text-blue-600">${parseFloat(formData.totalBudget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1 pt-1 border-t border-gray-200">
                  <span className="text-gray-600">Difference:</span>
                  <span className={`font-medium ${
                    parseFloat(formData.totalBudget) > currentBudget ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(formData.totalBudget) > currentBudget ? '+' : ''}
                    ${(parseFloat(formData.totalBudget) - currentBudget).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

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
                disabled={!formData.totalBudget || parseFloat(formData.totalBudget) <= 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Update Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function BudgetModal({ isOpen, onClose, onSave, editCategory }: BudgetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    budgeted: '',
    spent: '',
    color: 'bg-blue-500',
    description: '',
    priority: 'trung bình' as 'cao' | 'trung bình' | 'thấp'
  });

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue', class: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Green', class: 'bg-green-500' },
    { value: 'bg-purple-500', label: 'Purple', class: 'bg-purple-500' },
    { value: 'bg-pink-500', label: 'Pink', class: 'bg-pink-500' },
    { value: 'bg-yellow-500', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'bg-red-500', label: 'Red', class: 'bg-red-500' },
    { value: 'bg-indigo-500', label: 'Indigo', class: 'bg-indigo-500' },
    { value: 'bg-orange-500', label: 'Orange', class: 'bg-orange-500' }
  ];

  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name,
        budgeted: editCategory.budgeted.toString(),
        spent: editCategory.spent.toString(),
        color: editCategory.color,
        description: editCategory.description,
        priority: editCategory.priority
      });
    } else {
      setFormData({
        name: '',
        budgeted: '',
        spent: '',
        color: 'bg-blue-500',
        description: '',
        priority: 'trung bình'
      });
    }
  }, [editCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      budgeted: parseFloat(formData.budgeted) || 0,
      spent: parseFloat(formData.spent) || 0,
      color: formData.color,
      description: formData.description,
      priority: formData.priority
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {editCategory ? 'Chỉnh Sửa Chi Tiêu' : 'Thêm Chi Tiêu'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Danh Mục *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="ví dụ: Địa điểm, Ăn uống, Chụp hình"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Tiền Dự Kiến *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.budgeted}
                    onChange={(e) => setFormData({ ...formData, budgeted: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số Tiền Đã Chi
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.spent}
                    onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mức Độ Ưu Tiên
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Màu Sắc
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`h-10 w-full rounded-lg ${color.class} ${
                      formData.color === color.value ? 'ring-2 ring-gray-400' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô Tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Mô tả hoặc ghi chú (tùy chọn)"
                rows={2}
              />
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
                {editCategory ? 'Cập Nhật' : 'Thêm'} Danh Mục
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface BudgetCategoryCardProps {
  category: BudgetCategory;
  onEdit: (category: BudgetCategory) => void;
  onDelete: (categoryId: string) => void;
}

function BudgetCategoryCard({ category, onEdit, onDelete }: BudgetCategoryCardProps) {
  const percentage = category.budgeted > 0 ? (category.spent / category.budgeted) * 100 : 0;
  const isOverBudget = category.spent > category.budgeted;
  const remaining = category.budgeted - category.spent;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(category)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(category.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(category.priority)}`}>
              ưu tiên {category.priority}
            </span>
            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
          </div>

          {category.description && (
            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
            ${category.spent.toLocaleString()} / ${category.budgeted.toLocaleString()}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : category.color
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {percentage.toFixed(1)}% đã sử dụng
          </div>
          <div className={`text-sm font-medium ${
            remaining >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {remaining >= 0 ? '+' : ''}${remaining.toLocaleString()} còn lại
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  image: string;
  link: string;
  publishedAt: string;
}

function BudgetBlogPosts() {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'How to Create a Realistic Wedding Budget',
      excerpt: 'Learn the essential steps to plan a wedding budget that works for your financial situation and dream wedding.',
      author: 'Financial Expert Sarah',
      readTime: '8 min read',
      image: '/api/placeholder/400/250',
      link: '#',
      publishedAt: '2024-01-20'
    },
    {
      id: '2',
      title: '50 Ways to Save Money on Your Wedding',
      excerpt: 'Discover practical tips and creative solutions to reduce wedding costs without sacrificing your vision.',
      author: 'Budget Planner Mike',
      readTime: '12 min read',
      image: '/api/placeholder/400/250',
      link: '#',
      publishedAt: '2024-01-18'
    },
    {
      id: '3',
      title: 'Wedding Budget Breakdown: Where to Splurge vs Save',
      excerpt: 'Find out which wedding expenses are worth the investment and where you can safely cut costs.',
      author: 'Wedding Planner Lisa',
      readTime: '10 min read',
      image: '/api/placeholder/400/250',
      link: '#',
      publishedAt: '2024-01-15'
    },
    {
      id: '4',
      title: 'Managing Wedding Finances as a Couple',
      excerpt: 'Navigate wedding budget discussions and financial planning with your partner for a stress-free experience.',
      author: 'Relationship Coach Tom',
      readTime: '7 min read',
      image: '/api/placeholder/400/250',
      link: '#',
      publishedAt: '2024-01-12'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-green-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Kinh Nghiệm Quản Lý Ngân Sách</h2>
        </div>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
          Xem Tất Cả
          <ExternalLink className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
                <a href={post.link}>{post.title}</a>
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{post.author}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const { isLoggedIn } = useAuth();
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [totalBudget, setTotalBudget] = useState(25000);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Load budget data from backend when component mounts
  useEffect(() => {
    const loadBudgetData = async () => {
    if (isLoggedIn) {
        setLoading(true);
        try {
          const response = await getBudgetData();
          if (response.success && response.data) {
            setTotalBudget(response.data.totalBudget);
            if (response.data.categories.length > 0) {
            setCategories(response.data.categories);
            } else {
              // Initialize with sample data if no budget exists
              const sampleCategories: BudgetCategory[] = [
                {
                  id: '1',
                  name: 'Venue',
                  budgeted: 8000,
                  spent: 7500,
                  color: 'bg-blue-500',
                  description: 'Ceremony and reception venue costs',
                  priority: 'cao'
                },
                {
                  id: '2',
                  name: 'Catering',
                  budgeted: 6000,
                  spent: 5800,
                  color: 'bg-green-500',
                  description: 'Đãi tiệc cho khách mời',
                  priority: 'cao'
                },
                {
                  id: '3',
                  name: 'Photography',
                  budgeted: 3000,
                  spent: 3200,
                  color: 'bg-purple-500',
                  description: 'Chụp hình và quay phim đám cưới',
                  priority: 'cao'
                },
                {
                  id: '4',
                  name: 'Trang phục',
                  budgeted: 2500,
                  spent: 1800,
                  color: 'bg-pink-500',
                  description: 'Váy cưới, vest, và phụ kiện',
                  priority: 'cao'
                },
                {
                  id: '5',
                  name: 'Hoa',
                  budgeted: 1500,
                  spent: 1200,
                  color: 'bg-yellow-500',
                  description: 'Hoa cưới, trung tâm bàn tiệc, và trang trí',
                  priority: 'thấp'
                },
                {
                  id: '6',
                  name: 'Âm nhạc & Giải trí',
                  budgeted: 1200,
                  spent: 1000,
                  color: 'bg-indigo-500',
                  description: 'DJ, ban nhạc, hoặc dịch vụ giải trí khác',
                  priority: 'trung bình'
                }
              ];
              setCategories(sampleCategories);
              // Save initial data to backend
              await saveBudgetData({ totalBudget: 25000, categories: sampleCategories });
            }
          }            
        } catch (error) {
          console.error('Error loading budget data:', error);
          showToast('Không thể tải dữ liệu ngân sách', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    loadBudgetData();
  }, [isLoggedIn]);

  // Auto-save budget data whenever it changes (debounced)
  useEffect(() => {
    if (!loading && isLoggedIn && (categories.length > 0 || totalBudget !== 25000)) {
      const timeoutId = setTimeout(async () => {
        try {
          await saveBudgetData({ totalBudget, categories });
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 1000); // Debounce auto-save by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [categories, totalBudget, isLoggedIn, loading]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h1>
          <p className="text-gray-600">Truy cập ngân sách đám cưới của bạn bằng cách đăng nhập trước.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Đang tải ngân sách của bạn...</h2>
        </div>
      </div>
    );
  }

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;
  const overBudgetCategories = categories.filter(cat => cat.spent > cat.budgeted).length;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: BudgetCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: Omit<BudgetCategory, 'id'>) => {
    try {
    if (editingCategory) {
        // Update existing category
        const response = await apiUpdateCategory(editingCategory.id, categoryData);
        if (response.success && response.data) {
      setCategories(prev => prev.map(cat => 
            cat.id === editingCategory.id ? response.data! : cat
      ));
      showToast(`${categoryData.name} danh mục đã được cập nhật thành công`, 'success');
    } else {
          showToast(response.message || 'Không thể cập nhật danh mục', 'error');
        }
      } else {
        // Add new category
        const response = await apiAddCategory(categoryData);
        if (response.success && response.data) {
          setCategories(prev => [...prev, response.data!]);
      showToast(`${categoryData.name} danh mục đã được thêm thành công`, 'success');
        } else {
          showToast(response.message || 'Không thể thêm danh mục', 'error');
        }
      }
    } catch (error) {
      showToast('Lỗi khi lưu danh mục', 'error');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && window.confirm(`Bạn có chắc muốn xóa danh mục ${category.name}?`)) {
      try {
        const response = await apiDeleteCategory(categoryId);
        if (response.success) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      showToast(`${category.name} danh mục đã được xóa thành công`, 'success');
        } else {
          showToast(response.message || 'Không thể xóa danh mục', 'error');
        }
      } catch (error) {
        showToast('Lỗi khi xóa danh mục', 'error');
      }
    }
  };

  const getBudgetStatus = () => {
    if (budgetUsedPercentage > 100) return { status: 'danger', message: 'Vượt ngân sách!', icon: AlertTriangle };
    if (budgetUsedPercentage > 85) return { status: 'warning', message: 'Gần đạt giới hạn ngân sách', icon: AlertTriangle };
    return { status: 'good', message: 'Trong ngân sách', icon: CheckCircle };
  };

  const handleUpdateBudget = async (newBudget: number) => {
    try {
      const response = await apiUpdateTotalBudget(newBudget);
      if (response.success) {
    setTotalBudget(newBudget);
    showToast(`Ngân sách đã được cập nhật thành $${newBudget.toLocaleString()}`, 'success');
      } else {
        showToast(response.message || 'Không thể cập nhật ngân sách', 'error');
      }
    } catch (error) {
      showToast('Lỗi khi cập nhật ngân sách', 'error');
    }
  };

  const budgetStatus = getBudgetStatus();

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ngân Sách</h1>
          <p className="text-gray-600">
            Theo dõi chi tiêu đám cưới và quản lý ngân sách hiệu quả.
          </p>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Budget Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tổng</h3>
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${totalBudget.toLocaleString()}
            </div>
            <button
              onClick={() => setIsBudgetModalOpen(true)} // Update this onClick
              className="inline-flex text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Cập nhật Ngân sách
            </button>
          </div>

          {/* Spent Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Đã Chi</h3>
              <Calculator className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              VND {totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {budgetUsedPercentage.toFixed(1)}% ngân sách đã sử dụng
            </div>
          </div>

          {/* Remaining Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Còn Lại</h3>
              {totalRemaining >= 0 ? (
                <TrendingUp className="h-6 w-6 text-green-500" />
              ) : (
                <TrendingDown className="h-6 w-6 text-red-500" />
              )}
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${Math.abs(totalRemaining).toLocaleString()}
            </div>
            <div className={`text-sm flex items-center ${
              budgetStatus.status === 'danger' ? 'text-red-600' :
              budgetStatus.status === 'warning' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              <budgetStatus.icon className="h-4 w-4 mr-1" />
              {budgetStatus.message}
            </div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tổng Quan</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Trong Ngân Sách</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Vượt Ngân Sách</span>
              </div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                budgetUsedPercentage > 100 ? 'bg-red-500' :
                budgetUsedPercentage > 85 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span className="font-medium">
              ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
            </span>
            <span>${totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-500">Danh Mục</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(cat => cat.spent <= cat.budgeted).length}
            </div>
            <div className="text-sm text-gray-500">Trong Ngân Sách</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overBudgetCategories}</div>
            <div className="text-sm text-gray-500">Vượt Ngân Sách</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${(totalBudgeted / categories.length || 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Trung Bình Mỗi Danh Mục</div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Danh Mục Ngân Sách</h2>
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Danh Mục
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <BudgetCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <PieChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có danh mục ngân sách</h3>
              <p className="text-gray-600 mb-4">Bắt đầu bằng cách thêm danh mục ngân sách đầu tiên của bạn</p>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Danh Mục Đầu Tiên
              </button>
            </div>
          )}
        </div>

        {/* Budget Blog Posts */}
        <BudgetBlogPosts />

        {/* Budget Modal */}
        <BudgetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
          editCategory={editingCategory}
        />

        {/* Update Budget Modal */}
        <UpdateBudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          onSave={handleUpdateBudget}
          currentBudget={totalBudget}
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
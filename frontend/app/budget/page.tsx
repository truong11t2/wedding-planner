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

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<BudgetCategory, 'id'>) => void;
  editCategory?: BudgetCategory | null;
}

function BudgetModal({ isOpen, onClose, onSave, editCategory }: BudgetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    budgeted: '',
    spent: '',
    color: 'bg-blue-500',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
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
        priority: 'medium'
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
              {editCategory ? 'Edit Budget Category' : 'Add Budget Category'}
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
                Category Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="e.g., Venue, Catering, Photography"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budgeted Amount *
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
                  Amount Spent
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
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
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Optional description or notes"
                rows={2}
              />
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
                {editCategory ? 'Update' : 'Add'} Category
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
              {category.priority} priority
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
            {percentage.toFixed(1)}% used
          </div>
          <div className={`text-sm font-medium ${
            remaining >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {remaining >= 0 ? '+' : ''}${remaining.toLocaleString()} remaining
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
          <h2 className="text-xl font-semibold text-gray-900">Budget Management Tips</h2>
        </div>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
          View All
          <ExternalLink className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Sample budget categories
  useEffect(() => {
    if (isLoggedIn) {
      const sampleCategories: BudgetCategory[] = [
        {
          id: '1',
          name: 'Venue',
          budgeted: 8000,
          spent: 7500,
          color: 'bg-blue-500',
          description: 'Ceremony and reception venue costs',
          priority: 'high'
        },
        {
          id: '2',
          name: 'Catering',
          budgeted: 6000,
          spent: 5800,
          color: 'bg-green-500',
          description: 'Food and beverage for guests',
          priority: 'high'
        },
        {
          id: '3',
          name: 'Photography',
          budgeted: 3000,
          spent: 3200,
          color: 'bg-purple-500',
          description: 'Wedding photographer and videographer',
          priority: 'medium'
        },
        {
          id: '4',
          name: 'Attire',
          budgeted: 2500,
          spent: 1800,
          color: 'bg-pink-500',
          description: 'Wedding dress, suit, and accessories',
          priority: 'medium'
        },
        {
          id: '5',
          name: 'Flowers',
          budgeted: 1500,
          spent: 1200,
          color: 'bg-yellow-500',
          description: 'Bouquet, centerpieces, and decorations',
          priority: 'low'
        },
        {
          id: '6',
          name: 'Music & Entertainment',
          budgeted: 1200,
          spent: 1000,
          color: 'bg-indigo-500',
          description: 'DJ, band, or entertainment services',
          priority: 'medium'
        }
      ];
      setCategories(sampleCategories);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Access your wedding budget by logging in first.</p>
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

  const handleSaveCategory = (categoryData: Omit<BudgetCategory, 'id'>) => {
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData }
          : cat
      ));
      showToast(`${categoryData.name} category updated successfully`, 'success');
    } else {
      const newCategory: BudgetCategory = {
        ...categoryData,
        id: Date.now().toString()
      };
      setCategories(prev => [...prev, newCategory]);
      showToast(`${categoryData.name} category added successfully`, 'success');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && window.confirm(`Are you sure you want to delete the ${category.name} category?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      showToast(`${category.name} category deleted successfully`, 'success');
    }
  };

  const getBudgetStatus = () => {
    if (budgetUsedPercentage > 100) return { status: 'danger', message: 'Over budget!', icon: AlertTriangle };
    if (budgetUsedPercentage > 85) return { status: 'warning', message: 'Close to budget limit', icon: AlertTriangle };
    return { status: 'good', message: 'Within budget', icon: CheckCircle };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Budget</h1>
          <p className="text-gray-600">
            Track your wedding expenses and manage your budget effectively.
          </p>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Budget Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Budget</h3>
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${totalBudget.toLocaleString()}
            </div>
            <button
              onClick={() => {
                const newBudget = prompt('Enter your total wedding budget:', totalBudget.toString());
                if (newBudget && !isNaN(Number(newBudget))) {
                  setTotalBudget(Number(newBudget));
                  showToast('Total budget updated successfully', 'success');
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Update Budget
            </button>
          </div>

          {/* Spent Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
              <Calculator className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              ${totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              {budgetUsedPercentage.toFixed(1)}% of budget used
            </div>
          </div>

          {/* Remaining Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Remaining</h3>
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
            <h3 className="text-lg font-semibold text-gray-900">Overall Budget Progress</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Within Budget</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Over Budget</span>
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
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(cat => cat.spent <= cat.budgeted).length}
            </div>
            <div className="text-sm text-gray-500">On Budget</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{overBudgetCategories}</div>
            <div className="text-sm text-gray-500">Over Budget</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              ${(totalBudgeted / categories.length || 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Avg per Category</div>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Budget Categories</h2>
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No budget categories yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first budget category</p>
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
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
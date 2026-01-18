'use client';

import React, { useState, useEffect } from 'react';
import { TimelineItem } from '@/lib/timelineGenerator';
import { PiggyBank, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { getBudgetData, BudgetCategory } from '@/api/budget';
import { useAuth } from '@/context/AuthContext';

interface BudgetOverviewProps {
  timelineItems: TimelineItem[];
}

export default function BudgetOverview({ timelineItems }: BudgetOverviewProps) {
  const { isLoggedIn } = useAuth();
  const [totalBudget, setTotalBudget] = useState(25000);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load budget data from database
  useEffect(() => {
    const loadBudgetData = async () => {
      if (isLoggedIn) {
        setLoading(true);
        try {
          const response = await getBudgetData();
          if (response.success && response.data) {
            setTotalBudget(response.data.totalBudget);
            setBudgetCategories(response.data.categories);
          }
        } catch (error) {
          console.error('Error loading budget data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || budgetCategories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tổng thể ngân sách</h2>
        </div>
        <div className="text-center py-8">
          <PiggyBank className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {!isLoggedIn ? 'Vui lòng đăng nhập để xem ngân sách' : 'Chưa có dữ liệu ngân sách. Hãy thêm danh mục trong trang Ngân Sách.'}
          </p>
        </div>
      </div>
    );
  }

  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;

  const getBudgetStatus = () => {
    if (budgetUsedPercentage > 90) return { status: 'danger', message: 'Vượt ngân sách!' };
    if (budgetUsedPercentage > 75) return { status: 'warning', message: 'Gần đạt giới hạn ngân sách' };
    return { status: 'good', message: 'Trong ngân sách' };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tổng thể ngân sách</h2>
      </div>

      {/* Budget Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Ngân sách đã dùng</span>
          <span className="text-sm font-medium">
            {totalSpent.toLocaleString('vi-VN')}₫ / {totalBudget.toLocaleString('vi-VN')}₫
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              budgetUsedPercentage > 90 ? 'bg-red-500' :
              budgetUsedPercentage > 75 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between">
          <div className={`flex items-center text-sm ${
            budgetStatus.status === 'danger' ? 'text-red-600' :
            budgetStatus.status === 'warning' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {budgetStatus.status === 'danger' ? <TrendingDown className="h-4 w-4 mr-1" /> :
             budgetStatus.status === 'warning' ? <AlertCircle className="h-4 w-4 mr-1" /> :
             <TrendingUp className="h-4 w-4 mr-1" />}
            {budgetStatus.message}
          </div>
          <span className="text-sm font-medium text-gray-900">
            {budgetUsedPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Budget Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Phân bổ ngân sách</h3>
        {budgetCategories.map((category, index) => {
          const percentage = (category.spent / category.budgeted) * 100;
          const isOverBudget = category.spent > category.budgeted;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{category.name}</span>
                <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                  {category.spent.toLocaleString('vi-VN')}₫ / {category.budgeted.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isOverBudget ? 'bg-red-500' : category.color
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {remainingBudget.toLocaleString('vi-VN')}₫
            </div>
            <div className="text-sm text-gray-500">Còn lại</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {budgetCategories.filter(cat => cat.spent > 0).length}
            </div>
            <div className="text-sm text-gray-500">Danh mục đã dùng</div>
          </div>
        </div>
      </div>
    </div>
  );
}
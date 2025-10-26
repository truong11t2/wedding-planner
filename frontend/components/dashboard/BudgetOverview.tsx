'use client';

import React, { useState, useEffect } from 'react';
import { TimelineItem } from '@/lib/timelineGenerator';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface BudgetOverviewProps {
  timelineItems: TimelineItem[];
}

interface BudgetCategory {
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

export default function BudgetOverview({ timelineItems }: BudgetOverviewProps) {
  const [totalBudget, setTotalBudget] = useState(25000);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    { name: 'Venue', budgeted: 8000, spent: 7500, color: 'bg-blue-500' },
    { name: 'Catering', budgeted: 6000, spent: 5800, color: 'bg-green-500' },
    { name: 'Photography', budgeted: 3000, spent: 3200, color: 'bg-purple-500' },
    { name: 'Attire', budgeted: 2500, spent: 1800, color: 'bg-pink-500' },
    { name: 'Flowers', budgeted: 1500, spent: 1200, color: 'bg-yellow-500' },
    { name: 'Music', budgeted: 1200, spent: 1000, color: 'bg-indigo-500' },
    { name: 'Other', budgeted: 2800, spent: 1500, color: 'bg-gray-500' }
  ]);

  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;

  const getBudgetStatus = () => {
    if (budgetUsedPercentage > 90) return { status: 'danger', message: 'Over budget!' };
    if (budgetUsedPercentage > 75) return { status: 'warning', message: 'Close to budget limit' };
    return { status: 'good', message: 'Within budget' };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
        <DollarSign className="h-6 w-6 text-green-500" />
      </div>

      {/* Budget Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Budget Used</span>
          <span className="text-sm font-medium">
            ${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}
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
        <h3 className="text-sm font-medium text-gray-900">Category Breakdown</h3>
        {budgetCategories.map((category, index) => {
          const percentage = (category.spent / category.budgeted) * 100;
          const isOverBudget = category.spent > category.budgeted;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{category.name}</span>
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
              ${remainingBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {budgetCategories.filter(cat => cat.spent > 0).length}
            </div>
            <div className="text-sm text-gray-500">Categories Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}
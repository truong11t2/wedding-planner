'use client';

import React from 'react';
import { TimelineItem } from '@/lib/timelineGenerator';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, TooltipProps } from 'recharts';

interface TimelineProgressProps {
  timelineItems: TimelineItem[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  [key: string]: string | number | React.ComponentType<{ className?: string }>;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: ChartData;
  }>;
}

export default function TimelineProgress({ timelineItems }: TimelineProgressProps) {
  const completedItems = timelineItems.filter(item => item.completed && !item.isWeddingDay);
  const remainingItems = timelineItems.filter(item => !item.completed && !item.isWeddingDay);
  const totalItems = completedItems.length + remainingItems.length;

  const data: ChartData[] = [
    {
      name: 'Completed',
      value: completedItems.length,
      color: '#10B981',
      icon: CheckCircle
    },
    {
      name: 'Remaining',
      value: remainingItems.length,
      color: '#F59E0B',
      icon: Clock
    }
  ];

  const COLORS = ['#10B981', '#F59E0B'];

  const completionPercentage = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} tasks ({Math.round((data.value / totalItems) * 100)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Timeline Progress</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">{totalItems} total tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{completionPercentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <div className="font-semibold text-green-900">Completed Tasks</div>
                <div className="text-sm text-green-700">Well done!</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-900">{completedItems.length}</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <div className="font-semibold text-yellow-900">Remaining Tasks</div>
                <div className="text-sm text-yellow-700">Keep going!</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-900">{remainingItems.length}</div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {completedItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Completions</h3>
          <div className="space-y-2">
            {completedItems.slice(-3).map((item) => (
              <div key={item.id} className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 truncate">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
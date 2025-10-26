'use client';

import React from 'react';
import { TimelineItem } from '@/lib/timelineGenerator';
import { CheckCircle, Clock, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  timelineItems: TimelineItem[];
  weddingDate: string | null;
  daysUntilWedding: number | null;
}

export default function DashboardStats({ timelineItems, weddingDate, daysUntilWedding }: DashboardStatsProps) {
  const completedTasks = timelineItems.filter(item => item.completed && !item.isWeddingDay).length;
  const totalTasks = timelineItems.filter(item => !item.isWeddingDay).length;
  const upcomingTasks = timelineItems.filter(item => {
    if (item.completed || item.isWeddingDay) return false;
    const today = new Date();
    const taskDate = new Date(item.dueDate);
    const daysUntilTask = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilTask <= 7 && daysUntilTask >= 0;
  }).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      name: 'Days Until Wedding',
      value: daysUntilWedding !== null ? (daysUntilWedding > 0 ? daysUntilWedding : 'Today!') : 'Not set',
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      name: 'Tasks Completed',
      value: `${completedTasks}/${totalTasks}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      name: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      name: 'Due This Week',
      value: upcomingTasks,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className={`text-3xl font-bold ${stat.color} mt-2`}>
                {stat.value}
              </p>
            </div>
            <stat.icon className={`h-8 w-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
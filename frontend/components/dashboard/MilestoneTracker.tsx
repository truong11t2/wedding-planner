'use client';

import React from 'react';
import { TimelineItem } from '@/lib/timelineGenerator';
import { CheckCircle, Clock, Star, Calendar } from 'lucide-react';

interface MilestoneTrackerProps {
  timelineItems: TimelineItem[];
  weddingDate: string | null;
}

export default function MilestoneTracker({ timelineItems, weddingDate }: MilestoneTrackerProps) {
  // Define major milestones
  const majorMilestones = [
    'Set Your Budget',
    'Book Venue',
    'Book Photographer',
    'Order Wedding Dress',
    'Book Caterer',
    'Send Invitations',
    'Final Dress Fitting',
    'Enjoy Your Wedding Day!'
  ];

  const milestoneItems = timelineItems.filter(item => 
    majorMilestones.includes(item.title)
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const getStatusIcon = (item: TimelineItem) => {
    if (item.completed) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else if (item.isWeddingDay) {
      return <Star className="h-6 w-6 text-pink-500" />;
    } else {
      const today = new Date();
      const isOverdue = item.dueDate < today;
      return (
        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
          isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
        }`}>
          <Clock className={`h-3 w-3 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
        </div>
      );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Major Milestones</h2>
        <Calendar className="h-6 w-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {milestoneItems.map((item, index) => {
          const isLast = index === milestoneItems.length - 1;
          const today = new Date();
          const isOverdue = !item.completed && item.dueDate < today && !item.isWeddingDay;
          const isUpcoming = !item.completed && item.dueDate >= today && !item.isWeddingDay;

          return (
            <div key={item.id} className="relative">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-3 top-8 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className={`flex items-start space-x-4 p-4 rounded-lg transition-all ${
                item.completed ? 'bg-green-50 border border-green-200' :
                isOverdue ? 'bg-red-50 border border-red-200' :
                isUpcoming ? 'bg-blue-50 border border-blue-200' :
                'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        item.completed ? 'text-green-900 line-through' :
                        isOverdue ? 'text-red-900' :
                        'text-gray-900'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        item.completed ? 'text-green-700' :
                        isOverdue ? 'text-red-700' :
                        'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end ml-4">
                      <span className={`text-sm font-medium ${
                        item.completed ? 'text-green-600' :
                        isOverdue ? 'text-red-600' :
                        item.isWeddingDay ? 'text-pink-600' :
                        'text-gray-600'
                      }`}>
                        {formatDate(item.dueDate)}
                      </span>
                      
                      {item.completed && (
                        <span className="text-xs text-green-600 mt-1">✓ Completed</span>
                      )}
                      
                      {isOverdue && (
                        <span className="text-xs text-red-600 mt-1">Overdue</span>
                      )}
                      
                      {item.isWeddingDay && (
                        <span className="text-xs text-pink-600 mt-1">Wedding Day!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Milestone Progress</span>
          <span className="text-sm font-medium text-gray-900">
            {milestoneItems.filter(item => item.completed).length} of {milestoneItems.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${milestoneItems.length > 0 ? (milestoneItems.filter(item => item.completed).length / milestoneItems.length) * 100 : 0}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
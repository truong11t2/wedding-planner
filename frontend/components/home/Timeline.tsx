'use client';

import React, { useState } from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { CheckCircle, TriangleAlert, Clock, Bookmark, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function Timeline() {
  const {
    timelineItems,
    weddingDate,
    isLoading,
    error,
    setWeddingDate,
    updateTimelineItem,
    saveTimelineData,
    lastSaved,
  } = useTimeline();
  
  const [tempWeddingDate, setTempWeddingDate] = useState(weddingDate);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleWeddingDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempWeddingDate) {
      setWeddingDate(tempWeddingDate);
    }
  };

  const handleSaveTimeline = async () => {
    setSaveStatus('saving');
    try {
      await saveTimelineData();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const toggleTaskCompletion = (itemId: string) => {
    const item = timelineItems.find(t => t.id === itemId);
    if (item) {
      updateTimelineItem(itemId, { completed: !item.completed });
    }
  };

  const handleOptionSelect = (itemId: string, optionId: string) => {
    updateTimelineItem(itemId, { selectedOption: optionId });
    // Collapse the options after selection
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const toggleOptionsExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleTextInputChange = (itemId: string, optionId: string, value: string) => {
    const item = timelineItems.find(t => t.id === itemId);
    const currentSelections = item?.selectedOptions || {};
    
    updateTimelineItem(itemId, {
      selectedOptions: {
        ...currentSelections,
        [optionId]: value
      }
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Yourself': 'bg-blue-100 text-blue-800',
      'Vendor': 'bg-green-100 text-green-800',
      'Attire': 'bg-purple-100 text-purple-800',
      'Planning': 'bg-yellow-100 text-yellow-800',
      'Personal': 'bg-pink-100 text-pink-800',
      'Legal': 'bg-red-100 text-red-800',
      'Celebration': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Floating Save Button Component
  const FloatingSaveButton = () => {
    if (!weddingDate) return null;

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleSaveTimeline}
          disabled={isLoading || saveStatus === 'saving'}
          className={`
            px-6 py-3 rounded-full font-medium transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl
            ${saveStatus === 'saving' || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : saveStatus === 'success'
              ? 'bg-green-500 hover:bg-green-600'
              : saveStatus === 'error'
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            } text-white
          `}
        >
          {saveStatus === 'saving' ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : saveStatus === 'success' ? (
            <Check className="h-5 w-5" />
          ) : saveStatus === 'error' ? (
            <X className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">
            {saveStatus === 'saving' ? 'Saving...' :
             saveStatus === 'success' ? 'Saved!' :
             saveStatus === 'error' ? 'Save Failed' :
             'Save Timeline'}
          </span>
        </button>
      </div>
    );
  };

  if (!weddingDate) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Wedding Timeline</h2>
          <p className="text-gray-600 mb-6">
            Enter your wedding date to generate a personalized planning timeline
          </p>
        </div>

        <form onSubmit={handleWeddingDateSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <label htmlFor="wedding-date" className="block text-sm font-medium text-gray-700 mb-2">
              Wedding Date *
            </label>
            <input
              type="date"
              id="wedding-date"
              value={tempWeddingDate}
              onChange={(e) => setTempWeddingDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              min={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 3 months from now
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Wedding date must be at least 3 months in advance
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <TriangleAlert className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            Generate Timeline
          </button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 pb-24"> {/* Added bottom padding to prevent overlap with floating button */}
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wedding Timeline</h2>
          <p className="text-gray-600">
            Wedding Date: <span className="font-medium">{formatDate(new Date(weddingDate))}</span>
          </p>
          {lastSaved && (
            <p className="text-sm text-gray-500 mt-1">
              Last saved: {formatDate(lastSaved)}
            </p>
          )}
        </div>
        
          <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              setWeddingDate('');
              setTempWeddingDate('');
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
          >
            Change Date
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <TriangleAlert className="h-5 w-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Timeline Items */}
      <div className="space-y-6">
        {timelineItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`
              relative bg-white rounded-lg shadow-sm border border-gray-200 p-6
              ${item.isWeddingDay ? 'border-pink-300 bg-pink-50' : ''}
              ${item.completed ? 'opacity-75' : ''}
            `}
          >
            {/* Timeline connector line */}
            {index < timelineItems.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-6 bg-gray-200"></div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Completion checkbox */}
              <button
                onClick={() => toggleTaskCompletion(item.id)}
                className="flex-shrink-0 mt-1"
                disabled={item.isWeddingDay}
              >
                {item.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <div className="h-6 w-6 border-2 border-gray-300 rounded-full hover:border-pink-500 transition-colors flex items-center justify-center">
                    {item.isWeddingDay && <Clock className="h-4 w-4 text-pink-500" />}
                  </div>
                )}
              </button>

              <div className="flex-1 min-w-0">
                {/* Task header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`text-lg font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Due date */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Due: {formatDate(item.dueDate)}</span>
                </div>

                {/* Options */}
                {item.options && item.options.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.selectedOption || (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) 
                          ? 'Your selection:' 
                          : 'Choose an option:'}
                      </h4>
                      
                      {/* Show expand/collapse button only if there's a selection */}
                      {(item.selectedOption || (item.selectedOptions && Object.keys(item.selectedOptions).length > 0)) && (
                        <button
                          onClick={() => toggleOptionsExpansion(item.id)}
                          className="flex items-center space-x-1 text-sm text-pink-600 hover:text-pink-700 transition-colors"
                        >
                          <span>{expandedItems.has(item.id) ? 'Hide options' : 'Change selection'}</span>
                          {expandedItems.has(item.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {item.options.map((option) => {
                        const isSelected = item.selectedOption === option.id || 
                                        (item.selectedOptions && item.selectedOptions[option.id]);
                        const shouldShow = !item.selectedOption && (!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) || 
                                        isSelected || 
                                        expandedItems.has(item.id);

                        if (!shouldShow) return null;

                        return (
                          <div key={option.id} className="space-y-2">
                            {option.isTextInput ? (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {option.label}
                                </label>
                                <textarea
                                  value={item.selectedOptions?.[option.id] || ''}
                                  onChange={(e) => handleTextInputChange(item.id, option.id, e.target.value)}
                                  placeholder={option.description}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
                                  rows={3}
                                />
                              </div>
                            ) : (
                              <div
                                onClick={() => handleOptionSelect(item.id, option.id)}
                                className={`
                                  cursor-pointer p-3 border rounded-lg transition-all
                                  ${isSelected
                                    ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200' 
                                    : 'border-gray-200 hover:border-gray-300'
                                  }
                                `}
                              >
                                {isSelected && (
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                      <Check className="h-3 w-3 mr-1" />
                                      Selected
                                    </span>
                                  </div>
                                )}
                                
                                {option.image && (
                                  <img 
                                    src={option.image} 
                                    alt={option.label}
                                    className="w-full h-32 object-cover rounded-lg mb-2"
                                  />
                                )}
                                <h5 className="font-medium text-gray-900">{option.label}</h5>
                                {option.description && (
                                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                )}
                                {option.price && (
                                  <p className="text-sm font-medium text-pink-600 mt-1">{option.price}</p>
                                )}
                                {option.location && (
                                  <p className="text-xs text-gray-500 mt-1">{option.location}</p>
                                )}
                                {option.specialties && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {option.specialties.map((specialty, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                        {specialty}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {option.rating && (
                                  <div className="flex items-center mt-2">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <svg 
                                          key={i} 
                                          className={`h-4 w-4 ${i < option.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                          fill="currentColor" 
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <span className="ml-1 text-xs text-gray-600">({option.rating})</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Floating Save Button */}
      <FloatingSaveButton />
    </>
  );
}
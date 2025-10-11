import React, { useState } from 'react';
import { Download, CheckCircle, Heart, ChevronDown, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import ItemOptions from './ItemOptions';
import ItemOptionsWithText from './ItemOptionsWithText';
import OptionsDialog from './OptionsDialog';

export default function Timeline({ 
  weddingDate, 
  timeline, 
  setTimeline, // Add this prop
  setShowPlan 
}) {
  const { isLoggedIn } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [tempSelectedOption, setTempSelectedOption] = useState('');

  const downloadPDF = () => {
    const wedding = new Date(weddingDate);
    const content = `
WEDDING PLANNING TIMELINE
Wedding Date: ${wedding.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

${timeline.map((item, idx) => `
${idx + 1}. ${item.title.toUpperCase()}
Due Date: ${item.dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
${item.description}
Category: ${item.category}
`).join('\n')}

Congratulations on your upcoming wedding!
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-planning-timeline.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveOption = async (itemId: string, values: string | { [key: string]: string }) => {
    try {
      const updatedTimeline = timeline.map(item => {
        if (item.id === itemId) {
          // Check if the item has isTextInput option
          if (item.options?.[0]?.isTextInput) {
            // Handle text input options (multiple values)
            return { ...item, selectedOptions: values as { [key: string]: string } };
          } else {
            // Handle radio options (single value)
            return { ...item, selectedOption: values as string };
          }
        }
        return item;
      });
      
      setTimeline(updatedTimeline);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving options:', error);
      throw error;
    }
  };

  const handleAccordionToggle = (item) => {
    if (expandedItem?.id === item.id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(item);
      // Initialize temp values
      if (item.options?.[0]?.isTextInput) {
        setTempValues(item.selectedOptions || {});
      } else {
        setTempSelectedOption(item.selectedOption || '');
      }
    }
  };

  const handleSave = async (item) => {
    try {
      if (item.options?.[0]?.isTextInput) {
        await handleSaveOption(item.id, tempValues);
      } else {
        await handleSaveOption(item.id, tempSelectedOption);
      }
      setExpandedItem(null);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  // Update the getMonthsUntil function to handle weeks
  const getTimeUntil = (date) => {
    const d1 = new Date(date);
    const d2 = new Date(weddingDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 14) { // Two weeks or less
      const diffWeeks = Math.ceil(diffDays / 7);
      return { months: 0, weeks: diffWeeks };
    }
    
    const months = (d2.getFullYear() - d1.getFullYear()) * 12 + 
                  (d2.getMonth() - d1.getMonth());
    return { months, weeks: 0 };
  };

  const groupedTimeline = timeline.reduce((acc, item) => {
    const timeUntil = getTimeUntil(item.dueDate);
    // Use decimal representation for weeks (0.5 for 2 weeks, 0.25 for 1 week, 0 for wedding day)
    const key = timeUntil.months === 0 
      ? `w${timeUntil.weeks}` 
      : `m${timeUntil.months}`;
    
    if (!acc[key]) {
      acc[key] = { ...timeUntil, items: [] };
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  const sortedGroups = Object.entries(groupedTimeline)
    .sort(([keyA, _a], [keyB, _b]) => {
      const isWeekA = keyA.startsWith('w');
      const isWeekB = keyB.startsWith('w');
      
      // Get numeric values
      const valueA = Number(keyA.slice(1));
      const valueB = Number(keyB.slice(1));

      // If both are months or both are weeks, sort by value
      if ((!isWeekA && !isWeekB) || (isWeekA && isWeekB)) {
        return valueB - valueA;
      }
      
      // If one is month and other is week, months come first
      return isWeekA ? 1 : -1;
    })
    .map(([_, group]) => group);  // Fix: Use underscore for unused key parameter

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border-2 border-pink-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Your Wedding Timeline
            </h2>
            <p className="text-gray-600">
              Wedding Date: <span className="font-semibold text-pink-600">
                {new Date(weddingDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={() => setShowPlan(false)}
              className="px-4 sm:px-6 py-3 border-2 border-pink-300 rounded-lg font-semibold hover:bg-pink-50 transition-all"
            >
              New Date
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sortedGroups.map((group, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-3 md:p-8 border-l-4 border-pink-500 hover:shadow-xl transition-shadow">
            {/* Header section with number and title on same line */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {idx + 1}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {group.months > 0 
                  ? `${group.months} ${group.months === 1 ? 'Month' : 'Months'} Before`
                  : `${group.weeks} ${group.weeks === 1 ? 'Week' : 'Weeks'} Before`
                }
              </h3>
            </div>

            {/* Items section on separate line */}
            <div className="space-y-4">
              {group.items.map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="text-pink-600 font-medium mb-2 text-sm sm:text-base">
                    {item.title} • {item.category}
                  </p>
                  <div className="flex items-center gap-3"> {/* Changed from items-start to items-center */}
                    <CheckCircle 
                      className={`w-5 h-5 flex-shrink-0 ${
                        isLoggedIn 
                          ? (item.selectedOption || item.selectedOptions) 
                            ? 'text-green-500' 
                            : 'text-amber-500'  // Warning color for unselected items
                          : 'text-gray-300'
                      }`} 
                    />
                    {isLoggedIn ? (
                      <div className="w-full">
                        {/* Accordion Header */}
                        <div
                          onClick={() => handleAccordionToggle(item)}
                          className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-pink-50 transition-colors cursor-pointer"
                        >
                          <div className="flex-1">
                            <span className="text-gray-700 text-sm sm:text-base">
                              {item.description}
                            </span>
                            {(item.selectedOption || item.selectedOptions) && (
                              <div className="mt-1">
                                {item.selectedOptions ? (
                                  Object.entries(item.selectedOptions).map(([key, value]) => (
                                    <div key={key} className="text-green-600 font-medium text-sm">
                                      {item.options?.find(opt => opt.id === key)?.label}: {value}
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-green-600 font-medium text-sm">
                                    {item.options?.find(opt => opt.id === item.selectedOption)?.label}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transform transition-transform ${
                              expandedItem?.id === item.id ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>

                        {/* Accordion Content */}
                        {expandedItem?.id === item.id && (
                          <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-4">
                            {item.options?.[0]?.isTextInput ? (
                              // Text input options
                              <div className="space-y-4">
                                {item.options.map((option) => (
                                  <div key={option.id} className="space-y-2">
                                    <label className="block font-medium text-gray-700 text-sm">
                                      {option.label}
                                    </label>
                                    <textarea
                                      value={tempValues[option.id] || ''}
                                      onChange={(e) => setTempValues({
                                        ...tempValues,
                                        [option.id]: e.target.value
                                      })}
                                      className="w-full h-12 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                      placeholder={option.description}
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              // Radio options
                              <div className="space-y-2">
                                {item.options?.map((option) => (
                                  <label
                                    key={option.id}
                                    className={`flex flex-col sm:flex-row sm:items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${
                                      tempSelectedOption === option.id
                                        ? 'border-pink-500 bg-pink-50'
                                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                                    }`}
                                  >
                                    {/* Mobile Layout - Radio and Image Row */}
                                    <div className="flex items-center mb-3 sm:mb-0 sm:mr-3">
                                      <input
                                        type="radio"
                                        name={`option-${item.id}`}
                                        value={option.id}
                                        checked={tempSelectedOption === option.id}
                                        onChange={(e) => setTempSelectedOption(e.target.value)}
                                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 mr-3 flex-shrink-0"
                                      />
                                      
                                      {/* Clickable vendor image */}
                                      {option.image && (
                                        <Link 
                                          href={`/vendor/${option.id}`}
                                          className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 hover:ring-2 hover:ring-pink-300 transition-all"
                                          onClick={(e) => e.stopPropagation()} // Prevent radio selection when clicking image
                                        >
                                          <Image
                                            src={option.image}
                                            alt={option.label}
                                            fill
                                            className="object-cover hover:scale-105 transition-transform"
                                            sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                                          />
                                        </Link>
                                      )}
                                    </div>
                                    
                                    {/* Content - Vertical on mobile, horizontal on desktop */}
                                    <div className="flex-1 min-w-0 sm:ml-3">
                                      {/* Clickable vendor title */}
                                      <Link 
                                        href={`/vendor/${option.id}`}
                                        className="text-sm sm:text-base font-medium text-gray-900 block mb-1 hover:text-pink-600 transition-colors"
                                        onClick={(e) => e.stopPropagation()} // Prevent radio selection when clicking title
                                      >
                                        {option.label}
                                      </Link>
                                      
                                      {option.description && (
                                        <p className="text-xs sm:text-sm text-gray-500 mb-2 leading-relaxed">
                                          {option.description}
                                        </p>
                                      )}
                                      
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                                        {option.price && (
                                          <p className="text-xs sm:text-sm font-medium text-pink-600">
                                            {option.price}
                                          </p>
                                        )}
                                        
                                        {option.rating && (
                                          <div className="flex items-center">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-xs text-gray-600 ml-1">{option.rating}</span>
                                          </div>
                                        )}
                                      </div>

                                      {/* Additional vendor details */}
                                      {option.location && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          📍 {option.location}
                                        </p>
                                      )}
                                      
                                      {option.specialties && option.specialties.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                          {option.specialties.slice(0, 3).map((specialty, index) => (
                                            <span
                                              key={index}
                                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                            >
                                              {specialty}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setExpandedItem(null)}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSave(item)}
                                className="px-4 py-1 text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded hover:from-pink-700 hover:to-purple-700"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-700 text-sm sm:text-base">
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 sm:p-8 text-center text-white shadow-xl">
        <Heart className="w-16 h-16 mx-auto mb-4 fill-white" />
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">Congratulations!</h3>
        <p className="text-pink-100 text-sm sm:text-base">
          Wishing you a lifetime of love and happiness. May your wedding day be everything you've dreamed of!
        </p>
      </div>
    </div>
  );
}
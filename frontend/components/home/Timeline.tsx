import React from 'react';
import { Download, CheckCircle, Heart } from 'lucide-react';

export default function Timeline({ weddingDate, timeline, setShowPlan }) {
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
          <div key={idx} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {group.months > 0 
                    ? `${group.months} ${group.months === 1 ? 'Month' : 'Months'} Before`
                    : `${group.weeks} ${group.weeks === 1 ? 'Week' : 'Weeks'} Before`
                  }
                </h3>
                <div className="space-y-4">
                  {group.items.map((item, i) => (
                    <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <p className="text-pink-600 font-medium mb-2 text-sm sm:text-base">
                        {item.title} • {item.category}
                      </p>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base">{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
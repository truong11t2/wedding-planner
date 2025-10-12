import React from 'react';
import { Calendar } from 'lucide-react';
import { generateTimeline } from '@/lib/timelineGenerator';
import { saveWeddingDate } from '@/lib/api';

export default function DateInput({ weddingDate, setWeddingDate, setShowPlan, setTimeline }) {
  // TODO: Remove this in production
  React.useEffect(() => {
    if (!weddingDate) {
      // Set default date to 6 months from now
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 12);
      setWeddingDate(defaultDate.toISOString().split('T')[0]);
    }
  }, []);

  const handleGeneratePlan = () => {
    console.log('Generating plan for date:', weddingDate);
    if (weddingDate) {
      try {
        // Save wedding date to backend if user is logged in
        saveWeddingDate(weddingDate);
        // Generate timeline
        const plan = generateTimeline(weddingDate);
        setTimeline(plan);
        setShowPlan(true);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border-2 border-pink-200">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full mb-4">
          <Calendar className="w-12 h-12 text-pink-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          When's the Big Day?
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Enter your wedding date and we'll create a personalized planning timeline just for you
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="wedding-date" className="block text-sm font-medium text-gray-700 mb-2">
            Wedding Date
          </label>
          <input
            type="date"
            id="wedding-date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-base sm:text-lg text-gray-900 placeholder-gray-700"
          />
        </div>

        <button
          onClick={handleGeneratePlan}
          disabled={!weddingDate}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-base sm:text-lg hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Generate My Timeline
        </button>
      </div>
    </div>
  );
}
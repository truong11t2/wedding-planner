import React from 'react';
import { Calendar } from 'lucide-react';
import { saveUserInput } from '@/api/timeline';
import { useTimeline } from '@/context/TimelineContext';

export interface UserInputProps {
  weddingDate: string;
  setWeddingDate: (date: string) => void;
  location: string;
  setLocation: (location: string) => void;
  setShowPlan: (show: boolean) => void;
}

export default function UserInput({ weddingDate, setWeddingDate, location, setLocation, setShowPlan }: UserInputProps) {
  const { setWeddingDate: setContextWeddingDate } = useTimeline();
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
    console.log('Generating plan for date:', weddingDate, 'location:', location);
    if (weddingDate && location) {
      try {
        // Save wedding date and location to backend if user is logged in
        saveUserInput(weddingDate, location);
        // Update context with wedding date and location (pass location directly to avoid async state issue)
        setContextWeddingDate(weddingDate, location);
        setShowPlan(true);

        // Scroll to top of the page after timeline is generated
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100); // Small delay to ensure state updates are complete
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        alert(errorMessage);
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
          {"Ngày Vui Của Bạn Khi Nào?"}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {"Nhập ngày cưới và chúng tôi sẽ tạo một lịch trình đám cưới dành riêng cho bạn"}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Địa Điểm
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-base sm:text-lg text-gray-900"
          >
            <option value="">Chọn địa điểm</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
          </select>
        </div>

        <div>
          <label htmlFor="wedding-date" className="block text-sm font-medium text-gray-700 mb-2">
            Ngày Cưới
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
          disabled={!weddingDate || !location}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-base sm:text-lg hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Tạo Lịch Trình
        </button>
      </div>
    </div>
  );
}
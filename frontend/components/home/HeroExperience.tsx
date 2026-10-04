'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WeddingDateInput from '@/components/common/WeddingDateInput';
import Timeline from '@/components/home/Timeline';
import { useTimeline } from '@/context/TimelineContext';
import { useAuth } from '@/context/AuthContext';
export default function HeroExperience() {
  const [showDateInput, setShowDateInput] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const { setWeddingDate, weddingDate } = useTimeline();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleDateSubmit = (date: string, location: string) => {
    setWeddingDate(date, location);

    if (isLoggedIn) {
      // If user is logged in, redirect to timeline page
      router.push('/timeline');
    } else {
      // If user is not logged in, show timeline inline
      setShowDateInput(false);
      setShowTimeline(true);
    }
  };

  const handleChangeDate = () => {
    setShowTimeline(false);
    setShowDateInput(true);
  };

  if (showTimeline) {
    return (
      <Timeline initialWeddingDate={weddingDate} onChangeDate={handleChangeDate} />
    );
  }

  if (showDateInput) {
    return (
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-7">
        <WeddingDateInput
          onSubmit={handleDateSubmit}
          title="Bắt đầu kế hoạch cưới"
          description="Cho chúng tôi biết ngày cưới để tạo lịch trình phù hợp với hai bạn."
        />
        <button
          type="button"
          onClick={() => setShowDateInput(false)}
          className="mt-4 text-sm font-medium text-pink-600 underline underline-offset-4"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowDateInput(true)}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pink-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
    >
      Bắt đầu miễn phí <span aria-hidden="true">→</span>
    </button>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import DateInput from './DateInput';
import Timeline from './Timeline';
import FeatureCard from '@/components/common/FeatureCard';
import Testimonials from './Testimonials';
import { Clock, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/api/auth';
import Carousel from './Carousel';

export default function HomePage() {
  const [weddingDate, setWeddingDate] = useState('');
  const [location, setLocation] = useState('');
  const [showPlan, setShowPlan] = useState(false);
  const { isLoggedIn } = useAuth();

  const checkWeddingDate = async () => {
    if (isLoggedIn) {
      const response = await getUserProfile();
      if (response.success && response.user?.weddingDate && response.user?.hasGeneratedTimeline) {
        setWeddingDate(response.user.weddingDate);
        setShowPlan(true);
      }
    }
  };

  useEffect(() => {
    checkWeddingDate();
  }, [isLoggedIn]);

  const features = [
    { icon: Clock, text: 'Hướng dẫn từng bước' },
    { icon: CheckCircle, text: 'Lịch trình chi tiết' },
    { icon: Download, text: 'Cá nhân hóa toàn diện' }
  ];

  const handleChangeDate = () => {
    setWeddingDate('');
    setLocation('');
    setShowPlan(false);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {showPlan ? (
        <div id="timeline-section">
          <Timeline 
            initialWeddingDate={weddingDate} 
            onChangeDate={handleChangeDate}
          />
        </div>
      ) : (
        <>
          <Carousel />
          <div id="date-input-section" className="mt-12">
            <DateInput
              weddingDate={weddingDate}
              setWeddingDate={setWeddingDate}
              location={location}
              setLocation={setLocation}
              setShowPlan={setShowPlan}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 mb-16">
            {features.map((feature, i) => (
              <FeatureCard key={i} icon={feature.icon} text={feature.text} />
            ))}
          </div>
          <Testimonials />
        </>
      )}
    </main>
  );
}
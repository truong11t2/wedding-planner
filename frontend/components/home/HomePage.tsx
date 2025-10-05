'use client';

import React, { useState } from 'react';
import DateInput from './DateInput';
import Timeline from './Timeline';
import FeatureCard from '@/components/common/FeatureCard';
import { Clock, CheckCircle, Download } from 'lucide-react';

export default function HomePage() {
  const [weddingDate, setWeddingDate] = useState('');
  const [showPlan, setShowPlan] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const features = [
    { icon: Clock, text: 'Step-by-step guide' },
    { icon: CheckCircle, text: 'Complete checklist' },
    { icon: Download, text: 'Download as PDF' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {!showPlan ? (
        <div className="max-w-2xl mx-auto">
          <DateInput 
            weddingDate={weddingDate}
            setWeddingDate={setWeddingDate}
            setShowPlan={setShowPlan}
            setTimeline={setTimeline}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} icon={feature.icon} text={feature.text} />
            ))}
          </div>
        </div>
      ) : (
        <Timeline 
          weddingDate={weddingDate}
          timeline={timeline}
          setShowPlan={setShowPlan}
        />
      )}
    </main>
  );
}
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimelineItem, generateTimeline } from '@/lib/timelineGenerator';
import { saveTimeline, loadTimeline, SavedTimelineData } from '@/api/timeline';
import { useAuth } from './AuthContext';
import Toast from '@/components/common/Toast';

interface TimelineContextType {
  timelineItems: TimelineItem[];
  weddingDate: string;
  location: string;
  isLoading: boolean;
  setWeddingDate: (date: string, location?: string) => void;
  updateTimelineItem: (itemId: string, updates: Partial<TimelineItem>) => void;
  saveTimelineData: () => Promise<void>;
  loadTimelineData: () => Promise<void>;
  resetTimeline: () => void;
  lastSaved: Date | null;
  toast: { show: boolean; message: string; type: 'success' | 'error' };
  showToast: (message: string, type?: 'success' | 'error') => void;
  hideToast: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [weddingDate, setWeddingDateState] = useState<string>('');
  const [location, setLocationState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Load timeline when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadTimelineData();
    }
    // Removed the else clause that was clearing timeline for non-logged-in users
  }, [isLoggedIn, user?.id]);

  const setWeddingDate = (date: string, loc?: string) => {
    setWeddingDateState(date);
    if (loc) {
      setLocationState(loc);
    }
    const locationToUse = loc || location;
    if (date) {
      try {
        const newTimeline = generateTimeline(date, locationToUse);
        setTimelineItems(newTimeline);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Lỗi tạo lịch trình', 'error');
      }
    } else {
      // Only clear timeline if date is explicitly cleared
      setTimelineItems([]);
    }
  };

  const updateTimelineItem = (itemId: string, updates: Partial<TimelineItem>) => {
    setTimelineItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const saveTimelineData = async () => {
    // Allow saving attempt but show appropriate message
    if (!isLoggedIn || !user?.id) {
      showToast('Vui lòng đăng nhập để lưu lịch trình', 'error');
      throw new Error('Please log in to save your timeline');
    }

    if (!weddingDate) {
      showToast('Ngày cưới phải được thiết lập', 'error');
      throw new Error('Wedding date must be set');
    }

    setIsLoading(true);

    try {
      const timelineData: SavedTimelineData = {
        userId: user.id,
        weddingDate,
        timelineItems,
      };

      await saveTimeline(timelineData);
      setLastSaved(new Date());
      showToast('Lưu lịch trình thành công', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lưu lịch trình thất bại';
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimelineData = async () => {
    if (!user?.id) {
      console.log('No user ID, skipping timeline load');
      return;
    }

    setIsLoading(true);

    try {
      const savedTimeline = await loadTimeline();
      
      if (savedTimeline) {
        setWeddingDateState(savedTimeline.weddingDate);
        setTimelineItems(savedTimeline.timelineItems.map(item => ({
          ...item,
          dueDate: new Date(item.dueDate), // Convert date strings back to Date objects
        })));
        setLastSaved(savedTimeline.updatedAt ? new Date(savedTimeline.updatedAt) : null);
      }
    } catch (err) {
      // Don't show toast for missing timelines
      if (!(err instanceof Error && err.message?.includes('No timeline found'))) {
        showToast(err instanceof Error ? err.message : 'Tải lịch trình thất bại', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetTimeline = () => {
    setTimelineItems([]);
    setWeddingDateState('');
    setLastSaved(null);
  };

  return (
    <>
      <TimelineContext.Provider
        value={{
          timelineItems,
          weddingDate,
          location,
          isLoading,
          setWeddingDate,
          updateTimelineItem,
          saveTimelineData,
          loadTimelineData,
          resetTimeline,
          lastSaved,
          toast,
          showToast,
          hideToast,
        }}
      >
        {children}
      </TimelineContext.Provider>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />
    </>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}
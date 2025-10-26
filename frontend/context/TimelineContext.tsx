'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimelineItem, generateTimeline } from '@/lib/timelineGenerator';
import { saveTimeline, loadTimeline, SavedTimelineData } from '@/lib/api';
import { useAuth } from './AuthContext';

interface TimelineContextType {
  timelineItems: TimelineItem[];
  weddingDate: string;
  isLoading: boolean;
  error: string | null;
  setWeddingDate: (date: string) => void;
  updateTimelineItem: (itemId: string, updates: Partial<TimelineItem>) => void;
  saveTimelineData: () => Promise<void>;
  loadTimelineData: () => Promise<void>;
  resetTimeline: () => void;
  lastSaved: Date | null;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [weddingDate, setWeddingDateState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load timeline when user logs in
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadTimelineData();
    } else {
      // Clear timeline when user logs out
      setTimelineItems([]);
      setWeddingDateState('');
      setLastSaved(null);
    }
  }, [isLoggedIn, user?.id]);

  const setWeddingDate = (date: string) => {
    setWeddingDateState(date);
    if (date) {
      try {
        const newTimeline = generateTimeline(date);
        setTimelineItems(newTimeline);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error generating timeline');
      }
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
    if (!user?.id || !weddingDate) {
      setError('User must be logged in and wedding date must be set');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const timelineData: SavedTimelineData = {
        userId: user.id,
        weddingDate,
        timelineItems,
      };

      await saveTimeline(timelineData);
      setLastSaved(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save timeline');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimelineData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

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
      setError(err instanceof Error ? err.message : 'Failed to load timeline');
    } finally {
      setIsLoading(false);
    }
  };

  const resetTimeline = () => {
    setTimelineItems([]);
    setWeddingDateState('');
    setError(null);
    setLastSaved(null);
  };

  return (
    <TimelineContext.Provider
      value={{
        timelineItems,
        weddingDate,
        isLoading,
        error,
        setWeddingDate,
        updateTimelineItem,
        saveTimelineData,
        loadTimelineData,
        resetTimeline,
        lastSaved,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}
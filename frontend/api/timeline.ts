import { API_BASE_URL, ENDPOINTS } from './config';

import { TimelineItem } from '@/lib/timelineGenerator';

export interface SavedTimelineData {
  userId: string;
  weddingDate: string;
  timelineItems: TimelineItem[];
  savedAt?: string;
  updatedAt?: string;
}

// Save timeline to backend
export async function saveTimeline(timelineData: SavedTimelineData): Promise<SavedTimelineData> {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TIMELINE.BASE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(timelineData),
    });

    if (!response.ok) {
      throw new Error('Failed to save timeline');
    }

    return await response.json();
  } catch {
    throw new Error('Network error while saving timeline');
  }
}

// Load timeline from backend
export async function loadTimeline(): Promise<SavedTimelineData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TIMELINE.BASE}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No saved timeline found
      }
      throw new Error('Failed to load timeline');
    }

    return await response.json();
  } catch {
    throw new Error('Network error while loading timeline');
  }
}

// Delete timeline from backend
export async function deleteTimeline(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TIMELINE.BASE}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete timeline');
    }
  } catch {
    throw new Error('Network error while deleting timeline');
  }
}

export const getTimelineStatus = async (): Promise<{
  success: boolean;
  data?: {
    hasTimeline: boolean;
    weddingDate?: string;
    updatedAt?: string;
  };
  message?: string;
}> => {
  try {

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TIMELINE.STATUS}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get timeline status',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: 'Network error while fetching timeline status',
    };
  }
};

export const saveUserInput = async (weddingDate: string, location?: string): Promise<{
  success: boolean;
  message?: string;
  weddingDate?: string;
  location?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TIMELINE.WEDDING_DATE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weddingDate, location }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to save wedding date',
      };
    }

    return {
      success: true,
      message: data.message,
      weddingDate: data.weddingDate,
      location: data.location
    };
  } catch {
    return {
      success: false,
      message: 'Network error while saving wedding date',
    };
  }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

import { TimelineItem } from '@/lib/timelineGenerator';

// Define proper user interface
export interface User {
  id: string;
  fullName: string;
  email: string;
  weddingDate?: string;
  hasGeneratedTimeline?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define timeline item interface
// interface TimelineItem {
//   id: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   category: string;
//   completed: boolean;
//   selectedOption?: string;
//   selectedOptions?: Record<string, string>;
//   options?: Array<{
//     id: string;
//     label: string;
//     description?: string;
//     price?: string;
//     image?: string;
//     rating?: number;
//     isTextInput?: boolean;
//   }>;
// }

// Update interfaces to use proper types
interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

interface SocialAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }

    // Store the token if login is successful
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fullName, 
        email, 
        password 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Registration failed',
      };
    }

    // Store the token if registration includes auto-login
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      message: data.message || 'Registration successful',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
    };
  }
};

export type Provider = 'Gmail' | 'Outlook' | 'Facebook' | 'Twitter';

export const socialLogin = async (provider: Provider): Promise<SocialAuthResponse> => {
  try {
    const response = await fetch('/api/auth/social-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `${provider} login failed`,
      };
    }

    // Store the token in localStorage or handle it according to your auth strategy
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: `An error occurred during ${provider} login: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

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
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/timeline/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
  } catch (error) {
    console.error('Error getting timeline status:', error);
    return {
      success: false,
      message: 'Network error while fetching timeline status',
    };
  }
};

// Utility function to check if backend is reachable
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<AuthResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get user profile',
      };
    }

    return {
      success: true,
      user: data.user || data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return {
      success: false,
      message: 'Network error while fetching profile',
    };
  }
};

// Add this utility function for retrying failed requests
const retryRequest = async (requestFn: () => Promise<Response>, maxRetries = 3): Promise<Response> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
};

// Example usage in login function with retry:
export const loginUserWithRetry = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await retryRequest(async () => {
      const fetchResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!fetchResponse.ok) {
        throw new Error(`HTTP ${fetchResponse.status}`);
      }
      
      return fetchResponse;
    });

    const data = await response.json();

    // Store the token if login is successful
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return {
      success: true,
      token: data.token,
      user: data.user,
      message: data.message,
    };
  } catch (error) {
    console.error('Login error after retries:', error);
    return {
      success: false,
      message: 'Unable to connect to server. Please try again.',
    };
  }
};

export const saveWeddingDate = async (weddingDate: string): Promise<AuthResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/wedding-date`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ weddingDate }),
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
      user: data.data,
    };
  } catch (error) {
    console.error('Error saving wedding date:', error);
    return {
      success: false,
      message: 'Network error while saving wedding date',
    };
  }
};

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
    const response = await fetch(`${API_BASE_URL}/api/timeline/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Adjust based on your auth implementation
      },
      body: JSON.stringify(timelineData),
    });

    if (!response.ok) {
      throw new Error('Failed to save timeline');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving timeline:', error);
    throw error;
  }
}

// Load timeline from backend
export async function loadTimeline(): Promise<SavedTimelineData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/timeline/get`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Adjust based on your auth implementation
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No saved timeline found
      }
      throw new Error('Failed to load timeline');
    }

    return await response.json();
  } catch (error) {
    console.error('Error loading timeline:', error);
    throw error;
  }
}

// Delete timeline from backend
export async function deleteTimeline(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/timeline/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Adjust based on your auth implementation
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete timeline');
    }
  } catch (error) {
    console.error('Error deleting timeline:', error);
    throw error;
  }
}

export interface ChecklistItem {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Get user's checklist
export const getChecklist = async (): Promise<{
  success: boolean;
  data?: ChecklistItem[];
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checklist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get checklist',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting checklist:', error);
    return {
      success: false,
      message: 'Network error while fetching checklist',
    };
  }
};

// Save entire checklist
export const saveChecklist = async (checklistItems: ChecklistItem[]): Promise<{
  success: boolean;
  data?: ChecklistItem[];
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checklist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ checklistItems }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to save checklist',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error saving checklist:', error);
    return {
      success: false,
      message: 'Network error while saving checklist',
    };
  }
};

// Add single checklist item
export const addChecklistItem = async (item: Omit<ChecklistItem, 'id' | 'completed'>): Promise<{
  success: boolean;
  data?: ChecklistItem;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checklist/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to add checklist item',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error adding checklist item:', error);
    return {
      success: false,
      message: 'Network error while adding checklist item',
    };
  }
};

// Update checklist item
export const updateChecklistItem = async (itemId: number, updates: Partial<ChecklistItem>): Promise<{
  success: boolean;
  data?: ChecklistItem;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checklist/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update checklist item',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return {
      success: false,
      message: 'Network error while updating checklist item',
    };
  }
};

// Delete checklist item
export const deleteChecklistItem = async (itemId: number): Promise<{
  success: boolean;
  data?: ChecklistItem;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checklist/item/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete checklist item',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error deleting checklist item:', error);
    return {
      success: false,
      message: 'Network error while deleting checklist item',
    };
  }
};

// Toggle checklist item completion
export const toggleChecklistItem = async (itemId: number): Promise<{
  success: boolean;
  data?: ChecklistItem;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/checklist/item/${itemId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to toggle checklist item',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error toggling checklist item:', error);
    return {
      success: false,
      message: 'Network error while toggling checklist item',
    };
  }
};

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  side: 'bride' | 'groom';
  rsvpStatus: 'pending' | 'attending' | 'declined' | 'no-response';
  plusOne: boolean;
  plusOneName?: string;
  dietaryRestrictions?: string;
  notes?: string;
  createdAt: string;
}

export interface GuestStats {
  total: number;
  bride: {
    total: number;
    attending: number;
    declined: number;
    pending: number;
    plusOnes: number;
  };
  groom: {
    total: number;
    attending: number;
    declined: number;
    pending: number;
    plusOnes: number;
  };
  overall: {
    attending: number;
    declined: number;
    pending: number;
    totalPlusOnes: number;
    expectedAttendees: number;
  };
}

// Get user's guest list
export const getGuestList = async (): Promise<{
  success: boolean;
  data?: Guest[];
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get guest list',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting guest list:', error);
    return {
      success: false,
      message: 'Network error while fetching guest list',
    };
  }
};

// Save entire guest list
export const saveGuestList = async (guests: Guest[]): Promise<{
  success: boolean;
  data?: Guest[];
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ guests }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to save guest list',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error saving guest list:', error);
    return {
      success: false,
      message: 'Network error while saving guest list',
    };
  }
};

// Add single guest
export const addGuest = async (guest: Omit<Guest, 'id' | 'createdAt'>): Promise<{
  success: boolean;
  data?: Guest;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(guest),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to add guest',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error adding guest:', error);
    return {
      success: false,
      message: 'Network error while adding guest',
    };
  }
};

// Update guest
export const updateGuest = async (guestId: string, updates: Partial<Guest>): Promise<{
  success: boolean;
  data?: Guest;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests/${guestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update guest',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error updating guest:', error);
    return {
      success: false,
      message: 'Network error while updating guest',
    };
  }
};

// Delete guest
export const deleteGuest = async (guestId: string): Promise<{
  success: boolean;
  data?: Guest;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests/${guestId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete guest',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error deleting guest:', error);
    return {
      success: false,
      message: 'Network error while deleting guest',
    };
  }
};

// Update RSVP status
export const updateRSVP = async (guestId: string, rsvpStatus: Guest['rsvpStatus']): Promise<{
  success: boolean;
  data?: Guest;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests/${guestId}/rsvp`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rsvpStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update RSVP',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return {
      success: false,
      message: 'Network error while updating RSVP',
    };
  }
};

// Get guest statistics
export const getGuestStats = async (): Promise<{
  success: boolean;
  data?: GuestStats;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/guests/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get guest statistics',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting guest statistics:', error);
    return {
      success: false,
      message: 'Network error while fetching guest statistics',
    };
  }
};

// Add this interface and functions at the end of the file

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface BudgetData {
  totalBudget: number;
  categories: BudgetCategory[];
  lastUpdated: string;
}

export interface BudgetStats {
  totalBudget: number;
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  categoryCount: number;
  overBudgetCategories: number;
  categories: {
    high: number;
    medium: number;
    low: number;
  };
  budgetUsedPercentage: number;
}

// Get user's budget data
export const getBudgetData = async (): Promise<{
  success: boolean;
  data?: BudgetData;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get budget data',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting budget data:', error);
    return {
      success: false,
      message: 'Network error while fetching budget data',
    };
  }
};

// Save entire budget data
export const saveBudgetData = async (budgetData: { totalBudget: number; categories: BudgetCategory[] }): Promise<{
  success: boolean;
  data?: BudgetData;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(budgetData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to save budget data',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error saving budget data:', error);
    return {
      success: false,
      message: 'Network error while saving budget data',
    };
  }
};

// Update total budget only
export const updateTotalBudget = async (totalBudget: number): Promise<{
  success: boolean;
  data?: BudgetData;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget/total`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ totalBudget }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update total budget',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error updating total budget:', error);
    return {
      success: false,
      message: 'Network error while updating total budget',
    };
  }
};

// Add single budget category
export const addBudgetCategory = async (category: Omit<BudgetCategory, 'id'>): Promise<{
  success: boolean;
  data?: BudgetCategory;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to add budget category',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error adding budget category:', error);
    return {
      success: false,
      message: 'Network error while adding budget category',
    };
  }
};

// Update budget category
export const updateBudgetCategory = async (categoryId: string, updates: Partial<BudgetCategory>): Promise<{
  success: boolean;
  data?: BudgetCategory;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget/category/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update budget category',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error updating budget category:', error);
    return {
      success: false,
      message: 'Network error while updating budget category',
    };
  }
};

// Delete budget category
export const deleteBudgetCategory = async (categoryId: string): Promise<{
  success: boolean;
  data?: BudgetCategory;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget/category/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to delete budget category',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error deleting budget category:', error);
    return {
      success: false,
      message: 'Network error while deleting budget category',
    };
  }
};

// Get budget statistics
export const getBudgetStats = async (): Promise<{
  success: boolean;
  data?: BudgetStats;
  message?: string;
}> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/budget/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to get budget statistics',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting budget statistics:', error);
    return {
      success: false,
      message: 'Network error while fetching budget statistics',
    };
  }
};

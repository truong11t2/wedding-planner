import { API_BASE_URL, ENDPOINTS } from './config';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  side: 'bride' | 'groom';
  category: 'family' | 'friend' | 'coworker' | 'other';
  rsvpStatus: 'pending' | 'attending' | 'declined' | 'no-response';
  plusOne: boolean;
  plusOneName?: string;
  dietaryRestrictions?: string;
  notes?: string;
  tableNumber?: number;
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.BASE}`, {
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
        message: data.message || 'Failed to get guest list',
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.BASE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.ADD}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.BASE}/${guestId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.BASE}/${guestId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.BASE}/${guestId}/rsvp`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GUEST.STATS}`, {
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
        message: data.message || 'Failed to get guest statistics',
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
      message: 'Network error while fetching guest statistics',
    };
  }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Define proper user interface
interface User {
  id: string;
  fullName: string;
  email: string;
  weddingDate?: string;
  hasGeneratedTimeline?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define timeline item interface
interface TimelineItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  completed: boolean;
  selectedOption?: string;
  selectedOptions?: Record<string, string>;
  options?: Array<{
    id: string;
    label: string;
    description?: string;
    price?: string;
    image?: string;
    rating?: number;
    isTextInput?: boolean;
  }>;
}

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

interface TimelineData {
  weddingDate: string;
  timeline: TimelineItem[];
}

interface SaveTimelineResponse {
  success: boolean;
  message?: string;
}

interface GetTimelineResponse {
  success: boolean;
  data?: TimelineData;
  message?: string;
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

export const saveUserTimeline = async (
  weddingDate: string, 
  timeline: TimelineItem[]
): Promise<SaveTimelineResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/timeline/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ weddingDate, timeline }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to save timeline',
      };
    }

    return {
      success: true,
      message: data.message || 'Timeline saved successfully',
    };
  } catch (error) {
    console.error('Error saving timeline:', error);
    return {
      success: false,
      message: 'Network error while saving timeline',
    };
  }
};

export const getUserTimeline = async (): Promise<GetTimelineResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/timeline/get`, {
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
        message: data.message || 'Failed to get timeline',
      };
    }

    return {
      success: true,
      data: data.timeline || data,
      message: data.message,
    };
  } catch (error) {
    console.error('Error getting timeline:', error);
    return {
      success: false,
      message: 'Network error while fetching timeline',
    };
  }
};

export const deleteUserTimeline = async (): Promise<SaveTimelineResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return {
        success: false,
        message: 'No authentication token found',
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/timeline/delete`, {
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
        message: data.message || 'Failed to delete timeline',
      };
    }

    return {
      success: true,
      message: data.message || 'Timeline deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting timeline:', error);
    return {
      success: false,
      message: 'Network error while deleting timeline',
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
const API_BASE_URL = process.env.BACKEND_ADDRESS || 'http://localhost:5000';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  weddingDate?: string;
  hasGeneratedTimeline?: boolean;
  createdAt: string;
  updatedAt: string;
}

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
      credentials: 'include',
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

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.',
    };
  }
};

// Get user profile
export const getUserProfile = async (): Promise<AuthResponse> => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
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


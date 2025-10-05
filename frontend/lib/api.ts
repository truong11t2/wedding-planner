interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/auth/login', {
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
      message: 'An error occurred during login',
    };
  }
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Registration failed',
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
      message: 'An error occurred during registration',
    };
  }
};

interface SocialAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
}

type Provider = 'Gmail' | 'Outlook' | 'Facebook' | 'Twitter';

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
      message: `An error occurred during ${provider} login`,
    };
  }
};
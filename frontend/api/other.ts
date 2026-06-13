import { API_BASE_URL, ENDPOINTS } from './config';

// Utility function to check if backend is reachable
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.HEALTH}`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
};

// Submit general contact form
export const submitContact = async (data: {
  email: string;
  message: string;
  name?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CONTACT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đã xảy ra lỗi khi gửi thông tin');
    }

    return await response.json();
  } catch {
    throw new Error('Đã xảy ra lỗi khi gửi thông tin');
  }
};


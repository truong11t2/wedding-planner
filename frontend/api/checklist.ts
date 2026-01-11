import { API_BASE_URL, ENDPOINTS } from './config';

export interface ChecklistItem {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  priority: 'cao' | 'trung bình' | 'thấp';
}

// Get user's checklist
export const getChecklist = async (): Promise<{
  success: boolean;
  data?: ChecklistItem[];
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHECKLIST.BASE}`, {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHECKLIST.BASE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHECKLIST.ITEM}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHECKLIST.ITEM}/${itemId}`, {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHECKLIST.ITEM}/${itemId}`, {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CHECKLIST.ITEM}/${itemId}/toggle`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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

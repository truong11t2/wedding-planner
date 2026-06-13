import { API_BASE_URL, ENDPOINTS } from './config';

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
  description: string;
  priority: 'cao' | 'trung bình' | 'thấp';
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.BASE}`, {
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
        message: data.message || 'Failed to get budget data',
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.BASE}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.TOTAL}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.CATEGORY}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
  } catch {
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.CATEGORY}/${categoryId}`, {
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
        message: data.message || 'Failed to update budget category',
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.CATEGORY}/${categoryId}`, {
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
        message: data.message || 'Failed to delete budget category',
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
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.BUDGET.STATS}`, {
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
        message: data.message || 'Failed to get budget statistics',
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
      message: 'Network error while fetching budget statistics',
    };
  }
};

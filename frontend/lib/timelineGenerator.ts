import { getVendorOptions } from './vendorData';
import timelineConfig from '@/data/timelineConfig.json';

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: string;
  isWeddingDay?: boolean;
  options?: {
    image?: string;
    location?: string;
    specialties?: string[];
    rating?: number;
    id: string;
    label: string;
    description?: string;
    price?: string;
    isTextInput?: boolean;
    textValue?: string;
  }[];
  selectedOptions?: { [key: string]: string }; // For text input options
  selectedOption?: string; // For single select options
}

interface TimelineConfigItem {
  id: string;
  title: string;
  description: string;
  monthsBeforeWedding: number;
  category: string;
  isWeddingDay?: boolean;
  vendorType?: string;
  options?: {
    id: string;
    label: string;
    description?: string;
    price?: string;
    isTextInput?: boolean;
  }[];
}

export const generateTimeline = (weddingDate: string): TimelineItem[] => {
  const weddingDay = new Date(weddingDate);
  const today = new Date();
  
  // Check if wedding date is at least 3 months away
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);
  
  if (weddingDay < threeMonthsFromNow) {
    throw new Error("Wedding date must be at least 3 months in advance for proper planning.");
  }

  // Helper function to calculate due date based on months before wedding
  const getDateBeforeWedding = (months: number): Date => {
    const date = new Date(weddingDay);
    if (months >= 1) {
      date.setMonth(date.getMonth() - months);
    } else {
      // Convert months to weeks (0.5 months = 2 weeks, 0.25 months = 1 week)
      const weeks = months * 4;
      date.setDate(date.getDate() - (weeks * 7));
    }
    return date;
  };

  // Generate timeline from JSON configuration
  const timeline: TimelineItem[] = timelineConfig.timelineItems.map((configItem: TimelineConfigItem) => {
    const timelineItem: TimelineItem = {
      id: configItem.id,
      title: configItem.title,
      description: configItem.description,
      dueDate: getDateBeforeWedding(configItem.monthsBeforeWedding),
      completed: false,
      category: configItem.category,
      isWeddingDay: configItem.isWeddingDay || false,
    };

    // Handle vendor options
    if (configItem.vendorType) {
      timelineItem.options = getVendorOptions(configItem.vendorType);
    } 
    // Handle predefined options from config
    else if (configItem.options) {
      timelineItem.options = configItem.options.map(option => ({
        id: option.id,
        label: option.label,
        description: option.description,
        price: option.price,
        isTextInput: option.isTextInput || false,
      }));
    }

    return timelineItem;
  });

  // Sort timeline by due date (earliest first, but we'll reverse this in the component)
  return timeline.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

// Utility function to add new timeline items programmatically
export const addTimelineItem = (
  weddingDate: string,
  customItem: Omit<TimelineConfigItem, 'id'> & { id?: string }
): TimelineItem => {
  const weddingDay = new Date(weddingDate);
  const getDateBeforeWedding = (months: number): Date => {
    const date = new Date(weddingDay);
    if (months >= 1) {
      date.setMonth(date.getMonth() - months);
    } else {
      const weeks = months * 4;
      date.setDate(date.getDate() - (weeks * 7));
    }
    return date;
  };

  return {
    id: customItem.id || `custom-${Date.now()}`,
    title: customItem.title,
    description: customItem.description,
    dueDate: getDateBeforeWedding(customItem.monthsBeforeWedding),
    completed: false,
    category: customItem.category,
    isWeddingDay: customItem.isWeddingDay || false,
    options: customItem.options?.map(option => ({
      id: option.id,
      label: option.label,
      description: option.description,
      price: option.price,
      isTextInput: option.isTextInput || false,
    })),
  };
};

// Utility function to get timeline categories
export const getTimelineCategories = (): string[] => {
  const categories = new Set(timelineConfig.timelineItems.map(item => item.category));
  return Array.from(categories).sort();
};

// Utility function to get timeline items by category
export const getTimelineItemsByCategory = (category: string): TimelineConfigItem[] => {
  return timelineConfig.timelineItems.filter(item => item.category === category);
};

// Utility function to validate timeline configuration
export const validateTimelineConfig = (): boolean => {
  try {
    const requiredFields = ['id', 'title', 'description', 'monthsBeforeWedding', 'category'];
    
    return timelineConfig.timelineItems.every(item => {
      return requiredFields.every(field => field in item);
    });
  } catch (error) {
    console.error('Timeline configuration validation failed:', error);
    return false;
  }
};
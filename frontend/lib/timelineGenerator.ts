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

export interface SavedTimelineItem {
  id: string;
  completed: boolean;
  selectedOption?: string;
  selectedOptions?: { [key: string]: string };
}

export const mergeSavedTimelineItems = (
  items: TimelineItem[],
  savedItems: SavedTimelineItem[]
): TimelineItem[] => {
  const savedMap = new Map(savedItems.map(item => [item.id, item]));

  return items.map(item => {
    const saved = savedMap.get(item.id);
    if (!saved) {
      return item;
    }

    return {
      ...item,
      completed: saved.completed,
      selectedOption: saved.selectedOption,
      selectedOptions: saved.selectedOptions,
    };
  });
};

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

export const generateTimeline = (weddingDate: string, location?: string): TimelineItem[] => {
  const weddingDay = new Date(weddingDate);
  const today = new Date();
  // Calculate total days from today to wedding
  const D_total = Math.max(1, Math.floor((weddingDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Find the maximum monthsBeforeWedding in config (for normalization)
  const maxMonths = Math.max(...timelineConfig.timelineItems.map((item: TimelineConfigItem) => item.monthsBeforeWedding));

  // Generate timeline with dynamic offsets
  const timeline: TimelineItem[] = timelineConfig.timelineItems.map((configItem: TimelineConfigItem) => {
    // Normalize offset: 1 = earliest task, 0 = wedding day
    const P_task = Math.min(1, Math.max(0, configItem.monthsBeforeWedding / maxMonths));
    // Calculate due date: today + (D_total * (1 - P_task))
    let dueDate: Date;
    // If the original offset is greater than available time, schedule ASAP
    const daysOffset = Math.round(D_total * (1 - P_task));
    if (configItem.monthsBeforeWedding * 30 > D_total) {
      dueDate = new Date(today);
    } else {
      dueDate = new Date(today);
      dueDate.setDate(today.getDate() + daysOffset);
    }

    const timelineItem: TimelineItem = {
      id: configItem.id,
      title: configItem.title,
      description: configItem.description,
      dueDate,
      completed: false,
      category: configItem.category,
      isWeddingDay: configItem.isWeddingDay || false,
    };

    // Handle vendor options with location filtering
    if (configItem.vendorType) {
      timelineItem.options = getVendorOptions(configItem.vendorType, location);
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

  // Sort timeline by due date (earliest first)
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
    // eslint-disable-next-line no-console
    console.error('Timeline configuration validation failed:', error);
    return false;
  }
};
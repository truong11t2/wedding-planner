import timelineConfig from '@/data/timelineConfig.json';

export interface TimelineConfigItem {
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

// Function to export current timeline config (for backup/editing)
export const exportTimelineConfig = (): string => {
  return JSON.stringify(timelineConfig, null, 2);
};

// Function to validate a timeline item
export const validateTimelineItem = (item: TimelineConfigItem): string[] => {
  const errors: string[] = [];
  
  if (!item.id || item.id.trim() === '') {
    errors.push('ID is required');
  }
  
  if (!item.title || item.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (!item.description || item.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (typeof item.monthsBeforeWedding !== 'number' || item.monthsBeforeWedding < 0) {
    errors.push('Months before wedding must be a positive number');
  }
  
  if (!item.category || item.category.trim() === '') {
    errors.push('Category is required');
  }
  
  return errors;
};

// Function to generate a new timeline item template
export const createTimelineItemTemplate = (): TimelineConfigItem => {
  return {
    id: '',
    title: '',
    description: '',
    monthsBeforeWedding: 1,
    category: 'Planning',
    options: []
  };
};
declare module '@/data/timelineConfig.json' {
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

  interface TimelineConfig {
    timelineItems: TimelineConfigItem[];
  }

  const value: TimelineConfig;
  export default value;
}
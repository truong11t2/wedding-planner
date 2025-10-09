interface TimelineItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: string;
  isWeddingDay?: boolean;
  options?: {
    id: string;
    label: string;
    description?: string;
    price?: string;
    isTextInput?: boolean;
    textValue?: string;
  }[];
  selectedOptions?: { [key: string]: string }; // Changed from selectedOption to selectedOptions
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

  const timeline: TimelineItem[] = [];

  // Helper function to subtract months or weeks from wedding date
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

  // 12 months before
  timeline.push({
    id: "set-budget",
    title: "Set Your Budget",
    description: "Determine your total budget and how to allocate it",
    dueDate: getDateBeforeWedding(12),
    completed: false,
    category: "Yourself",
    options: [
      {
        id: 'budget',
        label: 'Budget Friendly',
        description: 'Essential services with cost-effective choices',
        price: '$5,000 - $15,000'
      },
      {
        id: 'medium',
        label: 'Medium Range',
        description: 'Balance of quality and cost with some premium services',
        price: '$15,000 - $30,000'
      },
      {
        id: 'luxury',
        label: 'Luxury',
        description: 'Premium services and exclusive venues',
        price: '$30,000+'
      }
    ]
  });
  
  timeline.push({
    id: "choose-party",
    title: "Choose Wedding Party",
    description: "Select your bridesmaids, groomsmen, and other key roles",
    dueDate: getDateBeforeWedding(12),
    completed: false,
    category: "Yourself",
    options: [
      {
        id: 'bride-side',
        label: 'Bride Side',
        description: 'Enter names of bridesmaids',
        isTextInput: true
      },
      {
        id: 'groom-side',
        label: 'Groom Side',
        description: 'Enter names of groomsmen',
        isTextInput: true
      },
      {
        id: 'other-roles',
        label: 'Other Roles',
        description: 'Enter any other important roles',
        isTextInput: true
      }
    ]
  });

  // 9 months before
  timeline.push({
    id: "book-venue",
    title: "Book Venue",
    description: "Secure your ceremony and reception venues",
    dueDate: getDateBeforeWedding(9),
    completed: false,
    category: "Vendor"
  });
  
  timeline.push({
    id: "book-photographer",
    title: "Book Photographer",
    description: "Research and book your wedding photographer",
    dueDate: getDateBeforeWedding(9),
    completed: false,
    category: "Vendor"
  });

  // 6 months before
  timeline.push({
    id: "order-dress",
    title: "Order Wedding Dress",
    description: "Start shopping for and order your wedding dress",
    dueDate: getDateBeforeWedding(6),
    completed: false,
    category: "Attire"
  });
  
  timeline.push({
    id: "book-caterer",
    title: "Book Caterer",
    description: "Select your catering service and plan the menu",
    dueDate: getDateBeforeWedding(6),
    completed: false,
    category: "Vendor"
  });

  // 3 months before
  timeline.push({
    id: "send-invitations",
    title: "Send Invitations",
    description: "Mail out wedding invitations to your guest list",
    dueDate: getDateBeforeWedding(3),
    completed: false,
    category: "Yourself"
  });
  
  timeline.push({
    id: "order-rings",
    title: "Order Wedding Rings",
    description: "Choose and order your wedding bands",
    dueDate: getDateBeforeWedding(3),
    completed: false,
    category: "Attire"
  });

  // 1 month before
  timeline.push({
    id: "final-dress-fitting",
    title: "Final Dress Fitting",
    description: "Schedule final dress alterations and fitting",
    dueDate: getDateBeforeWedding(1),
    completed: false,
    category: "Attire"
  });
  
  timeline.push({
    id: "create-timeline",
    title: "Create Timeline",
    description: "Finalize wedding day schedule with vendors",
    dueDate: getDateBeforeWedding(1),
    completed: false,
    category: "Planning"
  });

  // 2 weeks before
  timeline.push({
    id: "final-vendor-confirmations",
    title: "Final Vendor Confirmations",
    description: "Confirm final details, timing, and setup with all vendors",
    dueDate: getDateBeforeWedding(0.5),
    completed: false,
    category: "Vendor"
  });

  timeline.push({
    id: "wedding-rehearsal-planning",
    title: "Wedding Rehearsal Planning",
    description: "Organize rehearsal dinner and ceremony practice details",
    dueDate: getDateBeforeWedding(0.5),
    completed: false,
    category: "Planning"
  });

  timeline.push({
    id: "final-guest-count",
    title: "Final Guest Count",
    description: "Provide final headcount to venue and caterer",
    dueDate: getDateBeforeWedding(0.5),
    completed: false,
    category: "Planning"
  });

  // Final week
  timeline.push({
    id: "beauty-appointments",
    title: "Beauty Appointments",
    description: "Hair trial, facial, and other beauty preparations",
    dueDate: getDateBeforeWedding(0.25),
    completed: false,
    category: "Personal"
  });

  timeline.push({
    id: "pick-up-wedding-attire",
    title: "Pick Up Wedding Attire",
    description: "Collect wedding dress, suits, and accessories",
    dueDate: getDateBeforeWedding(0.25),
    completed: false,
    category: "Attire"
  });

  timeline.push({
    id: "pack-wedding-day-kit",
    title: "Pack Wedding Day Kit",
    description: "Emergency supplies, makeup, accessories, and documents",
    dueDate: getDateBeforeWedding(0.25),
    completed: false,
    category: "Planning"
  });

  timeline.push({
    id: "marriage-license",
    title: "Marriage License",
    description: "Ensure marriage license is ready and valid",
    dueDate: getDateBeforeWedding(0.25),
    completed: false,
    category: "Legal"
  });

  timeline.push({
    id: "ceremony-items",
    title: "Ceremony Items",
    description: "Prepare rings, vows, and other ceremony essentials",
    dueDate: getDateBeforeWedding(0.25),
    completed: false,
    category: "Planning"
  });

  // Update the wedding day item
  timeline.push({
    id: "enjoy-wedding-day",
    title: "Enjoy Your Wedding Day!",
    description: "Relax and celebrate your special day",
    dueDate: getDateBeforeWedding(0),
    completed: false,
    category: "Celebration",
    isWeddingDay: true
  });

  // Sort timeline by due date (reversed order)
  return timeline.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());
};
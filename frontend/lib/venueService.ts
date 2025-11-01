import venuesData from '@/data/venues.json';

export interface Venue {
  id: string;
  name: string;
  description: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  pricing: {
    basePrice: number;
    priceRange: string;
    guestCapacity: {
      min: number;
      max: number;
    };
  };
  amenities: string[];
  venueType: string[];
  rating: number;
  reviewCount: number;
  availability: {
    weekdays: boolean;
    weekends: boolean;
    holidays: boolean;
  };
  features: {
    indoor: boolean;
    outdoor: boolean;
    parking: boolean;
    catering: boolean;
    alcohol: boolean;
    music: boolean;
    wifi: boolean;
    airConditioning: boolean;
    security: boolean;
  };
  policies: {
    cancellation: string;
    deposit: string;
    setupTime: string;
  };
  isFavorite: boolean;
}

export interface VenueData {
  venues: Venue[];
}

// In-memory storage for favorites (in real app, this would be in backend/localStorage)
class VenueDataManager {
  private venues: Venue[];

  constructor() {
    this.venues = venuesData.venues.map(venue => ({ ...venue }));
  }

  getAllVenues(): Venue[] {
    return [...this.venues];
  }

  getVenueById(id: string): Venue | null {
    return this.venues.find(venue => venue.id === id) || null;
  }

  toggleFavorite(venueId: string): Venue | null {
    const venueIndex = this.venues.findIndex(venue => venue.id === venueId);
    if (venueIndex !== -1) {
      this.venues[venueIndex].isFavorite = !this.venues[venueIndex].isFavorite;
      return { ...this.venues[venueIndex] };
    }
    return null;
  }

  getVenueTypes(): string[] {
    return Array.from(new Set(this.venues.flatMap(venue => venue.venueType)));
  }

  searchVenues(query: string): Venue[] {
    const lowercaseQuery = query.toLowerCase();
    return this.venues.filter(venue =>
      venue.name.toLowerCase().includes(lowercaseQuery) ||
      venue.description.toLowerCase().includes(lowercaseQuery) ||
      venue.address.city.toLowerCase().includes(lowercaseQuery) ||
      venue.venueType.some(type => type.toLowerCase().includes(lowercaseQuery))
    );
  }

  filterVenues(filters: {
    venueType?: string;
    guestCount?: number;
    priceRange?: string;
    rating?: number;
  }): Venue[] {
    return this.venues.filter(venue => {
      // Venue type filter
      if (filters.venueType && filters.venueType !== 'all') {
        const hasType = venue.venueType.some(type => 
          type.toLowerCase() === filters.venueType?.toLowerCase()
        );
        if (!hasType) return false;
      }

      // Guest count filter
      if (filters.guestCount) {
        const withinCapacity = filters.guestCount >= venue.pricing.guestCapacity.min && 
                              filters.guestCount <= venue.pricing.guestCapacity.max;
        if (!withinCapacity) return false;
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange !== 'all') {
        let priceMatch = false;
        switch (filters.priceRange) {
          case 'budget':
            priceMatch = venue.pricing.basePrice < 10000;
            break;
          case 'mid':
            priceMatch = venue.pricing.basePrice >= 10000 && venue.pricing.basePrice < 20000;
            break;
          case 'luxury':
            priceMatch = venue.pricing.basePrice >= 20000;
            break;
        }
        if (!priceMatch) return false;
      }

      // Rating filter
      if (filters.rating && filters.rating > 0) {
        if (venue.rating < filters.rating) return false;
      }

      return true;
    });
  }
}

// Export singleton instance
export const venueService = new VenueDataManager();
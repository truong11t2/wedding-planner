'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/common/Toast';
import { 
  MapPin, 
  Star, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  Heart,
  Filter,
  Search,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  Wifi,
  Music,
  Utensils,
  Wine,
  ParkingCircle,
  AirVent,
  Shield,
  MapPinned
} from 'lucide-react';
import { venueService } from '@/lib/venueService';

interface Venue {
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

interface VenueCardProps {
  venue: Venue;
  onToggleFavorite: (venueId: string) => void;
  onViewDetails: (venue: Venue) => void;
  viewMode: 'grid' | 'list';
}

function VenueCard({ venue, onToggleFavorite, onViewDetails, viewMode }: VenueCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="flex">
          <div className="relative w-64 h-48 flex-shrink-0">
            <img
              src={venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onToggleFavorite(venue.id)}
              className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-colors ${
                venue.isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${venue.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{venue.name}</h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {venue.address.city}, {venue.address.state}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{venue.rating}</span>
                  <span className="text-gray-500 ml-1">({venue.reviewCount})</span>
                </div>
                <div className="text-lg font-bold text-pink-600">{venue.pricing.priceRange}</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{venue.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {venue.pricing.guestCapacity.min}-{venue.pricing.guestCapacity.max} guests
                </div>
                <div className="flex flex-wrap gap-1">
                  {venue.venueType.slice(0, 2).map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => onViewDetails(venue)}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => onToggleFavorite(venue.id)}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-colors ${
            venue.isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${venue.isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
            <Camera className="h-3 w-3 mr-1" />
            {venue.images.length} photos
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-medium">{venue.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          {venue.address.city}, {venue.address.state}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{venue.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            {venue.pricing.guestCapacity.min}-{venue.pricing.guestCapacity.max} guests
          </div>
          <div className="text-lg font-bold text-pink-600">{venue.pricing.priceRange}</div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {venue.venueType.slice(0, 2).map((type) => (
            <span
              key={type}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {type}
            </span>
          ))}
        </div>

        <button
          onClick={() => onViewDetails(venue)}
          className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

interface VenueDetailsModalProps {
  venue: Venue | null;
  onClose: () => void;
  onToggleFavorite: (venueId: string) => void;
}

function VenueDetailsModal({ venue, onClose, onToggleFavorite }: VenueDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!venue) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Parking': <ParkingCircle className="h-5 w-5" />,
    'WiFi': <Wifi className="h-5 w-5" />,
    'Air Conditioning': <AirVent className="h-5 w-5" />,
    'Sound System': <Music className="h-5 w-5" />,
    'Catering Kitchen': <Utensils className="h-5 w-5" />,
    'Bar Service': <Wine className="h-5 w-5" />,
    'Security': <Shield className="h-5 w-5" />,
    'Bridal Suite': <Heart className="h-5 w-5" />
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{venue.name}</h2>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {venue.address.street}, {venue.address.city}, {venue.address.state}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(venue.id)}
              className={`p-2 rounded-lg transition-colors ${
                venue.isFavorite 
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-gray-50 text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${venue.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={venue.images[currentImageIndex]}
                alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {venue.images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {venue.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentImageIndex === index ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Venue</h3>
                <p className="text-gray-600 leading-relaxed">{venue.description}</p>
              </div>

              {/* Venue Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Venue Types</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.venueType.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <div className="text-pink-600">
                        {amenityIcons[amenity] || <Star className="h-5 w-5" />}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(venue.features).map(([feature, available]) => (
                    available && (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Policies</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellation:</span>
                    <span className="text-gray-900">{venue.policies.cancellation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit Required:</span>
                    <span className="text-gray-900">{venue.policies.deposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Setup Time:</span>
                    <span className="text-gray-900">{venue.policies.setupTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="text-2xl font-bold text-pink-600 mb-2">{venue.pricing.priceRange}</div>
                <div className="text-sm text-gray-600 mb-3">Starting from ${venue.pricing.basePrice.toLocaleString()}</div>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  {venue.pricing.guestCapacity.min}-{venue.pricing.guestCapacity.max} guests
                </div>

                <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                  Check Availability
                </button>
              </div>

              {/* Contact */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${venue.contact.phone}`} className="text-pink-600 hover:underline">
                      {venue.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${venue.contact.email}`} className="text-pink-600 hover:underline">
                      {venue.contact.email}
                    </a>
                  </div>
                  {venue.contact.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={venue.contact.website} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= venue.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{venue.rating}</span>
                </div>
                <div className="text-sm text-gray-600">{venue.reviewCount} reviews</div>
              </div>

              {/* Availability */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekdays:</span>
                    <span className={venue.availability.weekdays ? 'text-green-600' : 'text-red-600'}>
                      {venue.availability.weekdays ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekends:</span>
                    <span className={venue.availability.weekends ? 'text-green-600' : 'text-red-600'}>
                      {venue.availability.weekends ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Holidays:</span>
                    <span className={venue.availability.holidays ? 'text-green-600' : 'text-red-600'}>
                      {venue.availability.holidays ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VenuesPage() {
  const { isLoggedIn } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    venueType: 'all',
    guestCount: '',
    priceRange: 'all',
    rating: 0,
    features: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Remove the hardcoded venues data and replace the useEffect with:

useEffect(() => {
  if (isLoggedIn) {
    setLoading(true);
    try {
      const venuesData = venueService.getAllVenues();
      setVenues(venuesData);
      setFilteredVenues(venuesData);
    } catch (error) {
      console.error('Error loading venues:', error);
      showToast('Failed to load venues', 'error');
    } finally {
      setLoading(false);
    }
  }
}, [isLoggedIn]);

  // Add loading state to your JSX
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">Browse wedding venues by logging in first.</p>
        </div>
      </div>
    );
  }

  // Add loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-medium text-gray-900">Loading venues...</h2>
          <p className="text-gray-600">Please wait while we fetch the latest venue information.</p>
        </div>
      </div>
    );
  }
  
// Update the filter effect:
useEffect(() => {
  let filtered = venues;

  // Apply search filter
  if (searchQuery) {
    filtered = venueService.searchVenues(searchQuery);
  }

  // Apply other filters
  filtered = filtered.filter(venue => {
    // Venue type filter
    const matchesType = filters.venueType === 'all' || 
      venue.venueType.some(type => type.toLowerCase() === filters.venueType.toLowerCase());

    // Guest count filter
    const matchesGuestCount = !filters.guestCount || 
      (parseInt(filters.guestCount) >= venue.pricing.guestCapacity.min && 
       parseInt(filters.guestCount) <= venue.pricing.guestCapacity.max);

    // Price range filter
    const matchesPrice = filters.priceRange === 'all' || 
      (filters.priceRange === 'budget' && venue.pricing.basePrice < 10000) ||
      (filters.priceRange === 'mid' && venue.pricing.basePrice >= 10000 && venue.pricing.basePrice < 20000) ||
      (filters.priceRange === 'luxury' && venue.pricing.basePrice >= 20000);

    // Rating filter
    const matchesRating = filters.rating === 0 || venue.rating >= filters.rating;

    return matchesType && matchesGuestCount && matchesPrice && matchesRating;
  });

  setFilteredVenues(filtered);
}, [venues, searchQuery, filters]);

// Update the handleToggleFavorite function:
const handleToggleFavorite = (venueId: string) => {
  const updatedVenue = venueService.toggleFavorite(venueId);
  if (updatedVenue) {
    setVenues(prev => prev.map(venue => 
      venue.id === venueId ? updatedVenue : venue
    ));
    
    showToast(
      updatedVenue.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      'success'
    );
  }
};

// Update venueTypes calculation:
const venueTypes = venueService.getVenueTypes();
const favoriteCount = venues.filter(v => v.isFavorite).length;

  return (
    <>
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wedding Venues</h1>
          <p className="text-gray-600">
            Discover and book the perfect venue for your special day.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{venues.length}</div>
            <div className="text-sm text-gray-500">Total Venues</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{favoriteCount}</div>
            <div className="text-sm text-gray-500">Favorites</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{filteredVenues.length}</div>
            <div className="text-sm text-gray-500">Matches</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{venueTypes.length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues, locations, or types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2">
                <select
                  value={filters.venueType}
                  onChange={(e) => setFilters(prev => ({ ...prev, venueType: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="all">All Types</option>
                  {venueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${
                    viewMode === 'grid'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${
                    viewMode === 'list'
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                  <input
                    type="number"
                    placeholder="Number of guests"
                    value={filters.guestCount}
                    onChange={(e) => setFilters(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="all">All Prices</option>
                    <option value="budget">Under $10,000</option>
                    <option value="mid">$10,000 - $20,000</option>
                    <option value="luxury">$20,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="0">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      venueType: 'all',
                      guestCount: '',
                      priceRange: 'all',
                      rating: 0,
                      features: []
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {filteredVenues.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found
              </h2>
            </div>

            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }>
              {filteredVenues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedVenue}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MapPinned className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more venues.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  venueType: 'all',
                  guestCount: '',
                  priceRange: 'all',
                  rating: 0,
                  features: []
                });
              }}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Venue Details Modal */}
        <VenueDetailsModal
          venue={selectedVenue}
          onClose={() => setSelectedVenue(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

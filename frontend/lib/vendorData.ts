import photographersData from '@/data/vendors/photographers.json';
import venuesData from '@/data/vendors/venues.json';
import caterersData from '@/data/vendors/caterers.json';

export interface VendorOption {
  id: string;
  label: string;
  description: string;
  price: string;
  image: string;
  rating?: number;
  location?: string;
  specialties?: string[];
  capacity?: string;
  type?: string;
  cuisine?: string;
  minGuests?: number;
}

const vendorData: { [key: string]: VendorOption[] } = {
  photographer: photographersData,
  venue: venuesData,
  caterer: caterersData
};

export const getVendorOptions = (category: string): VendorOption[] => {
  return vendorData[category] || [];
};

export const getVendorById = (category: string, id: string): VendorOption | undefined => {
  const vendors = getVendorOptions(category);
  return vendors.find(vendor => vendor.id === id);
};

// Get vendors by price range
export const getVendorsByPriceRange = (category: string, minPrice?: number, maxPrice?: number): VendorOption[] => {
  const vendors = getVendorOptions(category);
  if (!minPrice && !maxPrice) return vendors;
  
  return vendors.filter(vendor => {
    // Extract price numbers from price string (simplified logic)
    const priceMatch = vendor.price.match(/\$(\d+(?:,\d+)?)/g);
    if (!priceMatch) return true;
    
    const vendorMinPrice = parseInt(priceMatch[0].replace(/\$|,/g, ''));
    if (minPrice && vendorMinPrice < minPrice) return false;
    if (maxPrice && vendorMinPrice > maxPrice) return false;
    
    return true;
  });
};
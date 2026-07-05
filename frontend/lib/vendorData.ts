import photographersData from '@/data/vendors/photographers.json';
import venuesData from '@/data/vendors/venues.json';
import dressesData from '@/data/vendors/dresses.json';
import altarCeremoniesData from '@/data/vendors/altarCeremonies.json';
import invitationsData from '@/data/vendors/invitations.json';
// import caterersData from '@/data/vendors/caterers.json';
import djsData from '@/data/vendors/djs.json';

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
  dress: dressesData,
  altarCeremony: altarCeremoniesData,
  invitation: invitationsData,
  // caterer: caterersData,
  dj: djsData
};

export const getVendorOptions = (category: string, location?: string): VendorOption[] => {
  const vendors = vendorData[category] || [];
  
  // Filter by location if provided
  if (location) {
    return vendors.filter(vendor =>
      vendor.location?.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  return vendors;
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
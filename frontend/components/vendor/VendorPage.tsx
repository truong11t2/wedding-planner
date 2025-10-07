import { getVendors } from '@/lib/mdx';
import VendorCategory from './VendorCategory';

export default async function VendorPage() {
  const vendors = await getVendors();
  const categories = [...new Set(vendors.map(vendor => vendor.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Wedding Vendor</h1>
      {categories.map((categoryName) => (
        <VendorCategory
          key={categoryName}
          title={categoryName}
          vendors={vendors.filter(v => v.category === categoryName)}
        />
      ))}
    </div>
  );
}
import { getVendors } from '@/lib/mdx';
import VendorCategory from './VendorCategory';

export default async function VendorPage() {
  const vendors = await getVendors();
  const categories = [...new Set(vendors.map(vendor => vendor.category))];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-black">
        Wedding Vendor
      </h1>
      <p className="pb-8 text-gray-600 text-lg">
        Find your perfect wedding vendor 
      </p>
      {categories.map((categoryName) => (
        <VendorCategory
          key={categoryName}
          title={categoryName}
          vendors={vendors.filter(v => v.category === categoryName)}
        />
      ))}
    </main>
  );
}
import { getVendors } from '@/lib/mdx';
import VendorCategory from './VendorCategory';

export default async function VendorPage() {
  const vendors = await getVendors();
  const categories = [...new Set(vendors.map(vendor => vendor.category))];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-black">
        Nhà Cung Cấp Dịch Vụ Đám Cưới
      </h1>
      <p className="pb-8 text-gray-600 text-lg">
        Tìm nhà cung cấp dịch vụ đám cưới hoàn hảo cho bạn
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
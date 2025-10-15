import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { Vendor } from '@/lib/types';

interface VendorCategoryProps {
  title: string;
  vendors: Vendor[];
}

export default function VendorCategory({ title, vendors }: VendorCategoryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 pt-8">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vendors.map((vendor) => (
          <Link 
            href={`/vendor/${vendor.slug}`}
            key={vendor.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-48">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    {vendor.name}
                  </h3>
                  <span className="text-gray-500 font-medium">
                    {vendor.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {vendor.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">{vendor.rating}</span>
                  </div>
                  <span className="ml-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium group-hover:from-pink-700 group-hover:to-purple-700 transition-all">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

export default function VendorCategory({ category }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {category.vendors.map((vendor) => (
          <div 
            key={vendor.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-48">
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {vendor.name}
                  </h3>
                  <span className="text-gray-500 font-medium">
                    {vendor.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {vendor.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">{vendor.rating}</span>
                  </div>
                  <button className="ml-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
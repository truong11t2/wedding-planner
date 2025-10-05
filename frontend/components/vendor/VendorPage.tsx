import React from 'react';
import VendorCategory from './VendorCategory';

const categories = [
  {
    id: 'photography',
    title: 'Photography',
    vendors: [
      {
        id: 1,
        name: 'Perfect Moments Studio',
        image: '/vendors/photography-1.jpg',
        description: 'Capturing your special moments with artistic excellence. Specializing in contemporary wedding photography.',
        rating: 4.8,
        price: '$$'
      },
      {
        id: 2,
        name: 'Honney Moon Studio',
        image: '/vendors/photography-2.jpg',
        description: 'Capturing your special moments with artistic excellence. Specializing in contemporary wedding photography.',
        rating: 4.9,
        price: '$$'
      },
            {
        id: 3,
        name: 'Now & Forever Photography',
        image: '/vendors/photography-3.jpg',
        description: 'Capturing your special moments with artistic excellence. Specializing in contemporary wedding photography.',
        rating: 4.7,
        price: '$'
      },
      // Add more vendors
    ]
  },
  {
    id: 'attire',
    title: 'Wedding Attire',
    vendors: [
      {
        id: 1,
        name: 'Elegant Bridal Boutique',
        image: '/vendors/attire-1.jpg',
        description: 'Luxurious wedding dresses and suits. Personal styling service available.',
        rating: 4.9,
        price: '$$$'
      },
    {
        id: 2,
        name: 'We Are Here Studio',
        image: '/vendors/attire-2.jpg',
        description: 'Luxurious wedding dresses and suits. Personal styling service available.',
        rating: 4.5,
        price: '$$'
      },
      // Add more vendors
    ]
  },
  {
    id: 'wedding-altar-decor',
    title: 'Wedding Altar Decor',
    vendors: [
      {
        id: 1,
        name: 'Elegant Bridal Boutique',
        image: '/vendors/attire-1.jpg',
        description: 'Luxurious wedding dresses and suits. Personal styling service available.',
        rating: 4.9,
        price: '$$$'
      },
    {
        id: 2,
        name: 'We Are Here Studio',
        image: '/vendors/attire-2.jpg',
        description: 'Luxurious wedding dresses and suits. Personal styling service available.',
        rating: 4.5,
        price: '$$'
      },
      // Add more vendors
    ]
  },
  // Add more categories
];

export default function VendorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
        Wedding Vendors
      </h1>
      <div className="space-y-12">
        {categories.map((category) => (
          <VendorCategory key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
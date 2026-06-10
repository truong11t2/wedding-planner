'use client';

import React, { useEffect, useState, useRef } from 'react';

interface GalleryImage {
  url: string;
  title: string;
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&h=800&fit=crop&q=80',
    title: 'Elegant Ceremony',
    description: 'Timeless moments captured',
  },
  {
    url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=600&fit=crop&q=80',
    title: 'First Dance',
    description: 'Pure romance',
  },
  {
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop&q=80',
    title: 'Floral Details',
    description: 'Exquisite arrangements',
  },
  {
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop&q=80',
    title: 'Golden Hour',
    description: 'Sunset portraits',
  },
  {
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=600&fit=crop&q=80',
    title: 'Reception Magic',
    description: 'Celebration & joy',
  },
];

export default function GallerySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-gray-900">
            Our Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A glimpse into the beautiful moments we've had the privilege to capture
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Large image - spans 2 columns on desktop */}
          <div
            className={`col-span-2 row-span-2 relative group overflow-hidden transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative h-[400px] md:h-[600px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${galleryImages[0].url}')` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white p-8">
                <h3 className="font-serif text-3xl mb-2">{galleryImages[0].title}</h3>
                <p className="text-lg">{galleryImages[0].description}</p>
              </div>
            </div>
          </div>

          {/* Smaller images */}
          {galleryImages.slice(1).map((image, index) => (
            <div
              key={index}
              className={`relative group overflow-hidden transition-all duration-700 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="relative h-[200px] md:h-[290px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${image.url}')` }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white p-4">
                  <h3 className="font-serif text-xl mb-1">{image.title}</h3>
                  <p className="text-sm">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Check } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Essential',
    price: '$4,500',
    description: 'Perfect for intimate celebrations',
    features: [
      'Day-of coordination',
      '6 hours of photography',
      'Online gallery',
      'Vendor recommendations',
      'Timeline creation',
    ],
  },
  {
    name: 'Signature',
    price: '$8,500',
    description: 'Our most popular package',
    features: [
      'Full planning & design',
      '10 hours dual photography',
      'Engagement session',
      'Custom album design',
      'Unlimited consultations',
      'Vendor management',
      'Rehearsal coordination',
      'Custom vows & script',
    ],
    featured: true,
  },
  {
    name: 'Luxe',
    price: '$15,000',
    description: 'The ultimate wedding experience',
    features: [
      'Complete concierge service',
      'Full-day photography team',
      'Destination planning',
      'Bespoke design & styling',
      'Premium vendor curation',
      'Guest accommodation assistance',
      'Multi-day event coordination',
    ],
  },
];

export default function PricingSection() {
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
            Investment
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thoughtfully designed packages to suit your unique celebration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              } ${
                tier.featured 
                  ? 'md:-translate-y-4' 
                  : ''
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`h-full p-8 ${
                tier.featured 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-50 text-gray-900'
              }`}>
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-900 text-white px-4 py-1 text-sm font-medium tracking-wide">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="font-serif text-3xl mb-2">
                    {tier.name}
                  </h3>
                  <div className={`text-sm mb-4 ${
                    tier.featured ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {tier.description}
                  </div>
                  <div className="text-5xl font-serif mb-2">
                    {tier.price}
                  </div>
                  <div className={`text-sm ${
                    tier.featured ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    starting price
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        tier.featured ? 'text-amber-400' : 'text-amber-900'
                      }`} />
                      <span className={`text-sm ${
                        tier.featured ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 text-center font-medium tracking-wide transition-all duration-300 ${
                  tier.featured 
                    ? 'bg-white text-gray-900 hover:bg-gray-100' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-12 text-sm">
          Custom packages available. Contact us to discuss your specific needs.
        </p>
      </div>
    </section>
  );
}

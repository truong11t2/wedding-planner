'use client';

import React from 'react';
import StickyNav from './StickyNav';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import ServicesSection from './ServicesSection';
import FeatureSplit from './FeatureSplit';
import GallerySection from './GallerySection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import CTASection from './CTASection';

export default function HomePage() {
  return (
    <>
      {/* <StickyNav /> */}
      <main className="pt-0">
        {/* Hero Section - Full Screen */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Services Section */}
        <div id="services">
          <ServicesSection />
        </div>

        {/* Feature Split Section */}
        <FeatureSplit />

        {/* Gallery Section */}
        <div id="gallery">
          <GallerySection />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <TestimonialsSection />
        </div>

        {/* Pricing Section */}
        {/* <div id="pricing">
          <PricingSection />
        </div> */}

        {/* CTA Section */}
        <div id="contact">
          <CTASection />
        </div>
      </main>
    </>
  );
}
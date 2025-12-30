'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
  weddingDate: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah & Michael Johnson",
    location: "San Francisco, CA",
    rating: 5,
    text: "This wedding planner made our dream wedding come true! The timeline feature helped us stay organized throughout the entire planning process. We couldn't have done it without this amazing tool.",
    weddingDate: "June 15, 2024"
  },
  {
    id: 2,
    name: "Emily & David Chen",
    location: "New York, NY",
    rating: 5,
    text: "The photo organization feature was a game-changer! We were able to keep track of all our inspiration photos and vendor portfolios in one place. Highly recommend to any couple planning their big day.",
    weddingDate: "September 22, 2024"
  },
  {
    id: 3,
    name: "Jessica & Ryan Martinez",
    location: "Austin, TX",
    rating: 5,
    text: "From timeline creation to vendor management, this platform had everything we needed. The step-by-step guidance made wedding planning so much less stressful. Thank you for making our day perfect!",
    weddingDate: "March 8, 2024"
  },
  {
    id: 4,
    name: "Amanda & James Wilson",
    location: "Chicago, IL",
    rating: 5,
    text: "The budget tracking and vendor coordination features saved us so much time and money. We were able to plan our entire wedding efficiently and stayed within budget. Absolutely love this tool!",
    weddingDate: "October 12, 2024"
  },
  {
    id: 5,
    name: "Rachel & Kevin Brown",
    location: "Seattle, WA",
    rating: 5,
    text: "As someone who loves to be organized, this wedding planner was perfect for me. The detailed checklists and timeline kept us on track every step of the way. Our wedding was flawless!",
    weddingDate: "July 30, 2024"
  },
  {
    id: 6,
    name: "Lauren & Christopher Davis",
    location: "Miami, FL",
    rating: 5,
    text: "Planning a destination wedding seemed overwhelming until we found this platform. The comprehensive planning tools made coordinating everything from afar so much easier. Couldn't be happier!",
    weddingDate: "December 5, 2024"
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="flex items-start space-x-4 h-full">
        <div className="flex-shrink-0">
          <Quote className="w-8 h-8 text-pink-400" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed flex-grow">
            "{testimonial.text}"
          </p>
          <div className="border-t pt-4 mt-auto">
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
            <p className="text-xs text-pink-600 mt-1">
              Wedding Date: {testimonial.weddingDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Testimonials() {
  const scrollToWeddingDate = () => {
    // Try multiple possible selectors for the wedding date section
    const weddingDateSection = 
      document.getElementById('wedding-date')
    if (weddingDateSection) {
      weddingDateSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      // Fallback: scroll to top of page where the form likely is
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Happy Couples Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what real couples have to say about their 
            wedding planning experience with our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">10,000+</div>
              <div className="text-sm md:text-base text-gray-600">Happy Couples</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">4.9/5</div>
              <div className="text-sm md:text-base text-gray-600">Average Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-pink-600">50+</div>
              <div className="text-sm md:text-base text-gray-600">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">99%</div>
              <div className="text-sm md:text-base text-gray-600">Would Recommend</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to join thousands of happy couples?
          </p>
          <button 
            onClick={scrollToWeddingDate}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Planning Your Dream Wedding
          </button>
        </div>
      </div>
  );
}
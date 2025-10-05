'use client';

import React, { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import HomePage from '@/components/home/HomePage';
import BlogPage from '@/components/blog/BlogPage';
import LoginPage from '@/components/auth/LoginPage';
import VendorPage from '@/components/vendor/VendorPage';

export default function WeddingPlanner() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'blog' && <BlogPage />}
      {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'vendor' && <VendorPage />}
      
      <Footer />
    </div>
  );
}
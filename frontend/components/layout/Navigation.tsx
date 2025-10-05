import React from 'react';
import { Heart, Menu, X } from 'lucide-react';

export default function Navigation({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="bg-white shadow-md border-b-2 border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setCurrentPage('home')}
          >
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Day Planner
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-lg font-semibold transition-colors ${
                currentPage === 'home' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('blog')}
              className={`text-lg font-semibold transition-colors ${
                currentPage === 'blog' ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-md"
            >
              Login
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-pink-50 rounded"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentPage('blog'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-pink-50 rounded"
            >
              Blog
            </button>
            <button
              onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-lg font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded"
            >
              Login
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, School, Heart } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/news' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <School className="h-10 w-10 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Bright Future</h1>
              <p className="text-sm text-gray-600">International School</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Donate Now */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Donate Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium px-4 py-2 rounded-lg ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-4">
                <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
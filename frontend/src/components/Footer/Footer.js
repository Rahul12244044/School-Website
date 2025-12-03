import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Send,
  Heart
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  const resources = [
    { name: 'School Calendar', path: '/calendar' },
    { name: 'Parent Portal', path: '/portal' },
    { name: 'Student Handbook', path: '/handbook' },
    { name: 'Cafeteria Menu', path: '/menu' },
    { name: 'Transportation', path: '/transport' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* School Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <School className="h-10 w-10 text-primary-400" />
              <div>
                <h3 className="text-2xl font-bold">Bright Future</h3>
                <p className="text-gray-400 text-sm">International School</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Committed to excellence in education and holistic development 
              of every student since 1995.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xl font-bold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link
                    to={resource.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Info</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-1" />
                <span className="text-gray-400">
                  123 Education Street, Knowledge City, KC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <span className="text-gray-400">info@brightfuture.edu</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
             
              <div className="flex flex-col space-y-2 px-4">
                <button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Bright Future International School. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
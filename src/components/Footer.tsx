import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaneTakeoff, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, Check } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company & Logo */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <PlaneTakeoff className="h-6 w-6 text-travel-400" />
              <span className="text-xl font-bold text-white">FlyAway Airline</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Your trusted travel partner for flights, bookings, and memorable journeys worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/Athanase002" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://x.com/athanase002" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/athanase002/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://www.linkedin.com/in/athanase002/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/flights" className="text-gray-400 hover:text-white transition-colors">Find Flights</Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">Create Account</Link>
              </li>
              <li>
                <a href="https://ashesi.edu.gh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Travel Guide</a>
              </li>
              <li>
                <a href="https://ashesi.edu.gh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-travel-400 mr-2 mt-0.5" />
                <span className="text-gray-400">
                  1 University Avenue, Accra,<br /> Accra, Country
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-travel-400 mr-2" />
                <span className="text-gray-400">+(233) 5387 632 54</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-travel-400 mr-2" />
                <span className="text-gray-400">support@flyawayagency.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            {isSubscribed ? (
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="flex justify-center mb-2">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-gray-200">Thanks for subscribing!</p>
                <p className="text-gray-400 text-sm mt-1">You'll receive our latest offers soon.</p>
                <button
                  onClick={() => setIsSubscribed(false)}
                  className="mt-3 px-3 py-1 text-sm bg-travel-600 hover:bg-travel-700 rounded text-white transition-colors"
                >
                  Subscribe Again
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-4">
                  Subscribe to our newsletter for travel tips and exclusive offers.
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-travel-400"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-2 bg-travel-600 hover:bg-travel-700 rounded text-white font-medium transition-colors ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} FlyAway Airline Agency. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://ashesi.edu.gh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="https://ashesi.edu.gh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="https://ashesi.edu.gh/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="/lovable-uploads/headop.webp"
            // src="/lovable-uploads/logo.webp"
            alt="Funding For Scotland - Home Energy Efficiency Grants"
            width="40"
            height="40"
            fetchPriority="high"
            decoding="async"
          />
          <h1 className="text-2xl text-white  font-black" >
            Funding <span className="text-xl font-black">for</span> Scotland
          </h1>
        </Link>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base leading-relaxed">
              Scotland's free consultancy for residential grants and funding. We help you access government backed, local authority, and private company schemes for home improvements, energy efficiency upgrades, and renewable energy installations.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold">Email:</span> info@fundingforscotland.co.uk
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold">Address:</span> Glasgow, Scotland
              </p>
              <p className="text-gray-300 text-sm sm:text-base">
                <span className="font-semibold">Contact:</span> Use our enquiry form for all enquiries
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/eco4" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">ECO4 Scheme</Link></li>
              <li><Link to="/solar" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Solar Panels</Link></li>
              <li><Link to="/gas-boilers" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Gas Boilers</Link></li>
              <li><Link to="/home-improvements" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Home Improvements</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Home</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Contact Us</Link></li>
              <li><a href="https://www.termsfeed.com/live/ea3c4880-41a9-43e9-99ee-66bcc9e5f291" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base touch-manipulation">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 Funding For Scotland. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      {/* Admin Access - Bottom Right */}
      <Link
        to="/admin"
        className="absolute bottom-4 right-4 p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
        title="Admin Access"
      >
        <Shield className="w-5 h-5" />
      </Link>
    </footer>
  );
};

export default Footer;

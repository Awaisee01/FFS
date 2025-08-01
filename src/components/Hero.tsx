
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  benefits?: string[];
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

const Hero = ({ 
  title, 
  subtitle, 
  description, 
  benefits = [], 
  ctaText = "Get Free Consultation",
  ctaLink = "/contact",
  backgroundImage 
}: HeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-30"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 xl:py-32">
        {/* Mobile: Form first, Desktop: Content first */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* FORM SECTION - ALWAYS FIRST ON MOBILE */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 sm:px-6 xl:px-8 py-6 xl:py-8 border border-white/20 w-full max-w-md">
              <h3 className="text-lg sm:text-xl xl:text-2xl font-bold mb-4 xl:mb-6 text-center">What can we help with?</h3>
              <div className="grid grid-cols-1 gap-3 xl:gap-4">
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/eco4">
                    ECO4
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/solar">
                    Solar Panels
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/gas-boilers">
                    Gas Boilers
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-3 xl:p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation min-h-[48px]"
                  variant="outline"
                >
                  <Link to="/home-improvements">
                    Home Improvements
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          
          {/* TEXT CONTENT - ALWAYS SECOND ON MOBILE */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-blue-100 font-medium">
              {subtitle}
            </p>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-50 leading-relaxed">
              {description}
            </p>
            
            {benefits.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <ul className="space-y-2 sm:space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-300 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-sm sm:text-base text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

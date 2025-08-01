import { useState, useEffect, Suspense, lazy } from 'react';
import { CheckCircle } from 'lucide-react';

// Lazy load the simple ECO4 form for optimal performance
const SimpleECO4Form = lazy(() => import('@/components/SimpleECO4Form'));

interface CriticalECO4HeroProps {
  scrollY: number;
}

// Critical hero component with minimal dependencies for fast rendering
const CriticalECO4Hero = ({ scrollY }: CriticalECO4HeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [formReady, setFormReady] = useState(false);

  const benefits = [
    "Heating Upgrades",
    "Solar Panels", 
    "Insulation",
    "Free Government Backed Scheme"
  ];

  useEffect(() => {
    // Faster form loading for better UX
    const timer = setTimeout(() => {
      setFormReady(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Keep hero image but optimize loading strategy */}
      
      <section className="relative text-white overflow-hidden min-h-screen lg:min-h-screen" style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 25%, #1e40af 50%, #059669 75%, #16a34a 100%)'
      }}>
        {/* Optimized hero image for LCP - properly marked as above-the-fold content */}
        <div className="absolute inset-0 w-full h-full" style={{ containIntrinsicSize: '100vw 100vh', opacity: 0.3 }}>
          <picture>
            <source 
              media="(max-width: 767px)" 
              srcSet="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png 767w"
              sizes="(max-width: 767px) 100vw"
            />
            <source 
              media="(min-width: 768px)" 
              srcSet="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png 1920w"
              sizes="(min-width: 768px) 100vw"
            />
            <img
              src="/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png"
              alt="ECO4 Energy Efficiency Background - Aerial view of modern Scottish houses"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              width={1920}
              height={1080}
              onLoad={() => setImageLoaded(true)}
              style={{
                willChange: 'auto',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                contentVisibility: 'visible'
              }}
            />
          </picture>
        </div>
        
        {/* Additional gradient overlay for better visibility */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.6) 0%, rgba(29, 78, 216, 0.5) 25%, rgba(30, 64, 175, 0.4) 50%, rgba(5, 150, 105, 0.5) 75%, rgba(22, 163, 74, 0.6) 100%)'
        }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-0">
          {/* FORM SECTION - ALWAYS FIRST ON MOBILE */}
          <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md mx-auto lg:mx-0">
              {formReady ? (
                <Suspense fallback={
                  <div className="form-card">
                    <div className="text-center">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-4">Loading form...</p>
                    </div>
                  </div>
                }>
                  <SimpleECO4Form />
                </Suspense>
              ) : (
                <div className="form-card">
                  <div className="text-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                      <div className="h-12 bg-gray-300 rounded"></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Loading form...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* TEXT CONTENT - ALWAYS SECOND ON MOBILE */}
          <div className="order-2 lg:order-1 w-full text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              ECO4 Scheme
            </h1>
             <p className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 text-blue-100 font-medium">
               Free energy efficiency upgrades for your home
             </p>
             <p className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-50 leading-relaxed">
              The Westminster backed ECO4 scheme provides free heating upgrades, solar panels, and insulation to eligible households across Scotland.
            </p>
            
            <div className="mb-6 sm:mb-8">
              <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-300 flex-shrink-0" />
                    <span className="text-blue-50 text-sm sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default CriticalECO4Hero;
import { useState, useEffect, Suspense, lazy } from "react";
import { CheckCircle } from "lucide-react";

// Lazy load the simple ECO4 form for optimal performance
const SimpleECO4Form = lazy(() => import("@/components/SimpleECO4Form"));

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
    "Free Government Backed Scheme",
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

      <section
        className="relative text-white overflow-hidden min-h-screen lg:min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #2563eb 0%, #1d4ed8 25%, #1e40af 50%, #059669 75%, #16a34a 100%)",
        }}
      >
        {/* Optimized hero image for LCP - properly marked as above-the-fold content */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ containIntrinsicSize: "100vw 100vh", opacity: 0.3 }}
        >
          <img
            src="/lovable-uploads/eco.webp"
            alt="ECO4 Energy Efficiency Background - Aerial view of modern Scottish houses"
            className="w-full h-full object-cover"
            fetchPriority="high"
            decoding="sync"
            width={1920}
            height={1080}
            onLoad={() => setImageLoaded(true)}
            style={{
              willChange: "auto",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              contentVisibility: "visible",
            }}
          />
        </div>

        {/* Additional gradient overlay for better visibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(37, 99, 235, 0.6) 0%, rgba(29, 78, 216, 0.5) 25%, rgba(30, 64, 175, 0.4) 50%, rgba(5, 150, 105, 0.5) 75%, rgba(22, 163, 74, 0.6) 100%)",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-0">
            {/* FORM SECTION - ALWAYS FIRST ON MOBILE */}
            <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-md mx-auto lg:mx-0">
                {formReady ? (
                  <Suspense
                    fallback={
                      <div className="form-card">
                        <div className="text-center">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            <div className="h-12 bg-gray-300 rounded"></div>
                            <div className="h-12 bg-gray-300 rounded"></div>
                            <div className="h-12 bg-gray-300 rounded"></div>
                            <div className="h-12 bg-gray-300 rounded"></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-4">
                            Loading form...
                          </p>
                        </div>
                      </div>
                    }
                  >
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
                      <p className="text-sm text-gray-600 mt-4">
                        Loading form...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TEXT CONTENT - ALWAYS SECOND ON MOBILE */}
            <div className="   w-full  text-left">
              {/* FIXED: Use consistent sizing instead of responsive classes */}
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight min-h-[3.5rem]">
                ECO4 Scheme
              </h1>

              {/* FIXED: Stable sizing with reserved space */}
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium min-h-[2rem]">
                Free energy efficiency upgrades for your home
              </p>

              {/* FIXED: Stable text with reserved height */}
              <p className="text-base lg:text-lg mb-8 text-blue-50 leading-relaxed min-h-[4rem]">
                The Westminster backed ECO4 scheme provides free heating
                upgrades, solar panels, and insulation to eligible households
                across Scotland.
              </p>

              <div className="mb-8">
                <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-3 min-h-[2rem]"
                    >
                      {/* FIXED: Reserve exact space for icon */}
                      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-300" />
                      </div>
                      <span className="text-blue-50 text-base leading-relaxed">
                        {benefit}
                      </span>
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

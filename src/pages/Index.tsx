import { useEffect, useState, Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';

// Lazy load with delayed rendering
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

const Index = () => {
  const [showBelowFold, setShowBelowFold] = useState(false);

  useEffect(() => {
    document.title = 'Scottish Grants & Funding - Government Funding For Scotland';
    
    // CRITICAL FIX: Delay below-the-fold content to prevent critical path blocking
    const timer = setTimeout(() => {
      setShowBelowFold(true);
    }, 2000); // 2 second delay ensures critical path completes first

    // Also trigger on scroll for better UX
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBelowFold(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Above-the-fold: Load immediately */}
      <Hero 
        title="Unlock Scottish Grants & Funding"
        subtitle=""
        description="From heating upgrades, to free solar panels, to improving the look of Scotland's homes. Funding for Scotland are here to help people unlock the funding and grant schemes they are entitled to."
        benefits={[
          "Free Solar Panels",
          "Free Heating Upgrades", 
          "Free Insulation",
          "Free Gas Boilers",
          "Grants for Home Improvements"
        ]}
      />
      
      {/* Critical: ServicesGrid loads immediately */}
      <ServicesGrid />
      
      {/* Below-the-fold: Only render after delay */}
      {showBelowFold ? (
        <>
          <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse"></div>}>
            <TrustBadges />
          </Suspense>
          
          <Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse rounded-lg"></div>}>
            <CallToActionSection />
          </Suspense>
        </>
      ) : (
        // Invisible placeholder to prevent layout shift
        <div className="h-72"></div>
      )}
    </div>
  );
};

export default Index;
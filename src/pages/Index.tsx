
import { useEffect, Suspense, lazy } from 'react';
import Hero from '@/components/Hero';

// Lazy load non-critical sections
const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

const Index = () => {
  useEffect(() => {
    document.title = 'Scottish Grants & Funding - Government Funding For Scotland';
  }, []);

  return (
    <div className="min-h-screen">
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
      
      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
        <ServicesGrid />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
        <TrustBadges />
      </Suspense>
      
      <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
        <CallToActionSection />
      </Suspense>
    </div>
  );
};

export default Index;

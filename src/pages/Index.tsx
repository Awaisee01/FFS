
// import { useEffect, Suspense, lazy } from 'react';
// import Hero from '@/components/Hero';

// // Lazy load non-critical sections
// const ServicesGrid = lazy(() => import('@/components/ServicesGrid'));
// const TrustBadges = lazy(() => import('@/components/TrustBadges'));
// const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

// const Index = () => {
//   useEffect(() => {
//     document.title = 'Scottish Grants & Funding - Government Funding For Scotland';
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <Hero 
//         title="Unlock Scottish Grants & Funding"
//         subtitle=""
//         description="From heating upgrades, to free solar panels, to improving the look of Scotland's homes. Funding for Scotland are here to help people unlock the funding and grant schemes they are entitled to."
//         benefits={[
//           "Free Solar Panels",
//           "Free Heating Upgrades", 
//           "Free Insulation",
//           "Free Gas Boilers",
//           "Grants for Home Improvements"
//         ]}
//       />
      
//       <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>}>
//         <ServicesGrid />
//       </Suspense>
      
//       <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse"></div>}>
//         <TrustBadges />
//       </Suspense>
      
//       <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg"></div>}>
//         <CallToActionSection />
//       </Suspense>
//     </div>
//   );
// };

// export default Index;


import { useEffect, Suspense, lazy } from 'react';
import Hero from '@/components/Hero';
// CRITICAL FIX: Don't lazy load above-the-fold content!
import ServicesGrid from '@/components/ServicesGrid';

// Only lazy load below-the-fold sections
const TrustBadges = lazy(() => import('@/components/TrustBadges'));
const CallToActionSection = lazy(() => import('@/components/CallToActionSection'));

const Index = () => {
  useEffect(() => {
    document.title = 'Scottish Grants & Funding - Government Funding For Scotland';
    
    // Smart preloading: Start loading below-the-fold components after initial render
    const preloadTimer = setTimeout(() => {
      // Preload components that will be needed soon
      import('@/components/TrustBadges');
      import('@/components/CallToActionSection');
    }, 1000); // 1 second delay to not interfere with critical loading
    
    // Also preload on user interaction (scroll, mouse move)
    const preloadOnInteraction = () => {
      import('@/components/TrustBadges');
      import('@/components/CallToActionSection');
      // Clean up listeners once preloading starts
      window.removeEventListener('scroll', preloadOnInteraction);
      window.removeEventListener('mousemove', preloadOnInteraction);
      window.removeEventListener('touchstart', preloadOnInteraction);
    };
    
    window.addEventListener('scroll', preloadOnInteraction, { passive: true });
    window.addEventListener('mousemove', preloadOnInteraction, { passive: true });
    window.addEventListener('touchstart', preloadOnInteraction, { passive: true });
    
    return () => {
      clearTimeout(preloadTimer);
      window.removeEventListener('scroll', preloadOnInteraction);
      window.removeEventListener('mousemove', preloadOnInteraction);
      window.removeEventListener('touchstart', preloadOnInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Above-the-fold: Load immediately - NO lazy loading */}
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
      
      {/* CRITICAL: ServicesGrid is above-the-fold, load immediately */}
      <ServicesGrid />
      
      {/* Below-the-fold: Keep lazy loading with better fallbacks */}
      <Suspense fallback={<div className="h-32 bg-gray-50 animate-pulse mx-4"></div>}>
        <TrustBadges />
      </Suspense>
      
      <Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse rounded-lg mx-4"></div>}>
        <CallToActionSection />
      </Suspense>
    </div>
  );
};

export default Index;
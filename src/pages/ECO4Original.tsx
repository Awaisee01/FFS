import { useEffect, useState, Suspense, lazy } from 'react';
import CriticalECO4Hero from '@/components/CriticalECO4Hero';
import HeroSkeleton from '@/components/HeroSkeleton';
import LazySection from '@/components/LazySection';
import ResourcePrefetcher from '@/components/ResourcePrefetcher';
import { Home, Thermometer, Heart, Shield } from 'lucide-react';

// Aggressively split non-critical components for minimal initial bundle
const EligibilitySection = lazy(() => import('@/components/EligibilitySection'));
const ProcessSection = lazy(() => import('@/components/ProcessSection'));

const ECO4 = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [userBehavior, setUserBehavior] = useState({
    scrollDepth: 0,
    timeOnPage: 0,
    interactions: 0
  });

  useEffect(() => {
    document.title = "Free ECO4 Grants Scotland - Government Energy Efficiency Scheme | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free ECO4 grants in Scotland for energy efficiency improvements. Free insulation, boilers, and home upgrades through government schemes.');
    }

    setHeroLoaded(true);

    // Track user behavior for intelligent prefetching
    const startTime = Date.now();
    let maxScrollDepth = 0;
    let interactionCount = 0;

    // Optimized scroll handling with behavior tracking
    let ticking = false;
    const updateScrollY = () => {
      const currentScroll = window.scrollY;
      const scrollPercent = Math.round((currentScroll / (document.body.scrollHeight - window.innerHeight)) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      
      setScrollY(currentScroll);
      setUserBehavior(prev => ({ ...prev, scrollDepth: maxScrollDepth }));
      ticking = false;
    };

    const handleSmoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    // Track interactions for prefetching intelligence
    const trackInteraction = () => {
      interactionCount++;
      setUserBehavior(prev => ({ ...prev, interactions: interactionCount }));
    };

    // Track time on page
    const timeTracker = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      setUserBehavior(prev => ({ ...prev, timeOnPage }));
    }, 5000);

    // Event listeners
    window.addEventListener('scroll', handleSmoothScroll, { passive: true });
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, trackInteraction, { passive: true });
    });

    return () => {
      window.removeEventListener('scroll', handleSmoothScroll);
      ['click', 'touchstart', 'keydown'].forEach(event => {
        document.removeEventListener(event, trackInteraction);
      });
      clearInterval(timeTracker);
    };
  }, []);

  const eligibilityRequirements = [
    {
      icon: Home,
      title: "Property Type",
      description: "Open to homeowners, private tenants, and landlords"
    },
    {
      icon: Thermometer,
      title: "Energy Rating",
      description: "Property has EPC rating of D, E, F, or G"
    },
    {
      icon: Heart,
      title: "Health Conditions",
      description: "Including respiratory conditions, cardiovascular conditions and many more. See full list below"
    },
    {
      icon: Shield,
      title: "Qualifiers",
      description: "Please review the list of qualifiers below. You only need to tick one box and these apply to anyone living at the property."
    }
  ];

  if (!heroLoaded) {
    return <HeroSkeleton />;
  }

  return (
    <div>
      {/* Intelligent resource prefetching based on user behavior */}
      <ResourcePrefetcher currentPage="eco4" userBehavior={userBehavior} />
      
      <CriticalECO4Hero scrollY={scrollY} />
      
        <LazySection fallback={
        <div className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <Suspense fallback={<div>Loading eligibility section...</div>}>
          <section className="py-20 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  ECO4 Qualifying Criteria
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  If you are unsure if you qualify, please feel free to complete the enquiry form at the top of the page and chat to one of our advisors
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {eligibilityRequirements.map((requirement, index) => {
                  const Icon = requirement.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {requirement.title}
                      </h3>
                      <p className="text-gray-600">
                        {requirement.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <EligibilitySection />
            </div>
          </section>
        </Suspense>
      </LazySection>
      
      <LazySection fallback={
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }>
        <Suspense fallback={<div>Loading process section...</div>}>
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  ECO4 Installation Process
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our streamlined process makes getting ECO4 improvements as easy as possible. From initial assessment 
                  to final installation, we handle everything for you.
                </p>
              </div>
              
              <ProcessSection />
            </div>
          </section>
        </Suspense>
      </LazySection>
    </div>
  );
};

export default ECO4;

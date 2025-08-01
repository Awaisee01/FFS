
import { useEffect, useState, Suspense, lazy } from 'react';
import { trackPageView } from '@/lib/unified-tracking-manager';
import SimpleSolarForm from '@/components/SimpleSolarForm';
import SimplifiedHero from '@/components/SimplifiedHero';
import HeroSkeleton from '@/components/HeroSkeleton';
import { CheckCircle, Home, Thermometer, Heart, Shield } from 'lucide-react';
// Performance hooks removed

// Lazy load sections that are below the fold
const EligibilitySection = lazy(() => import('@/components/EligibilitySection'));
const ProcessSection = lazy(() => import('@/components/ProcessSection'));

const Solar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // Performance hooks removed

  useEffect(() => {
    document.title = "Free Solar Panels Scotland - Government Grants & Installation | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free solar panels in Scotland through government schemes. Reduce electricity bills by up to 70% with no upfront costs. Professional installation included.');
    }

    // Mark hero as loaded immediately for faster perceived performance
    setHeroLoaded(true);

    // Track page view with unified tracking
    trackPageView().catch(error => {
      console.warn('❌ Failed to track Solar page view:', error);
    });

    // Use requestAnimationFrame for smoother scrolling
    let ticking = false;
    const updateScrollY = () => {
      setScrollY(window.scrollY);
      ticking = false;
    };

    const handleSmoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleSmoothScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleSmoothScroll);
  }, []);

  const benefits = [
    "Free solar panels (absolutely nothing to pay)",
    "Reduce electricity bills by up to 70%",
    "Government Feed-in Tariff payments",
    "Increase your property value significantly"
  ];

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
      description: "List of qualifiers below. You only need to tick one box & these apply to anyone living at the property."
    }
  ];

  if (!heroLoaded) {
    return <HeroSkeleton />;
  }

  return (
    <div>
      <SimplifiedHero
        title="Free Solar Panels"
        subtitle="Completely free solar panels."
        description="If your current heating system is an Air Source Heat Pump, you could qualify for free solar through the ECO4 Scheme."
        benefits={benefits}
        heroImage="/lovable-uploads/602ec2e7-cda6-46d7-9da5-0dbdb581a74b.png"
        altText="Row of modern houses with solar panels on roofs under blue sky"
      >
        <SimpleSolarForm />
      </SimplifiedHero>
      
      <Suspense fallback={
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
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Solar Qualifying Criteria
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
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
      
      <Suspense fallback={
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Solar Installation Process
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our streamlined process makes getting solar panels as easy as possible. From initial assessment 
                to final installation, we handle everything for you.
              </p>
            </div>
            
            <ProcessSection />
          </div>
        </section>
      </Suspense>
    </div>
  );
};

export default Solar;

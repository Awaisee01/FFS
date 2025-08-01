
import { useEffect, useState, Suspense, lazy } from 'react';
import SimpleGasBoilersForm from '@/components/SimpleGasBoilersForm';
import OptimizedImage from '@/components/OptimizedImage';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, Thermometer, Zap, Shield, Flame, Wrench, PoundSterling } from 'lucide-react';
// Performance hooks removed

import EligibilitySection from '@/components/EligibilitySection';

const GasBoilers = () => {
  const [scrollY, setScrollY] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  // Performance hooks removed

  useEffect(() => {
    document.title = "Free Gas Boiler Replacement & Repair Scotland - Government Grants | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free gas boiler replacement or repair in Scotland through government grants. Improve your home efficiency with modern boiler installations at no cost.');
    }

    setHeroLoaded(true);

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
    "Free boiler replacement",
    "Modern high-efficiency boilers",
    "Reduce energy bills significantly",
    "Professional installation included"
  ];

  const eligibilityRequirements = [
    {
      icon: Home,
      title: "Property Type",
      description: "Open to homeowners, private tenants, and landlords"
    },
    {
      icon: Flame,
      title: "Current System",
      description: "Properties with existing gas boilers requiring replacement or upgrade"
    },
    {
      icon: Thermometer,
      title: "Efficiency Rating",
      description: "Older boilers with poor efficiency ratings qualify for replacement"
    },
    {
      icon: Shield,
      title: "Benefits",
      description: "Receive state benefits or have household income below £31,000 per year"
    }
  ];

  if (!heroLoaded) {
    return <PageHeroSkeleton hasForm={true} />;
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 opacity-30 will-change-transform">
          <OptimizedImage
            src="/lovable-uploads/gas.webp"
            alt="Gas Boiler Background - Engineer working on boiler installation"
            className="w-full h-full object-cover mix-blend-multiply"
            fetchPriority="high"
            decoding="sync"
            width={1920}
            height={1080}
            sizes="100vw"
            modernFormats={false}
            style={{ 
              transform: `translate3d(0, ${scrollY * 0.3}px, 0)`
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <SimpleGasBoilersForm />
            </div>
            
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Free Gas Boiler Replacement
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
                Upgrade your heating system at no cost
              </p>
              <p className="text-lg mb-8 text-blue-50 leading-relaxed">
                Replace your old, inefficient gas boiler with a modern, high-efficiency model through government-funded schemes. Reduce your energy bills and improve your home's heating performance.
              </p>
              
              <div className="mb-8">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                      <span className="text-blue-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gas Boiler Qualifying Criteria
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-full flex items-center justify-center">
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
      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Does Gas Boiler Replacement Cover?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our fully funded gas boiler replacement service includes everything you need for a complete heating system upgrade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>New Boiler</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  High-efficiency gas boiler installation with modern technology for optimal performance and energy savings.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Professional Installation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Certified engineers handle complete installation, testing, and commissioning of your new heating system.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Thermometer className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>System Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Modern heating controls and thermostats for better temperature management and energy efficiency.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <PoundSterling className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Warranty Included</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive warranty on your new boiler and installation work for complete peace of mind.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GasBoilers;

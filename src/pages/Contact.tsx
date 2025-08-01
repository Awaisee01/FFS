
import { useEffect, useState } from 'react';
import PageHeroSkeleton from '@/components/PageHeroSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, CheckCircle, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    document.title = "Contact Funding For Scotland - Free Consultation & Eligibility Assessment";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get your free consultation for Scottish grants and funding. Expert advisors help assess eligibility for ECO4, solar panels, boiler replacements, and home improvements.');
    }

    // Mark hero as loaded immediately for faster perceived performance
    setHeroLoaded(true);
  }, []);

  if (!heroLoaded) {
    return <PageHeroSkeleton hasForm={false} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-green-600 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
            Get Your Free Consultation
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Ready to access thousands in grants and funding across Scotland? Submit your enquiry and our friendly team will help to assess your eligibility and guide you through the entire process - completely free of charge.
          </p>
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
            <Button 
              asChild 
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation h-10 sm:h-auto text-sm"
              variant="outline"
            >
              <Link to="/eco4">ECO4</Link>
            </Button>
            <Button 
              asChild 
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation h-10 sm:h-auto text-sm"
              variant="outline"
            >
              <Link to="/solar">Solar</Link>
            </Button>
            <Button 
              asChild 
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation h-10 sm:h-auto text-sm"
              variant="outline"
            >
              <Link to="/gas-boilers">Gas Boilers</Link>
            </Button>
            <Button 
              asChild 
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105 touch-manipulation h-10 sm:h-auto text-sm"
              variant="outline"
            >
              <Link to="/home-improvements">Home Improvements</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Image */}
            <div className="flex justify-center order-2 lg:order-1">
              <img 
                src="/lovable-uploads/contact.webp"
                alt="Funding for Scotland advisor"
                className="rounded-2xl shadow-xl max-w-full h-auto object-cover"
                loading='lazy'
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg">Advisors</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Based in Scotland</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">Coverage Area</h3>
                      <p className="text-gray-600 text-sm sm:text-base">All of Scotland</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">Response Time</h3>
                      <p className="text-gray-600 text-sm sm:text-base">We respond to all enquiries<br />within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      "We'll email you within 24 hours to discuss your needs",
                      "Free property assessment and eligibility check",
                      "Detailed explanation of available funding options",
                      "Professional installation arranged at no cost to you"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

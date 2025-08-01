
import { CheckCircle } from 'lucide-react';
import SimpleHomeImprovementsForm from '@/components/SimpleHomeImprovementsForm';
import OptimizedImage from '@/components/OptimizedImage';

const HomeImprovementsHero = () => {
  const benefits = [
    "Repair broken/missing areas",
    "Fully breathable & hydrophobic system", 
    "10 year Guarantee",
    "Approved Installers"
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Static background image without parallax */}
      <div className="absolute inset-0 opacity-30">
        <OptimizedImage
          src="/lovable-uploads/29502115-60f2-411e-928e-8d3f6c3383c7.png"
          alt="Home Improvements Background - Modern house exterior with driveway"
          className="w-full h-full object-cover mix-blend-multiply"
          priority={true}
          responsive={true}
          preload={true}
          width={1920}
          height={1080}
          sizes="100vw"
          modernFormats={false}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        {/* Mobile: Form first, Desktop: Content first */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Form Section - First on mobile, second on desktop */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <SimpleHomeImprovementsForm />
          </div>
          
          {/* Content Section - Second on mobile, first on desktop */}
          <div className="order-2 lg:order-1">{/* ... keep existing code */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Wall and Roof Renovations
            </h1>
            <p className="text-xl lg:text-2xl mb-6 text-blue-100 font-medium">
              Transform the look of your property while improving energy efficiency
            </p>
            <p className="text-lg mb-8 text-blue-50 leading-relaxed">
              Huge range of colour options. Get your free quote today.
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
  );
};

export default HomeImprovementsHero;

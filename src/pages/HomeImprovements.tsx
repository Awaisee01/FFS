
import { useEffect } from 'react';
import HomeImprovementsHero from '@/components/home-improvements/HomeImprovementsHero';
import ProcessSteps from '@/components/home-improvements/ProcessSteps';
import BeforeAfterCarousel from '@/components/home-improvements/BeforeAfterCarousel';

const HomeImprovements = () => {
  useEffect(() => {
    document.title = "Free Home Improvements Scotland - Government Grants & Upgrades | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Access free home improvements in Scotland through government grants. Upgrade your property with insulation, windows, doors, and energy efficiency improvements.');
    }
  }, []);

  return (
    <div>
      <HomeImprovementsHero />
      
      <ProcessSteps />
      <BeforeAfterCarousel />

      {/* Wall Renovation Colours Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Wall Renovation Colours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our range of premium wall coating colours to transform your property's exterior
            </p>
          </div>
          
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/36cc3bdf-84b2-410c-9c9f-11faa27ac900.png"
              alt="Wall Renovation Colour Options - Light Grey, Water Lily, White, Devon Stone, Polar White, Cotswold Cream, Beige, Cotswold Stone, Pebble, Sage Green"
              className="max-w-full h-auto"
              width={1200}
              height={600}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </div>
        </div>
      </section>

      {/* Roof Renovation Colours Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Roof Renovation Colours
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select from our premium roof coating colours to enhance your property's appearance
            </p>
          </div>
          
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/20eec8da-2186-4c0c-9104-fca70d33ca81.png"
              alt="Roof Renovation Colour Options - Tile Red, Anthracite, Black Blue, Rustic, Red Brown, Green, Dark Brown"
              className="max-w-full h-auto"
              width={1200}
              height={220}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeImprovements;

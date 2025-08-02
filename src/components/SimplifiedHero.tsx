import { CheckCircle } from 'lucide-react';

interface SimplifiedHeroProps {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  heroImage: string;
  altText: string;
  children: React.ReactNode; // Form component
}

// Simplified hero component with minimal DOM and optimized for mobile
const SimplifiedHero = ({
  title,
  subtitle,
  description,
  benefits,
  heroImage,
  altText,
  children
}: SimplifiedHeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white min-h-screen lg:min-h-screen">
      {/* Simplified background with single overlay */}
      <div className="absolute inset-0 bg-black/20">
        <img
          src={heroImage}
          alt={altText}
          className="w-full h-full object-cover mix-blend-multiply opacity-30"
          fetchPriority="high"
          decoding="sync"
          width={1920}
          height={1080}
        />
      </div>
      
      {/* Simplified content structure */}
      <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-24">
        {/* Mobile-first grid with reduced complexity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Form first on mobile for better conversion */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            {children}
          </div>
          
          {/* Content section - simplified structure */}
          <div className="order-2 lg:order-1 space-y-6">
            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
              {title}
            </h1>
            
            <p className="text-xl font-medium text-blue-100 lg:text-2xl">
              {subtitle}
            </p>
            
            <p className="text-lg text-blue-50 leading-relaxed">
              {description}
            </p>
            
            {/* Simplified benefits list with minimal DOM */}
            <ul className="space-y-3" role="list">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" aria-hidden="true" />
                  <span className="text-blue-50">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimplifiedHero;
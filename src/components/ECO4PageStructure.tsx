import { Suspense, lazy } from 'react';
import { Home, Thermometer, Heart, Shield } from 'lucide-react';

// Lazy load heavy components
const EligibilitySection = lazy(() => import('@/components/EligibilitySection'));
const ProcessSection = lazy(() => import('@/components/ProcessSection'));

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

// Loading skeleton
const SectionSkeleton = ({ height = '12rem' }: { height?: string }) => (
  <div className="py-20 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        <div style={{height:'2rem',background:'#d1d5db',borderRadius:'0.25rem',width:'50%',margin:'0 auto'}}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{height,background:'#d1d5db',borderRadius:'0.25rem'}}></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const EligibilityRequirementsSection = () => (
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
      
      <Suspense fallback={<div className="h-40 bg-gray-200 animate-pulse rounded mt-8"></div>}>
        <EligibilitySection />
      </Suspense>
    </div>
  </section>
);

export const ProcessInstallationSection = () => (
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
      
      <Suspense fallback={<SectionSkeleton height="8rem" />}>
        <ProcessSection />
      </Suspense>
    </div>
  </section>
);

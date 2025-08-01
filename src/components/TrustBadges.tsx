import { Shield, Award, Users, CheckCircle } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: CheckCircle,
      title: "Free Service",
      description: "Completely free consultation\nWe will never charge you for anything"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "10+ Years helping with Scottish grant and funding schemes"
    },
    {
      icon: Shield,
      title: "Fully Accredited",
      description: "Any installers, contractors, or companies working with us have been carefully vetted"
    },
    {
      icon: Award,
      title: "5-Star Service",
      description: "We've helped thousands of people successfully access millions in funding"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Funding For Scotland?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are Scotland's trusted funding consultancy, helping homeowners, landlords, and tenants access millions in available grants and funding.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {badge.title}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

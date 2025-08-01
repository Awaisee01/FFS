
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Home as HomeIcon, Zap, Flame, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesGrid = () => {
  const services = [
    {
      icon: HomeIcon,
      title: "ECO4 Funding",
      description: "Heating upgrades, solar panels, and insulation completely free of charge. See if you qualify.",
      link: "/eco4"
    },
    {
      icon: Zap,
      title: "Solar Panels",
      description: "Free Solar Panels through a government backed scheme to help reduce your energy bills.",
      link: "/solar"
    },
    {
      icon: Flame,
      title: "Gas Boilers",
      description: "Replace your old boiler with a new energy efficient model through this funding scheme.",
      link: "/gas-boilers"
    },
    {
      icon: Wrench,
      title: "Home Improvements",
      description: "Including rendering, re-roofing, windows, and doors. Access grants for home improvements here.",
      link: "/home-improvements"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Available Funding Schemes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the various government-backed schemes and grants available to help you improve your home and reduce energy costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-grow flex flex-col justify-between">
                  <CardDescription className="text-gray-600 mb-6">
                    {service.description}
                  </CardDescription>
                  <Button asChild className="w-full mt-auto">
                    <Link to={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;

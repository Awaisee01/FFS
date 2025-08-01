
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const benefits = [
    "Free eligibility assessment",
    "Nothing to pay, we're a free advice group",
    "Guidance through the whole process",
    "Friendly team ready to chat"
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Unlock Scottish Grants & Funding
            </h1>
            <p className="text-lg mb-8 text-blue-50 leading-relaxed">
              We help people in Scotland access local authority schemes, government backed schemes, and other grants around Scotland. Chat with our advisors today and find out what you're entitled to.
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
          
          <div className="hidden lg:block relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-6 text-center">What can we help with?</h3>
              <div className="space-y-4">
                <Button 
                  asChild 
                  className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
                  variant="outline"
                >
                  <Link to="/eco4">
                    ECO4
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
                  variant="outline"
                >
                  <Link to="/solar">
                    Solar Panels
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
                  variant="outline"
                >
                  <Link to="/gas-boilers">
                    Gas Boilers
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center p-4 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:font-bold border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
                  variant="outline"
                >
                  <Link to="/home-improvements">
                    Home Improvements
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Access Your Funding?
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          Don't miss out on thousands of pounds in available grants. Our expert team will assess your eligibility 
          and guide you through the entire application process - completely free of charge.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            asChild 
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
            variant="outline"
          >
            <Link to="/eco4">ECO4</Link>
          </Button>
          <Button 
            asChild 
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
            variant="outline"
          >
            <Link to="/solar">Solar</Link>
          </Button>
          <Button 
            asChild 
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
            variant="outline"
          >
            <Link to="/gas-boilers">Gas Boilers</Link>
          </Button>
          <Button 
            asChild 
            size="lg"
            className="bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105"
            variant="outline"
          >
            <Link to="/home-improvements">Home Improvements</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;

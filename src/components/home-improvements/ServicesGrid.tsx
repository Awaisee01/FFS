
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Lightbulb, Zap, PaintBucket } from 'lucide-react';

const ServicesGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Home Improvements Are Covered?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive home improvement program covers various upgrades to make your property more comfortable and energy-efficient.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Insulation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Loft, cavity wall, and solid wall insulation to improve your home's thermal efficiency and reduce heat loss.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Windows & Doors</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Energy-efficient double or triple-glazed windows and doors to reduce drafts and improve security.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Energy Upgrades</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                LED lighting, smart meters, and energy-efficient appliances to reduce your electricity consumption.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <PaintBucket className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle>Property Upgrades</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                External wall coatings, roof repairs, and other structural improvements to enhance your property.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;

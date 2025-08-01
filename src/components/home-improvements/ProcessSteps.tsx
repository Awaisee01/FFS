
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import OptimizedImage from '@/components/OptimizedImage';

const ProcessSteps = () => {
  const processSteps = [
    {
      number: "1",
      title: "Survey",
      description: "Before any work can take place, a thorough assessment of the area must be completed to ensure an efficient installation and to do a risk assessment on the project.",
      image: "/lovable-uploads/e6d7f9f8-3fec-4e65-915a-0292e7eaf42a.png"
    },
    {
      number: "2", 
      title: "Clean with Anti-fungal Treatment",
      description: "The installer will clean the area with an anti-fungal agent which helps identify areas requiring repair and makes for a much better installation overall.",
      image: "/lovable-uploads/59689f9a-f212-4f4a-9657-ce728db1fd4d.png"
    },
    {
      number: "3",
      title: "Inspection", 
      description: "Careful inspection is then carried out to highlight areas requiring repair or replacement. This includes broken or bossed render and broken or missing roof tiles.",
      image: "/lovable-uploads/8e79806d-c25c-4da5-93ac-ef224e8d65fe.png"
    },
    {
      number: "4",
      title: "Repairs",
      description: "All repairs or replacement identified during the inspection are carried out to give an ideal surface for application.",
      image: "/lovable-uploads/a901cc1e-e8f7-4877-8151-dfeb1c7d9ec1.png"
    },
    {
      number: "5", 
      title: "Masking",
      description: "Windows, doors, alarm systems, etc. are all masked to protect your property as well as covering with ground sheets.",
      image: "/lovable-uploads/2809388d-08dd-4fd6-9664-8d94949886ec.png"
    },
    {
      number: "6",
      title: "Application",
      description: "Airless spray system is used to apply the breathable and hydrophobic protective coating to your walls or roof.",
      image: "/lovable-uploads/9f639358-4175-48bd-8f67-6500b1863dbc.png"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Full Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive step-by-step approach ensures quality results and professional installation for your wall and roof renovations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, index) => (
            <Card key={index} className="text-center h-full overflow-hidden">
              <div className="p-4">
                <div className="relative mb-4">
                  {/* <OptimizedImage
                    src={step.image}
                    alt={`Step ${step.number}: ${step.title}`}
                    className="w-full h-40 object-cover rounded-lg"
                    width={400}
                    height={300}
                  /> */}
                  <div className="w-12 h-12 mx-auto -mt-40 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>
                </div>
                <CardTitle className="text-lg mb-2">{step.title}</CardTitle>
                <CardDescription className="text-sm">
                  {step.description}
                </CardDescription>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;

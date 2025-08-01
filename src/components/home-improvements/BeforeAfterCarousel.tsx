
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedImage from '@/components/OptimizedImage';

const BeforeAfterCarousel = () => {
  const beforeAfterImages = [
    {
      before: "/lovable-uploads/245736bc-2f67-4f44-938d-82fa05111548.png",
      after: "/lovable-uploads/37194ab7-973a-40fd-88f1-80936afde467.png",
      description: "Roof tile restoration and cleaning"
    },
    {
      before: "/lovable-uploads/991d80f9-0561-47ed-a877-8ca0a2f7222e.png", 
      after: "/lovable-uploads/8f34acb2-5ccb-494b-ad5e-22b2431b36ed.png",
      description: "Complete roof renovation and coating"
    },
    {
      before: "/lovable-uploads/415da1c4-2239-44b4-8f43-e535e749984b.png",
      after: "/lovable-uploads/f40577a6-0070-4534-a178-a326c9a839eb.png", 
      description: "Roof and exterior wall transformation"
    },
    {
      before: "/lovable-uploads/8ea43231-f712-44ea-83b5-02c17dde707b.png",
      after: "/lovable-uploads/2548ed02-2948-4e58-acfa-86bca6285630.png",
      description: "Modern house renovation"
    },
    {
      before: "/lovable-uploads/fd3d4fc9-865e-4bc1-861a-e1f75cc167d5.png",
      after: "/lovable-uploads/2548ed02-2948-4e58-acfa-86bca6285630.png",
      description: "External wall and roof upgrade"
    }
  ];

  // Flatten the images for horizontal scrolling
  const allImages = beforeAfterImages.flatMap(item => [
    { src: item.before, alt: `${item.description} - Before` },
    { src: item.after, alt: `${item.description} - After` }
  ]);

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Before & Afters
          </h2>
          <p className="text-sm text-gray-600">
            Roof & Wall Renovations
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-1">
              {allImages.map((image, index) => (
                <CarouselItem key={index} className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4">
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          width={300}
                          height={225}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 h-8 w-8 bg-white/90 hover:bg-white shadow-md border-0" />
            <CarouselNext className="right-1 h-8 w-8 bg-white/90 hover:bg-white shadow-md border-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterCarousel;

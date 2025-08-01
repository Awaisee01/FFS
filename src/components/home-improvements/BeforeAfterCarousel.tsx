
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const BeforeAfterCarousel = () => {
  const beforeAfterImages = [
    {
      before: "/lovable-uploads/home1.webp",
      after: "/lovable-uploads/home2.webp",
      description: "Roof tile restoration and cleaning"
    },
    {
      before: "/lovable-uploads/home3.webp", 
      after: "/lovable-uploads/home4.webp",
      description: "Complete roof renovation and coating"
    },
    {
      before: "/lovable-uploads/home5.webp",
      after: "/lovable-uploads/home6.webp", 
      description: "Roof and exterior wall transformation"
    },
    {
      before: "/lovable-uploads/home1.webp",
      after: "/lovable-uploads/home8.webp",
      description: "Modern house renovation"
    },
    {
      before: "/lovable-uploads/home9.webp",
      after: "/lovable-uploads/home10.webp",
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
                          loading="lazy"
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

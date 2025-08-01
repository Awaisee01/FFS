import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ConversionResult {
  originalUrl: string;
  webpUrl: string;
  outputName: string;
  status: 'pending' | 'converting' | 'completed' | 'error';
}

const ImageConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [conversions, setConversions] = useState<ConversionResult[]>([]);
  const [progress, setProgress] = useState(0);

  const imagesToConvert = [
    {
      url: '/lovable-uploads/7dfe5a80-6453-471d-805e-51f9a0a3224e.png',
      name: 'hero-eco4',
      description: 'ECO4 Hero Image'
    },
    {
      url: '/lovable-uploads/e749188a-d4a1-4569-8677-581f59aeb61f.png',
      name: 'hero-gas-boiler',
      description: 'Gas Boiler Hero Image'
    },
    {
      url: '/lovable-uploads/afaedb6c-8cc8-4d04-ab6b-bfcfcf8d836a.png',
      name: 'hero-home-improvements',
      description: 'Home Improvements Hero Image'
    }
  ];

  const convertImage = async (imageUrl: string, outputName: string) => {
    try {
      // Convert relative URL to absolute URL
      const fullImageUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}${imageUrl}` 
        : imageUrl;
      
      const response = await fetch('/functions/v1/convert-images-to-webp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: fullImageUrl,
          outputName: outputName,
          width: 1920,
          height: 1080
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Conversion failed');
      }

      return result;
    } catch (error) {
      console.error('Error converting image:', error);
      throw error;
    }
  };

  const handleConvertAll = async () => {
    setIsConverting(true);
    setProgress(0);
    
    const initialConversions: ConversionResult[] = imagesToConvert.map(img => ({
      originalUrl: img.url,
      webpUrl: '',
      outputName: img.name,
      status: 'pending' as const
    }));
    
    setConversions(initialConversions);

    let completedCount = 0;
    const totalImages = imagesToConvert.length;

    for (let i = 0; i < imagesToConvert.length; i++) {
      const image = imagesToConvert[i];
      
      try {
        // Update status to converting
        setConversions(prev => prev.map((conv, index) => 
          index === i ? { ...conv, status: 'converting' as const } : conv
        ));

        toast.info(`Converting ${image.description}...`);
        
        const result = await convertImage(image.url, image.name);
        
        // Update with success
        setConversions(prev => prev.map((conv, index) => 
          index === i ? { 
            ...conv, 
            webpUrl: result.webpUrl, 
            status: 'completed' as const 
          } : conv
        ));
        
        completedCount++;
        setProgress((completedCount / totalImages) * 100);
        
        toast.success(`✅ ${image.description} converted successfully!`);
        
      } catch (error) {
        console.error(`Error converting ${image.description}:`, error);
        
        // Update with error
        setConversions(prev => prev.map((conv, index) => 
          index === i ? { ...conv, status: 'error' as const } : conv
        ));
        
        toast.error(`❌ Failed to convert ${image.description}: ${error.message}`);
      }
    }
    
    setIsConverting(false);
    toast.success('🎉 Image conversion process completed!');
  };

  const downloadImage = async (url: string, filename: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`Downloaded ${filename}.webp`);
    } catch (error) {
      toast.error(`Failed to download ${filename}`);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Convert Hero Images to WebP</CardTitle>
        <CardDescription>
          Convert your existing PNG hero images to optimized WebP format for better performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              {imagesToConvert.length} images ready for conversion
            </p>
          </div>
          
          <Button 
            onClick={handleConvertAll}
            disabled={isConverting}
            size="lg"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              'Convert All Images'
            )}
          </Button>
        </div>

        {isConverting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="space-y-4">
          {imagesToConvert.map((image, index) => {
            const conversion = conversions[index];
            
            return (
              <div key={image.url} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={image.url} 
                    alt={image.description}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{image.description}</p>
                    <p className="text-sm text-muted-foreground">{image.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {conversion?.status === 'converting' && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                  
                  {conversion?.status === 'completed' && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadImage(conversion.webpUrl, conversion.outputName)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </>
                  )}
                  
                  {conversion?.status === 'error' && (
                    <span className="text-red-500 text-sm">❌ Failed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {conversions.length > 0 && conversions.every(c => c.status === 'completed') && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">🎉 All images converted successfully!</h3>
            <p className="text-sm text-green-700">
              Your WebP images are ready. Download them and replace the original images in your project 
              for better performance and faster loading times.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageConverter;
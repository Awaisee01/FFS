// Safe Pixel Manager - Won't crash the app
import { useEffect } from 'react';

interface SafePixelManagerProps {
  children: React.ReactNode;
}

const SafePixelManager: React.FC<SafePixelManagerProps> = ({ children }) => {
  useEffect(() => {
    // Safe Facebook Pixel initialization
    try {
      if (typeof window !== 'undefined' && !(window as any).fbq) {
        // Initialize Facebook Pixel safely
        const script = document.createElement('script');
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', '1423013825182147');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
      }
    } catch (error) {
      console.warn('Facebook Pixel initialization failed:', error);
      // Don't crash the app - just log the error
    }
  }, []);

  return <>{children}</>;
};

export default SafePixelManager;
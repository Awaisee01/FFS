import { useEffect } from 'react';

interface LazyScriptProps {
  src: string;
  async?: boolean;
  defer?: boolean;
  onLoad?: () => void;
  condition?: boolean;
  delay?: number;
}

const LazyScript = ({ 
  src, 
  async: isAsync = true, 
  defer = false, 
  onLoad, 
  condition = true,
  delay = 0 
}: LazyScriptProps) => {
  useEffect(() => {
    if (!condition || typeof window === 'undefined') return;

    const loadScript = () => {
      // Check if script already exists
      if (document.querySelector(`script[src="${src}"]`)) return;
      
      const script = document.createElement('script');
      script.src = src;
      script.async = isAsync;
      script.defer = defer;
      
      if (onLoad) {
        script.onload = onLoad;
      }
      
      // Add script to end of body for non-blocking load
      document.body.appendChild(script);
    };

    if (delay > 0) {
      const timer = setTimeout(loadScript, delay);
      return () => clearTimeout(timer);
    } else {
      // Load after page is fully loaded
      if (document.readyState === 'complete') {
        loadScript();
      } else {
        window.addEventListener('load', loadScript);
        return () => window.removeEventListener('load', loadScript);
      }
    }
  }, [src, isAsync, defer, onLoad, condition, delay]);

  return null;
};

export default LazyScript;
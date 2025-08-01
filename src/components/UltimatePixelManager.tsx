// Ultimate Pixel Manager - Central command for all tracking
import { useEffect, useState } from 'react';
import { initializeFacebookPixel, captureUTMData } from '@/lib/facebook-pixel-robust';

interface PixelManagerProps {
  children: React.ReactNode;
  enableAdvancedFeatures?: boolean;
  performanceMode?: 'high' | 'balanced' | 'minimal';
}

const UltimatePixelManager: React.FC<PixelManagerProps> = ({ 
  children, 
  enableAdvancedFeatures = true,
  performanceMode = 'high'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pixelHealth, setPixelHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  useEffect(() => {
    const initializeTracking = async () => {
      try {
        console.log('🚀 ULTIMATE PIXEL MANAGER: Initializing robust tracking system');

        // Capture UTM parameters for enhanced tracking
        captureUTMData();

        // Health check
        setTimeout(() => {
          const health = performanceHealthCheck();
          setPixelHealth(health);
          
          if (health === 'error') {
            console.error('❌ PIXEL HEALTH: Critical issues detected');
          } else if (health === 'warning') {
            console.warn('⚠️ PIXEL HEALTH: Performance issues detected');
          } else {
            console.log('✅ PIXEL HEALTH: All systems operational');
          }
        }, 1000); // Reduced timeout for faster feedback

        setIsInitialized(true);
        console.log('✅ ULTIMATE PIXEL MANAGER: Robust tracking system ready');

      } catch (error) {
        console.error('❌ ULTIMATE PIXEL MANAGER: Initialization failed', error);
        setPixelHealth('error');
      }
    };

    // Use requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initializeTracking, { timeout: 2000 });
    } else {
      setTimeout(initializeTracking, 100);
    }
  }, [performanceMode]);

  const performanceHealthCheck = (): 'healthy' | 'warning' | 'error' => {
    try {
      // Check if Facebook Pixel is loaded
      if (typeof window !== 'undefined' && !(window as any).fbq) {
        return 'error';
      }

      // Check for network connectivity
      if (!navigator.onLine) {
        return 'warning';
      }

      // Check Core Web Vitals if available
      if ('performance' in window && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        if (loadTime > 5000) {
          return 'warning';
        }
      }

      return 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return 'error';
    }
  };

  // Visual indicator for development (only in dev mode)
  const PixelHealthIndicator = () => {
    if (process.env.NODE_ENV !== 'development') return null;

    const colors = {
      healthy: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };

    return (
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: colors[pixelHealth],
          zIndex: 9999,
          boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          opacity: 0.8
        }}
        title={`Pixel Health: ${pixelHealth}`}
      />
    );
  };

  return (
    <>
      {children}
      {isInitialized && enableAdvancedFeatures && <PixelHealthIndicator />}
    </>
  );
};

export default UltimatePixelManager;
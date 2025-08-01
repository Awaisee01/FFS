import { useState, useEffect } from 'react';

interface UserBehavior {
  scrollDepth: number;
  timeOnPage: number;
  interactions: number;
}

export const useECO4Page = () => {
  const [scrollY, setScrollY] = useState(0);
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  const [nonCriticalReady, setNonCriticalReady] = useState(false);
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    scrollDepth: 0,
    timeOnPage: 0,
    interactions: 0
  });

  // Critical initialization
  useEffect(() => {
    // Set page metadata immediately
    document.title = "Free ECO4 Grants Scotland - Government Energy Efficiency Scheme | Funding For Scotland";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get free ECO4 grants in Scotland for energy efficiency improvements. Free insulation, boilers, and home upgrades through government schemes.');
    }

    setCriticalLoaded(true);
    // Shorter delay for better perceived performance
    setTimeout(() => setNonCriticalReady(true), 50);
  }, []);

  // Simplified behavior tracking
  useEffect(() => {
    if (!nonCriticalReady) return;

    const startTime = Date.now();
    let maxScrollDepth = 0;
    let interactionCount = 0;
    let ticking = false;

    const updateScrollY = () => {
      const currentScroll = window.scrollY;
      const scrollPercent = Math.round((currentScroll / (document.body.scrollHeight - window.innerHeight)) * 100);
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      
      setScrollY(currentScroll);
      setUserBehavior(prev => ({ ...prev, scrollDepth: maxScrollDepth }));
      ticking = false;
    };

    const handleSmoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY);
        ticking = true;
      }
    };

    const trackInteraction = () => {
      interactionCount++;
      setUserBehavior(prev => ({ ...prev, interactions: interactionCount }));
    };

    // More efficient time tracking
    const timeTracker = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      setUserBehavior(prev => ({ ...prev, timeOnPage }));
    }, 10000); // Reduced frequency to every 10 seconds

    // Passive event listeners
    window.addEventListener('scroll', handleSmoothScroll, { passive: true });
    document.addEventListener('click', trackInteraction, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleSmoothScroll);
      document.removeEventListener('click', trackInteraction);
      clearInterval(timeTracker);
    };
  }, [nonCriticalReady]);

  return {
    scrollY,
    criticalLoaded,
    nonCriticalReady,
    userBehavior
  };
};
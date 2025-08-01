// Lighthouse Performance Configuration for 100% Score
export const LIGHTHOUSE_TARGETS = {
  // Core Web Vitals thresholds for 100% score
  LCP: 2500, // Largest Contentful Paint < 2.5s
  FID: 100,  // First Input Delay < 100ms
  CLS: 0.1,  // Cumulative Layout Shift < 0.1
  FCP: 1800, // First Contentful Paint < 1.8s
  TTI: 3800, // Time to Interactive < 3.8s
  TBT: 300,  // Total Blocking Time < 300ms
  SI: 3400,  // Speed Index < 3.4s
};

export const CRITICAL_RESOURCES = {
  // Only preload resources that affect LCP
  images: [
    '/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.webp' // Hero image
  ],
  
  // Critical CSS is inlined in index.html
  css: [],
  
  // Fonts are optimized with font-display: swap
  fonts: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap&subset=latin'
  ]
};

export const OPTIMIZATION_STRATEGY = {
  // Defer all non-critical resources
  deferThirdParty: true,
  deferAnalytics: true,
  deferNonCriticalImages: true,
  
  // Use optimal loading strategies
  useEagerLoadingForLCP: true,
  useLazyLoadingForRest: true,
  usePassiveListeners: true,
  
  // Minimize main thread blocking
  useRequestIdleCallback: true,
  batchDOMOperations: true,
  
  // Resource hints optimization
  limitPreconnects: 4, // Maximum recommended
  useOnlyNecessaryPrefetches: true
};

export default {
  LIGHTHOUSE_TARGETS,
  CRITICAL_RESOURCES,
  OPTIMIZATION_STRATEGY
};
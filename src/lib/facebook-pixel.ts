// Enhanced Facebook Pixel tracking with postcode, county, and page type

interface LocationData {
  postcode?: string;
  county?: string;
  city?: string;
}

interface EnhancedPixelData {
  postcode?: string;
  county?: string;
  page_type: string;
  content_category?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

// Extract location data from URL params, localStorage, or form fields
const getLocationData = (): LocationData => {
  try {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const postcode = urlParams.get('postcode') || urlParams.get('zip') || urlParams.get('postal_code');
    const county = urlParams.get('county') || urlParams.get('region') || urlParams.get('state');
    
    // Check localStorage for previously captured data
    const storedLocation = localStorage.getItem('user_location');
    const stored = storedLocation ? JSON.parse(storedLocation) : {};
    
    // Check form fields on current page
    const postcodeField = document.querySelector('input[name*="postcode"], input[name*="zip"], input[name*="postal"]') as HTMLInputElement;
    const countyField = document.querySelector('input[name*="county"], input[name*="region"], select[name*="county"]') as HTMLInputElement;
    
    return {
      postcode: postcode || stored.postcode || postcodeField?.value || undefined,
      county: county || stored.county || countyField?.value || undefined,
      city: stored.city || undefined
    };
  } catch (error) {
    console.warn('Error retrieving location data:', error);
    return {};
  }
};

// Determine page type based on current route
const getPageType = (): string => {
  const pathname = window.location.pathname.toLowerCase();
  
  if (pathname === '/' || pathname === '/index') return 'homepage';
  if (pathname.includes('/eco4')) return 'eco4_landing';
  if (pathname.includes('/solar')) return 'solar_landing';
  if (pathname.includes('/gas-boilers')) return 'gas_boilers_landing';
  if (pathname.includes('/home-improvements')) return 'home_improvements_landing';
  if (pathname.includes('/contact')) return 'contact_page';
  if (pathname.includes('/admin')) return 'admin_page';
  
  return 'other_page';
};

// Enhanced event tracking with required parameters
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;
  
  // Only track critical conversion events to reduce network requests
  const criticalEvents = ['Lead', 'Contact', 'CompleteRegistration', 'Purchase', 'ViewContent', 'InitiateCheckout'];
  if (!criticalEvents.includes(eventName)) return;

  // Use requestIdleCallback to defer tracking and avoid blocking main thread
  const track = () => {
    try {
      if ((window as any).fbq) {
        const locationData = getLocationData();
        const pageType = getPageType();
        
        // Build enhanced parameters with required fields
        const enhancedParameters: EnhancedPixelData = {
          ...parameters,
          page_type: pageType,
          content_category: parameters.content_category || pageType,
          currency: parameters.currency || 'GBP',
          value: parameters.value || 1,
          ...locationData
        };
        
        // Clean up undefined values
        Object.keys(enhancedParameters).forEach(key => {
          if (enhancedParameters[key] === undefined || enhancedParameters[key] === '') {
            delete enhancedParameters[key];
          }
        });
        
        
        
        (window as any).fbq('track', eventName, enhancedParameters);
      }
    } catch (error) {
      console.warn('Facebook Pixel tracking error:', error);
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(track, { timeout: 3000 });
  } else {
    setTimeout(track, 1500);
  }
};

// Store location data when user fills forms
export const captureLocationData = (data: LocationData) => {
  try {
    const existing = localStorage.getItem('user_location');
    const stored = existing ? JSON.parse(existing) : {};
    
    const updated = {
      ...stored,
      ...data,
      timestamp: Date.now()
    };
    
    localStorage.setItem('user_location', JSON.stringify(updated));
    
  } catch (error) {
    console.warn('Error storing location data:', error);
  }
};

export default { trackEvent, captureLocationData };
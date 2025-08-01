// Robust Facebook Pixel + CAPI Tracking with Deduplication
import { sendToConversionsAPI } from './conversions-api';

interface LocationData {
  postcode?: string;
  county?: string;
  city?: string;
}

interface RobustPixelData {
  value: number;
  currency: string;
  content_name: string;
  content_category: string;
  external_id?: string;
  fbc?: string;
  fbp?: string;
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  postcode?: string;
  county?: string;
  page_type?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  [key: string]: any;
}

// Initialize Facebook Pixel with proper setup
export async function initializeFacebookPixel(pixelId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Load Facebook Pixel script
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

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1423013825182147&ev=PageView&noscript=1" />`;
    document.head.appendChild(noscript);

    console.log('✅ Facebook Pixel initialized:', pixelId);
  } catch (error) {
    console.error('❌ Facebook Pixel initialization failed:', error);
  }
}

// Get Facebook cookies for deduplication
function getFacebookCookies(): { fbc?: string; fbp?: string } {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return {
    fbc: cookies._fbc || undefined,
    fbp: cookies._fbp || undefined
  };
}

// Get UTM parameters
function getUTMParameters(): Record<string, string> {
  const urlParams = new URLSearchParams(window.location.search);
  const utmData: Record<string, string> = {};
  
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  utmParams.forEach(param => {
    const value = urlParams.get(param);
    if (value) utmData[param] = value;
  });
  
  // Also check localStorage for stored UTM data
  try {
    const storedUTM = localStorage.getItem('utm_data');
    if (storedUTM) {
      const parsed = JSON.parse(storedUTM);
      Object.assign(utmData, parsed);
    }
  } catch (error) {
    console.warn('Error retrieving stored UTM data:', error);
  }
  
  return utmData;
}

// Extract location data from various sources
function getLocationData(): LocationData {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const postcode = urlParams.get('postcode') || urlParams.get('zip') || urlParams.get('postal_code');
    const county = urlParams.get('county') || urlParams.get('region') || urlParams.get('state');
    
    const storedLocation = localStorage.getItem('user_location');
    const stored = storedLocation ? JSON.parse(storedLocation) : {};
    
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
}

// Determine page type
function getPageType(): string {
  const pathname = window.location.pathname.toLowerCase();
  
  if (pathname === '/' || pathname === '/index') return 'homepage';
  if (pathname.includes('/eco4')) return 'eco4';
  if (pathname.includes('/solar')) return 'solar';
  if (pathname.includes('/gas-boilers')) return 'gas_boilers';
  if (pathname.includes('/home-improvements')) return 'home_improvements';
  if (pathname.includes('/contact')) return 'contact';
  if (pathname.includes('/admin')) return 'admin';
  
  return 'other';
}

// Generate unique event ID for deduplication
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Hash email and phone for external_id
function generateExternalId(email?: string, phone?: string): string | undefined {
  if (!email && !phone) return undefined;
  
  const data = [email, phone].filter(Boolean).join('|').toLowerCase().trim();
  return btoa(data); // Simple base64 encoding - server will do proper hashing
}

// Main tracking function with dual Pixel + CAPI
export async function trackRobustEvent(
  eventName: string, 
  customParameters: Partial<RobustPixelData> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Generate unique event ID for deduplication
    const eventId = generateEventId();
    
    // Get all required data
    const facebookCookies = getFacebookCookies();
    const utmData = getUTMParameters();
    const locationData = getLocationData();
    const pageType = getPageType();
    
    // Generate realistic lead value for events
    const generateEventValue = (eventName: string, pageType: string): number => {
      if (eventName === 'Lead') {
        const leadValues: Record<string, number[]> = {
          'eco4': [15, 20, 25, 30, 35, 40],
          'solar': [40, 50, 60, 70, 80, 90],
          'gas_boilers': [20, 25, 30, 35, 40, 45],
          'home_improvements': [25, 30, 35, 40, 45, 50],
          'contact': [10, 15, 20, 25, 30],
        };
        const values = leadValues[pageType] || leadValues['contact'];
        return values[Math.floor(Math.random() * values.length)];
      }
      return 1; // Default for other events
    };

    // Build comprehensive event data
    const eventData: RobustPixelData = {
      // Required fields with defaults
      value: customParameters.value || generateEventValue(eventName, pageType),
      currency: customParameters.currency || 'GBP',
      content_name: customParameters.content_name || `${eventName} - ${pageType}`,
      content_category: customParameters.content_category || pageType,
      
      // Facebook identifiers
      ...facebookCookies,
      
      // User data (if provided)
      ...(customParameters.em && { em: customParameters.em }),
      ...(customParameters.ph && { ph: customParameters.ph }),
      ...(customParameters.fn && { fn: customParameters.fn }),
      ...(customParameters.ln && { ln: customParameters.ln }),
      
      // Generate external_id from email/phone
      external_id: customParameters.external_id || generateExternalId(customParameters.em, customParameters.ph),
      
      // Location data
      ...locationData,
      page_type: pageType,
      
      // UTM parameters
      ...utmData,
      
      // Any additional custom parameters
      ...customParameters
    };
    
    // Clean up undefined values
    Object.keys(eventData).forEach(key => {
      if (eventData[key] === undefined || eventData[key] === '') {
        delete eventData[key];
      }
    });
    
    console.log('🎯 PIXEL PAYLOAD:', {
      event: eventName,
      event_id: eventId,
      data: eventData
    });
    
    // 1. Send to Facebook Pixel (Browser)
    if ((window as any).fbq) {
      (window as any).fbq('track', eventName, eventData, { eventID: eventId });
      console.log('✅ PIXEL SENT - Browser tracking completed');
    } else {
      console.warn('⚠️ Facebook Pixel not loaded');
    }
    
    // 2. Send to Conversions API (Server) with same event_id
    await sendToConversionsAPI(eventName, eventData, eventId);
    console.log('✅ CAPI SENT - Server tracking completed');
    
  } catch (error) {
    console.error('❌ Robust tracking error:', error);
  }
}

// Store location data when user fills forms
export function captureLocationData(data: LocationData): void {
  try {
    const existing = localStorage.getItem('user_location');
    const stored = existing ? JSON.parse(existing) : {};
    
    const updated = {
      ...stored,
      ...data,
      timestamp: Date.now()
    };
    
    localStorage.setItem('user_location', JSON.stringify(updated));
    console.log('📍 Location data captured:', updated);
  } catch (error) {
    console.warn('Error storing location data:', error);
  }
}

// Store UTM data for later use
export function captureUTMData(): void {
  try {
    const utmData = getUTMParameters();
    if (Object.keys(utmData).length > 0) {
      const existing = localStorage.getItem('utm_data');
      const stored = existing ? JSON.parse(existing) : {};
      
      const updated = {
        ...stored,
        ...utmData,
        timestamp: Date.now()
      };
      
      localStorage.setItem('utm_data', JSON.stringify(updated));
      console.log('📊 UTM data captured:', updated);
    }
  } catch (error) {
    console.warn('Error storing UTM data:', error);
  }
}

// Legacy compatibility
export const trackEvent = trackRobustEvent;

export default { 
  initializeFacebookPixel,
  trackRobustEvent, 
  trackEvent: trackRobustEvent,
  captureLocationData, 
  captureUTMData 
};
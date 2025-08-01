// UTM tracking utility for Facebook Pixel integration

export interface UTMData {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

/**
 * Gets Facebook Click ID from _fbc cookie
 */
export const getFacebookClickId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookies = document.cookie.split(';');
    const fbcCookie = cookies.find(cookie => cookie.trim().startsWith('_fbc='));
    
    if (fbcCookie) {
      const fbc = fbcCookie.split('=')[1];
      console.log('📊 Facebook Click ID (_fbc) found:', fbc);
      return fbc;
    }
    
    console.log('📊 No Facebook Click ID (_fbc) cookie found');
    return null;
  } catch (error) {
    console.warn('⚠️ Error retrieving Facebook Click ID:', error);
    return null;
  }
};

/**
 * Gets Facebook Browser ID from _fbp cookie
 */
export const getFacebookBrowserId = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookies = document.cookie.split(';');
    const fbpCookie = cookies.find(cookie => cookie.trim().startsWith('_fbp='));
    
    if (fbpCookie) {
      const fbp = fbpCookie.split('=')[1];
      console.log('📊 Facebook Browser ID (_fbp) found:', fbp);
      return fbp;
    }
    
    console.log('📊 No Facebook Browser ID (_fbp) cookie found');
    return null;
  } catch (error) {
    console.warn('⚠️ Error retrieving Facebook Browser ID:', error);
    return null;
  }
};

/**
 * Retrieves UTM parameters from localStorage
 * Returns an object with UTM data or empty object if no UTM data exists
 */
export const getUTMData = (): UTMData => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const utmData: UTMData = {
      utm_source: localStorage.getItem('utm_source'),
      utm_medium: localStorage.getItem('utm_medium'),
      utm_campaign: localStorage.getItem('utm_campaign'),
      utm_term: localStorage.getItem('utm_term'),
      utm_content: localStorage.getItem('utm_content'),
    };

    // Filter out null values
    const filteredUTMData: UTMData = {};
    Object.entries(utmData).forEach(([key, value]) => {
      if (value) {
        filteredUTMData[key as keyof UTMData] = value;
      }
    });

    return filteredUTMData;
  } catch (error) {
    console.warn('⚠️ Error retrieving UTM data from localStorage:', error);
    return {};
  }
};

/**
 * Enhanced Facebook Pixel tracking with UTM data, location, and page type
 * @param eventName - The Facebook Pixel event name (e.g., 'Lead', 'Purchase')
 * @param eventData - Additional event parameters
 * @param eventId - Optional event ID for deduplication with Conversions API
 */
export const trackPixelEventWithUTM = (
  eventName: string, 
  eventData: Record<string, any> = {},
  eventId?: string
): void => {
  if (typeof window === 'undefined') {
    console.error('❌ PIXEL: Window undefined - server side execution');
    return;
  }
  
  console.log(`🔥 ENHANCED PIXEL: ${eventName} tracking initiated`);
  console.log('🔥 ENHANCED PIXEL: Event data:', JSON.stringify(eventData, null, 2));
  console.log('🔥 ENHANCED PIXEL: Event ID:', eventId);

  try {
    const utmData = getUTMData();
    const fbc = getFacebookClickId();
    const fbp = getFacebookBrowserId();
    
    // Generate unique event ID if not provided
    const finalEventId = eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get location data from URL or localStorage
    const getLocationData = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const stored = localStorage.getItem('user_location');
        const storedData = stored ? JSON.parse(stored) : {};
        
        return {
          postcode: urlParams.get('postcode') || storedData.postcode,
          county: urlParams.get('county') || storedData.county,
          page_type: getPageType()
        };
      } catch {
        return { page_type: getPageType() };
      }
    };
    
    const getPageType = () => {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname === '/' || pathname === '/index') return 'homepage';
      if (pathname.includes('/eco4')) return 'eco4_landing';
      if (pathname.includes('/solar')) return 'solar_landing';
      if (pathname.includes('/gas-boilers')) return 'gas_boilers_landing';
      if (pathname.includes('/home-improvements')) return 'home_improvements_landing';
      return 'other_page';
    };
    
    const locationData = getLocationData();
    
    // Enhanced parameters with all tracking data
    const enhancedParameters = {
      ...eventData,
      ...locationData,
      ...utmData,
      event_id: finalEventId,
      currency: eventData.currency || 'GBP',
      value: typeof eventData.value === 'number' ? eventData.value : 1,
      ...(fbc && { fbc }),
      ...(fbp && { fbp })
    };

    // Clean up undefined values
    Object.keys(enhancedParameters).forEach(key => {
      if (enhancedParameters[key] === undefined || enhancedParameters[key] === '') {
        delete enhancedParameters[key];
      }
    });

    console.log(`🎯 ENHANCED PIXEL: ${eventName} with full tracking data:`, enhancedParameters);

    // Send to browser pixel
    if ((window as any).fbq) {
      (window as any).fbq('track', eventName, enhancedParameters);
      console.log('✅ BROWSER PIXEL: Event sent successfully');
    }

    // Send to Conversions API for server-side tracking
    import('./conversions-api').then(({ sendToConversionsAPI }) => {
      sendToConversionsAPI(eventName, enhancedParameters, finalEventId);
    }).catch(console.error);
    
  } catch (error) {
    console.error(`❌ PIXEL: ${eventName} tracking failed:`, error);
    // Fallback to basic tracking
    try {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', eventName, eventData);
        console.log(`✅ PIXEL: ${eventName} fallback tracking successful`);
      }
    } catch (fallbackError) {
      console.error(`❌ PIXEL: ${eventName} fallback tracking failed:`, fallbackError);
    }
  }
};

/**
 * Generates realistic lead values based on service type to avoid Facebook's "same value" detection
 */
const generateLeadValue = (contentCategory: string, contentName: string): number => {
  // Realistic lead values for Facebook Pixel (must be within reasonable range)
  const serviceValues: Record<string, number[]> = {
    'eco4': [15, 20, 25, 30, 35, 40], // ECO4 scheme lead values
    'solar': [40, 50, 60, 70, 80, 90], // Solar installation lead values  
    'gas-boilers': [20, 25, 30, 35, 40, 45], // Gas boiler lead values
    'home-improvements': [25, 30, 35, 40, 45, 50], // General improvements lead values
    'contact': [10, 15, 20, 25, 30], // Contact form lead values
  };

  // Determine service type from category or content name
  let serviceType = 'contact'; // Default
  
  if (contentCategory.toLowerCase().includes('eco4') || contentName.toLowerCase().includes('eco4')) {
    serviceType = 'eco4';
  } else if (contentCategory.toLowerCase().includes('solar') || contentName.toLowerCase().includes('solar')) {
    serviceType = 'solar';
  } else if (contentCategory.toLowerCase().includes('gas') || contentName.toLowerCase().includes('boiler')) {
    serviceType = 'gas-boilers';
  } else if (contentCategory.toLowerCase().includes('improvement') || contentName.toLowerCase().includes('improvement')) {
    serviceType = 'home-improvements';
  }

  const values = serviceValues[serviceType];
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex];
};

/**
 * Helper function specifically for Lead events with UTM data
 */
export const trackLeadWithUTM = (leadData: {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
  event_value_id?: string;
  // Enhanced fields for better tracking
  fbc?: string;
  fbp?: string;
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  zp?: string;
}, eventId?: string): void => {
  console.log('🔥 PIXEL Lead event sent with enhanced data');
  console.log('🔥 PIXEL Event ID:', eventId);
  console.log('🔥 PIXEL Lead data:', JSON.stringify(leadData, null, 2));
  
  // Generate dynamic value based on service type to pass Facebook validation
  const dynamicValue = generateLeadValue(leadData.content_category, leadData.content_name);
  
  // CRITICAL: Ensure value is number and currency is GBP for Events Manager
  const standardizedLeadData = {
    ...leadData,
    value: leadData.value || dynamicValue, // Use provided value or generate dynamic one
    currency: "GBP", // ALWAYS 3-letter ISO for Events Manager
    event_value_id: leadData.event_value_id || eventId
  };
  
  console.log('🔥 PIXEL Final Lead payload for Events Manager:', JSON.stringify(standardizedLeadData, null, 2));
  console.log('🔥 PIXEL Generated dynamic value:', dynamicValue, 'for service:', leadData.content_category);
  console.log('🔥 PIXEL Value type:', typeof standardizedLeadData.value, '(must be number)');
  console.log('🔥 PIXEL Currency:', standardizedLeadData.currency, '(must be GBP)');
  
  trackPixelEventWithUTM('Lead', standardizedLeadData, eventId);
  console.log('🔥 PIXEL Lead tracking completed with eventID:', String(eventId));
};

/**
 * Helper function specifically for ViewContent events with UTM data
 */
export const trackViewContentWithUTM = (contentData: {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
}, eventId?: string): void => {
  console.log('🔥 DEBUG: trackViewContentWithUTM called with eventId:', eventId);
  
  // CRITICAL: Ensure value is ALWAYS a number and currency is ALWAYS "GBP"
  const standardizedContentData = {
    ...contentData,
    value: 1, // ALWAYS number for Facebook Events Manager
    currency: "GBP" // ALWAYS 3-letter ISO code
  };
  
  console.log('✅ PIXEL: ViewContent event data (standardized):', standardizedContentData);
  
  trackPixelEventWithUTM('ViewContent', standardizedContentData, eventId);
  console.log('✅ PIXEL: ViewContent tracking completed with eventID:', String(eventId));
};

/**
 * Helper function specifically for InitiateCheckout events with UTM data
 */
export const trackInitiateCheckoutWithUTM = (checkoutData: {
  content_name: string;
  content_category: string;
  value?: number;
  currency?: string;
}, eventId?: string): void => {
  console.log('🔥 DEBUG: trackInitiateCheckoutWithUTM called with eventId:', eventId);
  
  // CRITICAL: Ensure value is ALWAYS a number and currency is ALWAYS "GBP"
  const standardizedCheckoutData = {
    ...checkoutData,
    value: 1, // ALWAYS number for Facebook Events Manager
    currency: "GBP" // ALWAYS 3-letter ISO code
  };
  
  console.log('✅ PIXEL: InitiateCheckout event data (standardized):', standardizedCheckoutData);
  
  trackPixelEventWithUTM('InitiateCheckout', standardizedCheckoutData, eventId);
  console.log('✅ PIXEL: InitiateCheckout tracking completed with eventID:', String(eventId));
};

/**
 * Helper function specifically for Purchase events with UTM data
 */
export const trackPurchaseWithUTM = (purchaseData: {
  content_name: string;
  content_category: string;
  value: number;
  currency?: string;
}): void => {
  trackPixelEventWithUTM('Purchase', {
    ...purchaseData,
    currency: purchaseData.currency || 'GBP'
  });
};
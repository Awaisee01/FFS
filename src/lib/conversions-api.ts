// Facebook Conversions API integration for server-side tracking

export interface ConversionData {
  eventName: string;
  eventId?: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
    city?: string;
    county?: string;
    fbc?: string;
    fbp?: string;
    external_id?: string;
  };
  customData: {
    content_name: string;
    content_category: string;
    page_type?: string;
    postcode?: string;
    county?: string;
    value?: number;
    currency?: string;
  };
  eventSourceUrl: string;
  utmData?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  };
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Send event to Facebook Conversions API via Supabase Edge Function with enhanced logging
 */
export const sendToConversionsAPI = async (
  eventName: string,
  eventData: Record<string, any>,
  eventId: string
): Promise<{ success: boolean; response?: any }> => {
  try {
    console.log('🚀 CONVERSIONS API: Preparing to send event:', eventName);
    console.log('🚀 CONVERSIONS API: Event ID for deduplication:', eventId);
    
    // Extract user data for server-side hashing
    const userData: Record<string, any> = {};
    
    // Get Facebook identifiers from cookies
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');
    
    if (fbc) userData.fbc = fbc;
    if (fbp) userData.fbp = fbp;
    
    // Extract user data from event parameters
    if (eventData.em) userData.email = eventData.em;
    if (eventData.ph) userData.phone = eventData.ph;
    if (eventData.fn) userData.firstName = eventData.fn;
    if (eventData.ln) userData.lastName = eventData.ln;
    if (eventData.zp) userData.zipCode = eventData.zp;
    if (eventData.postcode) userData.zipCode = eventData.postcode;
    if (eventData.county) userData.county = eventData.county;
    if (eventData.external_id) userData.external_id = eventData.external_id;
    
    // Prepare custom data (remove user data fields and ensure required fields)
    const customData = { 
      value: typeof eventData.value === 'number' ? eventData.value : 1,
      currency: eventData.currency || 'GBP',
      content_name: eventData.content_name || `${eventName} Submission`,
      content_category: eventData.content_category || 'lead',
      ...eventData 
    };
    
    // Remove user data fields from custom data
    ['em', 'ph', 'fn', 'ln', 'zp', 'fbc', 'fbp', 'external_id'].forEach(field => delete customData[field]);
    
    // Get UTM data from localStorage
    const utmData = getUTMDataFromStorage();
    
    // Prepare conversion data with all required fields
    const conversionData: ConversionData = {
      eventName,
      eventId, // Critical for deduplication
      userData,
      customData,
      eventSourceUrl: window.location.href,
      utmData,
      userAgent: navigator.userAgent,
      ipAddress: undefined // Will be extracted server-side
    };
    
    console.log('📊 CAPI PAYLOAD DETAILS:');
    console.log('  Event Name:', eventName);
    console.log('  Event ID (deduplication):', eventId);
    console.log('  Value:', customData.value, 'GBP');
    console.log('  Content Name:', customData.content_name);
    console.log('  Content Category:', customData.content_category);
    console.log('  Facebook Cookies:', { fbc, fbp });
    console.log('  UTM Data:', utmData);
    console.log('  Location Data:', { postcode: eventData.postcode, county: eventData.county });
    console.log('  Full Payload:', JSON.stringify(conversionData, null, 2));
    
    // Send to Supabase Edge Function
    const response = await fetch('https://pchynbefgbupbmkqfrqe.supabase.co/functions/v1/facebook-conversions-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: conversionData })
    });
    
    const responseData = await response.json();
    
    console.log('📡 CAPI RESPONSE STATUS:', response.status, response.statusText);
    console.log('📡 CAPI RESPONSE HEADERS:', Object.fromEntries(response.headers.entries()));
    console.log('📡 CAPI RESPONSE BODY:', responseData);
    
    if (response.ok) {
      console.log('✅ CONVERSIONS API: Event queued successfully');
      console.log('✅ Expected: Facebook will show this as "Server & Browser" event with event_id:', eventId);
      return { success: true, response: responseData };
    } else {
      console.error('❌ CONVERSIONS API: HTTP Error:', response.status, response.statusText);
      console.error('❌ CONVERSIONS API: Response:', responseData);
      return { success: false, response: responseData };
    }
    
  } catch (error) {
    console.error('❌ CONVERSIONS API: Network/Parsing Error:', error);
    return { success: false, response: null };
  }
};

// Helper functions
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const getUTMDataFromStorage = () => {
  try {
    const stored = localStorage.getItem('utm_data');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};
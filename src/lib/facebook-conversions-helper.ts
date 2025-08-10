// Facebook Conversions API helper for form submissions
import { ConversionData } from './conversions-api';

interface FormConversionData {
  eventName: string;
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    zipCode?: string;
    external_id?: string;
  };
  customData: {
    content_name: string;
    content_category: string;
    value?: number;
    currency?: string;
    postcode?: string;
  };
}

/**
 * Send form completion data to Facebook via Conversions API
 */
export const sendFormCompletionToFacebook = async (data: FormConversionData): Promise<void> => {
  try {
    
    // Get UTM data from localStorage
    const getUTMData = () => {
      try {
        const stored = localStorage.getItem('utm_data');
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    };

    // Get Facebook identifiers from cookies
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const utmData = getUTMData();
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');

    // Prepare conversion data for Supabase Edge Function
    const conversionPayload: ConversionData = {
      eventName: data.eventName,
      eventId: `${data.eventName}_form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userData: {
        ...data.userData,
        fbc: fbc || undefined,
        fbp: fbp || undefined
      },
      customData: {
        ...data.customData,
        page_type: getPageType(),
        postcode: data.customData.postcode
      },
      eventSourceUrl: window.location.href,
      utmData,
      userAgent: navigator.userAgent
    };


    // Send to Supabase Edge Function
    const response = await fetch(`https://pchynbefgbupbmkqfrqe.supabase.co/functions/v1/facebook-conversions-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: conversionPayload })
    });

    if (response.ok) {
      const result = await response.json();
    } else {
      const errorText = await response.text();
      console.error('❌ FACEBOOK CONVERSION: Failed to send:', response.status, errorText);
    }

  } catch (error) {
    console.error('❌ FACEBOOK CONVERSION: Error sending form completion:', error);
  }
};

// Helper function to determine page type
const getPageType = (): string => {
  const pathname = window.location.pathname.toLowerCase();
  if (pathname === '/' || pathname === '/index') return 'homepage';
  if (pathname.includes('/eco4')) return 'eco4_landing';
  if (pathname.includes('/solar')) return 'solar_landing';
  if (pathname.includes('/gas-boilers')) return 'gas_boilers_landing';
  if (pathname.includes('/home-improvements')) return 'home_improvements_landing';
  return 'other_page';
};

export default sendFormCompletionToFacebook;
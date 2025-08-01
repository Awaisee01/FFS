import { supabase } from '@/integrations/supabase/client';

interface FormSubmissionData {
  serviceType: string;
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  address?: string;
  formData?: Record<string, any>;
  formName?: string;
}

import { trackingManager } from '@/lib/unified-tracking-manager';

export const trackViewContent = (contentName: string, contentCategory: string) => {
  return trackingManager.trackPageView();
};

export const trackFormSubmission = (userData: {
  email?: string;
  phone?: string;
  name?: string;
  postcode?: string;
}, serviceType: string) => {
  // Parse first/last name if available
  const nameParts = userData.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return trackingManager.trackFormSubmission(serviceType, {
    email: userData.email,
    phone: userData.phone,
    firstName,
    lastName,
    postcode: userData.postcode
  });
};

export const submitFormToDatabase = async (data: FormSubmissionData) => {
  console.log('📝 Form submission:', data.serviceType);

  try {
    // Insert into Supabase database only - no analytics
    const { data: result, error } = await supabase
      .from('form_submissions')
      .insert({
        service_type: data.serviceType as 'eco4' | 'solar' | 'gas_boilers' | 'home_improvements',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        postcode: data.postcode || '',
        page_path: window.location.pathname,
        form_data: data.formData || {},
        utm_source: null,
        utm_medium: null,
        utm_campaign: null
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✅ Form submitted successfully');
    
    // Track Lead event with rich customer data for better match quality
    try {
      await trackFormSubmission({
        email: data.email,
        phone: data.phone,
        name: data.name,
        postcode: data.postcode
      }, data.serviceType);
      console.log('📊 Lead event tracked with customer data');
    } catch (trackingError) {
      console.error('⚠️ Lead tracking failed:', trackingError);
      // Don't throw error - form submission was successful
    }
    
    // Send email notification
    try {
      await supabase.functions.invoke('send-enquiry-notification', {
        body: {
          name: result.name,
          email: result.email,
          phone: result.phone,
          postcode: result.postcode,
          service_type: result.service_type,
          address: data.address,
          created_at: result.created_at
        }
      });
      console.log('📧 Email notification sent');
    } catch (emailError) {
      console.error('⚠️ Email notification failed:', emailError);
      // Don't throw error - form submission was successful
    }
    
    return result;

  } catch (error) {
    console.error('💥 Submission failed:', error);
    throw error;
  }
};
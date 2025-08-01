import { supabase } from '@/integrations/supabase/client';
import { validateFormSubmission, sanitizeInput, createRateLimiter } from '@/lib/security';

// Rate limiter: 5 submissions per 15 minutes per IP
const rateLimiter = createRateLimiter(5, 15 * 60 * 1000);

export interface FormSubmissionData {
  name: string;
  email?: string;
  phone?: string;
  postcode?: string;
  property_type?: string;
  property_ownership?: string;
  current_heating_system?: string;
  epc_score?: string;
  service_type: string;
  form_data: any;
  page_path: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  user_agent?: string;
}

export class SecureFormSubmissionService {
  private static getClientIP(): string {
    // In a real browser environment, this would need to be handled server-side
    // For now, use a fallback identifier
    return 'browser-client';
  }

  private static sanitizeFormData(data: FormSubmissionData): FormSubmissionData {
    return {
      ...data,
      name: sanitizeInput(data.name),
      email: data.email ? sanitizeInput(data.email) : undefined,
      phone: data.phone ? sanitizeInput(data.phone) : undefined,
      postcode: data.postcode ? sanitizeInput(data.postcode) : undefined,
      property_type: data.property_type ? sanitizeInput(data.property_type) : undefined,
      property_ownership: data.property_ownership ? sanitizeInput(data.property_ownership) : undefined,
      current_heating_system: data.current_heating_system ? sanitizeInput(data.current_heating_system) : undefined,
      epc_score: data.epc_score ? sanitizeInput(data.epc_score) : undefined,
      service_type: sanitizeInput(data.service_type),
      page_path: sanitizeInput(data.page_path),
      referrer: data.referrer ? sanitizeInput(data.referrer) : undefined,
      utm_source: data.utm_source ? sanitizeInput(data.utm_source) : undefined,
      utm_medium: data.utm_medium ? sanitizeInput(data.utm_medium) : undefined,
      utm_campaign: data.utm_campaign ? sanitizeInput(data.utm_campaign) : undefined,
      utm_content: data.utm_content ? sanitizeInput(data.utm_content) : undefined,
      utm_term: data.utm_term ? sanitizeInput(data.utm_term) : undefined,
      form_data: data.form_data
    };
  }

  static async submitForm(data: FormSubmissionData): Promise<{
    success: boolean;
    error?: string;
    submissionId?: string;
  }> {
    try {
      // Rate limiting check
      const clientIP = this.getClientIP();
      if (!rateLimiter(clientIP)) {
        return {
          success: false,
          error: 'Too many submissions. Please wait before submitting again.'
        };
      }

      // Validate input data
      const validation = validateFormSubmission(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Sanitize all input data
      const sanitizedData = this.sanitizeFormData(data);

      // Submit to Supabase
      const { data: submission, error } = await supabase
        .from('form_submissions')
        .insert({
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          postcode: sanitizedData.postcode,
          property_type: sanitizedData.property_type,
          property_ownership: sanitizedData.property_ownership,
          current_heating_system: sanitizedData.current_heating_system,
          epc_score: sanitizedData.epc_score,
          service_type: sanitizedData.service_type as any,
          form_data: sanitizedData.form_data,
          page_path: sanitizedData.page_path,
          referrer: sanitizedData.referrer,
          utm_source: sanitizedData.utm_source,
          utm_medium: sanitizedData.utm_medium,
          utm_campaign: sanitizedData.utm_campaign,
          utm_content: sanitizedData.utm_content,
          utm_term: sanitizedData.utm_term,
          user_agent: sanitizedData.user_agent,
          ip_address: clientIP !== 'browser-client' ? clientIP : undefined
        })
        .select()
        .single();

      if (error) {
        console.error('Form submission error:', error);
        return {
          success: false,
          error: 'Failed to submit form. Please try again.'
        };
      }

      return {
        success: true,
        submissionId: submission.id
      };

    } catch (error) {
      console.error('Unexpected error during form submission:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  static async trackPageVisit(data: {
    page_path: string;
    referrer?: string;
    visitor_id: string;
    session_id: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    user_agent?: string;
  }): Promise<void> {
    try {
      const sanitizedData = {
        page_path: sanitizeInput(data.page_path),
        referrer: data.referrer ? sanitizeInput(data.referrer) : undefined,
        visitor_id: data.visitor_id,
        session_id: data.session_id,
        utm_source: data.utm_source ? sanitizeInput(data.utm_source) : undefined,
        utm_medium: data.utm_medium ? sanitizeInput(data.utm_medium) : undefined,
        utm_campaign: data.utm_campaign ? sanitizeInput(data.utm_campaign) : undefined,
        utm_content: data.utm_content ? sanitizeInput(data.utm_content) : undefined,
        utm_term: data.utm_term ? sanitizeInput(data.utm_term) : undefined,
        user_agent: data.user_agent ? sanitizeInput(data.user_agent) : undefined
      };

      await supabase
        .from('page_visits')
        .insert({
          ...sanitizedData,
          ip_address: this.getClientIP() !== 'browser-client' ? this.getClientIP() : undefined
        });
    } catch (error) {
      console.error('Error tracking page visit:', error);
      // Don't throw error for tracking failures
    }
  }
}
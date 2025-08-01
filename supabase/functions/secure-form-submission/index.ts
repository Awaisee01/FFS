import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: Store in memory (in production, use Redis or similar)
const rateLimitStore = new Map<string, number[]>();

const isRateLimited = (ip: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip)!;
  const validRequests = requests.filter(time => time > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return true; // Rate limited
  }
  
  validRequests.push(now);
  rateLimitStore.set(ip, validRequests);
  return false;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const validatePhone = (phone: string): boolean => {
  // Very lenient phone validation - just check it's not empty and has numbers
  const cleaned = phone.replace(/\s/g, '');
  return cleaned.length >= 7 && /\d/.test(cleaned);
};

const validatePostcode = (postcode: string): boolean => {
  // More flexible postcode validation - allow any reasonable format
  const trimmed = postcode.trim();
  return trimmed.length >= 3 && trimmed.length <= 10;
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>]/g, '');
};

const validateFormData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  console.log('🔍 Validating form data:', JSON.stringify(data, null, 2));
  
  // Only require name and service_type - everything else is optional
  if (!data.name || data.name.trim().length === 0) {
    console.log('❌ Name is missing or empty');
    errors.push('Name is required');
  }
  
  if (!data.service_type) {
    console.log('❌ Service type is missing');
    errors.push('Service type is required');
  }
  
  console.log('🔍 Validation result:', { isValid: errors.length === 0, errors });
  return { isValid: errors.length === 0, errors };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract the first IP address from potentially comma-separated list
    const getClientIP = (req: Request): string => {
      const forwardedFor = req.headers.get('x-forwarded-for');
      if (forwardedFor) {
        // Take the first IP from comma-separated list and clean it
        const firstIP = forwardedFor.split(',')[0].trim();
        return firstIP || 'unknown';
      }
      const realIP = req.headers.get('x-real-ip');
      return realIP || 'unknown';
    };

    const clientIP = getClientIP(req);

    // Rate limiting check
    if (isRateLimited(clientIP)) {
      return Response.json(
        { 
          success: false, 
          error: 'Too many submissions. Please wait before submitting again.' 
        },
        { status: 429, headers: corsHeaders }
      )
    }

    const formData = await req.json()
    console.log('🔍 Received form data:', JSON.stringify(formData, null, 2));

    // Validate form data
    const validation = validateFormData(formData);
    if (!validation.isValid) {
      return Response.json(
        { 
          success: false, 
          error: validation.errors.join(', ') 
        },
        { status: 400, headers: corsHeaders }
      )
    }

    // Sanitize all string inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: formData.email ? sanitizeInput(formData.email) : null,
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      postcode: formData.postcode ? sanitizeInput(formData.postcode) : null,
      property_type: formData.property_type ? sanitizeInput(formData.property_type) : null,
      property_ownership: formData.property_ownership ? sanitizeInput(formData.property_ownership) : null,
      current_heating_system: formData.current_heating_system ? sanitizeInput(formData.current_heating_system) : null,
      epc_score: formData.epc_score ? sanitizeInput(formData.epc_score) : null,
      service_type: formData.service_type,
      form_data: formData.form_data,
      page_path: sanitizeInput(formData.page_path),
      referrer: formData.referrer ? sanitizeInput(formData.referrer) : null,
      utm_source: formData.utm_source ? sanitizeInput(formData.utm_source) : null,
      utm_medium: formData.utm_medium ? sanitizeInput(formData.utm_medium) : null,
      utm_campaign: formData.utm_campaign ? sanitizeInput(formData.utm_campaign) : null,
      utm_content: formData.utm_content ? sanitizeInput(formData.utm_content) : null,
      utm_term: formData.utm_term ? sanitizeInput(formData.utm_term) : null,
      user_agent: req.headers.get('user-agent'),
      ip_address: clientIP
    };

    // Insert into database
    const { data: submission, error } = await supabase
      .from('form_submissions')
      .insert(sanitizedData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return Response.json(
        { 
          success: false, 
          error: 'Failed to submit form. Please try again.' 
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Send email notification
    console.log('📧 Attempting to send email notification for submission:', submission.id);
    console.log('📧 Submission data for email:', JSON.stringify(submission, null, 2));
    
    try {
      // First try with submission ID
      console.log('📧 Calling send-enquiry-notification with submissionId...');
      const emailResult = await supabase.functions.invoke('send-enquiry-notification', {
        body: { submissionId: submission.id }
      });
      
      console.log('📧 Email result status:', emailResult.error ? 'ERROR' : 'SUCCESS');
      console.log('📧 Email result data:', JSON.stringify(emailResult.data, null, 2));
      console.log('📧 Email result error:', JSON.stringify(emailResult.error, null, 2));
      
      if (emailResult.error) {
        console.error('📧 Email notification failed, trying direct approach:', emailResult.error);
        
        // Try direct approach as fallback
        const directEmailResult = await supabase.functions.invoke('send-enquiry-notification', {
          body: {
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            postcode: submission.postcode,
            service_type: submission.service_type,
            address: sanitizedData.form_data?.address,
            created_at: submission.created_at
          }
        });
        
        console.log('📧 Direct email attempt result:', directEmailResult);
      } else {
        console.log('✅ Email notification sent successfully via submissionId');
      }
    } catch (emailError) {
      console.error('💥 Email notification exception:', emailError);
      // Try one more time with direct data
      try {
        console.log('🔄 Retrying email notification with direct data...');
        const retryResult = await supabase.functions.invoke('send-enquiry-notification', {
          body: {
            name: submission.name || 'Customer',
            email: submission.email,
            phone: submission.phone,
            postcode: submission.postcode,
            service_type: submission.service_type,
            address: sanitizedData.form_data?.address,
            created_at: new Date().toISOString()
          }
        });
        console.log('🔄 Retry email result:', retryResult);
      } catch (retryError) {
        console.error('💥 Final email retry failed:', retryError);
      }
    }

    return Response.json({
      success: true,
      submissionId: submission.id,
      message: 'Form submitted successfully'
    }, {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
})
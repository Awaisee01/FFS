import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConversionData {
  eventName: string
  eventId?: string // For deduplication
  userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    zipCode?: string
    city?: string
    county?: string // UK uses County not State
    fbc?: string // Facebook Click ID
    fbp?: string // Facebook Browser ID  
    external_id?: string // External identifier
  }
  customData: {
    content_name: string
    content_category: string
    page_type?: string // New: Page type parameter
    postcode?: string // New: Postcode parameter
    county?: string // New: County parameter
    value?: number
    currency?: string
  }
  eventSourceUrl: string
  utmData?: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_content?: string
    utm_term?: string
  }
  userAgent?: string
  ipAddress?: string
}

serve(async (req) => {
  console.log('🚀 Facebook Conversions API function called')
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Parse request data first
  let requestData: any
  try {
    requestData = await req.json()
    console.log('📊 Received conversion data:', requestData)
    
    // Validate request structure
    if (!requestData || !requestData.data) {
      console.error('❌ Invalid request structure - missing data field')
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request structure - missing data field',
          success: false 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
  } catch (error) {
    console.error('❌ Error parsing request:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Invalid request format',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }

  // Background processing function
  async function processConversion(data: ConversionData) {
    try {
      console.log('🔄 Processing conversion:', data.eventName)
      
      // Get Facebook access token from secrets
      const accessToken = Deno.env.get('FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN')
      const pixelId = Deno.env.get('FACEBOOK_PIXEL_ID')
      
      if (!accessToken || !pixelId) {
        console.error('❌ Facebook Conversions API credentials not configured - please set FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN and FACEBOOK_PIXEL_ID')
        return
      }

      // Validate token format
      if (!accessToken.startsWith('EAA')) {
        console.error('❌ Invalid Facebook access token format - should start with EAA');
        return;
      }

      console.log('✅ Facebook credentials found and validated:', {
        tokenPrefix: accessToken.substring(0, 10) + '...',
        pixelId: pixelId,
        tokenLength: accessToken.length
      })

      // Prepare the conversion event
      const eventTime = Math.floor(Date.now() / 1000)
      
      // Hash email and phone if provided (required by Facebook)
      const hashData = async (data: string) => {
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(data.toLowerCase().trim())
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      }

      const userData: any = {}
      if (data.userData.email) {
        userData.em = await hashData(data.userData.email)
      }
      if (data.userData.phone) {
        // Remove non-digits and hash
        const cleanPhone = data.userData.phone.replace(/\D/g, '')
        userData.ph = await hashData(cleanPhone)
      }
      if (data.userData.firstName) {
        userData.fn = await hashData(data.userData.firstName)
      }
      if (data.userData.lastName) {
        userData.ln = await hashData(data.userData.lastName)
      }
      if (data.userData.zipCode) {
        userData.zp = await hashData(data.userData.zipCode)
      }
      if (data.userData.city) {
        userData.ct = await hashData(data.userData.city)
      }
      if (data.userData.county) {
        userData.st = await hashData(data.userData.county) // Facebook uses 'st' field for regional data
      }
      
      // Add Facebook-specific identifiers (critical for match quality)
      if (data.userData.fbc) {
        userData.fbc = data.userData.fbc // Facebook Click ID (no hashing needed)
      }
      if (data.userData.fbp) {
        userData.fbp = data.userData.fbp // Facebook Browser ID (no hashing needed)
      }
      
      // Generate external_id if email or phone is available (improves match quality)
      if (data.userData.email && !data.userData.external_id) {
        userData.external_id = await hashData(data.userData.email)
      } else if (data.userData.external_id) {
        userData.external_id = await hashData(data.userData.external_id)
      }
      
      // Extract client IP address from request headers
      const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                      req.headers.get('x-real-ip') || 
                      req.headers.get('cf-connecting-ip') || 
                      undefined
      
      if (clientIp) {
        userData.client_ip_address = clientIp
      }
      
      // Add user agent
      if (data.userAgent) {
        userData.client_user_agent = data.userAgent
      }

      // Build custom data with UTM parameters
      const customData = {
        ...data.customData,
        ...(data.utmData && {
          utm_source: data.utmData.utm_source,
          utm_medium: data.utmData.utm_medium,
          utm_campaign: data.utmData.utm_campaign,
          utm_content: data.utmData.utm_content,
          utm_term: data.utmData.utm_term,
        })
      }

      // Prepare the event payload
      const eventPayload: any = {
        event_name: data.eventName,
        event_time: eventTime,
        event_source_url: data.eventSourceUrl,
        user_data: userData,
        custom_data: customData,
        action_source: 'website'
      }

      // Add event ID for deduplication if provided
      if (data.eventId) {
        eventPayload.event_id = String(data.eventId) // Ensure it's always a string
        console.log('📊 CAPI event ID (event_id):', String(data.eventId));
      }

      // Validate required fields for Facebook CAPI
      if (!eventPayload.event_name) {
        console.error('❌ Missing required field: event_name');
        return;
      }
      
      if (!eventPayload.user_data || Object.keys(eventPayload.user_data).length === 0) {
        console.warn('⚠️ No user data provided - adding minimal data');
        eventPayload.user_data.client_ip_address = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                                                   req.headers.get('x-real-ip') || 
                                                   req.headers.get('cf-connecting-ip') || 
                                                   '127.0.0.1';
      }

      const eventData = {
        data: [eventPayload]
        // Remove test_event_code for production
      }

      console.log('📊 Complete CAPI payload being sent to Facebook:', JSON.stringify(eventData, null, 2));

      // Send to Facebook Conversions API with latest version
      const apiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
      console.log('🔗 API URL:', apiUrl.replace(accessToken, 'TOKEN_HIDDEN'));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      })

      const result = await response.json()
      
      console.log('🔥 DEBUG: Facebook API Response Details:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        result: result
      });
      
      if (!response.ok) {
        console.error('❌ Facebook Conversions API HTTP error:', {
          status: response.status,
          statusText: response.statusText,
          url: apiUrl.replace(accessToken, 'TOKEN_HIDDEN'),
          result: result,
          eventData: JSON.stringify(eventData, null, 2)
        });
        
        // Log specific error details
        if (result.error) {
          console.error('🔥 Facebook API Error Details:', {
            code: result.error.code,
            message: result.error.message,
            type: result.error.type,
            fbtrace_id: result.error.fbtrace_id
          });
        }
        return
      }

      console.log('✅ Facebook Conversions API success:', result)
      
      // Enhanced response logging
      if (result.events_received !== undefined) {
        console.log(`📊 Events received by Facebook: ${result.events_received}`)
      }
      
      if (result.fbtrace_id) {
        console.log(`🔍 Facebook trace ID: ${result.fbtrace_id}`)
      }
      
      // Check for warnings in the response
      if (result.messages && result.messages.length > 0) {
        console.warn('⚠️ Facebook API warnings:', result.messages)
      } else {
        console.log('✅ No Facebook API warnings - clean event submission')
      }

    } catch (error) {
      console.error('❌ Background conversion processing error:', error)
    }
  }

  // Use EdgeRuntime.waitUntil for proper background processing
  try {
    // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
    EdgeRuntime.waitUntil(processConversion(requestData.data))
    console.log('✅ Background processing task queued successfully')
  } catch (error) {
    console.error('❌ Failed to queue background processing:', error)
    // Fallback to regular async processing
    processConversion(requestData.data).catch(bgError => {
      console.error('❌ Background processing failed:', bgError)
    })
  }
  
  // Return immediate response
  return new Response(
    JSON.stringify({ success: true, message: 'Event queued for processing' }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 202 // Accepted
    }
  )
})
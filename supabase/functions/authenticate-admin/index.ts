import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Use the secure authenticate_admin function
    const { data: authResult, error } = await supabase.rpc('authenticate_admin', {
      user_email: email,
      user_password: password
    })

    if (error) {
      console.error('Authentication error:', error)
      return Response.json(
        { success: false, error: 'Authentication failed' },
        { status: 401, headers: corsHeaders }
      )
    }

    if (!authResult?.success) {
      return Response.json(
        { success: false, error: authResult?.error || 'Invalid credentials' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Create session token
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours

    // Extract first IP from forwarded header (handles comma-separated IPs)
    const forwardedIp = req.headers.get('x-forwarded-for');
    const clientIp = forwardedIp ? forwardedIp.split(',')[0].trim() : req.headers.get('x-real-ip');

    // Store session in admin_sessions table
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: authResult.admin_id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        ip_address: clientIp,
        user_agent: req.headers.get('user-agent')
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return Response.json(
        { success: false, error: 'Failed to create session' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Log successful authentication
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: authResult.admin_id,
        action: 'login',
        details: { email, ip_address: req.headers.get('x-forwarded-for') },
        ip_address: req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent')
      })

    return Response.json({
      success: true,
      session_token: sessionToken,
      admin_id: authResult.admin_id,
      email: authResult.email,
      totp_verified: authResult.totp_verified,
      expires_at: expiresAt.toISOString()
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
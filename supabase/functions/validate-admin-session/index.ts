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

    const { session_token } = await req.json()

    if (!session_token) {
      return Response.json(
        { valid: false, error: 'Session token is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if session exists and is valid
    const { data: session, error } = await supabase
      .from('admin_sessions')
      .select(`
        *,
        admin_users (
          id,
          email,
          is_active,
          totp_verified
        )
      `)
      .eq('session_token', session_token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !session) {
      return Response.json(
        { valid: false, error: 'Invalid or expired session' },
        { status: 401, headers: corsHeaders }
      )
    }

    // Check if admin is still active
    if (!session.admin_users?.is_active || !session.admin_users?.totp_verified) {
      return Response.json(
        { valid: false, error: 'Admin account is not active or verified' },
        { status: 401, headers: corsHeaders }
      )
    }

    return Response.json({
      valid: true,
      admin_id: session.admin_id,
      email: session.admin_users.email,
      expires_at: session.expires_at
    }, {
      status: 200,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { valid: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
})
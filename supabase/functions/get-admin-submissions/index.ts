import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { session_token } = await req.json()

    if (!session_token) {
      return new Response(
        JSON.stringify({ error: 'Session token is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Validate admin session
    const { data: sessionData, error: sessionError } = await supabase
      .from('admin_sessions')
      .select(`
        admin_id,
        expires_at
      `)
      .eq('session_token', session_token)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !sessionData) {
      console.log('Session validation failed:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Get admin user details
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, is_active, totp_verified')
      .eq('id', sessionData.admin_id)
      .single()

    if (adminError || !adminUser || !adminUser.is_active || !adminUser.totp_verified) {
      return new Response(
        JSON.stringify({ error: 'Admin access denied' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      )
    }

    // Get all form submissions using service role (bypasses RLS)
    const { data: submissions, error: submissionsError } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch submissions' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log(`Admin ${adminUser.email} fetched ${submissions?.length || 0} submissions`)

    // Log admin action
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: 'fetch_submissions',
        details: { count: submissions?.length || 0 }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        submissions: submissions || [] 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
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

    const { session_token, submission_id, updates } = await req.json()

    if (!session_token || !submission_id || !updates) {
      return new Response(
        JSON.stringify({ error: 'Session token, submission ID, and updates are required' }),
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

    // Sanitize updates
    const sanitizedUpdates: any = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && ['status', 'admin_notes', 'property_type', 'property_ownership', 'current_heating_system', 'epc_score', 'contacted_at'].includes(key)) {
        // Basic sanitization - remove potential XSS
        sanitizedUpdates[key] = typeof value === 'string' 
          ? value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          : value;
      }
    });

    // Add updated_at timestamp
    sanitizedUpdates.updated_at = new Date().toISOString();

    // Update the submission using service role (bypasses RLS)
    const { data: updatedSubmission, error: updateError } = await supabase
      .from('form_submissions')
      .update(sanitizedUpdates)
      .eq('id', submission_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating submission:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update submission', details: updateError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log(`Admin ${adminUser.email} updated submission ${submission_id}`)

    // Log admin action
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: 'update_submission',
        details: { 
          submission_id,
          updates: sanitizedUpdates 
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        submission: updatedSubmission 
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
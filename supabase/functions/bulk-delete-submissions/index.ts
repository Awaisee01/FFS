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
    const { session_token, submission_ids } = await req.json();
    

    if (!session_token) {
      console.error('❌ No session token provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Session token required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!submission_ids || !Array.isArray(submission_ids) || submission_ids.length === 0) {
      console.error('❌ Invalid submission IDs provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Valid submission IDs required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Validate admin session
    const { data: sessionData, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('session_token', session_token)
      .single();

    if (sessionError || !sessionData) {
      console.error('❌ Invalid session:', sessionError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid session' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if session is expired
    if (new Date(sessionData.expires_at) < new Date()) {
      console.error('❌ Session expired');
      return new Response(
        JSON.stringify({ success: false, error: 'Session expired' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate admin user
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('id', sessionData.admin_id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminData) {
      console.error('❌ Invalid admin user:', adminError);
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid admin user' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }


    // Perform bulk delete
    const { error: deleteError } = await supabase
      .from('form_submissions')
      .delete()
      .in('id', submission_ids);

    if (deleteError) {
      console.error('❌ Delete error:', deleteError);
      return new Response(
        JSON.stringify({ success: false, error: deleteError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }


    // Log the bulk delete action
    await supabase
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminData.id,
        action: 'bulk_delete_submissions',
        details: {
          deleted_submission_ids: submission_ids,
          count: submission_ids.length
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted_count: submission_ids.length 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('💥 Bulk delete function error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
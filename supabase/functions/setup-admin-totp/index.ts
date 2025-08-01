
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    console.log('Setting up TOTP for email:', email);

    // Check if admin user exists
    const { data: existingUser, error: fetchError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching admin user:', fetchError);
      throw fetchError;
    }

    // Generate a simple base32 secret without using speakeasy
    // This is a simplified approach that works in Deno
    const generateSecret = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let secret = '';
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < 32; i++) {
        secret += chars[array[i] % chars.length];
      }
      return secret;
    };

    let totpSecret = '';
    let alreadyVerified = false;

    if (!existingUser) {
      // Create new admin user with TOTP secret
      totpSecret = generateSecret();
      
      const { error: insertError } = await supabaseClient
        .from('admin_users')
        .insert({
          email,
          totp_secret: totpSecret,
          totp_verified: false,
          role: 'admin'
        });

      if (insertError) {
        console.error('Error creating admin user:', insertError);
        throw insertError;
      }

      console.log('Created new admin user with TOTP secret');
    } else {
      totpSecret = existingUser.totp_secret;
      alreadyVerified = existingUser.totp_verified;

      if (!totpSecret) {
        // User exists but no TOTP secret, generate one
        totpSecret = generateSecret();
        
        const { error: updateError } = await supabaseClient
          .from('admin_users')
          .update({ totp_secret: totpSecret })
          .eq('email', email);

        if (updateError) {
          console.error('Error updating admin user with TOTP secret:', updateError);
          throw updateError;
        }

        console.log('Updated existing admin user with new TOTP secret');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        secret: totpSecret,
        alreadyVerified
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in setup-admin-totp:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

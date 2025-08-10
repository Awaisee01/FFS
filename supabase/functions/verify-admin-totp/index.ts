
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

    const { email, code, isSetup = false } = await req.json();

    if (!email || !code) {
      throw new Error('Email and code are required');
    }


    // Get admin user
    const { data: adminUser, error: fetchError } = await supabaseClient
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('Error fetching admin user:', fetchError);
      throw new Error('Admin user not found');
    }

    if (!adminUser.totp_secret) {
      throw new Error('TOTP not set up for this user');
    }

    // Improved TOTP verification with better time window handling
    const verifyTOTP = async (secret: string, token: string) => {
      
      // Clean the secret (remove spaces and convert to uppercase)
      const cleanSecret = secret.replace(/\s+/g, '').toUpperCase();
      
      // Convert base32 secret to bytes
      const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let bits = '';
      
      for (let i = 0; i < cleanSecret.length; i++) {
        const char = cleanSecret[i];
        const index = base32chars.indexOf(char);
        if (index === -1) {
          console.error('Invalid base32 character:', char);
          continue;
        }
        bits += index.toString(2).padStart(5, '0');
      }
      
      // Pad bits to make it divisible by 8
      while (bits.length % 8 !== 0) {
        bits += '0';
      }
      
      const secretBytes = new Uint8Array(bits.length / 8);
      for (let i = 0; i < secretBytes.length; i++) {
        secretBytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
      }


      // Get current time step (30-second intervals since Unix epoch)
      const currentTime = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(currentTime / 30);
      
      console.log('Current time:', currentTime, 'Time step:', timeStep);

      // Check multiple time windows to account for clock drift
      const windows = [-2, -1, 0, 1, 2]; // Check 5 windows (2.5 minutes total)
      
      for (const windowOffset of windows) {
        const time = timeStep + windowOffset;
        
        try {
          // Convert time to 8-byte big-endian buffer
          const timeBuffer = new ArrayBuffer(8);
          const timeView = new DataView(timeBuffer);
          timeView.setUint32(4, time, false); // big-endian, store in last 4 bytes
          
          // Create HMAC-SHA1 key
          const key = await crypto.subtle.importKey(
            'raw',
            secretBytes,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
          );
          
          // Generate HMAC-SHA1 signature
          const signature = await crypto.subtle.sign('HMAC', key, timeBuffer);
          const hashArray = new Uint8Array(signature);
          
          // Dynamic truncation (RFC 4226)
          const offset = hashArray[hashArray.length - 1] & 0xf;
          const binary = ((hashArray[offset] & 0x7f) << 24) |
                        ((hashArray[offset + 1] & 0xff) << 16) |
                        ((hashArray[offset + 2] & 0xff) << 8) |
                        (hashArray[offset + 3] & 0xff);
          
          const otp = (binary % 1000000).toString().padStart(6, '0');
          
          console.log(`Window ${windowOffset}: time=${time}, generated OTP=${otp}, input=${token}`);
          
          if (otp === token) {
            console.log('✅ TOTP match found in window:', windowOffset);
            return true;
          }
        } catch (error) {
          console.error('Error in TOTP calculation for window', windowOffset, ':', error);
        }
      }
      
      console.log('❌ No TOTP match found in any time window');
      return false;
    };

    const isValid = await verifyTOTP(adminUser.totp_secret, code);

    console.log('TOTP verification result:', isValid);

    if (!isValid) {
      throw new Error('Invalid verification code');
    }

    // Mark as verified if this is setup or verification is successful
    const { error: updateError } = await supabaseClient
      .from('admin_users')
      .update({ totp_verified: true })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating verification status:', updateError);
      throw updateError;
    }

    // Log the authentication event
    const { error: auditError } = await supabaseClient
      .from('admin_audit_log')
      .insert({
        admin_user_id: adminUser.id,
        action: isSetup ? 'totp_setup_completed' : 'admin_login',
        details: { email, setup: isSetup }
      });

    if (auditError) {
      console.error('Error logging audit event:', auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in verify-admin-totp:', error);
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

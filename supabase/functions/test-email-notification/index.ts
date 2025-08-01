
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Test email notification function called');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Sending test email notification...');
    
    const emailResponse = await resend.emails.send({
      from: "Test Notification <noreply@fundingforscotland.co.uk>",
      to: ["info@fundingforscotland.co.uk"],
      subject: "Test Email Notification - System Check",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Test Email Notification
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">System Test</h3>
            <p><strong>Test Type:</strong> Email Notification System</p>
            <p><strong>Status:</strong> ✅ Working Correctly</p>
            <p><strong>Sent At:</strong> ${new Date().toLocaleString('en-GB')}</p>
          </div>

          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">What This Means</h3>
            <p>Your email notification system is properly configured and working. You will now receive notifications for all new enquiries submitted through your website forms.</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              This is a test notification from your Funding For Scotland website notification system.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in test-email-notification function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

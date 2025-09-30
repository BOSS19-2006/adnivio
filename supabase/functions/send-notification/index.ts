import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { user_id, type, title, message, data } = await req.json()

    // Send notification using the database function
    const { data: notificationId, error } = await supabaseClient
      .rpc('send_notification', {
        p_user_id: user_id,
        p_type: type,
        p_title: title,
        p_message: message,
        p_data: data
      })

    if (error) {
      throw error
    }

    // Here you could also integrate with push notification services
    // like Firebase Cloud Messaging, OneSignal, etc.

    return new Response(
      JSON.stringify({ success: true, notification_id: notificationId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
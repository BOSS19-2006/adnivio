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

    const { 
      order_id, 
      payment_method, 
      amount, 
      currency = 'INR',
      payment_details 
    } = await req.json()

    // In a real implementation, you would integrate with payment gateways like:
    // - Razorpay
    // - Stripe
    // - PayPal
    // - UPI providers
    
    // For demo purposes, we'll simulate a successful payment
    const paymentResult = {
      success: true,
      transaction_id: `txn_${Date.now()}`,
      gateway_response: {
        status: 'completed',
        gateway: payment_method,
        amount: amount,
        currency: currency,
        timestamp: new Date().toISOString()
      }
    }

    // Update order payment status
    const { error: orderError } = await supabaseClient
      .from('orders')
      .update({
        payment_status: 'completed',
        status: 'confirmed'
      })
      .eq('id', order_id)

    if (orderError) {
      throw orderError
    }

    // Create transaction record
    const { error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: (await supabaseClient
          .from('orders')
          .select('buyer_id')
          .eq('id', order_id)
          .single()).data?.buyer_id,
        type: 'purchase',
        status: 'completed',
        amount: amount,
        currency: currency,
        description: `Payment for order ${order_id}`,
        reference_id: order_id,
        reference_type: 'order',
        payment_method: payment_method,
        gateway_transaction_id: paymentResult.transaction_id,
        gateway_response: paymentResult.gateway_response,
        processed_at: new Date().toISOString()
      })

    if (transactionError) {
      throw transactionError
    }

    // Send notification to buyer
    await supabaseClient.rpc('send_notification', {
      p_user_id: (await supabaseClient
        .from('orders')
        .select('buyer_id')
        .eq('id', order_id)
        .single()).data?.buyer_id,
      p_type: 'order_update',
      p_title: 'Payment Successful',
      p_message: `Your payment of ₹${amount} has been processed successfully.`,
      p_data: { order_id, transaction_id: paymentResult.transaction_id }
    })

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: paymentResult.transaction_id,
        status: 'completed'
      }),
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
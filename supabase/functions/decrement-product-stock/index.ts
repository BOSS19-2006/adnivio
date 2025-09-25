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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { product_id, quantity } = await req.json()

    // Get current stock
    const { data: product, error: fetchError } = await supabaseClient
      .from('products')
      .select('stock_quantity')
      .eq('id', product_id)
      .single()

    if (fetchError) {
      throw fetchError
    }

    const newStock = Math.max(0, product.stock_quantity - quantity)

    // Update stock and status if needed
    const updateData: any = { stock_quantity: newStock }
    if (newStock === 0) {
      updateData.status = 'out_of_stock'
    }

    const { error: updateError } = await supabaseClient
      .from('products')
      .update(updateData)
      .eq('id', product_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, new_stock: newStock }),
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
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { campaignId, metrics } = await req.json();

    if (!campaignId || !metrics) {
      return new Response(
        JSON.stringify({ error: "Missing campaignId or metrics" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get current campaign
    const { data: campaign, error: fetchError } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", campaignId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!campaign) {
      return new Response(
        JSON.stringify({ error: "Campaign not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from("analytics")
      .insert({
        campaign_id: campaignId,
        impressions: metrics.impressions || 0,
        clicks: metrics.clicks || 0,
        conversions: metrics.conversions || 0,
        revenue: metrics.revenue || 0,
        date: new Date().toISOString(),
      })
      .select()
      .single();

    if (analyticsError) throw analyticsError;

    // Update campaign performance metrics
    const currentMetrics = campaign.performance_metrics || {};
    const updatedMetrics = {
      ...currentMetrics,
      total_impressions: (currentMetrics.total_impressions || 0) + (metrics.impressions || 0),
      total_clicks: (currentMetrics.total_clicks || 0) + (metrics.clicks || 0),
      total_conversions: (currentMetrics.total_conversions || 0) + (metrics.conversions || 0),
      last_updated: new Date().toISOString(),
    };

    // Calculate ROI if revenue exists
    if (metrics.revenue && campaign.spent) {
      updatedMetrics.roi = (((metrics.revenue - campaign.spent) / campaign.spent) * 100).toFixed(2);
    }

    const { data: updatedCampaign, error: updateError } = await supabase
      .from("campaigns")
      .update({
        performance_metrics: updatedMetrics,
        spent: (campaign.spent || 0) + (metrics.spend || 0),
      })
      .eq("id", campaignId)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        campaign: updatedCampaign,
        analytics,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

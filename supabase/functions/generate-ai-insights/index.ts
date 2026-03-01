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
    const { campaignId } = await req.json();

    if (!campaignId) {
      return new Response(
        JSON.stringify({ error: "Missing campaignId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get campaign with analytics data
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

    // Get recent analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from("analytics")
      .select("*")
      .eq("campaign_id", campaignId)
      .order("date", { ascending: false })
      .limit(7);

    if (analyticsError) throw analyticsError;

    // Generate insights based on performance data
    const metrics = campaign.performance_metrics || {};
    const insights = generateInsights(campaign, analytics || [], metrics);

    // Update campaign with insights
    const { data: updatedCampaign, error: updateError } = await supabase
      .from("campaigns")
      .update({ ai_insights: insights })
      .eq("id", campaignId)
      .select()
      .single();

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        success: true,
        insights,
        campaign: updatedCampaign,
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

function generateInsights(
  campaign: any,
  analytics: any[],
  metrics: any
): string {
  const recommendations: string[] = [];

  // CTR Analysis
  const totalImpressions = metrics.total_impressions || 0;
  const totalClicks = metrics.total_clicks || 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : 0;

  if (ctr < 1) {
    recommendations.push("Low CTR detected. Consider improving ad copy or creative design.");
  } else if (ctr > 3) {
    recommendations.push("Excellent CTR! Your ad creative is performing well. Consider scaling the budget.");
  }

  // Conversion Analysis
  const totalConversions = metrics.total_conversions || 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : 0;

  if (conversionRate < 1) {
    recommendations.push("Low conversion rate. Optimize your landing page or target audience.");
  } else if (conversionRate > 5) {
    recommendations.push("Outstanding conversion rate! Your campaign is highly effective.");
  }

  // Budget Analysis
  if (campaign.spent && campaign.budget) {
    const spendPercentage = (campaign.spent / campaign.budget * 100).toFixed(1);
    if (spendPercentage > 90) {
      recommendations.push("Campaign budget nearly depleted. Plan your next campaign budget accordingly.");
    } else if (spendPercentage < 20) {
      recommendations.push("Campaign is underspending. Consider increasing daily budget to maximize reach.");
    }
  }

  // ROI Analysis
  if (metrics.roi && metrics.roi > 0) {
    recommendations.push(`Strong ROI of ${metrics.roi}%. Continue with current strategy.`);
  } else if (metrics.roi && metrics.roi < 0) {
    recommendations.push("Negative ROI detected. Review targeting and reduce budget or pause campaign.");
  }

  // Trending Analysis
  if (analytics.length > 1) {
    const latestCtr = analytics[0].ctr || 0;
    const previousCtr = analytics[1].ctr || 0;

    if (latestCtr > previousCtr) {
      recommendations.push("Performance is improving. Keep monitoring and refine targeting.");
    } else if (latestCtr < previousCtr) {
      recommendations.push("Performance decline detected. Refresh creatives or adjust targeting.");
    }
  }

  // Default recommendations if none generated
  if (recommendations.length === 0) {
    recommendations.push("Campaign is performing normally. Monitor metrics regularly for optimization opportunities.");
  }

  return recommendations.join(" | ");
}

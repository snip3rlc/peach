
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

  try {
    logStep("Function started");
    
    // Use the service role key to perform writes in Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Look up customer in our database
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
      
    if (customerError) {
      logStep("Error fetching customer", { error: customerError.message });
      throw new Error(`Database error: ${customerError.message}`);
    }
    
    if (!customerData?.stripe_customer_id) {
      logStep("No customer found in database");
      // Update subscription status
      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        active: false,
        plan: null,
        current_period_end: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        active: false,
        plan: null,
        current_period_end: null,
        cancel_at_period_end: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    const customerId = customerData.stripe_customer_id;
    logStep("Found customer in database", { customerId });
    
    // Check subscription in Stripe
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.default_payment_method"],
      limit: 1
    });
    
    const hasSubscription = subscriptions.data.length > 0;
    
    if (!hasSubscription) {
      logStep("No active subscription found in Stripe");
      // Update subscription status
      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        active: false,
        plan: null,
        current_period_end: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        active: false,
        plan: null,
        current_period_end: null,
        cancel_at_period_end: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    // Determine plan type based on price ID
    let plan = "unknown";
    if (priceId === Deno.env.get("STRIPE_SILVER_PRICE_ID")) {
      plan = "silver";
    } else if (priceId === Deno.env.get("STRIPE_GOLD_PRICE_ID")) {
      plan = "gold";
    }
    
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;
    
    logStep("Active subscription found", { 
      plan, 
      currentPeriodEnd, 
      cancelAtPeriodEnd 
    });
    
    // Update subscription in our database
    await supabase.from("subscriptions").upsert({
      user_id: user.id,
      active: true,
      plan,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: cancelAtPeriodEnd,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    return new Response(JSON.stringify({ 
      active: true,
      plan,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: cancelAtPeriodEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

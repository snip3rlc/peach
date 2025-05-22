
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!;

// Helper function for logging steps
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    const token = authHeader.replace("Bearer ", "");
    
    // Get user from token
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error(`Authentication error: ${userError?.message || "User not found"}`);
    }
    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse request body
    const { planType } = await req.json();
    if (!planType || (planType !== "silver" && planType !== "gold")) {
      throw new Error("Invalid plan type");
    }
    logStep("Request parsed", { planType });

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
    
    // Check if user already has a stripe customer ID
    const { data: customers, error: customerError } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (customerError) {
      logStep("Error fetching customer", { error: customerError.message });
    }
    
    // Get or create customer
    let customerId;
    if (customers?.stripe_customer_id) {
      customerId = customers.stripe_customer_id;
      logStep("Found existing Stripe customer", { customerId });
    } else {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id }
      });
      customerId = customer.id;
      
      // Save the customer id in our database
      await supabase
        .from("customers")
        .insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          email: user.email
        });
      
      logStep("Created new Stripe customer", { customerId });
    }
    
    // Price ID based on plan
    let priceId;
    if (planType === "silver") {
      priceId = Deno.env.get("STRIPE_SILVER_PRICE_ID");
    } else if (planType === "gold") {
      priceId = Deno.env.get("STRIPE_GOLD_PRICE_ID");
    }
    
    if (!priceId) {
      throw new Error(`Price ID for plan ${planType} is not configured`);
    }
    
    // Create checkout session with price ID from environment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/plans`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      locale: 'ko',
      phone_number_collection: { enabled: true },
    });

    logStep("Created checkout session", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("Error", { message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

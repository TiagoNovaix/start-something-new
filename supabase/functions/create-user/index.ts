import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Hardcoded API key for external user creation
const API_KEY = "sk_soluv_2026_f8a3c1d9e7b24056a1c3e5d7f9b0a2c4";

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing env vars");
    return jsonResponse({ error: "Server configuration error" }, 500);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { name, email, password, plan, api_key } = body;

  // Validate API key
  if (!api_key || api_key !== API_KEY) {
    return jsonResponse({ error: "Invalid API key" }, 401);
  }

  // Validate required fields
  if (!name || !email || !password) {
    return jsonResponse({ error: "Missing required fields: name, email, password" }, 400);
  }

  const validPlans = ["free", "basic", "pro", "enterprise"];
  const userPlan = validPlans.includes(plan) ? plan : "free";

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Create user in Supabase Auth
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (createErr) {
      return jsonResponse({ error: createErr.message }, 400);
    }

    // Update profile with plan
    if (newUser.user) {
      await supabase.from("profiles").update({ plan: userPlan, full_name: name }).eq("id", newUser.user.id);
    }

    return jsonResponse({ userId: newUser.user.id, email, plan: userPlan }, 201);
  } catch (err: any) {
    console.error("Create user error:", err);
    return jsonResponse({ error: err.message || "Internal error" }, 500);
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-superadmin-token",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Simple superadmin verification via a shared token
const SUPERADMIN_EMAIL = "contato@soluv.com.br";

function getServiceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify superadmin token (matches localStorage session)
  const token = req.headers.get("x-superadmin-token");
  if (!token) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  try {
    const parsed = JSON.parse(token);
    if (!parsed?.authenticated) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
  } catch {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = getServiceClient();
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/superadmin-users\/?/, "");

  try {
    // GET /superadmin-users — list all users
    if (req.method === "GET" && !path) {
      // Get auth users
      const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      if (authErr) throw authErr;

      // Get profiles
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("id, full_name, email, plan, active, updated_at");
      if (profErr) throw profErr;

      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) ?? []);

      const users = authData.users.map((u: any) => {
        const profile = profileMap.get(u.id) as any;
        return {
          id: u.id,
          email: u.email,
          full_name: profile?.full_name || null,
          plan: profile?.plan || "free",
          active: profile?.active ?? true,
          created_at: u.created_at,
        };
      });

      return jsonResponse({ users });
    }

    // POST /superadmin-users — create user
    if (req.method === "POST" && !path) {
      const { email, password, full_name, plan } = await req.json();
      if (!email || !password) {
        return jsonResponse({ error: "Email and password are required" }, 400);
      }

      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });
      if (createErr) throw createErr;

      // Update profile with plan
      if (plan && newUser.user) {
        await supabase.from("profiles").update({ plan, full_name }).eq("id", newUser.user.id);
      }

      return jsonResponse({ user: newUser.user }, 201);
    }

    // PUT /superadmin-users/:id — update user
    if (req.method === "PUT" && path) {
      const userId = path;
      const body = await req.json();

      // Update auth user if email or password changed
      const authUpdate: any = {};
      if (body.email) authUpdate.email = body.email;
      if (body.password) authUpdate.password = body.password;

      if (Object.keys(authUpdate).length > 0) {
        const { error: authErr } = await supabase.auth.admin.updateUserById(userId, authUpdate);
        if (authErr) throw authErr;
      }

      // Update profile
      const profileUpdate: any = {};
      if (body.full_name !== undefined) profileUpdate.full_name = body.full_name;
      if (body.plan !== undefined) profileUpdate.plan = body.plan;
      if (body.active !== undefined) profileUpdate.active = body.active;
      if (body.email !== undefined) profileUpdate.email = body.email;

      if (Object.keys(profileUpdate).length > 0) {
        const { error: profErr } = await supabase.from("profiles").update(profileUpdate).eq("id", userId);
        if (profErr) throw profErr;
      }

      return jsonResponse({ success: true });
    }

    // DELETE /superadmin-users/:id — delete user
    if (req.method === "DELETE" && path) {
      const userId = path;
      const { error: delErr } = await supabase.auth.admin.deleteUser(userId);
      if (delErr) throw delErr;
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: "Not found" }, 404);
  } catch (err: any) {
    console.error("SuperAdmin Users Error:", err);
    return jsonResponse({ error: err.message || "Internal error" }, 500);
  }
});

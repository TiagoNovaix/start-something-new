import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCompany() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("users_companies")
        .select("company_id")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      if (!error && data) {
        setCompanyId(data.company_id);
      }
      setLoading(false);
    }
    fetchCompany();
  }, []);

  return { companyId, loading };
}

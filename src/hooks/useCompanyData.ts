import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/hooks/useCompany";

export function useCompanyData() {
  const { companyId } = useCompany();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId!)
        .single();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    company,
    isLoading,
    companyId,
    logoUrl: (company as any)?.logo_url || "",
    companyName: company?.name || "",
  };
}

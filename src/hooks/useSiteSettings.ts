import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) throw error;
      const settings: Record<string, string> = {};
      data?.forEach((row) => {
        settings[row.key] = row.value;
      });
      return settings;
    },
    staleTime: 1000 * 60 * 5,
  });
}

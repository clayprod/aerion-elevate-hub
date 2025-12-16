import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  [key: string]: string;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (error) {
          console.error("Error fetching site settings:", error);
          return;
        }

        const settingsMap: SiteSettings = {};
        data?.forEach((setting) => {
          settingsMap[setting.key] = setting.value || "";
        });

        setSettings(settingsMap);
      } catch (error) {
        console.error("Error in useSiteSettings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
};


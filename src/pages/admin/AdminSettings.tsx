import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  category: string | null;
  description: string | null;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive",
      });
    } else {
      setSettings(data || []);
      const initialData: Record<string, string> = {};
      data?.forEach((setting) => {
        initialData[setting.key] = setting.value || "";
      });
      setFormData(initialData);
    }
  };

  const handleSave = async (category: string) => {
    const categorySettings = settings.filter((s) => s.category === category);

    const updates = categorySettings.map((setting) => ({
      key: setting.key,
      value: formData[setting.key] || "",
      category: setting.category,
      description: setting.description,
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(updates, { onConflict: "key" });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Configurações salvas com sucesso.",
      });
      fetchSettings();
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const getSettingsByCategory = (category: string) => {
    return settings.filter((s) => s.category === category);
  };

  const renderSettingsForm = (category: string) => {
    const categorySettings = getSettingsByCategory(category);

    return (
      <Card className="p-8">
        <div className="space-y-6">
          {categorySettings.map((setting) => (
            <div key={setting.key}>
              <label className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                {setting.description || setting.key}
              </label>
              <Input
                value={formData[setting.key] || ""}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                placeholder={setting.key}
              />
              <p className="text-xs text-gray-medium mt-1">Chave: {setting.key}</p>
            </div>
          ))}
          <Button
            onClick={() => handleSave(category)}
            className="bg-action hover:bg-action/90"
          >
            Salvar {category === "general" ? "Gerais" : category === "contact" ? "Contato" : category === "social" ? "Redes Sociais" : "SEO"}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-28 pb-20">
        <div className="container-custom max-w-6xl">
          <h1 className="text-4xl font-heading font-bold text-navy-deep mb-8">
            Configurações do Site
          </h1>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="general">Gerais</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
              <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
                Configurações Gerais
              </h2>
              {renderSettingsForm("general")}
            </TabsContent>

            <TabsContent value="contact">
              <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
                Informações de Contato
              </h2>
              {renderSettingsForm("contact")}
            </TabsContent>

            <TabsContent value="social">
              <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
                Redes Sociais
              </h2>
              {renderSettingsForm("social")}
            </TabsContent>

            <TabsContent value="seo">
              <h2 className="text-2xl font-heading font-bold text-navy-deep mb-6">
                Otimização para Motores de Busca
              </h2>
              {renderSettingsForm("seo")}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminSettings;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CookiePreferences } from "@/hooks/useCookies";
import { Cookie, Settings, Info } from "lucide-react";

interface CookieSettingsProps {
  preferences: CookiePreferences;
  onSave: (preferences: CookiePreferences) => void;
  onAcceptAll: () => void;
  onDeclineAll: () => void;
}

const CookieSettings = ({ preferences, onSave, onAcceptAll, onDeclineAll }: CookieSettingsProps) => {
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(localPreferences);
    setIsOpen(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookiePreferences,
      title: 'Cookies Necessários',
      description: 'Essenciais para o funcionamento básico do site. Não podem ser desabilitados.',
      required: true,
      examples: ['Sessão de usuário', 'Preferências de idioma', 'Segurança']
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      title: 'Cookies de Análise',
      description: 'Nos ajudam a entender como os visitantes interagem com o site.',
      required: false,
      examples: ['Google Analytics', 'Métricas de performance', 'Estatísticas de uso']
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      title: 'Cookies de Marketing',
      description: 'Utilizados para personalizar anúncios e medir a eficácia das campanhas.',
      required: false,
      examples: ['Facebook Pixel', 'Google Ads', 'Remarketing']
    },
    {
      key: 'preferences' as keyof CookiePreferences,
      title: 'Cookies de Preferências',
      description: 'Lembram suas escolhas para personalizar sua experiência.',
      required: false,
      examples: ['Tema do site', 'Configurações de notificação', 'Preferências de layout']
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-gray-600 border-gray-300 hover:bg-gray-50">
          <Settings className="h-4 w-4 mr-2" />
          Configurações
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-blue-medium" />
            Configurações de Cookies
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-medium mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-dark mb-1">Sobre os Cookies</h3>
                <p className="text-sm text-blue-700">
                  Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
                  Você pode escolher quais tipos de cookies aceitar.
                </p>
              </div>
            </div>
          </div>

          {cookieCategories.map((category) => (
            <div key={category.key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-navy-deep">{category.title}</h3>
                    {category.required && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="text-xs text-gray-500">
                    <strong>Exemplos:</strong> {category.examples.join(', ')}
                  </div>
                </div>
                <Switch
                  checked={localPreferences[category.key]}
                  onCheckedChange={(checked) => handlePreferenceChange(category.key, checked)}
                  disabled={category.required}
                  className="flex-shrink-0"
                />
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onDeclineAll}
              className="flex-1"
            >
              Recusar Todos
            </Button>
            <Button
              onClick={onAcceptAll}
              className="flex-1"
            >
              Aceitar Todos
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-blue-medium hover:bg-blue-dark"
            >
              Salvar Preferências
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieSettings;

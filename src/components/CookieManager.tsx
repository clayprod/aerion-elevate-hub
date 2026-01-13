import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCookies } from "@/hooks/useCookies";
import { Cookie, Settings, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CookieManager = () => {
  const { consent, resetConsent, isAllowed } = useCookies();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetCookies = async () => {
    setIsResetting(true);
    try {
      resetConsent();
      toast({
        title: "Configurações de cookies resetadas",
        description: "Suas preferências de cookies foram removidas. A página será recarregada.",
      });
      
      // Reload page after a short delay to show the cookie banner again
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        title: "Erro ao resetar cookies",
        description: "Ocorreu um erro ao resetar suas configurações.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  if (!consent) {
    return null;
  }

  const getStatusText = () => {
    if (consent.accepted) {
      const enabledCount = Object.values(consent.preferences).filter(Boolean).length;
      return `${enabledCount} de 4 categorias ativadas`;
    }
    return "Cookies recusados";
  };

  const getStatusColor = () => {
    if (consent.accepted) {
      return "text-green-600";
    }
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Cookie className="h-4 w-4 text-gray-500" />
        <span className="text-gray-600">Cookies:</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetCookies}
          disabled={isResetting}
          className="text-gray-500 hover:text-gray-700 p-1 h-6 w-6"
          title="Resetar configurações de cookies"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CookieManager;

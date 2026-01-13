import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useCookies, CookiePreferences } from "@/hooks/useCookies";
import CookieSettings from "./CookieSettings";

const CookieConsent = () => {
  const { consent, isLoading, saveConsent, declineAll, acceptAll, hasConsent } = useCookies();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasConsent) {
      setShowBanner(true);
    }
  }, [isLoading, hasConsent]);

  const handleAccept = () => {
    acceptAll();
    setShowBanner(false);
  };

  const handleDecline = () => {
    declineAll();
    setShowBanner(false);
  };

  const handleSavePreferences = (preferences: CookiePreferences) => {
    saveConsent(preferences);
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (isLoading || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container-custom py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-blue-medium/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Cookie className="h-5 w-5 text-blue-medium" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-navy-deep mb-1">
                Utilizamos cookies
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Utilizamos cookies para melhorar sua experiência em nosso site, analisar o tráfego e personalizar conteúdo. 
                Você pode escolher quais tipos de cookies aceitar.{" "}
                <Link 
                  to="/politica-privacidade" 
                  className="text-blue-medium hover:text-blue-dark underline font-medium"
                >
                  Saiba mais
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <CookieSettings
              preferences={consent?.preferences || {
                necessary: true,
                analytics: false,
                marketing: false,
                preferences: false,
              }}
              onSave={handleSavePreferences}
              onAcceptAll={handleAccept}
              onDeclineAll={handleDecline}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Recusar
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-blue-medium hover:bg-blue-dark text-white font-medium"
            >
              Aceitar Todos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

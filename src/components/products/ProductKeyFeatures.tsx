import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Zap, Camera, Shield, Battery, Wifi } from 'lucide-react';

interface ProductKeyFeaturesProps {
  features: string[];
  title: string;
}

export const ProductKeyFeatures: React.FC<ProductKeyFeaturesProps> = ({
  features,
  title
}) => {
  const getFeatureIcon = (feature: string, index: number) => {
    const lowerFeature = feature.toLowerCase();
    
    if (lowerFeature.includes('câmera') || lowerFeature.includes('térmica') || lowerFeature.includes('zoom')) {
      return <Camera className="w-6 h-6 text-blue-medium" />;
    }
    if (lowerFeature.includes('tempo') || lowerFeature.includes('voo') || lowerFeature.includes('bateria')) {
      return <Battery className="w-6 h-6 text-green-success" />;
    }
    if (lowerFeature.includes('alcance') || lowerFeature.includes('distância') || lowerFeature.includes('km')) {
      return <Wifi className="w-6 h-6 text-blue-bright" />;
    }
    if (lowerFeature.includes('resistente') || lowerFeature.includes('proteção') || lowerFeature.includes('ip')) {
      return <Shield className="w-6 h-6 text-orange-500" />;
    }
    if (lowerFeature.includes('ai') || lowerFeature.includes('inteligência') || lowerFeature.includes('reconhecimento')) {
      return <Zap className="w-6 h-6 text-purple-500" />;
    }
    
    return <CheckCircle className="w-6 h-6 text-blue-medium" />;
  };

  const copyAllFeatures = () => {
    const featuresText = features.map((feature, index) => `${index + 1}. ${feature}`).join('\n');
    navigator.clipboard.writeText(featuresText);
    // You could add a toast notification here
  };

  return (
    <section id="key-features" className="py-12 bg-gray-light/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-navy-deep mb-4">
            Características Principais
          </h2>
          <p className="text-lg text-gray-dark max-w-3xl mx-auto">
            Descubra as principais funcionalidades e vantagens do {title} que o tornam ideal para suas operações profissionais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getFeatureIcon(feature, index)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-dark leading-relaxed group-hover:text-navy-deep transition-colors">
                    {feature}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button
            onClick={copyAllFeatures}
            variant="outline"
            className="border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar informações
          </Button>
        </div>
      </div>
    </section>
  );
};

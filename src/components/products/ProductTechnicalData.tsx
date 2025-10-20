import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  DollarSign, 
  Settings, 
  Package, 
  Wrench, 
  Gift,
  Copy
} from 'lucide-react';

interface TechnicalDataProps {
  technicalData: {
    cadastral?: Record<string, string>;
    commercial?: Record<string, string>;
    logistics?: {
      dimensions: string;
      weight: string;
      cubagem?: string;
      packaging?: string;
    };
  };
  specs: Record<string, string>;
  components: string[];
  accessoriesIncluded: string[];
  title: string;
}

export const ProductTechnicalData: React.FC<TechnicalDataProps> = ({
  technicalData,
  specs,
  components,
  accessoriesIncluded,
  title
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderDataCard = (title: string, data: Record<string, string>, icon: React.ReactNode, isLarge = false) => (
    <Card className={`p-6 bg-gray-50 ${isLarge ? 'md:col-span-2' : ''}`}>
      <h3 className="text-lg font-bold text-navy-deep mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value], index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-medium text-gray-dark">{key}:</span>
            <div className="flex items-center gap-2">
              <span className="text-navy-deep font-semibold">{value}</span>
              <button
                onClick={() => copyToClipboard(value)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copiar valor"
              >
                <Copy className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderLogisticsCard = () => (
    <Card className="p-6 bg-gray-50">
      <h3 className="text-lg font-bold text-navy-deep mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" />
        DADOS LOGÍSTICOS
      </h3>
      <div className="space-y-3">
        {technicalData.logistics && (
          <>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-dark">Dimensões do Produto (C x L x A) (cm):</span>
              <span className="text-navy-deep font-semibold">{technicalData.logistics.dimensions}</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-dark">Peso Líquido (kg):</span>
              <span className="text-navy-deep font-semibold">{technicalData.logistics.weight}</span>
            </div>
            
            {technicalData.logistics.cubagem && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-dark">Cubagem (m³):</span>
                <span className="text-navy-deep font-semibold">{technicalData.logistics.cubagem}</span>
              </div>
            )}
            
            {technicalData.logistics.packaging && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-dark">Embalagem:</span>
                <span className="text-navy-deep font-semibold">{technicalData.logistics.packaging}</span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );

  const renderSpecsCard = () => (
    <Card className="p-6 bg-gray-50">
      <h3 className="text-lg font-bold text-navy-deep mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        DADOS TÉCNICOS
      </h3>
      <div className="space-y-3">
        {Object.entries(specs).map(([key, value], index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-medium text-gray-dark">{key}:</span>
            <div className="flex items-center gap-2">
              <span className="text-navy-deep font-semibold">{value}</span>
              <button
                onClick={() => copyToClipboard(value)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Copiar valor"
              >
                <Copy className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderAccessoriesCard = () => {
    const allAccessories = [...(accessoriesIncluded || []), ...(components || [])];
    
    return (
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-bold text-navy-deep mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5" />
          ACESSÓRIOS
        </h3>
        <p className="text-sm text-gray-600 mb-4">Itens inclusos no pacote</p>
        <div className="space-y-2">
          {allAccessories.map((item, index) => (
            <div key={index} className="flex items-center gap-2 py-2 border-b border-gray-200 last:border-b-0">
              <span className="text-blue-medium font-bold">•</span>
              <span className="text-gray-dark">{item}</span>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-navy-deep mb-6">
        Dados Técnicos
      </h2>
      
      {/* Dados Técnicos - Prioridade (área maior) */}
      <div className="mb-6">
        {renderSpecsCard()}
      </div>
      
      {/* Dados Comerciais e Acessórios lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicalData.commercial && renderDataCard("DADOS COMERCIAIS", technicalData.commercial, <DollarSign className="w-5 h-5" />)}
        {renderAccessoriesCard()}
      </div>
    </div>
  );
};

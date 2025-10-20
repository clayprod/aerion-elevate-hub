import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

  const renderDataTable = (data: Record<string, string>, icon: React.ReactNode) => (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value], index) => (
        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium text-gray-dark">{key}:</span>
          </div>
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
  );

  const renderLogisticsData = () => (
    <div className="space-y-4">
      {technicalData.logistics && (
        <>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-blue-medium" />
              <span className="font-medium text-gray-dark">Dimensões:</span>
            </div>
            <span className="text-navy-deep font-semibold">{technicalData.logistics.dimensions}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-blue-medium" />
              <span className="font-medium text-gray-dark">Peso:</span>
            </div>
            <span className="text-navy-deep font-semibold">{technicalData.logistics.weight}</span>
          </div>
          
          {technicalData.logistics.cubagem && (
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-medium" />
                <span className="font-medium text-gray-dark">Cubagem:</span>
              </div>
              <span className="text-navy-deep font-semibold">{technicalData.logistics.cubagem}</span>
            </div>
          )}
          
          {technicalData.logistics.packaging && (
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-blue-medium" />
                <span className="font-medium text-gray-dark">Embalagem:</span>
              </div>
              <span className="text-navy-deep font-semibold">{technicalData.logistics.packaging}</span>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderSpecs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(specs).map(([key, value], index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-blue-medium" />
              <span className="font-medium text-gray-dark">{key}:</span>
            </div>
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
        </Card>
      ))}
    </div>
  );

  const renderList = (items: string[], icon: React.ReactNode, emptyMessage: string) => (
    <div className="space-y-3">
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {icon}
            <span className="text-gray-dark">{item}</span>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <section id="technical-data" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-navy-deep">
          Dados Técnicos
        </h2>
        
        <Tabs defaultValue="technical" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Técnicos
            </TabsTrigger>
            {technicalData.cadastral && (
              <TabsTrigger value="cadastral" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Cadastrais
              </TabsTrigger>
            )}
            {technicalData.commercial && (
              <TabsTrigger value="commercial" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Comerciais
              </TabsTrigger>
            )}
            {technicalData.logistics && (
              <TabsTrigger value="logistics" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Logísticos
              </TabsTrigger>
            )}
            <TabsTrigger value="accessories" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Acessórios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="technical">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-navy-deep mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Especificações Técnicas
              </h3>
              {renderSpecs()}
            </Card>
          </TabsContent>
          
          {technicalData.cadastral && (
            <TabsContent value="cadastral">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-navy-deep mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Dados Cadastrais
                </h3>
                {renderDataTable(technicalData.cadastral, <FileText className="w-4 h-4 text-blue-medium" />)}
              </Card>
            </TabsContent>
          )}
          
          {technicalData.commercial && (
            <TabsContent value="commercial">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-navy-deep mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Dados Comerciais
                </h3>
                {renderDataTable(technicalData.commercial, <DollarSign className="w-4 h-4 text-green-success" />)}
              </Card>
            </TabsContent>
          )}
          
          {technicalData.logistics && (
            <TabsContent value="logistics">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-navy-deep mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Dados Logísticos
                </h3>
                {renderLogisticsData()}
              </Card>
            </TabsContent>
          )}
          
          <TabsContent value="accessories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-navy-deep mb-6 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Componentes
                </h3>
                {renderList(components, <Wrench className="w-4 h-4 text-blue-medium" />, "Nenhum componente listado")}
              </Card>
              
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-navy-deep mb-6 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Acessórios Inclusos
                </h3>
                {renderList(accessoriesIncluded, <Gift className="w-4 h-4 text-green-success" />, "Nenhum acessório incluso")}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

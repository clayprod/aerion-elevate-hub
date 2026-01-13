import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Package, Hash } from 'lucide-react';

interface ProductMainInfoProps {
  name: string;
  category: string;
  productCodes: {
    sku: string;
    ean?: string;
    ncm?: string;
  };
  description: string;
}

export const ProductMainInfo: React.FC<ProductMainInfoProps> = ({
  name,
  category,
  productCodes,
  description
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <section id="main-info" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Product Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-blue-medium text-white">
                {category}
              </Badge>
              <span className="text-sm text-gray-dark">Drone Profissional</span>
            </div>
            
            <h1 className="text-4xl font-bold text-navy-deep mb-4">
              {name}
            </h1>
            
            <p className="text-lg text-gray-dark mb-6 leading-relaxed">
              {description}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-gray-dark">
              <Package className="w-4 h-4" />
              <span>Produto Profissional Autel Robotics</span>
            </div>
          </div>
          
          {/* Product Codes */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gray-light/30">
              <h3 className="text-xl font-semibold text-navy-deep mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Códigos do Produto
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-dark">SKU:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                      {productCodes.sku}
                    </span>
                    <button
                      onClick={() => copyToClipboard(productCodes.sku)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copiar SKU"
                    >
                      <Copy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {productCodes.ncm && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-dark">NCM:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                        {productCodes.ncm}
                      </span>
                      <button
                        onClick={() => copyToClipboard(productCodes.ncm!)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        title="Copiar NCM"
                      >
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => copyToClipboard(`${name} - ${productCodes.sku}`)}
                  className="w-full text-sm text-blue-medium hover:text-blue-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar informações
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

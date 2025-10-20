import React from 'react';
import { Card } from '@/components/ui/card';

interface ProductDescriptionProps {
  title: string;
  description: string;
  keyFeatures: string[];
  productCodes: {
    sku: string;
    ean?: string;
    ncm?: string;
  };
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  title,
  description,
  keyFeatures,
  productCodes
}) => {
  return (
    <div className="space-y-8">
      {/* Product Title and Codes */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-navy-deep mb-4">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-dark mb-6">
          <span className="font-mono bg-gray-100 px-3 py-1 rounded">
            SKU: {productCodes.sku}
          </span>
          {productCodes.ean && (
            <span className="font-mono bg-gray-100 px-3 py-1 rounded">
              EAN: {productCodes.ean}
            </span>
          )}
        </div>
      </div>

      {/* Main Description */}
      <Card className="p-8 bg-gray-50">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-dark leading-relaxed mb-6">
            {description}
          </p>
          
          {/* Key Features List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-navy-deep mb-4">
              Características Principais:
            </h3>
            <ul className="space-y-3">
              {keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-blue-medium font-bold mt-1">→</span>
                  <span className="text-gray-dark">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Product Slogan */}
      <div className="text-center">
        <p className="text-xl font-bold text-blue-medium italic">
          Aerion tem que ser da Aerion!
        </p>
      </div>
    </div>
  );
};

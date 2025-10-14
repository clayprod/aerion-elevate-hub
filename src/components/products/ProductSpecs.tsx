import React from 'react';
import { Card } from '@/components/ui/card';

interface ProductSpecsProps {
  specs: Record<string, string>;
  title: string;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specs, title }) => {
  const specEntries = Object.entries(specs);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-navy-deep">
          Especificações Técnicas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specEntries.map(([key, value], index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-navy-deep mb-2">
                  {key}
                </h3>
                <p className="text-2xl font-bold text-blue-medium">
                  {value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

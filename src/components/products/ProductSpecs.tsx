import React from 'react';
import { Card } from '@/components/ui/card';

interface ProductSpecsProps {
  specs: Record<string, string>;
  title: string;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ specs, title }) => {
  const specEntries = Object.entries(specs);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Especificações Técnicas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specEntries.map(([key, value], index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {key}
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {value}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Especificações Completas
            </h3>
            <p className="text-gray-600 mb-6">
              Para especificações técnicas detalhadas, consulte o manual do usuário ou entre em contato conosco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Baixar Manual
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Solicitar Informações
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

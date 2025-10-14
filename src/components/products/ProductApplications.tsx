import React from 'react';
import { Card } from '@/components/ui/card';

interface Application {
  title: string;
  description: string;
  image: string;
}

interface ProductApplicationsProps {
  applications: Application[];
  title: string;
}

export const ProductApplications: React.FC<ProductApplicationsProps> = ({ applications, title }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-navy-deep mb-4">
            Aplicações e Casos de Uso
          </h2>
          <p className="text-xl text-gray-dark max-w-3xl mx-auto">
            Descubra como o {title} pode transformar suas operações em diferentes setores e aplicações.
          </p>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${applications.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {applications.map((application, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={application.image}
                  alt={application.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {application.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-dark leading-relaxed">
                  {application.description}
                </p>
                <button className="mt-4 text-blue-medium hover:text-blue-dark font-semibold transition-colors">
                  Saiba mais →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

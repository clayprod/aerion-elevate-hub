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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Aplicações e Casos de Uso
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra como o {title} pode transformar suas operações em diferentes setores e aplicações.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <p className="text-gray-600 leading-relaxed">
                  {application.description}
                </p>
                <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Saiba mais →
                </button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Sua Aplicação Não Está Listada?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nossa equipe de especialistas pode ajudar a identificar como o {title} 
              pode ser adaptado para suas necessidades específicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                Consultoria Gratuita
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                Agendar Demonstração
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DownloadItem {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'xlsx' | 'doc';
  size?: string;
}

interface ProductDownloadsProps {
  downloads: DownloadItem[];
  title: string;
}

export const ProductDownloads: React.FC<ProductDownloadsProps> = ({ downloads, title }) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'xlsx':
        return '📊';
      case 'doc':
        return '📝';
      default:
        return '📄';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'xlsx':
        return 'bg-green-100 text-green-800';
      case 'doc':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Downloads e Documentos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloads.map((download, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">
                  {getFileIcon(download.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {download.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {download.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getFileTypeColor(download.type)}`}>
                      {download.type.toUpperCase()}
                    </span>
                    {download.size && (
                      <span className="text-xs text-gray-500">
                        {download.size}
                      </span>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => window.open(download.url, '_blank')}
                  >
                    Baixar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Contact Section */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-white">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Precisa de mais informações?
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe técnica está pronta para ajudar com especificações detalhadas, 
              configurações personalizadas e suporte especializado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Falar com Especialista
              </Button>
              <Button variant="outline">
                Solicitar Demonstração
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

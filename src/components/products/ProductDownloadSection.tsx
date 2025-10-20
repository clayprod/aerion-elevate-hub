import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Presentation } from 'lucide-react';

interface DownloadItem {
  title: string;
  description: string;
  url: string;
  type: 'pdf' | 'xlsx' | 'doc';
  size?: string;
}

interface ProductDownloadSectionProps {
  downloads: DownloadItem[];
  title: string;
}

export const ProductDownloadSection: React.FC<ProductDownloadSectionProps> = ({
  downloads,
  title
}) => {
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Separate downloads by type
  const presentations = downloads.filter(d => d.type === 'pdf' && d.title.toLowerCase().includes('brochure'));
  const manuals = downloads.filter(d => d.type === 'pdf' && d.title.toLowerCase().includes('manual'));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-navy-deep mb-6">
        Material de Apoio para Download
      </h2>
      
      {/* Main Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {presentations.length > 0 && (
          <Button
            onClick={() => handleDownload(presentations[0].url, presentations[0].title)}
            className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-4 text-lg"
          >
            <Presentation className="w-5 h-5 mr-2" />
            Apresentação
          </Button>
        )}
        
        {manuals.length > 0 && (
          <Button
            onClick={() => handleDownload(manuals[0].url, manuals[0].title)}
            className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-4 text-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Manual
          </Button>
        )}
      </div>
      
      {/* Additional Downloads */}
      {downloads.length > 2 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-navy-deep mb-4">
            Documentos Adicionais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloads.slice(2).map((download, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {download.type === 'pdf' ? '📄' : download.type === 'xlsx' ? '📊' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-navy-deep mb-1">
                      {download.title}
                    </h4>
                    <p className="text-sm text-gray-dark mb-3">
                      {download.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {download.type.toUpperCase()}
                        {download.size && ` • ${download.size}`}
                      </span>
                      <Button
                        onClick={() => handleDownload(download.url, download.title)}
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

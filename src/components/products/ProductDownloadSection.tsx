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

  // Get main downloads
  const presentations = downloads.filter(d => d.type === 'pdf' && d.title.toLowerCase().includes('brochure'));
  const datasheets = downloads.filter(d => d.type === 'pdf' && (d.title.toLowerCase().includes('datasheet') || d.title.toLowerCase().includes('especificação')));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-navy-deep mb-6">
        Material de Apoio para Download
      </h2>
      
      {/* Main Download Buttons - Only 2 */}
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
        
        {datasheets.length > 0 && (
          <Button
            onClick={() => handleDownload(datasheets[0].url, datasheets[0].title)}
            className="bg-gray-800 text-white hover:bg-gray-700 px-8 py-4 text-lg"
          >
            <FileText className="w-5 h-5 mr-2" />
            Datasheet
          </Button>
        )}
      </div>
    </div>
  );
};

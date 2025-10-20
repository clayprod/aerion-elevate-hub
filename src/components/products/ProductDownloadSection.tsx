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
  const datasheets = downloads.filter(d => d.type === 'pdf' && (d.title.toLowerCase().includes('brochure') || d.title.toLowerCase().includes('datasheet') || d.title.toLowerCase().includes('especificação')));

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-navy-deep flex items-center gap-2">
        <Download className="w-5 h-5" />
        MATERIAL DE APOIO
      </h3>
      <p className="text-sm text-gray-600 mb-4">Downloads disponíveis</p>
      
      {/* Download Buttons */}
      <div className="space-y-3">
        {datasheets.length > 0 && (
          <Button
            onClick={() => handleDownload(datasheets[0].url, datasheets[0].title)}
            className="w-full bg-blue-medium text-white hover:bg-blue-dark justify-start"
          >
            <FileText className="w-4 h-4 mr-2" />
            Datasheet
          </Button>
        )}
      </div>
    </div>
  );
};

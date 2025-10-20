import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGallery {
  product: string[];
  lifestyle: string[];
  details: string[];
}

interface ProductPhotoGalleryProps {
  photoGallery: PhotoGallery;
  title: string;
}

export const ProductPhotoGallery: React.FC<ProductPhotoGalleryProps> = ({
  photoGallery,
  title
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const allImages = [
    ...photoGallery.product,
    ...photoGallery.lifestyle,
    ...photoGallery.details
  ];

  const openLightbox = (imageSrc: string) => {
    const index = allImages.indexOf(imageSrc);
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    let newIndex = selectedImageIndex;
    
    if (direction === 'prev') {
      newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1;
    } else {
      newIndex = selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0;
    }
    
    setSelectedImageIndex(newIndex);
    setSelectedImage(allImages[newIndex]);
  };

  const downloadImage = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${title.replace(/\s+/g, '_')}_${imageSrc.split('/').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    allImages.forEach((imageSrc, index) => {
      setTimeout(() => {
        downloadImage(imageSrc);
      }, index * 500); // Delay between downloads
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-navy-deep mb-6">
        Galeria de Fotos
      </h2>
      
      {/* Separator */}
      <div className="border-b border-dashed border-gray-300"></div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-navy-deep mb-4">
          Fotos do Produto
        </h3>
        
        {/* Main Image and Thumbnails Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Image */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div 
                className="relative aspect-video bg-gray-100 cursor-pointer group"
                onClick={() => openLightbox(allImages[0])}
              >
                <img
                  src={allImages[0]}
                  alt={`${title} - Vista principal`}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </Card>
          </div>
          
          {/* Thumbnails */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-3">
              {allImages.slice(1, 9).map((imageSrc, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div 
                    className="relative aspect-square bg-gray-100"
                    onClick={() => openLightbox(imageSrc)}
                  >
                    <img
                      src={imageSrc}
                      alt={`${title} - ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Download Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={downloadAllImages}
            variant="outline"
            className="border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar em alta qualidade
          </Button>
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <img
              src={selectedImage}
              alt={`${title} - ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Close and download buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => downloadImage(selectedImage)}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                title="Baixar imagem"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={closeLightbox}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              {selectedImageIndex + 1} de {allImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState('product');

  const allImages = [
    ...photoGallery.product.map(img => ({ src: img, category: 'product' })),
    ...photoGallery.lifestyle.map(img => ({ src: img, category: 'lifestyle' })),
    ...photoGallery.details.map(img => ({ src: img, category: 'details' }))
  ];

  const openLightbox = (imageSrc: string, category: string) => {
    const categoryImages = photoGallery[category as keyof PhotoGallery];
    const index = categoryImages.indexOf(imageSrc);
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
    setActiveTab(category);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentCategoryImages = photoGallery[activeTab as keyof PhotoGallery];
    let newIndex = selectedImageIndex;
    
    if (direction === 'prev') {
      newIndex = selectedImageIndex > 0 ? selectedImageIndex - 1 : currentCategoryImages.length - 1;
    } else {
      newIndex = selectedImageIndex < currentCategoryImages.length - 1 ? selectedImageIndex + 1 : 0;
    }
    
    setSelectedImageIndex(newIndex);
    setSelectedImage(currentCategoryImages[newIndex]);
  };

  const downloadImage = (imageSrc: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${title.replace(/\s+/g, '_')}_${imageSrc.split('/').pop()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = (category: keyof PhotoGallery) => {
    const images = photoGallery[category];
    images.forEach((imageSrc, index) => {
      setTimeout(() => {
        downloadImage(imageSrc);
      }, index * 500); // Delay between downloads
    });
  };

  const renderImageGrid = (images: string[], category: string) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((imageSrc, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
          <div 
            className="relative aspect-square bg-gray-100"
            onClick={() => openLightbox(imageSrc, category)}
          >
            <img
              src={imageSrc}
              alt={`${title} - ${category} ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'product': return 'Fotos do Produto';
      case 'lifestyle': return 'Fotos de Aplicação';
      case 'details': return 'Detalhes Técnicos';
      default: return 'Fotos';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'product': return 'Imagens detalhadas do drone em diferentes ângulos';
      case 'lifestyle': return 'Fotos do drone em ação em diferentes aplicações';
      case 'details': return 'Detalhes técnicos e componentes do drone';
      default: return 'Galeria de imagens';
    }
  };

  return (
    <section id="photo-gallery" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-navy-deep">
          Galeria de Fotos
        </h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="product" className="flex items-center gap-2">
              <span>Produto</span>
              <span className="bg-blue-medium text-white text-xs px-2 py-1 rounded-full">
                {photoGallery.product.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="flex items-center gap-2">
              <span>Aplicação</span>
              <span className="bg-green-success text-white text-xs px-2 py-1 rounded-full">
                {photoGallery.lifestyle.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <span>Detalhes</span>
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {photoGallery.details.length}
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="product">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-navy-deep mb-2">
                {getCategoryTitle('product')}
              </h3>
              <p className="text-gray-dark mb-4">
                {getCategoryDescription('product')}
              </p>
              {photoGallery.product.length > 0 && (
                <Button
                  onClick={() => downloadAllImages('product')}
                  variant="outline"
                  className="mb-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar em alta qualidade
                </Button>
              )}
            </div>
            {renderImageGrid(photoGallery.product, 'product')}
          </TabsContent>
          
          <TabsContent value="lifestyle">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-navy-deep mb-2">
                {getCategoryTitle('lifestyle')}
              </h3>
              <p className="text-gray-dark mb-4">
                {getCategoryDescription('lifestyle')}
              </p>
              {photoGallery.lifestyle.length > 0 && (
                <Button
                  onClick={() => downloadAllImages('lifestyle')}
                  variant="outline"
                  className="mb-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar em alta qualidade
                </Button>
              )}
            </div>
            {renderImageGrid(photoGallery.lifestyle, 'lifestyle')}
          </TabsContent>
          
          <TabsContent value="details">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-navy-deep mb-2">
                {getCategoryTitle('details')}
              </h3>
              <p className="text-gray-dark mb-4">
                {getCategoryDescription('details')}
              </p>
              {photoGallery.details.length > 0 && (
                <Button
                  onClick={() => downloadAllImages('details')}
                  variant="outline"
                  className="mb-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar em alta qualidade
                </Button>
              )}
            </div>
            {renderImageGrid(photoGallery.details, 'details')}
          </TabsContent>
        </Tabs>
        
        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-full">
              <img
                src={selectedImage}
                alt={`${title} - ${activeTab}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation buttons */}
              {photoGallery[activeTab as keyof PhotoGallery].length > 1 && (
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
                {selectedImageIndex + 1} de {photoGallery[activeTab as keyof PhotoGallery].length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

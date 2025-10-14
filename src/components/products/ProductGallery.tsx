import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useProductImages } from '@/hooks/useProductImages';

interface ProductGalleryProps {
  imagePath: string; // Base path to numbered images (1.png, 2.png, etc.)
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ imagePath, title }) => {
  const { images, loading } = useProductImages(imagePath);
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">Carregando galeria...</div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Don't show gallery if no images available
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Galeria de Imagens
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <img
                src={images[selectedImage].src}
                alt={`${title} - ${images[selectedImage].label}`}
                className="w-full h-96 object-contain bg-white p-8 hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 bg-gray-100 text-center border-t">
                <p className="font-semibold text-gray-900">
                  {images[selectedImage].label}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Vista {images[selectedImage].viewNumber} de {images.length}
                </p>
              </div>
            </Card>
          </div>
          
          {/* Thumbnail Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Visualizações Disponíveis
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImage === index
                      ? 'ring-2 ring-blue-600 scale-105'
                      : 'hover:scale-105'
                  }`}
                  title={image.label}
                >
                  <img
                    src={image.src}
                    alt={image.label}
                    className="w-full h-24 object-contain bg-white p-2"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-20" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2 truncate">
                    {image.label}
                  </div>
                  {image.viewNumber === 8 && (
                    <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      ✈️
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Destaque para Modo Compactado */}
            {images.some(img => img.viewNumber === 8) && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-sm font-semibold text-blue-900">
                  ✈️ Portátil e Compacto
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Veja o drone em modo compactado para transporte
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Image Counter */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

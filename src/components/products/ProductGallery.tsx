import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);

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
                src={images[selectedImage]}
                alt={`${title} - Imagem ${selectedImage + 1}`}
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </Card>
          </div>
          
          {/* Thumbnail Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Visualizações
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
                >
                  <img
                    src={image}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-20" />
                  )}
                </button>
              ))}
            </div>
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

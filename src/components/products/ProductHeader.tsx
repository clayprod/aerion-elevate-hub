import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Download } from 'lucide-react';

interface ProductHeaderProps {
  name: string;
  description: string;
  productCodes: {
    sku: string;
    ean?: string;
    ncm?: string;
  };
  keyFeatures: string[];
  images: string[];
  category: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  description,
  productCodes,
  keyFeatures,
  images,
  category
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={`${name} - Vista ${selectedImage + 1}`}
                  className="w-full h-full object-contain p-8"
                />
                <div className="absolute top-4 right-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => copyToClipboard(images[selectedImage])}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 8).map((image, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-medium scale-105' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={image}
                      alt={`${name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-blue-medium bg-opacity-20" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Product Information */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-blue-medium text-white">
                {category}
              </Badge>
              <span className="text-sm text-gray-dark">Drone Profissional</span>
            </div>
            
            {/* Product Name */}
            <h1 className="text-4xl font-bold text-navy-deep">
              {name}
            </h1>
            
            {/* Product Codes */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-dark">SKU:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {productCodes.sku}
                </span>
                <button
                  onClick={() => copyToClipboard(productCodes.sku)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Copiar SKU"
                >
                  <Copy className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              
              {productCodes.ean && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-dark">EAN:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {productCodes.ean}
                  </span>
                  <button
                    onClick={() => copyToClipboard(productCodes.ean!)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copiar EAN"
                  >
                    <Copy className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Product Description */}
            <p className="text-lg text-gray-dark leading-relaxed">
              {description}
            </p>
            
            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-navy-deep">
                Características Principais:
              </h3>
              <ul className="space-y-2">
                {keyFeatures.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-medium font-bold mt-1">→</span>
                    <span className="text-gray-dark">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => copyToClipboard(`${name}\n\n${description}\n\nCaracterísticas:\n${keyFeatures.join('\n')}`)}
                className="bg-green-success hover:bg-green-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar informações
              </Button>
              <Button variant="outline" className="border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white">
                <Eye className="w-4 h-4 mr-2" />
                Ver especificações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

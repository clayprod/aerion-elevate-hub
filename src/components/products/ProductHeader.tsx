import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Download } from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  keyFeatures: string[];
}

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
  variants?: ProductVariant[];
  selectedVariant?: string;
  onVariantChange?: (variantId: string) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  description,
  productCodes,
  keyFeatures,
  images,
  category,
  variants = [],
  selectedVariant,
  onVariantChange
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name.replace(/\s+/g, '_')}_image_${selectedImage + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentVariant = variants.find(v => v.id === selectedVariant);
  const displayFeatures = currentVariant?.keyFeatures || keyFeatures;

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex gap-4">
            {/* Thumbnail Images - Vertical Scroll */}
            <div className="flex-shrink-0 w-16 space-y-2 overflow-y-auto" style={{ maxHeight: '600px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {images.slice(0, 8).map((image, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 p-1 ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-bright ring-offset-0' 
                      : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${name} - Miniatura ${index + 1}`}
                    className="w-full h-full object-contain bg-white p-1 rounded-md"
                  />
                </div>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1">
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
                      onClick={() => downloadImage(images[selectedImage])}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Product Information */}
          <div className="space-y-6">
            
            {/* Product Name */}
            <h1 className="text-4xl font-bold text-navy-deep">
              {name}
            </h1>
            
            {/* Product Codes */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {productCodes.ean && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-dark">GTIN:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {productCodes.ean}
                  </span>
                  <button
                    onClick={() => copyToClipboard(productCodes.ean!)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copiar GTIN"
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
            
            {/* Brand */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-dark">Marca:</span>
              <span className="font-semibold text-navy-deep">Autel</span>
            </div>
            
            {/* Variant Selector */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-navy-deep">
                  Modelo:
                </h3>
                <div className="flex gap-2">
                  {variants.map((variant) => (
                    <Button
                      key={variant.id}
                      onClick={() => onVariantChange?.(variant.id)}
                      variant={selectedVariant === variant.id ? "default" : "outline"}
                      className={`${
                        selectedVariant === variant.id
                          ? 'bg-blue-medium text-white'
                          : 'border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white'
                      }`}
                    >
                      {variant.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-navy-deep">
                Características Principais:
              </h3>
              <ul className="space-y-2">
                {displayFeatures.slice(0, 5).map((feature, index) => (
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
                onClick={() => {
                  const element = document.getElementById('technical-data');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                size="lg"
                className="bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold text-base px-8 py-3 shadow-glow group rounded-xl transition-all duration-300 hover:shadow-xl"
              >
                <Eye className="w-5 h-5 mr-2" />
                Ver especificações
              </Button>
              <Button
                onClick={() => copyToClipboard(`${name}\n\n${description}\n\nCaracterísticas:\n${displayFeatures.join('\n')}`)}
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-gray-300 text-navy-deep hover:bg-gray-50 font-heading font-semibold text-base px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copiar informações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

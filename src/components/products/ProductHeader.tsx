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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
            <div className="flex-shrink-0 w-20 space-y-2 overflow-y-auto max-h-[600px]">
              {images.slice(0, 8).map((image, index) => (
                <Card 
                  key={index} 
                  className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-2 ring-blue-bright' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="relative w-20 h-20 bg-gray-100">
                    <img
                      src={image}
                      alt={`${name} - Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
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
                      onClick={() => copyToClipboard(images[selectedImage])}
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
                onClick={() => copyToClipboard(`${name}\n\n${description}\n\nCaracterísticas:\n${displayFeatures.join('\n')}`)}
                className="bg-green-success hover:bg-green-600"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar informações
              </Button>
              <Button 
                onClick={() => {
                  const element = document.getElementById('technical-data');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-blue-bright text-black hover:bg-blue-bright/90"
              >
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

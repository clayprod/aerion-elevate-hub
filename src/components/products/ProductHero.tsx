import React, { useState, useEffect } from 'react';
import { YouTubeVideoBackground } from '../YouTubeVideoBackground';
import { getProductFamilyBySlug } from '@/data/products';

interface ProductHeroProps {
  title: string;
  description: string;
  youtubeVideoId?: string;
  fallbackImage?: string;
  variant?: string;
  onVariantChange?: (variant: string) => void;
  productSlug?: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  title,
  description,
  youtubeVideoId,
  fallbackImage = "/images/lifestyle/autel-alpha-public-safety-1.jpg",
  variant,
  onVariantChange,
  productSlug
}) => {
  const [showProductImage, setShowProductImage] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);

  useEffect(() => {
    // Get product image after component mounts
    if (productSlug) {
      const productFamily = getProductFamilyBySlug(productSlug);
      if (productFamily) {
        const currentVariant = productFamily.variants.find(v => v.id === variant) || productFamily.variants[0];
        const imagePath = `${currentVariant.imagePath}/1.png`;
        setProductImage(imagePath);
      }
    }

    // Show product image after a delay
    const timer = setTimeout(() => {
      setShowProductImage(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [productSlug, variant]);
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* YouTube Video Background with Fallback */}
      {youtubeVideoId ? (
        <YouTubeVideoBackground
          videoId={youtubeVideoId}
          fallbackImage={fallbackImage}
          className="object-cover"
        />
      ) : (
        // Static image fallback
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${fallbackImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-20" />
      
      {/* Content */}
      <div className="relative z-30 text-center text-white max-w-6xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed drop-shadow-xl text-white/95">
          {description}
        </p>
        
        {/* Animated Product Image */}
        {productImage && (
          <div className={`mb-8 transition-all duration-1000 ease-out transform ${
            showProductImage 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-8 opacity-0 scale-95'
          }`}>
            <div className="relative inline-block">
              <img
                src={productImage}
                alt={title}
                width={400}
                height={320}
                className="max-h-64 md:max-h-80 w-auto mx-auto drop-shadow-2xl"
                fetchPriority="high"
                loading="eager"
                style={{ aspectRatio: '400 / 320' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        )}
        
        {/* Variant Selector */}
        {variant && onVariantChange && (
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => onVariantChange('640t')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                variant === '640t'
                  ? 'bg-blue-medium text-white'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              640T
            </button>
            <button
              onClick={() => onVariantChange('6k')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                variant === '6k'
                  ? 'bg-blue-medium text-white'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              6K
            </button>
          </div>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 border border-cyan-300/20">
            Solicitar Orçamento
          </button>
          <button className="bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-400/25 transform hover:scale-105">
            Baixar Datasheet
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
        <div className="animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { YouTubeVideoBackground } from '../YouTubeVideoBackground';

interface ProductHeroProps {
  title: string;
  description: string;
  youtubeVideoId?: string;
  fallbackImage?: string;
  variant?: string;
  onVariantChange?: (variant: string) => void;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  title,
  description,
  youtubeVideoId,
  fallbackImage = "/images/lifestyle/autel-alpha-public-safety-1.jpg",
  variant,
  onVariantChange
}) => {
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
      <div className="absolute inset-0 bg-black bg-opacity-50 z-20" />
      
      {/* Content */}
      <div className="relative z-30 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed">
          {description}
        </p>
        
        {/* Variant Selector */}
        {variant && onVariantChange && (
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => onVariantChange('640t')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                variant === '640t'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              640T
            </button>
            <button
              onClick={() => onVariantChange('6k')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                variant === '6k'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              6K
            </button>
          </div>
        )}
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Solicitar Orçamento
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Baixar Brochure
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

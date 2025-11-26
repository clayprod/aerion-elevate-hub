import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  aspectRatio?: string;
}

/**
 * Componente de imagem otimizada com dimensões explícitas para evitar layout shift
 * e melhorar performance (Core Web Vitals)
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className = '',
  aspectRatio,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Calcular aspect ratio se não fornecido
  const calculatedAspectRatio = aspectRatio || `${width} / ${height}`;

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: calculatedAspectRatio,
        width: '100%',
      }}
    >
      {/* Placeholder para evitar layout shift */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            aspectRatio: calculatedAspectRatio,
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Imagem otimizada */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          aspectRatio: calculatedAspectRatio,
        }}
        {...props}
      />
      
      {/* Fallback para erro */}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{
            aspectRatio: calculatedAspectRatio,
          }}
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};


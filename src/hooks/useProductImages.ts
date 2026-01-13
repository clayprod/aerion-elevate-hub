import { useState, useEffect } from 'react';

export interface ProductImage {
  src: string;
  label: string;
  viewNumber: number;
}

const imageLabels: Record<number, string> = {
  1: "Imagem Principal",
  2: "Vista Frontal",
  3: "Vista Lateral Direita",
  4: "Vista Traseira",
  5: "Vista Lateral Esquerda",
  6: "Vista Superior",
  7: "Vista Inferior",
  8: "Modo Compactado"
};

export const useProductImages = (basePath: string, maxImages: number = 8) => {
  const [availableImages, setAvailableImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkImages = async () => {
      const images: ProductImage[] = [];
      
      for (let i = 1; i <= maxImages; i++) {
        // Try both .png and .jpg extensions
        const extensions = ['png', 'jpg', 'jpeg'];
        
        for (const ext of extensions) {
          const imagePath = `${basePath}/${i}.${ext}`;
          
          try {
            // Try to load the image
            const img = new Image();
            img.src = imagePath;
            
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject();
              // Timeout after 2 seconds
              setTimeout(() => reject(), 2000);
            });
            
            // If loaded successfully, add to available images
            images.push({
              src: imagePath,
              label: imageLabels[i],
              viewNumber: i
            });
            
            break; // Found the image, stop trying other extensions
          } catch {
            // Try next extension
            continue;
          }
        }
      }
      
      setAvailableImages(images);
      setLoading(false);
    };

    checkImages();
  }, [basePath, maxImages]);

  return { images: availableImages, loading };
};

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Download, ExternalLink } from 'lucide-react';

interface Video {
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
}

interface ProductVintageVideoGalleryProps {
  videos: Video[];
  title: string;
}

export const ProductVintageVideoGallery: React.FC<ProductVintageVideoGalleryProps> = ({
  videos,
  title
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (videos.length === 0) {
    return null;
  }

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const openVideoInNewTab = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  // Create vintage TV components
  const VintageTV = ({ video, index, size = 'medium' }: { video: Video; index: number; size?: 'small' | 'medium' | 'large' }) => {
    const sizeClasses = {
      small: 'w-16 h-12',
      medium: 'w-24 h-18',
      large: 'w-32 h-24'
    };

    return (
      <div className={`${sizeClasses[size]} relative group cursor-pointer`}>
        {/* TV Frame */}
        <div className="w-full h-full bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg shadow-lg border-2 border-amber-700 relative overflow-hidden">
          {/* TV Screen */}
          <div className="absolute inset-1 bg-gray-800 rounded-sm flex items-center justify-center">
            <img
              src={getYouTubeThumbnail(video.youtubeId)}
              alt={video.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
              <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          {/* TV Controls */}
          <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
          </div>
          
          {/* TV Antenna */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-0.5 h-2 bg-amber-800"></div>
          </div>
        </div>
        
        {/* Click handler */}
        <button
          onClick={() => setSelectedVideo(video)}
          className="absolute inset-0 w-full h-full"
          title={video.title}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-navy-deep mb-6">
        Galeria de Vídeos
      </h2>
      
      {/* Video Description */}
      <div className="border-b border-dashed border-gray-300 pb-4">
        <h3 className="text-lg font-semibold text-navy-deep">
          ACADEMY - {title} - Demonstração Completa
        </h3>
      </div>
      
      {/* Vintage TV Gallery */}
      <div className="relative">
        <div className="flex flex-wrap items-end gap-4 justify-center min-h-[300px]">
          {/* TV Arrangement - Pyramid Style */}
          <div className="flex flex-col items-center space-y-2">
            {/* Top row - 1 small TV */}
            <VintageTV video={videos[0]} index={0} size="small" />
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            {/* Second row - 2 medium TVs */}
            <div className="flex space-x-2">
              {videos[1] && <VintageTV video={videos[1]} index={1} size="medium" />}
              {videos[2] && <VintageTV video={videos[2]} index={2} size="medium" />}
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            {/* Third row - 3 TVs */}
            <div className="flex space-x-2">
              {videos[3] && <VintageTV video={videos[3]} index={3} size="medium" />}
              {videos[4] && <VintageTV video={videos[4]} index={4} size="large" />}
              {videos[5] && <VintageTV video={videos[5]} index={5} size="medium" />}
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            {/* Bottom row - 2 large TVs */}
            <div className="flex space-x-2">
              {videos[6] && <VintageTV video={videos[6]} index={6} size="large" />}
              {videos[7] && <VintageTV video={videos[7]} index={7} size="large" />}
            </div>
          </div>
        </div>
        
        {/* Scrollbar */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gray-200 rounded-full">
          <div className="w-4 h-8 bg-gray-400 rounded-full mx-1 mt-4"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>
      </div>
      
      {/* Format Info */}
      <div className="text-left">
        <span className="text-sm text-gray-500">FORMATO 16x9</span>
      </div>
      
      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <div className="relative aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(selectedVideo.youtubeId)}
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-semibold text-navy-deep mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-gray-dark mb-4">
                {selectedVideo.description}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => openVideoInNewTab(selectedVideo.youtubeId)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Assistir no YouTube
                </Button>
                <Button
                  onClick={() => setSelectedVideo(null)}
                  variant="secondary"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

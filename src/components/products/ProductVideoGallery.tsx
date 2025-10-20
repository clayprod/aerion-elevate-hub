import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

interface Video {
  title: string;
  description: string;
  youtubeId: string;
  thumbnail?: string;
}

interface ProductVideoGalleryProps {
  videos: Video[];
  title: string;
}

export const ProductVideoGallery: React.FC<ProductVideoGalleryProps> = ({
  videos,
  title
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const openVideo = (youtubeId: string) => {
    setSelectedVideo(youtubeId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-navy-deep mb-6">
        Vídeos do Produto
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <div 
              className="relative aspect-video bg-gray-100"
              onClick={() => openVideo(video.youtubeId)}
            >
              <img
                src={video.thumbnail || getThumbnailUrl(video.youtubeId)}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all duration-300">
                  <Play className="w-6 h-6 text-navy-deep" />
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-navy-deep mb-2 group-hover:text-blue-medium transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {video.description}
              </p>
              <Button
                onClick={() => openVideo(video.youtubeId)}
                variant="outline"
                size="sm"
                className="w-full border-blue-medium text-blue-medium hover:bg-blue-medium hover:text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Assistir Vídeo
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <Button
              onClick={closeVideo}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
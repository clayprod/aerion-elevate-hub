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

interface ProductVideoGalleryProps {
  videos: Video[];
  title: string;
}

export const ProductVideoGallery: React.FC<ProductVideoGalleryProps> = ({
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

  return (
    <section id="video-gallery" className="py-12 bg-gray-light/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-navy-deep">
          Galeria de Vídeos
        </h2>
        
        {selectedVideo && (
          <div className="mb-8">
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.youtubeId)}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
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
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={getYouTubeThumbnail(video.youtubeId)}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors transform group-hover:scale-110"
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    YouTube
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-navy-deep mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-dark mb-4 line-clamp-3">
                  {video.description}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedVideo(video)}
                    size="sm"
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Assistir
                  </Button>
                  <Button
                    onClick={() => openVideoInNewTab(video.youtubeId)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {videos.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 text-sm text-gray-dark">
              <Download className="w-4 h-4" />
              <span>Vídeos disponíveis no canal oficial Autel Robotics</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

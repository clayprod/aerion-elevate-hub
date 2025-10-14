import React, { useState, useEffect } from 'react';

interface YouTubeVideoBackgroundProps {
  videoId: string;
  fallbackImage: string;
  className?: string;
}

export const YouTubeVideoBackground: React.FC<YouTubeVideoBackgroundProps> = ({
  videoId,
  fallbackImage,
  className = ""
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Simulate video loading check
    const timer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className={`absolute inset-0 w-full h-full ${className}`}>
      {!videoError && videoLoaded ? (
        // YouTube iframe embed
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&start=0&end=0`}
          className="w-full h-full object-cover"
          style={{
            border: 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '177.77777778vh', // 16:9 aspect ratio
            minHeight: '56.25vw', // 16:9 aspect ratio
            zIndex: 1
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
          onError={handleVideoError}
        />
      ) : (
        // Fallback image
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${fallbackImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
    </div>
  );
};

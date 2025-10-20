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
    <div className={`video-background ${className}`} style={{ minHeight: '100vh' }}>
      {!videoError && videoLoaded ? (
        // YouTube iframe embed with proper full coverage
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&start=0&end=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          onError={handleVideoError}
          style={{
            minHeight: '100vh',
            height: '100vh'
          }}
        />
      ) : (
        // Fallback image with proper full coverage
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${fallbackImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            height: '100vh'
          }}
        />
      )}
    </div>
  );
};

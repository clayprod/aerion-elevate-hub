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
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {!videoError && videoLoaded ? (
        // YouTube iframe embed with full coverage
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1&start=0&end=0`}
          className="video-responsive"
          style={{
            border: 'none',
            zIndex: 1,
            width: '100%',
            height: '100%'
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
          onError={handleVideoError}
        />
      ) : (
        // Black background when video doesn't load
        <div className="absolute inset-0 w-full h-full bg-black" />
      )}
    </div>
  );
};

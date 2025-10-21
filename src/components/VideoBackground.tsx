import React from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  className = ""
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-responsive"
        style={{
          objectFit: 'cover',
          zIndex: 1
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
};


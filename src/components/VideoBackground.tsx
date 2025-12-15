import React, { useState, useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  poster?: string;
  className?: string;
  lazyLoad?: boolean;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  poster,
  className = "",
  lazyLoad = false
}) => {
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Lazy load video when container is visible
    if (lazyLoad && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [lazyLoad]);

  useEffect(() => {
    // Ensure video plays on mobile if not lazy loaded
    if (videoRef.current && shouldLoad && !isMobile) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay failed, user interaction required
        });
      }
    }
  }, [shouldLoad, isMobile]);

  // On mobile, show poster image instead of video
  if (isMobile && poster) {
    return (
      <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
        <img
          src={poster}
          alt=""
          className="video-responsive"
          style={{
            objectFit: 'cover',
            zIndex: 1
          }}
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            // Fallback se imagem não existir - esconder elemento
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {shouldLoad ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster || undefined}
          className="video-responsive"
          style={{
            objectFit: 'cover',
            zIndex: 1
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Track element for accessibility - empty but structure present */}
          <track kind="captions" src="" srcLang="pt-BR" label="Português" default />
        </video>
      ) : (
        // Placeholder while lazy loading
        poster ? (
          <img
            src={poster}
            alt=""
            className="video-responsive"
            style={{
              objectFit: 'cover',
              zIndex: 1
            }}
            loading="lazy"
          />
        ) : (
          <div className="video-responsive bg-gradient-hero" style={{ zIndex: 1 }} />
        )
      )}
    </div>
  );
};


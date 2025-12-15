import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoBackground } from "../VideoBackground";

interface HeroSlide {
  title: string;
  subtitle: string;
  video_url?: string;
  poster_url?: string;
  cta1_text?: string;
  cta1_link?: string;
  cta2_text?: string;
  cta2_link?: string;
  order_index: number;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  onSlideChange?: (index: number) => void;
  initialIndex?: number;
}

const HeroCarousel = ({ 
  slides, 
  autoplay = true, 
  autoplayInterval = 5000,
  onSlideChange,
  initialIndex = 0
}: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Se apenas 1 slide, não precisa de carrossel
  if (slides.length <= 1) {
    const slide = slides[0];
    return (
      <div className="relative w-full h-full">
        {slide.video_url && (
          <VideoBackground
            videoSrc={slide.video_url}
            poster={slide.poster_url || ""}
            className="object-cover"
            lazyLoad={false}
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-80 z-20" />
      </div>
    );
  }

  // Notificar mudança de slide
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentIndex);
    }
  }, [currentIndex, onSlideChange]);

  // Navegação automática
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-full">
      {/* Video/Image Background */}
      {currentSlide.video_url && (
        <VideoBackground
          videoSrc={currentSlide.video_url}
          poster={currentSlide.poster_url || ""}
          className="object-cover"
          lazyLoad={false}
        />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-80 z-20" />

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white border-white/30"
            onClick={goToPrevious}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white border-white/30"
            onClick={goToNext}
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;


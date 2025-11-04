import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { VideoBackground } from "../VideoBackground";
import { HeroBlock as HeroBlockType, BlockProps } from "@/types/blocks";

interface HeroBlockProps extends BlockProps<HeroBlockType> {
  // Props específicas do HeroBlock se necessário
}

const HeroBlock = ({ block, isEditing = false }: HeroBlockProps) => {
  const { content } = block;

  return (
    <section className="relative min-h-screen flex items-start justify-center pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20">
      {/* Video Background Container - full coverage */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {content.video_url ? (
          <VideoBackground
            videoSrc={content.video_url}
            className="object-cover"
          />
        ) : content.background_image ? (
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${content.background_image})` }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-dark to-navy-deep" />
        )}
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80 z-20" />
      </div>

      <div className="container-custom relative z-30 py-6 sm:py-6 md:py-8 px-6 sm:px-8 md:px-8">
        <div className="max-w-4xl">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8 leading-tight animate-slide-up">
            {content.title}
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {content.subtitle}
          </p>

          {/* Value Props */}
          {content.value_props && content.value_props.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {content.value_props.map((prop, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-semibold mb-1 text-sm">{prop.title}</h3>
                    <p className="text-white/80 text-xs">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold text-base px-8 py-3 shadow-glow group rounded-xl transition-all duration-300 hover:shadow-xl"
            >
              <Link to={content.cta_link} className="flex items-center">
                {content.cta_text}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-heading font-semibold text-base px-8 backdrop-blur-sm group"
            >
              <Link to="/contato" className="flex items-center">
                Fale Conosco
                <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Hero Block
        </div>
      )}
    </section>
  );
};

export default HeroBlock;


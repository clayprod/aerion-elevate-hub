import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { YouTubeVideoBackground } from "../YouTubeVideoBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-start justify-center pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20">
      {/* Video Background Container - full coverage */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <YouTubeVideoBackground
          videoId="IaKUtdAdG5w"
          fallbackImage=""
          className="object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80 z-20" />
        
      </div>

              <div className="container-custom relative z-30 py-6 sm:py-6 md:py-8 px-6 sm:px-8 md:px-8">
        <div className="max-w-4xl">

          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8 leading-tight animate-slide-up">
            A Revolução Autel Chegou ao Brasil
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-white/90 mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Tecnologia de ponta com custo-benefício superior e suporte técnico especializado local. A escolha inteligente para operações enterprise.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1 text-sm">Inteligência Artificial</h3>
                <p className="text-white/80 text-xs">Reconhecimento automático e navegação inteligente</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1 text-sm">Câmeras térmicas e 6K</h3>
                <p className="text-white/80 text-xs">Não perca nenhum detalhe com alta resolução</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1 text-sm">Zoom até 560x</h3>
                <p className="text-white/80 text-xs">Detecção e identificação a longa distância</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1 text-sm">Proteção IP55</h3>
                <p className="text-white/80 text-xs">Resistente a intempéries e condições extremas</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1 text-sm">Software em Português</h3>
                <p className="text-white/80 text-xs">Interface e suporte técnico localizados</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1 text-sm">Sensoriamento Inteligente</h3>
                <p className="text-white/80 text-xs">Sensores de colisão, antijamming e RTH</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold text-base px-8 py-3 shadow-glow group rounded-xl transition-all duration-300 hover:shadow-xl"
            >
              <Link to="/produtos" className="flex items-center">
                Conheça os Produtos
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

    </section>
  );
};

export default HeroSection;

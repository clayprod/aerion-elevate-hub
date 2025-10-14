import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { YouTubeVideoBackground } from "../YouTubeVideoBackground";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* YouTube Video Background with Fallback */}
      <YouTubeVideoBackground
        videoId="IaKUtdAdG5w"
        fallbackImage="/images/lifestyle/evo-max-public-safety-1.jpg"
        className="object-cover"
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-20" />
      
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 border-2 border-cyan-light rotate-45 animate-float" />
        <div className="absolute bottom-32 left-20 w-72 h-72 border-2 border-cyan-light rotate-12 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 border-2 border-teal rotate-45 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-custom relative z-30">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-green-success rounded-full animate-pulse" />
            <span className="text-white text-sm font-heading font-semibold">
              Tecnologia Autel no Brasil
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight animate-slide-up">
            A Revolução Autel Chegou ao Brasil
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Tecnologia de ponta com custo-benefício superior e suporte técnico especializado local. Não é barato, é inteligente.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1">Tecnologia Autel</h3>
                <p className="text-white/80 text-sm">Comparável aos líderes globais</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1">Custo-Benefício</h3>
                <p className="text-white/80 text-sm">Investimento inteligente</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-heading font-semibold mb-1">Suporte Integral</h3>
                <p className="text-white/80 text-sm">Especialistas locais</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button
              asChild
              size="lg"
              className="bg-action hover:bg-action/90 text-white font-heading font-semibold text-base px-8 shadow-glow group"
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

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

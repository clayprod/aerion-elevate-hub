import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductStickyMenu } from '@/components/products/ProductStickyMenu';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { SEOHead } from '@/components/SEO/SEOHead';
import { Breadcrumbs } from '@/components/SEO/Breadcrumbs';
import { getProductFamilyBySlugFromDB, getProductFamilyBySlug } from '@/data/products';
import { getKeywordsForProduct } from '@/data/keywords';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import type { LucideIcon } from 'lucide-react';
import {
  Zap,
  Radio,
  CloudSun,
  Shield,
  Weight,
  Lock,
  Rocket,
  CircleDot,
  Network,
  Eye,
  Plane,
  Truck,
  Settings,
  Wifi,
  Target,
  BatteryCharging,
  Thermometer,
  Wind,
  Cloud,
  Database,
  Upload,
  FolderOpen,
  Code
} from 'lucide-react';

const EvoNest: React.FC = () => {
  // Fetch product family from database
  const { data: productFamily, isLoading: isLoadingFamily, error: familyError } = useQuery({
    queryKey: ['product-family', 'evo-nest'],
    queryFn: () => getProductFamilyBySlugFromDB('evo-nest'),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Fetch product page content from database
  const { data: pageContent, isLoading: isLoadingContent } = useQuery({
    queryKey: ['product-page-content', 'evo-nest'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_page_content')
        .select('*')
        .eq('product_slug', 'evo-nest')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Loading state
  if (isLoadingFamily) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-medium border-r-transparent"></div>
          <p className="mt-4 text-gray-dark">Carregando produto...</p>
        </div>
      </div>
    );
  }

  // Fallback to hardcoded data if database fetch fails
  const finalProductFamily = productFamily || getProductFamilyBySlug('evo-nest');

  if (!finalProductFamily) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-dark text-lg">Produto não encontrado</p>
          {familyError && (
            <p className="text-gray-500 text-sm mt-2">Erro ao carregar do banco de dados</p>
          )}
        </div>
      </div>
    );
  }

  const downloads = [
    {
      title: 'Brochure EVO Nest',
      description: 'Catálogo completo do EVO Nest',
      url: finalProductFamily.brochure,
      type: 'pdf' as const,
      size: '4.5 MB'
    }
  ];

  // Use only product images for the header
  const productImages = finalProductFamily.photoGallery?.product || [];

  const keyFeatures = [
    'Deploy rápido - pronto para operação em minutos',
    'Alcance operacional de 7 km para missões remotas',
    'Carregamento rápido: 10% a 90% em 25 minutos',
    'Performance em todas as condições climáticas (-30°C a 50°C)',
    'Design compacto tipo tambor com menos peças móveis',
    'Peso de 59 kg - transportável por 2 pessoas',
    'Classificação IP55 para proteção contra intempéries',
    'Criptografia AES-256 para segurança de dados',
    'Ciclo de vida: ≥50.000 aberturas'
  ];

  const quickStats = [
    { icon: Rocket, value: 'Deploy Rápido', label: 'Pronto em minutos' },
    { icon: Radio, value: '7 km', label: 'Alcance Operacional' },
    { icon: BatteryCharging, value: '25 min', label: 'Carregamento Rápido' },
    { icon: Thermometer, value: '-30°C a 50°C', label: 'Faixa Temperatura' },
    { icon: CircleDot, value: 'Drum-Style', label: 'Design Compacto' },
    { icon: Weight, value: '59 kg', label: 'Peso Leve' },
    { icon: Shield, value: 'IP55', label: 'Classificação' },
    { icon: Lock, value: 'AES-256', label: 'Criptografia' }
  ];

  const operationFeatures: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: Network,
      title: 'Operações em Rede',
      description: 'Múltiplos Nests podem ser conectados em rede para cobrir grandes áreas, permitindo operações flexíveis e expansíveis.'
    },
    {
      icon: Lock,
      title: 'Criptografia Avançada',
      description: 'O EVO Nest suporta criptografia de transmissão de imagem AES-256 para máxima segurança de dados.'
    },
    {
      icon: Plane,
      title: 'Operação Autônoma',
      description: 'O EVO Nest pode ser facilmente implantado na área de patrulha para decolagem automática, pouso preciso, armazenamento e carregamento automático.'
    },
    {
      icon: Settings,
      title: 'Pilotagem Flexível',
      description: 'Suporte a operações autônomas, semi-autônomas ou pilotagem remota para atender diferentes necessidades de missão.'
    }
  ];

  const connectivityFeatures = [
    { icon: Wifi, title: 'Rede com Fio', description: 'Conexão estável via cabo' },
    { icon: Radio, title: '4G LTE', description: 'Conectividade móvel' },
    { icon: Zap, title: '5G', description: 'Conexão ultrarrápida' }
  ];

  const missionCapabilities = [
    {
      title: 'Rotas de Voo',
      description: 'Configuração de rotas de voo personalizadas através do AICS'
    },
    {
      title: 'Waypoints',
      description: 'Definição precisa de pontos de passagem para missões'
    },
    {
      title: 'Ângulos e Alvos',
      description: 'Controle de ângulos de câmera e alvos específicos'
    },
    {
      title: 'Tempo e Frequência',
      description: 'Programação de horários e frequência de missões'
    }
  ];

  const aiRecognitionTargets = [
    { icon: Eye, label: 'Pessoas' },
    { icon: Truck, label: 'Veículos' },
    { icon: Target, label: 'Embarcações' },
    { icon: CloudSun, label: 'Fumaça' },
    { icon: Thermometer, label: 'Fogo' }
  ];

  const weatherFeatures = [
    {
      icon: Thermometer,
      title: 'Sistema Meteorológico Integrado',
      description: 'Sensores de clima localizados fornecem dados meteorológicos precisos para operações seguras.'
    },
    {
      icon: Wind,
      title: 'Controle de Temperatura',
      description: 'Sistema de controle térmico industrial mantém condições ideais para o drone e equipamentos.'
    },
    {
      icon: Shield,
      title: 'Proteção IP55',
      description: 'Classificação IP55 garante proteção contra jatos de água e poeira em qualquer direção.'
    }
  ];

  const menuItems = [
    { id: 'product-description', label: 'Descrição do Produto' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'dados-tecnicos', label: 'Dados Técnicos' },
    { id: 'dados-comerciais', label: 'Dados Comerciais e de Apoio' },
    { id: 'applications', label: 'Aplicações' },
    { id: 'videos', label: 'Vídeos' }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="EVO Nest | Estação de Pouso e Carregamento Autônomo para Drones | Aerion"
        description="EVO Nest: estação de pouso autônomo para drones da série EVO. Deploy rápido, alcance de 7 km, carregamento em 25 min, design compacto IP55 e criptografia AES-256. Sistema completo de operações remotas com AICS."
        keywords={getKeywordsForProduct('evo-nest')}
        canonical="https://aerion.com.br/produtos/evo-nest"
        ogType="product"
      />
      <Header />

      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Produtos', path: '/produtos' },
        { label: 'EVO Nest', path: '/produtos/evo-nest' }
      ]} />

      <ProductStickyMenu items={menuItems} />

      {/* Product Header - E-commerce Layout */}
      <div id="product-description">
        <ProductHeader
          name={finalProductFamily.name}
          description={finalProductFamily.description}
          productCodes={finalProductFamily.productCodes}
          keyFeatures={keyFeatures}
          images={productImages}
          category="Estação de Pouso Autônomo"
        />
      </div>

      <section id="destaques" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Hero Banner - Official Autel Image */}
          <div className="relative overflow-hidden rounded-3xl min-h-[500px] md:min-h-[600px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-[center_left_30%] md:bg-center"
              style={{ backgroundImage: "url('/images/products/evo_nest/banner.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 h-full min-h-[500px] md:min-h-[600px] flex flex-col justify-center items-end px-6 py-16 sm:px-10 lg:px-16">
              <div className="max-w-xl text-right">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  EVO Nest
                </h2>
                <p className="mt-4 text-xl sm:text-2xl text-gray-100 font-light">
                  Simplifique operações complexas
                </p>
                <p className="mt-6 text-sm sm:text-base text-gray-200 leading-relaxed">
                  Confiável, durável e transportável, o EVO Nest é uma base para decolagem, pouso,
                  carregamento e planejamento de missões automáticos para a série EVO. O Nest é
                  projetado para operação em todas as condições climáticas e usa um tambor protetor
                  de peça única com menos partes móveis para simplificar a manutenção. Cabe na
                  caçamba de uma picape padrão e é leve o suficiente para ser carregado por 2 pessoas.
                  Pareado com o Autel Integrated Command System para gerenciamento centralizado de
                  drones, o Nest é fácil de configurar, manter e operar.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickStats.map(({ icon: Icon, value, label }) => (
              <div key={value} className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Icon className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <div className="text-sm font-semibold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Complete Remote Operations System Section */}
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Sistema Completo de Operações Remotas
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                O EVO Nest é um sistema completo de operações remotas para aeronaves com monitoramento
                meteorológico durante todo o dia e implantação rápida.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                O Sistema de Operações Remotas Autel consiste no EVO Nest, UAV e o Autel Integrated
                Command System para fornecer uma solução completa de gerenciamento de tarefas remotas.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/images/products/evo_nest/remote-operations.webp"
                alt="Sistema Completo de Operações Remotas EVO Nest"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Operation Features Grid */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight text-center">
              Recursos de Operação
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {operationFeatures.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-gray-100 bg-gray-50 px-6 py-8 shadow-sm">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">{title}</h4>
                  <p className="mt-2 text-sm text-gray-700">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Operation Section */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Autônomo, Semi-Autônomo ou Pilotagem Remota
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                O EVO Nest pode emitir missões via redes com fio, 4G ou 5G, suportando a configuração de
                rotas de voo, waypoints, ângulos, alvos, tempo e frequência através do Sistema de Comando
                Integrado Autel (AICS).
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                Isso permite que a aeronave alcance reconhecimento de alvos por IA (pessoas, veículos,
                embarcações, fumaça, fogo, etc.) e transmissão de imagem remota, reduzindo limitações geográficas.
              </p>

              {/* Connectivity Options */}
              <div className="flex flex-wrap gap-4 mt-6">
                {connectivityFeatures.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{title}</div>
                      <div className="text-xs text-gray-500">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/images/products/evo_nest/20240827-092244.png"
                alt="EVO Nest Sistema Autônomo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* AI Recognition Section */}
          <div className="bg-navy-deep text-white rounded-3xl px-6 py-12 sm:px-10 sm:py-14 shadow-xl">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Reconhecimento de Alvos por IA
              </h3>
              <p className="text-base sm:text-lg text-gray-200">
                O sistema de inteligência artificial integrado identifica automaticamente diversos tipos
                de alvos, permitindo operações de vigilância e monitoramento altamente eficientes.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {aiRecognitionTargets.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 bg-white/10 rounded-2xl px-6 py-4">
                    <Icon className="h-8 w-8 text-blue-400" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Capabilities */}
          <div className="space-y-6">
            <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight text-center">
              Capacidades de Missão via AICS
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {missionCapabilities.map(({ title, description }) => (
                <div key={title} className="rounded-3xl border border-gray-100 bg-white px-6 py-6 shadow-sm text-center">
                  <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
                  <p className="mt-2 text-sm text-gray-700">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transportable Section */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-3xl shadow-xl order-2 lg:order-1">
              <img
                src="/images/products/evo_nest/20240827-092306.png"
                alt="EVO Nest Transportável"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Transportável e Fácil Configuração
              </h3>
              <p className="text-base sm:text-lg text-gray-700">
                O Nest pesa apenas 59 kg, tem uma área de ocupação menor que 1 m² e pode ser configurado
                por uma equipe de 2 pessoas. Cabe na caçamba de uma picape padrão, permitindo implantação
                rápida em qualquer local.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-2xl bg-gray-50">
                  <div className="text-2xl font-bold text-blue-600">59 kg</div>
                  <div className="text-xs text-gray-600">Peso Total</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gray-50">
                  <div className="text-2xl font-bold text-blue-600">&lt;1 m²</div>
                  <div className="text-xs text-gray-600">Área de Ocupação</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gray-50">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-xs text-gray-600">Pessoas para Setup</div>
                </div>
              </div>
            </div>
          </div>

          {/* All Weather Performance */}
          <div className="relative overflow-hidden rounded-3xl min-h-[450px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/products/evo_nest/all-weather.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
            <div className="relative z-10 h-full min-h-[450px] flex flex-col justify-end px-6 pb-12 pt-10 sm:px-10 lg:px-16">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-2 mb-4 w-fit">
                <CloudSun className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">All Weather Performance</span>
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold leading-tight max-w-2xl">
                Performance em Todas as Condições Climáticas
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-2xl leading-relaxed">
                O sistema meteorológico integrado do Nest fornece dados climáticos localizados para
                operações seguras de drones remotos. A unidade de controle de temperatura industrial
                permite que o Nest opere em temperaturas entre <strong>-30°C e 55°C</strong>.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl border border-white/20 px-5 py-3">
                  <Thermometer className="h-7 w-7 text-blue-400" />
                  <div>
                    <div className="text-xl font-bold">-30°C a 55°C</div>
                    <div className="text-sm text-gray-300">Faixa de operação</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl border border-white/20 px-5 py-3">
                  <Shield className="h-7 w-7 text-green-400" />
                  <div>
                    <div className="text-xl font-bold">IP55</div>
                    <div className="text-sm text-gray-300">Proteção climática</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl border border-white/20 px-5 py-3">
                  <Wind className="h-7 w-7 text-cyan-400" />
                  <div>
                    <div className="text-xl font-bold">Sensores</div>
                    <div className="text-sm text-gray-300">Meteorológicos integrados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fast Charge Section */}
          <div className="relative overflow-hidden rounded-3xl min-h-[400px] text-white shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/products/evo_nest/fast-charge.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="relative z-10 h-full min-h-[400px] flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-6">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Carregamento Ultra-Rápido</span>
                </div>
                <h3 className="text-4xl sm:text-5xl font-bold leading-tight">
                  Fast Charge
                </h3>
                <p className="mt-6 text-base sm:text-lg text-gray-200 leading-relaxed">
                  O EVO Nest é equipado com tecnologia de carregamento ultra-rápido, permitindo que a
                  bateria inteligente da aeronave carregue de 10% a 90% em apenas 25 minutos* a 25°C,
                  otimizando a experiência operacional.
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  *A temperatura da bateria deve estar entre 25°C e 30°C.
                </p>
                <div className="flex flex-wrap items-center gap-6 mt-8">
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3">
                    <BatteryCharging className="h-8 w-8 text-green-400" />
                    <div>
                      <div className="text-2xl font-bold">10% → 90%</div>
                      <div className="text-sm text-gray-300">em 25 minutos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3">
                    <Thermometer className="h-8 w-8 text-orange-400" />
                    <div>
                      <div className="text-2xl font-bold">25°C - 30°C</div>
                      <div className="text-sm text-gray-300">Temperatura ideal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Information Management Section */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-2">
                <Cloud className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Gerenciamento na Nuvem</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                Gestão de Informações
              </h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                O EVO Nest faz upload de dados de voo e missão para a nuvem, permitindo fácil acesso,
                armazenamento e gerenciamento de todas as informações operacionais.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Upload className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Upload Automático</div>
                    <div className="text-xs text-gray-500">Dados em tempo real</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <Database className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Armazenamento</div>
                    <div className="text-xs text-gray-500">Seguro na nuvem</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <FolderOpen className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Acesso Fácil</div>
                    <div className="text-xs text-gray-500">De qualquer lugar</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src="/images/products/evo_nest/cloud-management.webp"
                alt="EVO Nest Gestão de Informações na Nuvem"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* AICS Integration Section */}
          <div className="bg-white text-gray-900 rounded-3xl px-6 py-12 sm:px-10 sm:py-14 shadow-xl border border-gray-100">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-3xl sm:text-4xl font-semibold leading-tight">
                Autel Integrated Command System (AICS)
              </h3>
              <p className="mt-4 text-base sm:text-lg text-gray-600">
                Pareado com o Sistema de Comando Integrado Autel para gerenciamento centralizado de drones,
                o Nest é fácil de configurar, manter e operar. O AICS permite controle total de múltiplos
                Nests e aeronaves a partir de um único centro de comando.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="text-center p-6 rounded-2xl bg-gray-50">
                <Settings className="h-10 w-10 mx-auto text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900">Fácil Configuração</h4>
                <p className="mt-2 text-sm text-gray-700">
                  Interface intuitiva para configuração rápida de missões e parâmetros
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gray-50">
                <Network className="h-10 w-10 mx-auto text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900">Gerenciamento Centralizado</h4>
                <p className="mt-2 text-sm text-gray-700">
                  Controle múltiplos Nests e drones de um único ponto de comando
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gray-50">
                <Eye className="h-10 w-10 mx-auto text-blue-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900">Monitoramento em Tempo Real</h4>
                <p className="mt-2 text-sm text-gray-700">
                  Visualização ao vivo de todas as operações e status dos equipamentos
                </p>
              </div>
            </div>
          </div>

          {/* Autel SDK Section */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 rounded-full px-4 py-2">
                <Code className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">Desenvolvimento</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Autel SDK</h3>
              <p className="text-base sm:text-lg text-gray-700">
                O Autel SDK é aberto ao mercado, ajudando desenvolvedores e parceiros a reduzir custos de criação de software e hardware e a construir um novo ecossistema para a indústria.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                Integre fluxos personalizados, dashboards, sensores adicionais e aplicações verticais mantendo toda a segurança do Autel SkyLink.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">MSDK</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">PSDK</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">Cloud API</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">AICS Integration</span>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <img
                src="/images/destaques/evo-max/autel-sdk.png"
                alt="Autel SDK"
                className="w-full max-w-lg rounded-3xl shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Data Section */}
      <section id="technical-data" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductTechnicalData
            technicalData={finalProductFamily.technicalData}
            specs={pageContent?.specifications || finalProductFamily.variants?.[0]?.specs}
            components={finalProductFamily.components}
            accessoriesIncluded={finalProductFamily.accessoriesIncluded}
            title="EVO Nest"
            downloads={downloads}
          />
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductApplications
            applications={pageContent?.applications || finalProductFamily.applications}
            title={finalProductFamily.name}
          />
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductVideoGallery
            videos={pageContent?.videos || finalProductFamily.videos}
            title={finalProductFamily.name}
          />
        </div>
      </section>

      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default EvoNest;

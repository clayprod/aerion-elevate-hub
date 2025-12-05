import React from 'react';
import { ProductStickyMenu } from '@/components/products/ProductStickyMenu';
import { ProductApplications } from '@/components/products/ProductApplications';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { SEOHead } from '@/components/SEO/SEOHead';
import { Breadcrumbs } from '@/components/SEO/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';
import { Card } from '@/components/ui/card';
import {
  Zap,
  Box,
  Map,
  Triangle,
  Clock,
  Layers,
  Network,
  Settings,
  Cloud
} from 'lucide-react';

const AutelMapper: React.FC = () => {
  const menuItems = [
    { id: 'destaques', label: 'Destaques' },
    { id: 'especificacoes-tecnicas', label: 'Especificações Técnicas' },
    { id: 'applications', label: 'Aplicações' },
    { id: 'videos', label: 'Vídeos' }
  ];

  const highlights = [
    {
      id: 'swift-and-accurate',
      title: 'Swift and Accurate',
      description: 'Os algoritmos de deep learning da Autel tornam o Autel Mapper um dos softwares de processamento de mapas mais rápidos da indústria, fornecendo reconstrução 2D e 3D altamente precisa, mesmo para objetos pequenos - para modelos e mapas imbatíveis.',
      icon: Zap,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/26/2023052616308138.png',
      imageType: 'png'
    },
    {
      id: '3d-reconstruction',
      title: '3D Reconstruction',
      description: 'O Autel Mapper combina algoritmos tradicionais e de deep learning para melhorar significativamente a completude dos modelos 3D. A qualidade da reconstrução pode ser selecionada entre três opções: alta, média e baixa. Pode reconstruir objetos pequenos completamente e atender às necessidades de várias indústrias.',
      icon: Box,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519558418.png',
      imageType: 'png'
    },
    {
      id: '2d-reconstruction',
      title: '2D Reconstruction',
      description: 'A tecnologia de deep learning da Autel permite adaptação autônoma de algoritmos de IA em diferentes cenários, atendendo ao requisito de precisão 1:500 na indústria de levantamento e mapeamento sem GCPs.',
      icon: Map,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/26/2023052616261646.png',
      imageType: 'png'
    },
    {
      id: 'aerial-triangulation',
      title: 'Aerial Triangulation',
      description: 'O Autel Mapper suporta câmeras roll shutter e global shutter, e seu processamento inteligente de blocos de triangulação aérea pode lidar com grandes volumes de dados. O algoritmo de correspondência avançado pode resolver efetivamente o processamento de dados de diferentes alturas e resoluções.',
      icon: Triangle,
      image: 'https://app.autelrobotics.cn/statics/cdn/guanwang/images/mapper_en/videos/sanjiaoceliang.gif?v=1.5',
      imageType: 'gif'
    },
    {
      id: 'real-time-2d',
      title: 'Real-time 2D',
      description: 'Durante o voo, o controle remoto transmite imagens em tempo real para o Autel Mapper para costura 2D em tempo real. Algoritmos avançados de processamento de imagem são usados para gerar imagens ortofoto 2D de alta precisão em tempo real, fornecendo aos operadores no local uma base para ajustar o fluxo de trabalho de forma oportuna.',
      icon: Clock,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/26/2023052616344830.gif',
      imageType: 'gif'
    },
    {
      id: 'quick-stitching',
      title: 'Quick Stitching',
      description: 'Importe em lote imagens capturadas por drones Autel, gere rapidamente mapas 2D e renderizações usando algoritmos avançados de ortoretificação de imagem e algoritmos de costura rápida.',
      icon: Layers,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519587267.gif',
      imageType: 'gif'
    },
    {
      id: 'flexible-scalable',
      title: 'Flexible, Scalable',
      description: 'Importe e exporte com facilidade e utilize recursos de rede ou nuvem para lidar rapidamente com qualquer projeto.',
      icon: Network,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519564340.png',
      imageType: 'png'
    },
    {
      id: 'complete-control',
      title: 'Complete Control',
      description: 'O workflow único e intuitivo do Autel Mapper significa que os usuários podem se envolver rapidamente em um projeto sem o medo de ficarem sobrecarregados.',
      icon: Settings,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519568264.png',
      imageType: 'png'
    },
    {
      id: 'cloud-ready',
      title: 'Cloud Ready',
      description: 'Utilize a nuvem para saídas e renderizações mais rápidas do que nunca.',
      icon: Cloud,
      image: 'https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519565999.png',
      imageType: 'png'
    }
  ];

  const applications = [
    {
      title: 'Public Safety',
      description: 'Aplicações para segurança pública e monitoramento.',
      image: '/images/applications/public-safety.jpg'
    },
    {
      title: 'Search And Rescue',
      description: 'Ferramentas essenciais para operações de busca e resgate.',
      image: '/images/applications/search-rescue.jpg'
    },
    {
      title: 'Surveying And Mapping',
      description: 'Soluções profissionais para levantamento e mapeamento.',
      image: '/images/applications/surveying-mapping.jpg'
    },
    {
      title: 'Powerline Inspection',
      description: 'Inspeção eficiente de linhas de transmissão e infraestrutura elétrica.',
      image: '/images/applications/powerline-inspection.jpg'
    }
  ];

  const technicalSpecs = {
    system: {
      'Sistema Operacional': 'Windows 10 ou posterior (64-bit)',
      'Tipo': 'Reconstrução 2D/3D'
    },
    computer: {
      'CPU Mínimo': 'Intel Core i5 8 series ou AMD Ryzen 5 3000 series',
      'CPU Recomendado': 'Intel Core i7 11 series ou mais recente ou AMD Ryzen 7 5000 series ou mais recente',
      'GPU Mínimo': 'NVIDIA GeForce GTX1070',
      'GPU Recomendado': 'NVIDIA GeForce RTX 2080 Ti ou superior',
      'VRAM Mínimo': '6GB',
      'VRAM Recomendado': '8GB ou superior',
      'RAM Mínimo': '16GB',
      'RAM Recomendado': '32GB ou superior',
      'Armazenamento Mínimo': '200GB de espaço em disco utilizável',
      'Armazenamento Recomendado': '256GB SSD + 2TB Enterprise HDD',
      'Display Mínimo': '1280x1024',
      'Display Recomendado': '1920x1080 ou superior'
    },
    performance: {
      'Máximo de Imagens Processáveis (Um Nó)': '30.000',
      'Reconstrução 3D - Tarefa Standalone': '500 imagens/1GB de memória livre',
      'Reconstrução 3D - Tempo Necessário': '10.000 imagens em 18 horas',
      'Reconstrução 3D - Precisão': 'Nível centimétrico (1:500 mapping accuracy)',
      'Reconstrução 3D - Formatos de Saída': 'B3DM, OSGB, OBJ, PLY',
      'Reconstrução 2D - Tarefa Standalone': '500 imagens/1GB de memória livre',
      'Reconstrução 2D - Tempo Necessário': '8000 imagens em 6 horas',
      'Reconstrução 2D - Precisão': 'Nível centimétrico (1:500 mapping accuracy)',
      'Reconstrução 2D - Formato de Saída': 'GeoTIFF',
      'Quick Stitching - Formatos': 'DOM, DSM, visualização 2.5D',
      'Quick Stitching - Plataformas Suportadas': 'App, Autel SkyCommand Center, plataformas de terceiros',
      'Quick Stitching - Métodos': 'On-the-fly stitching, Rapid processing',
      'Aerial Triangulation - Taxa de Aprovação': '0.98',
      'Aerial Triangulation - Formato': 'XML',
      'Dense Point Clouds - Formatos': 'PNTS, LAS, XYZ',
      'Rebuild Optimization - KML Import': 'Suportado',
      'Rebuild Optimization - Model Reconstruction Processing': 'Suportado',
      'Rebuild Optimization - Camera Parameters': 'Suportado',
      'Rebuild Optimization - Image POS Data Management': 'Suportado',
      'Rebuild Optimization - Ground Control Point (GCP) Management': 'Suportado'
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Autel Mapper | Software de Mapeamento 2D e 3D Profissional | Aerion"
        description="Autel Mapper: software profissional de reconstrução 2D e 3D com processamento em nuvem ou local, utilizando deep learning para resultados altamente precisos. Ideal para mapeamento, topografia e inspeções."
        keywords="autel mapper, software mapeamento, reconstrução 3d, mapeamento aéreo, software drone, autel mapper brasil"
        canonical="https://aerion.com.br/produtos/autel-mapper"
        ogType="product"
      />
      <Header />
      
      <Breadcrumbs items={[
        { label: 'Home', path: '/' },
        { label: 'Produtos', path: '/produtos' },
        { label: 'Autel Mapper', path: '/produtos/autel-mapper' }
      ]} />
      
      <ProductStickyMenu items={menuItems} />
      
      {/* Destaques Section */}
      <section id="destaques" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Video Hero */}
          <div className="relative overflow-hidden rounded-3xl min-h-[500px] flex items-center justify-center text-white shadow-xl">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="https://app.autelrobotics.cn/statics/cdn/guanwang/images/mapper_en/videos/banner_video_en.mp4" type="video/mp4" />
              Seu navegador não suporta a reprodução de vídeos.
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />
            <div className="relative z-10 max-w-4xl w-full px-6 py-12 sm:px-10 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                Autel Mapper
              </h2>
              <p className="text-lg sm:text-xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
                Professional, efficient, and accessible mapping. Autel Mapper is a 2D and 3D reconstruction software with cloud or local processing, utilizing deep learning for highly accurate results.
              </p>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card key={highlight.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {highlight.imageType === 'gif' ? (
                      <img
                        src={highlight.image}
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={highlight.image}
                        alt={highlight.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-navy-deep mb-3">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-dark leading-relaxed text-sm">
                      {highlight.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Especificações Técnicas Section */}
      <section id="especificacoes-tecnicas" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-deep mb-4">
              Especificações Técnicas
            </h2>
            <p className="text-xl text-gray-dark max-w-3xl mx-auto">
              Requisitos do sistema e especificações de performance do Autel Mapper
            </p>
          </div>

          <div className="space-y-8">
            {/* Requisitos do Sistema */}
            <Card className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-navy-deep mb-6">Requisitos do Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(technicalSpecs.system).map(([key, value]) => (
                  <div key={key} className="flex flex-col min-h-[80px] py-4 px-4 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium text-gray-dark text-sm leading-tight mb-2">{key}</span>
                    <span className="text-navy-deep font-semibold text-sm leading-relaxed break-words">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Especificações do Computador */}
            <Card className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-navy-deep mb-6">Especificações do Computador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(technicalSpecs.computer).map(([key, value]) => (
                  <div key={key} className="flex flex-col min-h-[80px] py-4 px-4 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium text-gray-dark text-sm leading-tight mb-2">{key}</span>
                    <span className="text-navy-deep font-semibold text-sm leading-relaxed break-words">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Especificações de Função e Performance */}
            <Card className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-navy-deep mb-6">Especificações de Função e Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(technicalSpecs.performance).map(([key, value]) => (
                  <div key={key} className="flex flex-col min-h-[80px] py-4 px-4 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium text-gray-dark text-sm leading-tight mb-2">{key}</span>
                    <span className="text-navy-deep font-semibold text-sm leading-relaxed break-words">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Applications Section */}
      <section id="applications" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductApplications
            applications={applications}
            title="Autel Mapper"
          />
        </div>
      </section>
      
      {/* Videos Section */}
      <section id="videos" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductVideoGallery
            videos={[]}
            title="Autel Mapper"
          />
        </div>
      </section>
      
      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default AutelMapper;


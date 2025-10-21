import React, { useState } from 'react';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductStickyMenu } from '@/components/products/ProductStickyMenu';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVideoGallery } from '@/components/products/ProductVideoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileFloatingCTA from '@/components/MobileFloatingCTA';

const EvoLiteEnterprise: React.FC = () => {
  const productFamily = getProductFamilyBySlug('evo-lite-enterprise');
  const [selectedVariant, setSelectedVariant] = useState('640t');

  if (!productFamily) {
    return <div>Produto não encontrado</div>;
  }

  const currentVariant = productFamily.variants.find(v => v.id === selectedVariant) || productFamily.variants[0];

  const downloads = [
    {
      title: 'Brochure EVO Lite Enterprise',
      description: 'Catálogo completo da série EVO Lite Enterprise',
      url: productFamily.brochure,
      type: 'pdf' as const,
      size: '3.2 MB'
    },
    {
      title: 'Manual do Usuário',
      description: 'Guia completo de operação e configuração',
      url: '/downloads/EN_EVO_Lite_Enterprise_Series_Aircraft_User_Manual_V1.0.2.pdf',
      type: 'pdf' as const,
      size: '18.5 MB'
    },
    {
      title: 'Guia de Início Rápido',
      description: 'Instruções básicas para começar a voar',
      url: '/downloads/EVO_Lite_Enterprise_Series_Quick_Start_Guide.pdf',
      type: 'pdf' as const,
      size: '2.1 MB'
    },
    {
      title: 'FAQ Técnico',
      description: 'Perguntas frequentes e soluções técnicas',
      url: '/downloads/EVO_Lite_Enterprise_Series_FAQ.xlsx',
      type: 'xlsx' as const,
      size: '1.5 MB'
    },
    {
      title: 'Lista de Embalagem',
      description: 'Conteúdo da embalagem e acessórios inclusos',
      url: '/downloads/EVO_Lite_Enterprise_Series_Basic_Combo_Packing_List.pdf',
      type: 'pdf' as const,
      size: '1.8 MB'
    },
    {
      title: 'Material de Treinamento',
      description: 'Recursos educacionais e treinamento',
      url: '/downloads/EVO_Lite_Enterprise_Series_Training_Materials.pdf',
      type: 'pdf' as const,
      size: '4.2 MB'
    }
  ];

  // Use only product images for the header
  const productImages = productFamily.photoGallery.product;

  // Define variants for EVO Lite Enterprise
  const variants = [
    {
      id: '640t',
      name: '640T',
      keyFeatures: [
        'Câmera térmica de alta resolução 640x512',
        'Zoom digital térmico 20x',
        'Autonomia de até 40 minutos',
        'Resistência ao vento de 12 m/s',
        'Transmissão de vídeo 1080P@60fps'
      ]
    },
    {
      id: '6k',
      name: '6K',
      keyFeatures: [
        'Câmera visual 6K de alta resolução',
        'Zoom digital 16x',
        'Autonomia de até 40 minutos',
        'Resistência ao vento de 12 m/s',
        'Transmissão de vídeo 4K@30fps'
      ]
    }
  ];

  const currentVariantData = variants.find(v => v.id === selectedVariant) || variants[0];

  const menuItems = [
    { id: 'product-description', label: 'Descrição do Produto' },
    { id: 'technical-data', label: 'Dados Técnicos' },
    { id: 'accessories', label: 'Acessórios' },
    { id: 'commercial-data', label: 'Dados Comerciais e de Apoio' },
    { id: 'applications', label: 'Aplicações' },
    { id: 'videos', label: 'Vídeos' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Product Header - E-commerce Layout */}
      <section id="product-description">
        <ProductHeader
          name={productFamily.name}
          description={productFamily.description}
          productCodes={productFamily.productCodes}
          keyFeatures={currentVariantData.keyFeatures}
          images={productImages}
          category="Drone Profissional"
          variants={variants}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />
      </section>
      
      {/* Sticky Navigation Menu */}
      <ProductStickyMenu items={menuItems} />
      
      {/* Technical Data Section */}
      <section id="technical-data" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductTechnicalData
            technicalData={productFamily.technicalData}
            specs={currentVariant.specs}
            components={productFamily.components}
            accessoriesIncluded={productFamily.accessoriesIncluded}
            title={currentVariant.name}
            downloads={downloads}
          />
        </div>
      </section>
      
      {/* Accessories Section */}
      <section id="accessories" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-deep mb-4">Acessórios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Acessórios disponíveis para o {productFamily.name}
            </p>
          </div>
          {/* Aqui você pode adicionar o conteúdo dos acessórios */}
        </div>
      </section>
      
      {/* Commercial Data Section */}
      <section id="commercial-data" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-deep mb-4">Dados Comerciais e de Apoio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Informações comerciais e materiais de apoio para o {productFamily.name}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-medium/10 rounded-lg flex items-center justify-center">
                      <span className="text-blue-medium font-semibold text-sm">
                        {download.type.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{download.title}</h3>
                      <p className="text-sm text-gray-500">{download.size}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{download.description}</p>
                <a
                  href={download.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-medium text-white rounded-lg hover:bg-blue-dark transition-colors text-sm font-medium"
                >
                  Baixar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Applications Section */}
      <section id="applications" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductApplications
            applications={productFamily.applications}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Videos Section */}
      <section id="videos" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductVideoGallery
            videos={productFamily.videos}
            title={productFamily.name}
          />
        </div>
      </section>
      
      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default EvoLiteEnterprise;

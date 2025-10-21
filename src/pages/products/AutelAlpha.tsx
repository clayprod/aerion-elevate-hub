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

const AutelAlpha: React.FC = () => {
  const productFamily = getProductFamilyBySlug('autel-alpha');
  const [selectedVariant, setSelectedVariant] = useState('alpha');

  if (!productFamily) {
    return <div>Produto não encontrado</div>;
  }

  const currentVariant = productFamily.variants[0]; // Autel Alpha has only one variant

  const downloads = [
    {
      title: 'Brochure Autel Alpha',
      description: 'Catálogo completo com especificações e aplicações',
      url: productFamily.brochure,
      type: 'pdf' as const,
      size: '2.5 MB'
    },
    {
      title: 'Manual do Usuário',
      description: 'Guia completo de operação e configuração',
      url: '/downloads/EN_Autel_Alpha_User_Manual_V1.1.pdf',
      type: 'pdf' as const,
      size: '15.2 MB'
    },
    {
      title: 'Especificações Técnicas',
      description: 'Planilha detalhada com todas as especificações',
      url: '/downloads/Autel_Alpha_Specification.xlsx',
      type: 'xlsx' as const,
      size: '850 KB'
    },
    {
      title: 'Lista de Embalagem',
      description: 'Conteúdo da embalagem e acessórios inclusos',
      url: '/downloads/Autel_Alpha_Packing_List.pdf',
      type: 'pdf' as const,
      size: '1.2 MB'
    },
    {
      title: 'Certificações',
      description: 'Documentos de certificação e conformidade',
      url: '/downloads/Autel_Alpha_Certifications.pdf',
      type: 'pdf' as const,
      size: '3.1 MB'
    }
  ];

  // Use only product images for the header
  const productImages = productFamily.photoGallery.product;

  const menuItems = [
    { id: 'product-description', label: 'Descrição do Produto' },
    { id: 'technical-data', label: 'Dados Técnicos' },
    { id: 'downloads', label: 'Material de Apoio' },
    { id: 'gallery', label: 'Galeria de Fotos e Vídeos' }
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
          keyFeatures={productFamily.keyFeatures}
          images={productImages}
          category="Drone Profissional"
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
      
      {/* Downloads Section */}
      <section id="downloads" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-deep mb-4">Material de Apoio</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Documentos técnicos, manuais e materiais de apoio para o {productFamily.name}
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
      
      {/* Gallery Section */}
      <section id="gallery" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-navy-deep mb-4">Galeria de Fotos e Vídeos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore imagens e vídeos do {productFamily.name} em ação
            </p>
          </div>
          
          {/* Applications Section */}
          <div className="mb-12">
            <ProductApplications
              applications={productFamily.applications}
              title="Aplicações"
            />
          </div>
          
          {/* Videos Section */}
          <div>
            <ProductVideoGallery
              videos={productFamily.videos}
              title="Vídeos"
            />
          </div>
        </div>
      </section>
      
      <Footer />
      <MobileFloatingCTA />
    </div>
  );
};

export default AutelAlpha;

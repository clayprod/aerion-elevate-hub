import React, { useState } from 'react';
import { ProductHeader } from '@/components/products/ProductHeader';
import { ProductNavigation } from '@/components/products/ProductNavigation';
import { ProductKeyFeatures } from '@/components/products/ProductKeyFeatures';
import { ProductTechnicalData } from '@/components/products/ProductTechnicalData';
import { ProductVintageVideoGallery } from '@/components/products/ProductVintageVideoGallery';
import { ProductPhotoGallery } from '@/components/products/ProductPhotoGallery';
import { ProductApplications } from '@/components/products/ProductApplications';
import { ProductDownloadSection } from '@/components/products/ProductDownloadSection';
import { getProductFamilyBySlug } from '@/data/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EvoMaxV2: React.FC = () => {
  const productFamily = getProductFamilyBySlug('evo-max-v2');
  const [selectedVariant, setSelectedVariant] = useState('4n');

  if (!productFamily) {
    return <div>Produto não encontrado</div>;
  }

  const currentVariant = productFamily.variants.find(v => v.id === selectedVariant) || productFamily.variants[0];

  const downloads = [
    {
      title: 'Brochure EVO Max V2',
      description: 'Catálogo completo da série EVO Max V2',
      url: productFamily.brochure,
      type: 'pdf' as const,
      size: '2.8 MB'
    },
    {
      title: 'Manual do Usuário 4N',
      description: 'Guia completo de operação para EVO Max V2 4N',
      url: '/downloads/EN_EVO_Max_V2_4N_User_Manual.pdf',
      type: 'pdf' as const,
      size: '16.2 MB'
    },
    {
      title: 'Manual do Usuário 4T',
      description: 'Guia completo de operação para EVO Max V2 4T',
      url: '/downloads/EN_EVO_Max_V2_4T_User_Manual.pdf',
      type: 'pdf' as const,
      size: '17.8 MB'
    },
    {
      title: 'Especificações Técnicas',
      description: 'Planilha detalhada com todas as especificações',
      url: '/downloads/EVO_Max_V2_Specifications.docx',
      type: 'doc' as const,
      size: '1.2 MB'
    },
    {
      title: 'Comparativo de Modelos',
      description: 'Comparação detalhada entre 4N e 4T',
      url: '/downloads/EVO_Max_V2_Comparison.doc',
      type: 'doc' as const,
      size: '950 KB'
    },
    {
      title: 'Certificações',
      description: 'Documentos de certificação e conformidade',
      url: '/downloads/EVO_Max_V2_Certifications.pdf',
      type: 'pdf' as const,
      size: '2.9 MB'
    }
  ];

  // Combine all images for the header
  const allImages = [
    ...productFamily.photoGallery.product,
    ...productFamily.photoGallery.lifestyle,
    ...productFamily.photoGallery.details
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <ProductNavigation sections={[]} />
      
      {/* Product Header - E-commerce Layout */}
      <ProductHeader
        name={productFamily.name}
        description={productFamily.description}
        productCodes={productFamily.productCodes}
        keyFeatures={productFamily.keyFeatures}
        images={allImages}
        category="Drone Profissional"
      />
      
      {/* Key Features Section */}
      <section id="key-features" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductKeyFeatures
            features={productFamily.keyFeatures}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Photo Gallery Section */}
      <section id="photo-gallery" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductPhotoGallery
            photoGallery={productFamily.photoGallery}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Video Gallery Section */}
      <section id="video-gallery" className="py-12 bg-gray-light/30">
        <div className="max-w-7xl mx-auto px-6">
          <ProductVintageVideoGallery
            videos={productFamily.videos}
            title={productFamily.name}
          />
        </div>
      </section>
      
      {/* Technical Data Section */}
      <section id="technical-data" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductTechnicalData
            technicalData={productFamily.technicalData}
            specs={currentVariant.specs}
            components={productFamily.components}
            accessoriesIncluded={productFamily.accessoriesIncluded}
            title={currentVariant.name}
          />
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
      
      {/* Downloads Section */}
      <section id="downloads" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ProductDownloadSection
            downloads={downloads}
            title={productFamily.name}
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default EvoMaxV2;

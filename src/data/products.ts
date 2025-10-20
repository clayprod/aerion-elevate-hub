export interface ProductVariant {
  id: string;
  name: string;
  description: string;
  imagePath: string; // Path to folder with numbered images
  specs: Record<string, string>;
}

export interface ProductFamily {
  id: string;
  name: string;
  slug: string;
  description: string;
  youtubeVideoId?: string;
  fallbackImage: string;
  brochure: string;
  variants: ProductVariant[];
  gallery: string[];
  lifestyleImages: string[];
  accessories: string[];
  applications: {
    title: string;
    description: string;
    image: string;
  }[];
  productCodes: {
    sku: string;
    ean?: string;
    ncm?: string;
  };
  keyFeatures: string[];
  technicalData: {
    cadastral?: Record<string, string>;
    commercial?: Record<string, string>;
    logistics?: {
      dimensions: string;
      weight: string;
      cubagem?: string;
      packaging?: string;
    };
  };
  components: string[];
  accessoriesIncluded: string[];
  videos: {
    title: string;
    description: string;
    youtubeId: string;
    thumbnail?: string;
  }[];
  photoGallery: {
    product: string[];
    lifestyle: string[];
    details: string[];
  };
}

export const productFamilies: ProductFamily[] = [
  {
    id: "evo-lite-enterprise",
    name: "EVO Lite Enterprise",
    slug: "evo-lite-enterprise",
    description: "Tecnologia de ponta com custo-benefício superior para operações enterprise.",
    youtubeVideoId: "1MwBSeCUb7w",
    fallbackImage: "/images/lifestyle/construction-1.jpeg",
    brochure: "/downloads/Brochure_Autel_Evo_Lite_Enterprise1_Aerion.pdf",
    productCodes: {
      sku: "EVO-LITE-ENT",
      ean: "7899831301577",
      ncm: "8802.12.00"
    },
    keyFeatures: [
      "Câmera térmica de alta resolução 640×512 com zoom óptico 30x",
      "Tempo de voo de até 42 minutos com bateria de longa duração",
      "Alcance de transmissão de até 15km em condições ideais",
      "Sistema de estabilização gimbal 3-eixos para imagens nítidas",
      "Resistente a condições climáticas adversas (IP55)",
      "Tecnologia AI para reconhecimento automático de objetos",
      "Compatível com múltiplas aplicações profissionais"
    ],
    technicalData: {
      cadastral: {
        "Produto": "Drone Profissional",
        "Código": "EVO-LITE-ENT",
        "Categoria": "Drones Enterprise",
        "Fabricante": "Autel Robotics"
      },
      commercial: {
        "NCM": "8802.12.00",
        "IPI": "0%",
        "Origem": "China",
        "PIS": "1,65%",
        "COFINS": "7,60%"
      },
      logistics: {
        dimensions: "35 x 25 x 15 cm",
        weight: "1.25 kg",
        cubagem: "0.013 m³",
        packaging: "Caixa de transporte profissional"
      }
    },
    components: [
      "Drone EVO Lite Enterprise",
      "Controle remoto com tela integrada",
      "Bateria de alta capacidade",
      "Carregador rápido",
      "Hélices de reserva",
      "Cabo USB-C",
      "Manual de instruções"
    ],
    accessoriesIncluded: [
      "Maleta de transporte profissional",
      "Bateria adicional",
      "Kit de hélices de reserva",
      "Cabo de carregamento",
      "Manual de operação",
      "Certificado de garantia"
    ],
    videos: [
      {
        title: "EVO Lite Enterprise - Demonstração Completa",
        description: "Conheça todas as funcionalidades do EVO Lite Enterprise em ação",
        youtubeId: "1MwBSeCUb7w"
      },
      {
        title: "Tutorial de Operação - EVO Lite Enterprise",
        description: "Aprenda a operar o drone com este tutorial passo a passo",
        youtubeId: "demo-tutorial-evo-lite"
      }
    ],
    photoGallery: {
      product: [
        "/images/products/evo_lite/640t/1.png",
        "/images/products/evo_lite/640t/2.png",
        "/images/products/evo_lite/640t/3.png",
        "/images/products/evo_lite/640t/4.png",
        "/images/products/evo_lite/640t/5.png",
        "/images/products/evo_lite/640t/6.png",
        "/images/products/evo_lite/640t/8.png"
      ],
      lifestyle: [
        "/images/lifestyle/public-safety-1-alpha.jpg",
        "/images/lifestyle/public-safety-2-alpha.jpg",
        "/images/lifestyle/construction-1.jpeg",
        "/images/lifestyle/construction-2.jpg"
      ],
      details: [
        "/images/products/evo_lite/640t/1.png",
        "/images/products/evo_lite/640t/2.png",
        "/images/products/evo_lite/640t/3.png"
      ]
    },
    variants: [
      {
        id: "640t",
        name: "EVO Lite Enterprise 640T",
        description: "Câmera térmica de 640x512 com zoom óptico 30x",
        imagePath: "/images/products/evo_lite/640t",
        specs: {
          "Câmera Térmica": "640×512 @ 25Hz",
          "Zoom Óptico": "30x",
          "Alcance": "3km",
          "Tempo de Voo": "42 min",
          "Peso": "1.25kg"
        }
      },
      {
        id: "6k",
        name: "EVO Lite Enterprise 6K",
        description: "Câmera 4K com zoom óptico 30x e estabilização gimbal",
        imagePath: "/images/products/evo_lite/6k",
        specs: {
          "Câmera": "4K @ 60fps",
          "Zoom Óptico": "30x",
          "Alcance": "15km",
          "Tempo de Voo": "42 min",
          "Peso": "1.25kg"
        }
      }
    ],
    gallery: [
      "/images/products/evo-lite-enterprise-1.png",
      "/images/products/evo-lite-enterprise-2.png",
      "/images/products/evo-lite-enterprise-3.png"
    ],
    lifestyleImages: [
      "/images/lifestyle/evo-lite-public-safety-1.jpg",
      "/images/lifestyle/evo-lite-public-safety-2.jpg"
    ],
    accessories: [
      "/images/accessories/evo-lite-battery.jpg",
      "/images/accessories/evo-lite-case.jpg",
      "/images/accessories/evo-lite-gimbal.jpg"
    ],
    applications: [
      {
        title: "Segurança Pública",
        description: "Patrulhamento, busca e resgate, monitoramento de eventos",
        image: "/images/lifestyle/public-safety-1-alpha.jpg"
      },
      {
        title: "Inspeção Industrial",
        description: "Verificação de equipamentos, monitoramento de infraestrutura",
        image: "/images/lifestyle/oil-and-gas-1.jpg"
      },
      {
        title: "Construção Civil",
        description: "Mapeamento de obras, monitoramento de progresso",
        image: "/images/lifestyle/construction-1.jpeg"
      },
      {
        title: "Resgate e Emergências",
        description: "Operações de resgate, busca de pessoas, resposta a emergências",
        image: "/images/lifestyle/rescue-2.jpg"
      }
    ]
  },
  {
    id: "evo-max-v2",
    name: "EVO Max V2",
    slug: "evo-max-v2",
    description: "Drone profissional com câmeras múltiplas e tecnologia avançada.",
    youtubeVideoId: "IaKUtdAdG5w",
    fallbackImage: "/images/lifestyle/public-safety-3-max.jpg",
    brochure: "/downloads/EVO_Max_Series_V2_Brochure_PT.pdf",
    productCodes: {
      sku: "EVO-MAX-V2",
      ean: "7899831301584",
      ncm: "8802.12.00"
    },
    keyFeatures: [
      "Sistema de câmeras duplas: 4K + Térmica 640×512",
      "Zoom óptico 30x com estabilização avançada",
      "Alcance de transmissão de até 15km",
      "Tempo de voo de até 42 minutos",
      "Resistência IP55 para operações em condições adversas",
      "Tecnologia AI para reconhecimento e rastreamento",
      "Compatível com aplicações táticas e industriais"
    ],
    technicalData: {
      cadastral: {
        "Produto": "Drone Profissional",
        "Código": "EVO-MAX-V2",
        "Categoria": "Drones Enterprise",
        "Fabricante": "Autel Robotics"
      },
      commercial: {
        "NCM": "8802.12.00",
        "IPI": "0%",
        "Origem": "China",
        "PIS": "1,65%",
        "COFINS": "7,60%"
      },
      logistics: {
        dimensions: "40 x 30 x 18 cm",
        weight: "1.6 kg",
        cubagem: "0.022 m³",
        packaging: "Caixa de transporte profissional"
      }
    },
    components: [
      "Drone EVO Max V2",
      "Controle remoto com tela integrada",
      "Bateria de alta capacidade",
      "Carregador rápido",
      "Hélices de reserva",
      "Cabo USB-C",
      "Manual de instruções"
    ],
    accessoriesIncluded: [
      "Maleta de transporte profissional",
      "Bateria adicional",
      "Kit de hélices de reserva",
      "Cabo de carregamento",
      "Manual de operação",
      "Certificado de garantia"
    ],
    videos: [
      {
        title: "EVO Max V2 - Demonstração Completa",
        description: "Conheça todas as funcionalidades do EVO Max V2 em ação",
        youtubeId: "IaKUtdAdG5w"
      },
      {
        title: "Tutorial de Operação - EVO Max V2",
        description: "Aprenda a operar o drone com este tutorial passo a passo",
        youtubeId: "demo-tutorial-evo-max"
      }
    ],
    photoGallery: {
      product: [
        "/images/products/evo_max/4n/1.png",
        "/images/products/evo_max/4n/2.jpg",
        "/images/products/evo_max/4n/4.jpg",
        "/images/products/evo_max/4n/5.jpg",
        "/images/products/evo_max/4n/6.jpg",
        "/images/products/evo_max/4n/8.jpg"
      ],
      lifestyle: [
        "/images/lifestyle/public-safety-3-max.jpg",
        "/images/lifestyle/construction-2.jpg",
        "/images/lifestyle/construction-3.jpg",
        "/images/lifestyle/oil-and-gas-1.jpg"
      ],
      details: [
        "/images/products/evo_max/4n/1.png",
        "/images/products/evo_max/4n/2.jpg",
        "/images/products/evo_max/4n/4.jpg"
      ]
    },
    variants: [
      {
        id: "4n",
        name: "EVO Max V2 4N",
        description: "Câmera 4K com zoom óptico 30x e câmera térmica",
        imagePath: "/images/products/evo_max/4n",
        specs: {
          "Câmera Principal": "4K @ 60fps",
          "Câmera Térmica": "640×512 @ 25Hz",
          "Zoom Óptico": "30x",
          "Alcance": "15km",
          "Tempo de Voo": "42 min"
        }
      },
      {
        id: "4t",
        name: "EVO Max V2 4T",
        description: "Câmera 4K com zoom óptico 30x e câmera térmica 640T",
        imagePath: "/images/products/evo_max/4t",
        specs: {
          "Câmera Principal": "4K @ 60fps",
          "Câmera Térmica": "640×512 @ 25Hz",
          "Zoom Óptico": "30x",
          "Alcance": "15km",
          "Tempo de Voo": "42 min"
        }
      }
    ],
    gallery: [
      "/images/products/evo-max-v2-1.png",
      "/images/products/evo-max-v2-2.png",
      "/images/products/evo-max-v2-3.png"
    ],
    lifestyleImages: [
      "/images/lifestyle/evo-max-public-safety-1.jpg",
      "/images/lifestyle/evo-max-public-safety-2.jpg"
    ],
    accessories: [
      "/images/accessories/evo-max-battery.jpg",
      "/images/accessories/evo-max-case.jpg",
      "/images/accessories/evo-max-gimbal.jpg"
    ],
    applications: [
      {
        title: "Segurança Pública",
        description: "Operações táticas, busca e resgate, monitoramento de eventos",
        image: "/images/lifestyle/public-safety-3-max.jpg"
      },
      {
        title: "Inspeção Industrial",
        description: "Verificação de equipamentos, monitoramento de infraestrutura crítica",
        image: "/images/lifestyle/oil-and-gas-1.jpg"
      },
      {
        title: "Construção Civil",
        description: "Mapeamento de obras, monitoramento de progresso, topografia",
        image: "/images/lifestyle/construction-2.jpg"
      },
      {
        title: "Resgate e Emergências",
        description: "Operações de resgate, busca de pessoas, resposta a emergências",
        image: "/images/lifestyle/rescue-2.jpg"
      }
    ]
  },
  {
    id: "autel-alpha",
    name: "Autel Alpha",
    slug: "autel-alpha",
    description: "Drone profissional com câmera térmica avançada e AI recognition.",
    youtubeVideoId: undefined, // No YouTube video for Autel Alpha yet
    fallbackImage: "/images/lifestyle/public-safety-2-alpha.jpg",
    brochure: "/downloads/Brochure_Autel_Alpha_Aerion.pdf",
    productCodes: {
      sku: "AUTEL-ALPHA",
      ean: "7899831301591",
      ncm: "8802.12.00"
    },
    keyFeatures: [
      "Câmera térmica de alta resolução 640×512 com zoom óptico 30x",
      "Alcance de transmissão de até 21km - o maior da categoria",
      "Tempo de voo de até 45 minutos com bateria otimizada",
      "Resistência IP55 para operações em condições extremas",
      "Tecnologia AI avançada para reconhecimento automático",
      "Sistema de estabilização gimbal 3-eixos profissional",
      "Ideal para operações táticas e de segurança pública"
    ],
    technicalData: {
      cadastral: {
        "Produto": "Drone Profissional",
        "Código": "AUTEL-ALPHA",
        "Categoria": "Drones Enterprise",
        "Fabricante": "Autel Robotics"
      },
      commercial: {
        "NCM": "8802.12.00",
        "IPI": "0%",
        "Origem": "China",
        "PIS": "1,65%",
        "COFINS": "7,60%"
      },
      logistics: {
        dimensions: "42 x 32 x 20 cm",
        weight: "1.6 kg",
        cubagem: "0.027 m³",
        packaging: "Caixa de transporte profissional"
      }
    },
    components: [
      "Drone Autel Alpha",
      "Controle remoto com tela integrada",
      "Bateria de alta capacidade",
      "Carregador rápido",
      "Hélices de reserva",
      "Cabo USB-C",
      "Manual de instruções"
    ],
    accessoriesIncluded: [
      "Maleta de transporte profissional",
      "Bateria adicional",
      "Kit de hélices de reserva",
      "Cabo de carregamento",
      "Manual de operação",
      "Certificado de garantia"
    ],
    videos: [
      {
        title: "Autel Alpha - Demonstração Completa",
        description: "Conheça todas as funcionalidades do Autel Alpha em ação",
        youtubeId: "demo-autel-alpha"
      },
      {
        title: "Tutorial de Operação - Autel Alpha",
        description: "Aprenda a operar o drone com este tutorial passo a passo",
        youtubeId: "demo-tutorial-autel-alpha"
      }
    ],
    photoGallery: {
      product: [
        "/images/products/alpha/1.png",
        "/images/products/alpha/2.png",
        "/images/products/alpha/3.png",
        "/images/products/alpha/4.png",
        "/images/products/alpha/5.png",
        "/images/products/alpha/6.png",
        "/images/products/alpha/7.png",
        "/images/products/alpha/8.png"
      ],
      lifestyle: [
        "/images/lifestyle/public-safety-1-alpha.jpg",
        "/images/lifestyle/public-safety-2-alpha.jpg",
        "/images/lifestyle/construction-3.jpg",
        "/images/lifestyle/construction-4.jpg"
      ],
      details: [
        "/images/products/alpha/1.png",
        "/images/products/alpha/2.png",
        "/images/products/alpha/3.png"
      ]
    },
    variants: [
      {
        id: "alpha",
        name: "Autel Alpha",
        description: "Drone profissional com câmera térmica 640T e zoom óptico 30x",
        imagePath: "/images/products/alpha",
        specs: {
          "Câmera Térmica": "640×512 @ 25Hz",
          "Zoom Óptico": "30x",
          "Alcance": "21km",
          "Tempo de Voo": "45 min",
          "Peso": "1.6kg",
          "IP Rating": "IP55"
        }
      }
    ],
    gallery: [
      "/images/products/autel-alpha-1.png",
      "/images/products/autel-alpha-2.png",
      "/images/products/autel-alpha-3.png"
    ],
    lifestyleImages: [
      "/images/lifestyle/autel-alpha-public-safety-1.jpg",
      "/images/lifestyle/autel-alpha-public-safety-2.jpg"
    ],
    accessories: [
      "/images/accessories/autel-alpha-battery.jpg",
      "/images/accessories/autel-alpha-case.jpg",
      "/images/accessories/autel-alpha-gimbal.jpg"
    ],
    applications: [
      {
        title: "Segurança Pública",
        description: "Operações táticas avançadas, busca e resgate, monitoramento de eventos",
        image: "/images/lifestyle/public-safety-1-alpha.jpg"
      },
      {
        title: "Inspeção Industrial",
        description: "Verificação de equipamentos, monitoramento de infraestrutura crítica",
        image: "/images/lifestyle/oil-and-gas-1.jpg"
      },
      {
        title: "Resgate e Emergências",
        description: "Operações de resgate, busca de pessoas, resposta a emergências",
        image: "/images/lifestyle/rescue-2.jpg"
      },
      {
        title: "Construção Civil",
        description: "Mapeamento de obras, monitoramento de progresso, topografia",
        image: "/images/lifestyle/construction-3.jpg"
      }
    ]
  }
];

export const getProductFamilyBySlug = (slug: string): ProductFamily | undefined => {
  return productFamilies.find(family => family.slug === slug);
};

export const getAllProducts = (): ProductFamily[] => {
  return productFamilies;
};

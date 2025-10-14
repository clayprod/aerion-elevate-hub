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

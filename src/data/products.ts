export interface ProductVariant {
  id: string;
  name: string;
  description: string;
  imagePath: string; // Path to folder with numbered images
  specs: Record<string, Record<string, string>>;
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
    description: "Solução compacta e portátil ideal para levantamentos topográficos rápidos, mapeamento de áreas e inspeções térmicas. Combina mobilidade excepcional com câmera térmica 640×512 ou sensor RGB de 20MP, oferecendo o equilíbrio perfeito entre performance profissional e portabilidade para operações ágeis no campo.",
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
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável compacto",
            "Peso (com bateria e gimbal)": "866 g",
            "Dimensões dobrado": "210×123×95 mm",
            "Dimensões desdobrado": "433×516×95 mm",
            "Distância diagonal": "368 mm",
            "Classificação IP": "Não especificado"
          },
          "DESEMPENHO DE VOO": {
            "Autonomia máxima": "40 min",
            "Velocidade máxima": "19 m/s",
            "Resistência ao vento": "12 m/s",
            "Altitude máxima": "7.000 m",
            "Distância de transmissão": "12 km",
            "Peso máximo decolagem": "806 g"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Sim",
            "Resolução térmica": "640×512",
            "Termógrafo": "Microbolômetro VOX",
            "Zoom digital térmico": "20x",
            "Distância focal térmica": "9.1 mm",
            "Faixa de temperatura": "-20°C a 150°C / 0°C a 350°C",
            "Precisão temperatura": "±3°C ou ±3%"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor RGB": "CMOS 1/2\", 48 MP",
            "Abertura": "f/2.8",
            "FOV": "83.4° (DFOV)",
            "Distância focal equiv.": "24 mm",
            "Resolução de foto": "8000×6000",
            "Resolução de vídeo": "4K@30fps",
            "Zoom digital": "16x"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "3 eixos",
            "Número de câmeras": "2 (Térmica + RGB)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS+GLONASS+Galileo+BDS",
            "Módulo RTK": "Não",
            "Navegação visual": "Padrão"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "Tridirecional",
            "Sensores": "3 direções"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "2.4/5.8 GHz",
            "Controle remoto": "Tela integrado",
            "Rede A-Mesh": "Não",
            "Anti-interferência": "Padrão"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "LiPo 3S, 5.000 mAh",
            "Troca a quente": "Não",
            "Tensão carregamento": "12.75V"
          },
          "RECURSOS ESPECIAIS": {
            "Voo autônomo": "Básico",
            "Planejamento 3D": "Básico",
            "Reconhecimento IA": "Sim"
          },
          "SOFTWARE E COMPATIBILIDADE": {
            "App de controle": "Autel Enterprise"
          }
        }
      },
      {
        id: "6k",
        name: "EVO Lite Enterprise 6K",
        description: "Câmera 4K com zoom óptico 30x e estabilização gimbal",
        imagePath: "/images/products/evo_lite/6k",
        specs: {
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável compacto",
            "Peso (com bateria e gimbal)": "866 g",
            "Dimensões dobrado": "210×123×95 mm",
            "Dimensões desdobrado": "433×516×95 mm",
            "Distância diagonal": "368 mm",
            "Classificação IP": "Não especificado"
          },
          "DESEMPENHO DE VOO": {
            "Autonomia máxima": "40 min",
            "Velocidade máxima": "19 m/s",
            "Resistência ao vento": "12 m/s",
            "Altitude máxima": "7.000 m",
            "Distância de transmissão": "12 km",
            "Peso máximo decolagem": "866 g"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Não"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor RGB": "CMOS 1\", 20 MP",
            "Abertura": "f/2.8 a f/11",
            "FOV": "82° (DFOV)",
            "Distância focal equiv.": "29 mm",
            "Resolução de foto": "5472×3076 / 3840×2160",
            "Resolução de vídeo": "4K@30fps",
            "Zoom digital": "16x",
            "ISO máximo": "48.000 (modo noturno)"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "3 eixos",
            "Número de câmeras": "1 (RGB)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS+GLONASS+Galileo+BDS",
            "Módulo RTK": "Não",
            "Navegação visual": "Padrão"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "Tridirecional",
            "Sensores": "3 direções"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "2.4/5.8 GHz",
            "Controle remoto": "Tela integrado",
            "Rede A-Mesh": "Não",
            "Anti-interferência": "Padrão"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "LiPo 3S, 5.000 mAh",
            "Troca a quente": "Não",
            "Tensão carregamento": "12.75V"
          },
          "RECURSOS ESPECIAIS": {
            "Voo autônomo": "Básico",
            "Planejamento 3D": "Básico",
            "Reconhecimento IA": "Sim"
          },
          "SOFTWARE E COMPATIBILIDADE": {
            "App de controle": "Autel Enterprise"
          }
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
    description: "Plataforma profissional robusta com sistema de câmeras triplas e tecnologia omnidirecional de evitação de obstáculos. Equipado com câmera térmica 640×512, zoom óptico até 160x e visão noturna Starlight, é a escolha definitiva para operações críticas em segurança pública, energia e inspeções industriais de longo alcance até 20km.",
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
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável robusto",
            "Peso (com bateria e gimbal)": "1700 g",
            "Dimensões dobrado": "562×651×147 mm",
            "Dimensões desdobrado": "562×651×147 mm",
            "Classificação IP": "IP43"
          },
          "DESEMPENHO DE VOO": {
            "Autonomia máxima": "42 min",
            "Velocidade máxima": "23 m/s",
            "Resistência ao vento": "12 m/s",
            "Distância de transmissão": "20 km",
            "Peso máximo decolagem": "1999 g",
            "Qualidade transmissão": "1080P@60fps",
            "Latência transmissão": "<150ms"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Sim",
            "Resolução térmica": "640×512",
            "Termógrafo": "Microbolômetro VOX",
            "Zoom digital térmico": "20x",
            "Distância focal térmica": "9.1 mm",
            "Faixa de temperatura": "-20°C a 150°C / 0°C a 550°C"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor RGB": "CMOS 1/1.28\", 50 MP",
            "Abertura": "f/1.85",
            "FOV": "85°",
            "Distância focal equiv.": "20 mm",
            "Resolução de foto": "8192×6144",
            "Resolução de vídeo": "4K@30fps",
            "Zoom digital": "8x"
          },
          "VISÃO NOTURNA / STARLIGHT": {
            "Possui visão noturna": "Sim",
            "Sensor Starlight": "2.3 MP, LUX 0.0001",
            "Resolução vídeo noturna": "1920×1200 @ 30P",
            "Zoom digital noturno": "8x"
          },
          "SENSORES E MEDIÇÃO": {
            "Telêmetro laser": "Sim (5-1200m)",
            "Precisão laser": "±(1m+D*0.15%)"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "3 eixos (Fusion 4N V2)",
            "Número de câmeras": "3 (Térmica + RGB + Starlight)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS+GLONASS+Galileo+BDS",
            "Módulo RTK": "Opcional",
            "Precisão RTK": "Centimétrica",
            "Navegação visual": "SLAM alta precisão"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "720° omnidirecional",
            "Sensores": "Múltiplas direções"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "900MHz / 2.4 / 5.2 / 5.8 GHz",
            "Controle remoto": "Autel V3 (tela 7.9\")",
            "Resolução tela": "2048×1536",
            "Brilho da tela": "2000 nits",
            "Rede A-Mesh": "Sim",
            "Anti-interferência": "Superior"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "ABX41-D inteligente",
            "Detecção bateria local": "Sim (ABX41-D)"
          },
          "RECURSOS ESPECIAIS": {
            "Voo autônomo": "Autonomy Engine",
            "Planejamento 3D": "Sim",
            "Reconhecimento IA": "Sim"
          },
          "SOFTWARE E COMPATIBILIDADE": {
            "App de controle": "Autel Enterprise",
            "Combinação alto-falante": "Opcional",
            "EVO Nest (base auto)": "Opcional"
          }
        }
      },
      {
        id: "4t",
        name: "EVO Max V2 4T",
        description: "Câmera 4K com zoom óptico 30x e câmera térmica 640T",
        imagePath: "/images/products/evo_max/4t",
        specs: {
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável robusto",
            "Peso (com bateria e gimbal)": "1665 g",
            "Dimensões dobrado": "576×660×149 mm",
            "Dimensões desdobrado": "576×600×149 mm",
            "Classificação IP": "IP43"
          },
          "DESEMPENHO DE VOO": {
            "Autonomia máxima": "42 min",
            "Velocidade máxima": "23 m/s",
            "Resistência ao vento": "12 m/s",
            "Distância de transmissão": "20 km",
            "Peso máximo decolagem": "1999 g",
            "Qualidade transmissão": "1080P@60fps",
            "Latência transmissão": "<150ms"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Sim",
            "Resolução térmica": "640×512",
            "Termógrafo": "Microbolômetro VOX",
            "Zoom digital térmico": "10x",
            "Distância focal térmica": "9.1 mm",
            "Faixa de temperatura": "-20°C a 150°C / 0°C a 550°C"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor RGB": "CMOS 1/2\", 48 MP",
            "Abertura": "f/2.8",
            "FOV": "83.4°",
            "Distância focal equiv.": "24 mm",
            "Resolução de foto": "8000×6000",
            "Resolução de vídeo": "4K@30fps"
          },
          "CÂMERA ZOOM / TELEOBJETIVA": {
            "Possui câmera zoom": "Sim",
            "Sensor zoom": "CMOS 1/2\", 48 MP",
            "Zoom óptico": "10x",
            "Zoom híbrido máximo": "160x",
            "Resolução vídeo zoom": "30P 4000×3000",
            "ISO zoom": "100-25600",
            "Alcance observação": "Até 2 km"
          },
          "SENSORES E MEDIÇÃO": {
            "Telêmetro laser": "Sim (5-1200m)",
            "Precisão laser": "±(1m+D*0.15%)"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "3 eixos (Fusion 4T V2)",
            "Número de câmeras": "3 (Térmica + RGB + Zoom)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS+GLONASS+Galileo+BDS",
            "Módulo RTK": "Opcional",
            "Precisão RTK": "Centimétrica",
            "Navegação visual": "SLAM alta precisão"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "720° omnidirecional",
            "Sensores": "Múltiplas direções"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "900MHz / 2.4 / 5.2 / 5.8 GHz",
            "Controle remoto": "Autel V3 (tela 7.9\")",
            "Resolução tela": "2048×1536",
            "Brilho da tela": "2000 nits",
            "Rede A-Mesh": "Sim",
            "Anti-interferência": "Superior"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "ABX41-D inteligente",
            "Detecção bateria local": "Sim (ABX41-D)"
          },
          "RECURSOS ESPECIAIS": {
            "Voo autônomo": "Autonomy Engine",
            "Planejamento 3D": "Sim",
            "Reconhecimento IA": "Sim"
          },
          "SOFTWARE E COMPATIBILIDADE": {
            "App de controle": "Autel Enterprise",
            "Combinação alto-falante": "Opcional",
            "EVO Nest (base auto)": "Opcional"
          }
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
    description: "O drone industrial mais avançado da categoria com sistema de câmeras quíntuplo e tecnologia dual-térmica. Com zoom híbrido de até 560x, telêmetro laser de 2000m, RTK integrado de precisão milimétrica e sistema de troca a quente de baterias, o Autel Alpha é a solução definitiva para missões táticas complexas, inspeções de infraestrutura crítica e operações de longo alcance até 8km.",
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
        title: "Autel Alpha - O novo rei dos drones",
        description: "Conheça o drone profissional mais avançado da linha Autel",
        youtubeId: "N8R7epI0m1M"
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
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Industrial dobrável",
            "Peso (com bateria e gimbal)": "6340 g",
            "Dimensões dobrado": "455×203×248 mm (sem hélices)",
            "Dimensões desdobrado": "1205×580×278 mm",
            "Distância diagonal": "814 mm",
            "Classificação IP": "IP55"
          },
          "DESEMPENHO DE VOO": {
            "Autonomia máxima": "40 min",
            "Velocidade máxima": "24 m/s",
            "Resistência ao vento": "12 m/s",
            "Distância de transmissão": "20 km",
            "Peso máximo decolagem": "8400 g",
            "Qualidade transmissão": "1080P@60fps",
            "Latência transmissão": "<150ms"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Sim (Dual)",
            "Resolução térmica": "640×512 (dual)",
            "Termógrafo": "Microbolômetro VOX",
            "Zoom digital térmico": "50x",
            "Distância focal térmica": "13mm (curto) / 45mm (longo)"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor RGB": "CMOS 48 MP",
            "Abertura": "f/2.8",
            "FOV": "84°",
            "Distância focal equiv.": "24 mm",
            "Resolução de foto": "8000×6000",
            "Resolução de vídeo": "4K"
          },
          "CÂMERA ZOOM / TELEOBJETIVA": {
            "Possui câmera zoom": "Sim",
            "Sensor zoom": "CMOS 8 MP",
            "Zoom óptico": "35x",
            "Zoom híbrido máximo": "560x",
            "Resolução vídeo zoom": "4K",
            "ISO zoom": "Ultra-sensível até 160.000",
            "Alcance observação": "Até 8 km"
          },
          "SENSORES E MEDIÇÃO": {
            "Telêmetro laser": "Sim (10-2000m)",
            "Precisão laser": "<400m: ±1m; >400m: D × 0.3%"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "DG 135T (próxima geração)",
            "Número de câmeras": "5 (Térmica dual + RGB + Zoom + Laser)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS+GLONASS+Galileo+BDS",
            "Módulo RTK": "Integrado (antena dupla)",
            "Precisão RTK": "Milimétrica",
            "Navegação visual": "GNSS + SLAM adaptativo"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "720° omnidirecional definitivo",
            "Sensores": "Visão dual + fisheye + radar milimétrico",
            "Alcance detecção": "6 direções + radar"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "900MHz / 2.4 / 5.2 / 5.8 GHz",
            "Controle remoto": "Autel V3 (tela 7.9\")",
            "Resolução tela": "2048×1536",
            "Brilho da tela": "2000 nits",
            "Rede A-Mesh": "Sim",
            "Anti-interferência": "Superior"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "Dual-battery 237Wh cada",
            "Troca a quente": "Sim"
          },
          "RECURSOS ESPECIAIS": {
            "Voo autônomo": "Autonomy Engine avançado",
            "Planejamento 3D": "Sim",
            "Reconhecimento IA": "Sim",
            "Expansão de carga útil": "Sim (flexível)"
          },
          "SOFTWARE E COMPATIBILIDADE": {
            "App de controle": "Autel Enterprise"
          }
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

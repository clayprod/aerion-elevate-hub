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
    link?: string;
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
      ean: "Pendente",
      ncm: "8802.12.00"
    },
    keyFeatures: [
      "Câmera térmica de alta resolução 640×512 com zoom digital térmico 20x",
      "Tempo de voo de até 40 minutos com bateria de longa duração",
      "Alcance de transmissão de até 12km em condições ideais",
      "Sistema de estabilização gimbal 3-eixos para imagens nítidas",
      "Design compacto e dobrável para máxima portabilidade",
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
        description: "Câmera térmica de 640x512 com zoom digital térmico 20x",
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
            "Anti-interferência": "Padrão",
            "Streaming de vídeo": "RTMP / RTSP"
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
        description: "Câmera 4K com zoom digital 16x e estabilização gimbal",
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
            "Anti-interferência": "Padrão",
            "Streaming de vídeo": "RTMP / RTSP"
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
        image: "/images/lifestyle/public-safety-1-alpha.jpg",
        link: "/solucoes/seguranca"
      },
      {
        title: "Inspeção Industrial",
        description: "Verificação de equipamentos, monitoramento de infraestrutura",
        image: "/images/lifestyle/oil-and-gas-1.jpg",
        link: "/solucoes/industrial"
      },
      {
        title: "Construção Civil",
        description: "Mapeamento de obras, monitoramento de progresso",
        image: "/images/lifestyle/construction-1.jpeg",
        link: "/solucoes/construcao"
      },
      {
        title: "Resgate e Emergências",
        description: "Operações de resgate, busca de pessoas, resposta a emergências",
        image: "/images/lifestyle/rescue-2.jpg",
        link: "/solucoes/resgate"
      }
    ]
  },
  {
    id: "evo-max-v2",
    name: "EVO Max V2",
    slug: "evo-max-v2",
    description: "Plataforma profissional robusta com sistema de câmeras triplas e tecnologia omnidirecional de evitação de obstáculos. Equipado com câmera térmica 640×512, zoom óptico até 35x (4N) ou 10x (4T) com zoom híbrido até 160x e visão noturna Starlight, é a escolha definitiva para operações críticas em segurança pública, energia e inspeções industriais de longo alcance até 20km.",
    youtubeVideoId: "IaKUtdAdG5w",
    fallbackImage: "/images/lifestyle/public-safety-3-max.jpg",
    brochure: "/downloads/EVO Max Series.V2_Brochure_PT.pdf",
    productCodes: {
      sku: "EVO-MAX-V2",
      ean: "Pendente",
      ncm: "8802.12.00"
    },
    keyFeatures: [
      "Sistema de câmeras triplas: 4K + Térmica 640×512 + Starlight",
      "Zoom óptico até 35x (4N) ou 10x (4T) com estabilização avançada",
      "Alcance de transmissão de até 20km",
      "Tempo de voo de até 42 minutos",
      "Resistência IP43 para operações em condições adversas",
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
        description: "Câmera 4K com zoom digital 8x, câmera térmica e visão noturna Starlight",
        imagePath: "/images/products/evo_max/4n",
        specs: {
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável robusto",
            "Peso (com bateria e gimbal)": "1700 g (bateria ABX41-D, gimbal Fusion 4N V2 e hélices incluídos)",
            "Dimensões do fuselagem (desdobrado, incl. hélices)": "563×657×147 mm",
            "Distância diagonal": "467 mm",
            "Classificação IP": "IP43"
          },
          "HÉLICES (PROPELLERS)": {
            "Tamanho": "11 polegadas, 1158",
            "Passo": "5.8 polegadas",
            "Material": "Nylon + Fibra de Carbono",
            "Peso": "10.3 g",
            "Velocidade máxima de rotação": "7500 RPM"
          },
          "TEMPERATURA E ARMAZENAMENTO": {
            "Temperatura de operação": "-20℃ a +50℃ (sem carga) / -20℃ a +40℃ (carga completa)",
            "Armazenamento interno": "128GB interno, 64GB disponível*",
            "Nota armazenamento": "*O espaço disponível restante varia com diferentes versões de firmware",
            "Cartões microSD suportados": "Class 10, UHS-3 ou superior, até 1TB"
          },
          "DESEMPENHO DE VOO": {
            "Velocidade máxima de subida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Ludicrous: 8 m/s",
            "Velocidade máxima de descida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Ludicrous: 6 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 10 m/s, Padrão: 15 m/s (frente/trás), 10 m/s (lateral), Ludicrous: 23 m/s (frente), 18 m/s (trás), 20 m/s (lateral)",
            "Nota velocidade": "*Sem vento, próximo ao nível do mar",
            "Teto máximo de serviço acima do nível do mar": "4500 metros (usando bateria ABX41-D)",
            "Altitude máxima de voo*": "China/UE: Não mais que 120 metros, EUA: Não mais que 400 pés",
            "Nota altitude": "*A altitude pode ser configurada de 20 a 800 metros no app de voo. Para configurar altitude acima do exigido por lei, é necessária aprovação das autoridades",
            "Tempo máximo de voo*": "42 minutos",
            "Nota tempo voo": "*Dados de teste de laboratório em ambiente sem vento na velocidade de 8 m/s durante voo horizontal, apenas para referência",
            "Distância máxima de voo*": "25 km",
            "Nota distância": "*Dados de teste de laboratório em ambiente sem vento na velocidade de 14 m/s durante voo horizontal, apenas para referência",
            "Tempo máximo de pairar*": "37 minutos",
            "Nota pairar": "*Dados de teste de laboratório em ambiente sem vento durante pairar, apenas para referência",
            "Resistência máxima ao vento": "Fase de decolagem e pouso: 10.7 m/s, Fase de cruzeiro: 12 m/s",
            "Ângulo máximo de inclinação": "Lento: 10°, Suave: 30°, Padrão: 30°, Ludicrous: 36°",
            "Velocidade angular máxima": "Eixo de inclinação: 300°/s, Eixo de guinada: 120°/s",
            "Precisão de pairar - Verticalmente": "±0.1 m (quando posicionamento visual funciona normalmente) / ±0.5 m (quando GNSS funciona normalmente)",
            "Precisão de pairar - Horizontalmente": "±0.3 m (quando posicionamento visual funciona normalmente) / ±0.5 m (quando sistema de posicionamento de alta precisão funciona normalmente)",
            "Peso máximo de decolagem": "1999 g",
            "Peso máximo de decolagem (certificação C2 UE)": "1890 g"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Sim",
            "Termógrafo": "Microbolômetro VOX não resfriado",
            "Lente": "FOV: 61°, Distância focal: 9.1 mm, Abertura: f/1.0, Distância de foco: 2.2 m ~ ∞",
            "Taxa de zoom digital equivalente": "1-16x zoom digital",
            "Diferença de temperatura equivalente ao ruído": "≤50mK@25℃, F#1.0",
            "Pitch de pixel": "12 um",
            "Banda espectral": "8-14 um",
            "Método de medição de temperatura": "Medição de temperatura de ponto central/Ponto específico/Área",
            "Faixa de medição de temperatura": "Modo High Gain: -20℃ a 150℃, Modo Low Gain: 0 a 550℃",
            "Precisão de medição de temperatura": "±2℃ ou leitura ±2% (usar o maior valor) @ temperatura ambiente de -10℃ a 50℃",
            "Distância de medição de temperatura": "1-100 m",
            "Alerta de temperatura": "Suportado (limiares de alarme de alta/baixa temperatura, coordenadas e valores)",
            "Paleta": "White Hot/Black Hot/Ironbow/Rainbow 1/Rainbow 2/Lava/Arctic/Ironbow/Medical/Tint",
            "Resolução térmica": "640×512",
            "Tamanho de foto": "640×512",
            "Modo de fotografia": "Single",
            "Formato de foto": "JPG* (*as imagens contêm informações de temperatura e são analisadas por SDK dedicado e ferramentas PC)",
            "Resolução de vídeo": "640×512@30fps / 640×512@25fps",
            "Nota vídeo térmico": "*Devido a diferenças nos fornecedores de sensores de imagem térmica, as duas especificações são enviadas em lotes mistos. A especificação exata está sujeita ao produto real comprado",
            "Bitrate máximo de vídeo": "10Mbps",
            "Formato de vídeo": "MP4",
            "Sistema de arquivos suportado": "exFAT/FAT32"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor de imagem": "1/0.98\" CMOS, 50MP efetivos",
            "Lente": "DFOV: 85.01°, Distância focal equivalente: 23.52 mm, Abertura: f/1.85, Foco: 0.5 m ~ ∞",
            "Faixa ISO": "Auto/Manual: ISO100-ISO6400, Modo Noturno: ISO100-ISO320000 (auto)",
            "Velocidade do obturador": "Captura: 8s-1/10000s, Gravação: 1/30s-1/10000s",
            "Zoom": "1-8x zoom digital",
            "Tamanho de foto": "JPG: 4096×3072, 8192×6144; DNG: 4000×3000",
            "Modo de fotografia": "Single",
            "Resolução de vídeo": "4000×3000@30fps",
            "Modo noturno vídeo": "2400×1800@30fps",
            "Bitrate máximo de vídeo": "60Mbps",
            "Formato de vídeo": "MP4",
            "Legendas de vídeo": "Suportado",
            "Codificação de vídeo": "H.264/H.265",
            "Sistema de arquivos suportado": "exFAT/FAT32"
          },
          "VISÃO NOTURNA / STARLIGHT": {
            "Possui visão noturna": "Sim",
            "Sensor de imagem": "1.69\" CMOS, 2.3MP efetivos",
            "Lente": "DFOV: 52°±2°, Distância focal efetiva: 11.2 mm, Abertura: f/1.4, Foco: 10 m ~ ∞",
            "Pitch de pixel": "12 um",
            "Faixa ISO": "Auto/Manual: ISO100-ISO440000, Modo Noturno: ISO100-ISO440000 (auto)",
            "Velocidade do obturador": "Captura: 8s-1/10000s, Gravação: 1/30s-1/10000s",
            "Zoom": "1-8x zoom digital",
            "Tamanho de foto": "JPG: 1920×1200",
            "Modo de fotografia": "Single",
            "Resolução de vídeo": "1920×1200@30fps",
            "Bitrate máximo de vídeo": "20Mbps",
            "Formato de vídeo": "MP4",
            "Legendas de vídeo": "Suportado",
            "Codificação de vídeo": "H.264/H.265",
            "Sistema de arquivos suportado": "exFAT/FAT32"
          },
          "SENSORES E MEDIÇÃO": {
            "Telêmetro laser": "Sim",
            "Comprimento de onda": "905 nm",
            "Segurança do laser": "Classe 1",
            "Precisão de medição": "±(1 m + D×0.15%)*",
            "Nota precisão laser": "*Onde D é a distância até um plano refletor vertical",
            "Alcance de medição": "5-1200 m"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "Fusion 4N V2",
            "Peso do gimbal": "258 g",
            "Alcance mecânico": "Inclinação: -135° a 45°, Rolagem: -50° a 50°, Panorâmica: -45° a 45°",
            "Alcance controlável": "Inclinação: -90° a 30°",
            "Sistema de estabilização": "Gimbal mecânico 3 eixos (inclinação, rolagem, panorâmica)",
            "Velocidade máxima de controle": "Inclinação: 100°/s",
            "Faixa de vibração angular": "< 0.005°",
            "Número de câmeras": "3 (Térmica + RGB + Starlight)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS + Galileo + BDS + GLONASS",
            "Módulo RTK": "Opcional",
            "Precisão RTK": "Centimétrica",
            "Navegação visual": "SLAM alta precisão"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "720° omnidirecional",
            "Sensores": "Múltiplas direções"
          },
          "SISTEMA DE EVITAÇÃO DE OBSTÁCULOS VISUAL": {
            "Alcance de detecção - Frente": "0.5 ~ 30 m",
            "Alcance de detecção - Trás": "0.5 ~ 25 m",
            "Alcance de detecção - Lateral": "0.5 ~ 40 m",
            "Alcance de detecção - Cima": "0.5 ~ 40 m",
            "Alcance de detecção - Baixo": "0.5 ~ 35 m",
            "FOV - Frente e Trás": "60°(H), 80°(V)",
            "FOV - Cima": "180° (lateral), 120° (frente e trás)",
            "FOV - Baixo": "180° (lateral), 120° (frente e trás)",
            "Ambiente operacional - Frente, trás, lateral e cima": "A superfície tem texturas ricas, sob ambiente de iluminação suficiente (>15 lux, ambiente de iluminação fluorescente interno normal)",
            "Ambiente operacional - Baixo": "A superfície tem texturas ricas, e a superfície é um material difuso com refletividade >20% (paredes, árvores, humanos, etc.), sob ambiente de iluminação suficiente (>15 lux, ambiente de iluminação fluorescente interno normal)"
          },
          "SISTEMA DE RADAR DE ONDAS MILIMÉTRICAS": {
            "Frequência de transmissão": "24G: 24.0-24.25 GHz, 60G: 60-64 GHz",
            "EIRP - 60G": "≤20dBm (CE/UKCA/FCC)",
            "EIRP - 24G": "≤20dBm (CE/UKCA/FCC), ≤13dBm (SRRC)",
            "Alcance de detecção - Radar 60G - Cima": "0.3 ~ 18 m @ linha de transmissão de alta tensão",
            "Alcance de detecção - Radar 60G - Baixo": "0.15 ~ 40 m @ piso de concreto",
            "Alcance de detecção - Radar 60G - Frente e Trás": "0.15 ~ 18 m @ linha de transmissão de alta tensão, com velocidade de voo 10 m/s",
            "Alcance de detecção - Radar 60G - Lateral": "0.15 ~ 18 m @ linha de transmissão de alta tensão, com velocidade de voo 10 m/s",
            "Alcance de detecção - Radar 24G - Baixo": "0.8 ~ 12 m @ piso de concreto",
            "FOV - Horizontal (6dB)": "±30°/±15° (60G/24G)",
            "FOV - Vertical (6dB)": "±40°/±15° (60G/24G)",
            "Ambiente operacional - Radar 60G": "Suporta evitação de obstáculos para todas as condições climáticas para vidro, água, linha de transmissão, edifícios e árvores em 6 direções. Sua distância de evitação de obstáculos varia com a capacidade do obstáculo de refletir ondas eletromagnéticas e seu tamanho de superfície",
            "Ambiente operacional - Radar 24G": "Suporta detecção para baixo, e seu alcance de detecção varia com o material do solo. Por exemplo, o alcance de detecção do solo de cimento é de 12 metros, e o alcance de detecção da grama com espessura de mais de 3 cm é inferior a 6 metros"
          },
          "WI-FI": {
            "Protocolo": "802.11a/b/g/n/ac/ax",
            "Frequência operacional - 2.4G": "2.400–2.476GHz*, 2.400–2.4835GHz",
            "Frequência operacional - 5.2G": "5.15-5.25GHz**, 5.17-5.25GHz***",
            "Frequência operacional - 5.8G": "5.725-5.829GHz*, 5.725-5.850GHz",
            "Nota frequências": "*Aplica-se apenas a regiões SRRC, **Aplica-se apenas a regiões FCC, CE (Alemanha excluída) e UKCA, ***Aplica-se apenas à Alemanha. Nota: Algumas frequências estão disponíveis apenas em algumas regiões ou apenas para uso interno. Para detalhes, consulte as leis e regulamentos locais",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED); ≤20dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30dBm (FCC); ≤23dBm (CE/UKCA)",
            "EIRP - 5.8G": "≤30dBm (FCC/ISED/SRRC); ≤14dBm (CE/UKCA)"
          },
          "TRANSMISSÃO DE VÍDEO": {
            "Frequência operacional - 900M": "902-928MHz*",
            "Frequência operacional - 2.4G": "2.400–2.476GHz**, 2.400–2.4835GHz",
            "Frequência operacional - 5.2G": "5.15-5.25GHz***, 5.17-5.25GHz****",
            "Frequência operacional - 5.8G": "5.725-5.829GHz**, 5.725-5.850GHz",
            "Nota frequências transmissão": "*Aplicável apenas a regiões FCC e ISED, **Aplicável apenas a regiões SRRC, ***Aplicável apenas a regiões FCC, CE (Alemanha excluída) e UKCA, ****Aplica-se apenas à Alemanha. Nota: Algumas frequências estão disponíveis apenas em algumas regiões ou apenas para uso interno. Para detalhes, consulte as leis e regulamentos locais",
            "EIRP - 900M": "≤30dBm (FCC/ISED)",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED); ≤20dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30dBm (FCC); ≤23 dBm (CE/UKCA)",
            "EIRP - 5.8G": "≤30dBm(FCC/ISED/SRRC); ≤14dBm(CE/UKCA)",
            "Distância máxima de transmissão*": "FCC: 15km, SRRC/CE: 8km",
            "Nota distância transmissão": "*Sem interferência e bloqueio"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "900MHz / 2.4 / 5.2 / 5.8 GHz",
            "Controle remoto": "Autel V3 (tela 7.9\")",
            "Resolução tela": "2048×1536",
            "Brilho da tela": "2000 nits",
            "Rede A-Mesh": "Sim",
            "Anti-interferência": "Superior",
            "Streaming de vídeo": "RTMP / RTSP",
            "Suporte para SIM Card 4G": "Sim"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "ABX41-D inteligente",
            "Troca a quente": "Sim*",
            "Nota troca quente": "*A função de troca a quente de bateria deve ser habilitada no app de voo com antecedência",
            "Detecção bateria local": "Sim (ABX41-D)"
          },
          "STROBE": {
            "Strobe integrado": "Sim"
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
        description: "Câmera 4K com zoom óptico 10x e câmera térmica 640×512",
        imagePath: "/images/products/evo_max/4t",
        specs: {
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável robusto",
            "Peso (com bateria e gimbal)": "1665 g (bateria ABX41-D, gimbal Fusion 4T V2 e hélices incluídos)",
            "Dimensões do fuselagem (desdobrado, incl. hélices)": "563×657×147 mm",
            "Distância diagonal": "467 mm",
            "Classificação IP": "IP43"
          },
          "HÉLICES (PROPELLERS)": {
            "Tamanho": "11 polegadas, 1158",
            "Passo": "5.8 polegadas",
            "Material": "Nylon + Fibra de Carbono",
            "Peso": "10.3 g",
            "Velocidade máxima de rotação": "7500 RPM"
          },
          "TEMPERATURA E ARMAZENAMENTO": {
            "Temperatura de operação": "-20℃ a +50℃ (sem carga) / -20℃ a +40℃ (carga completa)",
            "Armazenamento interno": "128GB interno, 64GB disponível*",
            "Nota armazenamento": "*O espaço disponível restante varia com diferentes versões de firmware",
            "Cartões microSD suportados": "Class 10, UHS-3 ou superior, até 1TB"
          },
          "DESEMPENHO DE VOO": {
            "Velocidade máxima de subida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Ludicrous: 8 m/s",
            "Velocidade máxima de descida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Ludicrous: 6 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 10 m/s, Padrão: 15 m/s (frente/trás), 10 m/s (lateral), Ludicrous: 23 m/s (frente), 18 m/s (trás), 20 m/s (lateral)",
            "Nota velocidade": "*Sem vento, próximo ao nível do mar",
            "Teto máximo de serviço acima do nível do mar": "4500 metros (usando bateria ABX41-D)",
            "Altitude máxima de voo*": "China/UE: Não mais que 120 metros, EUA: Não mais que 400 pés",
            "Nota altitude": "*A altitude pode ser configurada de 20 a 800 metros no app de voo. Para configurar altitude acima do exigido por lei, é necessária aprovação das autoridades",
            "Tempo máximo de voo*": "42 minutos",
            "Nota tempo voo": "*Dados de teste de laboratório em ambiente sem vento na velocidade de 8 m/s durante voo horizontal, apenas para referência",
            "Distância máxima de voo*": "25 km",
            "Nota distância": "*Dados de teste de laboratório em ambiente sem vento na velocidade de 14 m/s durante voo horizontal, apenas para referência",
            "Tempo máximo de pairar*": "37 minutos",
            "Nota pairar": "*Dados de teste de laboratório em ambiente sem vento durante pairar, apenas para referência",
            "Resistência máxima ao vento": "Fase de decolagem e pouso: 10.7 m/s, Fase de cruzeiro: 12 m/s",
            "Ângulo máximo de inclinação": "Lento: 10°, Suave: 30°, Padrão: 30°, Ludicrous: 36°",
            "Velocidade angular máxima": "Eixo de inclinação: 300°/s, Eixo de guinada: 120°/s",
            "Precisão de pairar - Verticalmente": "±0.1 m (quando posicionamento visual funciona normalmente) / ±0.5 m (quando GNSS funciona normalmente)",
            "Precisão de pairar - Horizontalmente": "±0.3 m (quando posicionamento visual funciona normalmente) / ±0.5 m (quando sistema de posicionamento de alta precisão funciona normalmente)",
            "Peso máximo de decolagem": "1999 g",
            "Peso máximo de decolagem (certificação C2 UE)": "1890 g"
          },
          "CÂMERA TÉRMICA": {
            "Possui câmera térmica": "Sim",
            "Termógrafo": "Microbolômetro VOX não resfriado",
            "Lente": "FOV: 61°, Distância focal: 9.1 mm, Abertura: f/1.0, Distância de foco: 2.2 m ~ ∞",
            "Taxa de zoom digital equivalente": "1-16x zoom digital",
            "Diferença de temperatura equivalente ao ruído": "≤50mK@25℃, F#1.0",
            "Pitch de pixel": "12 um",
            "Banda espectral": "8-14 um",
            "Método de medição de temperatura": "Medição de temperatura de ponto central/Ponto específico/Área",
            "Faixa de medição de temperatura": "Modo High Gain: -20℃ a 150℃, Modo Low Gain: 0 a 550℃",
            "Precisão de medição de temperatura": "±2℃ ou leitura ±2% (usar o maior valor) @ temperatura ambiente de -10℃ a 50℃",
            "Distância de medição de temperatura": "1-100 m",
            "Alerta de temperatura": "Suportado (limiares de alarme de alta/baixa temperatura, coordenadas e valores)",
            "Paleta": "White Hot/Black Hot/Ironbow/Rainbow 1/Rainbow 2/Lava/Arctic/Ironbow/Medical/Tint",
            "Resolução térmica": "640×512",
            "Tamanho de foto": "640×512",
            "Modo de fotografia": "Single",
            "Formato de foto": "JPG* (*as imagens contêm informações de temperatura e são analisadas por SDK dedicado e ferramentas PC)",
            "Resolução de vídeo": "640×512@30fps / 640×512@25fps",
            "Nota vídeo térmico": "*Devido a diferenças nos fornecedores de sensores de imagem térmica, as duas especificações são enviadas em lotes mistos. A especificação exata está sujeita ao produto real comprado",
            "Bitrate máximo de vídeo": "10Mbps",
            "Formato de vídeo": "MP4",
            "Sistema de arquivos suportado": "exFAT/FAT32"
          },
          "CÂMERA RGB PRINCIPAL": {
            "Sensor de imagem": "1/2\" CMOS, 48MP efetivos",
            "Lente": "DFOV: 83.4°, Distância focal equivalente: 24 mm, Abertura: f/2.8, Foco: 1.5 m ~ ∞",
            "Faixa ISO": "Auto/Manual: ISO100-ISO6400, Modo Noturno: ISO100-ISO320000 (auto)",
            "Velocidade do obturador": "Captura: 8s-1/10000s, Gravação: 1/30s-1/10000s",
            "Zoom": "1-2.6x zoom digital",
            "Tamanho de foto": "JPG: 4000×3000, 8000×6000; DNG: 4000×3000",
            "Modo de fotografia": "Single",
            "Resolução de vídeo": "4000×3000@30fps",
            "Modo noturno vídeo": "2400×1800@30fps",
            "Bitrate máximo de vídeo": "60Mbps",
            "Formato de vídeo": "MP4",
            "Legendas de vídeo": "Suportado",
            "Codificação de vídeo": "H.264/H.265",
            "Sistema de arquivos suportado": "exFAT/FAT32"
          },
          "CÂMERA ZOOM / TELEOBJETIVA": {
            "Possui câmera zoom": "Sim",
            "Sensor de imagem": "1/2\" CMOS, 48MP efetivos",
            "Lente": "DFOV: 40°-10.3°, Distância focal equivalente: 64-234 mm, Abertura: f/2.8-f/4.8, Foco: 2 m ~ ∞",
            "Faixa ISO": "Auto/Manual: ISO100-ISO6400",
            "Velocidade do obturador": "Captura: 8s-1/10000s, Gravação: 1/30s-1/10000s",
            "Zoom": "2.7-10x zoom óptico contínuo, 20x zoom híbrido, 160x zoom digital",
            "Tamanho de foto": "JPG: 4000×3000, 8000×6000; DNG: 4000×3000",
            "Modo de fotografia": "Single",
            "Resolução de vídeo": "4000×3000@30fps",
            "Bitrate máximo de vídeo": "60Mbps",
            "Formato de vídeo": "MP4",
            "Legendas de vídeo": "Suportado",
            "Codificação de vídeo": "H.264/H.265",
            "Sistema de arquivos suportado": "exFAT/FAT32"
          },
          "SENSORES E MEDIÇÃO": {
            "Telêmetro laser": "Sim",
            "Comprimento de onda": "905 nm",
            "Segurança do laser": "Classe 1",
            "Precisão de medição": "±(1 m + D×0.15%)*",
            "Nota precisão laser": "*Onde D é a distância até um plano refletor vertical",
            "Alcance de medição": "5-1200 m"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "Fusion 4T V2",
            "Peso do gimbal": "214 g",
            "Alcance mecânico": "Inclinação: -135° a 45°, Rolagem: -50° a 50°, Panorâmica: -45° a 45°",
            "Alcance controlável": "Inclinação: -90° a 30°",
            "Sistema de estabilização": "Gimbal mecânico 3 eixos (inclinação, rolagem, panorâmica)",
            "Velocidade máxima de controle": "Inclinação: 100°/s",
            "Faixa de vibração angular": "< 0.005°",
            "Número de câmeras": "3 (Térmica + RGB + Zoom)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS + Galileo + BDS + GLONASS",
            "Módulo RTK": "Opcional",
            "Precisão RTK": "Centimétrica",
            "Navegação visual": "SLAM alta precisão"
          },
          "EVITAÇÃO DE OBSTÁCULOS": {
            "Sistema de evitação": "720° omnidirecional",
            "Sensores": "Múltiplas direções"
          },
          "SISTEMA DE EVITAÇÃO DE OBSTÁCULOS VISUAL": {
            "Alcance de detecção - Frente": "0.5 ~ 30 m",
            "Alcance de detecção - Trás": "0.5 ~ 25 m",
            "Alcance de detecção - Lateral": "0.5 ~ 40 m",
            "Alcance de detecção - Cima": "0.5 ~ 40 m",
            "Alcance de detecção - Baixo": "0.5 ~ 35 m",
            "FOV - Frente e Trás": "60°(H), 80°(V)",
            "FOV - Cima": "180° (lateral), 120° (frente e trás)",
            "FOV - Baixo": "180° (lateral), 120° (frente e trás)",
            "Ambiente operacional - Frente, trás, lateral e cima": "A superfície tem texturas ricas, sob ambiente de iluminação suficiente (>15 lux, ambiente de iluminação fluorescente interno normal)",
            "Ambiente operacional - Baixo": "A superfície tem texturas ricas, e a superfície é um material difuso com refletividade >20% (paredes, árvores, humanos, etc.), sob ambiente de iluminação suficiente (>15 lux, ambiente de iluminação fluorescente interno normal)"
          },
          "SISTEMA DE RADAR DE ONDAS MILIMÉTRICAS": {
            "Frequência de transmissão": "24G: 24.0-24.25 GHz, 60G: 60-64 GHz",
            "EIRP - 60G": "≤20dBm (CE/UKCA/FCC)",
            "EIRP - 24G": "≤20dBm (CE/UKCA/FCC), ≤13dBm (SRRC)",
            "Alcance de detecção - Radar 60G - Cima": "0.3 ~ 18 m @ linha de transmissão de alta tensão",
            "Alcance de detecção - Radar 60G - Baixo": "0.15 ~ 40 m @ piso de concreto",
            "Alcance de detecção - Radar 60G - Frente e Trás": "0.15 ~ 18 m @ linha de transmissão de alta tensão, com velocidade de voo 10 m/s",
            "Alcance de detecção - Radar 60G - Lateral": "0.15 ~ 18 m @ linha de transmissão de alta tensão, com velocidade de voo 10 m/s",
            "Alcance de detecção - Radar 24G - Baixo": "0.8 ~ 12 m @ piso de concreto",
            "FOV - Horizontal (6dB)": "±30°/±15° (60G/24G)",
            "FOV - Vertical (6dB)": "±40°/±15° (60G/24G)",
            "Ambiente operacional - Radar 60G": "Suporta evitação de obstáculos para todas as condições climáticas para vidro, água, linha de transmissão, edifícios e árvores em 6 direções. Sua distância de evitação de obstáculos varia com a capacidade do obstáculo de refletir ondas eletromagnéticas e seu tamanho de superfície",
            "Ambiente operacional - Radar 24G": "Suporta detecção para baixo, e seu alcance de detecção varia com o material do solo. Por exemplo, o alcance de detecção do solo de cimento é de 12 metros, e o alcance de detecção da grama com espessura de mais de 3 cm é inferior a 6 metros"
          },
          "WI-FI": {
            "Protocolo": "802.11a/b/g/n/ac/ax",
            "Frequência operacional - 2.4G": "2.400–2.476GHz*, 2.400–2.4835GHz",
            "Frequência operacional - 5.2G": "5.15-5.25GHz**, 5.17-5.25GHz***",
            "Frequência operacional - 5.8G": "5.725-5.829GHz*, 5.725-5.850GHz",
            "Nota frequências": "*Aplica-se apenas a regiões SRRC, **Aplica-se apenas a regiões FCC, CE (Alemanha excluída) e UKCA, ***Aplica-se apenas à Alemanha. Nota: Algumas frequências estão disponíveis apenas em algumas regiões ou apenas para uso interno. Para detalhes, consulte as leis e regulamentos locais",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED); ≤20dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30dBm (FCC); ≤23dBm (CE/UKCA)",
            "EIRP - 5.8G": "≤30dBm (FCC/ISED/SRRC); ≤14dBm (CE/UKCA)"
          },
          "TRANSMISSÃO DE VÍDEO": {
            "Frequência operacional - 900M": "902-928MHz*",
            "Frequência operacional - 2.4G": "2.400–2.476GHz**, 2.400–2.4835GHz",
            "Frequência operacional - 5.2G": "5.15-5.25GHz***, 5.17-5.25GHz****",
            "Frequência operacional - 5.8G": "5.725-5.829GHz**, 5.725-5.850GHz",
            "Nota frequências transmissão": "*Aplicável apenas a regiões FCC e ISED, **Aplicável apenas a regiões SRRC, ***Aplicável apenas a regiões FCC, CE (Alemanha excluída) e UKCA, ****Aplica-se apenas à Alemanha. Nota: Algumas frequências estão disponíveis apenas em algumas regiões ou apenas para uso interno. Para detalhes, consulte as leis e regulamentos locais",
            "EIRP - 900M": "≤30dBm (FCC/ISED)",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED); ≤20dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30dBm (FCC); ≤23 dBm (CE/UKCA)",
            "EIRP - 5.8G": "≤30dBm(FCC/ISED/SRRC); ≤14dBm(CE/UKCA)",
            "Distância máxima de transmissão*": "FCC: 15km, SRRC/CE: 8km",
            "Nota distância transmissão": "*Sem interferência e bloqueio"
          },
          "COMUNICAÇÃO E CONTROLE": {
            "Frequência operacional": "900MHz / 2.4 / 5.2 / 5.8 GHz",
            "Controle remoto": "Autel V3 (tela 7.9\")",
            "Resolução tela": "2048×1536",
            "Brilho da tela": "2000 nits",
            "Rede A-Mesh": "Sim",
            "Anti-interferência": "Superior",
            "Streaming de vídeo": "RTMP / RTSP",
            "Suporte para SIM Card 4G": "Sim"
          },
          "BATERIA E ENERGIA": {
            "Tipo de bateria": "ABX41-D inteligente",
            "Troca a quente": "Sim*",
            "Nota troca quente": "*A função de troca a quente de bateria deve ser habilitada no app de voo com antecedência",
            "Detecção bateria local": "Sim (ABX41-D)"
          },
          "STROBE": {
            "Strobe integrado": "Sim"
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
        image: "/images/lifestyle/public-safety-3-max.jpg",
        link: "/solucoes/seguranca"
      },
      {
        title: "Inspeção Industrial",
        description: "Verificação de equipamentos, monitoramento de infraestrutura crítica",
        image: "/images/lifestyle/oil-and-gas-1.jpg",
        link: "/solucoes/industrial"
      },
      {
        title: "Construção Civil",
        description: "Mapeamento de obras, monitoramento de progresso, topografia",
        image: "/images/lifestyle/construction-2.jpg",
        link: "/solucoes/construcao"
      },
      {
        title: "Resgate e Emergências",
        description: "Operações de resgate, busca de pessoas, resposta a emergências",
        image: "/images/lifestyle/rescue-2.jpg",
        link: "/solucoes/resgate"
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
      ean: "Pendente",
      ncm: "8802.12.00"
    },
    keyFeatures: [
      "Câmera térmica dual 640×512 com zoom óptico 35x",
      "Alcance de transmissão de até 20km - o maior da categoria",
      "Tempo de voo de até 40 minutos com bateria otimizada",
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
            "Anti-interferência": "Superior",
            "Streaming de vídeo": "RTMP / RTSP"
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
        image: "/images/lifestyle/public-safety-1-alpha.jpg",
        link: "/solucoes/seguranca"
      },
      {
        title: "Inspeção Industrial",
        description: "Verificação de equipamentos, monitoramento de infraestrutura crítica",
        image: "/images/lifestyle/oil-and-gas-1.jpg",
        link: "/solucoes/industrial"
      },
      {
        title: "Resgate e Emergências",
        description: "Operações de resgate, busca de pessoas, resposta a emergências",
        image: "/images/lifestyle/rescue-2.jpg",
        link: "/solucoes/resgate"
      },
      {
        title: "Construção Civil",
        description: "Mapeamento de obras, monitoramento de progresso, topografia",
        image: "/images/lifestyle/construction-3.jpg",
        link: "/solucoes/construcao"
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

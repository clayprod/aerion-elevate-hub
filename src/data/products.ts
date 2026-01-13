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
    description: "Plataforma compacta e portátil com cargas úteis intercambiáveis: versão 640T com câmera térmica 640×512 + sensor visível de 48 MP e versão 6K com sensor 1\" de 20 MP. Autonomia de até 40 minutos, alcance de transmissão de 12 km (FCC) ou 6 km (CE) e sistema de detecção tridirecional tornam o EVO Lite Enterprise ideal para inspeções, segurança pública e mapeamentos ágeis.",
    youtubeVideoId: "1MwBSeCUb7w",
    fallbackImage: "/images/lifestyle/construction-1.jpeg",
    brochure: "/downloads/Brochure_Autel_Evo Lite Enterprise1_Aerion.pdf",
    productCodes: {
      sku: "EVO-LITE-ENT",
      ean: "Varia conforme versão",
      ncm: "8806.22.00"
    },
    keyFeatures: [
      "Cargas úteis intercambiáveis: 640T (térmica 640×512 + visível 48 MP) ou 6K (sensor 1\" 20 MP)",
      "Autonomia de até 40 minutos com resistência ao vento de 10.7 m/s",
      "Transmissão de até 12 km (FCC) ou 6 km (CE) com Smart Controller SE V2",
      "Sistema de detecção tridirecional com alcance de até 30 m",
      "Design dobrável de 866 g para transporte rápido em campo",
      "Tecnologia de visão computacional e IA para inspeções e segurança",
      "Bateria inteligente 6175 mAh com recarga rápida de 63.75 W"
    ],
    technicalData: {
      cadastral: {
        "Produto": "Drone Profissional",
        "Código": "EVO-LITE-ENT",
        "Categoria": "Drones Enterprise",
        "Fabricante": "Autel Robotics"
      },
      commercial: {
        "NCM": "8806.22.00",
        "IPI": "13%",
        "Origem": "China",
        "PIS": "1,65%",
        "COFINS": "7,60%",
        "GTIN EVO Lite 6K Enterprise (Tela 6.0\")": "6924991132738",
        "GTIN EVO Lite 6K Enterprise (Tela 7.9\")": "889520218771",
        "GTIN EVO Lite 640T Enterprise (Tela 6.0\")": "6924991135760",
        "GTIN EVO Lite 640T Enterprise (Tela 7.9\")": "889520219068"
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
        description: "Carga útil dual com câmera térmica 640×512 e sensor visível 48 MP, zoom digital até 16x",
        imagePath: "/images/products/evo_lite/640t",
        specs: {
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável compacto",
            "Peso (com bateria e gimbal)": "866 g (bateria e gimbal incluídos)",
            "Peso máximo de decolagem": "866 g",
            "Dimensões dobrado": "210×123×95 mm (inclui hélices)",
            "Dimensões desdobrado": "433×516×95 mm (inclui hélices)",
            "Distância diagonal": "368 mm",
            "Velocidade máxima de rotação": "8000 rpm",
            "Classificação IP": "Não especificado"
          },
          "HÉLICES (PROPELLERS)": {
            "Tamanho": "8.5 polegadas (8530)",
            "Material": "Moldagem por injeção",
            "Peso": "7.5 g"
          },
          "DESEMPENHO DE VOO": {
            "Velocidade máxima de subida": "Lento: 3 m/s, Suave: 3 m/s, Padrão: 5 m/s, Modo Sport: 6 m/s",
            "Velocidade máxima de descida": "Lento: 3 m/s, Suave: 2 m/s, Padrão: 3 m/s, Modo Sport: 4 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 5 m/s, Padrão: 10 m/s, Modo Sport: 18 m/s",
            "Nota velocidade": "*Sem vento, próximo ao nível do mar",
            "Teto máximo de serviço acima do nível do mar": "3000 m",
            "Altitude máxima de voo*": "China/UE: até 120 m | EUA: até 400 pés",
            "Nota altitude": "*Configurável de 0 a 800 m no aplicativo de voo (necessária autorização para exceder limites legais)",
            "Tempo máximo de voo*": "40 minutos",
            "Nota tempo voo": "*Testado em laboratório sem vento a 10 m/s em voo horizontal, apenas para referência",
            "Distância máxima de voo": "24 km",
            "Tempo máximo de pairar*": "37 minutos",
            "Nota pairar": "*Testado em laboratório sem vento durante voo estacionário, apenas para referência",
            "Resistência máxima ao vento": "10.7 m/s",
            "Ângulo máximo de inclinação": "Lento: 15°, Suave: 30°, Padrão: 30°, Modo Sport: 33°",
            "Velocidade angular máxima": "Suave: 60°/s, Padrão: 120°/s, Modo Sport: 200°/s",
            "Nota modo Sport": "*No modo Sport, os sensores de colisão podem ser desligados",
            "Temperatura de operação": "-10°C a +40°C",
            "Precisão de pairar - Verticalmente": "±0.1 m (visual) / ±0.3 m (GNSS)",
            "Precisão de pairar - Horizontalmente": "±0.15 m (visual) / ±0.3 m (GNSS)"
          },
          "TEMPERATURA E ARMAZENAMENTO": {
            "Armazenamento interno": "4GB onboard (suporta microSD até 256GB)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS + BDS + GLONASS"
          },
          "COMUNICAÇÃO E TRANSMISSÃO": {
            "Frequência operacional - 2.4G": "2.400–2.476 GHz*, 2.400–2.4835 GHz",
            "Frequência operacional - 5.2G": "5.15-5.25 GHz**",
            "Frequência operacional - 5.8G": "5.725-5.829 GHz*, 5.725-5.850 GHz",
            "Nota frequências": "*Aplicável apenas a regiões SRRC. **Aplicável apenas a regiões FCC. Consulte as legislações locais para frequências disponíveis",
            "Distância máxima de transmissão*": "FCC: 12 km, CE: 6 km",
            "Nota distância": "*Sem interferência ou obstrução",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED/RCM); ≤20dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30dBm (FCC)",
            "EIRP - 5.8G": "≤30dBm (FCC/SRRC/ISED/RCM); ≤14dBm (CE/UKCA)"
          },
          "VISÃO E EVITAÇÃO DE OBSTÁCULOS": {
            "Alcance de detecção - Frente": "0.2 ~ 23 m (velocidade <10 m/s)",
            "Alcance de detecção - Trás": "0.2 ~ 30 m (velocidade <10 m/s)",
            "Alcance de detecção - Baixo": "0.2 ~ 20 m",
            "FOV - Frente": "75° (H), 87° (V)",
            "FOV - Trás": "35° (H), 45° (V)",
            "FOV - Baixo": "99° (H), 83° (V)",
            "Ambiente operacional": "Superfícies com textura e iluminação >15 lux; material difuso com refletividade >20%"
          },
          "CÂMERA WIDE-ANGLE (VISÍVEL)": {
            "Sensor de imagem": "1/2\" CMOS, 48 MP",
            "Lente": "DFOV: 83.4°, Distância focal equivalente: 24 mm, Abertura: f/2.8",
            "Distância de foco": "0.5 m ~ ∞ (foco fixo)",
            "ISO": "Auto/Manual: ISO100 ~ ISO6400",
            "Velocidade do obturador": "1/10000 ~ 1/60 s",
            "Modo antifog": "Suportado",
            "Zoom": "4K: 1-16x digital | 8K: 1-8x digital",
            "Tamanho de foto": "4000×3000, 8000×6000",
            "Formato de foto": "JPG",
            "Resolução de vídeo": "4000×3000@30fps",
            "Formato de vídeo": "MP4/MOV",
            "Codificação de vídeo": "H.265/H.264",
            "Sistema de arquivos": "FAT32/exFAT"
          },
          "CÂMERA TÉRMICA": {
            "Sensor": "Microbolômetro VOX não resfriado",
            "Lente": "FOV: 61°, Distância focal: 9.1 mm, Abertura: f/1.0",
            "Distância de foco": "2.2 m ~ ∞",
            "Sensibilidade (NETD)": "≤50mK@f/1.0, 25°C",
            "Pitch de pixel": "12 µm",
            "Faixa espectral": "8-14 µm",
            "Medição radiométrica": "Ponto central / Ponto / Área retangular",
            "Faixa de temperatura": "-20°C a 150°C (alto ganho); 0 a 550°C (baixo ganho)",
            "Precisão de temperatura": "±3°C ou ±3% (o maior valor) @ -20°C a 60°C",
            "Distância de medição precisa": "1 ~ 25 m",
            "Zoom digital": "1-16x",
            "Alertas de temperatura": "Suporta limites alto/baixo com coordenadas e valores",
            "Paletas": "White Hot, Black Hot, Searing, Rainbow, Grey, Ironbow, Cold & Hot",
            "Tamanho de foto": "640×512",
            "Formato de foto": "JPG (com dados de temperatura)",
            "Resolução de vídeo": "640×512@30fps",
            "Formato de vídeo": "MP4/MOV"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "3 eixos (pitch, roll, yaw)",
            "Alcance mecânico": "Pitch: -135° a 45°, Roll: -50° a 50°, Yaw: -90° a 90°",
            "Alcance controlável": "Pitch: -90° a 30°",
            "Velocidade máxima de controle": "Pitch: 100°/s",
            "Precisão de estabilização": "±0.003°",
            "Número de câmeras": "2 (Visível + Térmica)"
          },
          "CONTROLADOR REMOTO (Autel Smart Controller SE V2)": {
            "Material": "PC + ABS",
            "Dimensões": "226.3×137.7×31.5 mm (antenas dobradas) / 226.3×215.4×31.5 mm (antenas abertas)",
            "Peso": "607 g",
            "Temperatura de operação": "-10°C a +40°C",
            "Temperatura de armazenamento": "Curto prazo: -20°C a +45°C | Médio prazo: 0°C a +30°C | Ideal: +15°C a +25°C",
            "Armazenamento interno": "32GB (24GB disponíveis)",
            "Sistema operacional": "Android 6.0.1 (suporta apps Android de terceiros)",
            "Conectividade": "Wi-Fi 802.11a/b/g/n/ac (2×2 MIMO), Bluetooth 4.2, GNSS GPS/Galileo/BDS/GLONASS",
            "Tela": "1440×720, 60Hz, toque de 10 pontos",
            "Portas": "USB-C (PD/QC até 65W), USB-A (USB 2.0)",
            "Bateria": "Li-Po 1900 mAh, 7.7 V (14.63 Wh) – autonomia 1.5 h (brilho máximo) / 2.5 h (50%), recarga ~90 min",
            "Proteção": "IP43"
          },
          "TRANSMISSÃO DO CONTROLADOR": {
            "Antenas": "Duplas, 1T2R, design destacável",
            "Frequência": "900M: 902-928MHz*, 2.4G: 2.400–2.476GHz**, 2.400–2.4835GHz, 5.2G: 5150-5250MHz***, 5.8G: 5.725-5.829GHz**, 5.725-5.850GHz",
            "Nota frequências": "*FCC/ISED | **SRRC | ***FCC/RCM. Consulte leis locais para uso",
            "EIRP - 900M": "≤30dBm (FCC/ISED)",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED/RCM); ≤20dBm (CE/SRRC)",
            "EIRP - 5.2G": "≤30dBm (FCC/RCM)",
            "EIRP - 5.8G": "≤30dBm (FCC/SRRC/ISED/RCM); ≤14dBm (CE)",
            "Distância máxima de transmissão*": "FCC: 12 km, CE/SRRC: 8 km",
            "Nota distância transmissão": "*Sem interferência ou bloqueio"
          },
          "BATERIA INTELIGENTE": {
            "Tipo": "LiPo 3S inteligente",
            "Capacidade": "6175 mAh",
            "Energia": "68.7 Wh",
            "Tensão": "11.13 V",
            "Tensão máxima de carga": "12.75 V",
            "Potência de carga nominal": "63.75 W",
            "Potência máxima de carga": "78 W",
            "Peso": "309 g",
            "Temperatura de operação": "0°C a +40°C",
            "Temperatura de carga": "+5°C a +45°C",
            "Troca a quente": "Não suportado"
          },
          "CARREGADOR": {
            "Entrada": "100-240V ~ 50/60 Hz, 1.5 A",
            "Portas de saída": "Interface de bateria / USB-A",
            "Interface de carga da bateria": "12.75V⎓5A",
            "Porta USB": "5V⎓3A, 9V⎓2A, 12V⎓1.5A",
            "Potência nominal": "63.75 W (máx.)"
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
        description: "Sensor de 1\" 20 MP com captura 6K, zoom digital 16x e modo antifog",
        imagePath: "/images/products/evo_lite/6k",
        specs: {
          "CATEGORIA E PORTABILIDADE": {
            "Design": "Dobrável compacto",
            "Peso (com bateria e gimbal)": "866 g (bateria e gimbal incluídos)",
            "Peso máximo de decolagem": "866 g",
            "Dimensões dobrado": "210×123×95 mm (inclui hélices)",
            "Dimensões desdobrado": "433×516×95 mm (inclui hélices)",
            "Distância diagonal": "368 mm",
            "Velocidade máxima de rotação": "8000 rpm",
            "Classificação IP": "Não especificado"
          },
          "HÉLICES (PROPELLERS)": {
            "Tamanho": "8.5 polegadas (8530)",
            "Material": "Moldagem por injeção",
            "Peso": "7.5 g"
          },
          "DESEMPENHO DE VOO": {
            "Velocidade máxima de subida": "Lento: 3 m/s, Suave: 3 m/s, Padrão: 5 m/s, Modo Sport: 6 m/s",
            "Velocidade máxima de descida": "Lento: 3 m/s, Suave: 2 m/s, Padrão: 3 m/s, Modo Sport: 4 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 5 m/s, Padrão: 10 m/s, Modo Sport: 18 m/s",
            "Nota velocidade": "*Sem vento, próximo ao nível do mar",
            "Teto máximo de serviço acima do nível do mar": "3000 m",
            "Altitude máxima de voo*": "China/UE: até 120 m | EUA: até 400 pés",
            "Nota altitude": "*Configurável de 0 a 800 m no aplicativo de voo (necessária autorização para exceder limites legais)",
            "Tempo máximo de voo*": "40 minutos",
            "Nota tempo voo": "*Testado em laboratório sem vento a 10 m/s em voo horizontal, apenas para referência",
            "Distância máxima de voo": "24 km",
            "Tempo máximo de pairar*": "37 minutos",
            "Nota pairar": "*Testado em laboratório sem vento durante voo estacionário, apenas para referência",
            "Resistência máxima ao vento": "10.7 m/s",
            "Ângulo máximo de inclinação": "Lento: 15°, Suave: 30°, Padrão: 30°, Modo Sport: 33°",
            "Velocidade angular máxima": "Suave: 60°/s, Padrão: 120°/s, Modo Sport: 200°/s",
            "Nota modo Sport": "*No modo Sport, os sensores de colisão podem ser desligados",
            "Temperatura de operação": "-10°C a +40°C",
            "Precisão de pairar - Verticalmente": "±0.1 m (visual) / ±0.3 m (GNSS)",
            "Precisão de pairar - Horizontalmente": "±0.15 m (visual) / ±0.3 m (GNSS)"
          },
          "TEMPERATURA E ARMAZENAMENTO": {
            "Armazenamento interno": "4GB onboard (suporta microSD até 256GB)"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS + BDS + GLONASS"
          },
          "COMUNICAÇÃO E TRANSMISSÃO": {
            "Frequência operacional - 2.4G": "2.400–2.476 GHz*, 2.400–2.4835 GHz",
            "Frequência operacional - 5.2G": "5.15-5.25 GHz**",
            "Frequência operacional - 5.8G": "5.725-5.829 GHz*, 5.725-5.850 GHz",
            "Nota frequências": "*Aplicável apenas a regiões SRRC. **Aplicável apenas a regiões FCC. Consulte as legislações locais para frequências disponíveis",
            "Distância máxima de transmissão*": "FCC: 12 km, CE: 6 km",
            "Nota distância": "*Sem interferência ou obstrução",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED/RCM); ≤20dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30dBm (FCC)",
            "EIRP - 5.8G": "≤30dBm (FCC/SRRC/ISED/RCM); ≤14dBm (CE/UKCA)"
          },
          "VISÃO E EVITAÇÃO DE OBSTÁCULOS": {
            "Alcance de detecção - Frente": "0.2 ~ 23 m (velocidade <10 m/s)",
            "Alcance de detecção - Trás": "0.2 ~ 30 m (velocidade <10 m/s)",
            "Alcance de detecção - Baixo": "0.2 ~ 20 m",
            "FOV - Frente": "75° (H), 87° (V)",
            "FOV - Trás": "35° (H), 45° (V)",
            "FOV - Baixo": "99° (H), 83° (V)",
            "Ambiente operacional": "Superfícies com textura e iluminação >15 lux; material difuso com refletividade >20%"
          },
          "CÂMERA WIDE-ANGLE (6K)": {
            "Sensor de imagem": "1\" CMOS, 20 MP",
            "Lente": "DFOV: 82°, Distância focal equivalente: 29 mm, Abertura: f/2.8 - f/11",
            "Distância de foco": "0.5 m ~ ∞",
            "ISO": "Auto/Manual: ISO100 ~ ISO6400 (até ISO48000 no modo noturno)",
            "Velocidade do obturador": "1/10000 ~ 1/60 s",
            "Modo antifog": "Suportado",
            "Zoom": "1-16x digital",
            "Tamanho de foto": "5472×3076, 3840×2160",
            "Formato de foto": "JPG",
            "Resolução de vídeo": "3840×2160@30fps",
            "Formato de vídeo": "MP4/MOV",
            "Codificação de vídeo": "H.265/H.264",
            "Sistema de arquivos": "FAT32/exFAT"
          },
          "CÂMERA TÉRMICA": {
            "Disponibilidade": "Não possui"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Tipo de gimbal": "3 eixos (pitch, roll, yaw)",
            "Alcance mecânico": "Pitch: -135° a 45°, Roll: -45° a 45°, Yaw: -90° a 90°",
            "Alcance controlável": "Pitch: -90° a 30°",
            "Velocidade máxima de controle": "Pitch: 100°/s",
            "Precisão de estabilização": "±0.003°",
            "Número de câmeras": "1 (Visível)"
          },
          "CONTROLADOR REMOTO (Autel Smart Controller SE V2)": {
            "Material": "PC + ABS",
            "Dimensões": "226.3×137.7×31.5 mm (antenas dobradas) / 226.3×215.4×31.5 mm (antenas abertas)",
            "Peso": "607 g",
            "Temperatura de operação": "-10°C a +40°C",
            "Temperatura de armazenamento": "Curto prazo: -20°C a +45°C | Médio prazo: 0°C a +30°C | Ideal: +15°C a +25°C",
            "Armazenamento interno": "32GB (24GB disponíveis)",
            "Sistema operacional": "Android 6.0.1 (suporta apps Android de terceiros)",
            "Conectividade": "Wi-Fi 802.11a/b/g/n/ac (2×2 MIMO), Bluetooth 4.2, GNSS GPS/Galileo/BDS/GLONASS",
            "Tela": "1440×720, 60Hz, toque de 10 pontos",
            "Portas": "USB-C (PD/QC até 65W), USB-A (USB 2.0)",
            "Bateria": "Li-Po 1900 mAh, 7.7 V (14.63 Wh) – autonomia 1.5 h (brilho máximo) / 2.5 h (50%), recarga ~90 min",
            "Proteção": "IP43"
          },
          "TRANSMISSÃO DO CONTROLADOR": {
            "Antenas": "Duplas, 1T2R, design destacável",
            "Frequência": "900M: 902-928MHz*, 2.4G: 2.400–2.476GHz**, 2.400–2.4835GHz, 5.2G: 5150-5250MHz***, 5.8G: 5.725-5.829GHz**, 5.725-5.850GHz",
            "Nota frequências": "*FCC/ISED | **SRRC | ***FCC/RCM. Consulte leis locais para uso",
            "EIRP - 900M": "≤30dBm (FCC/ISED)",
            "EIRP - 2.4G": "≤30dBm (FCC/ISED/RCM); ≤20dBm (CE/SRRC)",
            "EIRP - 5.2G": "≤30dBm (FCC/RCM)",
            "EIRP - 5.8G": "≤30dBm (FCC/SRRC/ISED/RCM); ≤14dBm (CE)",
            "Distância máxima de transmissão*": "FCC: 12 km, CE/SRRC: 8 km",
            "Nota distância transmissão": "*Sem interferência ou bloqueio"
          },
          "BATERIA INTELIGENTE": {
            "Tipo": "LiPo 3S inteligente",
            "Capacidade": "6175 mAh",
            "Energia": "68.7 Wh",
            "Tensão": "11.13 V",
            "Tensão máxima de carga": "12.75 V",
            "Potência de carga nominal": "63.75 W",
            "Potência máxima de carga": "78 W",
            "Peso": "309 g",
            "Temperatura de operação": "0°C a +40°C",
            "Temperatura de carga": "+5°C a +45°C",
            "Troca a quente": "Não suportado"
          },
          "CARREGADOR": {
            "Entrada": "100-240V ~ 50/60 Hz, 1.5 A",
            "Portas de saída": "Interface de bateria / USB-A",
            "Interface de carga da bateria": "12.75V⎓5A",
            "Porta USB": "5V⎓3A, 9V⎓2A, 12V⎓1.5A",
            "Potência nominal": "63.75 W (máx.)"
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
    description: "Plataforma profissional robusta com sistema de câmeras triplas e tecnologia omnidirecional de evitação de obstáculos. O modelo 4N oferece câmera térmica 640×512, zoom digital 8x e visão noturna Starlight, enquanto o 4T possui zoom óptico contínuo 2.7-10x com zoom híbrido até 160x. Ambos os modelos são ideais para operações críticas em segurança pública, energia e inspeções industriais com alcance de transmissão de até 15km (FCC) ou 8km (SRRC/CE).",
    youtubeVideoId: "IaKUtdAdG5w",
    fallbackImage: "/images/lifestyle/public-safety-3-max.jpg",
    brochure: "/downloads/EVO Max Series.V2_Brochure_PT.pdf",
    productCodes: {
      sku: "EVO-MAX-V2",
      ean: "Pendente",
      ncm: "8806.22.00"
    },
    keyFeatures: [
      "Sistema de câmeras triplas: 4N (4K + Térmica 640×512 + Starlight) / 4T (4K + Térmica 640×512 + Zoom)",
      "Zoom digital 8x (4N) ou zoom óptico 2.7-10x com zoom híbrido até 160x (4T)",
      "Alcance de transmissão de até 15km (FCC) ou 8km (SRRC/CE)",
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
        "NCM": "8806.22.00",
        "IPI": "13%",
        "Origem": "China",
        "PIS": "1,65%",
        "COFINS": "7,60%",
        "GTIN EVO Max 4T V2": "889520203920",
        "GTIN EVO Max 4N V2": "889520205610"
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
            "Velocidade máxima de subida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Modo Sport: 8 m/s",
            "Velocidade máxima de descida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Modo Sport: 6 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 10 m/s, Padrão: 15 m/s (frente/trás), 10 m/s (lateral), Modo Sport: 23 m/s (frente), 18 m/s (trás), 20 m/s (lateral)",
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
            "Ângulo máximo de inclinação": "Lento: 10°, Suave: 30°, Padrão: 30°, Modo Sport: 36°",
            "Nota modo Sport": "*No modo Sport, os sensores de colisão podem ser desligados",
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
          "CÂMERA WIDE-ANGLE": {
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
            "Controle remoto": "Autel V3 (tela 6.0\" ou 7.9\")",
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
            "Velocidade máxima de subida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Modo Sport: 8 m/s",
            "Velocidade máxima de descida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Modo Sport: 6 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 10 m/s, Padrão: 15 m/s (frente/trás), 10 m/s (lateral), Modo Sport: 23 m/s (frente), 18 m/s (trás), 20 m/s (lateral)",
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
            "Ângulo máximo de inclinação": "Lento: 10°, Suave: 30°, Padrão: 30°, Modo Sport: 36°",
            "Nota modo Sport": "*No modo Sport, os sensores de colisão podem ser desligados",
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
          "CÂMERA WIDE-ANGLE": {
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
            "Controle remoto": "Autel V3 (tela 6.0\" ou 7.9\")",
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
    description: "Plataforma industrial IP55 de alta resistência com gimbal DG-L35T quíntuplo (duas térmicas, câmera wide, zoom 35x e laser). Entrega 40 minutos de voo, alcance de até 30 km, baterias hot swap e navegação Autonomy Engine com sensores visuais 360° e radar milimétrico 60G/24G para operações críticas sem depender de georreferenciamento.",
    youtubeVideoId: undefined, // No YouTube video for Autel Alpha yet
    fallbackImage: "/images/lifestyle/public-safety-2-alpha.jpg",
    brochure: "/downloads/Brochure_Autel_Alpha_Aerion.pdf",
    productCodes: {
      sku: "AUTEL-ALPHA",
      ean: "Pendente",
      ncm: "8806.22.00"
    },
    keyFeatures: [
      "Peso operacional 6.48 kg com MTOM de 8.4 kg e proteção IP55",
      "Autonomia de 40 min, alcance até 30 km e baterias hot swap LiPo 6S",
      "Gimbal DG-L35T com zoom óptico 35x, térmicas 13/45 mm e laser 2000 m",
      "Navegação Autonomy Engine com sensores visuais 360° e radar 60G/24G",
      "Precisão RTK integrada (antena dupla) e hovering ±0.1 m",
      "Smart Controller V3 7.9\" 2000 nits com armazenamento interno 128 GB"
    ],
    technicalData: {
      cadastral: {
        "Produto": "Drone Profissional",
        "Código": "AUTEL-ALPHA",
        "Categoria": "Drones Enterprise",
        "Fabricante": "Autel Robotics"
      },
      commercial: {
        "NCM": "8806.22.00",
        "IPI": "13%",
        "Origem": "China",
        "PIS": "1,65%",
        "COFINS": "7,60%",
        "GTIN Autel Alpha": "889520206136"
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
            "Peso vazio (sem gimbal)": "5535 g (bateria inteligente e hélices incluídas)",
            "Peso operacional": "6480 g (bateria inteligente, gimbal e hélices incluídos)",
            "MTOM (peso máximo de decolagem)": "8400 g",
            "Dimensões desdobrado (incl. hélices)": "1205×980×278 mm",
            "Dimensões desdobrado (sem hélices)": "780×568×278 mm",
            "Dimensões dobrado": "455×263×248 mm (sem hélices)",
            "Distância diagonal": "814 mm",
            "Classificação IP": "IP55"
          },
          "DESEMPENHO DE VOO": {
            "Velocidade máxima de subida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 6 m/s, Modo Sport: 15 m/s",
            "Velocidade máxima de descida": "Lento: 2.5 m/s, Suave: 3 m/s, Padrão: 5 m/s, Modo Sport: 10 m/s",
            "Velocidade máxima de voo*": "Lento: 3 m/s, Suave: 10 m/s, Padrão: 15 m/s (frente/trás), 10 m/s (laterais), Modo Sport: 25 m/s (todas as direções)",
            "Nota velocidade": "*Sem vento, próximo ao nível do mar",
            "Teto máximo de serviço": "4500 m",
            "Altitude máxima (App)": "800 m",
            "Tempo máximo de voo*": "40 minutos (sem vento, 10.5 m/s)",
            "Distância máxima de voo": "30 km (hélice fibra de carbono) / 27.5 km (hélice injetada)",
            "Tempo máximo de pairar*": "38 minutos",
            "Resistência ao vento": "Decolagem/Pouso: 10.7 m/s, Cruzeiro: 12 m/s",
            "Ângulo máximo de inclinação": "Lento: 10°, Suave: 30°, Padrão: 30°, Modo Sport: 36°",
            "Velocidade angular máxima": "Pitch 300°/s, Yaw 120°/s",
            "Temperatura de operação": "-20°C a +50°C",
            "Baterias hot swap": "Suportado"
          },
          "SISTEMA DE POSICIONAMENTO": {
            "GNSS": "GPS + Galileo + BeiDou + GLONASS",
            "Precisão de pairar - Vertical": "±0.1 m (visual) / ±0.3 m (GNSS) / ±0.1 m (RTK FIX)",
            "Precisão de pairar - Horizontal": "±0.15 m (visual) / ±0.3 m (GNSS) / ±0.1 m (RTK FIX)"
          },
          "TRANSMISSÃO": {
            "Frequência operacional": "900M (902-928 MHz)* / 2.4G (2.400–2.4835 GHz)** / 5.2G (5.15-5.25 GHz***, 5.17-5.25 GHz****) / 5.8G (5.725-5.850 GHz**)",
            "Notas frequência": "*FCC/ISED | **SRRC | ***FCC, CE (exceto Alemanha), UKCA | ****Alemanha",
            "Distância máxima de transmissão*": "FCC: 15 km, CE: 8 km",
            "EIRP - 900M": "≤30 dBm (FCC/ISED)",
            "EIRP - 2.4G": "≤30 dBm (FCC/ISED); ≤20 dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30 dBm (FCC); ≤23 dBm (CE/UKCA)",
            "EIRP - 5.8G": "≤30 dBm (FCC/ISED/SRRC); ≤14 dBm (CE/UKCA)"
          },
          "VISÃO E EVITAÇÃO DE OBSTÁCULOS": {
            "Alcance de detecção - Frente": "0.2 - 31 m",
            "Alcance de detecção - Trás": "0.2 - 26 m",
            "Alcance de detecção - Laterais": "0.5 - 45 m",
            "Alcance de detecção - Cima": "0.2 - 45 m",
            "Alcance de detecção - Baixo": "0.2 - 45 m",
            "FOV - Todos os eixos": "90° (H) × 90° (V)",
            "Ambiente operacional": "Superfícies com textura e iluminação >15 lux (material difuso >20% no eixo inferior)"
          },
          "RADAR DE ONDAS MILIMÉTRICAS": {
            "Frequências": "60G: 60-64 GHz | 24G: 24.0-24.25 GHz",
            "EIRP": "60G ≤20 dBm (CE/UKCA/FCC); 24G ≤20 mW (SRRC)",
            "Alcance 60G": "Cima: 0.3-20 m | Baixo: 0.15-40 m | Frente/Trás/Laterais: 0.3-30 m",
            "Alcance 24G": "Baixo: 0.8-20 m",
            "FOV (6 dB)": "Horizontal ±35°/±22° (60G/24G) | Vertical ±30°/±20° (60G/24G)",
            "Notas": "Versões 24G possuem radar superior/desligado e operam apenas com visual em baixa iluminação"
          },
          "WI-FI": {
            "Protocolo": "802.11a/b/g/n/ac/ax",
            "Frequência operacional": "2.4G: 2.400–2.4835 GHz*, 5.2G: 5.15-5.25 GHz**, 5.8G: 5.725-5.850 GHz*",
            "Notas": "*SRRC | **FCC/CE (exceto Alemanha)/UKCA | ***Alemanha",
            "EIRP - 2.4G": "≤30 dBm (FCC/ISED); ≤20 dBm (CE/SRRC/UKCA)",
            "EIRP - 5.2G": "≤30 dBm (FCC); ≤23 dBm (CE/UKCA)",
            "EIRP - 5.8G": "≤30 dBm (FCC/ISED/SRRC); ≤14 dBm (CE/UKCA)"
          },
          "GIMBAL E ESTABILIZAÇÃO": {
            "Modelo": "DG-L35T destacável (design em E)",
            "Dimensões": "144.7×133.3×158.4 mm",
            "Peso": "920 g",
            "Classificação IP": "IP55",
            "Temperatura operação": "-20°C a +50°C",
            "Temperatura armazenamento": "-30°C a +70°C",
            "Armazenamento": "microSD até 256 GB (UHS-I U3/V30 mínimo 30 MB/s)",
            "Alcance mecânico": "Pitch -135° a 45°, Roll -60° a 60°, Yaw -90° a 90°",
            "Alcance controlável": "Pitch -90° a 30°",
            "Velocidade máxima (pitch)": "100°/s",
            "Precisão de vibração": "<0.005°"
          },
          "CÂMERA ZOOM / TELEOBJETIVA": {
            "Sensor": "1/1.8\" CMOS, 8 MP",
            "Distância focal": "7.1 - 171.95 mm (±5%)",
            "Equivalente 35 mm": "34.7 - 838 mm",
            "Abertura": "f/1.61 (wide) - f/5.19 (tele) ±5%",
            "Foco": "10 m ~ ∞",
            "ISO": "Normal ISO100-25600, Super Night ISO100-160000",
            "Obturador": "Foto 0.5s-1/8000s | Vídeo 1/30s-1/8000s",
            "Zoom": "Óptico contínuo 1.4-35x, digital 35-560x",
            "Resolução foto": "3840×2160",
            "Formato foto": "JPG",
            "Vídeo": "3840×2160@30p (MP4)",
            "Bitrate máx.": "30 Mbps",
            "Sistemas de arquivos": "exFAT/FAT32"
          },
          "CÂMERA WIDE-ANGLE": {
            "Sensor": "1/2\" CMOS, 48 MP",
            "Distância focal": "4.49 mm (equiv. 24 mm)",
            "Abertura": "f/2.8",
            "ISO": "ISO100-3200 (auto)",
            "Obturador": "Foto 0.5s-1/8000s | Vídeo 1/30s-1/8000s",
            "Foto": "4000×3000 (JPG)",
            "Vídeo": "4000×3000@25p (MP4)",
            "Bitrate máx.": "30 Mbps",
            "Sistemas de arquivos": "exFAT/FAT32"
          },
          "CÂMERA TÉRMICA 1 (ANGULAR)": {
            "Sensor": "VOx não resfriado",
            "FOV": "42°",
            "Distância focal": "13 mm",
            "Abertura": "f/1.2",
            "Foco": "6 m ~ ∞",
            "Sensibilidade": "≤50 mK@f/1.0 (25°C)",
            "Pitch de pixel": "12 µm",
            "Faixa espectral": "8-14 µm",
            "Faixa de temperatura": "-20°C a 150°C (alto ganho); 0 a 550°C (baixo ganho)",
            "Precisão": "±3°C ou ±3% (maior valor) @ -20°C a 60°C",
            "Distância medição precisa": "5 m",
            "Zoom digital": "1-3.5x",
            "Alertas de temperatura": "Limiares alto/baixo com coordenadas",
            "Paletas": "White Hot, Black Hot, Searing, Rainbow, Grey, Ironbow, Cold & Hot",
            "Foto": "640×512 (JPG com dados de temperatura)",
            "Vídeo": "640×512@25fps (MP4)"
          },
          "CÂMERA TÉRMICA 2 (TELE)": {
            "Sensor": "VOx não resfriado",
            "FOV": "12.3°",
            "Distância focal": "45 mm",
            "Abertura": "f/1.2",
            "Foco": "35 m ~ ∞",
            "Sensibilidade": "≤50 mK@f/1.0 (25°C)",
            "Pitch de pixel": "12 µm",
            "Faixa espectral": "8-14 µm",
            "Faixa de temperatura": "-20°C a 150°C / 0 a 550°C",
            "Precisão": "±5°C ou ±5% (maior valor) @ -20°C a 60°C",
            "Distância medição precisa": "35 m",
            "Zoom digital": "3.5-56x",
            "Alertas de temperatura": "Limiares alto/baixo com coordenadas",
            "Paletas": "White Hot, Black Hot, Searing, Rainbow, Grey, Ironbow, Cold & Hot",
            "Foto": "640×512 (JPG com dados de temperatura)",
            "Vídeo": "640×512@25fps (MP4)"
          },
          "TELÊMETRO LASER": {
            "Comprimento de onda": "905 nm",
            "Precisão": "<400 m: ±1 m | >400 m: D × 0,3%",
            "Alcance de medição": "10 - 2000 m"
          },
          "CONTROLADOR SMART CONTROLLER V3": {
            "Dimensões": "269×189×87 mm (antenas dobradas horiz.), 269×189×173 mm (antenas dobradas vert.), 269×302×87 mm (antenas abertas)",
            "Peso": "1194 g (sem case), 1365 g (com case)",
            "Temperatura operação": "-20°C a +40°C",
            "Temperatura armazenamento": "+15°C a +25°C (1 ano) / 0°C a +30°C (3 meses) / -20°C a +45°C (1 mês)",
            "Proteção": "IP43",
            "Armazenamento interno": "128 GB (sem microSD adicional)",
            "Sistema": "Android 11, suporta apps de terceiros",
            "Vídeo": "Reprodução 4K@24fps H.264/H.265",
            "HDMI": "Saída até 1080p@60fps",
            "USB-C": "Carga PD/QC até 65 W, dados USB 3.1 Gen2",
            "USB-A": "Carga 5V/2A, dados USB 2.0",
            "GNSS": "GPS + Galileo + BeiDou + GLONASS",
            "Wi-Fi": "802.11a/b/g/n/ac (2×2 MIMO)",
            "Bluetooth": "5.0 (≤20 dBm)"
          },
          "TRANSMISSÃO DO CONTROLADOR": {
            "Antenas": "Duplas, 1T2R, design destacável",
            "Frequência": "900M 902-928 MHz*, 2.4G 2.400–2.4835 GHz**, 5.8G 5.725-5.850 GHz**",
            "Notas": "*FCC/ISED | **SRRC (consulte legislações locais)",
            "EIRP - 900M": "≤30 dBm (FCC/ISED)",
            "EIRP - 2.4G": "≤30 dBm (FCC/ISED); ≤20 dBm (CE/SRRC/UKCA)",
            "EIRP - 5.8G": "≤30 dBm (FCC/ISED/SRRC); ≤14 dBm (CE/UKCA)",
            "Distância máxima*": "FCC: 15 km | CE/SRRC: 8 km",
            "Nota distância": "*Sem interferência ou bloqueio"
          },
          "DISPLAY DO CONTROLADOR": {
            "Tipo": "TFT LCD 7.9\"",
            "Brilho": "2000 nits",
            "Resolução": "2048×1536",
            "Taxa de atualização": "60 Hz",
            "Toque": "Suporta multitoque de 10 pontos"
          },
          "BATERIA DO CONTROLADOR": {
            "Tipo": "Li-Po 3S",
            "Capacidade": "5800 mAh",
            "Tensão": "11.55 V",
            "Energia": "67 Wh",
            "Tempo de carga": "≈120 minutos",
            "Autonomia": "2.5 h (brilho máximo) / 4 h (50%)",
            "Substituição": "Não suportado"
          },
          "BATERIA INTELIGENTE": {
            "Dimensões": "200×76.8×50 mm",
            "Tipo": "LiPo 6S",
            "Capacidade": "10000 mAh",
            "Energia": "237 Wh",
            "Tensão": "23.7 V",
            "Tensão máx. carga": "26.7 V",
            "Potência nominal": "180 W",
            "Potência máxima": "260 W",
            "Peso": "995 g",
            "Temperatura operação": "-20°C a +50°C",
            "Temperatura carga": "+10°C a +40°C*",
            "Nota carga": "*Abaixo de +10°C ativa autoaquecimento; acima de +40°C interrompe carga",
            "Armazenamento ideal": "+22°C a +28°C",
            "Armazenamento (temp/umidade)": "-10°C a +30°C, 65±20% RH"
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

/**
 * Busca uma família de produtos pelo slug do banco de dados
 * Retorna Promise para uso com React Query ou async/await
 */
export const getProductFamilyBySlugFromDB = async (slug: string): Promise<ProductFamily | undefined> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: familyDataArray, error } = await supabase
      .from('product_families')
      .select(`
        *,
        product_variants (
          id,
          name,
          slug,
          description,
          image_path,
          specs,
          order_index
        )
      `)
      .eq('slug', slug)
      .eq('active', true)
      .limit(1);

    // Tratar erro PGRST116 (nenhum resultado) como caso normal, não como erro
    if (error) {
      // PGRST116 = nenhum resultado encontrado (não é um erro crítico)
      if (error.code === 'PGRST116' || error.code === '406') {
        return undefined; // Retornar undefined para usar fallback
      }
      // Para outros erros, logar mas não quebrar
      console.warn('Erro ao buscar família do banco:', error);
      return undefined;
    }

    // Se não encontrou dados, retornar undefined para usar fallback
    if (!familyDataArray || familyDataArray.length === 0) {
      return undefined;
    }

    const familyData = familyDataArray[0];

    if (familyData) {
      // Ordenar variantes por order_index
      const sortedVariants = (familyData.product_variants || []).sort((a: any, b: any) => 
        (a.order_index || 0) - (b.order_index || 0)
      );

      // Transformar dados do banco para o formato ProductFamily
      const variants = sortedVariants.map((v: any) => ({
        id: v.slug.split('-').pop() || v.id,
        name: v.name,
        description: v.description,
        imagePath: v.image_path || '',
        specs: v.specs || {},
      }));

      return {
        id: familyData.id,
        name: familyData.name,
        slug: familyData.slug,
        description: familyData.description,
        youtubeVideoId: familyData.youtube_video_id || undefined,
        fallbackImage: familyData.fallback_image || familyData.image_url || '',
        brochure: familyData.brochure || '',
        variants: variants,
        gallery: familyData.gallery || [],
        lifestyleImages: familyData.lifestyle_images || [],
        accessories: familyData.accessories || [],
        applications: familyData.applications || [],
        productCodes: familyData.product_codes || { sku: '', ean: '', ncm: '' },
        keyFeatures: familyData.key_features || [],
        technicalData: familyData.technical_data || {},
        components: familyData.components || [],
        accessoriesIncluded: familyData.accessories_included || [],
        videos: familyData.videos || [],
        photoGallery: familyData.photo_gallery || { product: [], lifestyle: [], details: [] },
      };
    }
  } catch (error) {
    console.warn('Erro ao buscar família do banco, usando fallback:', error);
  }

  // Fallback para dados hardcoded
  return productFamilies.find(family => family.slug === slug);
};

/**
 * Versão síncrona que usa dados hardcoded (mantida para compatibilidade)
 * Tenta buscar do banco se disponível, senão usa fallback
 */
export const getProductFamilyBySlug = (slug: string): ProductFamily | undefined => {
  // Por enquanto, retorna apenas do código hardcoded
  // As páginas devem migrar para usar getProductFamilyBySlugFromDB com React Query
  return productFamilies.find(family => family.slug === slug);
};

export const getAllProducts = (): ProductFamily[] => {
  return productFamilies;
};

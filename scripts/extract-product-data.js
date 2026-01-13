/**
 * Script para extrair dados hardcoded das páginas de produto
 * e popular o banco de dados com product_page_content
 * 
 * Execute: node scripts/extract-product-data.js
 */

// Dados extraídos manualmente das páginas de produto
const productData = {
  "autel-mapper": {
    hero_video_url: "/videos/products/mapper/mapper.mp4",
    hero_poster_url: null,
    highlights: [
      {
        id: "swift-and-accurate",
        title: "Rápido e Preciso",
        description: "Os algoritmos de deep learning da Autel tornam o Autel Mapper um dos softwares de processamento de mapas mais rápidos da indústria, fornecendo reconstrução 2D e 3D altamente precisa, mesmo para objetos pequenos - para modelos e mapas imbatíveis.",
        icon: "Zap",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/26/2023052616308138.png",
        imageType: "png"
      },
      {
        id: "3d-reconstruction",
        title: "Reconstrução 3D",
        description: "O Autel Mapper combina algoritmos tradicionais e de deep learning para melhorar significativamente a completude dos modelos 3D. A qualidade da reconstrução pode ser selecionada entre três opções: alta, média e baixa. Pode reconstruir objetos pequenos completamente e atender às necessidades de várias indústrias.",
        icon: "Box",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519558418.png",
        imageType: "png"
      },
      {
        id: "2d-reconstruction",
        title: "Reconstrução 2D",
        description: "A tecnologia de deep learning da Autel permite adaptação autônoma de algoritmos de IA em diferentes cenários, atendendo ao requisito de precisão 1:500 na indústria de levantamento e mapeamento sem GCPs.",
        icon: "Map",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/26/2023052616261646.png",
        imageType: "png"
      },
      {
        id: "aerial-triangulation",
        title: "Triangulação Aérea",
        description: "O Autel Mapper suporta câmeras roll shutter e global shutter, e seu processamento inteligente de blocos de triangulação aérea pode lidar com grandes volumes de dados. O algoritmo de correspondência avançado pode resolver efetivamente o processamento de dados de diferentes alturas e resoluções.",
        icon: "Triangle",
        image: "/images/products/mapper/triangulacao.gif",
        imageType: "gif"
      },
      {
        id: "real-time-2d",
        title: "2D em Tempo Real",
        description: "Durante o voo, o controle remoto transmite imagens em tempo real para o Autel Mapper para costura 2D em tempo real. Algoritmos avançados de processamento de imagem são usados para gerar imagens ortofoto 2D de alta precisão em tempo real, fornecendo aos operadores no local uma base para ajustar o fluxo de trabalho de forma oportuna.",
        icon: "Clock",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519587267.gif",
        imageType: "gif"
      },
      {
        id: "quick-stitching",
        title: "Costura Rápida",
        description: "Importe em lote imagens capturadas por drones Autel, gere rapidamente mapas 2D e renderizações usando algoritmos avançados de ortoretificação de imagem e algoritmos de costura rápida.",
        icon: "Layers",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/26/2023052616344830.gif",
        imageType: "gif"
      },
      {
        id: "flexible-scalable",
        title: "Flexível e Escalável",
        description: "Importe e exporte com facilidade e utilize recursos de rede ou nuvem para lidar rapidamente com qualquer projeto.",
        icon: "Network",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519564340.png",
        imageType: "png"
      },
      {
        id: "complete-control",
        title: "Controle Completo",
        description: "O workflow único e intuitivo do Autel Mapper significa que os usuários podem se envolver rapidamente em um projeto sem o medo de ficarem sobrecarregados.",
        icon: "Settings",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519568264.png",
        imageType: "png"
      },
      {
        id: "cloud-ready",
        title: "Pronto para Nuvem",
        description: "Utilize a nuvem para saídas e renderizações mais rápidas do que nunca.",
        icon: "Cloud",
        image: "https://www.autelrobotics.com/wp-content/themes/autel/userfiles/images/2023/05/25/2023052519565999.png",
        imageType: "png"
      }
    ],
    specifications: {
      "REQUISITOS DO SISTEMA": {
        "Sistema Operacional": "Windows 10 ou posterior (64-bit)",
        "Tipo": "Reconstrução 2D/3D"
      },
      "ESPECIFICAÇÕES DO COMPUTADOR": {
        "CPU Mínimo": "Intel Core i5 8 series ou AMD Ryzen 5 3000 series",
        "CPU Recomendado": "Intel Core i7 11 series ou mais recente ou AMD Ryzen 7 5000 series ou mais recente",
        "GPU Mínimo": "NVIDIA GeForce GTX1070",
        "GPU Recomendado": "NVIDIA GeForce RTX 2080 Ti ou superior",
        "VRAM Mínimo": "6GB",
        "VRAM Recomendado": "8GB ou superior",
        "RAM Mínimo": "16GB",
        "RAM Recomendado": "32GB ou superior",
        "Armazenamento Mínimo": "200GB de espaço em disco utilizável",
        "Armazenamento Recomendado": "256GB SSD + 2TB Enterprise HDD",
        "Display Mínimo": "1280x1024",
        "Display Recomendado": "1920x1080 ou superior"
      },
      "FUNÇÃO E PERFORMANCE": {
        "Máximo de Imagens Processáveis (Um Nó)": "30.000",
        "Reconstrução 3D - Tarefa Standalone": "500 imagens/1GB de memória livre",
        "Reconstrução 3D - Tempo Necessário": "10.000 imagens em 18 horas",
        "Reconstrução 3D - Precisão": "Nível centimétrico (1:500 mapping accuracy)",
        "Reconstrução 3D - Formatos de Saída": "B3DM, OSGB, OBJ, PLY",
        "Reconstrução 2D - Tarefa Standalone": "500 imagens/1GB de memória livre",
        "Reconstrução 2D - Tempo Necessário": "8000 imagens em 6 horas",
        "Reconstrução 2D - Precisão": "Nível centimétrico (1:500 mapping accuracy)",
        "Reconstrução 2D - Formato de Saída": "GeoTIFF",
        "Quick Stitching - Formatos": "DOM, DSM, visualização 2.5D",
        "Quick Stitching - Plataformas Suportadas": "App, Autel SkyCommand Center, plataformas de terceiros",
        "Quick Stitching - Métodos": "On-the-fly stitching, Rapid processing",
        "Aerial Triangulation - Taxa de Aprovação": "0.98",
        "Aerial Triangulation - Formato": "XML",
        "Dense Point Clouds - Formatos": "PNTS, LAS, XYZ",
        "Rebuild Optimization - KML Import": "Suportado",
        "Rebuild Optimization - Model Reconstruction Processing": "Suportado",
        "Rebuild Optimization - Camera Parameters": "Suportado",
        "Rebuild Optimization - Image POS Data Management": "Suportado",
        "Rebuild Optimization - Ground Control Point (GCP) Management": "Suportado"
      }
    },
    applications: [
      {
        title: "Levantamento e Mapeamento",
        description: "Soluções profissionais para levantamento e mapeamento.",
        image: "/images/solucoes/casos-uso-construcao/levantamentos-topograficos.jpg",
        link: "/solucoes/construcao"
      }
    ],
    videos: [
      {
        youtubeId: "ldQWruVNa1U",
        title: "Autel Mapper",
        description: "Conheça o Autel Mapper, software profissional de mapeamento 2D e 3D",
        thumbnail: undefined
      }
    ]
  }
};

console.log("Dados extraídos das páginas de produto:");
console.log(JSON.stringify(productData, null, 2));

// Este script pode ser expandido para:
// 1. Ler arquivos .tsx diretamente
// 2. Fazer parse dos dados hardcoded
// 3. Popular o banco via Supabase API
// Por enquanto, os dados estão documentados aqui para migração manual

module.exports = productData;


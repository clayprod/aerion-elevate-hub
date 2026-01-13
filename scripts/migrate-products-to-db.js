/**
 * Script para migrar produtos hardcoded para o banco de dados
 * Executa: node scripts/migrate-products-to-db.js
 */

const products = [
  {
    name: "EVO Lite Enterprise",
    slug: "evo-lite-enterprise",
    description: "Plataforma compacta oferecida em duas configurações dedicadas: 640T (câmera térmica 640×512 + sensor visível 48 MP) ou 6K (sensor 1\" de 20 MP). Garante 40 minutos de voo, transmissão até 12 km (FCC) / 6 km (CE) e detecção tridirecional até 30 m para inspeções ágeis e missões de segurança.",
    short_description: "Compacto, Portátil, Eficiente",
    features: [
      "Configurações 640T (térmica + visível) ou 6K (sensor 1\" 20 MP)",
      "Autonomia de 40 min e resistência a ventos de 10.7 m/s",
      "Transmissão até 12 km (FCC) / 6 km (CE)",
      "Detecção tridirecional 0.2-30 m com GNSS GPS/BDS/GLONASS",
    ],
    specifications: {
      autonomy: "40 minutos",
      transmission: "12 km (FCC) / 6 km (CE)",
      detection: "Tridirecional 0.2-30 m",
      gnss: "GPS/BDS/GLONASS"
    },
    image_url: "/images/products/evo_lite/640t/1.png",
    gallery_urls: [
      "/images/products/evo_lite/640t/1.png",
      "/images/products/evo_lite/640t/2.png",
      "/images/products/evo_lite/640t/3.png"
    ],
    category: "Enterprise",
    active: true,
    order_index: 1
  },
  {
    name: "EVO Max V2",
    slug: "evo-max-v2",
    description: "Sistema de câmeras triplas com navegação Autonomy Engine e SLAM 3D que dispensa georreferenciamento e garante voo seguro em ambientes complexos. A versão 4N combina visão térmica 640×512 + Starlight, enquanto a 4T traz zoom óptico 2.7-10x com híbrido até 160x.",
    short_description: "Precisão e Potência em Um Só Drone",
    features: [
      "Navegação SLAM + autonomia de voo sem GNSS (Autonomy Engine)",
      "Câmeras triplas: 4N (Visível + Térmica + Starlight) / 4T (Visível + Térmica + Zoom)",
      "Transmissão até 15 km (FCC) / 8 km (SRRC/CE)",
      "Autonomia de 42 min e resistência IP43 com detecção 720°",
    ],
    specifications: {
      autonomy: "42 minutos",
      transmission: "15 km (FCC) / 8 km (SRRC/CE)",
      navigation: "Autonomy Engine + SLAM 3D",
      protection: "IP43"
    },
    image_url: "/images/products/evo_max/4t/1.png",
    gallery_urls: [
      "/images/products/evo_max/4t/1.png"
    ],
    category: "Enterprise",
    active: true,
    order_index: 2
  },
  {
    name: "Autel Alpha",
    slug: "autel-alpha",
    description: "Drone industrial IP55 com gimbal DG-L35T quíntuplo (duas térmicas, câmera wide, zoom óptico 35x e laser). Oferece 40 minutos de voo, alcance de até 30 km, navegação Autonomy Engine com sensores 360° + radar 60G/24G e baterias hot swap.",
    short_description: "Resistência e Alcance para Operações Críticas",
    features: [
      "Gimbal DG-L35T: zoom óptico 35x, térmicas 13/45 mm e laser 2000 m",
      "Alcance de voo até 30 km (carbono) e 40 min de autonomia",
      "Navegação Autonomy Engine com sensores visuais 360° + radar 60G/24G",
      "Smart Controller V3 7.9\" 2000 nits e baterias hot swap LiPo 6S",
    ],
    specifications: {
      autonomy: "40 minutos",
      range: "30 km",
      protection: "IP55",
      gimbal: "DG-L35T quíntuplo"
    },
    image_url: "/images/products/alpha/1.png",
    gallery_urls: [
      "/images/products/alpha/1.png"
    ],
    category: "Enterprise",
    active: true,
    order_index: 3
  },
  {
    name: "Autel Mapper",
    slug: "autel-mapper",
    description: "Software profissional de reconstrução 2D e 3D com processamento em nuvem ou local, utilizando deep learning para resultados altamente precisos. Processamento rápido e preciso para mapeamento, topografia e inspeções.",
    short_description: "Mapeamento Profissional com Deep Learning",
    features: [
      "Reconstrução 2D e 3D com precisão centimétrica (1:500)",
      "Processamento rápido com algoritmos de deep learning",
      "Suporte para processamento local ou em nuvem",
      "Compatível com drones Autel e múltiplos formatos de saída",
    ],
    specifications: {
      precision: "Centimétrica (1:500)",
      processing: "Local ou em nuvem",
      compatibility: "Drones Autel"
    },
    image_url: "/images/products/mapper/autel-mapper.png",
    gallery_urls: [
      "/images/products/mapper/autel-mapper.png"
    ],
    category: "Software",
    active: true,
    order_index: 4
  }
];

console.log('📦 Produtos para migrar:', products.length);
console.log('\n📋 Lista de produtos:');
products.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} (${p.slug})`);
});

console.log('\n✅ Script criado. Execute via Supabase MCP ou use o admin panel para inserir os dados.');

// Exportar para uso em outros scripts
module.exports = { products };


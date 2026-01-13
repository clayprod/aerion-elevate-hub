/**
 * Script para migrar soluções hardcoded para o banco de dados
 * Executa: node scripts/migrate-solutions-to-db.js
 */

const solutions = [
  {
    name: "Construção e Topografia",
    slug: "construcao",
    description: "Transforme suas obras com tecnologia aérea de ponta. Levantamentos topográficos com precisão centimétrica, modelagem BIM, mapeamento urbano para planejamento territorial e medição de volumes com eficiência incomparável.",
    short_description: "Agilidade e precisão em obras e mapeamento",
    benefits: [
      "Levantamentos topográficos precisos",
      "Modelagem BIM para cronogramas",
      "Mapeamento urbano e planejamento territorial",
      "Medição de volumes de terra",
      "Cadastro urbano e regularização fundiária",
      "Integração com software de projeto",
    ],
    use_cases: [
      "Levantamentos topográficos",
      "Modelagem BIM",
      "Mapeamento urbano",
      "Medição de volumes",
      "Cadastro urbano",
      "Planejamento territorial"
    ],
    image_url: "/images/lifestyle/construction-1.jpeg",
    icon: "Building",
    category: "Construção",
    active: true,
    featured: true,
    order_index: 1
  },
  {
    name: "Inspeção Industrial e Energia",
    slug: "industrial",
    description: "Maximize a eficiência e segurança das suas instalações. Inspeções térmicas avançadas em energia, óleo & gás, mineração, detecção precoce de hotspots e operações BVLOS que reduzem paradas não planejadas em até 60%.",
    short_description: "Precisão e segurança operacional",
    benefits: [
      "Inspeção térmica de painéis solares e equipamentos",
      "Monitoramento de oleodutos e gasodutos (óleo & gás)",
      "Inspeção de minas e pilhas de rejeito (mineração)",
      "Inspeção de linhas de transmissão e torres",
      "Detecção de hotspots e manutenção preditiva",
      "Operações BVLOS em ambientes críticos",
    ],
    use_cases: [
      "Inspeção térmica",
      "Monitoramento de infraestrutura",
      "Detecção de hotspots",
      "Manutenção preditiva",
      "Operações BVLOS"
    ],
    image_url: "/images/lifestyle/oil-and-gas-1.jpg",
    icon: "Factory",
    category: "Industrial",
    active: true,
    featured: true,
    order_index: 2
  },
  {
    name: "Segurança Pública e Defesa Civil",
    slug: "seguranca",
    description: "Amplie suas capacidades operacionais com tecnologia de vigilância avançada. Visão 360°, patrulha inteligente, gestão de tráfego urbano e resposta rápida a emergências com visão noturna de última geração.",
    short_description: "Proteção e resposta estratégica",
    benefits: [
      "Vigilância de áreas extensas 24/7",
      "Patrulhamento inteligente e tático",
      "Gestão de tráfego e monitoramento viário",
      "Fiscalização de trânsito e infrações",
      "Monitoramento de eventos de massa",
      "Resposta rápida com visão noturna",
    ],
    use_cases: [
      "Vigilância 24/7",
      "Patrulhamento",
      "Gestão de tráfego",
      "Monitoramento de eventos",
      "Resposta a emergências"
    ],
    image_url: "/images/lifestyle/public-safety-1-alpha.jpg",
    icon: "Shield",
    category: "Segurança",
    active: true,
    featured: true,
    order_index: 3
  },
  {
    name: "Resgate e Emergências",
    slug: "resgate",
    description: "Salve vidas com tecnologia que não falha. Busca e resgate eficaz, combate a incêndios florestais, localização de vítimas em minutos e avaliação de danos em tempo real, mesmo em áreas remotas.",
    short_description: "Salvamento e preservação de vidas",
    benefits: [
      "Busca e resgate de vítimas com térmica",
      "Prevenção e combate a incêndios florestais",
      "Detecção de focos de incêndio em tempo real",
      "Operações em áreas remotas e desastres",
      "Monitoramento ambiental e queimadas",
      "Coordenação de equipes de resgate",
    ],
    use_cases: [
      "Busca e resgate",
      "Combate a incêndios",
      "Detecção de focos",
      "Operações remotas",
      "Monitoramento ambiental"
    ],
    image_url: "/images/lifestyle/rescue-2.jpg",
    icon: "Siren",
    category: "Resgate",
    active: true,
    featured: true,
    order_index: 4
  }
];

console.log('🎯 Soluções para migrar:', solutions.length);
console.log('\n📋 Lista de soluções:');
solutions.forEach((s, i) => {
  console.log(`${i + 1}. ${s.name} (${s.slug})`);
});

console.log('\n✅ Script criado. Execute via Supabase MCP ou use o admin panel para inserir os dados.');

// Exportar para uso em outros scripts
module.exports = { solutions };


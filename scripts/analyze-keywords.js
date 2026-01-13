import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para corrigir encoding
function fixEncoding(text) {
  if (!text) return text;
  
  // Mapeamento de caracteres malformados para corretos
  const encodingMap = {
    'cÃ¢mera': 'câmera',
    'cÃ¢mera': 'câmera',
    'preÃ§o': 'preço',
    'custo benefÃ­cio': 'custo benefício',
    'locaÃ§Ã£o': 'locação',
    'inspeÃ§Ã£o': 'inspeção',
    'seguranÃ§a': 'segurança',
    'construÃ§Ã£o': 'construção',
    'aplicaÃ§Ãµes': 'aplicações',
    'inteligÃªncia': 'inteligência',
    'tÃ©cnico': 'técnico',
    'peÃ§as': 'peças',
    'distÃ¢ncia': 'distância',
    'dronÃ©': 'drone',
    'crianÃ§a': 'criança',
    'vÃª': 'vê',
    'Ã ': 'à',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã§': 'ç',
    'Ã£': 'ã',
    'Ã¢': 'â',
    'Ãª': 'ê',
    'Ã´': 'ô',
    'Ãµ': 'õ',
  };

  let fixed = text;
  for (const [wrong, correct] of Object.entries(encodingMap)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }

  return fixed;
}

// Função para categorizar keywords por tema
function categorizeKeyword(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  
  // Produtos específicos
  if (lowerKeyword.includes('evo lite') || lowerKeyword.includes('evo-lite')) {
    return 'product-evo-lite';
  }
  if (lowerKeyword.includes('evo max') || lowerKeyword.includes('evo-max')) {
    return 'product-evo-max';
  }
  if (lowerKeyword.includes('autel alpha') || lowerKeyword.includes('alpha')) {
    return 'product-alpha';
  }
  if (lowerKeyword.includes('mapper') || lowerKeyword.includes('mapeamento')) {
    return 'product-mapper';
  }
  
  // Soluções/Verticais
  if (lowerKeyword.includes('topografia') || lowerKeyword.includes('mapeamento') || lowerKeyword.includes('georreferenciamento')) {
    return 'solution-topography';
  }
  if (lowerKeyword.includes('inspeção') || lowerKeyword.includes('inspecao') || lowerKeyword.includes('industrial') || lowerKeyword.includes('energia')) {
    return 'solution-industrial';
  }
  if (lowerKeyword.includes('segurança') || lowerKeyword.includes('seguranca') || lowerKeyword.includes('pública') || lowerKeyword.includes('publica') || lowerKeyword.includes('vigilância') || lowerKeyword.includes('vigilancia')) {
    return 'solution-security';
  }
  if (lowerKeyword.includes('resgate') || lowerKeyword.includes('emergência') || lowerKeyword.includes('emergencia') || lowerKeyword.includes('incêndio') || lowerKeyword.includes('incendio')) {
    return 'solution-rescue';
  }
  if (lowerKeyword.includes('construção') || lowerKeyword.includes('construcao') || lowerKeyword.includes('obra')) {
    return 'solution-construction';
  }
  
  // Geral
  if (lowerKeyword.includes('térmico') || lowerKeyword.includes('termico') || lowerKeyword.includes('câmera térmica') || lowerKeyword.includes('camera termica')) {
    return 'general-thermal';
  }
  if (lowerKeyword.includes('rtk') || lowerKeyword.includes('precisão') || lowerKeyword.includes('precisao')) {
    return 'general-precision';
  }
  if (lowerKeyword.includes('bvlos') || lowerKeyword.includes('longa distância') || lowerKeyword.includes('longa distancia') || lowerKeyword.includes('alcance')) {
    return 'general-range';
  }
  
  return 'general';
}

// Função para verificar se keyword é relevante para Aerion
function isRelevantKeyword(keyword, volume) {
  const lowerKeyword = keyword.toLowerCase();
  
  // INCLUIR keywords específicas de DJI e modelos (conforme solicitado)
  // Mas filtrar apenas keywords de alto volume e relevantes
  const djiKeywords = ['dji', 'mavic', 'mini 2', 'mini 3', 'mini 4', 'mini se', 'phantom', 'air 2', 'air 3'];
  const hasDJI = djiKeywords.some(dji => lowerKeyword.includes(dji));
  
  // Se contém DJI, precisa ter volume alto (5k+) para ser relevante
  if (hasDJI && volume < 5000) {
    return false;
  }
  
  // Excluir keywords muito genéricas sem contexto
  if (lowerKeyword === 'drone' || lowerKeyword === 'drones') {
    return false;
  }
  
  // Volume mínimo baseado na especificidade
  // Keywords muito específicas podem ter volume menor
  // Keywords da DJI precisam de volume alto (5k+)
  const isSpecific = lowerKeyword.includes('profissional') || 
                     lowerKeyword.includes('enterprise') ||
                     lowerKeyword.includes('topografia') ||
                     lowerKeyword.includes('inspeção') ||
                     lowerKeyword.includes('segurança') ||
                     lowerKeyword.includes('resgate') ||
                     lowerKeyword.includes('térmico') ||
                     lowerKeyword.includes('rtk') ||
                     lowerKeyword.includes('mapeamento') ||
                     lowerKeyword.includes('bvlos');
  
  // Keywords da DJI sempre precisam de volume alto
  const minVolume = hasDJI ? 5000 : (isSpecific ? 500 : 5000);
  
  if (volume < minVolume) {
    return false;
  }
  
  // Incluir keywords com termos relevantes OU keywords da DJI de alto volume
  const relevantTerms = [
    'profissional', 'enterprise', 'topografia', 'inspeção', 'inspecao',
    'segurança', 'seguranca', 'resgate', 'térmico', 'termico',
    'rtk', 'mapeamento', 'georreferenciamento', 'construção', 'construcao',
    'industrial', 'energia', 'óleo', 'gas', 'mineração', 'mineracao',
    'câmera', 'camera', 'gimbal', 'precisão', 'precisao',
    'longa distância', 'longa distancia', 'alcance', 'bvlos',
    'custo benefício', 'custo beneficio', 'suporte', 'técnico', 'tecnico',
    'brasil', 'brasileiro', 'distribuidor', 'fornecedor', 'loja',
    'venda', 'preço', 'preco', 'valor', 'barato'
  ];
  
  // Verificar se contém termos relevantes OU é keyword de alto volume genérica OU é DJI de alto volume
  const hasRelevantTerm = relevantTerms.some(term => lowerKeyword.includes(term));
  const isHighVolumeGeneric = volume >= 50000 && (
    lowerKeyword.includes('drone') || 
    lowerKeyword.includes('câmera') || 
    lowerKeyword.includes('camera')
  );
  
  // Keywords da DJI são relevantes se tiverem volume alto
  const isDJIHighVolume = hasDJI && volume >= 5000;
  
  return hasRelevantTerm || isHighVolumeGeneric || isDJIHighVolume;
}

// Função principal
function analyzeKeywords() {
  // Caminho relativo: scripts/ -> raiz projeto -> keywords/
  const csvPath = path.join(__dirname, '..', '..', '..', 'keywords', '20260113', 'keywords_consolidadas_ordenadas.csv');
  
  console.log('Lendo CSV...');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  // Cabeçalho - parse com aspas também
  const headerLine = lines[0];
  const headerColumns = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < headerLine.length; j++) {
    const char = headerLine[j];
    const nextChar = headerLine[j + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        j++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      headerColumns.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  headerColumns.push(current.trim());
  
  const siteIndex = headerColumns.findIndex(col => col.toLowerCase().includes('site'));
  const keywordIndex = headerColumns.findIndex(col => col.toLowerCase().includes('palavra-chave') || col.toLowerCase().includes('palavra chave'));
  const volumeIndex = headerColumns.findIndex(col => col.toLowerCase().includes('média') || col.toLowerCase().includes('media'));
  const competitionIndex = headerColumns.findIndex(col => col.toLowerCase().includes('concorrência') || col.toLowerCase().includes('concorrencia'));
  
  // Fallback para índices conhecidos se não encontrar
  const finalSiteIndex = siteIndex >= 0 ? siteIndex : 0;
  const finalKeywordIndex = keywordIndex >= 0 ? keywordIndex : 1;
  const finalVolumeIndex = volumeIndex >= 0 ? volumeIndex : 3;
  const finalCompetitionIndex = competitionIndex >= 0 ? competitionIndex : 6;
  
  console.log(`Total de linhas: ${lines.length}`);
  console.log(`Índices: site=${finalSiteIndex}, keyword=${finalKeywordIndex}, volume=${finalVolumeIndex}`);
  
  // Coletar keywords de TODOS os sites (não apenas aerion.com.br)
  const allKeywords = [];
  const keywordMap = new Map(); // Para evitar duplicatas e manter maior volume
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV considerando aspas - método mais robusto
    const columns = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Aspas duplas escapadas
          current += '"';
          j++; // Pular próximo caractere
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        columns.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    // Adicionar última coluna
    columns.push(current.trim());
    
    if (columns.length < 4) continue;
    
    const site = columns[finalSiteIndex]?.trim();
    const keyword = fixEncoding(columns[finalKeywordIndex]?.trim());
    const volume = parseInt(columns[finalVolumeIndex]?.trim() || '0', 10);
    const competition = columns[finalCompetitionIndex]?.trim() || 'Desconhecido';
    
    if (!keyword || volume === 0) continue;
    
    // Filtrar keywords relevantes usando função inteligente
    if (!isRelevantKeyword(keyword, volume)) continue;
    
    // Evitar duplicatas - manter a entrada com maior volume
    const keywordLower = keyword.toLowerCase();
    if (keywordMap.has(keywordLower)) {
      const existing = keywordMap.get(keywordLower);
      if (volume > existing.volume) {
        keywordMap.set(keywordLower, {
          keyword,
          volume,
          competition,
          site,
          category: categorizeKeyword(keyword),
        });
      }
    } else {
      keywordMap.set(keywordLower, {
        keyword,
        volume,
        competition,
        site,
        category: categorizeKeyword(keyword),
      });
    }
  }
  
  // Converter Map para Array
  const relevantKeywords = Array.from(keywordMap.values());
  
  console.log(`Keywords relevantes encontradas (todos os sites): ${relevantKeywords.length}`);
  
  // Separar keywords do aerion.com.br das de outros sites
  const aerionKeywords = relevantKeywords.filter(k => k.site === 'aerion.com.br');
  const otherSitesKeywords = relevantKeywords.filter(k => k.site !== 'aerion.com.br');
  
  console.log(`  - Keywords do aerion.com.br: ${aerionKeywords.length}`);
  console.log(`  - Keywords de outros sites: ${otherSitesKeywords.length}`);
  
  // Combinar keywords do aerion com keywords de outros sites
  // Priorizar keywords do aerion, mas incluir outras relevantes
  const allRelevantKeywords = [...aerionKeywords, ...otherSitesKeywords];
  
  // Ordenar por volume (maior primeiro)
  allRelevantKeywords.sort((a, b) => b.volume - a.volume);
  
  // Categorizar por página
  const categorized = {
    home: [],
    products: [],
    'product-evo-lite': [],
    'product-evo-max': [],
    'product-alpha': [],
    'product-mapper': [],
    solutions: [],
    'solution-topography': [],
    'solution-industrial': [],
    'solution-security': [],
    'solution-rescue': [],
    'solution-construction': [],
    about: [],
    contact: [],
    general: [],
  };
  
  allRelevantKeywords.forEach(item => {
    // Home: keywords gerais de alto volume
    if (item.volume >= 5000 && (item.category === 'general' || item.keyword.includes('profissional') || item.keyword.includes('autel'))) {
      categorized.home.push(item);
    }
    
    // Produtos gerais
    if (item.category.startsWith('product-') || item.keyword.includes('drone') && item.volume >= 500) {
      categorized.products.push(item);
      
      // Produtos específicos
      if (item.category === 'product-evo-lite') {
        categorized['product-evo-lite'].push(item);
      }
      if (item.category === 'product-evo-max') {
        categorized['product-evo-max'].push(item);
      }
      if (item.category === 'product-alpha') {
        categorized['product-alpha'].push(item);
      }
      if (item.category === 'product-mapper') {
        categorized['product-mapper'].push(item);
      }
    }
    
    // Soluções
    if (item.category.startsWith('solution-')) {
      categorized.solutions.push(item);
      categorized[item.category]?.push(item);
    }
    
    // Sobre: keywords institucionais
    if (item.keyword.includes('aerion') || item.keyword.includes('distribuidor') || item.keyword.includes('brasil')) {
      categorized.about.push(item);
    }
    
    // Contato: keywords de suporte/vendas
    if (item.keyword.includes('contato') || item.keyword.includes('suporte') || item.keyword.includes('venda') || item.keyword.includes('loja')) {
      categorized.contact.push(item);
    }
    
    // Geral
    if (item.category === 'general' || item.category.startsWith('general-')) {
      categorized.general.push(item);
    }
  });
  
  // Limitar a 15 keywords por página (evitar poluição)
  Object.keys(categorized).forEach(key => {
    categorized[key] = categorized[key]
      .slice(0, 15)
      .map(item => item.keyword);
  });
  
  // Gerar relatório
  const report = {
    totalKeywords: allRelevantKeywords.length,
    aerionKeywords: aerionKeywords.length,
    otherSitesKeywords: otherSitesKeywords.length,
    categorized,
    topKeywords: allRelevantKeywords.slice(0, 100).map(item => ({
      keyword: item.keyword,
      volume: item.volume,
      competition: item.competition,
      category: item.category,
      site: item.site,
    })),
  };
  
  // Salvar relatório
  const reportPath = path.join(__dirname, '..', 'keywords-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log('\n=== Relatório Gerado ===');
  console.log(`Total de keywords relevantes: ${allRelevantKeywords.length}`);
  console.log(`  - Do aerion.com.br: ${aerionKeywords.length}`);
  console.log(`  - De outros sites: ${otherSitesKeywords.length}`);
  console.log(`\nKeywords por página:`);
  Object.keys(categorized).forEach(key => {
    console.log(`  ${key}: ${categorized[key].length} keywords`);
  });
  console.log(`\nTop 10 keywords por volume:`);
  allRelevantKeywords.slice(0, 10).forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.keyword} (${item.volume.toLocaleString()} buscas/mês) - ${item.site}`);
  });
  console.log(`\nRelatório salvo em: ${reportPath}`);
  
  return report;
}

// Executar
analyzeKeywords();


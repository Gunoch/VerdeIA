
import type { ReactNode } from "react";

export interface SwapItem {
  original: string;
  sustainable: string;
  benefit: string;
}

export interface SwapCategoryData {
  id: string;
  name: string;
  description: string;
  // Ícones como ReactNode não são serializáveis para o fluxo de IA,
  // então vamos nos concentrar nos dados textuais aqui.
  // O frontend pode mapear IDs de categoria para ícones se necessário.
  // icon: ReactNode; 
  imageUrl: string; // Manter para possível uso futuro ou se o frontend renderizar cards completos.
  imageHint: string;
  exampleSwaps: SwapItem[];
}

export const swapCategoriesData: SwapCategoryData[] = [
  {
    id: "kitchen", // Cozinha
    name: "Essenciais de Cozinha",
    description: "Reduza o desperdício e os produtos químicos na sua cozinha com estas trocas simples e eficazes para um lar e planeta mais saudáveis.",
    imageUrl: "/images/eco-kitchen.png",
    imageHint: "eco kitchen", 
    exampleSwaps: [
      { original: "Filme Plástico Aderente", sustainable: "Embalagens de Cera de Abelha ou Tampas de Silicone Reutilizáveis", benefit: "Reduz o desperdício de plástico descartável, seguro para alimentos e reutilizável." },
      { original: "Toalhas de Papel Descartáveis", sustainable: "Guardanapos de Pano Reutilizáveis e Toalhas \"Despapel\"", benefit: "Lavável, durável e reduz significativamente o consumo de papel." },
      { original: "Sacolas Plásticas de Supermercado", sustainable: "Ecobags Reutilizáveis (Algodão, Juta, etc.)", benefit: "Evita a poluição plástica e apoia materiais sustentáveis." },
      { original: "Panelas Antiaderentes de Teflon", sustainable: "Panelas de Ferro Fundido ou Aço Inoxidável", benefit: "Evita PFCs, durável e pode durar gerações." },
      { original: "Esponjas sintéticas de lavar louça", sustainable: "Buchas vegetais ou escovas de coco", benefit: "Biodegradáveis e evitam microplásticos." },
      { original: "Cápsulas de café descartáveis", sustainable: "Café coado, prensa francesa ou cápsulas reutilizáveis", benefit: "Reduz drasticamente o lixo de cápsulas de uso único." },
    ],
  },
  {
    id: "personal-care", // Cuidados Pessoais
    name: "Produtos de Higiene Pessoal",
    description: "Escolha itens de higiene pessoal que sejam gentis com seu corpo e o meio ambiente, minimizando plástico e ingredientes nocivos.",
    imageUrl: "/images/eco-care.png",
    imageHint: "eco care", 
    exampleSwaps: [
      { original: "Escova de Dentes de Plástico", sustainable: "Escova de Dentes de Bambu com Cerdas Naturais", benefit: "Cabo biodegradável, reduz o desperdício de plástico." },
      { original: "Sabonete Líquido em Garrafa Plástica", sustainable: "Sabonete em Barra (Sem Embalagem ou Embalado em Papel)", benefit: "Drasticamente menos embalagem plástica, geralmente mais natural." },
      { original: "Lenços Demaquilantes Descartáveis", sustainable: "Discos Demaquilantes Reutilizáveis e Óleos Naturais", benefit: "Lavável, suave para a pele e reduz significativamente o desperdício diário." },
      { original: "Shampoo em Garrafa Plástica", sustainable: "Shampoo em Barra ou Opções Refiláveis", benefit: "Elimina garrafas plásticas, fórmulas concentradas." },
      { original: "Cotonetes de plástico", sustainable: "Cotonetes com hastes de papel ou bambu, ou limpador de ouvido reutilizável", benefit: "Reduz o plástico descartável que polui os oceanos." },
      { original: "Desodorante aerossol ou roll-on plástico", sustainable: "Desodorante em creme, barra ou cristal (embalagens recicláveis ou reutilizáveis)", benefit: "Menos embalagem plástica e evita gases de aerossol." },
    ],
  },
  {
    id: "home-cleaning", // Limpeza Doméstica
    name: "Produtos para Casa e Limpeza",
    description: "Opte por soluções sustentáveis e não tóxicas para um ambiente de vida limpo, verde e saudável.",
    imageUrl: "/images/eco-cleaning.png",
    imageHint: "eco cleaning", 
    exampleSwaps: [
      { original: "Limpadores Químicos em Garrafas Plásticas", sustainable: "Limpadores Caseiros (Vinagre, Bicarbonato de Sódio) ou Concentrados Ecológicos", benefit: "Reduz produtos químicos agressivos, desperdício de plástico e poluição do ar interno." },
      { original: "Lenços de Limpeza Descartáveis", sustainable: "Panos de Microfibra Reutilizáveis e Borrifadores", benefit: "Limpeza mais eficaz, lavável e evita plásticos de uso único." },
      { original: "Purificadores de Ar Sintéticos", sustainable: "Difusores de Óleos Essenciais ou Plantas Purificadoras de Ar", benefit: "Evita fragrâncias sintéticas e VOCs, melhora a qualidade do ar naturalmente." },
      { original: "Detergente de louça em embalagem plástica convencional", sustainable: "Detergente em barra, refil ou embalagens concentradas/recicladas", benefit: "Menos plástico e transporte de água." },
      { original: "Amaciante de roupas convencional", sustainable: "Bolas de lã para secadora ou vinagre branco na lavagem", benefit: "Evita químicos e embalagens plásticas, suaviza naturalmente." },
    ],
  },
  {
    id: "food-packaging", // Embalagens de Alimentos (categoria mais específica, pode ser útil)
    name: "Embalagens e Armazenamento de Alimentos",
    description: "Formas mais sustentáveis de armazenar e transportar seus alimentos, reduzindo o plástico de uso único.",
    imageUrl: "/images/food-storage.png",
    imageHint: "food storage",
    exampleSwaps: [
      { original: "Sacos plásticos Ziploc", sustainable: "Potes de vidro, recipientes de aço inoxidável ou sacos de silicone reutilizáveis", benefit: "Duráveis, reutilizáveis e evitam o descarte de plástico." },
      { original: "Filme plástico para cobrir alimentos", sustainable: "Panos de cera de abelha, tampas de silicone ajustáveis ou simplesmente um prato sobre a tigela", benefit: "Reduz o plástico, reutilizável e eficaz." },
      { original: "Copos de café descartáveis", sustainable: "Copo de café reutilizável (bambu, aço inoxidável, vidro)", benefit: "Diminui drasticamente o lixo de copos de uso único." },
    ],
  },
  // Adicionar uma categoria genérica para fallback se a IA não classificar bem
  {
    id: "geral", // Geral
    name: "Trocas Sustentáveis Gerais",
    description: "Alternativas ecológicas que podem se aplicar a diversos tipos de produtos ou situações.",
    imageUrl: "/images/general-eco.png",
    imageHint: "general eco",
    exampleSwaps: [
      { original: "Produtos de marca com muita embalagem", sustainable: "Produtos a granel ou com embalagens minimalistas/recicladas", benefit: "Reduz o desperdício de embalagens." },
      { original: "Itens de uso único (ex: talheres, pratos plásticos)", sustainable: "Versões reutilizáveis (bambu, metal, seus próprios talheres)", benefit: "Evita o grande volume de lixo plástico de eventos e refeições rápidas." },
    ],
  },
];

// Mapeamento de categorias retornadas pela IA para os IDs das nossas SwapCategoryData
// Isso ajuda a normalizar a categoria da IA para uma das nossas categorias definidas.
// As chaves são strings que podem vir da IA (em minúsculas para correspondência insensível a maiúsculas/minúsculas).
// Os valores são os IDs das nossas `swapCategoriesData`.
export const aiCategoryToSwapCategoryMap: Record<string, string> = {
  "vestuário": "geral", // Pode não ter trocas diretas, mas dicas gerais se aplicam
  "eletrônicos": "geral", // Difícil ter "trocas" diretas, mais sobre descarte e reparo
  "alimentos": "food-packaging", // Foco em embalagens
  "cuidados pessoais": "personal-care",
  "utensílios de cozinha": "kitchen",
  "brinquedos": "geral",
  "móveis": "geral",
  "bebidas": "food-packaging", // Para garrafas, latas
  "limpeza": "home-cleaning",
  "escritório": "geral", // Ex: canetas, papel
  "desconhecida": "geral",
  "outros": "geral",
};

export function getSwapCategoryById(categoryId: string): SwapCategoryData | undefined {
  return swapCategoriesData.find(cat => cat.id === categoryId);
}

export function getRelevantSwapsByCategory(aiCategoryName: string): SwapCategoryData | undefined {
  const normalizedAiCategory = aiCategoryName.toLowerCase().trim();
  const mappedCategoryId = aiCategoryToSwapCategoryMap[normalizedAiCategory] || "geral";
  return getSwapCategoryById(mappedCategoryId);
}

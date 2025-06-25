
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
  imageUrl: string;
  imageHint: string;
  exampleSwaps: SwapItem[];
}

export const swapCategoriesData: SwapCategoryData[] = [
  {
    id: "kitchen",
    name: "Cozinha e Armazenamento",
    description: "Reduza o desperdício e os produtos químicos na sua cozinha com estas trocas para um lar e planeta mais saudáveis.",
    imageUrl: "/images/eco-kitchen.png",
    imageHint: "eco kitchen", 
    exampleSwaps: [
      { original: "Filme Plástico Aderente", sustainable: "Embalagens de Cera de Abelha ou Tampas de Silicone Reutilizáveis", benefit: "Reduz o desperdício de plástico descartável, seguro para alimentos e reutilizável." },
      { original: "Toalhas de Papel Descartáveis", sustainable: "Panos de prato reutilizáveis e toalhas de microfibra", benefit: "Lavável, durável e reduz significativamente o consumo de papel e o lixo." },
      { original: "Esponjas sintéticas de lavar louça", sustainable: "Buchas vegetais ou escovas de fibra de coco", benefit: "São biodegradáveis, evitam a liberação de microplásticos e não riscam a louça." },
      { original: "Cápsulas de café descartáveis", sustainable: "Café coado, prensa francesa ou cápsulas de inox reutilizáveis", benefit: "Reduz drasticamente o lixo de cápsulas de uso único, que raramente são recicladas." },
    ],
  },
  {
    id: "personal-care",
    name: "Higiene e Cuidados Pessoais",
    description: "Escolha itens de higiene que sejam gentis com seu corpo e o meio ambiente, minimizando plástico e ingredientes nocivos.",
    imageUrl: "/images/eco-care.png",
    imageHint: "eco care", 
    exampleSwaps: [
      { original: "Escova de Dentes de Plástico", sustainable: "Escova de Dentes de Bambu com cerdas sem plástico", benefit: "O cabo de bambu é biodegradável, reduzindo o acúmulo de plástico nos aterros." },
      { original: "Shampoo e Condicionador Líquido", sustainable: "Shampoo e Condicionador em Barra", benefit: "Elimina as embalagens plásticas, são concentrados e ótimos para viagens." },
      { original: "Lâminas de barbear descartáveis", sustainable: "Aparelho de barbear de metal (safety razor) com lâminas recicláveis", benefit: "Gera lixo zero (exceto a lâmina reciclável) e é mais econômico a longo prazo." },
      { original: "Absorventes higiênicos descartáveis", sustainable: "Coletor menstrual, disco menstrual ou calcinhas absorventes", benefit: "São reutilizáveis por anos, reduzindo drasticamente o lixo e o custo mensal." },
    ],
  },
  {
    id: "home-cleaning",
    name: "Produtos para Casa e Limpeza",
    description: "Opte por soluções sustentáveis e não tóxicas para um ambiente limpo, verde e saudável.",
    imageUrl: "/images/eco-cleaning.png",
    imageHint: "eco cleaning", 
    exampleSwaps: [
      { original: "Limpadores Multiuso Químicos", sustainable: "Receitas caseiras (vinagre, bicarbonato) ou limpadores concentrados ecológicos", benefit: "Reduz químicos agressivos, desperdício de plástico e poluição do ar interno." },
      { original: "Amaciante de roupas convencional", sustainable: "Bolas de lã para secadora ou vinagre branco na lavagem", benefit: "Evita químicos desnecessários na água e na pele, e amacia as roupas naturalmente." },
      { original: "Detergente de louça em embalagem plástica", sustainable: "Detergente em barra ou compra de versões refil em lojas a granel", benefit: "Reduz o consumo de embalagens plásticas e o transporte de água." },
    ],
  },
  {
    id: "food-packaging",
    name: "Alimentos e Embalagens",
    description: "Formas mais sustentáveis de comprar, armazenar e transportar seus alimentos, reduzindo o plástico de uso único.",
    imageUrl: "/images/food-storage.png",
    imageHint: "food storage",
    exampleSwaps: [
      { original: "Sacolas plásticas de supermercado", sustainable: "Ecobags de pano, juta ou outro material resistente", benefit: "Uma única ecobag pode substituir centenas de sacolas plásticas durante sua vida útil." },
      { original: "Comprar frutas e vegetais em bandejas de isopor/plástico", sustainable: "Comprar produtos a granel em feiras ou hortifrutis, usando sacos de pano", benefit: "Evita embalagens desnecessárias e apoia produtores locais." },
      { original: "Potes e sacos plásticos para armazenamento (tipo Ziploc)", sustainable: "Potes de vidro com tampa, recipientes de aço inoxidável ou sacos de silicone", benefit: "São duráveis, não liberam toxinas nos alimentos e podem ser reutilizados indefinidamente." },
    ],
  },
  {
    id: "apparel",
    name: "Vestuário e Moda",
    description: "Práticas para um guarda-roupa mais consciente, reduzindo o impacto da indústria da moda.",
    imageUrl: "/images/eco-apparel.png", // Você precisará adicionar esta imagem
    imageHint: "sustainable fashion",
    exampleSwaps: [
      { original: "Comprar roupas de 'fast fashion' por impulso", sustainable: "Optar por roupas de segunda mão (brechós) ou de marcas transparentes e sustentáveis", benefit: "Reduz o desperdício têxtil, o consumo de água e apoia um ciclo de moda mais justo." },
      { original: "Peças de tecidos sintéticos derivados de petróleo (poliéster, nylon)", sustainable: "Roupas de fibras naturais (algodão orgânico, linho, cânhamo) ou recicladas", benefit: "São biodegradáveis, permitem que a pele respire e não liberam microplásticos." },
      { original: "Descartar roupas com pequenos defeitos", sustainable: "Aprender a consertar (costurar, remendar) ou levar a uma costureira", benefit: "Prolonga a vida útil das suas roupas, economiza recursos e valoriza o trabalho manual." },
    ],
  },
  {
    id: "electronics",
    name: "Eletrônicos e Tecnologia",
    description: "O lixo eletrônico é um dos que mais cresce. Veja como diminuir seu impacto nessa área.",
    imageUrl: "/images/eco-electronics.png", // Você precisará adicionar esta imagem
    imageHint: "e-waste recycling",
    exampleSwaps: [
      { original: "Trocar de celular ou computador anualmente", sustainable: "Manter seu aparelho por mais tempo, trocando a bateria ou fazendo upgrades pontuais", benefit: "Reduz drasticamente a geração de lixo eletrônico, que é altamente tóxico e de difícil reciclagem." },
      { original: "Usar pilhas alcalinas descartáveis", sustainable: "Investir em um bom carregador e pilhas recarregáveis", benefit: "Economiza dinheiro a longo prazo e evita o descarte de metais pesados no meio ambiente." },
      { original: "Descartar eletrônicos quebrados no lixo comum", sustainable: "Procurar cooperativas ou pontos de coleta específicos para lixo eletrônico na sua cidade", benefit: "Garante a reciclagem de componentes valiosos e o descarte seguro de materiais perigosos." },
    ],
  },
  {
    id: "geral",
    name: "Trocas Sustentáveis Gerais",
    description: "Alternativas ecológicas que podem se aplicar a diversos tipos de produtos ou situações do dia a dia.",
    imageUrl: "/images/general-eco.png",
    imageHint: "general eco",
    exampleSwaps: [
      { original: "Itens de uso único (copos, talheres, pratos plásticos)", sustainable: "Carregar um kit de reutilizáveis (seu próprio copo, talher, guardanapo de pano)", benefit: "Evita o lixo plástico de festas, eventos e refeições rápidas fora de casa." },
      { original: "Comprar produtos com excesso de embalagem", sustainable: "Preferir produtos a granel, com embalagens minimalistas, recicladas ou compostáveis", benefit: "Reduz o volume de lixo gerado e incentiva empresas a adotarem práticas mais conscientes." },
    ],
  },
];

// Mapeamento aprimorado de categorias da IA para nossas categorias de trocas.
// Inclui mais aliases e direciona para as novas categorias específicas.
export const aiCategoryToSwapCategoryMap: Record<string, string> = {
  // Vestuário
  "vestuário": "apparel",
  "roupas": "apparel",
  "calçados": "apparel",
  "moda": "apparel",
  // Eletrônicos
  "eletrônicos": "electronics",
  "tecnologia": "electronics",
  // Alimentos e Bebidas
  "alimentos": "food-packaging",
  "comida": "food-packaging",
  "bebidas": "food-packaging",
  // Higiene
  "cuidados pessoais": "personal-care",
  "higiene": "personal-care",
  "cosméticos": "personal-care",
  // Casa
  "utensílios de cozinha": "kitchen",
  "cozinha": "kitchen",
  "limpeza": "home-cleaning",
  "produtos de limpeza": "home-cleaning",
  // Genéricos
  "brinquedos": "geral",
  "móveis": "geral",
  "escritório": "geral",
  "papelaria": "geral",
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

    
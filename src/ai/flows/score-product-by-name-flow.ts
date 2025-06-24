
'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit que estima o impacto ambiental de um produto com base em seu nome.
 *
 * - scoreProductByName - Uma função que recebe o nome de um produto e retorna suas pontuações de impacto estimadas.
 * - ScoreProductByNameInput - O tipo de entrada para a função scoreProductByName.
 * - ScoreProductByNameOutput - O tipo de retorno para a função scoreProductByName.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScoreProductByNameInputSchema = z.object({
  productName: z.string().describe('O nome do produto a ser analisado.'),
});
export type ScoreProductByNameInput = z.infer<typeof ScoreProductByNameInputSchema>;

const ScoreProductByNameOutputSchema = z.object({
  name: z.string().describe("O nome do produto identificado/analisado (pode ser uma versão normalizada ou mais específica do nome de entrada)."),
  category: z.string().describe("A categoria do produto (ex: Vestuário, Eletrônicos, Alimentos, Cuidados Pessoais, Utensílios de Cozinha)."),
  carbonFootprint: z.number().min(0).max(100).describe("Estimativa da pegada de carbono do produto (0-100, onde 0 é muito baixo e 100 é muito alto)."),
  waterUsage: z.number().min(0).max(100).describe("Estimativa do uso de água na produção/vida útil do produto (0-100, onde 0 é muito baixo e 100 é muito alto)."),
  sustainabilityScore: z.number().min(0).max(100).describe("Pontuação geral de sustentabilidade do produto (0-100, onde 0 é muito baixo e 100 é muito alto/bom). Considere fatores como materiais, durabilidade, reciclabilidade, etc."),
  notes: z.array(z.string()).optional().describe("Uma lista de 2-3 considerações ambientais chave ou dicas sobre o produto, em português. Ex: 'Feito com materiais reciclados', 'Alto consumo de energia na produção', 'Prefira versões recarregáveis'."),
  identified: z.boolean().describe("Indica se o produto foi claramente identificado e se as pontuações puderam ser estimadas. Se falso, as pontuações podem ser 0 ou não confiáveis."),
});
export type ScoreProductByNameOutput = z.infer<typeof ScoreProductByNameOutputSchema>;

// Cache em memória para armazenar os resultados das avaliações e garantir consistência para itens iguais.
const scoreCache = new Map<string, ScoreProductByNameOutput>();

export async function scoreProductByName(input: ScoreProductByNameInput): Promise<ScoreProductByNameOutput> {
  const productNameKey = input.productName.trim().toLowerCase();

  // Adiciona uma verificação para nomes de produtos muito curtos ou genéricos
  if (productNameKey.length < 3) {
    return {
      name: input.productName,
      category: "Desconhecida",
      carbonFootprint: 0,
      waterUsage: 0,
      sustainabilityScore: 0,
      notes: ["Nome do produto muito curto para análise."],
      identified: false,
    };
  }

  // Verifica o cache antes de chamar o fluxo para garantir resultados consistentes.
  if (scoreCache.has(productNameKey)) {
    console.log(`[CACHE HIT] para score do produto: ${productNameKey}`);
    return scoreCache.get(productNameKey)!;
  }

  console.log(`[CACHE MISS] para score do produto: ${productNameKey}. Chamando IA.`);
  const result = await scoreProductByNameFlow(input);
  
  // Armazena no cache apenas se o produto foi identificado com sucesso.
  if (result.identified) {
    scoreCache.set(productNameKey, result);
  }

  return result;
}

const prompt = ai.definePrompt({
  name: 'scoreProductByNamePrompt',
  input: { schema: ScoreProductByNameInputSchema },
  output: { schema: ScoreProductByNameOutputSchema },
  prompt: `Você é um especialista em sustentabilidade e análise de ciclo de vida de produtos. Sua tarefa é avaliar o impacto ambiental de um produto de consumo com base no nome fornecido, seguindo uma RUBRICA ESTRITA para garantir consistência.

Produto: {{{productName}}}

**INSTRUÇÕES:**
1.  **Identifique o produto:** Determine o material principal, o processo de fabricação e o ciclo de vida típico do produto.
2.  **Aplique a Rúbrica de Pontuação:** Use a rúbrica abaixo para calcular CADA pontuação. NÃO use estimativas vagas. Baseie-se nos critérios definidos.
3.  **Calcule a Pontuação de Sustentabilidade:** Comece com 50 pontos e ajuste com base nos critérios da rúbrica.
4.  **Gere as Notas:** As notas devem justificar brevemente as pontuações com base na rúbrica (ex: "Pegada de carbono alta devido à produção intensiva" ou "Sustentabilidade alta por ser reutilizável e de material biodegradável").
5.  **Responda em JSON:** Formate a saída estritamente de acordo com o esquema de saída.

---
**RÚBRICA DE PONTUAÇÃO (SEGUIR ESTRITAMENTE)**

**1. Pegada de Carbono (0-100, onde 100 é o pior impacto):**
*   **0-20 (Muito Baixo):** Produtos vegetais não processados, itens reutilizáveis com longa vida útil (ex: maçã, copo de vidro, livro).
*   **21-40 (Baixo):** Produtos com processamento mínimo, materiais reciclados ou orgânicos (ex: pão, camiseta de algodão orgânico, papel reciclado).
*   **41-60 (Médio):** Processamento industrial moderado, embalagens plásticas, eletrônicos de consumo (ex: iogurte, smartphone, tênis de material sintético).
*   **61-80 (Alto):** Produção intensiva em energia, carne (exceto bovina), transporte de longa distância (ex: frango, queijo, calça jeans convencional).
*   **81-100 (Muito Alto):** Produtos de plástico virgem de uso único, carne bovina, transporte intensivo (ex: garrafa PET, bife, carro a gasolina).

**2. Uso de Água (0-100, onde 100 é o pior impacto):**
*   **0-20 (Muito Baixo):** Itens que usam pouquíssima água na produção (ex: eletrônicos, vidro, produtos sintéticos).
*   **21-40 (Baixo):** Culturas de baixo consumo de água (ex: batatas, vegetais folhosos).
*   **41-60 (Médio):** Processamento industrial, papel (ex: lata de alumínio, camiseta de poliéster).
*   **61-80 (Alto):** Culturas com uso intensivo de água (ex: arroz, algodão convencional, café).
*   **81-100 (Muito Alto):** Produtos de origem animal, nozes (ex: carne bovina, chocolate, amêndoas, calça jeans de algodão).

**3. Pontuação de Sustentabilidade (0-100, onde 100 é o melhor):**
*   **Base:** Comece com 50 pontos.
*   **Ajustes de Material:**
    *   '+20 pts' se o material principal for renovável, reciclado ou biodegradável (ex: bambu, algodão orgânico, vidro, aço reciclado).
    *   '-20 pts' se o material principal for plástico virgem, não reciclável ou de fonte extrativa problemática.
*   **Ajustes de Ciclo de Vida/Uso:**
    *   '+20 pts' se for projetado para ser durável e reutilizável por muitos anos (ex: panela de ferro, copo reutilizável).
    *   '-20 pts' se for de uso único ou tiver vida útil curta (ex: copo descartável, talheres de plástico).
*   **Ajustes de Impacto de Produção:**
    *   '+10 pts' se a produção for reconhecidamente de baixo impacto (ex: agricultura orgânica).
    *   '-10 pts' se a produção tiver alto consumo de energia/água (baseado nas pontuações de Carbono e Água acima de 60).

---

Se o produto for muito vago (ex: "coisa") ou não for um produto de consumo, defina 'identified' como 'false' e use 0 para as pontuações.

Responda apenas no formato JSON especificado.
`,
});

const scoreProductByNameFlow = ai.defineFlow(
  {
    name: 'scoreProductByNameFlow',
    inputSchema: ScoreProductByNameInputSchema,
    outputSchema: ScoreProductByNameOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (output) {
        // Certificar que o nome de saída não seja vazio se identificado
        if (output.identified && !output.name) {
          output.name = input.productName;
        }
        return output;
      }
      // Se output for null, indica falha na geração da LLM ou formato incorreto.
      // Retornamos um estado de "não identificado" para consistência.
      return {
        name: input.productName,
        category: "Desconhecida",
        carbonFootprint: 0,
        waterUsage: 0,
        sustainabilityScore: 0,
        notes: ["A IA não conseguiu processar este produto no momento."],
        identified: false,
      };
    } catch (error) {
      console.error("Erro no fluxo scoreProductByNameFlow:", error);
      // Em caso de erro inesperado na chamada da LLM, retorne um estado de falha.
      return {
        name: input.productName,
        category: "Erro",
        carbonFootprint: 0,
        waterUsage: 0,
        sustainabilityScore: 0,
        notes: ["Ocorreu um erro ao tentar analisar o produto."],
        identified: false,
      };
    }
  }
);

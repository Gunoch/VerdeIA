
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

export async function scoreProductByName(input: ScoreProductByNameInput): Promise<ScoreProductByNameOutput> {
  // Adiciona uma verificação para nomes de produtos muito curtos ou genéricos
  if (input.productName.trim().length < 3) {
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
  return scoreProductByNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreProductByNamePrompt',
  input: { schema: ScoreProductByNameInputSchema },
  output: { schema: ScoreProductByNameOutputSchema },
  prompt: `Você é um especialista em sustentabilidade e análise de ciclo de vida de produtos. Sua tarefa é estimar o impacto ambiental de um produto de consumo com base no nome fornecido.

Produto: {{{productName}}}

Por favor, forneça as seguintes informações:
1.  **name**: O nome do produto, possivelmente uma versão mais clara ou normalizada se o nome de entrada for vago. Se o produto for muito genérico ou não identificável, use o nome de entrada.
2.  **category**: A categoria principal do produto (ex: Vestuário, Eletrônicos, Alimentos, Cuidados Pessoais, Utensílios de Cozinha, Brinquedos, Móveis, etc.).
3.  **carbonFootprint**: Uma estimativa da pegada de carbono do produto em uma escala de 0 a 100 (0 = impacto muito baixo, 100 = impacto muito alto). Considere produção, transporte e descarte.
4.  **waterUsage**: Uma estimativa do uso de água associado ao produto em uma escala de 0 a 100 (0 = uso muito baixo, 100 = uso muito alto). Considere produção e uso, se aplicável.
5.  **sustainabilityScore**: Uma pontuação geral de sustentabilidade do produto em uma escala de 0 a 100 (0 = nada sustentável, 100 = muito sustentável). Considere materiais, durabilidade, produção ética, reciclabilidade, impacto social, etc.
6.  **notes**: Uma lista curta (2-3 itens) de considerações ambientais chave ou dicas sobre o produto, em português. Por exemplo: "Feito com 50% de plástico reciclado", "Consome muita energia durante o uso", "Procure por certificações de comércio justo".
7.  **identified**: Defina como 'true' se você puder identificar razoavelmente o produto e fornecer estimativas. Se o nome do produto for muito vago (ex: "coisa", "item"), não for um produto de consumo comum, ou se for impossível estimar, defina como 'false' e use valores padrão (ex: 0 para pontuações) e indique nos 'notes' que não foi possível analisar.

Tente ser o mais realista possível com as estimativas, mesmo que sejam aproximadas. Se um produto tiver variações significativas (ex: "carro"), tente estimar para uma versão comum ou média, ou indique a dificuldade nos 'notes'.
Priorize produtos de consumo comuns. Para produtos muito específicos, industriais ou abstratos, pode ser mais difícil, então defina 'identified' como false.
Responda apenas no formato JSON especificado pelo esquema de saída.
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

    

'use server';
/**
 * @fileOverview Fluxo unificado para analisar um produto por nome ou foto.
 * Este fluxo identifica o produto, calcula suas pontuações de impacto ambiental,
 * sugere ações ecológicas (reciclagem, reutilização, descarte) e fornece sua categoria.
 * A categoria pode ser usada pelo frontend para sugerir trocas sustentáveis relevantes.
 *
 * - analyzeProduct - Função principal que executa a análise.
 * - AnalyzeProductInput - Tipo de entrada para a função.
 * - AnalyzeProductOutput - Tipo de saída da função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { identifyProductFromPhoto, type IdentifyProductFromPhotoInput, type IdentifyProductFromPhotoOutput } from './identify-product-from-photo-flow';
import { scoreProductByName, type ScoreProductByNameInput, type ScoreProductByNameOutput } from './score-product-by-name-flow';

const AnalyzeProductInputSchema = z.object({
  productName: z.string().optional().describe('O nome do produto a ser analisado. Usado se photoDataUri não for fornecido ou se a identificação da foto falhar.'),
  photoDataUri: z.string().optional().describe(
    "Uma foto de um objeto, como um data URI que deve incluir um MIME type e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'. Se fornecido, tentará identificar o produto na foto."
  ),
});
export type AnalyzeProductInput = z.infer<typeof AnalyzeProductInputSchema>;

const AnalyzeProductOutputSchema = z.object({
  identifiedProductName: z.string().describe("O nome do produto identificado/analisado."),
  category: z.string().describe("A categoria do produto (ex: Vestuário, Eletrônicos, Alimentos, Cuidados Pessoais, Utensílios de Cozinha). Retornado pela análise de impacto."),
  carbonFootprint: z.number().min(0).max(100).describe("Estimativa da pegada de carbono (0-100)."),
  waterUsage: z.number().min(0).max(100).describe("Estimativa do uso de água (0-100)."),
  sustainabilityScore: z.number().min(0).max(100).describe("Pontuação geral de sustentabilidade (0-100)."),
  impactNotes: z.array(z.string()).optional().describe("Considerações ambientais chave sobre o produto (da análise de impacto)."),
  identified: z.boolean().describe("Indica se um produto foi claramente identificado e analisado."),
  ecoActions: z.array(z.string()).describe("Uma lista de 2-4 ações ecológicas sugeridas (reciclagem, reutilização, descarte correto, dicas de consumo consciente) relacionadas ao produto identificado. As ações devem ser práticas e diretas."),
});
export type AnalyzeProductOutput = z.infer<typeof AnalyzeProductOutputSchema>;

// Prompt para gerar ações ecológicas (reciclagem, reutilização, descarte)
const ecoActionsPrompt = ai.definePrompt({
    name: 'ecoActionsPrompt',
    input: { schema: z.object({ productName: z.string(), productDescription: z.string().optional(), productCategory: z.string().optional() }) },
    output: { schema: z.object({ actions: z.array(z.string()) }) },
    prompt: `Dado o produto "{{productName}}" ({{#if productDescription}}descrito como "{{productDescription}}"{{/if}}{{#if productCategory}} da categoria "{{productCategory}}"{{/if}}), sugira de 2 a 4 ações ecológicas concretas que um consumidor pode tomar.
    Concentre-se em:
    1.  Formas corretas de descarte e reciclagem.
    2.  Ideias criativas para reutilização ou upcycling.
    3.  Dicas para prolongar a vida útil do produto.
    4.  Alternativas de consumo mais consciente relacionadas (ex: comprar a granel, escolher refil).
    Seja específico para o tipo de produto. Evite sugestões genéricas como "recicle".
    Exemplo para "Garrafa PET de Refrigerante":
    - "Enxágue e amasse a garrafa PET antes de descartar no lixo reciclável para plásticos."
    - "Transforme a garrafa em um pequeno vaso para plantas ou um porta-lápis."
    - "Opte por refrigerantes em embalagens retornáveis ou de vidro quando possível."

    Ações:
    `,
});


export async function analyzeProduct(input: AnalyzeProductInput): Promise<AnalyzeProductOutput> {
  return analyzeProductFlow(input);
}

const analyzeProductFlow = ai.defineFlow(
  {
    name: 'analyzeProductFlow',
    inputSchema: AnalyzeProductInputSchema,
    outputSchema: AnalyzeProductOutputSchema,
  },
  async (input) => {
    let productNameToScore = input.productName;
    let productIdentifiedFromPhoto = false;
    let initialProductDescription = ""; // Pode vir da foto ou ser o nome

    if (input.photoDataUri) {
      try {
        const identificationResult: IdentifyProductFromPhotoOutput = await identifyProductFromPhoto({ photoDataUri: input.photoDataUri });
        if (identificationResult.identified && identificationResult.identifiedProductName) {
          productNameToScore = identificationResult.identifiedProductName;
          initialProductDescription = `Produto identificado na foto como ${identificationResult.identifiedProductName}`;
          productIdentifiedFromPhoto = true;
        } else if (!productNameToScore) { // Se a foto não identificou e não há nome de fallback
          return {
            identifiedProductName: "Não Identificado",
            category: "Desconhecida",
            carbonFootprint: 0,
            waterUsage: 0,
            sustainabilityScore: 0,
            impactNotes: ["Produto não pôde ser identificado a partir da imagem e nenhum nome foi fornecido."],
            identified: false,
            ecoActions: ["Não foi possível sugerir ações pois o produto não foi identificado."],
          };
        }
      } catch (identificationError) {
        console.error("Erro ao identificar produto da foto:", identificationError);
        // Prossegue com productName se disponível, senão retorna erro
        if (!productNameToScore) {
          return {
            identifiedProductName: "Erro na Identificação",
            category: "Desconhecida",
            carbonFootprint: 0,
            waterUsage: 0,
            sustainabilityScore: 0,
            impactNotes: ["Ocorreu um erro ao tentar identificar o produto na foto."],
            identified: false,
            ecoActions: ["Não foi possível sugerir ações devido a um erro na identificação do produto."],
          };
        }
      }
    }

    if (!productNameToScore) {
      return { // Caso onde não há nem foto nem nome de produto
        identifiedProductName: "Nenhum produto fornecido",
        category: "Desconhecida",
        carbonFootprint: 0,
        waterUsage: 0,
        sustainabilityScore: 0,
        impactNotes: ["Nenhum nome de produto ou imagem foi fornecido para análise."],
        identified: false,
        ecoActions: ["Forneça um nome de produto ou imagem para análise."],
      };
    }
    
    if (!initialProductDescription) {
        initialProductDescription = productNameToScore;
    }

    try {
      const scoringResult: ScoreProductByNameOutput = await scoreProductByName({ productName: productNameToScore });

      let finalEcoActions: string[] = ["Nenhuma ação específica gerada pela IA."];
      if (scoringResult.identified) {
          const ecoActionsOutput = await ecoActionsPrompt({
              productName: scoringResult.name, // Usa o nome normalizado pela IA
              productDescription: initialProductDescription,
              productCategory: scoringResult.category
          });
          if (ecoActionsOutput.output?.actions && ecoActionsOutput.output.actions.length > 0) {
              finalEcoActions = ecoActionsOutput.output.actions;
          }
      } else if (productIdentifiedFromPhoto && !scoringResult.identified) {
         // Produto foi identificado na foto, mas IA de score não conseguiu pontuar
         // Ainda assim, tentar gerar ecoActions com base no nome identificado
          const ecoActionsOutput = await ecoActionsPrompt({
              productName: productNameToScore,
              productDescription: initialProductDescription,
              productCategory: "Desconhecida"
          });
          if (ecoActionsOutput.output?.actions && ecoActionsOutput.output.actions.length > 0) {
              finalEcoActions = ecoActionsOutput.output.actions;
          }
      }


      return {
        identifiedProductName: scoringResult.name || productNameToScore,
        category: scoringResult.category,
        carbonFootprint: scoringResult.carbonFootprint,
        waterUsage: scoringResult.waterUsage,
        sustainabilityScore: scoringResult.sustainabilityScore,
        impactNotes: scoringResult.notes,
        identified: scoringResult.identified || productIdentifiedFromPhoto, // Se foi identificado na foto OU pontuado
        ecoActions: finalEcoActions,
      };

    } catch (error) {
      console.error("Erro no fluxo analyzeProductFlow durante pontuação ou geração de ações:", error);
      return {
        identifiedProductName: productNameToScore,
        category: "Erro",
        carbonFootprint: 0,
        waterUsage: 0,
        sustainabilityScore: 0,
        impactNotes: ["Ocorreu um erro ao tentar analisar o produto."],
        identified: productIdentifiedFromPhoto, // Mantém identified se veio da foto
        ecoActions: ["Ocorreu um erro ao gerar sugestões de ações."],
      };
    }
  }
);

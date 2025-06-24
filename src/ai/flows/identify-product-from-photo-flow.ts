
'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit que identifica um produto a partir de uma foto.
 *
 * - identifyProductFromPhoto - Uma função que recebe uma imagem e retorna o nome do produto identificado.
 * - IdentifyProductFromPhotoInput - O tipo de entrada para a função identifyProductFromPhoto.
 * - IdentifyProductFromPhotoOutput - O tipo de retorno para a função identifyProductFromPhoto.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyProductFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Uma foto de um objeto, como um data URI que deve incluir um MIME type e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyProductFromPhotoInput = z.infer<typeof IdentifyProductFromPhotoInputSchema>;

const IdentifyProductFromPhotoOutputSchema = z.object({
  identifiedProductName: z.string().describe("O nome do principal produto de consumo identificado na foto. Deve ser específico o suficiente para uma análise de impacto (ex: 'camiseta de algodão', 'smartphone modelo X', 'lata de refrigerante de alumínio'). Se nenhum produto for claramente identificável ou se for algo muito genérico/abstrato, retorne uma string vazia."),
  identified: z.boolean().describe("Indica se um produto de consumo comum foi claramente identificado na foto. Se for uma paisagem, pessoa, animal, ou objeto não claro, defina como false."),
});
export type IdentifyProductFromPhotoOutput = z.infer<typeof IdentifyProductFromPhotoOutputSchema>;

// Cache em memória para os resultados de identificação de fotos para garantir consistência.
const photoIdentificationCache = new Map<string, IdentifyProductFromPhotoOutput>();

export async function identifyProductFromPhoto(input: IdentifyProductFromPhotoInput): Promise<IdentifyProductFromPhotoOutput> {
  const photoDataUriKey = input.photoDataUri;

  if (photoIdentificationCache.has(photoDataUriKey)) {
    console.log('[CACHE HIT] para identificação de foto.');
    return photoIdentificationCache.get(photoDataUriKey)!;
  }

  console.log('[CACHE MISS] para identificação de foto. Chamando IA.');
  const result = await identifyProductFromPhotoFlow(input);
  
  // Armazena no cache se um produto foi identificado
  if (result.identified) {
      photoIdentificationCache.set(photoDataUriKey, result);
  }

  return result;
}

const prompt = ai.definePrompt({
  name: 'identifyProductFromPhotoPrompt',
  input: { schema: IdentifyProductFromPhotoInputSchema },
  output: { schema: IdentifyProductFromPhotoOutputSchema },
  prompt: `Você é um assistente de IA especialista em identificar produtos de consumo comuns em imagens.

Dada a foto a seguir, identifique o principal produto de consumo visível.
Foto: {{media url=photoDataUri}}

Concentre-se em um único produto principal. Se houver vários, escolha o mais proeminente ou o que parece ser o foco.
O nome do produto deve ser específico o suficiente para uma análise de impacto ambiental (ex: 'garrafa de água de plástico PET 500ml', 'tênis de corrida de material sintético', 'embalagem de salgadinho laminada'). Evite nomes genéricos como 'roupa' ou 'comida'.
Se a imagem não contiver um produto de consumo claro (ex: paisagem, animal, pessoa apenas), ou se o objeto for muito obscuro para identificar, defina 'identified' como false e 'identifiedProductName' como uma string vazia.
Responda apenas no formato JSON especificado pelo esquema de saída.
`,
});

const identifyProductFromPhotoFlow = ai.defineFlow(
  {
    name: 'identifyProductFromPhotoFlow',
    inputSchema: IdentifyProductFromPhotoInputSchema,
    outputSchema: IdentifyProductFromPhotoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (output) {
        // Garante que identifiedProductName seja vazio se não identificado
        if (!output.identified) {
            output.identifiedProductName = "";
        }
        return output;
    }
    // Se output for null, indica falha na geração da LLM ou formato incorreto.
    return {
        identifiedProductName: "",
        identified: false,
    };
  }
);

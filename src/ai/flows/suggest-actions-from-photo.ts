
'use server';
/**
 * @fileOverview Este arquivo define um fluxo Genkit que sugere ações ambientalmente conscientes com base em uma foto de um objeto.
 * ESTE FLUXO FOI SUBSTITUÍDO POR `analyzeProductFlow` E SERÁ REMOVIDO.
 *
 * - suggestActionsFromPhoto - Uma função que toma uma imagem data URI e retorna uma lista de ações sugeridas.
 * - SuggestActionsFromPhotoInput - O tipo de entrada para a função suggestActionsFromPhoto.
 * - SuggestActionsFromPhotoOutput - O tipo de retorno para a função suggestActionsFromPhoto.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionsFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Uma foto de um objeto, como um data URI que deve incluir um MIME type e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestActionsFromPhotoInput = z.infer<typeof SuggestActionsFromPhotoInputSchema>;

const SuggestActionsFromPhotoOutputSchema = z.object({
  actions: z
    .array(z.string())
    .describe('Uma lista de ações ambientalmente conscientes sugeridas, em Português.'),
});
export type SuggestActionsFromPhotoOutput = z.infer<typeof SuggestActionsFromPhotoOutputSchema>;

export async function suggestActionsFromPhoto(input: SuggestActionsFromPhotoInput): Promise<SuggestActionsFromPhotoOutput> {
  console.warn("DEPRECATED: suggestActionsFromPhotoFlow is deprecated. Use analyzeProductFlow instead.");
  return suggestActionsFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionsFromPhotoPrompt',
  input: {schema: SuggestActionsFromPhotoInputSchema},
  output: {schema: SuggestActionsFromPhotoOutputSchema},
  prompt: `Você é um assistente de IA projetado para sugerir ações ambientalmente conscientes com base na foto de um objeto.

  Dada a foto a seguir, sugira uma lista de 2-4 ações que o usuário pode realizar para ser mais sustentável. As sugestões devem estar em português.
  Concentre-se em:
  1. Formas corretas de descarte e reciclagem.
  2. Ideias criativas para reutilização ou upcycling.
  3. Dicas para prolongar a vida útil do produto.

  Foto: {{media url=photoDataUri}}
  Ações:`, 
});

const suggestActionsFromPhotoFlow = ai.defineFlow(
  {
    name: 'suggestActionsFromPhotoFlow',
    inputSchema: SuggestActionsFromPhotoInputSchema,
    outputSchema: SuggestActionsFromPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

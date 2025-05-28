'use server';
/**
 * @fileOverview This file defines a Genkit flow that suggests environmentally conscious actions based on a photo of an object.
 *
 * - suggestActionsFromPhoto - A function that takes an image data URI and returns a list of suggested actions.
 * - SuggestActionsFromPhotoInput - The input type for the suggestActionsFromPhoto function.
 * - SuggestActionsFromPhotoOutput - The return type for the suggestActionsFromPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionsFromPhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an object, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestActionsFromPhotoInput = z.infer<typeof SuggestActionsFromPhotoInputSchema>;

const SuggestActionsFromPhotoOutputSchema = z.object({
  actions: z
    .array(z.string())
    .describe('A list of suggested environmentally conscious actions, in Portuguese.'),
});
export type SuggestActionsFromPhotoOutput = z.infer<typeof SuggestActionsFromPhotoOutputSchema>;

export async function suggestActionsFromPhoto(input: SuggestActionsFromPhotoInput): Promise<SuggestActionsFromPhotoOutput> {
  return suggestActionsFromPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionsFromPhotoPrompt',
  input: {schema: SuggestActionsFromPhotoInputSchema},
  output: {schema: SuggestActionsFromPhotoOutputSchema},
  prompt: `Você é um assistente de IA projetado para sugerir ações ambientalmente conscientes com base na foto de um objeto.

  Dada a foto a seguir, sugira uma lista de ações que o usuário pode realizar para ser mais sustentável. As sugestões devem estar em português.

  Foto: {{media url=photoDataUri}}
  Ações:`, // Ensure the LLM returns a list of actions
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

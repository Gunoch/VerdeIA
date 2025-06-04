
import { config } from 'dotenv';
config();

// Removido: import '@/ai/flows/suggest-actions-from-photo.ts';
import '@/ai/flows/score-product-by-name-flow.ts';
import '@/ai/flows/identify-product-from-photo-flow.ts';
import '@/ai/flows/analyze-product-flow.ts'; // Adicionado novo fluxo unificado
    

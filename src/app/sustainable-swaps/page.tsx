
// ESTA PÁGINA FOI REMOVIDA POIS SUA FUNCIONALIDADE FOI UNIFICADA
// COM A PÁGINA DE SUGESTÕES (AGORA ANÁLISE DE PRODUTO)
// O CONTEÚDO DE DADOS FOI MOVIDO PARA /src/lib/data/sustainable-swaps-data.ts

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ShoppingCart, PackageOpen, Home } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link"; 
import { Metadata } from "next";
import { redirect } from 'next/navigation';

// export const metadata: Metadata = { // Comentado para evitar erro de build
//   title: "Trocas Sustentáveis - VerdeAI (REMOVIDO)",
//   description: "Descubra alternativas ecológicas para produtos do dia a dia.",
// };

export default function SustainableSwapsPage() {
  // Redireciona para a nova página de análise de produto ou para a home
  // já que esta página não existe mais como entidade separada.
  // Preferencialmente para a home ou a nova página de análise /suggestions.
  // Para este exemplo, vamos redirecionar para a home.
  redirect('/'); 

  // O código abaixo não será mais executado devido ao redirect.
  // Ele é mantido aqui apenas para referência do conteúdo original da página antes da refatoração.

  interface SwapItem {
    original: string;
    sustainable: string;
    benefit: string;
  }
  
  interface SwapCategory {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    imageUrl: string;
    imageHint: string; 
    exampleSwaps: SwapItem[];
  }
  
  const swapCategories: SwapCategory[] = [
    // Os dados foram movidos para /src/lib/data/sustainable-swaps-data.ts
  ];


  return (
    <div className="space-y-10 md:space-y-12">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Trocas Sustentáveis (Página Removida)</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Esta funcionalidade foi integrada à Análise de Produto.
        </p>
      </header>

      {/* Conteúdo original da página removido pois os dados estão em sustainable-swaps-data.ts
          e a lógica de exibição está em SustainableSwapsSection.tsx */}
      
       <Card className="mt-8 bg-card border-border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Home className="w-5 h-5 text-accent" /> Dica Pro!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Comece com uma ou duas trocas que pareçam mais fáceis e impactantes para você. Não tente mudar tudo da noite para o dia! Com o tempo, essas pequenas mudanças consistentes somam um impacto positivo significativo no meio ambiente e muitas vezes também podem economizar seu dinheiro.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

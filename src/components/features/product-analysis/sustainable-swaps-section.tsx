
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRelevantSwapsByCategory, type SwapCategoryData, type SwapItem } from "@/lib/data/sustainable-swaps-data";
import { ArrowRight, CheckCircle, Leaf } from "lucide-react";
import Image from "next/image";

interface SustainableSwapsSectionProps {
  productCategory: string;
  originalProductName?: string; // Para personalizar o título, se disponível
}

export default function SustainableSwapsSection({ productCategory, originalProductName }: SustainableSwapsSectionProps) {
  const relevantSwapCategory: SwapCategoryData | undefined = getRelevantSwapsByCategory(productCategory);

  if (!relevantSwapCategory || relevantSwapCategory.exampleSwaps.length === 0) {
    return (
        <Card className="mt-6 bg-card border-border shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="w-5 h-5 text-primary" />
                Alternativas Verdes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                Não encontramos sugestões de trocas sustentáveis específicas para a categoria &quot;{productCategory}&quot; no momento.
                Considere pesquisar por alternativas reutilizáveis ou com menor impacto ambiental para produtos similares.
                </p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="mt-6 bg-card border-border shadow-md overflow-hidden">
       {relevantSwapCategory.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={relevantSwapCategory.imageUrl}
            alt={relevantSwapCategory.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Leaf className="w-5 h-5 text-primary" />
          Alternativas Verdes para {originalProductName || relevantSwapCategory.name}
        </CardTitle>
        <CardDescription>
          {relevantSwapCategory.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {relevantSwapCategory.exampleSwaps.map((swap, idx) => (
            <li key={idx} className="p-4 border rounded-md bg-background hover:bg-muted/30 transition-colors shadow-sm">
              <p className="text-md font-medium text-foreground mb-1">
                Em vez de: <span className="font-semibold text-destructive/80">{swap.original}</span>
              </p>
              <div className="flex items-center justify-center my-2">
                 <ArrowRight className="h-5 w-5 text-muted-foreground transform rotate-90 sm:rotate-0" />
              </div>
              <p className="text-md font-medium text-foreground mb-1.5">
                Experimente: <span className="font-semibold text-primary">{swap.sustainable}</span>
              </p>
              <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2 p-2 bg-primary/5 rounded-md">
                <CheckCircle className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span><strong>Benefício:</strong> {swap.benefit}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

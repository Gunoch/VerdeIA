
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingBag, Thermometer, Droplets, ShieldCheck, Brain } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { useState } from "react";
import ProductAnalysisForm, { type AnalyzedProduct } from "@/components/features/impact-scores/product-analysis-form";

// Metadata estática não pode ser usada em arquivos com "use client"
// export const metadata: Metadata = {
//   title: "Pontuações de Impacto - VerdeAI",
//   description: "Entenda o impacto ambiental de diversos produtos ou analise os seus.",
// };

interface ProductImpact {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  imageHint: string;
  carbonFootprint: number;
  waterUsage: number;
  sustainabilityScore: number;
  notes?: string[];
  isAiEstimated?: boolean;
  identified?: boolean;
}

const dummyProducts: ProductImpact[] = [
  {
    id: "1",
    name: "Camiseta de Algodão Convencional",
    category: "Vestuário",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "cotton shirt",
    carbonFootprint: 70,
    waterUsage: 80,
    sustainabilityScore: 30,
    notes: ["Alto consumo de água no cultivo de algodão.", "Frequentemente envolve pesticidas e fertilizantes sintéticos."]
  },
  {
    id: "2",
    name: "Escova de Dentes de Bambu Orgânico",
    category: "Cuidados Pessoais",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "bamboo toothbrush",
    carbonFootprint: 15,
    waterUsage: 20,
    sustainabilityScore: 85,
    notes: ["Cabo biodegradável (remover cerdas).", "Bambu de origem sustentável, de rápido crescimento."]
  },
  {
    id: "3",
    name: "Copo de Café Reutilizável de Aço Inoxidável",
    category: "Utensílios de Cozinha",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "reusable cup",
    carbonFootprint: 5,
    waterUsage: 5,
    sustainabilityScore: 90,
    notes: ["Reduz o desperdício de copos descartáveis.", "Durável e de longa duração se bem cuidado.", "A fabricação tem uma pegada inicial, compensada pela reutilização."]
  },
   {
    id: "4",
    name: "Garrafa de Água Plástica Descartável (500ml)",
    category: "Bebidas",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "plastic bottle",
    carbonFootprint: 85,
    waterUsage: 60,
    sustainabilityScore: 10,
    notes: ["Contribui para a poluição plástica.", "Alto consumo de energia para produção e transporte.", "Baixas taxas de reciclagem globalmente."]
  },
];

function ProductImpactCard({ product }: { product: ProductImpact }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      {product.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={product.imageHint || "product image"}
          />
        </div>
      )}
      {!product.imageUrl && product.isAiEstimated && (
         <div className="relative w-full h-48 bg-muted flex flex-col items-center justify-center text-muted-foreground">
            <Brain className="w-16 h-16 mb-2" />
            <p className="text-sm">Imagem não gerada pela IA</p>
         </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <ShoppingBag className="w-4 h-4" /> {product.category}
        </CardDescription>
        {product.isAiEstimated && (
            <p className="text-xs text-accent font-medium flex items-center gap-1"><Brain size={14} /> Pontuação estimada por IA</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="flex items-center gap-1"><Thermometer className="w-4 h-4 text-red-500" />Pegada de Carbono</span>
            <span className="font-semibold">{product.carbonFootprint}/100</span>
          </div>
          <Progress value={product.carbonFootprint} aria-label={`Pegada de carbono ${product.carbonFootprint}%`} className="h-2 [&>div]:bg-red-500" />
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="flex items-center gap-1"><Droplets className="w-4 h-4 text-blue-500" />Uso de Água</span>
            <span className="font-semibold">{product.waterUsage}/100</span>
          </div>
          <Progress value={product.waterUsage} aria-label={`Uso de água ${product.waterUsage}%`} className="h-2 [&>div]:bg-blue-500" />
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary" />Sustentabilidade Geral</span>
            <span className="font-semibold">{product.sustainabilityScore}/100</span>
          </div>
          <Progress value={product.sustainabilityScore} aria-label={`Pontuação de sustentabilidade ${product.sustainabilityScore}%`} className="h-2 [&>div]:bg-primary" />
        </div>
      </CardContent>
      {product.notes && product.notes.length > 0 && (
        <CardFooter className="flex-col items-start pt-3 border-t mt-auto">
          <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Considerações Chave:</h4>
          <ul className="list-disc list-inside space-y-1">
            {product.notes.map((note, idx) => (
              <li key={idx} className="text-xs text-muted-foreground">{note}</li>
            ))}
          </ul>
        </CardFooter>
      )}
       {!product.notes && product.isAiEstimated && (
         <CardFooter className="flex-col items-start pt-3 border-t mt-auto">
            <p className="text-xs text-muted-foreground">A IA não forneceu considerações adicionais para este produto.</p>
         </CardFooter>
       )}
    </Card>
  );
}


export default function ImpactScoresPage() {
  const [analyzedProduct, setAnalyzedProduct] = useState<AnalyzedProduct | null>(null);

  const handleAnalysisComplete = (product: AnalyzedProduct | null) => {
    setAnalyzedProduct(product);
  };

  // Para manter a consistência com a interface ProductImpact, mapeamos AnalyzedProduct
  const displayableAnalyzedProduct: ProductImpact | null = analyzedProduct && analyzedProduct.identified ? {
    id: `ai-${new Date().getTime()}`, // Gera um ID único
    name: analyzedProduct.name,
    category: analyzedProduct.category,
    imageUrl: "", // IA não fornece imagem, podemos usar um placeholder ou omitir
    imageHint: "ai analyzed product",
    carbonFootprint: analyzedProduct.carbonFootprint,
    waterUsage: analyzedProduct.waterUsage,
    sustainabilityScore: analyzedProduct.sustainabilityScore,
    notes: analyzedProduct.notes,
    isAiEstimated: true,
    identified: true,
  } : null;


  return (
    <div className="space-y-8">
       <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Pontuações de Impacto de Produtos</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Entenda a pegada ambiental de diversos produtos. Analise um item específico por nome ou foto, ou explore nossa lista de exemplos.
        </p>
      </header>

      <ProductAnalysisForm onAnalysisComplete={handleAnalysisComplete} />

      {displayableAnalyzedProduct && (
        <section className="mt-10 pt-8 border-t">
          <h2 className="text-2xl font-semibold text-primary mb-4 text-center">Produto Analisado pela IA</h2>
          <div className="max-w-md mx-auto">
            <ProductImpactCard product={displayableAnalyzedProduct} />
          </div>
        </section>
      )}

      {analyzedProduct && !analyzedProduct.identified && (
        <section className="mt-10 pt-8 border-t">
           <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Produto Não Identificado</AlertTitle>
            <AlertDescription>
              A IA não conseguiu identificar ou pontuar o produto fornecido. Tente ser mais específico ou usar uma imagem mais clara.
            </AlertDescription>
          </Alert>
        </section>
      )}


      <section className={`mt-10 pt-8 ${analyzedProduct ? 'border-t' : ''}`}>
        <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Exemplos de Pontuações de Impacto</h2>
         <p className="text-center text-md text-muted-foreground mb-6 max-w-3xl mx-auto">
          Pontuações mais baixas para Pegada de Carbono e Uso de Água são melhores. Uma Pontuação de Sustentabilidade mais alta é melhor.
        </p>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {dummyProducts.map((product) => (
            <ProductImpactCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      <Card className="mt-8 bg-card border-border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5 text-accent" /> Aviso Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            As pontuações de exemplo são ilustrativas e baseadas em dados generalizados. As pontuações geradas por IA são estimativas e podem não refletir perfeitamente o impacto real de um item específico. O impacto ambiental real pode variar significativamente com base em processos de fabricação, logística, uso e descarte. Este recurso destina-se a fins educacionais e de conscientização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    
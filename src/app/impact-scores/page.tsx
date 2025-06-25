
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ShoppingBag, Thermometer, Droplets, ShieldCheck, Brain, Info } from "lucide-react";
import Image from "next/image";

// Metadata estática não pode ser usada em arquivos com "use client"
// export const metadata: Metadata = {
//   title: "Exemplos de Pontuações de Impacto - VerdeAI",
//   description: "Explore exemplos do impacto ambiental de diversos produtos.",
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
    imageUrl: "/images/camisa algodao verdeia.png",
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
    imageUrl: "/images/escovabambu.png",
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
    imageUrl: "/images/reusable-cup.png",
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
    imageUrl: "/images/plastic-bottle.png",
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
          />
        </div>
      )}
      {!product.imageUrl && product.isAiEstimated && (
         <div className="relative w-full h-48 bg-muted flex flex-col items-center justify-center text-muted-foreground">
            <Brain className="w-16 h-16 mb-2" />
            <p className="text-sm">Estimativa da IA (sem imagem)</p>
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
            <span className="flex items-center gap-1 font-medium"><Thermometer className="w-4 h-4 text-red-500" />Pegada de Carbono</span>
            <span className="font-semibold">{product.carbonFootprint}/100</span>
          </div>
          <Progress value={product.carbonFootprint} aria-label={`Pegada de carbono ${product.carbonFootprint}%`} className="h-2.5 [&>div]:bg-red-500" />
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="flex items-center gap-1 font-medium"><Droplets className="w-4 h-4 text-blue-500" />Uso de Água</span>
            <span className="font-semibold">{product.waterUsage}/100</span>
          </div>
          <Progress value={product.waterUsage} aria-label={`Uso de água ${product.waterUsage}%`} className="h-2.5 [&>div]:bg-blue-500" />
        </div>
        <div>
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-4 h-4 text-primary" />Sustentabilidade Geral</span>
            <span className="font-semibold">{product.sustainabilityScore}/100</span>
          </div>
          <Progress value={product.sustainabilityScore} aria-label={`Pontuação de sustentabilidade ${product.sustainabilityScore}%`} className="h-2.5 [&>div]:bg-primary" />
        </div>
      </CardContent>
      {product.notes && product.notes.length > 0 && (
        <CardFooter className="flex-col items-start pt-3 border-t mt-auto">
          <h4 className="text-sm font-semibold mb-1.5 text-muted-foreground flex items-center gap-1"><Info size={16} />Considerações Chave:</h4>
          <ul className="list-disc list-inside space-y-1 pl-2">
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
  return (
    <div className="space-y-8">
       <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Exemplos de Pontuações de Impacto</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore nossa lista de exemplos para entender a pegada ambiental de diversos produtos. Pontuações mais baixas para Pegada de Carbono e Uso de Água são melhores, enquanto uma Pontuação de Sustentabilidade mais alta é desejável.
        </p>
      </header>

      <section className="mt-10 pt-8">
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
            As pontuações de exemplo são ilustrativas e baseadas em dados generalizados. O impacto ambiental real pode variar significativamente com base em processos de fabricação, logística, uso e descarte. Este recurso destina-se a fins educacionais e de conscientização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ShoppingBag, Thermometer, Droplets, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pontuações de Impacto - VerdeAI",
  description: "Entenda o impacto ambiental de diversos produtos.",
};

interface ProductImpact {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  imageHint: string; // Stays in English for data-ai-hint
  carbonFootprint: number; 
  waterUsage: number; 
  sustainabilityScore: number; 
  notes?: string[];
}

const dummyProducts: ProductImpact[] = [
  {
    id: "1",
    name: "Camiseta de Algodão Convencional",
    category: "Vestuário",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "cotton t-shirt",
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
    imageHint: "reusable coffee cup",
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
    imageHint: "plastic water bottle",
    carbonFootprint: 85,
    waterUsage: 60, 
    sustainabilityScore: 10,
    notes: ["Contribui para a poluição plástica.", "Alto consumo de energia para produção e transporte.", "Baixas taxas de reciclagem globalmente."]
  },
];

export default function ImpactScoresPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Pontuações de Impacto de Produtos</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Entenda a pegada ambiental de diversos produtos. Pontuações mais baixas para Pegada de Carbono e Uso de Água são melhores. Uma Pontuação de Sustentabilidade mais alta é melhor.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {dummyProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative w-full h-48">
              <Image 
                src={product.imageUrl} 
                alt={product.name} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover" 
                data-ai-hint={product.imageHint}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{product.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <ShoppingBag className="w-4 h-4" /> {product.category}
              </CardDescription>
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
          </Card>
        ))}
      </div>
      <Card className="mt-8 bg-card border-border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5 text-accent" /> Aviso Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Estas pontuações são ilustrativas e baseadas em dados generalizados. O impacto ambiental real pode variar significativamente com base em processos de fabricação específicos, logística da cadeia de suprimentos, padrões de uso do consumidor e descarte no fim da vida útil. Este recurso destina-se a fins educacionais e de conscientização.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

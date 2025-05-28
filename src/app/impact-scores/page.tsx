import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ShoppingBag, Zap, Thermometer, Droplets, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Scores - VerdeAI",
  description: "Understand the environmental impact of various products.",
};

interface ProductImpact {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  imageHint: string;
  carbonFootprint: number; // Score 0-100 (lower is better)
  waterUsage: number; // Score 0-100 (lower is better)
  sustainabilityScore: number; // Overall score 0-100 (higher is better)
  notes?: string[];
}

const dummyProducts: ProductImpact[] = [
  {
    id: "1",
    name: "Conventional Cotton T-Shirt",
    category: "Apparel",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "cotton t-shirt",
    carbonFootprint: 70,
    waterUsage: 80,
    sustainabilityScore: 30,
    notes: ["High water consumption during cotton farming.", "Often involves pesticides and synthetic fertilizers."]
  },
  {
    id: "2",
    name: "Organic Bamboo Toothbrush",
    category: "Personal Care",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "bamboo toothbrush",
    carbonFootprint: 15,
    waterUsage: 20,
    sustainabilityScore: 85,
    notes: ["Biodegradable handle (remove bristles).", "Sustainably sourced bamboo, fast-growing."]
  },
  {
    id: "3",
    name: "Reusable Stainless Steel Coffee Cup",
    category: "Kitchenware",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "reusable coffee cup",
    carbonFootprint: 5, 
    waterUsage: 5,  
    sustainabilityScore: 90,
    notes: ["Reduces single-use cup waste.", "Durable and long-lasting if cared for.", "Manufacturing has an initial footprint, offset by reuse."]
  },
   {
    id: "4",
    name: "Single-Use Plastic Water Bottle (500ml)",
    category: "Beverages",
    imageUrl: "https://placehold.co/300x200.png",
    imageHint: "plastic water bottle",
    carbonFootprint: 85,
    waterUsage: 60, // Includes water for plastic production
    sustainabilityScore: 10,
    notes: ["Contributes to plastic pollution.", "High energy consumption for production and transport.", "Low recycling rates globally."]
  },
];

export default function ImpactScoresPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Product Impact Scores</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Understand the environmental footprint of various products. Lower scores for Carbon Footprint and Water Usage are better. A higher Sustainability Score is better.
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
                  <span className="flex items-center gap-1"><Thermometer className="w-4 h-4 text-red-500" />Carbon Footprint</span>
                  <span className="font-semibold">{product.carbonFootprint}/100</span>
                </div>
                <Progress value={product.carbonFootprint} aria-label={`Carbon footprint ${product.carbonFootprint}%`} className="h-2 [&>div]:bg-red-500" />
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center gap-1"><Droplets className="w-4 h-4 text-blue-500" />Water Usage</span>
                  <span className="font-semibold">{product.waterUsage}/100</span>
                </div>
                <Progress value={product.waterUsage} aria-label={`Water usage ${product.waterUsage}%`} className="h-2 [&>div]:bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary" />Overall Sustainability</span>
                  <span className="font-semibold">{product.sustainabilityScore}/100</span>
                </div>
                <Progress value={product.sustainabilityScore} aria-label={`Sustainability score ${product.sustainabilityScore}%`} className="h-2 [&>div]:bg-primary" />
              </div>
              
            </CardContent>
            {product.notes && product.notes.length > 0 && (
                <CardFooter className="flex-col items-start pt-3 border-t mt-auto">
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Key Considerations:</h4>
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
          <CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5 text-accent" /> Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            These scores are illustrative and based on generalized data. Actual environmental impact can vary significantly based on specific manufacturing processes, supply chain logistics, consumer usage patterns, and end-of-life disposal. This feature is intended for educational and awareness purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

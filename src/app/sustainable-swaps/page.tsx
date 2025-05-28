import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ShoppingCart, PackageOpen, Home } from "lucide-react"; // Updated Package to PackageOpen, Lightbulb to Home
import Image from "next/image";
import Link from "next/link"; // Keep Link if you plan sub-pages
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sustainable Swaps - VerdeAI",
  description: "Discover eco-friendly alternatives for everyday products.",
};

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
  {
    id: "kitchen",
    name: "Kitchen Essentials",
    description: "Reduce waste and chemicals in your kitchen with these simple, effective swaps for a healthier home and planet.",
    icon: <ShoppingCart className="w-7 h-7 text-primary" />,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "eco-friendly kitchen items",
    exampleSwaps: [
      { original: "Plastic Cling Wrap", sustainable: "Beeswax Wraps or Reusable Silicone Lids", benefit: "Reduces single-use plastic waste, food-safe and reusable." },
      { original: "Disposable Paper Towels", sustainable: "Reusable Cloth Napkins & Unpaper Towels", benefit: "Washable, durable, and significantly reduces paper consumption." },
      { original: "Plastic Grocery Bags", sustainable: "Reusable Tote Bags (Cotton, Jute, etc.)", benefit: "Prevents plastic pollution and supports sustainable materials." },
      { original: "Teflon Non-Stick Pans", sustainable: "Cast Iron or Stainless Steel Cookware", benefit: "Avoids PFCs, durable, and can last generations." },
    ],
  },
  {
    id: "personal-care",
    name: "Personal Care Products",
    description: "Choose personal care items that are kind to your body and the environment, minimizing plastic and harmful ingredients.",
    icon: <PackageOpen className="w-7 h-7 text-primary" />, // Updated icon
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "natural personal care products",
    exampleSwaps: [
      { original: "Plastic Toothbrush", sustainable: "Bamboo Toothbrush with Natural Bristles", benefit: "Biodegradable handle, reduces plastic waste." },
      { original: "Liquid Soap in Plastic Bottle", sustainable: "Bar Soap (Package-Free or Paper-Wrapped)", benefit: "Drastically less plastic packaging, often more natural." },
      { original: "Disposable Makeup Wipes", sustainable: "Reusable Makeup Remover Pads & Natural Oils", benefit: "Washable, gentle on skin, and significantly reduces daily waste." },
      { original: "Shampoo in Plastic Bottle", sustainable: "Shampoo Bars or Refillable Options", benefit: "Eliminates plastic bottles, concentrated formulas." },
    ],
  },
  {
    id: "home-cleaning",
    name: "Home & Cleaning Supplies",
    description: "Opt for sustainable and non-toxic solutions for a clean, green, and healthy living environment.",
    icon: <Home className="w-7 h-7 text-primary" />, // Updated icon
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "green cleaning products",
    exampleSwaps: [
      { original: "Chemical Cleaners in Plastic Bottles", sustainable: "DIY Cleaners (Vinegar, Baking Soda) or Eco-Concentrates", benefit: "Reduces harsh chemicals, plastic waste, and indoor air pollution." },
      { original: "Disposable Cleaning Wipes", sustainable: "Reusable Microfiber Cloths & Spray Bottles", benefit: "More effective cleaning, washable, and avoids single-use plastics." },
      { original: "Synthetic Air Fresheners", sustainable: "Essential Oil Diffusers or Natural Potpourri", benefit: "Avoids synthetic fragrances and VOCs, improves air quality naturally." },
    ],
  },
];

export default function SustainableSwapsPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Sustainable Swaps</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover easy and impactful eco-friendly alternatives for common household products. Small changes can make a big difference for our planet!
        </p>
      </header>

      {swapCategories.map((category) => (
        <Card key={category.id} className="overflow-hidden shadow-lg border-border">
          <div className="md:flex md:flex-row">
            <div className="md:w-1/3 md:shrink-0">
              <div className="relative w-full h-64 md:h-full">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  data-ai-hint={category.imageHint}
                />
              </div>
            </div>
            <div className="flex flex-col md:w-2/3">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-1">
                  {category.icon}
                  <CardTitle className="text-xl md:text-2xl">{category.name}</CardTitle>
                </div>
                <CardDescription className="text-sm">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <h4 className="font-semibold mb-3 text-md text-foreground">Example Swaps:</h4>
                <ul className="space-y-3">
                  {category.exampleSwaps.map((swap, idx) => (
                    <li key={idx} className="p-3 border rounded-md bg-background hover:bg-muted/30 transition-colors shadow-sm">
                      <p className="text-sm leading-tight">
                        <span className="font-medium text-destructive/80 line-through">{swap.original}</span>
                        <ArrowRight className="inline mx-1.5 h-4 w-4 text-muted-foreground align-middle" />
                        <span className="font-medium text-primary">{swap.sustainable}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 mt-px text-primary shrink-0" />
                        {swap.benefit}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {/* Optional: Link to a more detailed page for each category
              <CardFooter className="mt-auto pt-4 border-t">
                <Button asChild variant="link" className="text-primary p-0 h-auto">
                  <Link href={`/sustainable-swaps/${category.id}`}>Explore More in {category.name} &rarr;</Link>
                </Button>
              </CardFooter>
              */}
            </div>
          </div>
        </Card>
      ))}
       <Card className="mt-8 bg-card border-border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Home className="w-5 h-5 text-accent" /> Pro Tip!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Start with one or two swaps that feel easiest and most impactful for you. Don't try to change everything overnight! Over time, these small, consistent changes add up to a significant positive impact on the environment and can often save you money too.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

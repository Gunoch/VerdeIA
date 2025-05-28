
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, ShoppingCart, PackageOpen, Home } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trocas Sustentáveis - VerdeAI",
  description: "Descubra alternativas ecológicas para produtos do dia a dia.",
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
  imageHint: string; // Stays in English
  exampleSwaps: SwapItem[];
}

const swapCategories: SwapCategory[] = [
  {
    id: "kitchen",
    name: "Essenciais de Cozinha",
    description: "Reduza o desperdício e os produtos químicos na sua cozinha com estas trocas simples e eficazes para um lar e planeta mais saudáveis.",
    icon: <ShoppingCart className="w-7 h-7 text-primary" />,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "eco kitchen", // Alterado de "eco-friendly kitchen items"
    exampleSwaps: [
      { original: "Filme Plástico Aderente", sustainable: "Embalagens de Cera de Abelha ou Tampas de Silicone Reutilizáveis", benefit: "Reduz o desperdício de plástico descartável, seguro para alimentos e reutilizável." },
      { original: "Toalhas de Papel Descartáveis", sustainable: "Guardanapos de Pano Reutilizáveis e Toalhas \"Despapel\"", benefit: "Lavável, durável e reduz significativamente o consumo de papel." },
      { original: "Sacolas Plásticas de Supermercado", sustainable: "Ecobags Reutilizáveis (Algodão, Juta, etc.)", benefit: "Evita a poluição plástica e apoia materiais sustentáveis." },
      { original: "Panelas Antiaderentes de Teflon", sustainable: "Panelas de Ferro Fundido ou Aço Inoxidável", benefit: "Evita PFCs, durável e pode durar gerações." },
    ],
  },
  {
    id: "personal-care",
    name: "Produtos de Higiene Pessoal",
    description: "Escolha itens de higiene pessoal que sejam gentis com seu corpo e o meio ambiente, minimizando plástico e ingredientes nocivos.",
    icon: <PackageOpen className="w-7 h-7 text-primary" />,
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "natural care", // Alterado de "natural personal care products"
    exampleSwaps: [
      { original: "Escova de Dentes de Plástico", sustainable: "Escova de Dentes de Bambu com Cerdas Naturais", benefit: "Cabo biodegradável, reduz o desperdício de plástico." },
      { original: "Sabonete Líquido em Garrafa Plástica", sustainable: "Sabonete em Barra (Sem Embalagem ou Embalado em Papel)", benefit: "Drasticamente menos embalagem plástica, geralmente mais natural." },
      { original: "Lenços Demaquilantes Descartáveis", sustainable: "Discos Demaquilantes Reutilizáveis e Óleos Naturais", benefit: "Lavável, suave para a pele e reduz significativamente o desperdício diário." },
      { original: "Shampoo em Garrafa Plástica", sustainable: "Shampoo em Barra ou Opções Refiláveis", benefit: "Elimina garrafas plásticas, fórmulas concentradas." },
    ],
  },
  {
    id: "home-cleaning",
    name: "Produtos para Casa e Limpeza",
    description: "Opte por soluções sustentáveis e não tóxicas para um ambiente de vida limpo, verde e saudável.",
    icon: <Home className="w-7 h-7 text-primary" />, 
    imageUrl: "https://placehold.co/600x400.png",
    imageHint: "green cleaning", // Alterado de "green cleaning products"
    exampleSwaps: [
      { original: "Limpadores Químicos em Garrafas Plásticas", sustainable: "Limpadores Caseiros (Vinagre, Bicarbonato de Sódio) ou Concentrados Ecológicos", benefit: "Reduz produtos químicos agressivos, desperdício de plástico e poluição do ar interno." },
      { original: "Lenços de Limpeza Descartáveis", sustainable: "Panos de Microfibra Reutilizáveis e Borrifadores", benefit: "Limpeza mais eficaz, lavável e evita plásticos de uso único." },
      { original: "Purificadores de Ar Sintéticos", sustainable: "Difusores de Óleos Essenciais ou Potpourri Natural", benefit: "Evita fragrâncias sintéticas e VOCs, melhora a qualidade do ar naturalmente." },
    ],
  },
];

export default function SustainableSwapsPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Trocas Sustentáveis</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Descubra alternativas ecológicas fáceis e impactantes para produtos domésticos comuns. Pequenas mudanças podem fazer uma grande diferença para o nosso planeta!
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
                <h4 className="font-semibold mb-3 text-md text-foreground">Exemplos de Trocas:</h4>
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

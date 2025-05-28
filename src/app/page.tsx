import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Gauge, Replace } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <section className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Welcome to VerdeAI</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Your personal AI assistant for a greener lifestyle. Discover smart suggestions, understand your impact, and find sustainable alternatives.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/suggestions">Get Smart Suggestions</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12 md:mb-16">
        <FeatureCard
          icon={<Leaf className="w-10 h-10 md:w-12 md:h-12 text-primary mb-4" />}
          title="Smart Suggestions"
          description="Upload a photo and get AI-powered tips for eco-friendly actions related to the object."
          link="/suggestions"
        />
        <FeatureCard
          icon={<Gauge className="w-10 h-10 md:w-12 md:h-12 text-primary mb-4" />}
          title="Impact Scores"
          description="Understand the environmental impact of products with clear, easy-to-understand scores."
          link="/impact-scores"
        />
        <FeatureCard
          icon={<Replace className="w-10 h-10 md:w-12 md:h-12 text-primary mb-4" />}
          title="Sustainable Swaps"
          description="Discover eco-friendly alternatives for everyday products across various categories."
          link="/sustainable-swaps"
        />
      </section>

      <section className="text-center bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">Join the Green Revolution</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          VerdeAI empowers you to make informed decisions for a more sustainable future. Every small action counts!
        </p>
        <div className="aspect-video max-w-2xl mx-auto rounded-md overflow-hidden">
          <Image 
            src="https://placehold.co/800x450.png" 
            alt="Lush green landscape with a winding river" 
            width={800} 
            height={450} 
            className="w-full h-full object-cover"
            data-ai-hint="nature landscape" 
          />
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="text-center hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="items-center">
        {icon}
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="justify-center">
         <Button asChild variant="ghost" className="text-primary hover:text-primary/90">
            <Link href={link}>Explore {title} &rarr;</Link>
         </Button>
      </CardFooter>
    </Card>
  );
}

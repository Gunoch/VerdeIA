import { ImageUploadForm } from "@/components/features/suggestions/image-upload-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sugestões Inteligentes - VerdeAI",
  description: "Receba sugestões ecológicas baseadas em IA a partir de suas fotos.",
};

export default function SuggestionsPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Sugestões Inteligentes</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Envie a imagem de um item e deixe nossa IA fornecer ações e ideias sustentáveis.
        </p>
      </header>
      <ImageUploadForm />
    </div>
  );
}

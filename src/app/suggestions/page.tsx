import { ImageUploadForm } from "@/components/features/suggestions/image-upload-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Suggestions - VerdeAI",
  description: "Get AI-powered eco-friendly suggestions based on your photos.",
};

export default function SuggestionsPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Smart Suggestions</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image of an item, and let our AI provide you with sustainable actions and ideas.
        </p>
      </header>
      <ImageUploadForm />
    </div>
  );
}

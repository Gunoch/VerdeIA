
"use client";

// ESTE COMPONENTE FOI SUBSTITUÍDO POR ProductAnalysisForm e ProductAnalysisResults
// E DEVE SER REMOVIDO FUTURAMENTE.

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, Image as ImageIcon, AlertCircle, Sparkles, Leaf } from "lucide-react";
import { suggestActionsFromPhoto, type SuggestActionsFromPhotoOutput } from "@/ai/flows/suggest-actions-from-photo";
import NextImage from "next/image"; 
import { cn } from "@/lib/utils";

export function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestActionsFromPhotoOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError("O arquivo é muito grande. Envie uma imagem com menos de 5MB.");
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setSuggestions(null); // Limpa sugestões antigas
      setError(null); // Limpa erros antigos
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Por favor, selecione um arquivo de imagem.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
        setError("Tipo de arquivo inválido ou falha na leitura. Envie uma imagem (ex: PNG, JPG, WEBP, GIF).");
        setIsLoading(false);
        return;
      }
      try {
        const result = await suggestActionsFromPhoto({ photoDataUri });
        setSuggestions(result);
      } catch (err) {
        console.error("Erro ao buscar sugestões da IA:", err);
        setError(err instanceof Error ? `Erro da IA: ${err.message}` : "Ocorreu um erro desconhecido ao buscar sugestões.");
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      console.error("Erro ao ler o arquivo com FileReader.");
      setError("Falha ao ler o arquivo. Por favor, tente novamente.");
      setIsLoading(false);
    };
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-xl mx-auto shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Obter Sugestões Inteligentes (Antigo)
          </CardTitle>
          <CardDescription>Envie a foto de um objeto e nossa IA sugerirá ações ecológicas que você pode tomar.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload-trigger" className="text-sm font-medium">Enviar Imagem</Label>
              <div className="flex items-center gap-3">
                <Input 
                  id="image-upload" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp, image/gif" 
                  onChange={handleFileChange} 
                  className="hidden" // Visually hide the default input
                />
                <Label
                  htmlFor="image-upload" // This label triggers the hidden input
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "cursor-pointer"
                  )}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Escolher Arquivo
                </Label>
                <span className="text-sm text-muted-foreground flex-1 truncate">
                  {file ? file.name : "Nenhum arquivo escolhido"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Tamanho máximo do arquivo: 5MB. Formatos suportados: PNG, JPG, WEBP, GIF.</p>
            </div>
            {previewUrl && (
              <div className="mt-4 p-4 border rounded-md bg-muted/30">
                <p className="text-sm font-medium mb-2 text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4" />Pré-visualização da Imagem:</p>
                <NextImage src={previewUrl} alt="Pré-visualização" width={200} height={200} className="rounded-md object-contain max-h-48 w-auto mx-auto shadow-md" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={isLoading || !file} size="lg" className="shadow-sm">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analisando Imagem...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-5 w-5" />
                  Obter Sugestões
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-xl mx-auto shadow">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Oops! Algo deu errado.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && !isLoading && ( 
        <Card className="max-w-xl mx-auto shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Leaf className="w-5 h-5 text-primary" />
              Ações Ecológicas Sugeridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions.actions.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-foreground">
                {suggestions.actions.map((action, index) => (
                  <li key={index} className="text-sm leading-relaxed">{action}</li>
                ))}
              </ul>
            ) : (
               <p className="text-sm text-muted-foreground">A IA não conseguiu identificar ações específicas para esta imagem, ou nenhuma ação ecológica específica se aplica. Tente enviar uma foto diferente de um objeto comum!</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

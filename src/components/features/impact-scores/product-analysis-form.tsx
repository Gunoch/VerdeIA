
"use client";

import { useState, type ChangeEvent, type FormEvent, useRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, Image as ImageIcon, AlertCircle, Search, Brain, Wand2, FileImage } from "lucide-react";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { scoreProductByName, type ScoreProductByNameOutput } from "@/ai/flows/score-product-by-name-flow";
import { identifyProductFromPhoto, type IdentifyProductFromPhotoOutput } from "@/ai/flows/identify-product-from-photo-flow";
import { Textarea } from "@/components/ui/textarea"; // Usaremos Textarea para nome do produto

export interface AnalyzedProduct extends ScoreProductByNameOutput {
  // Herda todos os campos de ScoreProductByNameOutput
  // identified: boolean; // já está em ScoreProductByNameOutput
}

interface ProductAnalysisFormProps {
  onAnalysisComplete: (product: AnalyzedProduct | null) => void;
}

export default function ProductAnalysisForm({ onAnalysisComplete }: ProductAnalysisFormProps) {
  const [productName, setProductName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isAnalyzingName, setIsAnalyzingName] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setError(null);
      onAnalysisComplete(null); // Limpa análise anterior
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleNameAnalysisSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productName.trim()) {
      setError("Por favor, insira o nome de um produto.");
      return;
    }

    setIsAnalyzingName(true);
    setError(null);
    onAnalysisComplete(null);

    try {
      const result = await scoreProductByName({ productName: productName.trim() });
      onAnalysisComplete(result);
    } catch (err) {
      console.error("Erro ao analisar produto por nome:", err);
      setError(err instanceof Error ? `Erro da IA: ${err.message}` : "Ocorreu um erro desconhecido.");
      onAnalysisComplete(null);
    } finally {
      setIsAnalyzingName(false);
    }
  };

  const handlePhotoAnalysisSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Por favor, selecione um arquivo de imagem.");
      return;
    }

    setIsAnalyzingPhoto(true);
    setError(null);
    onAnalysisComplete(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
        setError("Tipo de arquivo inválido ou falha na leitura. Envie uma imagem (ex: PNG, JPG, WEBP, GIF).");
        setIsAnalyzingPhoto(false);
        onAnalysisComplete(null);
        return;
      }
      try {
        const identificationResult = await identifyProductFromPhoto({ photoDataUri });
        if (identificationResult.identified && identificationResult.identifiedProductName) {
          const scoringResult = await scoreProductByName({ productName: identificationResult.identifiedProductName });
          onAnalysisComplete(scoringResult);
        } else {
          setError("A IA não conseguiu identificar um produto na imagem.");
          onAnalysisComplete({ identified: false, name: "Não Identificado", category: "", carbonFootprint: 0, waterUsage: 0, sustainabilityScore: 0, notes: ["Produto não pôde ser identificado a partir da imagem."] });
        }
      } catch (err) {
        console.error("Erro ao analisar produto por foto:", err);
        setError(err instanceof Error ? `Erro da IA: ${err.message}` : "Ocorreu um erro desconhecido durante a análise da foto.");
        onAnalysisComplete(null);
      } finally {
        setIsAnalyzingPhoto(false);
      }
    };
    reader.onerror = () => {
      console.error("Erro ao ler o arquivo com FileReader.");
      setError("Falha ao ler o arquivo. Por favor, tente novamente.");
      setIsAnalyzingPhoto(false);
      onAnalysisComplete(null);
    };
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            Analise o Impacto de um Produto
          </CardTitle>
          <CardDescription>Use a IA para estimar o impacto ambiental de um produto específico, por nome ou foto.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Análise por Nome */}
          <form onSubmit={handleNameAnalysisSubmit} className="space-y-4 p-4 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                <Search className="w-5 h-5"/>
                Analisar por Nome
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="productName">Nome do Produto</Label>
              <Textarea
                id="productName"
                placeholder="Ex: Camiseta de algodão orgânico, Smartphone XYZ, Maçã Fuji..."
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                rows={2}
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Seja o mais específico possível para melhores resultados.</p>
            </div>
            <Button type="submit" disabled={isAnalyzingName || isAnalyzingPhoto || !productName.trim()} className="w-full sm:w-auto">
              {isAnalyzingName ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analisando Nome...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Estimar Impacto por Nome
                </>
              )}
            </Button>
          </form>

          {/* Análise por Foto */}
          <form onSubmit={handlePhotoAnalysisSubmit} className="space-y-4 p-4 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                <FileImage className="w-5 h-5"/>
                Analisar por Foto
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image-upload-impact" className="text-sm font-medium">Enviar Imagem do Produto</Label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  id="image-upload-impact-hidden"
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto bg-background"
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Escolher Arquivo
                </Button>
                <span className="text-sm text-muted-foreground flex-1 truncate text-center sm:text-left">
                  {file ? file.name : "Nenhum arquivo escolhido"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Tamanho máximo: 5MB. Formatos: PNG, JPG, WEBP, GIF.</p>
            </div>

            {previewUrl && (
              <div className="mt-2 p-3 border rounded-md bg-background">
                <p className="text-sm font-medium mb-2 text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4" />Pré-visualização:</p>
                <NextImage src={previewUrl} alt="Pré-visualização do produto" width={150} height={150} className="rounded-md object-contain max-h-36 w-auto mx-auto shadow-sm" />
              </div>
            )}
             <Button type="submit" disabled={isAnalyzingPhoto || isAnalyzingName || !file} className="w-full sm:w-auto">
              {isAnalyzingPhoto ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analisando Foto...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-5 w-5" />
                  Estimar Impacto por Foto
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto shadow">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Oops! Algo deu errado.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

    
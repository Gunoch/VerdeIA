
"use client";

import { useState, type ChangeEvent, type FormEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, Image as ImageIcon, AlertCircle, Search, Brain, Wand2, FileImage } from "lucide-react";
import NextImage from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { analyzeProduct, type AnalyzeProductOutput } from "@/ai/flows/analyze-product-flow";

interface ProductAnalysisFormProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: AnalyzeProductOutput | null) => void;
  onAnalysisError: (errorMessage: string) => void;
}

export default function ProductAnalysisForm({ 
    onAnalysisStart, 
    onAnalysisComplete,
    onAnalysisError
}: ProductAnalysisFormProps) {
  const [productName, setProductName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        onAnalysisError("O arquivo é muito grande. Envie uma imagem com menos de 5MB.");
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
      onAnalysisError(""); // Limpa erro anterior
      onAnalysisComplete(null); // Limpa análise anterior
      setProductName(""); // Limpa nome do produto se estiver selecionando foto
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productName.trim() && !file) {
      onAnalysisError("Por favor, insira o nome de um produto ou envie uma foto.");
      return;
    }

    setIsAnalyzing(true);
    onAnalysisStart();
    onAnalysisError("");
    onAnalysisComplete(null);

    let analysisInput: { productName?: string; photoDataUri?: string } = {};

    if (file) {
      analysisInput.photoDataUri = previewUrl as string; // previewUrl é o Data URI
    }
    if (productName.trim()) {
      analysisInput.productName = productName.trim();
    }

    try {
      const result = await analyzeProduct(analysisInput);
      onAnalysisComplete(result);
    } catch (err) {
      console.error("Erro ao analisar produto:", err);
      const errorMessage = err instanceof Error ? `Erro da IA: ${err.message}` : "Ocorreu um erro desconhecido durante a análise.";
      onAnalysisError(errorMessage);
      onAnalysisComplete(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNameInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProductName(e.target.value);
    if (file) { // Se estiver digitando nome, limpa a seleção de arquivo
        setFile(null);
        setPreviewUrl(null);
    }
    onAnalysisError("");
    onAnalysisComplete(null);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          Analisar Produto
        </CardTitle>
        <CardDescription>Use a IA para uma análise completa: impacto ambiental, dicas de descarte/reutilização e alternativas sustentáveis.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                <Search className="w-5 h-5"/>
                Analisar por Nome
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="productName">Nome do Produto</Label>
              <Textarea
                id="productName"
                placeholder="Ex: Camiseta de algodão, Smartphone, Lata de refrigerante..."
                value={productName}
                onChange={handleNameInputChange}
                rows={2}
                className="bg-background"
                disabled={isAnalyzing}
              />
              <p className="text-xs text-muted-foreground">Seja específico para melhores resultados. Preencher este campo desabilitará a análise por foto.</p>
            </div>
          </div>

          <div className="text-center my-2 text-sm text-muted-foreground font-medium">OU</div>

          <div className="space-y-4 p-4 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                <FileImage className="w-5 h-5"/>
                Analisar por Foto
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image-upload-impact">Enviar Imagem do Produto</Label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input
                  id="image-upload-impact-hidden"
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  disabled={isAnalyzing || !!productName.trim()} // Desabilita se nome estiver preenchido
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto bg-background"
                  disabled={isAnalyzing || !!productName.trim()}
                >
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Escolher Arquivo
                </Button>
                <span className="text-sm text-muted-foreground flex-1 truncate text-center sm:text-left">
                  {file ? file.name : "Nenhum arquivo escolhido"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Tamanho máximo: 5MB. Formatos: PNG, JPG, WEBP, GIF. Enviar uma foto desabilitará a análise por nome.</p>
            </div>

            {previewUrl && file && ( // Mostrar preview apenas se um arquivo foi selecionado
              <div className="mt-2 p-3 border rounded-md bg-background">
                <p className="text-sm font-medium mb-2 text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4" />Pré-visualização:</p>
                <NextImage src={previewUrl} alt="Pré-visualização do produto" width={150} height={150} className="rounded-md object-contain max-h-36 w-auto mx-auto shadow-sm" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button type="submit" disabled={isAnalyzing || (!productName.trim() && !file)} className="w-full sm:w-auto" size="lg">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Analisar Produto Agora
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

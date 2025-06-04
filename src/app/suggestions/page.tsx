
"use client";

import { useState } from "react";
import type { Metadata } from "next";
import ProductAnalysisForm from "@/components/features/product-analysis/product-analysis-form";
import ProductAnalysisResults from "@/components/features/product-analysis/product-analysis-results";
import type { AnalyzeProductOutput } from "@/ai/flows/analyze-product-flow";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// Metadata estática não pode ser usada em arquivos com "use client"
// export const metadata: Metadata = {
//   title: "Análise de Produto Detalhada - VerdeAI",
//   description: "Obtenha uma análise completa do impacto ambiental, dicas de ação e alternativas sustentáveis para seus produtos.",
// };

export default function ProductAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeProductOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (result: AnalyzeProductOutput | null) => {
    setAnalysisResult(result);
    setIsLoading(false);
    if (result && !result.identified) {
        // Se a IA explicitamente diz que não identificou, pode ser um tipo de erro/aviso
        // setError("A IA não conseguiu identificar ou analisar o produto fornecido de forma conclusiva.");
    }
  };

  const handleAnalysisError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Análise de Produto Detalhada</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Envie o nome ou a foto de um item e deixe nossa IA fornecer uma análise completa: impacto ambiental, dicas de descarte/reutilização e alternativas sustentáveis.
        </p>
      </header>
      
      <ProductAnalysisForm 
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-10 text-primary">
          <Loader2 className="w-12 h-12 animate-spin mb-3" />
          <p className="text-lg font-medium">Analisando seu produto, por favor aguarde...</p>
          <p className="text-sm text-muted-foreground">Este processo pode levar alguns instantes.</p>
        </div>
      )}

      {error && !isLoading && (
        <Alert variant="destructive" className="max-w-2xl mx-auto shadow mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Oops! Algo deu errado.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && analysisResult && (
        <ProductAnalysisResults analysisResult={analysisResult} />
      )}
       <Card className="mt-10 bg-card border-border shadow-md max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5 text-accent" /> Aviso Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            As pontuações de impacto, dicas e sugestões de alternativas são geradas por Inteligência Artificial e devem ser consideradas como estimativas para fins educacionais e de conscientização. O impacto ambiental real de um item específico e a adequação das alternativas podem variar. Sempre verifique as informações com fontes confiáveis e considere suas necessidades individuais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

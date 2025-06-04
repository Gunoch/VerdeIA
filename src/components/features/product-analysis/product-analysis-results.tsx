
"use client";

import type { AnalyzeProductOutput } from "@/ai/flows/analyze-product-flow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Brain, Droplets, Info, Leaf, Recycle, ShieldCheck, Thermometer } from "lucide-react";
import SustainableSwapsSection from "./sustainable-swaps-section";

interface ProductAnalysisResultsProps {
  analysisResult: AnalyzeProductOutput;
}

export default function ProductAnalysisResults({ analysisResult }: ProductAnalysisResultsProps) {
  const {
    identifiedProductName,
    category,
    carbonFootprint,
    waterUsage,
    sustainabilityScore,
    impactNotes,
    identified,
    ecoActions,
  } = analysisResult;

  if (!identified) {
    return (
      <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-6 h-6" />
            Análise Inconclusiva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/90">
            A IA não conseguiu identificar ou analisar o produto fornecido de forma conclusiva.
            {impactNotes && impactNotes.length > 0 && ` Detalhe: ${impactNotes.join(" ")}`}
          </p>
          <p className="mt-2 text-sm text-destructive/80">
            Por favor, tente fornecer um nome mais específico ou uma imagem mais clara do produto.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Card de Identificação e Impacto */}
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{identifiedProductName}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-md">
            <Brain className="w-5 h-5" /> Categoria estimada pela IA: {category || "Não especificada"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="flex items-center gap-1 font-medium"><Thermometer className="w-4 h-4 text-red-500" />Pegada de Carbono Estimada</span>
              <span className="font-semibold">{carbonFootprint}/100</span>
            </div>
            <Progress value={carbonFootprint} aria-label={`Pegada de carbono ${carbonFootprint}%`} className="h-2.5 [&>div]:bg-red-500" />
            <p className="text-xs text-muted-foreground mt-1">Estimativa do impacto em emissões de carbono (0 = muito baixo, 100 = muito alto).</p>
          </div>
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="flex items-center gap-1 font-medium"><Droplets className="w-4 h-4 text-blue-500" />Uso de Água Estimado</span>
              <span className="font-semibold">{waterUsage}/100</span>
            </div>
            <Progress value={waterUsage} aria-label={`Uso de água ${waterUsage}%`} className="h-2.5 [&>div]:bg-blue-500" />
            <p className="text-xs text-muted-foreground mt-1">Estimativa do consumo de água na produção/vida útil (0 = muito baixo, 100 = muito alto).</p>
          </div>
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-4 h-4 text-primary" />Pontuação de Sustentabilidade Estimada</span>
              <span className="font-semibold">{sustainabilityScore}/100</span>
            </div>
            <Progress value={sustainabilityScore} aria-label={`Pontuação de sustentabilidade ${sustainabilityScore}%`} className="h-2.5 [&>div]:bg-primary" />
            <p className="text-xs text-muted-foreground mt-1">Estimativa geral de sustentabilidade (0 = baixo, 100 = alto/bom).</p>
          </div>
        </CardContent>
        {impactNotes && impactNotes.length > 0 && (
          <CardFooter className="flex-col items-start pt-3 border-t">
            <h4 className="text-sm font-semibold mb-1.5 text-muted-foreground flex items-center gap-1"><Info size={16}/>Considerações de Impacto (estimadas pela IA):</h4>
            <ul className="list-disc list-inside space-y-1 pl-2">
              {impactNotes.map((note, idx) => (
                <li key={idx} className="text-xs text-muted-foreground">{note}</li>
              ))}
            </ul>
          </CardFooter>
        )}
      </Card>

      {/* Card de Ações Ecológicas */}
      {ecoActions && ecoActions.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Recycle className="w-6 h-6 text-primary" />
              Dicas de Ação Ecológica
            </CardTitle>
            <CardDescription>Sugestões da IA para reciclagem, reutilização e descarte consciente do produto.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-foreground">
              {ecoActions.map((action, index) => (
                <li key={index} className="text-sm leading-relaxed">{action}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Seção de Trocas Sustentáveis */}
      {category && (
        <SustainableSwapsSection productCategory={category} originalProductName={identifiedProductName} />
      )}
    </div>
  );
}

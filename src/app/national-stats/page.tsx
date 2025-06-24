
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BarChart3, CloudCog, Droplets, Loader2, Recycle, Trash2, Trees } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Como esta página agora busca dados no lado do cliente, a exportação de metadados estáticos não é ideal.
// A metadata pode ser movida para um layout pai ou gerenciada de outra forma, se necessário.
// import { Metadata } from "next";
// export const metadata: Metadata = { ... };

interface StatData {
  id: string;
  title: string;
  value: string;
  unit: string;
  year: string;
  source: string;
  icon: React.ReactNode;
  imageUrl: string;
  imageHint: string;
  description?: string;
  trend?: "positive" | "negative" | "neutral";
}

const nationalStats: StatData[] = [
  {
    id: "agua",
    title: "Consumo Médio de Água",
    value: "152,1",
    unit: "litros/habitante/dia",
    year: "2022",
    source: "SNIS",
    icon: <Droplets className="w-8 h-8 text-blue-500" />,
    imageUrl: "/images/water-tap.png",
    imageHint: "water tap",
    description: "Refere-se ao volume de água consumido por pessoa em média no país.",
    trend: "neutral",
  },
  {
    id: "residuos",
    title: "Geração de Resíduos Sólidos Urbanos (RSU)",
    value: "224",
    unit: "milhões de toneladas/ano",
    year: "2022",
    source: "Abrelpe",
    icon: <Trash2 className="w-8 h-8 text-orange-500" />,
    imageUrl: "/images/garbage-landfill.png",
    imageHint: "garbage landfill",
    description: "Quantidade total de lixo gerado nas áreas urbanas do Brasil.",
     trend: "negative",
  },
  {
    id: "reciclagem",
    title: "Taxa de Reciclagem de RSU",
    value: "4",
    unit: "% do total coletado",
    year: "2022",
    source: "Abrelpe / SNIS",
    icon: <Recycle className="w-8 h-8 text-green-500" />,
    imageUrl: "/images/recycling-bins.png",
    imageHint: "recycling bins",
    description: "Percentual de resíduos sólidos urbanos que são efetivamente reciclados.",
    trend: "positive",
  },
  {
    id: "desmatamento",
    title: "Desmatamento na Amazônia Legal",
    value: "11.568",
    unit: "km²/ano",
    year: "2022",
    source: "PRODES/INPE",
    icon: <Trees className="w-8 h-8 text-red-600" />,
    imageUrl: "/images/deforestation-aerial.png",
    imageHint: "deforestation aerial",
    description: "Área de floresta desmatada na região da Amazônia Legal brasileira.",
    trend: "negative",
  },
];

export default function NationalStatsPage() {
  const [co2Stat, setCo2Stat] = useState<StatData | null>({
    id: "co2",
    title: "Emissões de CO₂e do Brasil",
    value: "...",
    unit: "kt CO₂e",
    year: "...",
    source: "Climate TRACE",
    icon: <CloudCog className="w-8 h-8 text-gray-500" />,
    imageUrl: "/images/co2-emissions.png",
    imageHint: "co2 emissions",
    description: "Emissões totais de gases de efeito estufa do país, incluindo todos os setores. Dados buscados em tempo real.",
    trend: "neutral",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCO2DataForYear(year: number): Promise<{ status: 'success' | 'nodata' | 'apierror' | 'networkerror', data?: any, message?: string }> {
      const url = `https://api.climatetrace.org/v1/emissions/totals?&countries=BRA&year=${year}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.errors?.[0]?.detail || `A API retornou o status ${response.status}`;
          console.warn(`Falha ao buscar dados para ${year}: ${errorMessage}`);
          return { status: 'apierror', message: `Erro da API para ${year}: ${errorMessage}` };
        }
        const data = await response.json();
        if (data && data.length > 0 && data[0].emissions) {
          return { status: 'success', data: { year: year, emissions: data[0].emissions } };
        } else {
          return { status: 'nodata', message: `Nenhum dado encontrado para ${year}.` };
        }
      } catch (networkError) {
        console.error(`Erro de rede ao buscar dados para ${year}:`, networkError);
        return { status: 'networkerror', message: "Falha de rede ao buscar dados. Verifique sua conexão." };
      }
    }

    async function fetchCO2Data() {
      setIsLoading(true);
      setError(null);
      
      const currentYear = new Date().getFullYear();
      let lastError = "Não foram encontrados dados de emissão de CO₂ recentes para o Brasil via Climate TRACE.";
      
      for (let i = 1; i <= 3; i++) {
        const yearToFetch = currentYear - i;
        const result = await fetchCO2DataForYear(yearToFetch);

        if (result.status === 'success' && result.data) {
          const emissionsInKt = Math.round(Number(result.data.emissions) / 1000);
          setCo2Stat(prev => prev ? {
            ...prev,
            value: emissionsInKt.toLocaleString('pt-BR'),
            year: result.data.year.toString(),
            trend: 'neutral',
          } : null);
          setIsLoading(false);
          return;
        }

        if (result.status === 'apierror' || result.status === 'networkerror') {
          lastError = result.message || lastError;
        }
      }
      
      console.error(lastError);
      setError(lastError);
      setIsLoading(false);
    }

    fetchCO2Data();
  }, []);

  const getTrendColor = (trend?: "positive" | "negative" | "neutral") => {
    if (trend === "positive") return "text-green-600";
    if (trend === "negative") return "text-red-600";
    return "text-muted-foreground";
  };

  const StatCard = ({ stat }: { stat: StatData }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative w-full h-48">
        <Image 
          src={stat.imageUrl} 
          alt={stat.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {stat.icon}
          <CardTitle className="text-xl">{stat.title}</CardTitle>
        </div>
        <CardDescription className="text-sm">{stat.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div>
          <p className="text-3xl font-bold text-primary">{stat.value} <span className="text-xl font-normal text-muted-foreground">{stat.unit}</span></p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            <strong>Ano de Referência:</strong> {stat.year}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Fonte:</strong> {stat.source}
          </p>
        </div>
         {stat.trend && (
           <p className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
             Tendência: {stat.trend === "positive" ? "Melhora" : stat.trend === "negative" ? "Piora" : "Estável/Neutro"}
           </p>
         )}
      </CardContent>
       <CardFooter className="text-xs text-muted-foreground border-t pt-3 mt-auto">
          Nota: Os dados podem ter pequenas variações dependendo da metodologia e data de consolidação da fonte.
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Estatísticas Ambientais Nacionais</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Panorama de dados importantes sobre o meio ambiente no Brasil. As informações são baseadas nos relatórios mais recentes de fontes oficiais.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {co2Stat && (
          isLoading ? (
            <Card className="overflow-hidden flex flex-col items-center justify-center p-6 min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <CardTitle className="text-xl text-primary">Carregando Dados de CO₂e...</CardTitle>
              <CardDescription>Buscando as informações mais recentes.</CardDescription>
            </Card>
          ) : error ? (
            <Alert variant="destructive" className="md:col-span-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar Dados de CO₂e</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <StatCard stat={co2Stat} />
          )
        )}
        {nationalStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <Card className="mt-8 bg-card border-border shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><AlertCircle className="w-5 h-5 text-accent" /> Aviso Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            As estatísticas apresentadas nesta página são coletadas de fontes oficiais e relatórios públicos. Os dados de emissão de CO₂e são buscados em tempo real de APIs públicas e podem não refletir os dados consolidados mais recentes. O objetivo é fornecer um panorama educativo sobre questões ambientais no Brasil. Para dados detalhados, consulte diretamente as fontes mencionadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

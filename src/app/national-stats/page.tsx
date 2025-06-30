
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CloudCog, Droplets, Recycle, Trash2, Trees } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estatísticas Ambientais - VerdeAI",
  description: "Panorama de dados importantes sobre o meio ambiente no Brasil, baseados em fontes oficiais.",
};


interface StatData {
  id: string;
  title: string;
  value: string;
  unit: string;
  year: string;
  source: string;
  icon: React.ReactNode;
  description?: string;
  trend?: "positive" | "negative" | "neutral";
}

// Dados estáticos, incluindo o de CO2, para evitar dependência de API.
const nationalStats: StatData[] = [
  {
    id: "co2",
    title: "Emissões de GEE do Brasil",
    value: "1.870.000",
    unit: "kt CO₂e",
    year: "2022",
    source: "Climate TRACE",
    icon: <CloudCog className="w-8 h-8 text-gray-500" />,
    description: "Emissões totais de gases de efeito estufa (GEE) do país, incluindo todos os setores.",
    trend: "negative",
  },
  {
    id: "agua",
    title: "Consumo Médio de Água",
    value: "152,1",
    unit: "litros/habitante/dia",
    year: "2022",
    source: "SNIS",
    icon: <Droplets className="w-8 h-8 text-blue-500" />,
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
    description: "Área de floresta desmatada na região da Amazônia Legal brasileira.",
    trend: "negative",
  },
];


const getTrendColor = (trend?: "positive" | "negative" | "neutral") => {
    if (trend === "positive") return "text-green-600";
    if (trend === "negative") return "text-red-600";
    return "text-muted-foreground";
};

const StatCard = ({ stat }: { stat: StatData }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
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

export default function NationalStatsPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Estatísticas Ambientais Nacionais</h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
          Panorama de dados importantes sobre o meio ambiente no Brasil. As informações são baseadas nos relatórios mais recentes de fontes oficiais.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
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
            As estatísticas apresentadas nesta página são coletadas de fontes oficiais e relatórios públicos. O objetivo é fornecer um panorama educativo sobre questões ambientais no Brasil. Para dados detalhados e atualizados, consulte diretamente as fontes mencionadas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

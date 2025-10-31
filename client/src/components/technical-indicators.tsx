import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Indicators } from "@shared/schema";

interface TechnicalIndicatorsProps {
  indicators?: Indicators;
  symbol?: string;
  isLoading?: boolean;
}

export function TechnicalIndicators({ indicators, symbol, isLoading }: TechnicalIndicatorsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!indicators) {
    return null;
  }

  const indicatorsList = [
    { label: "RSI", value: indicators.rsi.toFixed(2), description: "Relative Strength Index" },
    { label: "SMA 20", value: `$${indicators.sma20.toFixed(2)}`, description: "20-day Simple Moving Avg" },
    { label: "SMA 50", value: `$${indicators.sma50.toFixed(2)}`, description: "50-day Simple Moving Avg" },
    { label: "BB Upper", value: `$${indicators.bollingerUpper.toFixed(2)}`, description: "Bollinger Band Upper" },
    { label: "BB Middle", value: `$${indicators.bollingerMiddle.toFixed(2)}`, description: "Bollinger Band Middle" },
    { label: "BB Lower", value: `$${indicators.bollingerLower.toFixed(2)}`, description: "Bollinger Band Lower" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Indicators {symbol && `- ${symbol}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {indicatorsList.map((indicator) => (
            <div key={indicator.label} className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-1">{indicator.label}</div>
              <div className="text-lg font-bold font-mono">{indicator.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{indicator.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
